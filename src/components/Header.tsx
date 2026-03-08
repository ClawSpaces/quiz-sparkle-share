import { Link, useLocation } from "react-router-dom";
import { Search, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navItems = [
  { label: "Quizzes", path: "/", icon: "🧠" },
  { label: "Trending", path: "/trending", icon: "🔥" },
  { label: "Shopping", path: "/shopping", icon: "🛍️" },
  { label: "Celebrity", path: "/celebrity", icon: "⭐" },
  { label: "Buzz Chat", path: "/buzzchat", icon: "💬" },
];

const Header = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container flex h-14 items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <span className="font-display text-xl font-black tracking-tight text-primary">
            Quiz<span className="text-secondary">Mania</span>
          </span>
        </Link>

        {/* Desktop Nav - BuzzFeed style tabs */}
        <nav className="hidden items-center gap-0 md:flex">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-4 py-4 text-sm font-bold uppercase tracking-wide transition-colors ${
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[3px] rounded-t-full bg-primary" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Search & Mobile Menu */}
        <div className="flex items-center gap-2">
          {searchOpen ? (
            <div className="flex items-center gap-2">
              <Input
                placeholder="Αναζήτηση..."
                className="w-48 md:w-64"
                autoFocus
              />
              <Button variant="ghost" size="icon" onClick={() => setSearchOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button variant="ghost" size="icon" onClick={() => setSearchOpen(true)}>
              <Search className="h-4 w-4" />
            </Button>
          )}

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <nav className="mt-8 flex flex-col gap-1">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`rounded-lg px-4 py-3 text-base font-semibold transition-colors hover:bg-muted ${
                      location.pathname === item.path
                        ? "text-primary bg-primary/5"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {item.icon} {item.label}
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
