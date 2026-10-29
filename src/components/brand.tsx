import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export function Logo({ className, invert = false }: { className?: string; invert?: boolean }) {
  return (
    <Link to="/" search={{ lang: "en" }} className={cn("group inline-flex items-center gap-2.5", className)}>
      <span className="bg-accent-gradient relative grid size-9 place-items-center rounded-xl shadow-soft">
        <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden="true">
          <path
            d="M3 8h9v7H3zM12 10h4.5l2.5 3v2h-7z"
            stroke="oklch(0.24 0.05 60)"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <circle cx="7" cy="17" r="1.7" stroke="oklch(0.24 0.05 60)" strokeWidth="1.6" />
          <circle cx="16.5" cy="17" r="1.7" stroke="oklch(0.24 0.05 60)" strokeWidth="1.6" />
        </svg>
      </span>
      <span
        className={cn(
          "font-display text-lg font-bold tracking-tight",
          invert ? "text-primary-foreground" : "text-foreground",
        )}
      >
        Cargo<span className="text-gradient-accent">Loop</span>
      </span>
    </Link>
  );
}

export function VerifiedBadge({ label = "GST Verified" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-success/12 px-2 py-0.5 text-xs font-semibold text-success">
      <svg viewBox="0 0 20 20" className="size-3.5 fill-current" aria-hidden="true">
        <path d="M10 1.8l2 1.5 2.5-.2.8 2.4 2.1 1.4-1 2.3 1 2.3-2.1 1.4-.8 2.4-2.5-.2-2 1.5-2-1.5-2.5.2-.8-2.4L2.6 11.5l1-2.3-1-2.3 2.1-1.4.8-2.4 2.5.2 2-1.5zm-.9 10.9l4.3-4.3-1.2-1.2-3.1 3.1-1.4-1.4-1.2 1.2 2.6 2.6z" />
      </svg>
      {label}
    </span>
  );
}

export function Stars({ value }: { value: number }) {
  return (
    <span className="inline-flex items-center gap-1 text-sm font-semibold text-foreground">
      <svg viewBox="0 0 20 20" className="size-4 fill-accent" aria-hidden="true">
        <path d="M10 1.6l2.5 5.1 5.6.8-4 3.9 1 5.6-5.1-2.7-5 2.7 1-5.6-4.1-3.9 5.6-.8z" />
      </svg>
      {value.toFixed(1)}
    </span>
  );
}

export function MatchScore({ score }: { score: number }) {
  const tone =
    score >= 90 ? "text-success bg-success/12" : score >= 80 ? "text-accent-foreground bg-accent/25" : "text-muted-foreground bg-muted";
  return (
    <span className={cn("rounded-full px-2.5 py-1 text-xs font-bold", tone)}>{score}% Match</span>
  );
}
