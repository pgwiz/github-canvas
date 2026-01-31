import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Particles } from "@/components/ui/Particles";
import { HackerText } from "@/components/ui/HackerText";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-background p-4">
      {/* Dynamic Background */}
      <Particles
        className="absolute inset-0 z-0"
        quantity={150}
        ease={80}
        color="#ffffff"
        refresh
      />

      <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-transparent via-background/50 to-background" />

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md animate-in fade-in zoom-in duration-700 slide-in-from-bottom-10">
        <GlassPanel
          hover={true}
          glow="primary"
          accent="green"
          className="flex flex-col items-center justify-center p-8 text-center"
        >
          {/* Animated 404 Visual */}
          <div className="mb-6 relative">
            <div className="absolute inset-0 animate-pulse-glow blur-2xl bg-primary/20 rounded-full" />
            <div className="relative text-9xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-primary to-secondary animate-float">
               <HackerText text="404" speed={150} />
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-white">
              <HackerText text="Lost in the Digital Void?" speed={50} />
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-[300px] mx-auto">
              It seems you've ventured into uncharted territory. The coordinates{" "}
              <code className="px-1 py-0.5 rounded bg-white/10 font-mono text-xs text-primary">
                {location.pathname}
              </code>{" "}
              do not exist in this sector.
            </p>
          </div>

          {/* Action Button */}
          <Link to="/">
            <MagneticButton
              variant="premium"
              size="lg"
              className="group"
              strength={0.3}
            >
              <Home className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform duration-300" />
              Return to Mission Control
            </MagneticButton>
          </Link>

          {/* Decor element */}
          <div className="mt-8 flex gap-2">
             <div className="w-2 h-2 rounded-full bg-primary/40 animate-pulse" style={{ animationDelay: '0s' }} />
             <div className="w-2 h-2 rounded-full bg-primary/40 animate-pulse" style={{ animationDelay: '0.3s' }} />
             <div className="w-2 h-2 rounded-full bg-primary/40 animate-pulse" style={{ animationDelay: '0.6s' }} />
          </div>
        </GlassPanel>
      </div>
    </div>
  );
};

export default NotFound;
