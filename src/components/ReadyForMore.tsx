import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Post } from "@/data/samplePosts";
import QuizCard from "@/components/QuizCard";
import PostCard from "@/components/PostCard";
import { Sparkles } from "lucide-react";

interface ReadyForMoreProps {
  currentId: string;
  type: "quiz" | "post";
  categoryId?: string | null;
}

interface QuizItem {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  plays_count: number;
  categories: { name: string; slug: string } | null;
}

const ReadyForMore = ({ currentId, type, categoryId }: ReadyForMoreProps) => {
  const [quizzes, setQuizzes] = useState<QuizItem[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (type === "quiz") {
      const fetchQuizzes = async () => {
        let query = supabase
          .from("quizzes")
          .select("id, title, description, image_url, plays_count, categories(name, slug)")
          .eq("is_published", true)
          .neq("id", currentId)
          .limit(6);
        if (categoryId) query = query.eq("category_id", categoryId);
        const { data } = await query.order("plays_count", { ascending: false });
        let items = (data as QuizItem[]) || [];
        if (items.length < 6 && categoryId) {
          const existingIds = [currentId, ...items.map((i) => i.id)];
          const { data: more } = await supabase
            .from("quizzes")
            .select("id, title, description, image_url, plays_count, categories(name, slug)")
            .eq("is_published", true)
            .not("id", "in", `(${existingIds.join(",")})`)
            .limit(6 - items.length)
            .order("plays_count", { ascending: false });
          if (more) items = [...items, ...(more as QuizItem[])];
        }
        setQuizzes(items);
        setLoading(false);
      };
      fetchQuizzes();
    } else {
      const fetchPosts = async () => {
        const { data } = await supabase
          .from("posts")
          .select("*, post_reactions(emoji, count)")
          .eq("is_published", true)
          .neq("id", currentId)
          .order("views_count", { ascending: false })
          .limit(6);
        if (data) setPosts(data as any);
        setLoading(false);
      };
      fetchPosts();
    }
  }, [currentId, type, categoryId]);

  if (loading) return null;
  const hasItems = type === "quiz" ? quizzes.length > 0 : posts.length > 0;
  if (!hasItems) return null;

  return (
    <section className="border-t border-border pt-8">
      <div className="mb-6 flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-primary" />
        <h2 className="font-display text-xl font-black text-foreground md:text-2xl">Θέλεις κι άλλα;</h2>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {type === "quiz"
          ? quizzes.map((q) => <QuizCard key={q.id} quiz={q} />)
          : posts.map((p) => <PostCard key={p.id} post={p} />)}
      </div>
    </section>
  );
};

export default ReadyForMore;
