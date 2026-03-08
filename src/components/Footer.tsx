import { Link } from "react-router-dom";
import { categories } from "@/data/sampleQuizzes";

const Footer = () => {
  return (
    <footer className="border-t bg-card">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="font-display text-xl font-black text-primary">
              Quiz<span className="text-secondary">Mania</span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground">
              Τα καλύτερα quizzes στα Ελληνικά. Ανακάλυψε ποιος είσαι, τέσταρε τις γνώσεις σου και διασκέδασε!
            </p>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-foreground">
              Κατηγορίες
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

          {/* Links */}
          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-foreground">
              Σύνδεσμοι
            </h4>
            <nav className="mt-4 flex flex-col gap-2">
              <Link to="/" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                Αρχική
              </Link>
              <Link to="/categories" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                Όλες οι Κατηγορίες
              </Link>
              <Link to="/about" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                Σχετικά
              </Link>
              <Link to="/contact" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                Επικοινωνία
              </Link>
            </nav>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-foreground">
              Νομικά
            </h4>
            <nav className="mt-4 flex flex-col gap-2">
              <Link to="/privacy" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                Πολιτική Απορρήτου
              </Link>
              <Link to="/terms" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                Όροι Χρήσης
              </Link>
            </nav>
          </div>
        </div>

        <div className="mt-10 border-t pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} QuizMania. Με ❤️ στην Ελλάδα.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
