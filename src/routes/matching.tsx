import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Clock, MapPin, Package, Sparkles, Truck } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { MatchScore, Stars, VerifiedBadge } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { inr, openLoads, type Shipment } from "@/lib/mock-data";
import { citiesForState, indiaStates, locationMatches } from "@/lib/india-locations";
import { useSession } from "@/lib/session";


export const Route = createFileRoute("/matching")({
  head: () => ({
    meta: [
      { title: "Smart Backhaul Matching — CargoLoop" },
      {
        name: "description",
        content:
          "Match spare return capacity with verified business loads scored on route, capacity, timing, vehicle type, pickup distance and business reliability.",
      },
      { property: "og:title", content: "Smart Backhaul Matching — CargoLoop" },
      {
        property: "og:description",
        content: "Every load scored 0–100% against your truck's return leg.",
      },
    ],
  }),
  component: MatchingPage,
});

const factors = [
  { key: "Route overlap", value: 98 },
  { key: "Capacity fit", value: 94 },
  { key: "Time window", value: 96 },
  { key: "Vehicle type", value: 100 },
  { key: "Pickup distance", value: 92 },
  { key: "Business reliability", value: 97 },
];

function MatchingPage() {
  const { fleet, createBooking, postedShipments, user } = useSession();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Shipment | null>(null);
  const [fromState, setFromState] = useState("all");
  const [from, setFrom] = useState("all");
  const [toState, setToState] = useState("all");
  const [to, setTo] = useState("all");

  const allLoads = useMemo(
    () => [...postedShipments, ...openLoads].sort((a, b) => b.matchScore - a.matchScore),
    [postedShipments],
  );

  const fromCities = useMemo(() => citiesForState(fromState), [fromState]);
  const toCities = useMemo(() => citiesForState(toState), [toState]);

  const loads = useMemo(
    () =>
      allLoads.filter(
        (l) =>
          locationMatches(l.pickup, fromState, from) && locationMatches(l.delivery, toState, to),
      ),
    [allLoads, fromState, from, toState, to],
  );

  function accept(load: Shipment) {
    const truck = fleet[0];
    const booking = createBooking({
      id: `BKG-${load.id.replace("SHP-", "")}`,
      shipment: load,
      transporter: "Shivneri Roadlines Pvt Ltd",
      truck: truck ? `${truck.regNumber} · ${truck.vehicleType}` : "MH12 AB 4521 · 32ft Multi-Axle",
      driver: truck?.driverName ?? "Ramesh Pawar",
      driverMobile: truck?.driverMobile ?? "+91 98XXXXXX21",
      amount: load.budget,
      etaMinutes: 195,
    });
    setSelected(null);
    toast.success(`Load accepted — ${inr(load.budget)} additional revenue`, {
      description: `Booking ${booking.id} created for ${load.pickup} → ${load.delivery}`,
    });
    navigate({ to: "/tracking" });
  }

  const selectClass =
    "mt-1.5 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm";

  return (
    <AppShell
      title="Smart Matching"
      subtitle={
        user
          ? `${user.name} · pick your route to see matching loads`
          : "Return leg: Mumbai → Pune · 5 Tons free · Truck MH12 AB 4521 · Free today 4:30 PM"
      }
    >
      <Card className="shadow-soft mb-6">
        <CardContent className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground" htmlFor="from-state">
              From state
            </label>
            <select
              id="from-state"
              value={fromState}
              onChange={(e) => {
                setFromState(e.target.value);
                setFrom("all");
              }}
              className={selectClass}
            >
              <option value="all">Any state</option>
              {indiaStates.map((s) => (
                <option key={s.code} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground" htmlFor="from-city">
              From city
            </label>
            <select
              id="from-city"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              disabled={fromState === "all"}
              className={`${selectClass} disabled:opacity-60`}
            >
              <option value="all">
                {fromState === "all" ? "Select a state first" : "Any city"}
              </option>
              {fromCities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground" htmlFor="to-state">
              To state
            </label>
            <select
              id="to-state"
              value={toState}
              onChange={(e) => {
                setToState(e.target.value);
                setTo("all");
              }}
              className={selectClass}
            >
              <option value="all">Any state</option>
              {indiaStates.map((s) => (
                <option key={s.code} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground" htmlFor="to-city">
              To city
            </label>
            <select
              id="to-city"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              disabled={toState === "all"}
              className={`${selectClass} disabled:opacity-60`}
            >
              <option value="all">{toState === "all" ? "Select a state first" : "Any city"}</option>
              {toCities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-4 sm:col-span-2 lg:col-span-4">
            <Button
              variant="outline"
              onClick={() => {
                setFromState("all");
                setFrom("all");
                setToState("all");
                setTo("all");
              }}
            >
              Reset
            </Button>
            <p className="text-sm text-muted-foreground">
              {loads.length} matching load{loads.length === 1 ? "" : "s"}
            </p>
          </div>
        </CardContent>
      </Card>


      <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
        <div className="space-y-4">
          {loads.length === 0 ? (
            <Card className="shadow-soft">
              <CardContent className="p-8 text-center text-sm text-muted-foreground">
                No loads on {from === "all" ? "any city" : from} →{" "}
                {to === "all" ? "any city" : to} right now. Try a different route.
              </CardContent>
            </Card>
          ) : null}
          {loads.map((load) => (
            <Card key={load.id} className="shadow-soft overflow-hidden">
              <CardContent className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-display text-lg font-bold">
                        {load.pickup} → {load.delivery}
                      </p>
                      <MatchScore score={load.matchScore} />
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {load.cargoType} · {load.weightTons} Tons · {load.packages} packages ·{" "}
                      {load.vehicleType}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-2xl font-bold text-success">
                      {inr(load.budget)}
                    </p>
                    <p className="text-xs text-muted-foreground">Offered freight</p>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-4">
                  {[
                    [MapPin, "Pickup distance", `${load.distanceToPickupKm} km away`],
                    [Clock, "Pickup window", load.pickupAt],
                    [Package, "Deadline", load.deadline],
                    [Truck, "Vehicle", load.vehicleType],
                  ].map(([Icon, label, value]) => {
                    const I = Icon as typeof MapPin;
                    return (
                      <div key={label as string} className="rounded-lg bg-secondary/60 p-3">
                        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <I className="size-3.5" /> {label as string}
                        </p>
                        <p className="mt-1 text-sm font-semibold">{value as string}</p>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
                  <div className="flex flex-wrap items-center gap-2 text-sm font-medium">
                    {load.business}
                    {load.gstVerified ? <VerifiedBadge /> : <Badge variant="outline">GST pending</Badge>}
                    <Stars value={load.rating} />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setSelected(load)}>
                      View
                    </Button>
                    <Button
                      size="sm"
                      className="bg-accent-gradient text-accent-foreground hover:opacity-90"
                      onClick={() => accept(load)}
                    >
                      Accept Load
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="shadow-soft h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Sparkles className="size-4 text-accent" /> How the 96% is calculated
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {factors.map((f) => (
              <div key={f.key}>
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-muted-foreground">{f.key}</span>
                  <span>{f.value}%</span>
                </div>
                <Progress value={f.value} className="mt-1.5 h-1.5" />
              </div>
            ))}
            <p className="text-xs text-muted-foreground">
              Loads are only surfaced for capacity left over after your existing commitments are
              scheduled.
            </p>
          </CardContent>
        </Card>
      </div>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {selected ? `${selected.pickup} → ${selected.delivery}` : "Load"}
            </DialogTitle>
          </DialogHeader>
          {selected ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  ["Shipment ID", selected.id],
                  ["Cargo", selected.cargoType],
                  ["Weight", `${selected.weightTons} Tons`],
                  ["Packages", String(selected.packages)],
                  ["Pickup", selected.pickupAt],
                  ["Deadline", selected.deadline],
                  ["Budget", inr(selected.budget)],
                  ["Business", selected.business],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-lg bg-secondary/60 p-3">
                    <p className="text-xs text-muted-foreground">{k}</p>
                    <p className="font-semibold">{v}</p>
                  </div>
                ))}
              </div>
              <Button className="w-full" onClick={() => accept(selected)}>
                Accept Load · {inr(selected.budget)}
              </Button>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
