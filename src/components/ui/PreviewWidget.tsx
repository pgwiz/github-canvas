import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Flame } from "lucide-react";

interface PreviewWidgetProps {
  type: "stats" | "streak" | "languages";
  className?: string;
}

export function PreviewWidget({ type, className }: PreviewWidgetProps) {
  if (type === "stats") {
    return (
      <div className={cn("flex items-end gap-1.5 h-12 w-full px-4 justify-center", className)}>
        {[0.4, 0.8, 0.6, 1.0, 0.5, 0.7].map((height, i) => (
          <motion.div
            key={i}
            className="w-2 bg-primary/60 rounded-t-sm backdrop-blur-sm border border-primary/20"
            initial={{ height: "10%" }}
            animate={{ height: [`${height * 30}%`, `${height * 100}%`, `${height * 30}%`] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.1,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    );
  }

  if (type === "streak") {
    return (
      <div className={cn("relative flex items-center justify-center h-16 w-full", className)}>
         <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute w-12 h-12 bg-orange-500/30 rounded-full blur-xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            y: [0, -2, 0],
            filter: ["brightness(1)", "brightness(1.3)", "brightness(1)"],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative z-10"
        >
          <Flame className="w-10 h-10 text-orange-500 fill-orange-500/50 drop-shadow-[0_0_10px_rgba(249,115,22,0.5)]" />
        </motion.div>

        {/* Floating particles */}
        {[...Array(3)].map((_, i) => (
           <motion.div
             key={i}
             className="absolute w-1 h-1 bg-orange-400 rounded-full"
             initial={{ opacity: 0, y: 0, x: 0 }}
             animate={{ opacity: [0, 1, 0], y: -20, x: (i - 1) * 10 }}
             transition={{
               duration: 1 + Math.random(),
               repeat: Infinity,
               delay: Math.random() * 2,
               ease: "easeOut"
             }}
           />
        ))}
      </div>
    );
  }

  if (type === "languages") {
    return (
      <div className={cn("flex flex-col gap-3 w-full px-4 justify-center", className)}>
        {[
            { color: "bg-[#3178c6]", width: "85%", label: "TS" }, // TypeScript blue
            { color: "bg-[#f7df1e]", width: "65%", label: "JS" }, // JS Yellow
            { color: "bg-[#e34c26]", width: "45%", label: "HTML" } // HTML Orange
        ].map((lang, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-muted-foreground w-6 text-right">{lang.label}</span>
            <div className="h-2 flex-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                className={cn("h-full rounded-full shadow-[0_0_10px_currentColor]", lang.color)}
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                transition={{
                    duration: 1.5,
                    delay: i * 0.3,
                    ease: "circOut",
                    repeat: Infinity,
                    repeatDelay: 3,
                    repeatType: "mirror" // Slide back and forth
                }}
                style={{ width: lang.width }}
                />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return null;
}
