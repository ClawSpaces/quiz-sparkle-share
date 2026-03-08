import Header from "@/components/Header";
import Footer from "@/components/Footer";
import QuizCard from "@/components/QuizCard";
import CategoryCard from "@/components/CategoryCard";
import AdPlaceholder from "@/components/AdPlaceholder";
import { categories, getTrendingQuizzes, getPopularQuizzes } from "@/data/sampleQuizzes";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const trending = getTrendingQuizzes();
  const popular = getPopularQuizzes();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-12 md:py-20">
          <div className="container text-center">
            <h1 className="font-display text-4xl font-black leading-tight text-foreground md:text-6xl">
              Ανακάλυψε ποιος είσαι
              <br />
              <span className="text-primary">πραγματικά!</span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
              Πάρε τα πιο δημοφιλή quizzes, μάθε κρυφές αλήθειες για τον εαυτό σου και μοιράσου τα αποτελέσματα!
            </p>
          </div>
        </section>

        {/* Ad */}
        <div className="container py-4">
          <AdPlaceholder format="leaderboard" />
        </div>

        {/* Trending */}
        <section className="container py-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-display text-2xl font-bold text-foreground">
              🔥 Trending τώρα
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {trending.slice(0, 1).map((quiz) => (
              <div key={quiz.id} className="md:col-span-2 lg:col-span-2">
                <QuizCard quiz={quiz} variant="large" />
              </div>
            ))}
            <div className="flex flex-col gap-4">
              {trending.slice(1, 4).map((quiz) => (
                <QuizCard key={quiz.id} quiz={quiz} variant="compact" />
              ))}
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="bg-muted/40 py-10">
          <div className="container">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-display text-2xl font-bold text-foreground">
                📂 Κατηγορίες
              </h2>
              <Link
                to="/categories"
                className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                Όλες <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
              {categories.map((cat) => (
                <CategoryCard key={cat.id} category={cat} />
              ))}
            </div>
          </div>
        </section>

        {/* Ad */}
        <div className="container py-4">
          <AdPlaceholder format="native" />
        </div>

        {/* Popular */}
        <section className="container py-10">
          <h2 className="mb-6 font-display text-2xl font-bold text-foreground">
            ⚡ Δημοφιλή Quizzes
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {popular.map((quiz) => (
              <QuizCard key={quiz.id} quiz={quiz} />
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
