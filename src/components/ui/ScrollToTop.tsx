import { useState, useEffect } from "react";
import { Rocket } from "lucide-react";
import { Button } from "./button";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

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
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-8 right-8 z-50"
        >
          <Button
            variant="outline"
            size="icon"
            onClick={scrollToTop}
            className="group relative rounded-full h-12 w-12 shadow-lg backdrop-blur-md bg-background/50 border-white/10 hover:bg-background/80 transition-all duration-300 overflow-hidden"
            aria-label="Scroll to top"
          >
             {/* Progress Ring */}
            <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none p-0.5">
               <circle
                 cx="22"
                 cy="22"
                 r="20"
                 fill="none"
                 stroke="currentColor"
                 strokeWidth="2"
                 className="text-muted-foreground/20"
               />
               <motion.circle
                 cx="22"
                 cy="22"
                 r="20"
                 fill="none"
                 stroke="currentColor"
                 strokeWidth="2"
                 className="text-primary"
                 style={{ pathLength: scaleX }}
               />
            </svg>

            <span className="relative z-10">
               <Rocket className="h-5 w-5 group-hover:-translate-y-1 transition-transform text-foreground group-hover:text-primary" />
            </span>

            {/* Rocket exhaust effect on hover */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1 h-3 bg-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity blur-[2px]" />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
