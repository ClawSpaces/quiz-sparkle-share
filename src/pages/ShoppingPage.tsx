import { useState, useEffect } from "react";
import Header from "@/components/Header";
import SEO from "@/components/SEO";
import Footer from "@/components/Footer";
import PostCard from "@/components/PostCard";
import AdSlot from "@/components/AdSlot";
import { supabase } from "@/integrations/supabase/client";
import type { Post } from "@/data/samplePosts";

const ShoppingPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("posts")
        .select("*, post_reactions(emoji, count)")
        .eq("is_published", true)
        .eq("post_type", "shopping")
        .order("created_at", { ascending: false });
      if (data) setPosts(data as any);
    };
    fetch();
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-to-br from-secondary/10 via-background to-accent/10 py-10">
          <div className="container text-center">
            <h1 className="font-display text-3xl font-black text-foreground md:text-5xl">🛍️ Shopping</h1>
            <p className="mx-auto mt-3 max-w-lg text-muted-foreground">The best products, deals and recommendations that are worth every penny.</p>
          </div>
        </section>
        <div className="container py-4"><AdSlot format="leaderboard" ezoicId={113} /></div>
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

export default ShoppingPage;
