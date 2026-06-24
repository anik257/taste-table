import { Check, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { ORDER_STATUSES } from "@/constants";
import type { OrderStatus } from "@/types";

export function OrderStatusTimeline({ current }: { current: OrderStatus }) {
  const flow: OrderStatus[] = ["Pending", "Preparing", "Ready", "Served", "Paid"];
  const idx = flow.indexOf(current);
  const cancelled = current === "Cancelled";

  if (cancelled) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
        This order was cancelled.
      </div>
    );
  }

  return (
    <ol className="space-y-3">
      {flow.map((s, i) => {
        const done = i < idx;
        const active = i === idx;
        return (
          <li key={s} className="flex items-center gap-3">
            <span
              className={cn(
                "grid h-7 w-7 shrink-0 place-items-center rounded-full border text-xs",
                done && "border-success bg-success text-success-foreground",
                active && "border-primary bg-primary text-primary-foreground",
                !done && !active && "border-border bg-muted text-muted-foreground",
              )}
            >
              {done ? <Check className="h-3.5 w-3.5" /> : active ? <Clock className="h-3.5 w-3.5" /> : i + 1}
            </span>
            <span
              className={cn(
                "text-sm",
                active ? "font-semibold text-foreground" : done ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {s}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

export { ORDER_STATUSES };
