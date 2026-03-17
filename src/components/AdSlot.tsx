import { useEffect, useRef, useState } from "react";

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

// Adsterra Banner (iframe) ad unit — safe, no click hijacking
const ADSTERRA_BANNER_KEY = "c744e5d074bd26867c1291fec49830af";
const ADSTERRA_SCRIPT_SRC = `https://www.highperformanceformat.com/${ADSTERRA_BANNER_KEY}/invoke.js`;

const AdSlot = ({ format, className = "", ezoicId }: AdSlotProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ezoicActive, setEzoicActive] = useState(false);
  const adsterraLoaded = useRef(false);

  // Try Ezoic first
  useEffect(() => {
    if (ezoicId && containerRef.current) {
      try {
        const ez = (window as any).ezstandalone || (window as any).defined_ezstandalone;
        if (ez && ez.initialized) {
          setEzoicActive(true);
          if (ez.cmd) {
            ez.cmd.push(() => {
              if (ez.showAds) ez.showAds();
            });
          }
        }
      } catch {
        // Ezoic not available
      }
    }
  }, [ezoicId]);

  // Fallback to Adsterra iframe banner if Ezoic isn't active
  useEffect(() => {
    if (ezoicActive || adsterraLoaded.current) return;
    if (!containerRef.current) return;

    // Only show Adsterra on leaderboard/banner slots (728x90 unit)
    if (format !== "leaderboard" && format !== "banner") return;

    const timer = setTimeout(() => {
      // Double-check Ezoic didn't activate in the meantime
      const ez = (window as any).ezstandalone || (window as any).defined_ezstandalone;
      if (ez && ez.initialized) {
        setEzoicActive(true);
        return;
      }

      if (!containerRef.current || adsterraLoaded.current) return;
      adsterraLoaded.current = true;

      // Set atOptions on window for the Adsterra script
      (window as any).atOptions = {
        key: ADSTERRA_BANNER_KEY,
        format: "iframe",
        height: 90,
        width: 728,
        params: {},
      };

      const script = document.createElement("script");
      script.src = ADSTERRA_SCRIPT_SRC;
      script.async = true;
      containerRef.current.appendChild(script);
    }, 2000); // Wait 2s for Ezoic before falling back

    return () => clearTimeout(timer);
  }, [ezoicActive, format]);

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
