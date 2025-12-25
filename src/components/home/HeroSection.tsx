import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { GlassPanel } from "@/components/ui/GlassPanel";

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
          
          {/* Stats preview */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            <GlassPanel hover className="text-left">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                  <span className="text-2xl">📊</span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">User Stats</h3>
                  <p className="text-sm text-muted-foreground">Stars, commits, repos</p>
                </div>
              </div>
              <div className="h-24 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center border border-primary/20">
                <span className="text-muted-foreground font-mono text-sm">Preview Card</span>
              </div>
            </GlassPanel>
            
            <GlassPanel hover className="text-left animate-float">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg bg-secondary/20 flex items-center justify-center">
                  <span className="text-2xl">🔥</span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Streak Tracker</h3>
                  <p className="text-sm text-muted-foreground">Current & longest streak</p>
                </div>
              </div>
              <div className="h-24 rounded-lg bg-gradient-to-br from-secondary/20 to-primary/20 flex items-center justify-center border border-secondary/20">
                <span className="text-muted-foreground font-mono text-sm">Preview Card</span>
              </div>
            </GlassPanel>
            
            <GlassPanel hover className="text-left">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg bg-chart-3/20 flex items-center justify-center">
                  <span className="text-2xl">💻</span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Languages</h3>
                  <p className="text-sm text-muted-foreground">Top programming languages</p>
                </div>
              </div>
              <div className="h-24 rounded-lg bg-gradient-to-br from-chart-3/20 to-chart-4/20 flex items-center justify-center border border-chart-3/20">
                <span className="text-muted-foreground font-mono text-sm">Preview Card</span>
              </div>
            </GlassPanel>
          </div>
        </div>
      </div>
    </section>
  );
}
