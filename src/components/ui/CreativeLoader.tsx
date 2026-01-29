import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CreativeLoaderProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "cyber" | "minimal";
}

export function CreativeLoader({
  className,
  size = "md",
  variant = "default"
}: CreativeLoaderProps) {

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16"
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { scale: 0, opacity: 0 },
    show: { scale: 1, opacity: 1 }
  };

  if (variant === "cyber") {
    return (
      <div className={cn("relative flex items-center justify-center", sizeClasses[size], className)}>
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent"
        />
        <motion.div
          animate={{
            rotate: -360,
            scale: [1, 0.9, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute inset-2 rounded-full border-2 border-secondary border-b-transparent"
        />
        <motion.div
          animate={{
            opacity: [0.5, 1, 0.5],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-2 h-2 bg-white rounded-full"
        />
      </div>
    );
  }

  // Default Grid Loader
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className={cn("grid grid-cols-2 gap-1", sizeClasses[size], className)}
    >
      {[0, 1, 2, 3].map((index) => (
        <motion.div
          key={index}
          variants={item}
          animate={{
            scale: [1, 0.8, 1],
            opacity: [1, 0.5, 1],
            borderRadius: ["20%", "50%", "20%"],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatDelay: index * 0.1,
            ease: "easeInOut"
          }}
          className={cn(
            "w-full h-full",
            index % 2 === 0 ? "bg-primary" : "bg-secondary"
          )}
        />
      ))}
    </motion.div>
  );
}
