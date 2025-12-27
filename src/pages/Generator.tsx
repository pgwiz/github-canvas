import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { CardPreview } from "@/components/generator/CardPreview";
import { TemplateGallery } from "@/components/generator/TemplateGallery";
import { CustomizationPanel } from "@/components/generator/CustomizationPanel";
import { LinkGenerator } from "@/components/generator/LinkGenerator";
import { Search, Sparkles, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useGitHubStats, GitHubStats } from "@/hooks/useGitHubStats";
import { useDevQuote, DevQuote } from "@/hooks/useDevQuote";
import { useQuoteOfTheDay } from "@/hooks/useQuoteOfTheDay";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type CardType = "stats" | "languages" | "streak" | "activity" | "quote" | "custom" | "banner";

export type QuoteTopic = "random" | "debugging" | "coffee" | "deadlines" | "code-reviews" | "testing";

export type WaveStyle = "wave" | "pulse" | "flow" | "glitch";

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
  animation: string;
  animationSpeed: string;
  gradientEnabled: boolean;
  gradientType: string;
  gradientAngle: number;
  gradientStart: string;
  gradientEnd: string;
  previewFormat: "svg" | "img";
  quoteTopic: QuoteTopic;
  // Banner fields
  bannerName: string;
  bannerDescription: string;
  waveStyle: WaveStyle;
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
  animation: "fadeIn",
  animationSpeed: "normal",
  gradientEnabled: false,
  gradientType: "linear",
  gradientAngle: 135,
  gradientStart: "#667eea",
  gradientEnd: "#764ba2",
  previewFormat: "img",
  quoteTopic: "random",
  bannerName: "",
  bannerDescription: "",
  waveStyle: "wave",
};

const quoteTopics: { value: QuoteTopic; label: string; emoji: string }[] = [
  { value: "random", label: "Random", emoji: "🎲" },
  { value: "debugging", label: "Debugging", emoji: "🐛" },
  { value: "coffee", label: "Coffee & Code", emoji: "☕" },
  { value: "deadlines", label: "Deadlines", emoji: "⏰" },
  { value: "code-reviews", label: "Code Reviews", emoji: "👀" },
  { value: "testing", label: "Testing", emoji: "🧪" },
];

