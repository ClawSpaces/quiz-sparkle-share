import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import QuizCard from "@/components/QuizCard";
import { categories, sampleQuizzes, getTrendingQuizzes } from "@/data/sampleQuizzes";
import { Play } from "lucide-react";

const formatPlays = (n: number) => {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
};

const QuizzesPage = () => {
  const [activeFilter, setActiveFilter] = useState("all");

  const filters = [
    { label: "Όλα", value: "all" },
    ...categories.map((c) => ({ label: c.name, value: c.slug })),
  ];

  const trending = getTrendingQuizzes();
  const featured = trending[0];

  const filtered =
    activeFilter === "all"
      ? sampleQuizzes
      : sampleQuizzes.filter((q) => q.categorySlug === activeFilter);

  const remaining = filtered.filter((q) => q.id !== featured?.id);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Title */}
        <section className="border-b border-border bg-card py-8 md:py-12">
          <div className="container">
            <h1 className="font-display text-4xl font-black tracking-tight text-foreground md:text-5xl">
              Quizzes
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              Personality quizzes, trivia, και πολλά άλλα!
            </p>
          </div>
        </section>

        {/* Category filter chips */}
        <section className="border-b border-border bg-card">
          <div className="container">
            <div className="flex gap-2 overflow-x-auto py-4 scrollbar-none">
              {filters.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setActiveFilter(f.value)}
                  className={`flex-shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                    activeFilter === f.value
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Featured quiz hero */}
        {featured && activeFilter === "all" && (
          <section className="container py-8">
            <Link
              to={`/quiz/${featured.id}`}
              className="group relative block overflow-hidden rounded-2xl bg-card shadow-lg transition-all hover:shadow-xl"
            >
              <div className="aspect-[21/9] overflow-hidden md:aspect-[3/1]">
                <img
                  src={featured.image}
                  alt={featured.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                <span className="mb-2 inline-block rounded-full bg-primary px-3 py-1 text-xs font-bold uppercase text-primary-foreground">
                  {featured.category}
                </span>
                <h2 className="font-display text-2xl font-bold leading-tight text-primary-foreground md:text-4xl">
                  {featured.title}
                </h2>
                <p className="mt-2 max-w-xl text-sm text-primary-foreground/80 md:text-base">
                  {featured.description}
                </p>
                <div className="mt-3 flex items-center gap-3 text-sm text-primary-foreground/70">
                  <span className="flex items-center gap-1">
                    <Play className="h-3 w-3" /> {formatPlays(featured.plays)} plays
                  </span>
                  <span>{featured.questionsCount} ερωτήσεις</span>
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* Trending section */}
        {activeFilter === "all" && trending.length > 1 && (
          <section className="container pb-8">
            <h2 className="mb-4 font-display text-xl font-bold text-foreground md:text-2xl">
              🔥 Trending Quizzes
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {trending.slice(1, 5).map((quiz) => (
                <Link
                  key={quiz.id}
                  to={`/quiz/${quiz.id}`}
                  className="group flex gap-4 rounded-xl bg-card p-3 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
                >
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg">
                    <img
                      src={quiz.image}
                      alt={quiz.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                      {quiz.category}
                    </span>
                    <h3 className="mt-1 text-sm font-bold leading-tight text-foreground group-hover:text-primary md:text-base">
                      {quiz.title}
                    </h3>
                    <span className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                      <Play className="h-3 w-3" /> {formatPlays(quiz.plays)} plays
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* All / filtered quizzes grid */}
        <section className="container pb-12">
          <h2 className="mb-4 font-display text-xl font-bold text-foreground md:text-2xl">
            {activeFilter === "all" ? "Περισσότερα Quizzes" : filters.find((f) => f.value === activeFilter)?.label}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {remaining.map((quiz) => (
              <QuizCard key={quiz.id} quiz={quiz} />
            ))}
          </div>
          {remaining.length === 0 && (
            <p className="py-12 text-center text-muted-foreground">
              Δεν βρέθηκαν quizzes σε αυτή την κατηγορία.
            </p>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default QuizzesPage;
