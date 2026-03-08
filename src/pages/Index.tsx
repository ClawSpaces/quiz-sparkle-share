import Header from "@/components/Header";
import Footer from "@/components/Footer";
import QuizCard from "@/components/QuizCard";
import PostCard from "@/components/PostCard";
import CategoryCard from "@/components/CategoryCard";
import BuzzChatCard from "@/components/BuzzChatCard";
import AdPlaceholder from "@/components/AdPlaceholder";
import ReactionBar from "@/components/ReactionBar";
import { categories, getTrendingQuizzes, getPopularQuizzes } from "@/data/sampleQuizzes";
import { getTrendingPosts, getPostsByType, samplePosts, sampleBuzzChats, formatViews, timeAgo } from "@/data/samplePosts";
import { ArrowRight, Eye } from "lucide-react";
import { Link } from "react-router-dom";

const SectionHeader = ({ title, link, linkText = "See All" }: { title: string; link: string; linkText?: string }) => (
  <div className="mb-4 flex items-center justify-between border-b-2 border-foreground/10 pb-2">
    <h2 className="font-display text-lg font-extrabold uppercase tracking-wide text-foreground md:text-xl">
      {title}
    </h2>
    <Link to={link} className="flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-primary hover:underline">
      {linkText} <ArrowRight className="h-3.5 w-3.5" />
    </Link>
  </div>
);

const Index = () => {
  const popular = getPopularQuizzes();
  const trendingPosts = getTrendingPosts();
  const shoppingPosts = getPostsByType("shopping");
  const celebrityPosts = getPostsByType("celebrity");
  // Remaining posts not in trending for the "Latest" feed
  const trendingIds = new Set(trendingPosts.map((p) => p.id));
  const latestPosts = samplePosts.filter((p) => !trendingIds.has(p.id));

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* ===== 1. TRENDING NOW ===== */}
        <section className="container py-4 md:py-6">
          <SectionHeader title="Trending Now" link="/trending" />

          {/* Desktop: 4-col BuzzFeed-style grid */}
          <div className="hidden md:grid md:grid-cols-4 md:gap-4">
            {trendingPosts.slice(0, 4).map((post, i) => (
              <Link
                key={post.id}
                to={`/post/${post.id}`}
                className="group flex flex-col overflow-hidden"
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute bottom-2 left-2 font-display text-4xl font-black leading-none text-primary-foreground/30">
                    {i + 1}
                  </span>
                </div>
                <h3 className={`mt-2 font-bold leading-tight text-foreground group-hover:text-primary ${i === 0 ? "text-base" : "text-sm"}`}>
                  {post.title}
                </h3>
                <div className="mt-1.5">
                  <ReactionBar reactions={post.reactions} compact />
                </div>
              </Link>
            ))}
          </div>

          {/* Mobile: #1 full-width hero + #2-#4 horizontal list */}
          <div className="md:hidden">
            {trendingPosts.slice(0, 1).map((post) => (
              <Link
                key={post.id}
                to={`/post/${post.id}`}
                className="group relative block overflow-hidden rounded-lg"
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <span className="inline-block rounded bg-destructive px-2 py-0.5 text-[10px] font-bold uppercase text-destructive-foreground">
                    Trending
                  </span>
                  <h2 className="mt-1 font-display text-base font-bold leading-tight text-primary-foreground">
                    {post.title}
                  </h2>
                  <span className="mt-1 block text-[11px] text-primary-foreground/70">
                    {timeAgo(post.createdAt)} · {formatViews(post.views)} views
                  </span>
                </div>
              </Link>
            ))}

            <div className="mt-3 flex flex-col">
              {trendingPosts.slice(1, 4).map((post, i) => (
                <Link
                  key={post.id}
                  to={`/post/${post.id}`}
                  className="group flex items-center gap-3 border-b border-border py-3 last:border-b-0"
                >
                  <span className="font-display text-2xl font-black text-muted-foreground/40 w-7 text-center flex-shrink-0">
                    {i + 2}
                  </span>
                  <div className="h-16 w-20 flex-shrink-0 overflow-hidden rounded-lg">
                    <img src={post.image} alt={post.title} className="h-full w-full object-cover" loading="lazy" />
                  </div>
                  <div className="flex flex-1 flex-col justify-center">
                    <h3 className="text-sm font-bold leading-tight text-foreground group-hover:text-primary line-clamp-2">
                      {post.title}
                    </h3>
                    <span className="mt-0.5 text-[11px] text-muted-foreground">
                      {timeAgo(post.createdAt)} · {formatViews(post.views)} views
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ===== 2. AD ===== */}
        <div className="container py-2">
          <AdPlaceholder format="native" />
        </div>

        {/* ===== 3. POPULAR QUIZZES ===== */}
        <section className="border-t border-border bg-muted/30 py-4 md:py-8">
          <div className="container">
            <SectionHeader title="Popular Quizzes" link="/categories" linkText="Όλα" />
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-6">
              {popular.slice(0, 3).map((quiz) => (
                <QuizCard key={quiz.id} quiz={quiz} />
              ))}
            </div>
          </div>
        </section>

        {/* ===== 4. AD ===== */}
        <div className="container py-2">
          <AdPlaceholder format="banner" />
        </div>

        {/* ===== 5. LATEST NEWS FEED ===== */}
        <section className="container py-4 md:py-8">
          <SectionHeader title="Latest" link="/trending" linkText="Περισσότερα" />
          {/* Mobile: list cards | Desktop: 3-col grid */}
          <div className="md:hidden">
            {latestPosts.map((post) => (
              <PostCard key={post.id} post={post} variant="list" />
            ))}
          </div>
          <div className="hidden md:grid md:grid-cols-3 md:gap-5">
            {latestPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </section>

        {/* ===== 6. BUZZ CHAT ===== */}
        <section className="border-t border-border bg-muted/30 py-4 md:py-8">
          <div className="container">
            <SectionHeader title="Buzz Chat" link="/buzzchat" linkText="Όλα" />
            <div className="grid gap-4 md:grid-cols-2">
              {sampleBuzzChats.slice(0, 2).map((chat) => (
                <BuzzChatCard key={chat.id} chat={chat} variant="featured" />
              ))}
            </div>
          </div>
        </section>

        {/* ===== 7. SHOPPING + CELEBRITY ===== */}
        <section className="container py-4 md:py-8">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <SectionHeader title="Shopping" link="/shopping" linkText="Όλα" />
              <div className="flex flex-col">
                {shoppingPosts.map((post) => (
                  <PostCard key={post.id} post={post} variant="list" />
                ))}
              </div>
            </div>
            <div>
              <SectionHeader title="Celebrity" link="/celebrity" linkText="Όλα" />
              <div className="flex flex-col">
                {celebrityPosts.map((post) => (
                  <PostCard key={post.id} post={post} variant="list" />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ===== 8. QUIZ CATEGORIES ===== */}
        <section className="border-t border-border bg-muted/30 py-4 md:py-8">
          <div className="container">
            <SectionHeader title="Quiz Categories" link="/categories" linkText="Όλες" />
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5">
              {categories.map((cat) => (
                <CategoryCard key={cat.id} category={cat} />
              ))}
            </div>
          </div>
        </section>

        {/* ===== 9. AD ===== */}
        <div className="container py-4">
          <AdPlaceholder format="leaderboard" />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
