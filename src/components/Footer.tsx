import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import fizztyLogo from "@/assets/fizzty-logo.png";

interface FooterCategory {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
}

const Footer = () => {
  const [categories, setCategories] = useState<FooterCategory[]>([]);

  useEffect(() => {
    supabase
      .from("categories")
      .select("id, name, slug, icon")
      .order("sort_order")
      .then(({ data }) => {
        if (data) setCategories(data);
      });
  }, []);

  return (
    <footer className="border-t bg-card">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-1">
            <Link to="/" className="font-display text-xl font-black text-primary">
              Quiz<span className="text-secondary">Mania</span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground">
              The best quizzes, trending content & viral stories. Discover who you are and have fun!
            </p>
          </div>

          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-foreground">
              Categories
            </h4>
            <nav className="mt-4 flex flex-col gap-2">
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  to={`/category/${cat.slug}`}
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  {cat.icon} {cat.name}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-foreground">
              Links
            </h4>
            <nav className="mt-4 flex flex-col gap-2">
              <Link to="/" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                Home
              </Link>
              <Link to="/categories" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                All Categories
              </Link>
              <Link to="/about" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                About
              </Link>
              <Link to="/contact" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                Contact
              </Link>
            </nav>
          </div>

          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-foreground">
              Legal
            </h4>
            <nav className="mt-4 flex flex-col gap-2">
              <Link to="/privacy" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                Terms of Use
              </Link>
            </nav>
          </div>
        </div>

        <div className="mt-10 border-t pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} QuizMania. Made with ❤️
        </div>
      </div>
    </footer>
  );
};

export default Footer;
