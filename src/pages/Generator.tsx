import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { CardPreview } from "@/components/generator/CardPreview";
import { TemplateGallery } from "@/components/generator/TemplateGallery";
import { CustomizationPanel } from "@/components/generator/CustomizationPanel";
import { LinkGenerator } from "@/components/generator/LinkGenerator";
import { Search, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export type CardType = "stats" | "languages" | "streak" | "activity" | "quote" | "custom";

export interface CardConfig {
  username: string;
  type: CardType;
  theme: string;
  bgColor: string;
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
  borderColor: string;
  borderRadius: number;
  showBorder: boolean;
  customText: string;
  width: number;
  height: number;
}

const defaultConfig: CardConfig = {
  username: "",
  type: "stats",
  theme: "neon",
  bgColor: "#0d1117",
  primaryColor: "#0CF709",
  secondaryColor: "#00e1ff",
  textColor: "#c9d1d9",
  borderColor: "#0CF709",
  borderRadius: 12,
  showBorder: true,
  customText: "",
  width: 495,
  height: 195,
};

export default function Generator() {
  const [config, setConfig] = useState<CardConfig>(defaultConfig);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!config.username && config.type !== "quote" && config.type !== "custom") {
      toast({
        title: "Username required",
        description: "Please enter a GitHub username to generate stats",
        variant: "destructive",
      });
      return;
    }
    
    setIsGenerating(true);
    // Simulate generation delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsGenerating(false);
    
    toast({
      title: "Card generated!",
      description: "Your stats card is ready. Copy the link below.",
    });
  };

  const updateConfig = (updates: Partial<CardConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  };

  return (
    <Layout>
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">Stats Generator</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Create beautiful GitHub stats cards with full customization
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Panel - Configuration */}
            <div className="space-y-6">
              {/* Username Input */}
              <GlassPanel>
                <Label htmlFor="username" className="text-lg font-semibold mb-4 block">
                  GitHub Username
                </Label>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="username"
                      placeholder="Enter GitHub username..."
                      value={config.username}
                      onChange={(e) => updateConfig({ username: e.target.value })}
                      className="pl-10 h-12 bg-background/50"
                    />
                  </div>
                  <Button 
                    onClick={handleGenerate} 
                    disabled={isGenerating}
                    className="h-12 px-6"
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate
                      </>
                    )}
                  </Button>
                </div>
              </GlassPanel>

              {/* Card Type Selection */}
              <GlassPanel>
                <Label className="text-lg font-semibold mb-4 block">
                  Card Type
                </Label>
                <Tabs 
                  value={config.type} 
                  onValueChange={(v) => updateConfig({ type: v as CardType })}
                >
                  <TabsList className="grid grid-cols-3 lg:grid-cols-6 w-full h-auto">
                    <TabsTrigger value="stats" className="py-3">📊 Stats</TabsTrigger>
                    <TabsTrigger value="languages" className="py-3">💻 Languages</TabsTrigger>
                    <TabsTrigger value="streak" className="py-3">🔥 Streak</TabsTrigger>
                    <TabsTrigger value="activity" className="py-3">📈 Activity</TabsTrigger>
                    <TabsTrigger value="quote" className="py-3">💬 Quote</TabsTrigger>
                    <TabsTrigger value="custom" className="py-3">✨ Custom</TabsTrigger>
                  </TabsList>
                </Tabs>
              </GlassPanel>

              {/* Template Gallery */}
              <GlassPanel>
                <Label className="text-lg font-semibold mb-4 block">
                  Choose a Template
                </Label>
                <TemplateGallery 
                  selectedTheme={config.theme}
                  onSelectTheme={(theme) => updateConfig({ theme })}
                />
              </GlassPanel>

              {/* Customization Panel */}
              <GlassPanel>
                <Label className="text-lg font-semibold mb-4 block">
                  Customize
                </Label>
                <CustomizationPanel 
                  config={config}
                  updateConfig={updateConfig}
                />
              </GlassPanel>
            </div>

            {/* Right Panel - Preview & Links */}
            <div className="space-y-6">
              {/* Preview */}
              <GlassPanel glow="primary">
                <Label className="text-lg font-semibold mb-4 block">
                  Live Preview
                </Label>
                <CardPreview config={config} />
              </GlassPanel>

              {/* Link Generator */}
              <GlassPanel>
                <Label className="text-lg font-semibold mb-4 block">
                  Share Your Card
                </Label>
                <LinkGenerator config={config} />
              </GlassPanel>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
