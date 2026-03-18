import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock, CheckCircle2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface EmailCaptureGateProps {
  quizId: string;
  quizTitle: string;
  resultTitle: string;
  resultDescription: string;
  children: React.ReactNode;
}

const EmailCaptureGate = ({
  quizId,
  quizTitle,
  resultTitle,
  resultDescription,
  children,
}: EmailCaptureGateProps) => {
  const [email, setEmail] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [loading, setLoading] = useState(false);

  // Show first ~150 chars as preview
  const preview = resultDescription.slice(0, 150).trim() + "...";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast({ title: "Please enter a valid email", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      // Generate tags from quiz title
      const tags = quizTitle
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "")
        .split(/\s+/)
        .filter((w) => w.length > 3)
        .slice(0, 5);

      await supabase.from("email_captures" as any).insert({
        email,
        quiz_id: quizId,
        quiz_title: quizTitle,
        result_title: resultTitle,
        tags,
      });

      setUnlocked(true);
      toast({ title: "Unlocked!", description: "Your full result is now visible." });
    } catch {
      // Even if insert fails (duplicate), unlock anyway
      setUnlocked(true);
    }
    setLoading(false);
  };

  if (unlocked) {
    return <>{children}</>;
  }

  return (
    <div className="space-y-4">
      {/* Preview */}
      <p className="text-muted-foreground leading-relaxed">{preview}</p>

      {/* Gate */}
      <div className="rounded-xl border-2 border-primary/20 bg-primary/5 p-5 text-center space-y-3">
        <div className="flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Lock className="h-5 w-5 text-primary" />
          </div>
        </div>
        <h3 className="font-display text-lg font-bold">
          Want your full detailed analysis?
        </h3>
        <p className="text-sm text-muted-foreground">
          Enter your email to unlock your complete result with personalized insights, growth strategies, and recommended resources.
        </p>
        <form onSubmit={handleSubmit} className="flex gap-2 max-w-sm mx-auto">
          <Input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1"
            required
          />
          <Button type="submit" disabled={loading} className="gap-2">
            <Mail className="h-4 w-4" />
            {loading ? "..." : "Unlock"}
          </Button>
        </form>
        <p className="text-xs text-muted-foreground/60">
          No spam, ever. Unsubscribe anytime.
        </p>
      </div>
    </div>
  );
};

export default EmailCaptureGate;
