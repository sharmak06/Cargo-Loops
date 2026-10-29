import { createFileRoute } from "@tanstack/react-router";
import { Building2, Handshake, IndianRupee, Leaf, Package, Truck, Users } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AppShell } from "@/components/app-shell";
import { StatCard } from "@/components/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { lanesSplit, revenueTrend, utilisationTrend } from "@/lib/mock-data";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Platform Admin — CargoLoop Network Metrics" },
      {
        name: "description",
        content:
          "Network-wide view of users, trucks, active shipments, successful matches, empty trips prevented, revenue and estimated CO₂ saved.",
      },
      { property: "og:title", content: "Platform Admin — CargoLoop" },
      {
        property: "og:description",
        content: "Marketplace health, lane mix and sustainability impact at a glance.",
      },
    ],
  }),
  component: AdminDashboard,
});

const chartColors = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
];

function AdminDashboard() {
  return (
    <AppShell title="Admin Dashboard" subtitle="CargoLoop network health · All India · August 2026">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Total Users" value="7,412" hint="+412 this month" icon={Users} />
        <StatCard label="Transporters" value="2,168" hint="1,904 GST verified" icon={Truck} />
        <StatCard label="Businesses" value="5,244" hint="4,806 GST verified" icon={Building2} />
        <StatCard label="Trucks Onboarded" value="11,930" hint="Across 26 states" icon={Truck} />
        <StatCard label="Active Shipments" value="638" hint="In transit right now" icon={Package} />
        <StatCard label="Successful Matches" value="42,517" hint="Lifetime backhauls" icon={Handshake} />
        <StatCard label="Empty Trips Prevented" value="31,406" hint="Return legs monetized" icon={Leaf} />
        <StatCard label="Platform Revenue" value="₹1.94 Cr" hint="Commission, FY26" icon={IndianRupee} accent />
        <StatCard label="Estimated CO₂ Saved" value="842 T" hint="≈ 38,000 trees / year" icon={Leaf} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-base">Backhaul GMV by month</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueTrend} margin={{ left: -12, right: 6, top: 6 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                  tickFormatter={(v: number) => `${Math.round(v / 1000)}k`}
                />
                <Tooltip formatter={(v: number) => `₹${v.toLocaleString("en-IN")}`} />
                <Bar dataKey="backhaul" name="Backhaul GMV" fill="var(--color-chart-2)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-base">Fleet utilisation (%)</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={utilisationTrend} margin={{ left: -18, right: 6, top: 6 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis domain={[50, 100]} stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip formatter={(v: number) => `${v}%`} />
                <Line
                  type="monotone"
                  dataKey="utilisation"
                  stroke="var(--color-chart-1)"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-soft lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Top backhaul lanes</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-[300px_1fr]">
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={lanesSplit} dataKey="value" nameKey="name" innerRadius={55} outerRadius={95}>
                    {lanesSplit.map((entry, i) => (
                      <Cell key={entry.name} fill={chartColors[i % chartColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: number) => `${v}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3 self-center">
              {lanesSplit.map((l, i) => (
                <div key={l.name} className="flex items-center gap-3">
                  <span
                    className="size-3 rounded-full"
                    style={{ background: chartColors[i % chartColors.length] }}
                  />
                  <span className="flex-1 text-sm font-medium">{l.name}</span>
                  <span className="text-sm font-semibold">{l.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
