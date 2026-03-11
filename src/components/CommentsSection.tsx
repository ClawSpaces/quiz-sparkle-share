import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Send } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

interface Comment {
  id: string;
  author_name: string;
  comment_text: string;
  created_at: string;
}

interface CommentsSectionProps {
  contentType: "quiz" | "post";
  contentId: string;
}

const CommentsSection = ({ contentType, contentId }: CommentsSectionProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      const { data } = await supabase
        .from("comments")
        .select("*")
        .eq("content_type", contentType)
        .eq("content_id", contentId)
        .order("created_at", { ascending: false });
      if (data) setComments(data as Comment[]);
      setLoading(false);
    };
    fetchComments();

    const channel = supabase
      .channel(`comments-${contentId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "comments",
          filter: `content_id=eq.${contentId}`,
        },
        (payload) => {
          setComments((prev) => [payload.new as Comment, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [contentType, contentId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !text.trim()) return;

    setSubmitting(true);
    const { error } = await supabase.from("comments").insert({
      content_type: contentType,
      content_id: contentId,
      author_name: name.trim(),
      comment_text: text.trim(),
    });

    if (error) {
      toast({ title: "Error", description: "Could not submit your comment.", variant: "destructive" });
    } else {
      setText("");
      toast({ title: "Success!", description: "Your comment has been posted." });
    }
    setSubmitting(false);
  };

  return (
    <div className="mt-10">
      <div className="flex items-center gap-2 mb-6">
        <MessageCircle className="h-5 w-5 text-primary" />
        <h3 className="font-display text-xl font-bold text-foreground">
          Comments ({comments.length})
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="mb-8 rounded-xl border border-border bg-card p-4 space-y-3">
        <Input
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={50}
          required
        />
        <Textarea
          placeholder="Write a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={1000}
          rows={3}
          required
        />
        <Button type="submit" disabled={submitting || !name.trim() || !text.trim()} className="gap-2">
          <Send className="h-4 w-4" />
          {submitting ? "Submitting..." : "Post Comment"}
        </Button>
      </form>

      {loading ? (
        <div className="text-center text-muted-foreground text-sm py-8">Loading comments...</div>
      ) : comments.length === 0 ? (
        <div className="text-center text-muted-foreground text-sm py-8 rounded-xl border border-dashed border-border">
          No comments yet. Be the first to comment!
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((c) => (
            <div key={c.id} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {c.author_name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <span className="text-sm font-semibold text-foreground">{c.author_name}</span>
                  <span className="ml-2 text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(c.created_at), { addSuffix: true })}
                  </span>
                </div>
              </div>
              <p className="text-sm text-foreground leading-relaxed pl-10">{c.comment_text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentsSection;
