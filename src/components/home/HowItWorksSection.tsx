import { GlassPanel } from "@/components/ui/GlassPanel";
import { UserCheck, LayoutGrid, Sliders, Rocket } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Enter Username",
    description: "Type any GitHub username - no authentication or access token needed",
    icon: UserCheck,
    accent: "blue" as const,
  },
  {
    number: "02",
    title: "Choose Card Type",
    description: "Select from stats, language breakdown, contribution streak, activity, dev quote, or banner",
    icon: LayoutGrid,
    accent: "teal" as const,
  },
  {
    number: "03",
    title: "Customize Design",
    description: "Pick curated themes, customize gradients, borders, font padding, and animation styles",
    icon: Sliders,
    accent: "purple" as const,
  },
  {
    number: "04",
    title: "Copy & Embed",
    description: "Get markdown-ready embed links or high-res SVGs to paste directly into your README",
    icon: Rocket,
    accent: "blue" as const,
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            How It Works
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Create and deploy beautiful GitHub stats cards in 4 simple steps
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            return (
              <GlassPanel key={index} accent={step.accent} hover className="relative text-center p-6 flex flex-col items-center">
                <span className="absolute -top-3 -left-3 text-5xl font-mono font-extrabold text-primary/10 select-none">
                  {step.number}
                </span>
                
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 text-primary shadow-[0_4px_16px_rgba(0,0,0,0.2)]">
                  <StepIcon className="w-6 h-6 text-primary" />
                </div>
                
                <h3 className="text-lg font-semibold mb-2 text-foreground">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  {step.description}
                </p>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-primary/20 pointer-events-none" />
                )}
              </GlassPanel>
            );
          })}
        </div>
      </div>
    </section>
  );
}
