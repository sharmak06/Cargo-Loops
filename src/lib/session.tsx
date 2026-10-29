import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { trucks as seedTrucks, type Role, type Shipment, type Truck } from "./mock-data";

export type SessionUser = {
  id?: string;
  name: string;
  company: string;
  role: Role;
  isDemo?: boolean;
  gst: string;
  pan: string;
  verified: boolean;
  city?: string;
  mobile?: string;
  email?: string;
};

export type Booking = {
  id: string;
  shipment: Shipment;
  transporter: string;
  truck: string;
  driver: string;
  driverMobile: string;
  amount: number;
  stageIndex: number;
  podUploaded: boolean;
  paymentReleased: boolean;
  etaMinutes: number;
  createdAt: string;
};

export type BankDetails = {
  accountHolder: string;
  bankName: string;
  /** State and branch city of the bank account */
  bankState: string;
  branchCity: string;
  accountNumber: string;
  ifsc: string;
  upi?: string;
};

type Ctx = {
  user: SessionUser | null;
  /** true when nobody is signed in — the public demo dashboard with sample data */
  demo: boolean;
  signIn: (user: SessionUser) => void;
  signOut: () => void;
  fleet: Truck[];
  addTruck: (truck: Truck) => void;
  bookings: Booking[];
  createBooking: (
    b: Omit<Booking, "stageIndex" | "podUploaded" | "paymentReleased" | "createdAt">,
  ) => Booking;
  advanceBooking: (id: string) => void;
  uploadPod: (id: string) => void;
  releasePayment: (id: string) => void;
  postedShipments: Shipment[];
  postShipment: (s: Shipment) => void;
  bank: BankDetails | null;
  saveBank: (b: BankDetails) => void;
};

const SessionContext = createContext<Ctx | null>(null);
const KEY = "cargoloop.session.v1";

type StoredData = {
  user?: SessionUser;
  fleet?: Truck[];
  bookings?: Booking[];
  postedShipments?: Shipment[];
  bank?: BankDetails | null;
};

function readStored(key: string): StoredData | null {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as StoredData) : null;
  } catch {
    return null;
  }
}

function accountKey(userId: string) {
  return `${KEY}.${userId}`;
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [fleet, setFleet] = useState<Truck[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [postedShipments, setPostedShipments] = useState<Shipment[]>([]);
  const [bank, setBank] = useState<BankDetails | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let active = true;
    const legacy = readStored(KEY);
    const hasSupabaseConfig = Boolean(
      import.meta.env["VITE_SUPABASE_URL"] && import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"],
    );

    function applyStoredData(stored: StoredData | null) {
      setFleet(stored?.fleet ?? []);
      setBookings(stored?.bookings ?? []);
      setPostedShipments(stored?.postedShipments ?? []);
      setBank(stored?.bank ?? null);
    }

    async function restoreAccount() {
      const { data } = await supabase.auth.getSession();
      if (!active) return;

      if (!data.session?.user) {
        setReady(true);
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("name, company, role, city, mobile, email")
        .eq("user_id", data.session.user.id)
        .maybeSingle();

      if (!active) return;
      if (profile) {
        const userId = data.session.user.id;
        const restoredUser: SessionUser = {
          id: userId,
          name: profile.name,
          company: profile.company,
          role: profile.role as Role,
          gst: "",
          pan: "",
          verified: true,
          city: profile.city ?? "",
          mobile: profile.mobile ?? "",
          email: profile.email ?? data.session.user.email ?? "",
        };
        setUser(restoredUser);

        const saved = readStored(accountKey(userId));
        const isLegacyAccount = legacy?.user?.email === restoredUser.email;
        applyStoredData(saved ?? (isLegacyAccount ? legacy : null));
      }
      setReady(true);
    }

    if (!hasSupabaseConfig) {
      setReady(true);
      return () => {
        active = false;
      };
    }

    void restoreAccount();

    const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT" && active) {
        setUser(null);
        applyStoredData(null);
      }
    });

    return () => {
      active = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!ready || !user?.id) return;
    try {
      window.localStorage.setItem(
        accountKey(user.id),
        JSON.stringify({ fleet, bookings, postedShipments, bank }),
      );
    } catch {
      /* storage unavailable */
    }
  }, [ready, user?.id, fleet, bookings, postedShipments, bank]);
  const createBooking: Ctx["createBooking"] = useCallback((b) => {
    const booking: Booking = {
      ...b,
      stageIndex: 0,
      podUploaded: false,
      paymentReleased: false,
      createdAt: new Date().toISOString(),
    };
    setBookings((prev) => [booking, ...prev.filter((p) => p.id !== booking.id)]);
    return booking;
  }, []);

  const demo = user === null || user.isDemo === true;

  const value = useMemo<Ctx>(
    () => ({
      user,
      demo,
      signIn: (u) => {
        const saved = u.id ? readStored(accountKey(u.id)) : null;
        setFleet(saved?.fleet ?? []);
        setBookings(saved?.bookings ?? []);
        setPostedShipments(saved?.postedShipments ?? []);
        setBank(saved?.bank ?? null);
        setUser(u);
      },
      signOut: () => {
        if (!user?.isDemo) void supabase.auth.signOut();
        setFleet([]);
        setBookings([]);
        setPostedShipments([]);
        setBank(null);
        setUser(null);
      },
      fleet: demo ? [...fleet, ...seedTrucks] : fleet,
      addTruck: (truck) => setFleet((prev) => [truck, ...prev]),
      bookings,
      createBooking,
      advanceBooking: (id) =>
        setBookings((prev) =>
          prev.map((b) => (b.id === id ? { ...b, stageIndex: Math.min(b.stageIndex + 1, 3) } : b)),
        ),
      uploadPod: (id) =>
        setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, podUploaded: true } : b))),
      releasePayment: (id) =>
        setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, paymentReleased: true } : b))),
      postedShipments,
      postShipment: (s) => setPostedShipments((prev) => [s, ...prev]),
      bank,
      saveBank: (b) => setBank(b),
    }),
    [user, demo, fleet, bookings, postedShipments, createBooking, bank],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used inside SessionProvider");
  return ctx;
}
