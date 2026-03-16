import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { formatViews, timeAgo, type Post } from "@/data/samplePosts";
import AdSlot from "@/components/AdSlot";

const ContentSidebar = () => {
  const [popularQuizzes, setPopularQuizzes] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [latestPosts, setLatestPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [qRes, cRes, pRes] = await Promise.all([
        supabase.from("quizzes").select("id, title, image_url, plays_count, categories(name, slug)").eq("is_published", true).order("plays_count", { ascending: false }).limit(5),
        supabase.from("categories").select("id, name, slug").order("sort_order"),
        supabase.from("posts").select("id, title, image_url, views_count, created_at").eq("is_published", true).order("created_at", { ascending: false }).limit(5),
      ]);
      if (qRes.data) setPopularQuizzes(qRes.data);
      if (cRes.data) setCategories(cRes.data);
      if (pRes.data) setLatestPosts(pRes.data as any);
    };
    fetchData();
  }, []);

  return (
    <aside className="hidden md:block md:w-[25%] flex-shrink-0">
      <div className="sticky top-4 space-y-6">
              <AdSlot format="rectangle" ezoicId={109} />
        <div className="overflow-hidden rounded-lg border border-border">
          <div className="bg-foreground px-4 py-2.5">
            <h3 className="font-display text-sm font-extrabold uppercase tracking-wide text-background">Latest Posts</h3>
          </div>
          <div className="divide-y divide-border">
            {latestPosts.map((post, i) => (
              <a key={post.id} href={`/post/${post.id}`} className="group flex items-start gap-3 p-3 transition-colors hover:bg-muted/50">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded bg-destructive text-xs font-bold text-destructive-foreground">{i + 1}</span>
                <div className="h-12 w-16 flex-shrink-0 overflow-hidden rounded">
                  <img src={post.image_url || "/placeholder.svg"} alt={post.title} className="h-full w-full object-cover" loading="lazy" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold leading-tight text-foreground group-hover:text-primary line-clamp-2">{post.title}</h4>
                  <span className="mt-0.5 block text-[10px] text-muted-foreground">{timeAgo(post.created_at)}</span>
                </div>
              </a>
            ))}
          </div>
        </div>

        {popularQuizzes.length > 0 && (
          <div className="overflow-hidden rounded-lg border border-border">
            <div className="bg-foreground px-4 py-2.5">
              <h3 className="font-display text-sm font-extrabold uppercase tracking-wide text-background">Popular Quizzes</h3>
            </div>
            <div className="divide-y divide-border">
              {popularQuizzes.map((quiz, i) => (
                <a key={quiz.id} href={`/quiz/${quiz.id}`} className="group flex items-start gap-3 p-3 transition-colors hover:bg-muted/50">
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded bg-primary text-xs font-bold text-primary-foreground">{i + 1}</span>
                  {quiz.image_url && (
                    <div className="h-12 w-16 flex-shrink-0 overflow-hidden rounded">
                      <img src={quiz.image_url} alt={quiz.title} className="h-full w-full object-cover" loading="lazy" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold leading-tight text-foreground group-hover:text-primary line-clamp-2">{quiz.title}</h4>
                    <span className="mt-0.5 block text-[10px] text-muted-foreground">{formatViews(quiz.plays_count)} plays</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {categories.length > 0 && (
          <div className="overflow-hidden rounded-lg border border-border">
            <div className="bg-foreground px-4 py-2.5">
              <h3 className="font-display text-sm font-extrabold uppercase tracking-wide text-background">Categories</h3>
            </div>
            <div className="p-3">
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <a key={cat.id} href={`/category/${cat.slug}`} className="rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-semibold text-foreground transition-colors hover:bg-primary hover:text-primary-foreground">
                    {cat.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}

        <AdSlot format="rectangle" />
      </div>
    </aside>
  );
};

export default ContentSidebar;
