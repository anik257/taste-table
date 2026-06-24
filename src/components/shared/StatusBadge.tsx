import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const MAP: Record<string, string> = {
  // orders
  Pending: "bg-warning/15 text-warning-foreground border-warning/30 dark:text-warning",
  Preparing: "bg-info/15 text-info border-info/30",
  Ready: "bg-primary/15 text-primary border-primary/30",
  Served: "bg-success/15 text-success border-success/30",
  Paid: "bg-success/15 text-success border-success/30",
  Cancelled: "bg-destructive/15 text-destructive border-destructive/30",
  // tables
  Available: "bg-success/15 text-success border-success/30",
  Reserved: "bg-warning/15 text-warning border-warning/30",
  Occupied: "bg-destructive/15 text-destructive border-destructive/30",
  // staff
  Active: "bg-success/15 text-success border-success/30",
  "On Leave": "bg-warning/15 text-warning border-warning/30",
  Inactive: "bg-muted text-muted-foreground border-border",
  // payments
  Refunded: "bg-muted text-muted-foreground border-border",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge variant="outline" className={cn("font-medium", MAP[status] ?? "bg-muted text-muted-foreground")}>
      <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {status}
    </Badge>
  );
}
