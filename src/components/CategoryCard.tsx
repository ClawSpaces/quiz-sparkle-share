import { Link } from "react-router-dom";
import type { Category } from "@/data/sampleQuizzes";

const CategoryCard = ({ category }: { category: Category }) => {
  return (
    <Link
      to={`/category/${category.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border bg-card shadow-sm transition-all hover:shadow-md hover:-translate-y-1 hover:border-primary/30"
    >
      <div className="relative h-24 w-full overflow-hidden">
        <img
          src={category.image}
          alt={category.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
        />
      </div>
      <div className="flex flex-col items-center gap-1 p-3 text-center">
        <h3 className="line-clamp-2 text-sm font-bold leading-tight text-foreground">
          {category.name}
        </h3>
        <p className="text-xs text-muted-foreground">{category.quizCount} quizzes</p>
      </div>
    </Link>
  );
};

export default CategoryCard;
