export interface Post {
  id: string;
  title: string;
  description: string | null;
  content?: string | null;
  image_url: string | null;
  image_alt?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  primary_keyword?: string | null;
  llm_summary?: string | null;
  post_type: "article" | "shopping" | "celebrity" | "trending_news";
  views_count: number;
  is_trending: boolean;
  created_at: string;
  updated_at?: string;
  slug?: string;
  reactions?: Record<string, number>;
  post_reactions?: { emoji: string; count: number }[];
}

export interface BuzzChat {
  id: string;
  question: string;
  image_url?: string | null;
  is_active: boolean;
  created_at: string;
  reply_count?: number;
}

/** Convert post_reactions array to a Record for ReactionBar */
export const reactionsToRecord = (
  reactions?: { emoji: string; count: number }[]
): Record<string, number> => {
  if (!reactions) return {};
  return reactions.reduce((acc, r) => ({ ...acc, [r.emoji]: r.count }), {} as Record<string, number>);
};

export const formatViews = (n: number) => {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
  return n.toString();
};

export const timeAgo = (dateStr: string): string => {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${Math.max(1, diffMins)} minutes ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays === 1) return "yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return `${Math.floor(diffDays / 7)} weeks ago`;
};
