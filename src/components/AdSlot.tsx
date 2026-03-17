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

const ADSTERRA_SCRIPT_SRC =
  "https://pl28935422.effectivegatecpm.com/02557271b39db03fda6b3a43289456f8/invoke.js";
const ADSTERRA_CONTAINER_ID =
  "container-02557271b39db03fda6b3a43289456f8";

const AdSlot = ({ format, className = "", ezoicId }: AdSlotProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [useAdsterra, setUseAdsterra] = useState(false);
  const adsterraLoaded = useRef(false);

  useEffect(() => {
    if (ezoicId && containerRef.current) {
      try {
        const ez = (window as any).ezstandalone || (window as any).defined_ezstandalone;
        if (ez && ez.initialized) {
          ez.cmd.push(() => {
            if (ez.showAds) ez.showAds();
          });
          return;
        }
      } catch {
        // Ezoic not available
      }
      setUseAdsterra(true);
    } else {
      setUseAdsterra(true);
    }
  }, [ezoicId]);

  useEffect(() => {
    if (!useAdsterra || adsterraLoaded.current) return;
    if (!containerRef.current) return;

    const adDiv = containerRef.current.querySelector(`#${ADSTERRA_CONTAINER_ID}`);
    if (!adDiv) return;

    adsterraLoaded.current = true;
    const script = document.createElement("script");
    script.async = true;
    script.setAttribute("data-cfasync", "false");
    script.src = ADSTERRA_SCRIPT_SRC;
    containerRef.current.insertBefore(script, adDiv);
  }, [useAdsterra]);

  return (
    <div
      ref={containerRef}
      id={ezoicId ? `ezoic-pub-ad-placeholder-${ezoicId}` : undefined}
      className={`w-full overflow-hidden ${className}`}
      style={{ minHeight: sizes[format].minHeight }}
    >
      {useAdsterra && (
        <div id={ADSTERRA_CONTAINER_ID}></div>
      )}
    </div>
  );
};

export default AdSlot;
