import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BuzzChatCard from "@/components/BuzzChatCard";
import AdSlot from "@/components/AdSlot";
import { supabase } from "@/integrations/supabase/client";
import type { BuzzChat } from "@/data/samplePosts";

const BuzzChatPage = () => {
  const [chats, setChats] = useState<BuzzChat[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("buzz_chats")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });
      if (data) setChats(data as any);
    };
    fetch();
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-to-br from-accent/10 via-background to-primary/10 py-10">
          <div className="container text-center">
            <h1 className="font-display text-3xl font-black text-foreground md:text-5xl">💬 Fizz Chat</h1>
            <p className="mx-auto mt-3 max-w-lg text-muted-foreground">Join the conversation! Share your opinion and see what others think.</p>
          </div>
        </section>
        <div className="container py-4"><AdSlot format="leaderboard" /></div>
        <section className="container py-8">
          <div className="grid gap-6 md:grid-cols-2">
            {chats.map((chat) => (<BuzzChatCard key={chat.id} chat={chat} variant="featured" />))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default BuzzChatPage;
