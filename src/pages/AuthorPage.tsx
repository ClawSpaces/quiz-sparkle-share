import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import SEO from "@/components/SEO";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";

interface Author {
  id: string;
  name: string;
  slug: string;
  bio: string | null;
  credentials: string | null;
  image_url: string | null;
  social_links: { linkedin?: string; twitter?: string } | null;
  expertise: string[] | null;
  created_at: string;
}

interface AuthorPost {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  image_alt: string | null;
  created_at: string;
}

const AuthorPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [author, setAuthor] = useState<Author | null>(null);
  const [posts, setPosts] = useState<AuthorPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    const fetchAuthor = async () => {
      const { data: authorData } = await supabase
        .from("authors")
        .select("*")
        .eq("slug", slug)
        .single();

      if (authorData) {
        setAuthor(authorData as Author);

        const { data: postsData } = await supabase
          .from("posts")
          .select("id, title, slug, description, image_url, image_alt, created_at")
          .eq("author_person_id", authorData.id)
          .order("created_at", { ascending: false });

        if (postsData) {
          setPosts(postsData as AuthorPost[]);
        }
      }

      setLoading(false);
    };
    fetchAuthor();
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

  if (!author) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="container flex flex-1 items-center justify-center py-20">
          <div className="text-center">
            <h1 className="font-display text-3xl font-bold text-foreground">Author Not Found</h1>
            <p className="mt-2 text-muted-foreground">The author you're looking for doesn't exist.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: author.name,
    url: `https://fizzty.com/author/${author.slug}`,
    ...(author.image_url && { image: author.image_url }),
    ...(author.bio && { description: author.bio }),
    ...(author.credentials && { jobTitle: author.credentials }),
    ...(author.expertise && author.expertise.length > 0 && { knowsAbout: author.expertise }),
    ...(author.social_links && {
      sameAs: Object.values(author.social_links).filter(Boolean),
    }),
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SEO
        title={`${author.name} — Author`}
        description={
          author.bio
            ? author.bio.slice(0, 155)
            : `Articles and quizzes by ${author.name} on Fizzty.`
        }
        image={author.image_url || undefined}
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(personSchema)}</script>
      </Helmet>
      <Header />
      <main className="flex-1">
        {/* Author Profile Section */}
        <section className="bg-muted/40 py-10">
          <div className="container flex flex-col items-center text-center">
            {author.image_url ? (
              <img
                src={author.image_url}
                alt={author.name}
                className="h-24 w-24 rounded-full object-cover border-2 border-primary"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-3xl font-bold text-primary">
                {author.name.charAt(0)}
              </div>
            )}
            <h1 className="mt-4 font-display text-3xl font-bold text-foreground md:text-4xl">
              {author.name}
            </h1>
            {author.credentials && (
              <p className="mt-1 text-sm font-medium text-primary">{author.credentials}</p>
            )}
            {author.bio && (
              <p className="mt-3 max-w-2xl text-muted-foreground">{author.bio}</p>
            )}

            {/* Expertise Tags */}
            {author.expertise && author.expertise.length > 0 && (
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {author.expertise.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Social Links */}
            {author.social_links && (
              <div className="mt-4 flex items-center gap-4">
                {author.social_links.linkedin && (
                  <a
                    href={author.social_links.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground underline hover:text-primary"
                  >
                    LinkedIn
                  </a>
                )}
                {author.social_links.twitter && (
                  <a
                    href={author.social_links.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground underline hover:text-primary"
                  >
                    Twitter
                  </a>
                )}
              </div>
            )}

            <p className="mt-2 text-sm text-muted-foreground">
              {posts.length} {posts.length === 1 ? "article" : "articles"}
            </p>
          </div>
        </section>

        {/* Articles Section */}
        <section className="container py-8">
          <h2 className="mb-6 font-display text-2xl font-bold text-foreground">
            Articles by {author.name}
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
              No articles by this author yet.
            </p>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AuthorPage;
