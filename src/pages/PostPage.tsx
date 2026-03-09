import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ReactionBar from "@/components/ReactionBar";
import AdSlot from "@/components/AdSlot";
import { supabase } from "@/integrations/supabase/client";
import { formatViews, timeAgo, reactionsToRecord, type Post } from "@/data/samplePosts";
import { Eye, Calendar } from "lucide-react";
import ReadyForMore from "@/components/ReadyForMore";
import MoreFromSite from "@/components/MoreFromSite";
import ContentSidebar from "@/components/ContentSidebar";
import ShareButtons from "@/components/ShareButtons";
import CommentsSection from "@/components/CommentsSection";

const PostPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchPost = async () => {
      const { data } = await supabase
        .from("posts")
        .select("*, post_reactions(emoji, count)")
        .eq("id", id)
        .single();
      if (data) {
        setPost(data as any);
        // Increment views
        supabase.rpc("increment_views", { post_id_param: id });
      }
      setLoading(false);
    };
    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <p className="text-muted-foreground">Φόρτωση...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <p className="text-muted-foreground">Το άρθρο δεν βρέθηκε.</p>
        </main>
        <Footer />
      </div>
    );
  }

  const reactions = reactionsToRecord(post.post_reactions);
  const image = post.image_url || "/placeholder.svg";

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container py-8 md:flex md:gap-6">
          <div className="flex-1 min-w-0 max-w-3xl">
            <div className="aspect-[16/9] overflow-hidden rounded-xl">
              <img src={image} alt={post.title} className="h-full w-full object-cover" />
            </div>

            <div className="mt-6">
              <h1 className="font-display text-2xl font-black leading-tight text-foreground md:text-4xl">{post.title}</h1>
              <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><Eye className="h-4 w-4" /> {formatViews(post.views_count)} views</span>
                <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {post.created_at.split("T")[0]}</span>
              </div>
            </div>

            <div className="mt-4"><AdSlot format="leaderboard" /></div>

            <div className="mt-6 text-foreground leading-relaxed">
              <p className="text-lg">{post.description}</p>
              {post.content && <div className="mt-4" dangerouslySetInnerHTML={{ __html: post.content }} />}
              {!post.content && (
                <p className="mt-4 text-muted-foreground">
                  Αυτό είναι ένα placeholder για το πλήρες περιεχόμενο του άρθρου. Όταν συνδεθεί με τη βάση δεδομένων, εδώ θα εμφανίζεται το πλήρες κείμενο σε μορφή rich text.
                </p>
              )}
            </div>

            <div className="mt-6 flex items-center gap-3">
              <span className="text-sm font-semibold text-muted-foreground">Μοιράσου το:</span>
              <ShareButtons text={post.title} imageUrl={image} />
            </div>

            <div className="mt-8 rounded-xl border bg-card p-4">
              <p className="mb-3 text-sm font-semibold text-foreground">Πώς σε κάνει να νιώθεις αυτό το άρθρο;</p>
              <ReactionBar reactions={reactions} />
            </div>

            <div className="mt-4"><AdPlaceholder format="rSlot></div>

            <CommentsSection contentType="post" contentId={id!} />
          </div>

          <ContentSidebar />
        </div>

        <div className="container max-w-5xl space-y-10 pb-12">
          <ReadyForMore currentId={id!} type="post" />
          <MoreFromSite currentId={id!} currentType="post" />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PostPage;
