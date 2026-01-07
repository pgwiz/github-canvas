import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Github, FileCode, BookOpen, Sparkles } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const navItems = [
  { href: "/", label: "Home", icon: Sparkles },
  { href: "/generator", label: "Generator", icon: FileCode },
  { href: "/docs", label: "API Docs", icon: BookOpen },
];

export function Header() {
  const location = useLocation();
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);
  const itemsRef = useRef<{ [key: string]: HTMLAnchorElement | null }>({});
  const [pillStyle, setPillStyle] = useState<{ left: string; width: string; opacity: number }>({
    left: "0px",
    width: "0px",
    opacity: 0,
  });

  useEffect(() => {
    const targetPath = hoveredPath || location.pathname;
    const element = itemsRef.current[targetPath];

    if (element) {
      setPillStyle({
        left: `${element.offsetLeft}px`,
        width: `${element.offsetWidth}px`,
        opacity: 1,
      });
    } else {
      // If no hovered path and current path isn't in nav (e.g. 404), hide pill
      // or if we just stopped hovering and current path is valid, it should have been caught above.
      // But if we are at a route not in navItems, opacity should be 0 unless hovering.
      if (!hoveredPath && !navItems.find((i) => i.href === location.pathname)) {
        setPillStyle((prev) => ({ ...prev, opacity: 0 }));
      }
    }
  }, [hoveredPath, location.pathname]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-background/60 border-b border-white/10 shadow-sm transition-all duration-300 animate-in slide-in-from-top-4 fade-in">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/50 overflow-hidden transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(var(--primary),0.5)] group-hover:border-primary">
             <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <Github className="w-5 h-5 text-primary relative z-10 transition-transform group-hover:scale-110" />
          </div>
          <span className="font-bold text-lg gradient-text tracking-tight">GitStats</span>
        </Link>

        <nav className="relative flex items-center bg-background/40 rounded-full p-1 border border-white/5 backdrop-blur-md">
          {/* Sliding Pill */}
          <div
            className="absolute h-[calc(100%-8px)] top-1 bg-primary/10 border border-primary/20 rounded-full transition-all duration-300 ease-out"
            style={{
              left: pillStyle.left,
              width: pillStyle.width,
              opacity: pillStyle.opacity,
            }}
          />

          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                to={item.href}
                ref={(el) => (itemsRef.current[item.href] = el)}
                onMouseEnter={() => setHoveredPath(item.href)}
                onMouseLeave={() => setHoveredPath(null)}
                className={cn(
                  "relative z-10 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className={cn("w-4 h-4 transition-transform duration-300", hoveredPath === item.href && "scale-110")} />
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
