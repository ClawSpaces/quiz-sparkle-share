import { useEffect, useRef } from "react";

interface AdSlotProps {
  format: "leaderboard" | "rectangle" | "native" | "banner";
  className?: string;
  ezoicId?: number;
}

const sizes: Record<AdSlotProps["format"], { minHeight: string }> = {
  leaderboard: { minHeight: "90px" },
  rectangle: { minHeight: "250px" },
  native: { minHeight: "120px" },
  banner: { minHeight: "60px" },
};

const AdSlot = ({ format, className = "", ezoicId }: AdSlotProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Ezoic will auto-detect placeholders with the ezoic-pub-ad-placeholder-* id
    // and fill them. We just need the placeholder div to exist.
    if (ezoicId && containerRef.current) {
      try {
        if (typeof (window as any).ezstandalone !== "undefined") {
          (window as any).ezstandalone.cmd.push(() => {
            (window as any).ezstandalone.showAds();
          });
        }
      } catch {
        // Ezoic script not loaded or ad blocker active
      }
    }
  }, [ezoicId]);

  return (
    <div
      ref={containerRef}
      id={ezoicId ? `ezoic-pub-ad-placeholder-${ezoicId}` : undefined}
      className={`w-full overflow-hidden ${className}`}
      style={{ minHeight: sizes[format].minHeight }}
    >
      {!ezoicId && (
        <div
          className={`flex w-full items-center justify-center rounded-lg border border-dashed border-border bg-muted/50 text-xs text-muted-foreground`}
          style={{ minHeight: sizes[format].minHeight }}
        >
          Advertisement — {format.toUpperCase()}
        </div>
      )}
    </div>
  );
};

export default AdSlot;
