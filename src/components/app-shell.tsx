import { Link, useNavigate } from "@tanstack/react-router";
import type { ReactNode } from "react";
import {
  Building2,
  LayoutDashboard,
  LogOut,
  MapPin,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";
import { Logo } from "./brand";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/session";

const allNav = [
  { to: "/transporter", label: "Transporter", icon: Truck },
  { to: "/matching", label: "Smart Matching", icon: Sparkles },
  { to: "/business", label: "Business", icon: Building2 },
  { to: "/tracking", label: "Booking & Tracking", icon: MapPin },
  { to: "/profiles", label: "Trust Profiles", icon: ShieldCheck },
  { to: "/admin", label: "Admin", icon: LayoutDashboard },
] as const;

const navByRole: Record<string, string[]> = {
  transporter: ["/transporter", "/matching", "/tracking", "/profiles"],
  business: ["/business", "/tracking", "/profiles"],
  admin: ["/admin"],
};

export function AppShell({
  title,
  subtitle,
  actions,
  children,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const { user, signOut } = useSession();
  const navigate = useNavigate();
  const allowed = user ? navByRole[user.role] : null;
  const nav = allowed ? allNav.filter((i) => allowed.includes(i.to)) : allNav;


  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-card/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
          <Logo />
          <nav className="ml-4 hidden items-center gap-1 lg:flex">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                activeProps={{ className: "bg-secondary text-foreground" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-3">
            {user ? (
              <>
                <div className="hidden text-right sm:block">
                  <p className="text-sm font-semibold leading-tight">{user.name}</p>
                  <p className="text-xs capitalize text-muted-foreground">
                    {user.company} · {user.role}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    signOut();
                    navigate({ to: "/", search: { lang: "en" } });
                  }}
                >
                  <LogOut className="size-4" /> Sign out
                </Button>
              </>
            ) : (
              <Button size="sm" asChild>
                <Link to="/auth" search={{ mode: "signup" as const }}>
                  Get Started
                </Link>
              </Button>
            )}
          </div>
        </div>
        <div className="flex gap-1 overflow-x-auto border-t border-border/60 px-4 py-2 lg:hidden">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground"
              activeProps={{ className: "bg-secondary text-foreground" }}
            >
              <item.icon className="size-3.5" />
              {item.label}
            </Link>
          ))}
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>
            {subtitle ? <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p> : null}
          </div>
          {actions}
        </div>
        {children}
      </main>

      <footer className="border-t border-border/70 py-8">
        <p className="mx-auto max-w-7xl px-4 text-xs text-muted-foreground sm:px-6">
          CargoLoop does not replace existing logistics networks. It monetizes the unused capacity
          left after existing commitments. Demo environment — data shown is representative mock data.
        </p>
      </footer>
    </div>
  );
}
