import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import Header from "@/components/Header";
import SEO from "@/components/SEO";
import SchemaMarkup from "@/components/SchemaMarkup";
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

/** Strip meta/frontmatter sections that shouldn't be visible to users */
function stripMeta(md: string): string {
  if (!md) return "";
  return md
    // Remove full META section block (## META through next --- or heading)
    .replace(/^#{1,3}\s*META\s*\n[\s\S]*?(?=^#{1,3}\s[^M]|^---\s*$)/gm, '')
    // Remove ARTICLE META section block
    .replace(/^#{1,3}\s*ARTICLE META\s*\n[\s\S]*?(?=^#{1,3}\s|^---\s*$)/gm, '')
    // Remove QUIZ BRIEF section block
    .replace(/^#{1,3}\s*QUIZ BRIEF\s*\n[\s\S]*?(?=^#{1,3}\s|^---\s*$)/gm, '')
    // Remove standalone meta lines (bold or plain)
    .replace(/^\*?\*?Meta (Title|Description)\*?\*?:.*$/gm, '')
    .replace(/^\*?\*?Target Keyword\*?\*?:.*$/gm, '')
    .replace(/^\*?\*?Secondary Keywords?\*?\*?:.*$/gm, '')
    .replace(/^\*?\*?Related Quiz\*?\*?:.*$/gm, '')
    .replace(/^\*?\*?OG Image Description\*?\*?:.*$/gm, '')
    .replace(/^\*?\*?Slug\*?\*?:.*$/gm, '')
    .replace(/^\*?\*?Category\*?\*?:.*$/gm, '')
    .replace(/^\*?\*?Type\*?\*?:.*$/gm, '')
    .replace(/^\*?\*?Difficulty\*?\*?:.*$/gm, '')
    .replace(/^\*?\*?Estimated Time\*?\*?:.*$/gm, '')
    // Remove ARTICLE CONTENT header
    .replace(/^#{1,3}\s*ARTICLE CONTENT\s*$/gm, '')
    // Remove QUIZ CTA section
    .replace(/^#{1,3}\s*QUIZ CTA\s*\n[\s\S]*?(?=^#{1,3}\s|$)/gm, '')
    // Remove INTERNAL LINKING NOTES
    .replace(/^#{1,3}\s*INTERNAL LINKING NOTES\s*\n[\s\S]*$/gm, '')
    .replace(/^- Links? OUT to:.*$/gm, '')
    .replace(/^- Should be linked FROM:.*$/gm, '')
    // Fix wrong quiz links: /quizzes/category/slug → /quiz/slug
    .replace(/\/quizzes\/[a-z-]+\/([a-z0-9-]+)/g, '/quiz/$1')
    // Clean up --- dividers that are left orphaned
    .replace(/^---\s*$/gm, '')
    // Clean up extra blank lines
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/** Lightweight markdown → HTML converter (no external deps) */
function markdownToHtml(md: string): string {
  if (!md) return "";
  md = stripMeta(md);
  // If content already has HTML tags, return as-is
  if (md.includes("<h2>") || md.includes("<h3>") || md.includes("<p>")) return md;

  let html = md
    // Headings (must be before bold processing)
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h2>$1</h2>")
    // Bold and italic
    .replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    // Unordered lists
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    // Ordered lists
    .replace(/^\d+\. (.+)$/gm, "<li>$1</li>")
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary underline hover:no-underline">$1</a>');

  // Wrap consecutive <li> in <ul>
  html = html.replace(/(<li>.*?<\/li>\n?)+/gs, (match) => `<ul class="list-disc pl-6 space-y-1 my-3">${match}</ul>`);

  // Split into paragraphs on double newlines
  html = html
    .split(/\n{2,}/)
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return "";
      if (trimmed.startsWith("<h2>") || trimmed.startsWith("<h3>") || trimmed.startsWith("<ul>") || trimmed.startsWith("<ol>")) return trimmed;
      return `<p>${trimmed.replace(/\n/g, " ")}</p>`;
    })
    .join("\n");

  return html;
}

const PostPage = () => {
  const { id, slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const idOrSlug = slug || id;
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!idOrSlug) return;
    const fetchPost = async () => {
      // Support both UUID and slug-based lookups
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);
      const lookupField = isUUID ? "id" : "slug";
      const { data } = await supabase
        .from("posts")
        .select("*, post_reactions(emoji, count)")
        .eq(lookupField, idOrSlug)
        .single();
      if (data) {
        // Redirect /post/UUID to /article/slug for SEO
        if (isUUID && data.slug && location.pathname.startsWith("/post/")) {
          navigate(`/article/${data.slug}`, { replace: true });
          return;
        }
        setPost(data as any);
        supabase.rpc("increment_views", { post_id_param: data.id });
      }
      setLoading(false);
    };
    fetchPost();
  }, [idOrSlug]);

  const renderedContent = useMemo(() => markdownToHtml(post?.content || ""), [post?.content]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
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
          <p className="text-muted-foreground">Article not found.</p>
        </main>
        <Footer />
      </div>
    );
  }

  const reactions = reactionsToRecord(post.post_reactions);
  const image = post.image_url || "/placeholder.svg";

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SEO
        title={post.title}
        description={(post.description || "Read this article on Fizzty!").slice(0, 155)}
        image={post.image_url || undefined}
        type="article"
        publishedTime={post.created_at}
        modifiedTime={post.created_at}
      />
      <SchemaMarkup
        type="article"
        title={post.title}
        description={post.description}
        image={post.image_url}
        datePublished={post.created_at}
        dateModified={post.created_at}
      />
      <Header />
      <main className="flex-1">
        <div className="container py-8 md:flex md:gap-6">
          <div className="flex-1 min-w-0 max-w-3xl">
            <div className="aspect-[16/9] overflow-hidden rounded-xl">
              <img src={image} alt={post.title} className="h-full w-full object-cover" onError={(e) => { e.currentTarget.src = '/placeholder.svg'; }} />
            </div>

            <div className="mt-6">
              <h1 className="font-display text-2xl font-black leading-tight text-foreground md:text-4xl">{post.title}</h1>
              <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><Eye className="h-4 w-4" /> {formatViews(post.views_count)} views</span>
                <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {post.created_at.split("T")[0]}</span>
              </div>
            </div>

            <div className="mt-4"><AdSlot format="leaderboard" ezoicId={105} /></div>

            <div className="mt-6 text-foreground leading-relaxed prose prose-lg max-w-none prose-headings:font-display prose-headings:font-black prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3 prose-p:mb-4 prose-p:leading-relaxed prose-li:mb-1 prose-strong:font-bold prose-a:text-primary">
              {post.content && <div className="mt-4" dangerouslySetInnerHTML={{ __html: renderedContent }} />}
              {!post.content && post.description && (
                <div className="mt-4" dangerouslySetInnerHTML={{ __html: markdownToHtml(post.description) }} />
              )}
            </div>

            <div className="mt-6 flex items-center gap-3">
              <span className="text-sm font-semibold text-muted-foreground">Share:</span>
              <ShareButtons text={post.title} imageUrl={image} />
            </div>

            <div className="mt-8 rounded-xl border bg-card p-4">
              <p className="mb-3 text-sm font-semibold text-foreground">How does this article make you feel?</p>
              <ReactionBar reactions={reactions} />
            </div>

            <div className="mt-4"><AdSlot format="rectangle" ezoicId={106} /></div>

            <CommentsSection contentType="post" contentId={post.id} />
          </div>

          <ContentSidebar />
        </div>

        <div className="container max-w-5xl space-y-10 pb-12">
          <ReadyForMore currentId={post.id} type="post" />
          <MoreFromSite currentId={post.id} currentType="post" />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PostPage;
