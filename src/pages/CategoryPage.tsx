import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import QuizCard from "@/components/QuizCard";
import AdPlaceholder from "@/components/AdPlaceholder";
import { getCategoryBySlug, getQuizzesByCategory } from "@/data/sampleQuizzes";

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const category = getCategoryBySlug(slug || "");
  const quizzes = getQuizzesByCategory(slug || "");

  if (!category) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="container flex flex-1 items-center justify-center py-20">
          <div className="text-center">
            <h1 className="font-display text-3xl font-bold text-foreground">Η κατηγορία δεν βρέθηκε</h1>
            <p className="mt-2 text-muted-foreground">Δοκίμασε μια άλλη κατηγορία.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Category Header */}
        <section className="bg-muted/40 py-10">
          <div className="container text-center">
            <span className="text-5xl">{category.icon}</span>
            <h1 className="mt-3 font-display text-3xl font-bold text-foreground md:text-4xl">
              {category.name}
            </h1>
            <p className="mt-2 text-muted-foreground">{category.description}</p>
            <p className="mt-1 text-sm text-muted-foreground">{quizzes.length} quizzes</p>
          </div>
        </section>

        <div className="container py-4">
          <AdPlaceholder format="leaderboard" />
        </div>

        <section className="container py-8">
          {quizzes.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {quizzes.map((quiz) => (
                <QuizCard key={quiz.id} quiz={quiz} />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">
              Δεν υπάρχουν ακόμα quizzes σε αυτή την κατηγορία.
            </p>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CategoryPage;
