import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Github, FileCode, BookOpen, Sparkles, Search } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useEffect } from "react";
import { useCommandMenu } from "./command-menu-context";

const MotionLink = motion(Link);

const navItems = [
  { href: "/", label: "Home", icon: Sparkles },
  { href: "/generator", label: "Generator", icon: FileCode },
  { href: "/docs", label: "API Docs", icon: BookOpen },
];

export function Header() {
  const location = useLocation();
  const { setOpen } = useCommandMenu();
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    return scrollY.onChange((latest) => {
      setIsScrolled(latest > 50);
    });
  }, [scrollY]);

  const headerBackground = useTransform(
    scrollY,
    [0, 50],
    ["hsl(var(--background) / 0.6)", "hsl(var(--background) / 0.8)"]
  );

  const headerBlur = useTransform(
    scrollY,
    [0, 50],
    ["blur(8px)", "blur(16px)"]
  );

  return (
    <motion.header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
        isScrolled ? "border-white/10 shadow-lg shadow-primary/5" : "border-transparent shadow-none"
      )}
      style={{
        backgroundColor: headerBackground,
        backdropFilter: headerBlur,
        WebkitBackdropFilter: headerBlur,
      }}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Animated bottom gradient line */}
      <div className={cn(
        "absolute bottom-0 left-0 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent transition-all duration-500",
        isScrolled ? "w-full opacity-100" : "w-0 opacity-0 left-1/2 -translate-x-1/2"
      )} />

      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group relative z-10">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:border-primary/50 group-hover:shadow-[0_0_15px_rgba(12,247,9,0.3)] transition-all duration-300">
            <Github className="w-5 h-5 text-primary transition-transform group-hover:scale-110" />
          </div>
          <span className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70 group-hover:from-primary group-hover:to-secondary transition-all duration-300">GitStats</span>
        </Link>

        <div className="flex items-center gap-4">
          <motion.nav
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0, scale: 0.95 },
              visible: {
                opacity: 1,
                scale: 1,
                transition: {
                  staggerChildren: 0.1,
                  delayChildren: 0.2
                }
              }
            }}
            className="flex items-center gap-1 p-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md"
          >
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              const Icon = item.icon;
              return (
                <MotionLink
                  key={item.href}
                  to={item.href}
                  variants={{
                    hidden: { opacity: 0, y: -10 },
                    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 20 } }
                  }}
                  className={cn(
                    "relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors z-10",
                    isActive ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-primary rounded-full z-[-1]"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </MotionLink>
              );
            })}
          </motion.nav>

          <button
            onClick={() => setOpen(true)}
            className="hidden md:flex items-center gap-2 px-3 py-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-foreground text-sm transition-all duration-300 hover:border-primary/30 group"
          >
            <Search className="w-4 h-4 group-hover:text-primary transition-colors" />
            <span className="text-xs">Search...</span>
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-white/10 bg-white/5 px-1.5 font-mono text-[10px] font-medium opacity-100">
              <span className="text-xs">⌘</span>K
            </kbd>
          </button>
        </div>
      </div>
    </motion.header>
  );
}
