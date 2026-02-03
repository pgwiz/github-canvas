import { motion, Variants } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedTextProps {
  text: string;
  className?: string;
  el?: keyof JSX.IntrinsicElements;
  delay?: number;
  duration?: number;
}

const defaultContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: (i = 1) => ({
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.04 * i },
  }),
};

const defaultChildVariants: Variants = {
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 12,
      stiffness: 100,
    },
  },
  hidden: {
    opacity: 0,
    y: 20,
    transition: {
      type: "spring",
      damping: 12,
      stiffness: 100,
    },
  },
};

export function AnimatedText({
  text,
  className,
  el: Wrapper = "p",
  delay = 0,
}: AnimatedTextProps) {
  // Split text into words
  const words = text.split(" ");

  // Create a motion component dynamically
  const MotionWrapper = motion(Wrapper);

  return (
    <MotionWrapper
      className={cn("flex flex-wrap gap-x-[0.3em]", className)}
      variants={defaultContainerVariants}
      initial="hidden"
      animate="visible"
      custom={delay}
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          className="inline-block"
          variants={defaultChildVariants}
        >
          {word}
        </motion.span>
      ))}
    </MotionWrapper>
  );
}
