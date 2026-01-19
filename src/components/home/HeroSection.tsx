import { MagneticButton } from "@/components/ui/MagneticButton";
import { SpotlightGrid } from "@/components/ui/SpotlightGrid";
import { ArrowRight, Sparkles, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { GlassPanel, GlassInnerPanel } from "@/components/ui/GlassPanel";
import { TiltCard } from "@/components/ui/TiltCard";
import { motion, useSpring, useMotionValue, useTransform } from "framer-motion";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

const StreakCardContent = ({ animateFloat = false }: { animateFloat?: boolean }) => (
  <TiltCard className="h-full">
    <GlassPanel
      hover
      accent="teal"
      active
      className={cn("text-left h-full flex flex-col justify-between", animateFloat && "animate-float")}
    >
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-lg bg-secondary/20 flex items-center justify-center backdrop-blur-sm shadow-[0_0_15px_rgba(var(--secondary),0.3)]">
            <span className="text-2xl">🔥</span>
          </div>
          <div>
            <h3 className="font-semibold text-white">Streak Tracker</h3>
            <p className="text-sm text-white/60">Current & longest streak</p>
          </div>
        </div>
        <GlassInnerPanel accent="teal" className="h-24 flex items-center justify-center group-hover:bg-secondary/5 transition-colors">
          <span className="text-white/40 font-mono text-sm group-hover:text-white/60 transition-colors">Preview Card</span>
        </GlassInnerPanel>
      </div>
    </GlassPanel>
  </TiltCard>
);

export function HeroSection() {
  // Mouse follow effect for orbs
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring animation for mouse following
  const springConfig = { damping: 25, stiffness: 150 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  // Inverted spring for the second orb
  const springX2 = useSpring(mouseX, { ...springConfig, damping: 35 });
  const springY2 = useSpring(mouseY, { ...springConfig, damping: 35 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;

      // Calculate normalized position (-1 to 1)
      const x = (clientX - innerWidth / 2) / (innerWidth / 2);
      const y = (clientY - innerHeight / 2) / (innerHeight / 2);

      // Update motion values
      mouseX.set(x * 50); // Move up to 50px
      mouseY.set(y * 50);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background grid */}
      <SpotlightGrid opacity={0.15} spotlightRadius={400} />

      {/* Interactive Gradient Orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px]"
        style={{
          x: springX,
          y: springY,
          opacity: 0.6
        }}
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <motion.div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[120px]"
        style={{
          x: useTransform(springX2, (val) => -val), // Invert movement
          y: useTransform(springY2, (val) => -val),
          opacity: 0.6
        }}
        animate={{
          scale: [1.1, 1, 1.1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 mb-8 backdrop-blur-sm"
          >
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-sm font-medium text-primary">Visualize Your GitHub Journey</span>
          </motion.div>

          {/* Main heading */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <motion.span
              className="text-foreground inline-block"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            >
              Beautiful{" "}
            </motion.span>
            <motion.span
              className="gradient-text text-glow-primary inline-block"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
            >
              GitHub Stats
            </motion.span>
            <br />
            <motion.span
              className="text-foreground inline-block"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            >
              For Your README
            </motion.span>
          </h1>

          {/* Subtitle */}
          <motion.p
            className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          >
            Generate stunning, customizable GitHub statistics cards.
            Choose from templates or create your own design.
            No authentication required.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
          >
            <MagneticButton asChild size="lg" variant="premium" className="group px-8" strength={0.3}>
              <Link to="/generator">
                {/* Manual overlay for asChild usage since Button component can't inject into Slot */}
                <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <Zap className="w-5 h-5 mr-2 relative z-10 fill-current" />
                <span className="relative z-10">Start Creating</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform relative z-10" />
              </Link>
            </MagneticButton>
            <MagneticButton asChild variant="outline" size="lg" className="px-8 hover:bg-white/5 transition-colors border-primary/20 hover:border-primary/50" strength={0.2}>
              <Link to="/docs">
                View API Docs
              </Link>
            </MagneticButton>
          </motion.div>

          {/* Stats preview cards with glassmorphism */}
          <motion.div
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.2,
                  delayChildren: 0.6
                }
              }
            }}
          >
            {/* User Stats Card - Green accent */}
            <motion.div variants={{ hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0, transition: { type: "spring", damping: 20 } } }} className="h-full">
              <TiltCard className="h-full">
                <GlassPanel hover accent="green" className="text-left h-full flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center backdrop-blur-sm shadow-[0_0_15px_rgba(var(--primary),0.3)]">
                        <span className="text-2xl">📊</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">User Stats</h3>
                        <p className="text-sm text-white/60">Stars, commits, repos</p>
                      </div>
                    </div>
                    <GlassInnerPanel accent="green" className="h-24 flex items-center justify-center group-hover:bg-primary/5 transition-colors">
                      <span className="text-white/40 font-mono text-sm group-hover:text-white/60 transition-colors">Preview Card</span>
                    </GlassInnerPanel>
                  </div>
                </GlassPanel>
              </TiltCard>
            </motion.div>

            {/* Streak Tracker Card - Teal accent (active/highlighted) */}
            <motion.div variants={{ hidden: { opacity: 0, y: 60 }, show: { opacity: 1, y: -20, transition: { type: "spring", damping: 20 } } }} className="h-full z-10 hidden md:block">
              <StreakCardContent animateFloat={true} />
            </motion.div>

            {/* Mobile version without negative margin */}
            <motion.div variants={{ hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0, transition: { type: "spring", damping: 20 } } }} className="h-full block md:hidden">
              <StreakCardContent animateFloat={false} />
            </motion.div>

            {/* Languages Card - Purple accent */}
            <motion.div variants={{ hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0, transition: { type: "spring", damping: 20 } } }} className="h-full">
              <TiltCard className="h-full">
                <GlassPanel hover accent="purple" className="text-left h-full flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-lg bg-chart-3/20 flex items-center justify-center backdrop-blur-sm shadow-[0_0_15px_rgba(139,92,246,0.3)]">
                        <span className="text-2xl">💻</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">Languages</h3>
                        <p className="text-sm text-white/60">Top programming languages</p>
                      </div>
                    </div>
                    <GlassInnerPanel accent="purple" className="h-24 flex items-center justify-center group-hover:bg-chart-3/5 transition-colors">
                      <span className="text-white/40 font-mono text-sm group-hover:text-white/60 transition-colors">Preview Card</span>
                    </GlassInnerPanel>
                  </div>
                </GlassPanel>
              </TiltCard>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
