import Header from "@/components/Header";
import Footer from "@/components/Footer";
import QuizCard from "@/components/QuizCard";
import PostCard from "@/components/PostCard";
import CategoryCard from "@/components/CategoryCard";
import BuzzChatCard from "@/components/BuzzChatCard";
import AdPlaceholder from "@/components/AdPlaceholder";
import ReactionBar from "@/components/ReactionBar";
import { categories, getTrendingQuizzes, getPopularQuizzes } from "@/data/sampleQuizzes";
import { getTrendingPosts, getPostsByType, sampleBuzzChats } from "@/data/samplePosts";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const trendingQuizzes = getTrendingQuizzes();
  const popular = getPopularQuizzes();
  const trendingPosts = getTrendingPosts();
  const shoppingPosts = getPostsByType("shopping");
  const celebrityPosts = getPostsByType("celebrity");

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Trending Hero — BuzzFeed style numbered grid */}
        <section className="container py-6">
          <div className="grid gap-4 md:grid-cols-4 md:grid-rows-1">
            {/* #1 — Large featured card */}
            {trendingPosts.slice(0, 1).map((post, i) => (
              <Link
                key={post.id}
                to={`/post/${post.id}`}
                className="group relative col-span-1 row-span-1 overflow-hidden rounded-xl md:col-span-2 md:row-span-1 aspect-[4/5] md:aspect-auto"
              >
                <img
                  src={post.image}
                  alt={post.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <span className="font-display text-5xl font-black text-white/30 md:text-7xl">{i + 1}</span>
                  <h2 className="font-display text-lg font-bold leading-tight text-white md:text-2xl">
                    {post.title}
                  </h2>
                  <div className="mt-2">
                    <ReactionBar reactions={post.reactions} compact />
                  </div>
                </div>
              </Link>
            ))}
            {/* #2, #3, #4 — Smaller cards */}
            {trendingPosts.slice(1, 4).map((post, i) => (
              <Link
                key={post.id}
                to={`/post/${post.id}`}
                className="group flex flex-col overflow-hidden rounded-xl"
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute bottom-2 left-3 font-display text-4xl font-black text-white/40 md:text-5xl">
                    {i + 2}
                  </span>
                </div>
                <h3 className="mt-2 font-display text-sm font-bold leading-tight text-foreground group-hover:text-primary md:text-base">
                  {post.title}
                </h3>
                <div className="mt-1.5">
                  <ReactionBar reactions={post.reactions} compact />
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-4 text-right">
            <Link to="/trending" className="text-sm font-semibold text-primary hover:underline">
              See All Trending <ArrowRight className="inline h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* Popular Quizzes */}
        <section className="bg-muted/40 py-10">
          <div className="container">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-display text-2xl font-bold text-foreground">🧠 Δημοφιλή Quizzes</h2>
              <Link to="/categories" className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                Όλα <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {popular.slice(0, 3).map((quiz) => (
                <QuizCard key={quiz.id} quiz={quiz} />
              ))}
            </div>
          </div>
        </section>

        {/* Ad */}
        <div className="container py-4">
          <AdPlaceholder format="native" />
        </div>

        {/* Buzz Chat */}
        <section className="container py-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-display text-2xl font-bold text-foreground">💬 Buzz Chat</h2>
            <Link to="/buzzchat" className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
              Όλα <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {sampleBuzzChats.slice(0, 2).map((chat) => (
              <BuzzChatCard key={chat.id} chat={chat} variant="featured" />
            ))}
          </div>
        </section>

        {/* Shopping + Celebrity side by side */}
        <section className="bg-muted/40 py-10">
          <div className="container">
            <div className="grid gap-8 lg:grid-cols-2">
              {/* Shopping */}
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="font-display text-xl font-bold text-foreground">🛍️ Shopping</h2>
                  <Link to="/shopping" className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                    Όλα <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
                <div className="flex flex-col gap-3">
                  {shoppingPosts.map((post) => (
                    <PostCard key={post.id} post={post} variant="compact" />
                  ))}
                </div>
              </div>
              {/* Celebrity */}
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="font-display text-xl font-bold text-foreground">⭐ Celebrity</h2>
                  <Link to="/celebrity" className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                    Όλα <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
                <div className="flex flex-col gap-3">
                  {celebrityPosts.map((post) => (
                    <PostCard key={post.id} post={post} variant="compact" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="container py-10">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-display text-2xl font-bold text-foreground">📂 Κατηγορίες Quiz</h2>
            <Link to="/categories" className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
              Όλες <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {categories.map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        </section>

        {/* Ad */}
        <div className="container pb-8">
          <AdPlaceholder format="leaderboard" />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
