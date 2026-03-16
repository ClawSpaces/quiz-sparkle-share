import { Play } from "lucide-react";

interface QuizCardQuiz {
  id: string;
  title: string;
  description?: string | null;
  image_url?: string | null;
  plays_count: number;
  categories?: { name: string; slug: string } | null;
}

interface QuizCardProps {
  quiz: QuizCardQuiz;
  variant?: "default" | "large" | "compact";
}

const formatPlays = (n: number) => {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
};

const handleImgError = (e: React.SyntheticEvent<HTMLImageElement>) => {
  e.currentTarget.src = '/placeholder.svg';
};

const QuizCard = ({ quiz, variant = "default" }: QuizCardProps) => {
  const image = quiz.image_url || "/placeholder.svg";
  const category = quiz.categories?.name;
  const href = `/quiz/${quiz.id}`;

  if (variant === "large") {
    return (
      <a
        href={href}
        className="group relative block overflow-hidden rounded-xl bg-card shadow-md transition-all hover:shadow-xl hover:-translate-y-1"
      >
        <div className="aspect-[16/10] overflow-hidden">
          <img src={image} alt={quiz.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" onError={handleImgError} />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-5">
          {category && <span className="mb-2 inline-block rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">{category}</span>}
          <h3 className="font-display text-xl font-bold leading-tight text-primary-foreground md:text-2xl">{quiz.title}</h3>
          <div className="mt-2 flex items-center gap-3 text-sm text-primary-foreground/80">
            <span className="flex items-center gap-1"><Play className="h-3 w-3" /> {formatPlays(quiz.plays_count)} plays</span>
          </div>
        </div>
      </a>
    );
  }

  if (variant === "compact") {
    return (
      <a href={href} className="group flex gap-3 rounded-lg p-2 transition-colors hover:bg-muted">
        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg">
          <img src={image} alt={quiz.title} className="h-full w-full object-cover" loading="lazy" onError={handleImgError} />
        </div>
        <div className="flex flex-col justify-center">
          <h4 className="text-sm font-semibold leading-tight text-foreground group-hover:text-primary">{quiz.title}</h4>
          <span className="mt-1 text-xs text-muted-foreground">{formatPlays(quiz.plays_count)} plays</span>
        </div>
      </a>
    );
  }

  return (
    <a href={href} className="group block overflow-hidden rounded-xl bg-card shadow-sm transition-all hover:shadow-lg hover:-translate-y-1">
      <div className="aspect-[16/10] overflow-hidden">
        <img src={image} alt={quiz.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" onError={handleImgError} />
      </div>
      <div className="p-4">
        {category && <span className="text-xs font-semibold uppercase tracking-wider text-primary">{category}</span>}
        <h3 className="mt-1 font-display text-base font-bold leading-tight text-foreground group-hover:text-primary md:text-lg">{quiz.title}</h3>
        <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Play className="h-3 w-3" /> {formatPlays(quiz.plays_count)}</span>
        </div>
      </div>
    </a>
  );
};

export default QuizCard;
