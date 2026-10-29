import { useEffect, useRef, useState } from "react";
import type { Map as LeafletMap, Marker, Polyline } from "leaflet";
import { MapPin, Navigation, Pause, Play, RefreshCw, RotateCcw, Truck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Booking } from "@/lib/session";
import "leaflet/dist/leaflet.css";

type Coordinates = [number, number];
type RouteData = {
  coordinates: Coordinates[];
  distanceMeters: number;
  durationSeconds: number;
};

const cityCoordinates: Record<string, Coordinates> = {
  ahmedabad: [23.0225, 72.5714],
  bengaluru: [12.9716, 77.5946],
  bangalore: [12.9716, 77.5946],
  bhiwandi: [19.3002, 73.0583],
  chakan: [18.7606, 73.8636],
  delhi: [28.6139, 77.209],
  gurgaon: [28.4595, 77.0266],
  hyderabad: [17.385, 78.4867],
  jaipur: [26.9124, 75.7873],
  kolkata: [22.5726, 88.3639],
  mumbai: [19.076, 72.8777],
  "navi mumbai": [19.033, 73.0297],
  nagpur: [21.1458, 79.0882],
  nashik: [19.9975, 73.7898],
  pune: [18.5204, 73.8567],
  surat: [21.1702, 72.8311],
  thane: [19.2183, 72.9781],
};

