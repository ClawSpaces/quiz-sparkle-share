import { useState, useEffect } from "react";
import Header from "@/components/Header";
import SEO from "@/components/SEO";
import SchemaMarkup from "@/components/SchemaMarkup";
import Footer from "@/components/Footer";
import QuizCard from "@/components/QuizCard";
import PostCard from "@/components/PostCard";
import CategoryCard from "@/components/CategoryCard";
import BuzzChatCard from "@/components/BuzzChatCard";
import AdSlot from "@/components/AdSlot";
import ReactionBar from "@/components/ReactionBar";
import { supabase } from "@/integrations/supabase/client";
import { formatViews, timeAgo, reactionsToRecord, type Post, type BuzzChat } from "@/data/samplePosts";
import { ArrowRight, Eye } from "lucide-react";
import { Link } from "react-router-dom";

const handleImgError = (e: React.SyntheticEvent<HTMLImageElement>) => {
  e.currentTarget.src = '/placeholder.svg';
};

const SectionHeader = ({ title, link, linkText = "See All" }: { title: string; link: string; linkText?: string }) => (
  <div className="mb-4 flex items-center justify-between border-b-2 border-foreground/10 pb-2">
    <h2 className="font-display text-lg font-extrabold uppercase tracking-wide text-foreground md:text-xl">{title}</h2>
    <Link to={link} className="flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-primary hover:underline">
      {linkText} <ArrowRight className="h-3.5 w-3.5" />
    </Link>
  </div>
);

