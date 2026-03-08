import Header from "@/components/Header";
import Footer from "@/components/Footer";
import QuizCard from "@/components/QuizCard";
import PostCard from "@/components/PostCard";
import CategoryCard from "@/components/CategoryCard";
import BuzzChatCard from "@/components/BuzzChatCard";
import AdPlaceholder from "@/components/AdPlaceholder";
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
        {/* Hero */}
        <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-10 md:py-16">
          <div className="container text-center">
            <h1 className="font-display text-3xl font-black leading-tight text-foreground md:text-5xl">
              Ανακάλυψε, Παίξε,
              <br />
              <span className="text-primary">Μοιράσου!</span>
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-base text-muted-foreground">
              Quizzes, trending news, celebrity gossip και community discussions — όλα στα Ελληνικά.
            </p>
          </div>
        </section>

        {/* Ad */}
        <div className="container py-4">
          <AdPlaceholder format="leaderboard" />
        </div>

        {/* Trending Posts */}
        <section className="container py-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-display text-2xl font-bold text-foreground">🔥 Trending</h2>
            <Link to="/trending" className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
              Όλα <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {trendingPosts.slice(0, 1).map((post) => (
              <div key={post.id} className="md:col-span-2 lg:col-span-2">
                <PostCard post={post} variant="large" />
              </div>
            ))}
            <div className="flex flex-col gap-4">
              {trendingPosts.slice(1, 4).map((post) => (
                <PostCard key={post.id} post={post} variant="compact" />
              ))}
            </div>
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
