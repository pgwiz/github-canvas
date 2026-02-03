import { GlassPanel, GlassInnerPanel } from "@/components/ui/GlassPanel";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { TiltCard } from "@/components/ui/TiltCard";
import { PreviewWidget } from "@/components/ui/PreviewWidget";

const cardTypes = [
  {
    name: "User Stats Card",
    description: "Display total stars, commits, PRs, issues, and more",
    type: "user-stats" as const,
    accent: "green" as const,
  },
  {
    name: "Language Breakdown",
    description: "Show your most-used programming languages",
    type: "languages" as const,
    accent: "purple" as const,
  },
  {
    name: "Contribution Streak",
    description: "Track your current and longest contribution streak",
    type: "streak" as const,
    accent: "teal" as const,
  },
  {
    name: "Activity Graph",
    description: "Visualize your contribution activity over time",
    type: "activity" as const,
    accent: "teal" as const,
  },
  {
    name: "Dev Quotes",
    description: "Random inspirational quotes for developers",
    type: "quotes" as const,
    accent: "purple" as const,
  },
  {
    name: "Custom Image",
    description: "Create fully custom images with your own text and style",
    type: "custom" as const,
    accent: "green" as const,
  },
];

export function CardTypesSection() {
  return (
    <section className="py-24 relative bg-muted/10 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">6 Card Types</span> to Choose From
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Each fully customizable with themes, colors, and layouts
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {cardTypes.map((card, index) => (
            <div
              key={index}
              className="animate-in fade-in slide-in-from-bottom-8 fill-mode-backwards"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <TiltCard className="h-full">
                <GlassPanel hover accent={card.accent} className="h-full flex flex-col justify-between group">
                  <div>
                    <GlassInnerPanel accent={card.accent} className="h-32 flex items-center justify-center mb-4 group-hover:scale-[1.02] transition-transform duration-300">
                      <PreviewWidget type={card.type} accent={card.accent} />
                    </GlassInnerPanel>
                    <h3 className="text-lg font-semibold text-white mb-1">
                      {card.name}
                    </h3>
                    <p className="text-sm text-white/60">
                      {card.description}
                    </p>
                  </div>
                </GlassPanel>
              </TiltCard>
            </div>
          ))}
        </div>

        <div className="text-center animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500">
          <Button asChild size="lg" className="group">
            <Link to="/generator">
              Create Your Card
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
