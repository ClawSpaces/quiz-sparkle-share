import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PostCard from "@/components/PostCard";
import AdSlot from "@/components/AdSlot";
import { supabase } from "@/integrations/supabase/client";
import type { Post } from "@/data/samplePosts";

const TrendingPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("posts")
        .select("*, post_reactions(emoji, count)")
        .eq("is_published", true)
        .order("views_count", { ascending: false });
      if (data) setPosts(data as any);
    };
    fetch();
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-to-br from-destructive/10 via-background to-primary/10 py-10">
          <div className="container text-center">
            <h1 className="font-display text-3xl font-black text-foreground md:text-5xl">🔥 Trending Τώρα</h1>
            <p className="mx-auto mt-3 max-w-lg text-muted-foreground">Τα πιο viral άρθρα και βίντεο που σπάνε το internet αυτή τη στιγμή.</p>
          </div>
        </section>
        <div className="container py-4"><AdSlot format="leaderboard" /></div>
        <section className="container py-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (<PostCard key={post.id} post={post} />))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default TrendingPage;
