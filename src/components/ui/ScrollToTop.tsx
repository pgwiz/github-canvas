import { useState, useEffect } from "react";
import { Rocket } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const { scrollYProgress } = useScroll();

  // Smooth out the progress value
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Convert progress to stroke-dasharray for circle
  // Circle circumference: 2 * PI * r. If r=18, C ~= 113
  const strokeDashoffset = useTransform(scaleX, [0, 1], [113, 0]);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className={cn(
      "fixed bottom-8 right-8 z-50 transition-all duration-500",
      isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0 pointer-events-none"
    )}>
      <motion.button
        onClick={scrollToTop}
        className="relative flex items-center justify-center w-12 h-12 rounded-full bg-background/80 backdrop-blur-sm border border-white/10 shadow-lg group hover:scale-110 transition-transform duration-300"
        whileHover={{ y: -5 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Scroll to top"
      >
        {/* Progress Circle */}
        <svg className="absolute inset-0 w-full h-full -rotate-90 transform" viewBox="0 0 48 48">
          {/* Track */}
          <circle
            cx="24"
            cy="24"
            r="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className="text-muted/20"
          />
          {/* Indicator */}
          <motion.circle
            cx="24"
            cy="24"
            r="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            className="text-primary"
            style={{
              strokeDasharray: 113,
              strokeDashoffset
            }}
          />
        </svg>

        {/* Rocket Icon */}
        <div className="relative z-10 text-foreground group-hover:text-primary transition-colors">
          <Rocket className="w-5 h-5 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />

          {/* Jet trail on hover */}
          <div className="absolute top-full left-0 right-0 h-4 w-full flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="w-1 h-3 bg-orange-500 rounded-full blur-[2px] animate-pulse" />
          </div>
        </div>

        {/* Outer Glow */}
        <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </motion.button>
    </div>
  );
}
