import { Link } from "react-router-dom";
import type { Category } from "@/data/sampleQuizzes";

const CategoryCard = ({ category }: { category: Category }) => {
  return (
    <Link
      to={`/category/${category.slug}`}
      className="group flex flex-col items-center gap-3 rounded-xl border bg-card p-6 text-center shadow-sm transition-all hover:shadow-md hover:-translate-y-1 hover:border-primary/30"
    >
      <span className="text-4xl">{category.icon}</span>
      <h3 className="font-display text-base font-bold text-foreground">
        {category.name}
      </h3>
      <p className="text-xs text-muted-foreground">{category.quizCount} quizzes</p>
    </Link>
  );
};

export default CategoryCard;
