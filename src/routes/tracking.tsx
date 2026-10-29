import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, FileCheck2, Phone, ShieldCheck, Truck } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { VerifiedBadge } from "@/components/brand";
import { ShipmentMap } from "@/components/shipment-map";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { inr, trackingStages } from "@/lib/mock-data";
import { useSession, type Booking } from "@/lib/session";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/tracking")({
  head: () => ({
    meta: [
      { title: "Booking & Live Tracking — CargoLoop" },
      {
        name: "description",
        content:
          "Track confirmed backhaul bookings from pickup to delivery with driver details, ETA, proof of delivery upload and secured payment release.",
      },
      { property: "og:title", content: "Booking & Live Tracking — CargoLoop" },
      {
        property: "og:description",
        content: "Confirmed → Picked Up → In Transit → Delivered, with POD and escrow release.",
      },
    ],
  }),
  component: TrackingPage,
});

function BookingCard({ booking }: { booking: Booking }) {
  const { advanceBooking, uploadPod, releasePayment, demo } = useSession();
  const delivered = booking.stageIndex === 3;

  return (
    <Card className="shadow-soft">
      <CardHeader className="flex-row flex-wrap items-center justify-between gap-2">
        <div>
          <CardTitle className="text-base">
            {booking.id} · {booking.shipment.pickup} → {booking.shipment.delivery}
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            {booking.shipment.cargoType} · {booking.shipment.weightTons} T ·{" "}
            {booking.shipment.packages} packages
          </p>
        </div>
        <div className="flex items-center gap-2">
          <VerifiedBadge />
          <span className="font-display text-xl font-bold text-success">{inr(booking.amount)}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex flex-wrap gap-2">
          {trackingStages.map((s, i) => (
            <div
              key={s}
              className={cn(
                "flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold",
                i <= booking.stageIndex
                  ? "border-success/30 bg-success/12 text-success"
                  : "border-border text-muted-foreground",
              )}
            >
              {i <= booking.stageIndex ? <CheckCircle2 className="size-3.5" /> : null}
              {s}
            </div>
          ))}
        </div>

        <ShipmentMap booking={booking} demoMode={demo} />

        <div className="grid gap-3 sm:grid-cols-3">
          {[
            ["Transporter", booking.transporter],
            ["Truck", booking.truck],
            ["Driver", `${booking.driver} · ${booking.driverMobile}`],
          ].map(([k, v]) => (
            <div key={k} className="rounded-lg bg-secondary/60 p-3">
              <p className="text-xs text-muted-foreground">{k}</p>
              <p className="text-sm font-semibold">{v}</p>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-border p-4">
          <p className="flex items-center gap-2 text-sm font-semibold">
            <ShieldCheck className="size-4 text-accent" /> Secure payment
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {inr(booking.amount)} held in CargoLoop escrow (mock). Released to the transporter after
            POD is approved.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {!delivered ? (
              <Button size="sm" onClick={() => advanceBooking(booking.id)}>
                Advance to {trackingStages[booking.stageIndex + 1]}
              </Button>
            ) : null}
            {delivered && !booking.podUploaded ? (
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-input px-3 py-1.5 text-sm font-medium">
                <FileCheck2 className="size-4" /> Upload Proof of Delivery
                <input
                  type="file"
                  className="hidden"
                  onChange={() => {
                    uploadPod(booking.id);
                    toast.success("POD uploaded", { description: "Awaiting business approval." });
                  }}
                />
              </label>
            ) : null}
            {booking.podUploaded && !booking.paymentReleased ? (
              <Button
                size="sm"
                className="bg-accent-gradient text-accent-foreground hover:opacity-90"
                onClick={() => {
                  releasePayment(booking.id);
                  toast.success(`${inr(booking.amount)} released`, {
                    description: "Settlement to transporter account ending 4471 (mock).",
                  });
                }}
              >
                Release payment
              </Button>
            ) : null}
            {booking.paymentReleased ? (
              <Badge className="bg-success text-success-foreground">Payment settled</Badge>
            ) : null}
            <Button size="sm" variant="outline">
              <Phone className="size-4" /> Call driver
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function TrackingPage() {
  const { bookings } = useSession();

  return (
    <AppShell
      title="Booking & Tracking"
      subtitle="View the shipment route, delivery stage, driver details, estimated arrival, POD and payment release"
    >
      {bookings.length ? (
        <div className="space-y-6">
          {bookings.map((b) => (
            <BookingCard key={b.id} booking={b} />
          ))}
        </div>
      ) : (
        <Card className="shadow-soft">
          <CardContent className="flex flex-col items-center gap-4 p-12 text-center">
            <Truck className="size-10 text-muted-foreground" />
            <div>
              <p className="font-semibold">No active bookings yet</p>
              <p className="text-sm text-muted-foreground">
                Accept a backhaul from Smart Matching to create your first booking.
              </p>
            </div>
            <Button asChild>
              <Link to="/matching">Find a backhaul</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </AppShell>
  );
}