function knownCityCoordinates(location: string): Coordinates | undefined {
  const normalized = location
    .toLowerCase()
    .replace(/[^a-z ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const city = Object.keys(cityCoordinates)
    .sort((a, b) => b.length - a.length)
    .find((name) => normalized === name || normalized.startsWith(`${name} `));
  return city ? cityCoordinates[city] : undefined;
}

async function geocodeLocation(location: string, signal: AbortSignal): Promise<Coordinates> {
  const knownCoordinates = knownCityCoordinates(location);
  if (knownCoordinates) return knownCoordinates;

  const query = new URLSearchParams({ q: `${location}, India`, limit: "5" });
  const response = await fetch(`https://photon.komoot.io/api/?${query}`, { signal });
  if (!response.ok) throw new Error(`Could not find "${location}" on the map.`);

  const result = (await response.json()) as {
    features?: Array<{
      properties?: { countrycode?: string };
      geometry?: { coordinates?: number[] };
    }>;
  };
  const feature = result.features?.find(
    (item) => item.properties?.countrycode === "IN" && item.geometry?.coordinates?.length === 2,
  );
  const coordinates = feature?.geometry?.coordinates;
  if (!coordinates || coordinates[0] === undefined || coordinates[1] === undefined) {
    throw new Error(`Could not find "${location}" in India.`);
  }
  return [coordinates[1], coordinates[0]];
}

async function getRoadRoute(
  pickup: Coordinates,
  delivery: Coordinates,
  signal: AbortSignal,
): Promise<RouteData> {
  const coordinates = `${pickup[1]},${pickup[0]};${delivery[1]},${delivery[0]}`;
  const query = new URLSearchParams({ overview: "full", geometries: "geojson" });
  const response = await fetch(
    `https://router.project-osrm.org/route/v1/driving/${coordinates}?${query}`,
    { signal },
  );
  if (!response.ok) throw new Error("The road route is temporarily unavailable.");

  const result = (await response.json()) as {
    code?: string;
    routes?: Array<{
      distance?: number;
      duration?: number;
      geometry?: { coordinates?: number[][] };
    }>;
  };
  const route = result.routes?.[0];
  const points = route?.geometry?.coordinates;
  const routeCoordinates: Coordinates[] = (points ?? []).flatMap((point) => {
    const longitude = point[0];
    const latitude = point[1];
    return typeof longitude === "number" && typeof latitude === "number"
      ? [[latitude, longitude]]
      : [];
  });
  if (
    result.code !== "Ok" ||
    !route ||
    routeCoordinates.length < 2 ||
    route.distance === undefined ||
    route.duration === undefined
  ) {
    throw new Error("No drivable route was found between these locations.");
  }

  return {
    coordinates: routeCoordinates,
    distanceMeters: route.distance,
    durationSeconds: route.duration,
  };
}

function routePosition(route: RouteData, progress: number): Coordinates {
  const targetDistance = route.distanceMeters * progress;
  let travelled = 0;

  for (let index = 1; index < route.coordinates.length; index += 1) {
    const previous = route.coordinates[index - 1];
    const current = route.coordinates[index];
    if (!previous || !current) continue;

    const segmentDistance = Math.hypot(
      (current[0] - previous[0]) * 111_000,
      (current[1] - previous[1]) * 111_000 * Math.cos((previous[0] * Math.PI) / 180),
    );
    if (travelled + segmentDistance >= targetDistance && segmentDistance > 0) {
      const fraction = (targetDistance - travelled) / segmentDistance;
      return [
        previous[0] + (current[0] - previous[0]) * fraction,
        previous[1] + (current[1] - previous[1]) * fraction,
      ];
    }
    travelled += segmentDistance;
  }

  return route.coordinates[route.coordinates.length - 1] ?? [0, 0];
}

function formatDistance(distanceMeters: number): string {
  return `${Math.round(distanceMeters / 1000).toLocaleString("en-IN")} km`;
}

function formatDuration(durationSeconds: number): string {
  const hours = Math.round(durationSeconds / 3600);
  if (hours < 1) return `${Math.max(1, Math.round(durationSeconds / 60))} min`;
  const wholeDays = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  return wholeDays ? `${wholeDays} d ${remainingHours} hr` : `${hours} hr`;
}

export function ShipmentMap({ booking, demoMode }: { booking: Booking; demoMode: boolean }) {
  const mapElement = useRef<HTMLDivElement>(null);
  const map = useRef<LeafletMap | null>(null);
  const truckMarker = useRef<Marker | null>(null);
  const routeLine = useRef<Polyline | null>(null);
  const [route, setRoute] = useState<RouteData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [retry, setRetry] = useState(0);
  const [mapReady, setMapReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(() => [0, 0.16, 0.62, 1][booking.stageIndex] ?? 0);
  const [truckPosition, setTruckPosition] = useState<Coordinates | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;
    let leafletMap: LeafletMap | null = null;

    setError(null);
    setRoute(null);
    setMapReady(false);
    setTruckPosition(null);
    map.current = null;
    truckMarker.current = null;
    routeLine.current = null;

    async function loadMap() {
      try {
        const L = await import("leaflet");
        const [pickup, delivery] = await Promise.all([
          geocodeLocation(booking.shipment.pickup, controller.signal),
          geocodeLocation(booking.shipment.delivery, controller.signal),
        ]);
        const roadRoute = await getRoadRoute(pickup, delivery, controller.signal);
        if (cancelled || !mapElement.current) return;

        leafletMap = L.map(mapElement.current, { scrollWheelZoom: false, zoomControl: true });
        map.current = leafletMap;
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          maxZoom: 19,
        }).addTo(leafletMap);

        routeLine.current = L.polyline(roadRoute.coordinates, {
          color: "#2458a6",
          weight: 5,
          opacity: 0.85,
        }).addTo(leafletMap);
        const endpointIcon = (kind: "pickup" | "delivery") =>
          L.divIcon({
            className: "shipment-map-marker",
            html: `<span class="shipment-map-marker__pin shipment-map-marker__pin--${kind}"></span>`,
            iconSize: [22, 22],
            iconAnchor: [11, 11],
          });

        L.marker(pickup, { icon: endpointIcon("pickup") })
          .addTo(leafletMap)
          .bindTooltip("Pickup", { permanent: true, direction: "top", offset: [0, -10] });
        L.marker(delivery, { icon: endpointIcon("delivery") })
          .addTo(leafletMap)
          .bindTooltip("Delivery", { permanent: true, direction: "top", offset: [0, -10] });

        const truckIcon = L.divIcon({
          className: "shipment-map-marker",
          html: '<span class="shipment-map-marker__truck">🚚</span>',
          iconSize: [36, 36],
          iconAnchor: [18, 18],
        });
        truckMarker.current = L.marker(pickup, { icon: truckIcon, zIndexOffset: 1000 })
          .addTo(leafletMap)
          .bindTooltip(
            demoMode ? "Simulated truck position" : "Estimated route position · not GPS",
            { direction: "top", offset: [0, -18] },
          );
        leafletMap.fitBounds(routeLine.current.getBounds(), { padding: [42, 42] });
        setRoute(roadRoute);
        setMapReady(true);
      } catch (cause) {
        if (!cancelled && !controller.signal.aborted) {
          setError(cause instanceof Error ? cause.message : "Could not load the shipment map.");
        }
      }
    }

    void loadMap();

    return () => {
      cancelled = true;
      controller.abort();
      leafletMap?.remove();
      map.current = null;
      truckMarker.current = null;
      routeLine.current = null;
    };
  }, [booking.shipment.delivery, booking.shipment.pickup, demoMode, retry]);

  useEffect(() => {
    if (booking.stageIndex === 3) {
      setIsPlaying(false);
      setProgress(1);
      return;
    }
    if (demoMode && route) setIsPlaying(true);
  }, [booking.stageIndex, demoMode, route]);

  useEffect(() => {
    if (!route || !mapReady) return;
    const startingProgress = [0, 0.16, 0.62, 1][booking.stageIndex] ?? 0;
    if (!demoMode || !isPlaying) setProgress(startingProgress);
  }, [booking.stageIndex, demoMode, isPlaying, mapReady, route]);

  useEffect(() => {
    if (!route || !truckMarker.current || !map.current) return;
    const position = routePosition(route, progress);
    truckMarker.current.setLatLng(position);
    routeLine.current?.setStyle({ opacity: progress === 0 ? 0.55 : 0.9 });
    setTruckPosition(position);
  }, [progress, route]);

  useEffect(() => {
    if (!demoMode || !isPlaying || !route) return;
    const interval = window.setInterval(() => {
      setProgress((current) => Math.min(current + 1 / 90, 1));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [demoMode, isPlaying, route]);

  useEffect(() => {
    if (progress >= 1) setIsPlaying(false);
  }, [progress]);

  function startRouteSimulation() {
    if (progress >= 1) setProgress(0);
    setIsPlaying(true);
  }

  const remainingDistance = route ? route.distanceMeters * (1 - progress) : null;
  const remainingMinutes = route ? Math.ceil((route.durationSeconds * (1 - progress)) / 60) : null;

  return (
    <section
      aria-label={`Shipment route from ${booking.shipment.pickup} to ${booking.shipment.delivery}`}
    >
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="flex items-center gap-2 text-sm font-semibold">
            <Navigation className="size-4 text-primary" /> Shipment route
          </h3>
          {route ? (
            <p className="mt-1 text-xs text-muted-foreground">
              {formatDistance(route.distanceMeters)} road distance ·{" "}
              {formatDuration(route.durationSeconds)} estimated drive
            </p>
          ) : null}
        </div>
        {demoMode ? (
          <div className="flex flex-wrap items-center gap-2">
            {isPlaying ? (
              <Badge className="gap-1.5 bg-success text-success-foreground">
                <span className="size-2 animate-pulse rounded-full bg-current" />
                LIVE · SIMULATED
              </Badge>
            ) : (
              <Badge variant="outline" className="gap-1.5">
                {progress >= 1 ? "ROUTE COMPLETE" : "SIMULATION PAUSED"}
              </Badge>
            )}
            {mapReady && booking.stageIndex < 3 ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={isPlaying ? () => setIsPlaying(false) : startRouteSimulation}
              >
                {isPlaying ? <Pause className="size-4" /> : <Play className="size-4" />}
                {isPlaying ? "Pause" : "Resume"}
              </Button>
            ) : null}
            {mapReady && booking.stageIndex === 3 ? (
              <Button type="button" variant="outline" size="sm" onClick={startRouteSimulation}>
                <RotateCcw className="size-4" /> Replay route
              </Button>
            ) : null}
          </div>
        ) : (
          <Badge variant="outline" className="gap-1.5">
            <Truck className="size-3.5" /> DRIVER GPS FEED REQUIRED
          </Badge>
        )}
      </div>

      <div className="relative h-[320px] overflow-hidden rounded-xl border border-border bg-secondary/60 sm:h-[400px]">
        <div ref={mapElement} className="shipment-map h-full w-full" />
        {!mapReady && !error ? (
          <div className="absolute inset-0 z-[500] grid place-items-center bg-background/80 text-sm text-muted-foreground">
            Loading route map…
          </div>
        ) : null}
        {error ? (
          <div className="absolute inset-0 z-[500] flex flex-col items-center justify-center gap-3 bg-background/95 p-6 text-center">
            <MapPin className="size-8 text-muted-foreground" />
            <p className="max-w-md text-sm text-muted-foreground">{error}</p>
            <Button variant="outline" size="sm" onClick={() => setRetry((value) => value + 1)}>
              <RefreshCw className="size-4" /> Try again
            </Button>
          </div>
        ) : null}
      </div>
      {demoMode &&
      mapReady &&
      truckPosition &&
      remainingDistance !== null &&
      remainingMinutes !== null ? (
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-lg bg-secondary/60 px-3 py-2 text-xs">
          <span className="font-medium">
            Current simulated position: {truckPosition[0].toFixed(4)}, {truckPosition[1].toFixed(4)}
          </span>
          <span className="text-muted-foreground">
            {formatDistance(remainingDistance)} remaining · ~{remainingMinutes} min
          </span>
        </div>
      ) : null}
      <p className="mt-2 text-xs text-muted-foreground">
        {demoMode
          ? "The marker moves in a live route simulation, not from vehicle GPS. Connect a driver GPS or carrier feed for real live tracking."
          : "Live vehicle position is unavailable until the driver app or carrier GPS feed is connected."}
      </p>
    </section>
  );
}
