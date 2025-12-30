import { GlassPanel } from "@/components/ui/GlassPanel";

const steps = [
  {
    number: "01",
    title: "Enter Username",
    description: "Just type your GitHub username - no authentication needed",
    icon: "👤",
  },
  {
    number: "02",
    title: "Choose Card Type",
    description: "Select from stats, languages, streak, activity, quotes, or custom",
    icon: "🎨",
  },
  {
    number: "03",
    title: "Customize Design",
    description: "Pick a template or customize colors, fonts, and layout",
    icon: "✨",
  },
  {
    number: "04",
    title: "Copy & Share",
    description: "Get your markdown link and paste it anywhere",
    icon: "🚀",
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
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Create beautiful GitHub stats in 4 simple steps
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <GlassPanel key={index} className="relative text-center">
              <span className="absolute -top-4 -left-4 text-6xl font-bold text-primary/20">
                {step.number}
              </span>
              <div className="text-4xl mb-4">{step.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">
                {step.title}
              </h3>
              <p className="text-muted-foreground text-sm">
                {step.description}
              </p>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-primary/30" />
              )}
            </GlassPanel>
          ))}
        </div>
      </div>
    </section>
  );
}
