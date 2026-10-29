import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Github, FileCode, BookOpen, Sparkles, Search, Palette, 
  UserCheck, Menu, ChevronRight, ExternalLink, BarChart3, 
  Flame, Layers, Bookmark 
} from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useEffect } from "react";
import { useCommandMenu } from "./command-menu-context";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";

const navItems = [
  { href: "/", label: "Home", description: "Showcase & live overview", icon: Sparkles },
  { href: "/generator", label: "Generator", description: "Customize & export dynamic SVG cards", icon: FileCode },
  { href: "/themes", label: "Themes", description: "Browse 18+ curated color themes", icon: Palette },
  { href: "/profile-customizer", label: "AI Profile", description: "Craft GitHub profile README from CV", icon: UserCheck },
  { href: "/docs", label: "Docs", description: "API reference & query specifications", icon: BookOpen },
];

export function Header() {
  const location = useLocation();
  const { setOpen } = useCommandMenu();
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile drawer whenever route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    return scrollY.onChange((latest) => {
      setIsScrolled(latest > 30);
    });
  }, [scrollY]);

  const headerBackground = useTransform(
    scrollY,
    [0, 50],
    ["hsl(var(--background) / 0.7)", "hsl(var(--background) / 0.9)"]
  );

  const headerBlur = useTransform(
    scrollY,
    [0, 50],
    ["blur(10px)", "blur(18px)"]
  );

  return (
    <motion.header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b w-full",
        isScrolled ? "border-white/10 shadow-lg shadow-black/30" : "border-white/5 shadow-none"
      )}
      style={{
        backgroundColor: headerBackground,
        backdropFilter: headerBlur,
        WebkitBackdropFilter: headerBlur,
      }}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Subtle bottom accent line on scroll */}
      <div 
        className={cn(
          "absolute bottom-0 left-0 h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent transition-all duration-500",
          isScrolled ? "w-full opacity-100" : "w-0 opacity-0 left-1/2 -translate-x-1/2"
        )} 
      />

      <div className="container mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between gap-2 max-w-7xl">
        {/* BRAND LOGO */}
        <Link 
          to="/" 
          className="flex items-center gap-2 sm:gap-2.5 group shrink-0 relative z-10 min-w-0"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:border-primary/50 transition-all duration-300 shrink-0">
            <Github className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-primary transition-transform group-hover:scale-110" />
          </div>
          <span className="font-bold text-sm sm:text-base md:text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-white/90 to-white/70 group-hover:from-primary group-hover:to-secondary transition-all duration-300 truncate">
            GitStats
          </span>
        </Link>

        {/* DESKTOP & TABLET FLOATING PILL NAVIGATION (md and up) */}
        <nav className="hidden md:flex items-center gap-1 p-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-inner">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "relative flex items-center gap-1.5 lg:gap-2 px-3 lg:px-4 py-1.5 lg:py-2 rounded-full text-xs lg:text-sm font-medium transition-colors z-10 shrink-0",
                  isActive ? "text-primary-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-primary rounded-full z-[-1] shadow-sm shadow-primary/30"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <Icon className="w-3.5 h-3.5 lg:w-4 lg:h-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* RIGHT ACTIONS: SEARCH, THEME, MOBILE DRAWER */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Desktop Search Button */}
          <button
            onClick={() => setOpen(true)}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 sm:py-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-foreground text-xs sm:text-sm transition-all duration-300 hover:border-primary/30 group"
          >
            <Search className="w-3.5 h-3.5 group-hover:text-primary transition-colors shrink-0" />
            <span className="text-xs">Search...</span>
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-0.5 rounded border border-white/10 bg-white/5 px-1.5 font-mono text-[10px] font-medium opacity-100">
              <span className="text-[10px]">⌘</span>K
            </kbd>
          </button>

          {/* Mobile Search Icon Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => setOpen(true)}
            className="flex md:hidden w-8 h-8 sm:w-9 sm:h-9 rounded-full border-white/10 bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-foreground hover:border-primary/30 shrink-0"
            title="Search (⌘K)"
            aria-label="Search"
          >
            <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </Button>

          {/* Theme Toggle Button */}
          <ThemeToggle />

          {/* Mobile Drawer Trigger (Sheet) */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="flex md:hidden w-8 h-8 sm:w-9 sm:h-9 rounded-full border-white/10 bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-foreground hover:border-primary/30 shrink-0"
                aria-label="Open Navigation Menu"
              >
                <Menu className="w-4 h-4" />
              </Button>
            </SheetTrigger>

            <SheetContent 
              side="right" 
              className="w-[85vw] max-w-xs sm:max-w-sm bg-background/95 backdrop-blur-2xl border-l border-white/10 p-0 flex flex-col z-50 overflow-hidden"
            >
              {/* Sheet Header */}
              <SheetHeader className="p-4 sm:p-5 border-b border-white/10 flex flex-row items-center justify-between space-y-0 text-left">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
                    <Github className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <SheetTitle className="text-sm sm:text-base font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70 text-left">
                      GitStats
                    </SheetTitle>
                    <SheetDescription className="text-[11px] text-muted-foreground text-left">
                      Profile Intelligence Studio
                    </SheetDescription>
                  </div>
                </div>
              </SheetHeader>

              {/* Scrollable Navigation Body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Quick Search Trigger inside Drawer */}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setOpen(true);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-left text-xs text-muted-foreground transition-all group"
                >
                  <span className="flex items-center gap-2">
                    <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-primary transition-colors" />
                    <span>Quick search commands...</span>
                  </span>
                  <kbd className="pointer-events-none inline-flex h-4 select-none items-center gap-0.5 rounded border border-white/10 bg-white/5 px-1 font-mono text-[9px] text-slate-400 font-medium">
                    ⌘K
                  </kbd>
                </button>

                {/* Primary Navigation Links */}
                <div className="space-y-1">
                  <div className="px-2 pb-1 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                    Navigation
                  </div>
                  {navItems.map((item) => {
                    const isActive = location.pathname === item.href;
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        to={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          "flex items-center gap-3 p-2 rounded-xl text-sm font-medium transition-all group border",
                          isActive
                            ? "bg-primary/15 text-primary border-primary/30 shadow-sm"
                            : "text-slate-300 hover:text-white hover:bg-white/5 border-transparent"
                        )}
                      >
                        <div
                          className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                            isActive
                              ? "bg-primary text-white shadow-sm"
                              : "bg-white/5 text-slate-400 group-hover:bg-white/10 group-hover:text-white"
                          )}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs sm:text-sm font-semibold truncate leading-tight">
                            {item.label}
                          </div>
                          <div className="text-[10px] sm:text-[11px] text-muted-foreground truncate leading-tight mt-0.5">
                            {item.description}
                          </div>
                        </div>
                        {isActive ? (
                          <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 shrink-0" />
                        )}
                      </Link>
                    );
                  })}
                </div>

                {/* Quick Shortcuts */}
                <div className="space-y-1 pt-1">
                  <div className="px-2 pb-1 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                    Quick Studio Jumps
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    <Link
                      to="/generator?type=stats"
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors border border-white/5"
                    >
                      <BarChart3 className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span className="truncate">User Stats</span>
                    </Link>
                    <Link
                      to="/generator?type=streak"
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors border border-white/5"
                    >
                      <Flame className="w-3.5 h-3.5 text-secondary shrink-0" />
                      <span className="truncate">Streak</span>
                    </Link>
                    <Link
                      to="/generator?type=skills"
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors border border-white/5"
                    >
                      <Layers className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span className="truncate">Tech Stack</span>
                    </Link>
                    <Link
                      to="/generator?type=pin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors border border-white/5"
                    >
                      <Bookmark className="w-3.5 h-3.5 text-secondary shrink-0" />
                      <span className="truncate">Pinned Repo</span>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="p-3.5 border-t border-white/10 bg-surface/60 flex items-center justify-between text-xs text-muted-foreground shrink-0">
                <span className="text-[11px] text-slate-400">GitStats Studio</span>
                <a
                  href="https://github.com/pgwiz/github-canvas"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-[11px] text-slate-300 hover:text-primary transition-colors"
                >
                  <Github className="w-3 h-3" />
                  <span>GitHub</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  );
}
