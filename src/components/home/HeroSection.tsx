import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { GlassPanel, GlassInnerPanel } from "@/components/ui/GlassPanel";
import { TiltCard } from "@/components/ui/TiltCard";

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 grid-bg opacity-30" />

      {/* Gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: "1s" }} />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Visualize Your GitHub Journey</span>
          </div>

          {/* Main heading */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
            <span className="text-foreground">Beautiful </span>
            <span className="gradient-text text-glow-primary">GitHub Stats</span>
            <br />
            <span className="text-foreground">For Your README</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            Generate stunning, customizable GitHub statistics cards.
            Choose from templates or create your own design.
            No authentication required.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            <Button asChild size="lg" variant="premium" className="group px-8 relative overflow-hidden">
              <Link to="/generator">
                <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <Zap className="w-5 h-5 mr-2 relative z-10" />
                <span className="relative z-10">Start Creating</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform relative z-10" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="px-8 hover:bg-white/5 transition-colors">
              <Link to="/docs">
                View API Docs
              </Link>
            </Button>
          </div>

          {/* Stats preview cards with glassmorphism */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
            {/* User Stats Card - Green accent */}
            <TiltCard>
              <GlassPanel hover accent="green" className="text-left h-full">
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
              </GlassPanel>
            </TiltCard>

            {/* Streak Tracker Card - Teal accent (active/highlighted) */}
            <TiltCard>
              <GlassPanel hover accent="teal" active className="text-left h-full animate-float">
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
              </GlassPanel>
            </TiltCard>

            {/* Languages Card - Purple accent */}
            <TiltCard>
              <GlassPanel hover accent="purple" className="text-left h-full">
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
              </GlassPanel>
            </TiltCard>
          </div>
        </div>
      </div>
    </section>
  );
}
