interface AdPlaceholderProps {
  format: "leaderboard" | "rectangle" | "native" | "banner";
  className?: string;
}

const sizes = {
  leaderboard: "h-[90px]",
  rectangle: "h-[250px]",
  native: "h-[120px]",
  banner: "h-[60px]",
};

const AdPlaceholder = ({ format, className = "" }: AdPlaceholderProps) => {
  return (
    <div
      className={`flex w-full items-center justify-center rounded-lg border border-dashed border-border bg-muted/50 text-xs text-muted-foreground ${sizes[format]} ${className}`}
    >
      Διαφήμιση — {format.toUpperCase()}
    </div>
  );
};

export default AdPlaceholder;
