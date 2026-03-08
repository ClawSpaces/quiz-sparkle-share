import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { samplePosts, type Post } from "@/data/samplePosts";
import QuizCard from "@/components/QuizCard";
import PostCard from "@/components/PostCard";
import { ArrowRight } from "lucide-react";

interface MoreFromSiteProps {
  currentId: string;
  currentType: "quiz" | "post";
}

interface QuizItem {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  plays_count: number;
  categories: { name: string; slug: string } | null;
}

type FeedItem =
  | { kind: "quiz"; data: QuizItem }
  | { kind: "post"; data: Post };

const MoreFromSite = ({ currentId, currentType }: MoreFromSiteProps) => {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMixed = async () => {
      // Fetch quizzes
      const quizQuery = supabase
        .from("quizzes")
        .select("id, title, description, image_url, plays_count, categories(name, slug)")
        .eq("is_published", true)
        .limit(12)
        .order("created_at", { ascending: false });

      if (currentType === "quiz") {
        quizQuery.neq("id", currentId);
      }

      const { data: quizData } = await quizQuery;
      const quizItems: FeedItem[] = ((quizData as QuizItem[]) || []).map((q) => ({
        kind: "quiz" as const,
        data: q,
      }));

      // Get posts from sample data
      const postItems: FeedItem[] = samplePosts
        .filter((p) => !(currentType === "post" && p.id === currentId))
        .slice(0, 12)
        .map((p) => ({ kind: "post" as const, data: p }));

      // Interleave: quiz, post, quiz, post...
      const merged: FeedItem[] = [];
      const maxLen = Math.max(quizItems.length, postItems.length);
      for (let i = 0; i < maxLen; i++) {
        if (i < quizItems.length) merged.push(quizItems[i]);
        if (i < postItems.length) merged.push(postItems[i]);
      }

      setItems(merged.slice(0, 18));
      setLoading(false);
    };
    fetchMixed();
  }, [currentId, currentType]);

  if (loading || items.length === 0) return null;

  return (
    <section className="border-t border-border pt-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display text-xl font-black text-foreground md:text-2xl">
          Περισσότερα από Frenzy
        </h2>
        <Link
          to="/"
          className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
        >
          Δες όλα <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {items.map((item, idx) =>
          item.kind === "quiz" ? (
            <QuizCard key={`q-${item.data.id}-${idx}`} quiz={item.data} />
          ) : (
            <PostCard key={`p-${item.data.id}-${idx}`} post={item.data} />
          )
        )}
      </div>
    </section>
  );
};

export default MoreFromSite;
