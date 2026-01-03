import { useState, useEffect } from "react";
import { ArrowUp, Rocket } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // Visibility
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      // Progress
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      setProgress(scrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const circumference = 30 * 2 * Math.PI; // radius approx 30 for the svg circle

  return (
    <div className="fixed bottom-8 right-8 z-50 group">
      <div
        className={cn(
            "relative flex items-center justify-center transition-all duration-500",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
        )}
      >
        {/* Progress Circle SVG */}
        <svg className="w-[60px] h-[60px] rotate-[-90deg] absolute inset-[-6px]" viewBox="0 0 100 100">
             <circle
                className="text-muted/30 stroke-current"
                strokeWidth="6"
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
             />
             <circle
                className="text-primary stroke-current transition-all duration-100 ease-out"
                strokeWidth="6"
                strokeLinecap="round"
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                strokeDasharray={251.2}
                strokeDashoffset={251.2 - (251.2 * progress) / 100}
             />
        </svg>

        <Button
          variant="default"
          size="icon"
          onClick={scrollToTop}
          className={cn(
            "rounded-full h-12 w-12 shadow-lg hover:shadow-primary/50 transition-all duration-300 transform group-hover:scale-110",
            "bg-background/80 backdrop-blur-md border border-primary/20 hover:bg-primary text-primary hover:text-white"
          )}
          aria-label="Scroll to top"
        >
          {progress > 98 ? (
             <Rocket className="h-5 w-5 animate-pulse" />
          ) : (
             <ArrowUp className="h-5 w-5 group-hover:-translate-y-1 transition-transform" />
          )}
        </Button>
      </div>

      {/* Glow effect behind the button */}
      <div
        className={cn(
          "absolute inset-0 rounded-full bg-primary/40 blur-2xl transition-opacity duration-300 -z-10",
          isVisible ? "opacity-100" : "opacity-0"
        )}
      />
    </div>
  );
}
