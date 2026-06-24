import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Eye, Pencil, Plus, Trash2 } from "lucide-react";
import { AppLayout } from "@/layouts/AppLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { SearchBar } from "@/components/shared/SearchBar";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { categories, foods as MOCK_FOODS } from "@/data/mock";
import { formatCurrency } from "@/lib/format";
import { toast } from "sonner";
import type { Food } from "@/types";

export const Route = createFileRoute("/menu")({
  head: () => ({ meta: [{ title: "Menu — Saffron" }] }),
  component: MenuPage,
});

const PAGE_SIZE = 8;

function MenuPage() {
  const [items, setItems] = useState<Food[]>(MOCK_FOODS);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [avail, setAvail] = useState("all");
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Food | null>(null);

  const filtered = useMemo(() => {
    return items.filter((f) => {
      if (q && !f.name.toLowerCase().includes(q.toLowerCase())) return false;
      if (cat !== "all" && f.categoryId !== cat) return false;
      if (avail === "available" && !f.available) return false;
      if (avail === "unavailable" && f.available) return false;
      return true;
    });
  }, [items, q, cat, avail]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const slice = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const onDelete = (id: string) => {
    setItems((arr) => arr.filter((f) => f.id !== id));
    toast.success("Item deleted");
  };

  return (
    <AppLayout>
      <PageHeader
        title="Menu"
        description="Manage food items across all categories"
        actions={
          <Button onClick={() => { setEditing(null); setOpen(true); }}>
            <Plus className="mr-1.5 h-4 w-4" /> Add food
          </Button>
        }
      />

      <Card>
        <CardContent className="p-4 md:p-5">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_180px_180px]">
            <SearchBar value={q} onChange={(v) => { setQ(v); setPage(1); }} placeholder="Search foods…" />
            <Select value={cat} onValueChange={(v) => { setCat(v); setPage(1); }}>
              <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={avail} onValueChange={(v) => { setAvail(v); setPage(1); }}>
              <SelectTrigger><SelectValue placeholder="Availability" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="unavailable">Unavailable</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mt-4 overflow-x-auto">
            {slice.length === 0 ? (
              <EmptyState title="No foods match" description="Try changing the filters or search." />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-14">Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead>Availability</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {slice.map((f) => (
                    <TableRow key={f.id}>
                      <TableCell>
                        <img src={f.image} alt={f.name} className="h-10 w-10 rounded-lg object-cover" />
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{f.name}</div>
                        <div className="text-xs text-muted-foreground line-clamp-1">{f.description}</div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{f.categoryName}</TableCell>
                      <TableCell className="text-right font-medium">{formatCurrency(f.price)}</TableCell>
                      <TableCell><StatusBadge status={f.available ? "Available" : "Inactive"} /></TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8"><Eye className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditing(f); setOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => onDelete(f.id)}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>

          <div className="mt-4 flex items-center justify-between text-sm">
            <p className="text-muted-foreground">
              Showing {(page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
            </p>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
              <Button variant="outline" size="sm" disabled={page === pages} onClick={() => setPage((p) => p + 1)}>Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <FoodDialog
        open={open}
        onOpenChange={setOpen}
        editing={editing}
        onSave={(food) => {
          if (editing) {
            setItems((arr) => arr.map((f) => (f.id === food.id ? food : f)));
            toast.success("Item updated");
          } else {
            setItems((arr) => [{ ...food, id: `f${Date.now()}` }, ...arr]);
            toast.success("Item added");
          }
          setOpen(false);
        }}
      />
    </AppLayout>
  );
}

function FoodDialog({
  open,
  onOpenChange,
  editing,
  onSave,
}: {
  open: boolean;
  onOpenChange: (b: boolean) => void;
  editing: Food | null;
  onSave: (f: Food) => void;
}) {
  const [name, setName] = useState(editing?.name ?? "");
  const [desc, setDesc] = useState(editing?.description ?? "");
  const [price, setPrice] = useState(editing?.price?.toString() ?? "");
  const [categoryId, setCategoryId] = useState(editing?.categoryId ?? categories[0].id);
  const [available, setAvailable] = useState(editing?.available ?? true);
  const [image, setImage] = useState(editing?.image ?? "");

  // reset when editing changes
  useMemoReset(editing, () => {
    setName(editing?.name ?? "");
    setDesc(editing?.description ?? "");
    setPrice(editing?.price?.toString() ?? "");
    setCategoryId(editing?.categoryId ?? categories[0].id);
    setAvailable(editing?.available ?? true);
    setImage(editing?.image ?? "");
  });

  const submit = () => {
    const cat = categories.find((c) => c.id === categoryId)!;
    onSave({
      id: editing?.id ?? "",
      name,
      description: desc,
      price: Number(price) || 0,
      image: image || "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80",
      categoryId,
      categoryName: cat.name,
      available,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit food" : "Add food"}</DialogTitle>
          <DialogDescription>Items appear on your menu and in order creation.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid gap-1.5">
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Margherita Pizza" />
          </div>
          <div className="grid gap-1.5">
            <Label>Description</Label>
            <Textarea rows={2} value={desc} onChange={(e) => setDesc(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label>Price (USD)</Label>
              <Input type="number" step="0.5" value={price} onChange={(e) => setPrice(e.target.value)} />
            </div>
            <div className="grid gap-1.5">
              <Label>Category</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label>Image URL</Label>
            <Input value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://…" />
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border p-3">
            <div>
              <p className="text-sm font-medium">Available</p>
              <p className="text-xs text-muted-foreground">Customers can order this item</p>
            </div>
            <Switch checked={available} onCheckedChange={setAvailable} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit}>{editing ? "Save changes" : "Add food"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// tiny helper: re-run effect when key prop changes
import { useEffect } from "react";
function useMemoReset<T>(key: T, fn: () => void) {
  useEffect(fn, [key]); // eslint-disable-line react-hooks/exhaustive-deps
}
