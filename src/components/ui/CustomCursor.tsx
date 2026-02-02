import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";

export const CustomCursor = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  // Mouse position
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth springs for the follower (ring)
  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const cursorXSpring = useSpring(mouseX, springConfig);
  const cursorYSpring = useSpring(mouseY, springConfig);

  // Smooth springs for the dot (immediate)
  const dotSpringConfig = { damping: 30, stiffness: 700 };
  const dotXSpring = useSpring(mouseX, dotSpringConfig);
  const dotYSpring = useSpring(mouseY, dotSpringConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      setIsVisible(true);

      // Check for hoverable elements
      const target = e.target as HTMLElement;
      const isInteractive =
        target.closest("button") ||
        target.closest("a") ||
        target.closest("input") ||
        target.closest("textarea") ||
        target.closest("[data-hover]") ||
        window.getComputedStyle(target).cursor === "pointer";

      setIsHovering(!!isInteractive);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseDown = () => setIsHovering(true); // Shrink/effect on click
    const handleMouseUp = () => {
        // Re-check hover state after click
        // (Simplified: just keep it consistent with moveCursor logic which fires continuously)
    };

    window.addEventListener("mousemove", moveCursor);
    document.body.addEventListener("mouseleave", handleMouseLeave);
    document.body.addEventListener("mouseenter", handleMouseEnter);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      document.body.removeEventListener("mouseleave", handleMouseLeave);
      document.body.removeEventListener("mouseenter", handleMouseEnter);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [mouseX, mouseY]);

  // Hide on mobile (coarse pointer)
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) {
      setIsVisible(false);
    }
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Main Ring Follower */}
          <motion.div
            className="fixed top-0 left-0 pointer-events-none z-[9999] hidden md:block mix-blend-difference"
            style={{
              x: cursorXSpring,
              y: cursorYSpring,
              translateX: "-50%",
              translateY: "-50%",
            }}
            animate={{
              width: isHovering ? 48 : 24,
              height: isHovering ? 48 : 24,
              opacity: isHovering ? 0.8 : 0.4,
              scale: isHovering ? 1.2 : 1,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <div className="w-full h-full rounded-full border border-white bg-white/5 backdrop-blur-[1px]" />
          </motion.div>

          {/* Central Dot */}
          <motion.div
            className="fixed top-0 left-0 pointer-events-none z-[9999] hidden md:block mix-blend-difference"
            style={{
              x: dotXSpring,
              y: dotYSpring,
              translateX: "-50%",
              translateY: "-50%",
            }}
          >
            <motion.div
                animate={{ scale: isHovering ? 0.5 : 1 }}
                className="w-2 h-2 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
