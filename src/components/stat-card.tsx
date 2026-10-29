import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  accent = false,
}: {
  label: string;
  value: string;
  hint?: string;
  icon: LucideIcon;
  accent?: boolean;
}) {
  return (
    <Card className={cn("shadow-soft", accent && "border-accent/40 bg-accent/8")}>
      <CardContent className="flex items-start gap-4 p-5">
        <span
          className={cn(
            "grid size-10 shrink-0 place-items-center rounded-xl",
            accent ? "bg-accent-gradient text-accent-foreground" : "bg-secondary text-primary",
          )}
        >
          <Icon className="size-5" />
        </span>
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {label}
          </p>
          <p className="font-display mt-1 text-2xl font-bold leading-none">{value}</p>
          {hint ? <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p> : null}
        </div>
      </CardContent>
    </Card>
  );
}
