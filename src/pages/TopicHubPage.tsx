import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import SEO from "@/components/SEO";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";

interface TopicHub {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  niche: string | null;
  pillar_content: string | null;
  created_at: string;
  updated_at: string;
}

interface HubPost {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  image_alt: string | null;
  created_at: string;
}

interface HubQuiz {
  id: string;
  title: string;
  slug: string;
  image_url: string | null;
  categories: { name: string; slug: string } | null;
}

const NICHE_TO_CATEGORY_SLUG: Record<string, string | null> = {
  finance: null,
  personality: "personality",
  "health-beauty": "health-beauty",
  entertainment: "entertainment",
  lifestyle: "lifestyle",
  travel: "travel",
  food: "food",
  technology: "technology",
  sports: "sports",
};

const TopicHubPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [hub, setHub] = useState<TopicHub | null>(null);
  const [posts, setPosts] = useState<HubPost[]>([]);
  const [quizzes, setQuizzes] = useState<HubQuiz[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    const fetchHub = async () => {
      const { data: hubData } = await supabase
        .from("topic_hubs")
        .select("*")
        .eq("slug", slug)
        .single();

      if (hubData) {
        const typedHub = hubData as TopicHub;
        setHub(typedHub);

        // Fetch articles matching this hub's niche
        const { data: postsData } = await supabase
          .from("posts")
          .select("id, title, slug, description, image_url, image_alt, created_at")
          .eq("niche", typedHub.niche)
          .eq("is_published", true)
          .order("created_at", { ascending: false });

        if (postsData) {
          setPosts(postsData as HubPost[]);
        }

        // Fetch quizzes matching the niche via category
        const categorySlug = typedHub.niche
          ? NICHE_TO_CATEGORY_SLUG[typedHub.niche] ?? typedHub.niche
          : null;

        if (categorySlug) {
          const { data: quizData } = await supabase
            .from("quizzes")
            .select("id, title, slug, image_url, categories(name, slug)")
            .eq("is_published", true);

          if (quizData) {
            setQuizzes(
              (quizData as any[]).filter(
                (q) => q.categories?.slug === categorySlug
              ) as HubQuiz[]
            );
          }
        }
      }

      setLoading(false);
    };
    fetchHub();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!hub) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="container flex flex-1 items-center justify-center py-20">
          <div className="text-center">
            <h1 className="font-display text-3xl font-bold text-foreground">Topic Not Found</h1>
            <p className="mt-2 text-muted-foreground">The topic hub you're looking for doesn't exist.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: hub.title,
    url: `https://fizzty.com/topic/${hub.slug}`,
    ...(hub.description && { description: hub.description }),
    hasPart: posts.map((post) => ({
      "@type": "Article",
      name: post.title,
      url: `https://fizzty.com/article/${post.slug}`,
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://fizzty.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: hub.title,
        item: `https://fizzty.com/topic/${hub.slug}`,
      },
    ],
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SEO
        title={`${hub.title} — Topic Hub`}
        description={
          hub.description
            ? hub.description.slice(0, 155)
            : `Explore articles and quizzes about ${hub.title} on Fizzty.`
        }
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(collectionSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>
      <Header />
      <main className="flex-1">
        {/* Breadcrumb */}
        <nav className="container py-4 text-sm text-muted-foreground" aria-label="Breadcrumb">
          <ol className="flex items-center gap-1">
            <li>
              <Link to="/" className="hover:text-primary">Home</Link>
            </li>
            <li>/</li>
            <li className="text-foreground">{hub.title}</li>
          </ol>
        </nav>

        {/* Hub Header */}
        <section className="bg-muted/40 py-10">
          <div className="container flex flex-col items-center text-center">
            <h1 className="mt-4 font-display text-3xl font-bold text-foreground md:text-4xl">
              {hub.title}
            </h1>
            {hub.niche && (
              <span className="mt-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                {hub.niche}
              </span>
            )}
            {hub.description && (
              <p className="mt-3 max-w-2xl text-muted-foreground">{hub.description}</p>
            )}
            <p className="mt-2 text-sm text-muted-foreground">
              {posts.length} {posts.length === 1 ? "article" : "articles"} · {quizzes.length}{" "}
              {quizzes.length === 1 ? "quiz" : "quizzes"}
            </p>
          </div>
        </section>

        {/* Pillar Content */}
        {hub.pillar_content && (
          <section className="container py-8">
            <div className="prose prose-neutral mx-auto max-w-3xl text-foreground">
              {hub.pillar_content.split("\n").map((line, i) => {
                if (!line.trim()) return <br key={i} />;
                if (line.startsWith("## ")) {
                  return (
                    <h2 key={i} className="font-display text-xl font-bold text-foreground">
                      {line.replace("## ", "")}
                    </h2>
                  );
                }
                if (line.startsWith("### ")) {
                  return (
                    <h3 key={i} className="font-display text-lg font-bold text-foreground">
                      {line.replace("### ", "")}
                    </h3>
                  );
                }
                return <p key={i}>{line}</p>;
              })}
            </div>
          </section>
        )}

        {/* Articles Section */}
        <section className="container py-8">
          <h2 className="mb-6 font-display text-2xl font-bold text-foreground">
            Articles in {hub.title}
          </h2>
          {posts.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  to={`/article/${post.slug}`}
                  className="group overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-lg"
                >
                  <div className="aspect-[16/9] overflow-hidden">
                    <img
                      src={post.image_url || "/placeholder.svg"}
                      alt={post.image_alt || post.title}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg";
                      }}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-display text-lg font-bold leading-tight text-foreground group-hover:text-primary">
                      {post.title}
                    </h3>
                    {post.description && (
                      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                        {post.description}
                      </p>
                    )}
                    <p className="mt-2 text-xs text-muted-foreground">
                      {post.created_at.split("T")[0]}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">
              No articles in this topic yet.
            </p>
          )}
        </section>

        {/* Quizzes Section */}
        {quizzes.length > 0 && (
          <section className="container py-8">
            <h2 className="mb-6 font-display text-2xl font-bold text-foreground">
              Quizzes in {hub.title}
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {quizzes.map((quiz) => (
                <Link
                  key={quiz.id}
                  to={`/quiz/${quiz.slug}`}
                  className="group overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-lg"
                >
                  <div className="aspect-[16/9] overflow-hidden">
                    <img
                      src={quiz.image_url || "/placeholder.svg"}
                      alt={quiz.title}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg";
                      }}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-display text-lg font-bold leading-tight text-foreground group-hover:text-primary">
                      {quiz.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default TopicHubPage;
