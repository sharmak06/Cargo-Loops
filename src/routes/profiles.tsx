import { createFileRoute } from "@tanstack/react-router";
import { BadgeCheck, MapPin, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Stars, VerifiedBadge } from "@/components/brand";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { businesses, mask, reviews, transporters } from "@/lib/mock-data";
import { BankDetailsCard } from "@/components/bank-details-card";

export const Route = createFileRoute("/profiles")({
  head: () => ({
    meta: [
      { title: "Trust Profiles & Verification — CargoLoop" },
      {
        name: "description",
        content:
          "GST-verified transporter and business profiles with fleet size, delivery history, ratings, reviews and payment reliability scores.",
      },
      { property: "og:title", content: "Trust Profiles — CargoLoop" },
      {
        property: "og:description",
        content: "Verified badges, ratings and reviews for both sides of every backhaul.",
      },
    ],
  }),
  component: ProfilesPage,
});

function ProfilesPage() {
  return (
    <AppShell
      title="Profiles & Trust"
      subtitle="Sensitive identifiers such as GST, PAN and bank details are masked for all counterparties"
    >
      <div className="mb-8">
        <BankDetailsCard />
      </div>

      <Tabs defaultValue="transporters">
        <TabsList>
          <TabsTrigger value="transporters">Transporters</TabsTrigger>
          <TabsTrigger value="businesses">Businesses</TabsTrigger>
        </TabsList>

        <TabsContent value="transporters" className="mt-6 grid gap-6 lg:grid-cols-3">
          {transporters.map((t) => (
            <Card key={t.id} className="shadow-soft">
              <CardHeader>
                <CardTitle className="text-base">{t.company}</CardTitle>
                <p className="text-xs text-muted-foreground">Owner: {t.owner}</p>
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  {t.verified ? <VerifiedBadge /> : null}
                  {t.trusted ? (
                    <Badge variant="secondary">
                      <BadgeCheck className="mr-1 size-3" /> Trusted
                    </Badge>
                  ) : null}
                  <Stars value={t.rating} />
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="size-4" /> {t.city}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    ["Fleet size", `${t.fleetSize} trucks`],
                    ["Successful deliveries", String(t.deliveries)],
                    ["GST", mask(t.gst)],
                    ["PAN", mask(t.pan)],
                  ].map(([k, v]) => (
                    <div key={k} className="rounded-lg bg-secondary/60 p-2.5">
                      <p className="text-xs text-muted-foreground">{k}</p>
                      <p className="font-semibold">{v}</p>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Vehicle types: {t.vehicleTypes.join(", ")}
                </p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="businesses" className="mt-6 grid gap-6 lg:grid-cols-3">
          {businesses.map((b) => (
            <Card key={b.id} className="shadow-soft">
              <CardHeader>
                <CardTitle className="text-base">{b.company}</CardTitle>
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  {b.verified ? <VerifiedBadge /> : null}
                  <Stars value={b.rating} />
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="size-4" /> {b.city} · {b.industry}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    ["Successful shipments", String(b.shipments)],
                    ["GST", mask(b.gst)],
                  ].map(([k, v]) => (
                    <div key={k} className="rounded-lg bg-secondary/60 p-2.5">
                      <p className="text-xs text-muted-foreground">{k}</p>
                      <p className="font-semibold">{v}</p>
                    </div>
                  ))}
                </div>
                <div>
                  <p className="flex justify-between text-xs font-medium">
                    <span className="text-muted-foreground">Payment reliability</span>
                    <span>{b.paymentReliability}%</span>
                  </p>
                  <Progress value={b.paymentReliability} className="mt-1.5 h-1.5" />
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      <Card className="shadow-soft mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <ShieldCheck className="size-4 text-accent" /> Recent reviews
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          {reviews.map((r) => (
            <div key={r.id} className="rounded-xl border border-border p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">{r.author}</p>
                <Stars value={r.rating} />
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{r.text}</p>
              <p className="mt-3 text-xs text-muted-foreground">{r.date}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </AppShell>
  );
}
