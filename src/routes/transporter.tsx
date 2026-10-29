import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Activity,
  BadgeIndianRupee,
  Boxes,
  Gauge,
  Leaf,
  Plus,
  Sparkles,
  Truck,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { StatCard } from "@/components/stat-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { inr, predictions, revenueTrend, vehicleTypes } from "@/lib/mock-data";
import { useSession } from "@/lib/session";

export const Route = createFileRoute("/transporter")({
  head: () => ({
    meta: [
      { title: "Transporter Dashboard — CargoLoop" },
      {
        name: "description",
        content:
          "Track fleet utilisation, active trips, available return capacity and AI empty-return predictions for every lane you run.",
      },
      { property: "og:title", content: "Transporter Dashboard — CargoLoop" },
      {
        property: "og:description",
        content: "Fleet, backhaul revenue and empty-return prediction in one view.",
      },
    ],
  }),
  component: TransporterDashboard,
});

function TransporterDashboard() {
  const { fleet, addTruck, bookings, demo, user } = useSession();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (user && user.role !== "transporter") {
      navigate({ to: user.role === "business" ? "/business" : "/admin", replace: true });
    }
  }, [user, navigate]);
  const livePredictions = demo ? predictions : [];
  const backhaulRevenue = (demo ? 191000 : 0) + bookings.reduce((s, b) => s + b.amount, 0);
  const returnCapacity = livePredictions.reduce((s, p) => s + p.capacityTons, 0);
  const emptyTripsPrevented = demo ? 128 : bookings.length;
  const chartData = demo
    ? revenueTrend
    : bookings
        .slice()
        .reverse()
        .map((b, i) => ({ month: `Trip ${i + 1}`, base: 0, backhaul: b.amount }));

  return (
    <AppShell
      title="Transporter Dashboard"
      subtitle={
        demo
          ? "Demo data · Shivneri Roadlines Pvt Ltd · Pune, Maharashtra"
          : `${user?.company ?? "Your company"}${user?.verified ? " · GST Verified" : ""}`
      }
      actions={

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="size-4" /> Add Truck
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Add a truck to your fleet</DialogTitle>
            </DialogHeader>
            <form
              className="grid gap-4 sm:grid-cols-2"
              onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                addTruck({
                  id: `TRK-${Math.floor(Math.random() * 900 + 100)}`,
                  regNumber: String(fd.get("reg") ?? "MH00 XX 0000"),
                  vehicleType: String(fd.get("type") ?? vehicleTypes[0]),
                  capacityTons: Number(fd.get("capacity") ?? 5),
                  currentLocation: String(fd.get("location") ?? "Pune, MH"),
                  driverName: String(fd.get("driver") ?? "Driver"),
                  driverMobile: String(fd.get("mobile") ?? "+91 90XXXXXX00"),
                  docs: { rc: true, insurance: true, puc: true },
                  status: "Idle",
                });
                setOpen(false);
                toast.success("Truck added", { description: "Documents sent for verification." });
              }}
            >
              <div className="space-y-1.5">
                <Label htmlFor="reg">Registration Number</Label>
                <Input id="reg" name="reg" placeholder="MH12 AB 4521" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="type">Vehicle Type</Label>
                <select
                  id="type"
                  name="type"
                  className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
                >
                  {vehicleTypes.map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="capacity">Capacity (tons)</Label>
                <Input id="capacity" name="capacity" type="number" step="0.5" placeholder="15" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="location">Current Location</Label>
                <Input id="location" name="location" placeholder="Pune, MH" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="driver">Driver Name</Label>
                <Input id="driver" name="driver" placeholder="Ramesh Pawar" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="mobile">Driver Mobile</Label>
                <Input id="mobile" name="mobile" placeholder="+91 98XXXXXX21" />
              </div>
              <div className="grid gap-2 sm:col-span-2 sm:grid-cols-3">
                {["RC Document", "Insurance", "PUC"].map((d) => (
                  <label
                    key={d}
                    className="cursor-pointer rounded-lg border border-dashed border-border bg-secondary/40 p-3 text-center text-xs font-semibold"
                  >
                    Upload {d}
                    <input type="file" className="hidden" />
                  </label>
                ))}
              </div>
              <DialogFooter className="sm:col-span-2">
                <Button type="submit" className="w-full">
                  Save truck
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Fleet" value={String(fleet.length)} hint="Registered vehicles" icon={Truck} />
        <StatCard
          label="Active Trips"
          value={String(fleet.filter((f) => f.status === "On Trip").length + bookings.length)}
          hint="Running right now"
          icon={Activity}
        />
        <StatCard
          label="Available Return Capacity"
          value={`${returnCapacity} T`}
          hint={`Across ${livePredictions.length} predicted return legs`}
          icon={Boxes}
        />
        <StatCard
          label="Additional Revenue"
          value={inr(backhaulRevenue)}
          hint="From backhauls this month"
          icon={BadgeIndianRupee}
          accent
        />
        <StatCard
          label="Empty Trips Prevented"
          value={String(emptyTripsPrevented)}
          hint={demo ? "≈ 41 T CO₂ saved" : "Backhauls you accepted"}
          icon={Leaf}
        />

      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <Card className="shadow-soft">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <Sparkles className="size-4 text-accent" /> AI Empty Return Prediction
            </CardTitle>
            <Badge variant="secondary">Updated 6 min ago</Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            {livePredictions.length === 0 ? (
              <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                No predictions yet. Add your trucks and complete a few trips — return-leg
                predictions for your own lanes will appear here.
              </p>
            ) : null}
            {livePredictions.map((p) => (
              <div
                key={p.id}
                className="rounded-xl border border-border p-4 transition-shadow hover:shadow-soft"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-display text-lg font-bold">{p.outbound}</p>
                    <p className="text-sm text-muted-foreground">
                      Return: {p.returnLeg} · Capacity: {p.capacityTons} Tons · Free {p.freeFrom}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      Empty Probability
                    </p>
                    <p className="font-display text-2xl font-bold text-accent">
                      {p.emptyProbability}%
                    </p>
                  </div>
                </div>
                <Progress value={p.emptyProbability} className="mt-3 h-2" />
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Truck {p.truckId}</span>
                  <Button
                    size="sm"
                    onClick={() => navigate({ to: "/matching" })}
                    className="bg-accent-gradient text-accent-foreground hover:opacity-90"
                  >
                    Find Backhaul
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Gauge className="size-4 text-accent" /> Revenue split (base vs backhaul)
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[320px]">
            {chartData.length === 0 ? (
              <p className="grid h-full place-items-center text-center text-sm text-muted-foreground">
                Your earnings chart builds up as you accept backhauls.
              </p>
            ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ left: -14, right: 6, top: 6 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                  tickFormatter={(v: number) => `${Math.round(v / 1000)}k`}
                />
                <Tooltip formatter={(v: number) => inr(v)} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="base"
                  name="Existing business"
                  stroke="var(--color-chart-1)"
                  fill="var(--color-chart-1)"
                  fillOpacity={0.18}
                />
                <Area
                  type="monotone"
                  dataKey="backhaul"
                  name="CargoLoop backhaul"
                  stroke="var(--color-chart-2)"
                  fill="var(--color-chart-2)"
                  fillOpacity={0.4}
                />
              </AreaChart>
            </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-soft mt-6">
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="text-base">Fleet</CardTitle>
          <Button variant="outline" size="sm" asChild>
            <Link to="/matching">Open Smart Matching</Link>
          </Button>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="pb-2">Vehicle</th>
                <th className="pb-2">Type</th>
                <th className="pb-2">Capacity</th>
                <th className="pb-2">Location</th>
                <th className="pb-2">Driver</th>
                <th className="pb-2">Docs</th>
                <th className="pb-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {fleet.map((t) => (
                <tr key={t.id} className="border-b border-border/60 last:border-0">
                  <td className="py-3 font-semibold">{t.regNumber}</td>
                  <td>{t.vehicleType}</td>
                  <td>{t.capacityTons} T</td>
                  <td>{t.currentLocation}</td>
                  <td>
                    {t.driverName}
                    <span className="block text-xs text-muted-foreground">{t.driverMobile}</span>
                  </td>
                  <td>
                    <div className="flex gap-1">
                      {(["rc", "insurance", "puc"] as const).map((d) => (
                        <Badge
                          key={d}
                          variant={t.docs[d] ? "secondary" : "destructive"}
                          className="uppercase"
                        >
                          {d}
                        </Badge>
                      ))}
                    </div>
                  </td>
                  <td>
                    <Badge variant={t.status === "On Trip" ? "default" : "outline"}>
                      {t.status}
                    </Badge>
                  </td>
                </tr>
              ))}
              {fleet.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-sm text-muted-foreground">
                    No trucks yet — use “Add Truck” to register your first vehicle.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </AppShell>
  );
}
