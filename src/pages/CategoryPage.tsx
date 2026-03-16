import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import QuizCard from "@/components/QuizCard";
import AdSlot from "@/components/AdSlot";
import { supabase } from "@/integrations/supabase/client";

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [category, setCategory] = useState<any>(null);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    const fetch = async () => {
      const [catRes, quizRes] = await Promise.all([
        supabase.from("categories").select("*").eq("slug", slug).single(),
        supabase.from("quizzes").select("*, categories(name, slug)").eq("is_published", true),
      ]);
      if (catRes.data) setCategory(catRes.data);
      if (quizRes.data) {
        setQuizzes(quizRes.data.filter((q: any) => q.categories?.slug === slug));
      }
      setLoading(false);
    };
    fetch();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="container flex flex-1 items-center justify-center py-20">
          <div className="text-center">
            <h1 className="font-display text-3xl font-bold text-foreground">Category Not Found</h1>
            <p className="mt-2 text-muted-foreground">Try a different category.</p>
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
        <section className="bg-muted/40 py-10">
          <div className="container text-center">
            {category.icon && <span className="text-5xl">{category.icon}</span>}
            <h1 className="mt-3 font-display text-3xl font-bold text-foreground md:text-4xl">
              {category.name}
            </h1>
            {category.description && <p className="mt-2 text-muted-foreground">{category.description}</p>}
            <p className="mt-1 text-sm text-muted-foreground">{quizzes.length} quizzes</p>
          </div>
        </section>

        <div className="container py-4">
          <AdSlot format="leaderboard" ezoicId={115} />
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
              No quizzes in this category yet.
            </p>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CategoryPage;
