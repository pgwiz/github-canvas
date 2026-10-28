import { MagneticButton } from "@/components/ui/MagneticButton";
import { SpotlightGrid } from "@/components/ui/SpotlightGrid";
import { ArrowRight, Sparkles, Zap, BarChart3, Flame, Code2, Star, GitCommit, GitPullRequest, GitFork } from "lucide-react";
import { Link } from "react-router-dom";
import { GlassPanel, GlassInnerPanel } from "@/components/ui/GlassPanel";
import { TiltCard } from "@/components/ui/TiltCard";
import { motion, useSpring, useMotionValue, useTransform } from "framer-motion";
import { useEffect } from "react";
import { Particles } from "@/components/ui/Particles";

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
      {/* Background Particles */}
      <Particles
        className="absolute inset-0 z-0 opacity-30"
        quantity={50}
        staticity={30}
        ease={70}
        color="#38bdf8"
        refresh
      />

      {/* Background grid - bluish tone */}
      <SpotlightGrid
        opacity={0.12}
        spotlightRadius={450}
        gridColor="59, 130, 246"
      />

      <div className="container mx-auto px-4 relative z-10 py-16">
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
              className="gradient-text text-glow-primary inline-block font-extrabold"
              initial={{ opacity: 0, scale: 0.95 }}
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
            Choose from modern templates or create your own design.
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
                <span className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <Zap className="w-5 h-5 mr-2 relative z-10 fill-current text-primary" />
                <span className="relative z-10">Start Creating</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform relative z-10" />
              </Link>
            </MagneticButton>
            <MagneticButton asChild variant="outline" size="lg" className="px-8 hover:bg-white/5 transition-colors border-primary/20 hover:border-primary/50" strength={0.2}>
              <Link to="/docs">
                View API Docs
              </Link>
            </MagneticButton>
            <MagneticButton asChild variant="outline" size="lg" className="px-8 hover:bg-white/5 transition-colors border-secondary/20 hover:border-secondary/50" strength={0.2}>
              <Link to="/themes">
                Explore Themes
              </Link>
            </MagneticButton>
          </motion.div>

          {/* Stats preview cards with real visual previews instead of placeholder text */}
          <motion.div
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
          >
            {/* User Stats Card - Blue accent */}
            <TiltCard className="h-full">
              <GlassPanel hover accent="blue" className="text-left h-full flex flex-col justify-between animate-float delay-0">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-11 h-11 rounded-lg bg-primary/15 flex items-center justify-center border border-primary/25 shadow-[0_0_12px_rgba(59,130,246,0.2)]">
                      <BarChart3 className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">User Stats</h3>
                      <p className="text-xs text-white/60">Stars, commits, repositories</p>
                    </div>
                  </div>
                  <GlassInnerPanel accent="blue" className="p-3">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-2 p-1.5 rounded bg-white/5">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <div>
                          <div className="font-bold text-white">1,428</div>
                          <div className="text-[10px] text-white/50">Stars</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-1.5 rounded bg-white/5">
                        <GitCommit className="w-3.5 h-3.5 text-blue-400" />
                        <div>
                          <div className="font-bold text-white">2,891</div>
                          <div className="text-[10px] text-white/50">Commits</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-1.5 rounded bg-white/5">
                        <GitPullRequest className="w-3.5 h-3.5 text-indigo-400" />
                        <div>
                          <div className="font-bold text-white">142</div>
                          <div className="text-[10px] text-white/50">PRs</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-1.5 rounded bg-white/5">
                        <GitFork className="w-3.5 h-3.5 text-cyan-400" />
                        <div>
                          <div className="font-bold text-white">356</div>
                          <div className="text-[10px] text-white/50">Forks</div>
                        </div>
                      </div>
                    </div>
                  </GlassInnerPanel>
                </div>
              </GlassPanel>
            </TiltCard>

            {/* Streak Tracker Card - Cyan accent (active/highlighted) */}
            <TiltCard className="h-full translate-y-[-10px] md:translate-y-[-20px] z-10">
              <GlassPanel hover accent="teal" active className="text-left h-full flex flex-col justify-between animate-float delay-1000">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-11 h-11 rounded-lg bg-secondary/15 flex items-center justify-center border border-secondary/25 shadow-[0_0_12px_rgba(14,165,233,0.2)]">
                      <Flame className="w-5 h-5 text-secondary animate-pulse" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Streak Tracker</h3>
                      <p className="text-xs text-white/60">Current & longest streaks</p>
                    </div>
                  </div>
                  <GlassInnerPanel accent="teal" className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="text-[10px] text-white/50 uppercase tracking-wider block">Current</span>
                        <span className="text-lg font-bold text-secondary">24 Days</span>
                      </div>
                      <div className="h-6 w-px bg-white/10" />
                      <div className="text-right">
                        <span className="text-[10px] text-white/50 uppercase tracking-wider block">Longest</span>
                        <span className="text-lg font-bold text-white">112 Days</span>
                      </div>
                    </div>
                    <div className="flex gap-1 justify-between pt-1">
                      {Array.from({ length: 7 }).map((_, i) => (
                        <div
                          key={i}
                          className="h-2 flex-1 rounded-sm bg-secondary"
                          style={{ opacity: 0.4 + (i * 0.1) }}
                        />
                      ))}
                    </div>
                  </GlassInnerPanel>
                </div>
              </GlassPanel>
            </TiltCard>

            {/* Languages Card - Purple accent */}
            <TiltCard className="h-full">
              <GlassPanel hover accent="purple" className="text-left h-full flex flex-col justify-between animate-float delay-500">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-11 h-11 rounded-lg bg-purple-500/15 flex items-center justify-center border border-purple-500/25 shadow-[0_0_12px_rgba(139,92,246,0.2)]">
                      <Code2 className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Top Languages</h3>
                      <p className="text-xs text-white/60">Most used tech stack</p>
                    </div>
                  </div>
                  <GlassInnerPanel accent="purple" className="p-3 space-y-2">
                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-white/80 font-mono">TypeScript</span>
                        <span className="text-blue-400 font-mono font-medium">54%</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: '54%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-white/80 font-mono">Python</span>
                        <span className="text-cyan-400 font-mono font-medium">28%</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-cyan-400 rounded-full" style={{ width: '28%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-white/80 font-mono">Rust</span>
                        <span className="text-purple-400 font-mono font-medium">18%</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-400 rounded-full" style={{ width: '18%' }} />
                      </div>
                    </div>
                  </GlassInnerPanel>
                </div>
              </GlassPanel>
            </TiltCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
