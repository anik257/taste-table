import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { AppLayout } from "@/layouts/AppLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { SearchBar } from "@/components/shared/SearchBar";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { staff as MOCK } from "@/data/mock";
import { STAFF_POSITIONS } from "@/constants";
import { formatCurrency, formatDate } from "@/lib/format";
import { toast } from "sonner";
import type { Staff, StaffPosition } from "@/types";

export const Route = createFileRoute("/staff")({
  head: () => ({ meta: [{ title: "Staff — Saffron" }] }),
  component: StaffPage,
});

const PAGE_SIZE = 8;

function StaffPage() {
  const [items, setItems] = useState<Staff[]>(MOCK);
  const [q, setQ] = useState("");
  const [pos, setPos] = useState<"all" | StaffPosition>("all");
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Staff | null>(null);

  const filtered = useMemo(() => items.filter((s) => {
    if (q && !s.name.toLowerCase().includes(q.toLowerCase())) return false;
    if (pos !== "all" && s.position !== pos) return false;
    return true;
  }), [items, q, pos]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const slice = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <AppLayout>
      <PageHeader
        title="Staff"
        description="Your restaurant team directory"
        actions={<Button onClick={() => { setEditing(null); setOpen(true); }}><Plus className="mr-1.5 h-4 w-4" /> Add staff</Button>}
      />

      <Card>
        <CardContent className="p-4 md:p-5">
          <div className="grid gap-3 md:grid-cols-[1fr_200px]">
            <SearchBar value={q} onChange={(v) => { setQ(v); setPage(1); }} placeholder="Search staff…" />
            <Select value={pos} onValueChange={(v) => { setPos(v as typeof pos); setPage(1); }}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All positions</SelectItem>
                {STAFF_POSITIONS.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="mt-4 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead className="text-right">Salary</TableHead>
                  <TableHead>Joining date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {slice.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9"><AvatarImage src={s.avatar} /><AvatarFallback>{s.name.slice(0, 2)}</AvatarFallback></Avatar>
                        <div>
                          <p className="font-medium">{s.name}</p>
                          <p className="text-xs text-muted-foreground">{s.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{s.phone}</TableCell>
                    <TableCell>{s.position}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(s.salary)}</TableCell>
                    <TableCell className="text-muted-foreground">{formatDate(s.joiningDate)}</TableCell>
                    <TableCell><StatusBadge status={s.status} /></TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditing(s); setOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => { setItems((a) => a.filter((x) => x.id !== s.id)); toast.success("Staff removed"); }}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 flex items-center justify-between text-sm">
            <p className="text-muted-foreground">{filtered.length} staff members</p>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
              <Button variant="outline" size="sm" disabled={page === pages} onClick={() => setPage((p) => p + 1)}>Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <StaffDialog
        open={open} onOpenChange={setOpen} editing={editing}
        onSave={(s) => {
          if (editing) { setItems((a) => a.map((x) => x.id === s.id ? s : x)); toast.success("Updated"); }
          else { setItems((a) => [{ ...s, id: `s${Date.now()}` }, ...a]); toast.success("Staff added"); }
          setOpen(false);
        }}
      />
    </AppLayout>
  );
}

import { useEffect } from "react";
function StaffDialog({
  open, onOpenChange, editing, onSave,
}: { open: boolean; onOpenChange: (b: boolean) => void; editing: Staff | null; onSave: (s: Staff) => void; }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [position, setPosition] = useState<StaffPosition>("Waiter");
  const [salary, setSalary] = useState(2800);
  useEffect(() => {
    setName(editing?.name ?? "");
    setEmail(editing?.email ?? "");
    setPhone(editing?.phone ?? "");
    setPosition(editing?.position ?? "Waiter");
    setSalary(editing?.salary ?? 2800);
  }, [editing, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>{editing ? "Edit staff" : "Add staff"}</DialogTitle></DialogHeader>
        <div className="grid gap-3 py-2">
          <div className="grid gap-1.5"><Label>Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5"><Label>Email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
            <div className="grid gap-1.5"><Label>Phone</Label><Input value={phone} onChange={(e) => setPhone(e.target.value)} /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5"><Label>Position</Label>
              <Select value={position} onValueChange={(v) => setPosition(v as StaffPosition)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{STAFF_POSITIONS.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5"><Label>Salary</Label><Input type="number" value={salary} onChange={(e) => setSalary(Number(e.target.value))} /></div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={() => onSave({
            id: editing?.id ?? "", name, email, phone, position, salary,
            joiningDate: editing?.joiningDate ?? new Date().toISOString().slice(0, 10),
            status: editing?.status ?? "Active",
            avatar: editing?.avatar ?? `https://i.pravatar.cc/150?u=${name}`,
          })}>{editing ? "Save" : "Add"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
