import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Armchair, Pencil, Plus, Trash2, Users } from "lucide-react";
import { AppLayout } from "@/layouts/AppLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { tables as MOCK } from "@/data/mock";
import { toast } from "sonner";
import type { Table as TTable, TableStatus } from "@/types";
import { TABLE_STATUSES } from "@/constants";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/tables")({
  head: () => ({ meta: [{ title: "Tables — Saffron" }] }),
  component: TablesPage,
});

const STATUS_RING: Record<TableStatus, string> = {
  Available: "ring-success/30 bg-success/5",
  Reserved: "ring-warning/40 bg-warning/5",
  Occupied: "ring-destructive/40 bg-destructive/5",
};

function TablesPage() {
  const [items, setItems] = useState<TTable[]>(MOCK);
  const [filter, setFilter] = useState<"all" | TableStatus>("all");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<TTable | null>(null);

  const filtered = useMemo(
    () => (filter === "all" ? items : items.filter((t) => t.status === filter)),
    [items, filter],
  );

  return (
    <AppLayout>
      <PageHeader
        title="Tables"
        description="Visual floor plan & status"
        actions={
          <Button onClick={() => { setEditing(null); setOpen(true); }}>
            <Plus className="mr-1.5 h-4 w-4" /> Add table
          </Button>
        }
      />

      <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)} className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All ({items.length})</TabsTrigger>
          {TABLE_STATUSES.map((s) => (
            <TabsTrigger key={s} value={s}>
              {s} ({items.filter((t) => t.status === s).length})
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {filtered.map((t) => (
          <Card key={t.id} className={cn("relative ring-1 transition hover:shadow-md", STATUS_RING[t.status])}>
            <CardContent className="p-5 text-center">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-card shadow-sm">
                <Armchair className="h-7 w-7 text-primary" />
              </div>
              <p className="mt-3 font-display text-xl font-bold">Table {t.number}</p>
              <div className="mt-1 flex items-center justify-center gap-1 text-xs text-muted-foreground">
                <Users className="h-3 w-3" /> {t.capacity} seats · {t.location}
              </div>
              <div className="mt-3 flex justify-center"><StatusBadge status={t.status} /></div>
              <div className="mt-4 flex justify-center gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditing(t); setOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => { setItems((a) => a.filter((x) => x.id !== t.id)); toast.success("Table removed"); }}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <TableDialog
        open={open}
        onOpenChange={setOpen}
        editing={editing}
        onSave={(t) => {
          if (editing) {
            setItems((a) => a.map((x) => (x.id === t.id ? t : x)));
            toast.success("Table updated");
          } else {
            setItems((a) => [...a, { ...t, id: `t${Date.now()}` }]);
            toast.success("Table added");
          }
          setOpen(false);
        }}
      />
    </AppLayout>
  );
}

import { useEffect } from "react";
function TableDialog({
  open, onOpenChange, editing, onSave,
}: {
  open: boolean; onOpenChange: (b: boolean) => void; editing: TTable | null; onSave: (t: TTable) => void;
}) {
  const [number, setNumber] = useState(1);
  const [capacity, setCapacity] = useState(2);
  const [status, setStatus] = useState<TableStatus>("Available");
  const [location, setLocation] = useState("Indoor");
  useEffect(() => {
    setNumber(editing?.number ?? 1);
    setCapacity(editing?.capacity ?? 2);
    setStatus(editing?.status ?? "Available");
    setLocation(editing?.location ?? "Indoor");
  }, [editing, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>{editing ? "Edit table" : "Add table"}</DialogTitle></DialogHeader>
        <div className="grid grid-cols-2 gap-3 py-2">
          <div className="grid gap-1.5"><Label>Number</Label><Input type="number" value={number} onChange={(e) => setNumber(Number(e.target.value))} /></div>
          <div className="grid gap-1.5"><Label>Capacity</Label><Input type="number" value={capacity} onChange={(e) => setCapacity(Number(e.target.value))} /></div>
          <div className="grid gap-1.5"><Label>Status</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as TableStatus)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{TABLE_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="grid gap-1.5"><Label>Location</Label>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="Indoor">Indoor</SelectItem><SelectItem value="Outdoor">Outdoor</SelectItem></SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={() => onSave({ id: editing?.id ?? "", number, capacity, status, location })}>{editing ? "Save" : "Add"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
