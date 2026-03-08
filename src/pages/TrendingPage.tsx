import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PostCard from "@/components/PostCard";
import AdPlaceholder from "@/components/AdPlaceholder";
import { getPostsByType, getTrendingPosts } from "@/data/samplePosts";

const TrendingPage = () => {
  const trending = getTrendingPosts();
  const news = getPostsByType("trending_news");

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-to-br from-destructive/10 via-background to-primary/10 py-10">
          <div className="container text-center">
            <h1 className="font-display text-3xl font-black text-foreground md:text-5xl">
              🔥 Trending Τώρα
            </h1>
            <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
              Τα πιο viral άρθρα και βίντεο που σπάνε το internet αυτή τη στιγμή.
            </p>
          </div>
        </section>

        <div className="container py-4">
          <AdPlaceholder format="leaderboard" />
        </div>

        <section className="container py-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...news, ...trending].map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default TrendingPage;
