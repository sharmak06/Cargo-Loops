import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Building2, PackagePlus, Star, Truck, Wallet } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { Stars, VerifiedBadge } from "@/components/brand";
import { StatCard } from "@/components/stat-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { inr, transporters, vehicleTypes, type Shipment } from "@/lib/mock-data";
import { useSession } from "@/lib/session";

export const Route = createFileRoute("/business")({
  head: () => ({
    meta: [
      { title: "Business Dashboard — Post Shipments on CargoLoop" },
      {
        name: "description",
        content:
          "Post a shipment and get recommended GST-verified transporters with live prices, capacity, ratings and truck details on your lane.",
      },
      { property: "og:title", content: "Business Dashboard — CargoLoop" },
      {
        property: "og:description",
        content: "Post cargo and book verified return-trip trucks at backhaul rates.",
      },
    ],
  }),
  component: BusinessDashboard,
});

function BusinessDashboard() {
  const { postShipment, postedShipments, createBooking, bookings, demo, user } = useSession();
  const navigate = useNavigate();
  const [lastPosted, setLastPosted] = useState<Shipment | null>(null);
  useEffect(() => {
    if (user && user.role !== "business") {
      navigate({ to: user.role === "transporter" ? "/transporter" : "/admin", replace: true });
    }
  }, [user, navigate]);
  const partners = demo ? transporters : [];
  const openCount = postedShipments.length + (demo ? 3 : 0);

  return (
    <AppShell
      title="Business Dashboard"
      subtitle={
        demo
          ? "Demo data · ABC Manufacturing Pvt Ltd · Mumbai, Maharashtra"
          : `${user?.company ?? "Your company"}${user?.verified ? " · GST Verified" : ""}`
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Open Shipments" value={String(openCount)} hint="Awaiting match" icon={PackagePlus} />
        <StatCard
          label="Verified Transporters"
          value={demo ? "38" : String(partners.length)}
          hint="On your lanes"
          icon={Truck}
        />
        <StatCard
          label="Avg. Saving"
          value={demo ? "22%" : "—"}
          hint="vs spot market rates"
          icon={Wallet}
          accent
        />
        <StatCard
          label="Shipments Booked"
          value={demo ? "4.8" : String(bookings.length)}
          hint={demo ? "Supplier rating from 412 shipments" : "Confirmed bookings"}
          icon={Star}
        />
      </div>


      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-base">Post a shipment</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              className="grid gap-4 sm:grid-cols-2"
              onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                const shipment: Shipment = {
                  id: `SHP-${Math.floor(Math.random() * 9000 + 1000)}`,
                  pickup: String(fd.get("pickup") ?? "Mumbai, MH"),
                  delivery: String(fd.get("delivery") ?? "Pune, MH"),
                  cargoType: String(fd.get("cargo") ?? "General"),
                  weightTons: Number(fd.get("weight") ?? 2),
                  packages: Number(fd.get("packages") ?? 10),
                  vehicleType: String(fd.get("vehicle") ?? vehicleTypes[0]),
                  pickupAt: String(fd.get("pickupAt") ?? "Today, 6:00 PM"),
                  deadline: String(fd.get("deadline") ?? "Tomorrow, 10:00 AM"),
                  budget: Number(fd.get("budget") ?? 4500),
                  business: user?.company ?? "ABC Manufacturing",
                  gstVerified: true,
                  rating: 4.8,
                  matchScore: 93,
                  distanceToPickupKm: 8,
                  status: "Open",
                };
                postShipment(shipment);
                setLastPosted(shipment);
                toast.success("Shipment posted", {
                  description: "3 verified transporters with return capacity matched instantly.",
                });
              }}
            >
              <div className="space-y-1.5">
                <Label htmlFor="pickup">Pickup Location</Label>
                <Input id="pickup" name="pickup" placeholder="Andheri East, Mumbai" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="delivery">Delivery Location</Label>
                <Input id="delivery" name="delivery" placeholder="Chakan, Pune" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="cargo">Cargo Type</Label>
                <Input id="cargo" name="cargo" placeholder="Machine Parts" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="weight">Weight (tons)</Label>
                <Input id="weight" name="weight" type="number" step="0.1" placeholder="2" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="packages">No. of Packages</Label>
                <Input id="packages" name="packages" type="number" placeholder="14" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="vehicle">Vehicle Type</Label>
                <select
                  id="vehicle"
                  name="vehicle"
                  className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
                >
                  {vehicleTypes.map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="pickupAt">Pickup Date & Time</Label>
                <Input id="pickupAt" name="pickupAt" type="datetime-local" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="deadline">Delivery Deadline</Label>
                <Input id="deadline" name="deadline" type="datetime-local" />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="budget">Budget (₹)</Label>
                <Input id="budget" name="budget" type="number" placeholder="4500" />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="notes">Handling Notes</Label>
                <Textarea id="notes" name="notes" placeholder="Forklift available at dock till 8 PM" />
              </div>
              <Button type="submit" className="sm:col-span-2">
                Post Shipment
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="shadow-soft h-fit">
          <CardHeader>
            <CardTitle className="text-base">Recommended verified transporters</CardTitle>
            <p className="text-xs text-muted-foreground">
              {lastPosted
                ? `For ${lastPosted.pickup} → ${lastPosted.delivery} · ${lastPosted.weightTons} T`
                : "Based on your usual Mumbai → Pune lane"}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {transporters.map((t) => (
              <div key={t.id} className="rounded-xl border border-border p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold">{t.company}</p>
                    <p className="text-xs text-muted-foreground">
                      {t.city} · Fleet {t.fleetSize} · {t.deliveries} deliveries
                    </p>
                  </div>
                  <p className="font-display text-xl font-bold">{inr(t.priceQuote)}</p>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {t.verified ? <VerifiedBadge /> : null}
                  {t.trusted ? <Badge variant="secondary">Trusted Partner</Badge> : null}
                  <Stars value={t.rating} />
                  <Badge variant="outline">{t.capacityTons} T free</Badge>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Trucks: {t.vehicleTypes.join(", ")}
                </p>
                <Button
                  className="mt-3 w-full"
                  variant="outline"
                  onClick={() => {
                    const shipment: Shipment =
                      lastPosted ?? {
                        id: `SHP-${Math.floor(Math.random() * 9000 + 1000)}`,
                        pickup: "Mumbai, MH",
                        delivery: "Pune, MH",
                        cargoType: "Machine Parts",
                        weightTons: 2,
                        packages: 14,
                        vehicleType: "32ft Multi-Axle",
                        pickupAt: "Today, 6:00 PM",
                        deadline: "Tomorrow, 10:00 AM",
                        budget: t.priceQuote,
                        business: user?.company ?? "ABC Manufacturing",
                        gstVerified: true,
                        rating: 4.8,
                        matchScore: 96,
                        distanceToPickupKm: 6,
                        status: "Open",
                      };
                    createBooking({
                      id: `BKG-${shipment.id.replace("SHP-", "")}`,
                      shipment,
                      transporter: t.company,
                      truck: "MH12 AB 4521 · 32ft Multi-Axle",
                      driver: "Ramesh Pawar",
                      driverMobile: "+91 98XXXXXX21",
                      amount: t.priceQuote,
                      etaMinutes: 195,
                    });
                    toast.success("Booking confirmed", { description: `${t.company} assigned.` });
                    navigate({ to: "/tracking" });
                  }}
                >
                  Book this transporter
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {postedShipments.length ? (
        <Card className="shadow-soft mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Building2 className="size-4 text-accent" /> Your posted shipments
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {postedShipments.map((s) => (
              <div
                key={s.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border p-3 text-sm"
              >
                <span className="font-semibold">
                  {s.id} · {s.pickup} → {s.delivery}
                </span>
                <span className="text-muted-foreground">
                  {s.cargoType} · {s.weightTons} T · {inr(s.budget)}
                </span>
                <Badge variant="secondary">{s.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}
    </AppShell>
  );
}
