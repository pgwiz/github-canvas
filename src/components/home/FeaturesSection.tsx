import { GlassPanel } from "@/components/ui/GlassPanel";
import { 
  Palette, 
  Zap, 
  Share2, 
  Code2, 
  Layout,
  Quote,
  Image
} from "lucide-react";

const features = [
  {
    icon: Palette,
    title: "Custom Themes",
    description: "Choose from pre-built themes or create your own with full color customization",
    accent: "green" as const,
    iconBg: "bg-primary/20",
    iconColor: "text-primary",
  },
  {
    icon: Zap,
    title: "Instant Generation",
    description: "Generate beautiful stats cards in seconds, no authentication required",
    accent: "teal" as const,
    iconBg: "bg-secondary/20",
    iconColor: "text-secondary",
  },
  {
    icon: Share2,
    title: "Easy Sharing",
    description: "Get markdown-ready links to embed in your README or anywhere",
    accent: "purple" as const,
    iconBg: "bg-chart-3/20",
    iconColor: "text-chart-3",
  },
  {
    icon: Code2,
    title: "API Access",
    description: "Full API documentation with endpoints for programmatic access",
    accent: "teal" as const,
    iconBg: "bg-secondary/20",
    iconColor: "text-secondary",
  },
  {
    icon: Quote,
    title: "Dev Quotes",
    description: "Random motivational quotes for developers to spice up your profile",
    accent: "purple" as const,
    iconBg: "bg-chart-3/20",
    iconColor: "text-chart-3",
  },
  {
    icon: Image,
    title: "Custom Images",
    description: "Generate custom images with your own text, backgrounds, and dimensions",
    accent: "green" as const,
    iconBg: "bg-primary/20",
    iconColor: "text-primary",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-secondary/30 bg-secondary/10 mb-4">
            <Layout className="w-4 h-4 text-secondary" />
            <span className="text-sm font-medium text-secondary">Features</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Everything You Need
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Powerful features to create stunning GitHub profile visualizations
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <GlassPanel key={index} hover accent={feature.accent} className="group">
                <div 
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                  style={{
                    background: 'transparent',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.05)'
                  }}
                >
                  <Icon className={`w-7 h-7 ${feature.iconColor}`} />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">
                  {feature.title}
                </h3>
                <p className="text-white/60">
                  {feature.description}
                </p>
              </GlassPanel>
            );
          })}
        </div>
      </div>
    </section>
  );
}
