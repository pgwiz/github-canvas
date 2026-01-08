import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Github, FileCode, BookOpen, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
  { href: "/", label: "Home", icon: Sparkles },
  { href: "/generator", label: "Generator", icon: FileCode },
  { href: "/docs", label: "API Docs", icon: BookOpen },
];

export function Header() {
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-background/60 border-b border-white/10 shadow-sm transition-all duration-300 animate-in slide-in-from-top-4 fade-in">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/50 group-hover:shadow-glow transition-shadow">
            <Github className="w-5 h-5 text-primary" />
          </div>
          <span className="font-bold text-lg gradient-text">GitStats</span>
        </Link>

        <nav className="flex items-center gap-1 p-1 rounded-full bg-secondary/30 border border-white/5 backdrop-blur-md">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "relative px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 flex items-center gap-2",
                  isActive ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="navbar-pill"
                    className="absolute inset-0 bg-primary rounded-full shadow-glow"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                   <Icon className="w-4 h-4" />
                   <span className="hidden sm:inline">{item.label}</span>
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
