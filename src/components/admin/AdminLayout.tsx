import { useEffect } from "react";
import { useNavigate, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, FileText, HelpCircle, FolderOpen, MessageCircle, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/admin", icon: LayoutDashboard, label: "Dashboard", end: true },
  { to: "/admin/posts", icon: FileText, label: "Posts" },
  { to: "/admin/quizzes", icon: HelpCircle, label: "Quizzes" },
  { to: "/admin/categories", icon: FolderOpen, label: "Categories" },
  { to: "/admin/buzzchat", icon: MessageCircle, label: "BuzzChat" },
];

export default function AdminLayout() {
  const { isAdmin, loading, signOut, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate("/admin/login");
    }
  }, [isAdmin, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen flex bg-muted">
      <aside className="w-64 bg-card border-r flex flex-col">
        <div className="p-4 border-b">
          <h1 className="text-lg font-bold text-foreground">Fizzty Admin</h1>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t">
          <p className="text-xs text-muted-foreground mb-2 truncate">{user?.email}</p>
          <Button variant="ghost" size="sm" className="w-full justify-start" onClick={signOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
