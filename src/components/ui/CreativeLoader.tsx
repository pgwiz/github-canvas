import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CreativeLoaderProps {
  className?: string;
}

export function CreativeLoader({ className }: CreativeLoaderProps) {
  return (
    <motion.div
        className={cn("w-10 h-10 grid grid-cols-2 gap-1", className)}
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
    >
        {[0, 1, 2, 3].map((i) => (
            <motion.div
                key={i}
                className="bg-primary rounded-[2px]"
                initial={{ scale: 0.5 }}
                animate={{ scale: [0.5, 1, 0.5] }}
                transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut",
                    repeatType: "reverse"
                }}
            />
        ))}
    </motion.div>
  );
}
