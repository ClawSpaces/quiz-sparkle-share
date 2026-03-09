import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Check, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

interface CategoryForm {
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  image_url: string;
}

export default function AdminCategories() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<CategoryForm>({ name: "", slug: "", description: "", icon: "📂", color: "primary", image_url: "" });
  const [showCreate, setShowCreate] = useState(false);

  const { data: categories, isLoading } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("categories").select("*").order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        name: form.name,
        slug: form.slug,
        description: form.description || null,
        icon: form.icon || "📂",
        color: form.color || "primary",
        image_url: form.image_url || null,
      };

      if (editId) {
        const { error } = await supabase.from("categories").update(payload).eq("id", editId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("categories").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      toast({ title: editId ? "Ενημερώθηκε" : "Δημιουργήθηκε" });
      resetForm();
    },
    onError: (err: any) => toast({ title: "Σφάλμα", description: err.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("categories").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      toast({ title: "Διαγράφηκε" });
      setDeleteId(null);
    },
    onError: (err: any) => toast({ title: "Σφάλμα", description: err.message, variant: "destructive" }),
  });

  const resetForm = () => {
    setForm({ name: "", slug: "", description: "", icon: "📂", color: "primary", image_url: "" });
    setEditId(null);
    setShowCreate(false);
  };

  const startEdit = (cat: any) => {
    setEditId(cat.id);
    setForm({
      name: cat.name,
      slug: cat.slug,
      description: cat.description ?? "",
      icon: cat.icon ?? "📂",
      color: cat.color ?? "primary",
      image_url: cat.image_url ?? "",
    });
    setShowCreate(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Categories</h1>
        <Button onClick={() => { resetForm(); setShowCreate(true); }}>
          <Plus className="h-4 w-4 mr-2" /> Νέα Κατηγορία
        </Button>
      </div>

      {showCreate && (
        <div className="mb-6 p-4 border rounded-lg bg-card space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Input placeholder="Όνομα" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Input placeholder="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
            <Input placeholder="Περιγραφή" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <div className="flex gap-2">
              <Input placeholder="Icon" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} className="w-20" />
              <Input placeholder="Color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} />
            </div>
            <Input placeholder="Image URL" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={() => saveMutation.mutate()} disabled={!form.name || !form.slug}>
              <Check className="h-4 w-4 mr-1" /> {editId ? "Ενημέρωση" : "Δημιουργία"}
            </Button>
            <Button size="sm" variant="ghost" onClick={resetForm}>
              <X className="h-4 w-4 mr-1" /> Ακύρωση
            </Button>
          </div>
        </div>
      )}

      {isLoading ? (
        <p className="text-muted-foreground">Φόρτωση...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Icon</TableHead>
              <TableHead>Όνομα</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Περιγραφή</TableHead>
              <TableHead className="text-right">Ενέργειες</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories?.map((cat) => (
              <TableRow key={cat.id}>
                <TableCell>{cat.icon}</TableCell>
                <TableCell className="font-medium">{cat.name}</TableCell>
                <TableCell className="text-muted-foreground">{cat.slug}</TableCell>
                <TableCell className="max-w-[200px] truncate">{cat.description ?? "—"}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => startEdit(cat)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => setDeleteId(cat.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Διαγραφή Κατηγορίας</DialogTitle>
          </DialogHeader>
          <p>Είστε σίγουροι ότι θέλετε να διαγράψετε αυτή την κατηγορία;</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Ακύρωση</Button>
            <Button variant="destructive" onClick={() => deleteId && deleteMutation.mutate(deleteId)}>
              Διαγραφή
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
