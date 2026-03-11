import { useEffect, useRef } from "react";

interface AdSlotProps {
  format: "leaderboard" | "rectangle" | "native" | "banner";
  className?: string;
  slotId?: string;
  network?: "adsense" | "taboola" | "custom";
}

const sizes: Record<AdSlotProps["format"], string> = {
  leaderboard: "h-[90px]",
  rectangle: "h-[250px]",
  native: "h-[120px]",
  banner: "h-[60px]",
};

const dataFormats: Record<AdSlotProps["format"], string> = {
  leaderboard: "horizontal",
  rectangle: "rectangle",
  native: "fluid",
  banner: "horizontal",
};

const AdSlot = ({ format, className = "", slotId, network = "adsense" }: AdSlotProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const adInitialized = useRef(false);

  useEffect(() => {
    if (slotId && !adInitialized.current && containerRef.current) {
      adInitialized.current = true;
      try {
        if (network === "adsense" && (window as any).adsbygoogle) {
          (window as any).adsbygoogle.push({});
        }
      } catch (e) {
        // Ad blocker or script not loaded
      }
    }
  }, [slotId, network]);

  if (slotId && network === "adsense") {
    return (
      <div ref={containerRef} className={`w-full overflow-hidden ${className}`}>
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
          data-ad-slot={slotId}
          data-ad-format={dataFormats[format]}
          data-full-width-responsive="true"
        />
      </div>
    );
  }

  return (
    <div
      className={`flex w-full items-center justify-center rounded-lg border border-dashed border-border bg-muted/50 text-xs text-muted-foreground ${sizes[format]} ${className}`}
    >
      Advertisement — {format.toUpperCase()}
    </div>
  );
};

export default AdSlot;
