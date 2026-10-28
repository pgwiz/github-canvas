import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { SpotlightGrid } from "@/components/ui/SpotlightGrid";
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
      <SpotlightGrid
        gridSize={40}
        spotlightRadius={400}
        opacity={0.15}
        className="z-0"
      />

      <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-transparent via-background/50 to-background" />

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md">
        <GlassPanel
          hover={true}
          glow="primary"
          accent="blue"
          className="flex flex-col items-center justify-center p-8 text-center"
        >
          {/* Animated 404 Visual */}
          <div className="mb-6 relative">
            
            <h1 className="relative text-9xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-primary to-secondary">
              404
            </h1>
          </div>

          <div className="space-y-4 mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Lost in the Digital Void?
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
             <div className="w-2 h-2 rounded-full bg-white/20" style={{ animationDelay: '0s' }} />
             <div className="w-2 h-2 rounded-full bg-white/20" style={{ animationDelay: '0.3s' }} />
             <div className="w-2 h-2 rounded-full bg-white/20" style={{ animationDelay: '0.6s' }} />
          </div>
        </GlassPanel>
      </div>
    </div>
  );
};

export default NotFound;