export default function Generator() {
  const [config, setConfig] = useState<CardConfig>(defaultConfig);
  const [githubData, setGithubData] = useState<GitHubStats | null>(null);
  const [currentQuote, setCurrentQuote] = useState<DevQuote | null>(null);
  const { toast } = useToast();
  
  const { loading: statsLoading, error: statsError, fetchStats } = useGitHubStats();
  const { loading: quoteLoading, generateQuote } = useDevQuote();
  const { qotd } = useQuoteOfTheDay();

  const isGenerating = statsLoading || quoteLoading;

  const handleGenerate = async () => {
    if (!config.username && config.type !== "quote" && config.type !== "custom") {
      toast({
        title: "Username required",
        description: "Please enter a GitHub username to generate stats",
        variant: "destructive",
      });
      return;
    }

    if (config.type === "quote") {
      const topic = config.quoteTopic === "random" ? undefined : config.quoteTopic;
      const quote = await generateQuote(topic);
      if (quote) {
        setCurrentQuote(quote);
        toast({
          title: "Quote generated!",
          description: "A unique dev quote has been created.",
        });
      }
      return;
    }

    if (config.type === "custom") {
      toast({
        title: "Card ready!",
        description: "Your custom card is ready. Copy the link below.",
      });
      return;
    }

    const result = await fetchStats(config.username);
    
    if (result) {
      setGithubData(result);
      toast({
        title: "Stats fetched!",
        description: `Successfully fetched data for ${config.username}`,
      });
    } else if (statsError) {
      toast({
        title: "Error fetching stats",
        description: statsError,
        variant: "destructive",
      });
    }
  };

  // Generate a quote when switching to quote type
  useEffect(() => {
    if (config.type === "quote" && !currentQuote) {
      const topic = config.quoteTopic === "random" ? undefined : config.quoteTopic;
      generateQuote(topic).then(setCurrentQuote);
    }
  }, [config.type]);

  const handleRefreshQuote = async () => {
    const topic = config.quoteTopic === "random" ? undefined : config.quoteTopic;
    const quote = await generateQuote(topic);
    if (quote) {
      setCurrentQuote(quote);
    }
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
              <GlassPanel accent="green">
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
                      onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                      className="pl-10 h-12 bg-background/30 backdrop-blur-sm border-border/30"
                      disabled={config.type === "quote" || config.type === "custom" || config.type === "banner"}
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
                        {config.type === "quote" ? "Generating..." : "Fetching..."}
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        {config.type === "quote" ? "Generate Quote" : "Fetch Stats"}
                      </>
                    )}
                  </Button>
                </div>
                {config.type !== "quote" && config.type !== "custom" && config.type !== "banner" && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Fetches real data from GitHub API
                  </p>
                )}
              </GlassPanel>

              {/* Card Type Selection */}
              <GlassPanel accent="teal">
                <Label className="text-lg font-semibold mb-4 block">
                  Card Type
                </Label>
                <Tabs 
                  value={config.type} 
                  onValueChange={(v) => updateConfig({ type: v as CardType })}
                >
                  <TabsList className="grid grid-cols-4 lg:grid-cols-7 w-full h-auto bg-background/30 backdrop-blur-sm">
                    <TabsTrigger value="stats" className="py-3 data-[state=active]:bg-secondary/20">📊 Stats</TabsTrigger>
                    <TabsTrigger value="languages" className="py-3 data-[state=active]:bg-secondary/20">💻 Languages</TabsTrigger>
                    <TabsTrigger value="streak" className="py-3 data-[state=active]:bg-secondary/20">🔥 Streak</TabsTrigger>
                    <TabsTrigger value="activity" className="py-3 data-[state=active]:bg-secondary/20">📈 Activity</TabsTrigger>
                    <TabsTrigger value="quote" className="py-3 data-[state=active]:bg-secondary/20">💬 Quote</TabsTrigger>
                    <TabsTrigger value="banner" className="py-3 data-[state=active]:bg-secondary/20">🎨 Banner</TabsTrigger>
                    <TabsTrigger value="custom" className="py-3 data-[state=active]:bg-secondary/20">✨ Custom</TabsTrigger>
                  </TabsList>
                </Tabs>
              </GlassPanel>

              {/* Quote Options */}
              {config.type === "quote" && (
                <GlassPanel accent="purple">
                  <Label className="text-lg font-semibold mb-4 block">Quote Options</Label>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <Label className="text-sm text-muted-foreground mb-2 block">Topic</Label>
                        <Select
                          value={config.quoteTopic}
                          onValueChange={(v) => updateConfig({ quoteTopic: v as QuoteTopic })}
                        >
                          <SelectTrigger className="bg-background/30 backdrop-blur-sm border-border/30">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {quoteTopics.map((topic) => (
                              <SelectItem key={topic.value} value={topic.value}>
                                {topic.emoji} {topic.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <Button
                        variant="outline"
                        onClick={handleRefreshQuote}
                        disabled={quoteLoading}
                        className="bg-background/30 backdrop-blur-sm border-border/30 mt-6"
                      >
                        <RefreshCw className={`w-4 h-4 mr-2 ${quoteLoading ? 'animate-spin' : ''}`} />
                        New Quote
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Generate unique developer quotes powered by AI
                    </p>
                  </div>
                </GlassPanel>
              )}

              {/* Template Gallery */}
              <GlassPanel accent="purple">
                <Label className="text-lg font-semibold mb-4 block">
                  Choose a Template
                </Label>
                <TemplateGallery 
                  selectedTheme={config.theme}
                  onSelectTheme={(theme) => updateConfig({ theme })}
                />
              </GlassPanel>

              {/* Customization Panel */}
              <GlassPanel accent="green">
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
              <GlassPanel accent="teal" active>
                <Label className="text-lg font-semibold mb-4 block">
                  Live Preview
                </Label>
                {/* Nested frosted glass inner panel */}
                <div className="relative rounded-lg overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent backdrop-blur-md" />
                  <div className="relative p-4 rounded-lg border border-secondary/10 bg-background/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                    <CardPreview 
                      config={config} 
                      githubData={githubData}
                      quote={currentQuote}
                    />
                  </div>
                </div>
                {githubData && config.type !== "quote" && config.type !== "custom" && (
                  <p className="text-xs text-muted-foreground mt-4 text-center">
                    ✓ Showing real data for @{githubData.user.login}
                  </p>
                )}
              </GlassPanel>

              {/* Link Generator */}
              <GlassPanel accent="green">
                <Label className="text-lg font-semibold mb-4 block">
                  Share Your Card
                </Label>
                <LinkGenerator config={config} />
              </GlassPanel>

              {/* Quote of the Day */}
              {qotd && (
                <div className="text-center py-4">
                  <p className="text-[10px] italic text-muted-foreground/70 leading-relaxed max-w-md mx-auto">
                    Quote of the Day: "{qotd.quote}" — {qotd.author}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
