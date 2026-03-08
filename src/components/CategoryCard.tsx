import { Link } from "react-router-dom";
import type { Category } from "@/data/sampleQuizzes";

const CategoryCard = ({ category }: { category: Category }) => {
  return (
    <Link
      to={`/category/${category.slug}`}
      className="group relative flex aspect-[4/3] overflow-hidden rounded-xl shadow-sm transition-all hover:shadow-lg hover:-translate-y-1"
    >
      <img
        src={category.image}
        alt={category.name}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/25 to-black/10" />
      <div className="relative z-10 flex h-full w-full flex-col items-center justify-center gap-1 p-4 text-center">
        <h3 className="line-clamp-2 text-base font-bold leading-tight text-white drop-shadow-md md:text-lg">
          {category.name}
        </h3>
        <p className="text-xs text-white/80 drop-shadow-sm">{category.quizCount} quizzes</p>
      </div>
    </Link>
  );
};

export default CategoryCard;
