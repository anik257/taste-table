import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Eye, Minus, Plus, Trash2 } from "lucide-react";
import { AppLayout } from "@/layouts/AppLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { SearchBar } from "@/components/shared/SearchBar";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { OrderStatusTimeline } from "@/components/shared/OrderStatusTimeline";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { foods, orders as MOCK, staff, tables } from "@/data/mock";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { ORDER_STATUSES } from "@/constants";
import { toast } from "sonner";
import type { Order, OrderItem, OrderStatus } from "@/types";

export const Route = createFileRoute("/orders")({
  head: () => ({ meta: [{ title: "Orders — Saffron" }] }),
  component: OrdersPage,
});

function OrdersPage() {
  const [items, setItems] = useState<Order[]>(MOCK);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"all" | OrderStatus>("all");
  const [selected, setSelected] = useState<Order | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const filtered = useMemo(() => {
    return items.filter((o) => {
      if (q && !o.id.toLowerCase().includes(q.toLowerCase()) && !o.staffName.toLowerCase().includes(q.toLowerCase())) return false;
      if (status !== "all" && o.status !== status) return false;
      return true;
    });
  }, [items, q, status]);

  return (
    <AppLayout>
      <PageHeader
        title="Orders"
        description="Live order management"
        actions={<Button onClick={() => setCreateOpen(true)}><Plus className="mr-1.5 h-4 w-4" /> Create order</Button>}
      />

      <Card>
        <CardContent className="p-4 md:p-5">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_200px]">
            <SearchBar value={q} onChange={setQ} placeholder="Search by ID or staff…" />
            <Select value={status} onValueChange={(v) => setStatus(v as typeof status)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {ORDER_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="mt-4 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Table</TableHead>
                  <TableHead>Staff</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((o) => (
                  <TableRow key={o.id} className="cursor-pointer" onClick={() => setSelected(o)}>
                    <TableCell className="font-medium">{o.id}</TableCell>
                    <TableCell>#{o.tableNumber}</TableCell>
                    <TableCell className="text-muted-foreground">{o.staffName}</TableCell>
                    <TableCell>{o.items.reduce((s, i) => s + i.quantity, 0)}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(o.total)}</TableCell>
                    <TableCell><StatusBadge status={o.status} /></TableCell>
                    <TableCell className="text-muted-foreground">{formatDateTime(o.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); setSelected(o); }}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Details drawer */}
      <Sheet open={!!selected} onOpenChange={(b) => !b && setSelected(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle>{selected.id}</SheetTitle>
                <SheetDescription>
                  Table #{selected.tableNumber} · {selected.staffName} · {formatDateTime(selected.createdAt)}
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-6 px-4 pb-6">
                <div className="rounded-lg border border-border p-4">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Customer</p>
                  <p className="mt-1 font-medium">{selected.customerName ?? "Walk-in"}</p>
                </div>
                <div>
                  <h4 className="mb-2 text-sm font-semibold">Items</h4>
                  <ul className="divide-y divide-border rounded-lg border border-border">
                    {selected.items.map((it) => (
                      <li key={it.foodId} className="flex items-center justify-between gap-3 p-3">
                        <div>
                          <p className="text-sm font-medium">{it.name}</p>
                          <p className="text-xs text-muted-foreground">{formatCurrency(it.price)} × {it.quantity}</p>
                        </div>
                        <span className="text-sm font-medium">{formatCurrency(it.price * it.quantity)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>{formatCurrency(selected.subtotal)}</span></div>
                  <div className="flex justify-between text-muted-foreground"><span>Tax (8%)</span><span>{formatCurrency(selected.tax)}</span></div>
                  <Separator />
                  <div className="flex justify-between font-display text-lg font-bold"><span>Total</span><span>{formatCurrency(selected.total)}</span></div>
                </div>
                <div>
                  <h4 className="mb-3 text-sm font-semibold">Status timeline</h4>
                  <OrderStatusTimeline current={selected.status} />
                </div>
                <Select
                  value={selected.status}
                  onValueChange={(v) => {
                    const next = v as OrderStatus;
                    setItems((arr) => arr.map((o) => (o.id === selected.id ? { ...o, status: next } : o)));
                    setSelected({ ...selected, status: next });
                    toast.success(`Order updated to ${next}`);
                  }}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{ORDER_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <CreateOrderDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreate={(o) => {
          setItems((arr) => [o, ...arr]);
          setCreateOpen(false);
          toast.success(`Order ${o.id} created`);
        }}
      />
    </AppLayout>
  );
}

function CreateOrderDialog({
  open, onOpenChange, onCreate,
}: {
  open: boolean; onOpenChange: (b: boolean) => void; onCreate: (o: Order) => void;
}) {
  const [tableId, setTableId] = useState(tables[0].id);
  const [staffId, setStaffId] = useState(staff[0].id);
  const [picked, setPicked] = useState<Record<string, number>>({});

  const items: OrderItem[] = Object.entries(picked)
    .filter(([, q]) => q > 0)
    .map(([id, q]) => {
      const f = foods.find((x) => x.id === id)!;
      return { foodId: f.id, name: f.name, price: f.price, quantity: q };
    });
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const tax = +(subtotal * 0.08).toFixed(2);

  const submit = () => {
    if (!items.length) { toast.error("Add at least one item"); return; }
    const t = tables.find((x) => x.id === tableId)!;
    const s = staff.find((x) => x.id === staffId)!;
    onCreate({
      id: `ORD-${1100 + Math.floor(Math.random() * 900)}`,
      tableId, tableNumber: t.number, staffId, staffName: s.name,
      items, subtotal: +subtotal.toFixed(2), tax, total: +(subtotal + tax).toFixed(2),
      status: "Pending", createdAt: new Date().toISOString(), customerName: "Walk-in",
    });
    setPicked({});
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader><DialogTitle>Create order</DialogTitle></DialogHeader>
        <div className="grid grid-cols-2 gap-3">
          <div className="grid gap-1.5">
            <Label>Table</Label>
            <Select value={tableId} onValueChange={setTableId}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{tables.map((t) => <SelectItem key={t.id} value={t.id}>Table {t.number} ({t.capacity} seats)</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="grid gap-1.5">
            <Label>Staff</Label>
            <Select value={staffId} onValueChange={setStaffId}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{staff.map((s) => <SelectItem key={s.id} value={s.id}>{s.name} · {s.position}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-3">
          <Label className="mb-2 block">Items</Label>
          <div className="max-h-64 overflow-y-auto rounded-lg border border-border">
            {foods.filter((f) => f.available).map((f) => {
              const qty = picked[f.id] ?? 0;
              return (
                <div key={f.id} className="flex items-center justify-between gap-3 border-b border-border p-3 last:border-0">
                  <div className="flex min-w-0 items-center gap-3">
                    <img src={f.image} alt="" className="h-9 w-9 shrink-0 rounded-md object-cover" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{f.name}</p>
                      <p className="text-xs text-muted-foreground">{formatCurrency(f.price)}</p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => setPicked((p) => ({ ...p, [f.id]: Math.max(0, (p[f.id] ?? 0) - 1) }))}><Minus className="h-3 w-3" /></Button>
                    <span className="w-7 text-center text-sm tabular-nums">{qty}</span>
                    <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => setPicked((p) => ({ ...p, [f.id]: (p[f.id] ?? 0) + 1 }))}><Plus className="h-3 w-3" /></Button>
                    {qty > 0 && (
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => setPicked((p) => { const { [f.id]: _, ...r } = p; return r; })}><Trash2 className="h-3 w-3" /></Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-3 space-y-1 rounded-lg bg-muted p-3 text-sm">
          <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
          <div className="flex justify-between text-muted-foreground"><span>Tax</span><span>{formatCurrency(tax)}</span></div>
          <div className="flex justify-between font-display text-base font-bold"><span>Total</span><span>{formatCurrency(subtotal + tax)}</span></div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit}>Create order</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
