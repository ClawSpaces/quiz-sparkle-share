import { useState } from "react";

const EMOJIS = ["👍", "❤️", "😂", "😭", "🤯", "😡", "🙄", "😬"];

interface ReactionBarProps {
  reactions: Record<string, number>;
  compact?: boolean;
}

const formatCount = (n: number) => {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
};

const ReactionBar = ({ reactions, compact = false }: ReactionBarProps) => {
  const [localReactions, setLocalReactions] = useState(reactions);
  const [clicked, setClicked] = useState<Set<string>>(new Set());

  const handleReact = (emoji: string) => {
    if (clicked.has(emoji)) return;
    setClicked((prev) => new Set(prev).add(emoji));
    setLocalReactions((prev) => ({
      ...prev,
      [emoji]: (prev[emoji] || 0) + 1,
    }));
  };

  const visibleEmojis = compact
    ? EMOJIS.filter((e) => (localReactions[e] || 0) > 0).slice(0, 4)
    : EMOJIS;

  return (
    <div className="flex flex-wrap gap-1">
      {visibleEmojis.map((emoji) => {
        const count = localReactions[emoji] || 0;
        const isClicked = clicked.has(emoji);
        return (
          <button
            key={emoji}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleReact(emoji);
            }}
            className={`flex items-center gap-1 rounded-full border px-2 py-1 text-xs transition-all hover:scale-105 ${
              isClicked
                ? "border-primary/40 bg-primary/10 text-primary"
                : "border-border bg-card text-muted-foreground hover:border-primary/30"
            }`}
          >
            <span>{emoji}</span>
            {count > 0 && <span className="font-medium">{formatCount(count)}</span>}
          </button>
        );
      })}
    </div>
  );
};

export default ReactionBar;
