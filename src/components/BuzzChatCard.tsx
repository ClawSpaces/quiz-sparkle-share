import { MessageCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { BuzzChat } from "@/data/samplePosts";

interface BuzzChatCardProps {
  chat: BuzzChat;
  variant?: "default" | "featured";
}

const BuzzChatCard = ({ chat, variant = "default" }: BuzzChatCardProps) => {
  const [showInput, setShowInput] = useState(false);
  const [reply, setReply] = useState("");

  const isFeatured = variant === "featured";

  return (
    <div className={`overflow-hidden rounded-xl border bg-card shadow-sm ${isFeatured ? "border-primary/30" : ""}`}>
      {chat.image_url && (
        <div className={`overflow-hidden ${isFeatured ? "aspect-[16/8]" : "aspect-[16/10]"}`}>
          <img src={chat.image_url} alt="" className="h-full w-full object-cover" loading="lazy" onError={(e) => { e.currentTarget.src = '/placeholder.svg'; }} />
        </div>
      )}
      <div className="p-4">
        <span className="mb-2 inline-block rounded-full bg-accent/20 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-accent">
          Fizz Chat
        </span>
        <h3 className={`font-display font-bold leading-tight text-foreground ${isFeatured ? "text-xl md:text-2xl" : "text-base md:text-lg"}`}>
          {chat.question}
        </h3>
        <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
          <MessageCircle className="h-4 w-4" />
          <span>{(chat.reply_count ?? 0).toLocaleString()} replies</span>
        </div>

        {showInput ? (
          <div className="mt-3 flex gap-2">
            <Input value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Write your reply..." className="flex-1" />
            <Button size="sm" onClick={() => { setReply(""); setShowInput(false); }}>Send</Button>
          </div>
        ) : (
          <Button variant="outline" className="mt-3 w-full border-primary/30 text-primary hover:bg-primary/10" onClick={() => setShowInput(true)}>
            Add your reply
          </Button>
        )}
      </div>
    </div>
  );
};

export default BuzzChatCard;
