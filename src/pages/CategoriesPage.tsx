import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CategoryCard from "@/components/CategoryCard";
import { categories } from "@/data/sampleQuizzes";

const CategoriesPage = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="bg-muted/40 py-10">
          <div className="container text-center">
            <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">
              📂 Όλες οι Κατηγορίες
            </h1>
            <p className="mt-2 text-muted-foreground">
              Διάλεξε κατηγορία και ξεκίνα!
            </p>
          </div>
        </section>
        <section className="container py-10">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5">
            {categories.map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CategoriesPage;
