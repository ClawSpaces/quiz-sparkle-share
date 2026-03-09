import { Link } from "react-router-dom";
import { Eye } from "lucide-react";
import ReactionBar from "@/components/ReactionBar";
import type { Post } from "@/data/samplePosts";
import { formatViews, timeAgo, reactionsToRecord } from "@/data/samplePosts";

const typeLabels: Record<Post["post_type"], string> = {
  article: "Άρθρο",
  shopping: "Shopping",
  celebrity: "Celebrity",
  trending_news: "Trending",
};

const typeColors: Record<Post["post_type"], string> = {
  article: "bg-accent text-accent-foreground",
  shopping: "bg-secondary text-secondary-foreground",
  celebrity: "bg-primary text-primary-foreground",
  trending_news: "bg-destructive text-destructive-foreground",
};

interface PostCardProps {
  post: Post;
  variant?: "default" | "large" | "compact" | "list";
}

const PostCard = ({ post, variant = "default" }: PostCardProps) => {
  const reactions = post.reactions ?? reactionsToRecord(post.post_reactions);
  const image = post.image_url || "/placeholder.svg";

  if (variant === "large") {
    return (
      <Link to={`/post/${post.id}`} className="group relative block overflow-hidden rounded-lg bg-card shadow-md transition-all hover:shadow-xl hover:-translate-y-0.5">
        <div className="aspect-[16/10] overflow-hidden">
          <img src={image} alt={post.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
          <span className={`mb-2 inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${typeColors[post.post_type]}`}>{typeLabels[post.post_type]}</span>
          <h3 className="font-display text-lg font-bold leading-tight text-primary-foreground md:text-2xl">{post.title}</h3>
          <div className="mt-1.5 flex items-center gap-3 text-xs text-primary-foreground/70">
            <span>{timeAgo(post.created_at)}</span>
            <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {formatViews(post.views_count)}</span>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === "list") {
    return (
      <Link to={`/post/${post.id}`} className="group flex gap-3 border-b border-border py-3 transition-colors last:border-b-0">
        <div className="h-20 w-28 flex-shrink-0 overflow-hidden rounded-lg">
          <img src={image} alt={post.title} className="h-full w-full object-cover" loading="lazy" />
        </div>
        <div className="flex flex-1 flex-col justify-center gap-1">
          <span className={`self-start rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${typeColors[post.post_type]}`}>{typeLabels[post.post_type]}</span>
          <h4 className="text-sm font-bold leading-tight text-foreground group-hover:text-primary line-clamp-2">{post.title}</h4>
          <span className="text-[11px] text-muted-foreground">{timeAgo(post.created_at)} · {formatViews(post.views_count)} views</span>
        </div>
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <Link to={`/post/${post.id}`} className="group flex gap-3 rounded-lg p-2 transition-colors hover:bg-muted">
        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg">
          <img src={image} alt={post.title} className="h-full w-full object-cover" loading="lazy" />
        </div>
        <div className="flex flex-col justify-center">
          <h4 className="text-sm font-semibold leading-tight text-foreground group-hover:text-primary">{post.title}</h4>
          <span className="mt-1 text-xs text-muted-foreground">{formatViews(post.views_count)} views</span>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/post/${post.id}`} className="group block overflow-hidden rounded-lg bg-card shadow-sm transition-all hover:shadow-lg hover:-translate-y-0.5">
      <div className="aspect-[16/10] overflow-hidden">
        <img src={image} alt={post.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
      </div>
      <div className="p-3 md:p-4">
        <span className={`inline-block rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${typeColors[post.post_type]}`}>{typeLabels[post.post_type]}</span>
        <h3 className="mt-1.5 font-display text-sm font-bold leading-tight text-foreground group-hover:text-primary md:text-base">{post.title}</h3>
        <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{post.description}</p>
        <div className="mt-2 flex items-center gap-3 text-[11px] text-muted-foreground">
          <span>{timeAgo(post.created_at)}</span>
          <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {formatViews(post.views_count)}</span>
        </div>
        <div className="mt-2"><ReactionBar reactions={reactions} compact /></div>
      </div>
    </Link>
  );
};

export default PostCard;
