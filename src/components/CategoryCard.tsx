import { Link } from "react-router-dom";

interface CategoryCardCategory {
  id: string;
  name: string;
  slug: string;
  icon?: string | null;
  description?: string | null;
  image?: string;
  // quizCount is no longer used from hardcoded data
}

const CategoryCard = ({ category }: { category: CategoryCardCategory }) => {
  return (
    <Link
      to={`/category/${category.slug}`}
      className="group relative flex aspect-[4/3] overflow-hidden rounded-xl shadow-sm transition-all hover:shadow-lg hover:-translate-y-1"
    >
      {category.image ? (
        <img
          src={category.image}
          alt={category.name}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-primary/40" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/25 to-black/10" />
      <div className="relative z-10 flex h-full w-full flex-col items-center justify-center gap-1 p-4 text-center">
        {category.icon && <span className="text-2xl">{category.icon}</span>}
        <h3 className="line-clamp-2 text-base font-bold leading-tight text-white drop-shadow-md md:text-lg">
          {category.name}
        </h3>
        {category.description && (
          <p className="text-xs text-white/80 drop-shadow-sm line-clamp-1">{category.description}</p>
        )}
      </div>
    </Link>
  );
};

export default CategoryCard;
