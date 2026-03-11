import { Facebook, Link2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ShareButtonsProps {
  url?: string;
  text?: string;
  imageUrl?: string;
  className?: string;
}

const PinterestIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
    <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
  </svg>
);

const BlueskyIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
    <path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .688.35 5.725.557 6.55.718 2.857 3.276 3.804 5.639 3.469-3.722.572-7.034 2.467-3.903 8.57.84-.075 5.867-.39 7.707-4.34.352-.756.667-1.973.667-1.973V16c0 .002-.001.004-.002.006l.003-.006s.315 1.217.667 1.973c1.84 3.95 6.867 4.265 7.707 4.34 3.131-6.103-.181-7.998-3.903-8.57 2.363.335 4.921-.612 5.639-3.469.207-.825.557-5.862.557-6.55 0-.688-.139-1.86-.902-2.203-.659-.299-1.664-.621-4.3 1.24C13.046 4.747 11.087 8.686 12 10.8z" />
  </svg>
);

const ShareButtons = ({ url, text, imageUrl, className = "" }: ShareButtonsProps) => {
  const shareUrl = url || window.location.href;

  const shareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, "_blank", "width=600,height=400");
  };

  const sharePinterest = () => {
    const pinUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&description=${encodeURIComponent(text || "")}&media=${encodeURIComponent(imageUrl || "")}`;
    window.open(pinUrl, "_blank", "width=600,height=400");
  };

  const shareBluesky = () => {
    const bskyUrl = `https://bsky.app/intent/compose?text=${encodeURIComponent(`${text || ""} ${shareUrl}`)}`;
    window.open(bskyUrl, "_blank", "width=600,height=400");
  };

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast({ title: "Link copied!", description: "The link has been copied to your clipboard." });
  };

  const btnClass = "flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground";

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button onClick={shareFacebook} className={btnClass} aria-label="Share on Facebook">
        <Facebook className="h-4 w-4" />
      </button>
      <button onClick={sharePinterest} className={btnClass} aria-label="Share on Pinterest">
        <PinterestIcon />
      </button>
      <button onClick={shareBluesky} className={btnClass} aria-label="Share on Bluesky">
        <BlueskyIcon />
      </button>
      <button onClick={copyLink} className={btnClass} aria-label="Copy link">
        <Link2 className="h-4 w-4" />
      </button>
    </div>
  );
};

export default ShareButtons;