const Index = () => {
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [buzzChats, setBuzzChats] = useState<BuzzChat[]>([]);
  const [popularQuizzes, setPopularQuizzes] = useState<any[]>([]);
  const [dbCategories, setDbCategories] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [pRes, bcRes, qRes, cRes] = await Promise.all([
        supabase.from("posts").select("*, post_reactions(emoji, count)").eq("is_published", true).order("created_at", { ascending: false }),
        supabase.from("buzz_chats").select("*").eq("is_active", true).order("created_at", { ascending: false }),
        supabase.from("quizzes").select("*, categories(name, slug)").eq("is_published", true).order("plays_count", { ascending: false }).limit(6),
        supabase.from("categories").select("*").order("sort_order"),
      ]);
      if (pRes.data) setAllPosts(pRes.data as any);
      if (bcRes.data) setBuzzChats(bcRes.data as any);
      if (qRes.data) setPopularQuizzes(qRes.data);
      if (cRes.data) setDbCategories(cRes.data);
    };
    fetchData();
  }, []);

  const trendingPosts = [...allPosts].filter(p => p.is_trending).sort((a, b) => b.views_count - a.views_count).slice(0, 5);
  const trendingIds = new Set(trendingPosts.map(p => p.id));
  const latestPosts = allPosts.filter(p => !trendingIds.has(p.id));
  const shoppingPosts = allPosts.filter(p => p.post_type === "shopping");
  const celebrityPosts = allPosts.filter(p => p.post_type === "celebrity");

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SEO title="Fizzty — Fun Quizzes, Trending Content & Viral Stories" description="Take free personality quizzes, trivia challenges and discover trending content. Find out who you really are with Fizzty!" />
      <Header />
      <main className="flex-1">
        <section className="container py-4 md:py-6">
          <SectionHeader title="Trending Now" link="/trending" />
          <div className="hidden md:grid md:grid-cols-2 md:gap-4">
            {trendingPosts.slice(0, 1).map((post) => {
              const reactions = reactionsToRecord(post.post_reactions);
              return (
                <a key={post.id} href={`/post/${post.id}`} className="group relative block overflow-hidden rounded-lg">
                  <div className="relative h-full min-h-[380px] overflow-hidden rounded-lg">
                    <img src={post.image_url || "/placeholder.svg"} alt={post.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" onError={handleImgError} />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <span className="inline-block rounded bg-destructive px-2 py-0.5 text-[10px] font-bold uppercase text-destructive-foreground">Trending</span>
                      <h3 className="mt-1.5 font-display text-xl font-bold leading-tight text-primary-foreground">{post.title}</h3>
                      <div className="mt-2"><ReactionBar reactions={reactions} compact /></div>
                    </div>
                  </div>
                </a>
              );
            })}
            <div className="grid grid-cols-2 gap-4">
              {trendingPosts.slice(1, 5).map((post, i) => {
                const reactions = reactionsToRecord(post.post_reactions);
                return (
                  <a key={post.id} href={`/post/${post.id}`} className="group flex flex-col overflow-hidden">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                      <img src={post.image_url || "/placeholder.svg"} alt={post.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" onError={handleImgError} />
                      <span className="absolute bottom-2 left-2 font-display text-3xl font-black leading-none text-primary-foreground/30">{i + 2}</span>
                    </div>
                    <h3 className="mt-2 text-sm font-bold leading-tight text-foreground group-hover:text-primary line-clamp-2">{post.title}</h3>
                    <div className="mt-1.5"><ReactionBar reactions={reactions} compact /></div>
                  </a>
                );
              })}
            </div>
          </div>
          <div className="md:hidden">
            {trendingPosts.slice(0, 1).map((post) => (
              <a key={post.id} href={`/post/${post.id}`} className="group relative block overflow-hidden rounded-lg">
                <div className="aspect-[16/10] overflow-hidden">
                  <img src={post.image_url || "/placeholder.svg"} alt={post.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" onError={handleImgError} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <span className="inline-block rounded bg-destructive px-2 py-0.5 text-[10px] font-bold uppercase text-destructive-foreground">Trending</span>
                  <h2 className="mt-1 font-display text-base font-bold leading-tight text-primary-foreground">{post.title}</h2>
                  <span className="mt-1 block text-[11px] text-primary-foreground/70">{timeAgo(post.created_at)} · {formatViews(post.views_count)} views</span>
                </div>
              </a>
            ))}
            <div className="mt-3 flex flex-col">
              {trendingPosts.slice(1, 4).map((post, i) => (
                <a key={post.id} href={`/post/${post.id}`} className="group flex items-center gap-3 border-b border-border py-3 last:border-b-0">
                  <span className="font-display text-2xl font-black text-muted-foreground/40 w-7 text-center flex-shrink-0">{i + 2}</span>
                  <div className="h-16 w-20 flex-shrink-0 overflow-hidden rounded-lg">
                    <img src={post.image_url || "/placeholder.svg"} alt={post.title} className="h-full w-full object-cover" loading="lazy" onError={handleImgError} />
                  </div>
                  <div className="flex flex-1 flex-col justify-center">
                    <h3 className="text-sm font-bold leading-tight text-foreground group-hover:text-primary line-clamp-2">{post.title}</h3>
                    <span className="mt-0.5 text-[11px] text-muted-foreground">{timeAgo(post.created_at)} · {formatViews(post.views_count)} views</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        <div className="container py-4 md:flex md:gap-6">
          <div className="flex-1 min-w-0">
            <div className="py-2"><AdSlot format="native" ezoicId={101} /></div>

            <section className="border-t border-border bg-muted/30 py-4 md:py-8 -mx-4 px-4 md:-mx-0 md:px-0 md:rounded-lg">
              <SectionHeader title="Popular Quizzes" link="/quizzes" />
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-6">
                {popularQuizzes.slice(0, 3).map((quiz) => (<QuizCard key={quiz.id} quiz={quiz} />))}
              </div>
            </section>

            <div className="py-2"><AdSlot format="banner" ezoicId={102} /></div>

            <section className="py-4 md:py-8">
              <SectionHeader title="Latest" link="/trending" linkText="More" />
              <div className="md:hidden">
                {latestPosts.map((post) => (<PostCard key={post.id} post={post} variant="list" />))}
              </div>
              <div className="hidden md:grid md:grid-cols-2 md:gap-5">
                {latestPosts.map((post) => (<PostCard key={post.id} post={post} />))}
              </div>
            </section>

            <section className="border-t border-border bg-muted/30 py-4 md:py-8 -mx-4 px-4 md:-mx-0 md:px-0 md:rounded-lg">
              <SectionHeader title="Fizz Chat" link="/buzzchat" />
              <div className="grid gap-4 md:grid-cols-2">
                {buzzChats.slice(0, 2).map((chat) => (<BuzzChatCard key={chat.id} chat={chat} variant="featured" />))}
              </div>
            </section>

            <section className="py-4 md:py-8">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <SectionHeader title="Shopping" link="/shopping" />
                  <div className="flex flex-col">{shoppingPosts.map((post) => (<PostCard key={post.id} post={post} variant="list" />))}</div>
                </div>
                <div>
                  <SectionHeader title="Celebrity" link="/celebrity" />
                  <div className="flex flex-col">{celebrityPosts.map((post) => (<PostCard key={post.id} post={post} variant="list" />))}</div>
                </div>
              </div>
            </section>

            <section className="border-t border-border bg-muted/30 py-4 md:py-8 -mx-4 px-4 md:-mx-0 md:px-0 md:rounded-lg">
              <SectionHeader title="Quiz Categories" link="/categories" />
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5">
                {dbCategories.map((cat) => (<CategoryCard key={cat.id} category={cat} />))}
              </div>
            </section>

            <div className="py-4"><AdSlot format="leaderboard" ezoicId={103} /></div>
          </div>

          <aside className="hidden md:block md:w-[25%] flex-shrink-0">
            <div className="sticky top-4 space-y-6">
              <AdSlot format="rectangle" ezoicId={104} />
              <div className="overflow-hidden rounded-lg border border-border">
                <div className="bg-foreground px-4 py-2.5">
                  <h3 className="font-display text-sm font-extrabold uppercase tracking-wide text-background">Latest Posts</h3>
                </div>
                <div className="divide-y divide-border">
                  {latestPosts.slice(0, 5).map((post, i) => (
                    <a key={post.id} href={`/post/${post.id}`} className="group flex items-start gap-3 p-3 transition-colors hover:bg-muted/50">
                      <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded bg-destructive text-xs font-bold text-destructive-foreground">{i + 1}</span>
                      <div className="h-12 w-16 flex-shrink-0 overflow-hidden rounded">
                        <img src={post.image_url || "/placeholder.svg"} alt={post.title} className="h-full w-full object-cover" loading="lazy" onError={handleImgError} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold leading-tight text-foreground group-hover:text-primary line-clamp-2">{post.title}</h4>
                        <span className="mt-0.5 block text-[10px] text-muted-foreground">{timeAgo(post.created_at)}</span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
              <div className="overflow-hidden rounded-lg border border-border">
                <div className="bg-foreground px-4 py-2.5">
                  <h3 className="font-display text-sm font-extrabold uppercase tracking-wide text-background">Trending</h3>
                </div>
                <div className="divide-y divide-border">
                  {trendingPosts.slice(0, 5).map((post, i) => (
                    <a key={post.id} href={`/post/${post.id}`} className="group flex items-start gap-3 p-3 transition-colors hover:bg-muted/50">
                      <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded bg-primary text-xs font-bold text-primary-foreground">{i + 1}</span>
                      <div className="h-12 w-16 flex-shrink-0 overflow-hidden rounded">
                        <img src={post.image_url || "/placeholder.svg"} alt={post.title} className="h-full w-full object-cover" loading="lazy" onError={handleImgError} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold leading-tight text-foreground group-hover:text-primary line-clamp-2">{post.title}</h4>
                        <span className="mt-0.5 block text-[10px] text-muted-foreground">{formatViews(post.views_count)} views</span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
              <div className="overflow-hidden rounded-lg border border-border">
                <div className="bg-foreground px-4 py-2.5">
                  <h3 className="font-display text-sm font-extrabold uppercase tracking-wide text-background">Categories</h3>
                </div>
                <div className="p-3">
                  <div className="flex flex-wrap gap-2">
                    {dbCategories.map((cat) => (
                      <a key={cat.id} href={`/category/${cat.slug}`} className="rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-semibold text-foreground transition-colors hover:bg-primary hover:text-primary-foreground">
                        {cat.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
