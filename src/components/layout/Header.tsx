import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Github, FileCode, BookOpen, Sparkles } from "lucide-react";

const navItems = [
  { href: "/", label: "Home", icon: Sparkles },
  { href: "/generator", label: "Generator", icon: FileCode },
  { href: "/docs", label: "API Docs", icon: BookOpen },
];

export function Header() {
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-border/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/50 group-hover:shadow-glow transition-shadow">
            <Github className="w-5 h-5 text-primary" />
          </div>
          <span className="font-bold text-lg gradient-text">GitStats</span>
        </Link>

        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                  isActive
                    ? "bg-primary/20 text-primary border border-primary/50"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
