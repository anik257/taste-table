import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChefHat, Printer } from "lucide-react";
import { AppLayout } from "@/layouts/AppLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { bills, orders } from "@/data/mock";
import { formatCurrency, formatDateTime } from "@/lib/format";
import type { Bill } from "@/types";

export const Route = createFileRoute("/billing")({
  head: () => ({ meta: [{ title: "Billing — Saffron" }] }),
  component: BillingPage,
});

function BillingPage() {
  const [selected, setSelected] = useState<Bill | null>(null);

  const totals = {
    paid: bills.filter((b) => b.paymentStatus === "Paid").reduce((s, b) => s + b.total, 0),
    pending: bills.filter((b) => b.paymentStatus === "Pending").reduce((s, b) => s + b.total, 0),
    refunded: bills.filter((b) => b.paymentStatus === "Refunded").reduce((s, b) => s + b.total, 0),
  };

  return (
    <AppLayout>
      <PageHeader title="Billing" description="Invoices & payments overview" />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        {[
          { label: "Collected", value: totals.paid, tone: "bg-success/10 text-success" },
          { label: "Pending", value: totals.pending, tone: "bg-warning/15 text-warning" },
          { label: "Refunded", value: totals.refunded, tone: "bg-muted text-muted-foreground" },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <p className="mt-2 font-display text-2xl font-bold">{formatCurrency(s.value)}</p>
              </div>
              <div className={`grid h-11 w-11 place-items-center rounded-xl ${s.tone}`}>$</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-4 md:p-5">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bills.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell className="font-medium">{b.invoiceNumber}</TableCell>
                    <TableCell className="text-muted-foreground">{b.orderId}</TableCell>
                    <TableCell>{b.customerName}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(b.total)}</TableCell>
                    <TableCell>{b.paymentMethod}</TableCell>
                    <TableCell><StatusBadge status={b.paymentStatus} /></TableCell>
                    <TableCell className="text-muted-foreground">{formatDateTime(b.date)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => setSelected(b)}>View</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <InvoiceDialog bill={selected} onClose={() => setSelected(null)} />
    </AppLayout>
  );
}

function InvoiceDialog({ bill, onClose }: { bill: Bill | null; onClose: () => void }) {
  const order = bill ? orders.find((o) => o.id === bill.orderId) : null;
  return (
    <Dialog open={!!bill} onOpenChange={(b) => !b && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>Invoice preview</DialogTitle></DialogHeader>
        {bill && (
          <div className="rounded-lg border border-border bg-card p-5">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground"><ChefHat className="h-5 w-5" /></div>
                <div>
                  <p className="font-display text-base font-bold leading-tight">Saffron</p>
                  <p className="text-[10px] text-muted-foreground">123 Spice Lane · NY</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Invoice</p>
                <p className="font-mono text-sm font-semibold">{bill.invoiceNumber}</p>
              </div>
            </div>
            <div className="mb-4 grid grid-cols-2 gap-3 text-xs">
              <div><p className="text-muted-foreground">Billed to</p><p className="mt-0.5 font-medium">{bill.customerName}</p></div>
              <div className="text-right"><p className="text-muted-foreground">Date</p><p className="mt-0.5 font-medium">{formatDateTime(bill.date)}</p></div>
              <div><p className="text-muted-foreground">Table</p><p className="mt-0.5 font-medium">#{bill.tableNumber}</p></div>
              <div className="text-right"><p className="text-muted-foreground">Order</p><p className="mt-0.5 font-medium">{bill.orderId}</p></div>
            </div>
            <Separator />
            <ul className="my-3 space-y-1.5 text-sm">
              {order?.items.map((it) => (
                <li key={it.foodId} className="flex justify-between">
                  <span>{it.quantity}× {it.name}</span>
                  <span>{formatCurrency(it.price * it.quantity)}</span>
                </li>
              ))}
            </ul>
            <Separator />
            <div className="mt-3 space-y-1 text-sm">
              <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>{formatCurrency(bill.amount)}</span></div>
              <div className="flex justify-between text-muted-foreground"><span>Tax</span><span>{formatCurrency(bill.tax)}</span></div>
              <div className="flex justify-between font-display text-base font-bold"><span>Total</span><span>{formatCurrency(bill.total)}</span></div>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{bill.paymentMethod}</span>
              <StatusBadge status={bill.paymentStatus} />
            </div>
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
          <Button onClick={() => window.print()}><Printer className="mr-1.5 h-4 w-4" /> Print</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
