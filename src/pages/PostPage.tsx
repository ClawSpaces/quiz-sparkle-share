import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ReactionBar from "@/components/ReactionBar";
import AdPlaceholder from "@/components/AdPlaceholder";
import { samplePosts, formatViews } from "@/data/samplePosts";
import { Eye, Calendar } from "lucide-react";
import ReadyForMore from "@/components/ReadyForMore";
import MoreFromSite from "@/components/MoreFromSite";
import ContentSidebar from "@/components/ContentSidebar";
import ShareButtons from "@/components/ShareButtons";
import CommentsSection from "@/components/CommentsSection";

const PostPage = () => {
  const { id } = useParams();
  const post = samplePosts.find((p) => p.id === id);

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

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container py-8 md:flex md:gap-6">
          <div className="flex-1 min-w-0 max-w-3xl">
            <div className="aspect-[16/9] overflow-hidden rounded-xl">
              <img src={post.image} alt={post.title} className="h-full w-full object-cover" />
            </div>

            <div className="mt-6">
              <h1 className="font-display text-2xl font-black leading-tight text-foreground md:text-4xl">
                {post.title}
              </h1>
              <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Eye className="h-4 w-4" /> {formatViews(post.views)} views
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" /> {post.createdAt}
                </span>
              </div>
            </div>

            <div className="mt-4">
              <AdPlaceholder format="leaderboard" />
            </div>

            <div className="mt-6 text-foreground leading-relaxed">
              <p className="text-lg">{post.description}</p>
              <p className="mt-4 text-muted-foreground">
                Αυτό είναι ένα placeholder για το πλήρες περιεχόμενο του άρθρου. Όταν συνδεθεί με τη βάση δεδομένων, εδώ θα εμφανίζεται το πλήρες κείμενο σε μορφή rich text.
              </p>
            </div>

            {/* Share buttons */}
            <div className="mt-6 flex items-center gap-3">
              <span className="text-sm font-semibold text-muted-foreground">Μοιράσου το:</span>
              <ShareButtons text={post.title} imageUrl={post.image} />
            </div>

            <div className="mt-8 rounded-xl border bg-card p-4">
              <p className="mb-3 text-sm font-semibold text-foreground">Πώς σε κάνει να νιώθεις αυτό το άρθρο;</p>
              <ReactionBar reactions={post.reactions} />
            </div>

            <div className="mt-4">
              <AdPlaceholder format="rectangle" />
            </div>

            {/* Comments */}
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
