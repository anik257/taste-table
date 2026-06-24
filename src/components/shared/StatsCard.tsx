import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

interface Props {
  title: string;
  value: string;
  icon: ReactNode;
  delta?: number;
  hint?: string;
  tone?: "primary" | "info" | "success" | "warning";
}

const TONES = {
  primary: "bg-primary/10 text-primary",
  info: "bg-info/10 text-info",
  success: "bg-success/10 text-success",
  warning: "bg-warning/15 text-warning",
};

export function StatsCard({ title, value, icon, delta, hint, tone = "primary" }: Props) {
  const positive = (delta ?? 0) >= 0;
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="mt-2 font-display text-2xl font-bold tracking-tight md:text-3xl">{value}</p>
            {(delta !== undefined || hint) && (
              <div className="mt-2 flex items-center gap-1.5 text-xs">
                {delta !== undefined && (
                  <span
                    className={cn(
                      "inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 font-medium",
                      positive ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive",
                    )}
                  >
                    {positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    {Math.abs(delta)}%
                  </span>
                )}
                {hint && <span className="text-muted-foreground">{hint}</span>}
              </div>
            )}
          </div>
          <div className={cn("grid h-11 w-11 shrink-0 place-items-center rounded-xl", TONES[tone])}>{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}
