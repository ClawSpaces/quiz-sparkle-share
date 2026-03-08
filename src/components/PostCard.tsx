import { Link } from "react-router-dom";
import { Eye } from "lucide-react";
import ReactionBar from "@/components/ReactionBar";
import type { Post } from "@/data/samplePosts";
import { formatViews } from "@/data/samplePosts";

const typeLabels: Record<Post["postType"], string> = {
  article: "Άρθρο",
  shopping: "Shopping",
  celebrity: "Celebrity",
  trending_news: "Trending",
};

const typeColors: Record<Post["postType"], string> = {
  article: "bg-accent text-accent-foreground",
  shopping: "bg-secondary text-secondary-foreground",
  celebrity: "bg-primary text-primary-foreground",
  trending_news: "bg-destructive text-destructive-foreground",
};

interface PostCardProps {
  post: Post;
  variant?: "default" | "large" | "compact";
}

const PostCard = ({ post, variant = "default" }: PostCardProps) => {
  if (variant === "large") {
    return (
      <Link
        to={`/post/${post.id}`}
        className="group relative block overflow-hidden rounded-xl bg-card shadow-md transition-all hover:shadow-xl hover:-translate-y-1"
      >
        <div className="aspect-[16/10] overflow-hidden">
          <img
            src={post.image}
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <span className={`mb-2 inline-block rounded-full px-3 py-1 text-xs font-semibold ${typeColors[post.postType]}`}>
            {typeLabels[post.postType]}
          </span>
          <h3 className="font-display text-xl font-bold leading-tight text-primary-foreground md:text-2xl">
            {post.title}
          </h3>
          <div className="mt-2 flex items-center gap-3 text-sm text-primary-foreground/80">
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" /> {formatViews(post.views)}
            </span>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <Link
        to={`/post/${post.id}`}
        className="group flex gap-3 rounded-lg p-2 transition-colors hover:bg-muted"
      >
        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg">
          <img src={post.image} alt={post.title} className="h-full w-full object-cover" loading="lazy" />
        </div>
        <div className="flex flex-col justify-center">
          <h4 className="text-sm font-semibold leading-tight text-foreground group-hover:text-primary">
            {post.title}
          </h4>
          <span className="mt-1 text-xs text-muted-foreground">
            {formatViews(post.views)} views
          </span>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/post/${post.id}`}
      className="group block overflow-hidden rounded-xl bg-card shadow-sm transition-all hover:shadow-lg hover:-translate-y-1"
    >
      <div className="aspect-[16/10] overflow-hidden">
        <img
          src={post.image}
          alt={post.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="p-4">
        <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${typeColors[post.postType]}`}>
          {typeLabels[post.postType]}
        </span>
        <h3 className="mt-2 font-display text-base font-bold leading-tight text-foreground group-hover:text-primary md:text-lg">
          {post.title}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{post.description}</p>
        <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Eye className="h-3 w-3" /> {formatViews(post.views)}
          </span>
        </div>
        <div className="mt-3">
          <ReactionBar reactions={post.reactions} compact />
        </div>
      </div>
    </Link>
  );
};

export default PostCard;
