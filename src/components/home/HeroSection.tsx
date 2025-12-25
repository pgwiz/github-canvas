import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { GlassPanel, GlassInnerPanel } from "@/components/ui/GlassPanel";

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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 mb-8">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Visualize Your GitHub Journey</span>
          </div>
          
          {/* Main heading */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="text-foreground">Beautiful </span>
            <span className="gradient-text text-glow-primary">GitHub Stats</span>
            <br />
            <span className="text-foreground">For Your README</span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Generate stunning, customizable GitHub statistics cards. 
            Choose from templates or create your own design. 
            No authentication required.
          </p>
          
          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="group px-8">
              <Link to="/generator">
                <Zap className="w-5 h-5 mr-2" />
                Start Creating
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="px-8">
              <Link to="/docs">
                View API Docs
              </Link>
            </Button>
          </div>
          
          {/* Stats preview cards with glassmorphism */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* User Stats Card - Green accent */}
            <GlassPanel hover accent="green" className="text-left">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center backdrop-blur-sm">
                  <span className="text-2xl">📊</span>
                </div>
                <div>
                  <h3 className="font-semibold text-white">User Stats</h3>
                  <p className="text-sm text-white/60">Stars, commits, repos</p>
                </div>
              </div>
              <GlassInnerPanel accent="green" className="h-24 flex items-center justify-center">
                <span className="text-white/40 font-mono text-sm">Preview Card</span>
              </GlassInnerPanel>
            </GlassPanel>
            
            {/* Streak Tracker Card - Teal accent (active/highlighted) */}
            <GlassPanel hover accent="teal" active className="text-left animate-float">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg bg-secondary/20 flex items-center justify-center backdrop-blur-sm">
                  <span className="text-2xl">🔥</span>
                </div>
                <div>
                  <h3 className="font-semibold text-white">Streak Tracker</h3>
                  <p className="text-sm text-white/60">Current & longest streak</p>
                </div>
              </div>
              <GlassInnerPanel accent="teal" className="h-24 flex items-center justify-center">
                <span className="text-white/40 font-mono text-sm">Preview Card</span>
              </GlassInnerPanel>
            </GlassPanel>
            
            {/* Languages Card - Purple accent */}
            <GlassPanel hover accent="purple" className="text-left">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg bg-chart-3/20 flex items-center justify-center backdrop-blur-sm">
                  <span className="text-2xl">💻</span>
                </div>
                <div>
                  <h3 className="font-semibold text-white">Languages</h3>
                  <p className="text-sm text-white/60">Top programming languages</p>
                </div>
              </div>
              <GlassInnerPanel accent="purple" className="h-24 flex items-center justify-center">
                <span className="text-white/40 font-mono text-sm">Preview Card</span>
              </GlassInnerPanel>
            </GlassPanel>
          </div>
        </div>
      </div>
    </section>
  );
}
