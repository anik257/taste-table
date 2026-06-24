import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { AppLayout } from "@/layouts/AppLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { SearchBar } from "@/components/shared/SearchBar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { categories as MOCK } from "@/data/mock";
import { formatDate } from "@/lib/format";
import { toast } from "sonner";
import type { Category } from "@/types";

export const Route = createFileRoute("/categories")({
  head: () => ({ meta: [{ title: "Categories — Saffron" }] }),
  component: CategoriesPage,
});

function CategoriesPage() {
  const [items, setItems] = useState<Category[]>(MOCK);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);

  const filtered = useMemo(
    () => items.filter((c) => c.name.toLowerCase().includes(q.toLowerCase())),
    [items, q],
  );

  return (
    <AppLayout>
      <PageHeader
        title="Categories"
        description="Group your menu items"
        actions={
          <Button onClick={() => { setEditing(null); setOpen(true); }}>
            <Plus className="mr-1.5 h-4 w-4" /> Add category
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {filtered.slice(0, 8).map((c) => (
          <Card key={c.id} className="group transition hover:border-primary/40 hover:shadow-md">
            <CardContent className="p-5">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-2xl">
                {c.icon}
              </div>
              <h3 className="mt-3 font-display text-base font-semibold">{c.name}</h3>
              <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{c.description}</p>
              <div className="mt-4 flex items-center justify-between text-xs">
                <span className="font-medium text-primary">{c.totalFoods} items</span>
                <span className="text-muted-foreground">{formatDate(c.createdAt)}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <CardContent className="p-4 md:p-5">
          <div className="mb-4 max-w-sm">
            <SearchBar value={q} onChange={setQ} placeholder="Search categories…" />
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Total foods</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-lg">{c.icon}</div>
                        <div>
                          <p className="font-medium">{c.name}</p>
                          <p className="text-xs text-muted-foreground line-clamp-1">{c.description}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{c.totalFoods}</TableCell>
                    <TableCell className="text-muted-foreground">{formatDate(c.createdAt)}</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditing(c); setOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => { setItems((a) => a.filter((x) => x.id !== c.id)); toast.success("Category deleted"); }}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <CategoryDialog
        open={open}
        onOpenChange={setOpen}
        editing={editing}
        onSave={(c) => {
          if (editing) {
            setItems((a) => a.map((x) => (x.id === c.id ? c : x)));
            toast.success("Category updated");
          } else {
            setItems((a) => [{ ...c, id: `c${Date.now()}`, totalFoods: 0, createdAt: new Date().toISOString() }, ...a]);
            toast.success("Category added");
          }
          setOpen(false);
        }}
      />
    </AppLayout>
  );
}

import { useEffect } from "react";
function CategoryDialog({
  open,
  onOpenChange,
  editing,
  onSave,
}: {
  open: boolean;
  onOpenChange: (b: boolean) => void;
  editing: Category | null;
  onSave: (c: Category) => void;
}) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [icon, setIcon] = useState("🍽️");
  useEffect(() => {
    setName(editing?.name ?? "");
    setDesc(editing?.description ?? "");
    setIcon(editing?.icon ?? "🍽️");
  }, [editing, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>{editing ? "Edit category" : "Add category"}</DialogTitle></DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid gap-1.5"><Label>Icon</Label><Input value={icon} onChange={(e) => setIcon(e.target.value)} maxLength={2} /></div>
          <div className="grid gap-1.5"><Label>Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
          <div className="grid gap-1.5"><Label>Description</Label><Textarea rows={2} value={desc} onChange={(e) => setDesc(e.target.value)} /></div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={() => onSave({ id: editing?.id ?? "", name, description: desc, icon, totalFoods: editing?.totalFoods ?? 0, createdAt: editing?.createdAt ?? new Date().toISOString() })}>
            {editing ? "Save" : "Add"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
