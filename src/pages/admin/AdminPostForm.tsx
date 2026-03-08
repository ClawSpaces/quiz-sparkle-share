import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type PostType = Database["public"]["Enums"]["post_type"];

export default function AdminPostForm() {
  const { id } = useParams();
  const isEdit = id && id !== "new";
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [postType, setPostType] = useState<PostType>("article");
  const [categoryId, setCategoryId] = useState<string>("");
  const [isPublished, setIsPublished] = useState(false);
  const [isTrending, setIsTrending] = useState(false);

  const { data: categories } = useQuery({
    queryKey: ["admin-categories-list"],
    queryFn: async () => {
      const { data } = await supabase.from("categories").select("id, name").order("name");
      return data ?? [];
    },
  });

  const { data: post } = useQuery({
    queryKey: ["admin-post", id],
    enabled: !!isEdit,
    queryFn: async () => {
      const { data, error } = await supabase.from("posts").select("*").eq("id", id!).single();
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setDescription(post.description ?? "");
      setContent(post.content ?? "");
      setImageUrl(post.image_url ?? "");
      setPostType(post.post_type);
      setCategoryId(post.category_id ?? "");
      setIsPublished(post.is_published);
      setIsTrending(post.is_trending);
    }
  }, [post]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        title,
        description: description || null,
        content: content || null,
        image_url: imageUrl || null,
        post_type: postType,
        category_id: categoryId || null,
        is_published: isPublished,
        is_trending: isTrending,
      };

      if (isEdit) {
        const { error } = await supabase.from("posts").update(payload).eq("id", id!);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("posts").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-posts"] });
      toast({ title: isEdit ? "Ενημερώθηκε" : "Δημιουργήθηκε" });
      navigate("/admin/posts");
    },
    onError: (err: any) => toast({ title: "Σφάλμα", description: err.message, variant: "destructive" }),
  });

  return (
    <div className="max-w-2xl">
      <Button variant="ghost" className="mb-4" onClick={() => navigate("/admin/posts")}>
        <ArrowLeft className="h-4 w-4 mr-2" /> Πίσω
      </Button>
      <h1 className="text-2xl font-bold mb-6">{isEdit ? "Επεξεργασία Post" : "Νέο Post"}</h1>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Τίτλος</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label>Περιγραφή</Label>
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
        </div>

        <div className="space-y-2">
          <Label>Περιεχόμενο</Label>
          <Textarea value={content} onChange={(e) => setContent(e.target.value)} rows={10} />
        </div>

        <div className="space-y-2">
          <Label>Image URL</Label>
          <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Τύπος</Label>
            <Select value={postType} onValueChange={(v) => setPostType(v as PostType)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="article">Article</SelectItem>
                <SelectItem value="shopping">Shopping</SelectItem>
                <SelectItem value="celebrity">Celebrity</SelectItem>
                <SelectItem value="trending_news">Trending News</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Κατηγορία</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger><SelectValue placeholder="Επιλέξτε..." /></SelectTrigger>
              <SelectContent>
                {categories?.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Switch checked={isPublished} onCheckedChange={setIsPublished} />
            <Label>Published</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={isTrending} onCheckedChange={setIsTrending} />
            <Label>Trending</Label>
          </div>
        </div>

        <Button onClick={() => saveMutation.mutate()} disabled={!title || saveMutation.isPending}>
          {saveMutation.isPending ? "Αποθήκευση..." : "Αποθήκευση"}
        </Button>
      </div>
    </div>
  );
}
