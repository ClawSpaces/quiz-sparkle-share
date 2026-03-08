import { Link } from "react-router-dom";
import { Search, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { categories } from "@/data/sampleQuizzes";

const Header = () => {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container flex h-16 items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="font-display text-2xl font-black tracking-tight text-primary">
            Quiz<span className="text-secondary">Mania</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          <Link
            to="/"
            className="rounded-lg px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            Αρχική
          </Link>
          {categories.slice(0, 4).map((cat) => (
            <Link
              key={cat.slug}
              to={`/category/${cat.slug}`}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {cat.icon} {cat.name}
            </Link>
          ))}
          <Link
            to="/categories"
            className="rounded-lg px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/10"
          >
            Όλες →
          </Link>
        </nav>

        {/* Search & Mobile Menu */}
        <div className="flex items-center gap-2">
          {searchOpen ? (
            <div className="flex items-center gap-2">
              <Input
                placeholder="Αναζήτηση quiz..."
                className="w-48 md:w-64"
                autoFocus
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="h-4 w-4" />
            </Button>
          )}

          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <nav className="mt-8 flex flex-col gap-1">
                <Link
                  to="/"
                  className="rounded-lg px-4 py-3 text-base font-semibold text-foreground transition-colors hover:bg-muted"
                >
                  🏠 Αρχική
                </Link>
                {categories.map((cat) => (
                  <Link
                    key={cat.slug}
                    to={`/category/${cat.slug}`}
                    className="rounded-lg px-4 py-3 text-base text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    {cat.icon} {cat.name}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
