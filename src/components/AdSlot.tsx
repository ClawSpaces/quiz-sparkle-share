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
    if (ezoicId && containerRef.current) {
      try {
        const ez = (window as any).ezstandalone || (window as any).defined_ezstandalone;
        if (ez && ez.cmd) {
          ez.cmd.push(() => {
            if (ez.showAds) ez.showAds();
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
      className={`w-full overflow-hidden flex justify-center ${className}`}
      style={{ minHeight: sizes[format].minHeight }}
    />
  );
};

export default AdSlot;
