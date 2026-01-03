import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

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
    <div className="fixed bottom-8 right-8 z-50">
      <Button
        variant="outline"
        size="icon"
        onClick={scrollToTop}
        className={cn(
          "rounded-full h-12 w-12 shadow-lg backdrop-blur-md bg-background/50 border-white/10 hover:bg-background/80 transition-all duration-300 transform",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
        )}
        aria-label="Scroll to top"
      >
        <ArrowUp className="h-5 w-5" />
      </Button>
      {/* Glow effect behind the button */}
      <div
        className={cn(
          "absolute inset-0 rounded-full bg-primary/20 blur-xl transition-opacity duration-300 -z-10",
          isVisible ? "opacity-100" : "opacity-0"
        )}
      />
    </div>
  );
}
