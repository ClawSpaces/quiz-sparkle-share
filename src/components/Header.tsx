import { Link, useLocation } from "react-router-dom";
import { Search, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const navItems = [
  { label: "Trending", path: "/trending" },
  { label: "Quizzes", path: "/quizzes" },
  { label: "Shopping", path: "/shopping" },
  { label: "Celebrity", path: "/celebrity" },
  { label: "Buzz Chat", path: "/buzzchat" },
];

const Header = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();
  const activeRef = useRef<HTMLAnchorElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll active tab into view on mobile
  useEffect(() => {
    if (activeRef.current && scrollRef.current) {
      activeRef.current.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      {/* Top bar: Logo + Search */}
      <div className="container flex h-12 items-center justify-between gap-4 md:h-14">
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <span className="font-display text-xl font-black tracking-tight text-primary">
            Quiz<span className="text-secondary">Mania</span>
          </span>
        </Link>

        {/* Desktop Nav */}
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

        {/* Search */}
        <div className="flex items-center gap-2">
          {searchOpen ? (
            <div className="flex items-center gap-2">
              <Input
                placeholder="Αναζήτηση..."
                className="w-40 md:w-64"
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
        </div>
      </div>

      {/* Mobile scrollable tab bar */}
      <div
        ref={scrollRef}
        className="flex md:hidden overflow-x-auto scrollbar-none border-t border-border"
      >
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              ref={isActive ? activeRef : undefined}
              className={`relative flex-shrink-0 px-4 py-2.5 text-xs font-bold uppercase tracking-wide transition-colors ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              {item.label}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary" />
              )}
            </Link>
          );
        })}
      </div>
    </header>
  );
};

export default Header;
