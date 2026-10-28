import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { PageTransition } from "@/components/layout/PageTransition";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { templates, TemplateTheme } from "@/lib/templates";
import { useToast } from "@/hooks/use-toast";
import { 
  Palette, Search, Copy, Check, ArrowRight, Sparkles, 
  BarChart3, Flame, Code2, Eye, SlidersHorizontal, CheckCircle2 
} from "lucide-react";

type CategoryFilter = "All" | "Modern" | "Popular" | "Cyber" | "Minimal" | "Vibrant";

export default function Themes() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>("All");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [previewCardType, setPreviewCardType] = useState<"stats" | "streak" | "banner">("stats");
  const { toast } = useToast();
  const navigate = useNavigate();

  const categories: CategoryFilter[] = ["All", "Modern", "Popular", "Cyber", "Minimal", "Vibrant"];

  const filteredThemes = useMemo(() => {
    return templates.filter((theme) => {
      const matchesSearch = 
        theme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        theme.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        theme.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = 
        selectedCategory === "All" || theme.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const handleCopyColors = (theme: TemplateTheme, type: "css" | "json") => {
    const text = type === "css"
      ? `/* ${theme.name} Theme */\n--card-bg: ${theme.colors.bg};\n--card-primary: ${theme.colors.primary};\n--card-secondary: ${theme.colors.secondary};\n--card-text: ${theme.colors.text};\n--card-border: ${theme.colors.border};`
      : JSON.stringify(theme.colors, null, 2);

    navigator.clipboard.writeText(text);
    setCopiedId(`${theme.id}-${type}`);
    toast({
      title: "Copied to Clipboard",
      description: `${theme.name} ${type.toUpperCase()} variables copied.`,
    });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyHex = (hex: string, label: string) => {
    navigator.clipboard.writeText(hex);
    toast({
      title: "Color Copied",
      description: `${label}: ${hex}`,
    });
  };

  return (
    <Layout>
      <PageTransition>
        <div className="min-h-screen py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          {/* Background Ambient Glow */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute top-1/3 right-1/4 w-[400px] h-[300px] bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />

          <div className="max-w-7xl mx-auto space-y-12">
            {/* Header Section */}
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-medium text-primary">
                <Palette className="w-3.5 h-3.5" />
                <span>Curated Theme Palette Directory</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
                Explore <span className="gradient-text">Color Themes</span>
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                Discover high-contrast, accessibility-focused color schemes for your GitHub SVG stats cards,
                banners, and developer readmes.
              </p>
            </div>

            {/* Controls Bar: Search, Category Filters & Preview Card Switcher */}
            <GlassPanel className="p-6">
              <div className="flex flex-col lg:flex-row gap-6 items-stretch lg:items-center justify-between">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search themes by name or style..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-background/50 border-white/10 focus:border-primary/50"
                  />
                </div>

                {/* Categories */}
                <div className="flex flex-wrap items-center gap-2">
                  {categories.map((cat) => (
                    <Button
                      key={cat}
                      variant={selectedCategory === cat ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(cat)}
                      className={`text-xs h-8 rounded-full transition-all ${
                        selectedCategory === cat
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "border-white/10 hover:border-white/20 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {cat}
                    </Button>
                  ))}
                </div>

                {/* Preview Format Switcher */}
                <div className="flex items-center gap-1.5 p-1 rounded-lg bg-white/5 border border-white/10 self-start lg:self-auto">
                  <span className="text-xs text-muted-foreground px-2 flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" /> Preview:
                  </span>
                  {(["stats", "streak", "banner"] as const).map((type) => (
                    <Button
                      key={type}
                      variant="ghost"
                      size="sm"
                      onClick={() => setPreviewCardType(type)}
                      className={`text-xs h-7 px-2.5 rounded-md capitalize ${
                        previewCardType === type
                          ? "bg-primary/20 text-primary font-semibold"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {type}
                    </Button>
                  ))}
                </div>
              </div>
            </GlassPanel>

            {/* Themes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {filteredThemes.map((theme, index) => (
                  <motion.div
                    key={theme.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.4) }}
                  >
                    <GlassPanel className="h-full flex flex-col justify-between overflow-hidden group hover:border-primary/40 transition-all duration-300">
                      {/* Live Card Mockup Container */}
                      <div
                        className="p-5 rounded-t-xl border-b border-white/10 transition-colors duration-300 relative overflow-hidden"
                        style={{
                          backgroundColor: theme.colors.bg,
                          borderColor: `${theme.colors.border}40`,
                        }}
                      >
                        {/* Glow ambient background for card */}
                        <div
                          className="absolute -top-12 -right-12 w-36 h-36 rounded-full blur-2xl opacity-20 pointer-events-none"
                          style={{ backgroundColor: theme.colors.primary }}
                        />

                        {previewCardType === "stats" && (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span
                                className="text-xs font-bold tracking-wider uppercase flex items-center gap-1.5"
                                style={{ color: theme.colors.primary }}
                              >
                                <BarChart3 className="w-3.5 h-3.5" />
                                GitHub Stats
                              </span>
                              <span
                                className="text-[10px] px-2 py-0.5 rounded-full border"
                                style={{
                                  color: theme.colors.secondary,
                                  borderColor: `${theme.colors.secondary}40`,
                                  backgroundColor: `${theme.colors.secondary}15`,
                                }}
                              >
                                @pgwiz
                              </span>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                              <div
                                className="p-2 rounded-lg border backdrop-blur-sm"
                                style={{
                                  backgroundColor: `${theme.colors.bg}cc`,
                                  borderColor: `${theme.colors.border}30`,
                                }}
                              >
                                <span className="block text-[10px] opacity-70" style={{ color: theme.colors.text }}>
                                  Total Stars
                                </span>
                                <span className="text-sm font-bold font-mono" style={{ color: theme.colors.primary }}>
                                  1,428
                                </span>
                              </div>
                              <div
                                className="p-2 rounded-lg border backdrop-blur-sm"
                                style={{
                                  backgroundColor: `${theme.colors.bg}cc`,
                                  borderColor: `${theme.colors.border}30`,
                                }}
                              >
                                <span className="block text-[10px] opacity-70" style={{ color: theme.colors.text }}>
                                  Commits (2026)
                                </span>
                                <span className="text-sm font-bold font-mono" style={{ color: theme.colors.secondary }}>
                                  2,891
                                </span>
                              </div>
                            </div>

                            {/* Mini language progress */}
                            <div className="space-y-1 pt-1">
                              <div className="flex justify-between text-[10px]" style={{ color: theme.colors.text }}>
                                <span>TypeScript</span>
                                <span className="font-mono">84%</span>
                              </div>
                              <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                                <div
                                  className="h-full rounded-full"
                                  style={{ width: "84%", backgroundColor: theme.colors.primary }}
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        {previewCardType === "streak" && (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span
                                className="text-xs font-bold tracking-wider uppercase flex items-center gap-1.5"
                                style={{ color: theme.colors.primary }}
                              >
                                <Flame className="w-3.5 h-3.5" />
                                Contribution Streak
                              </span>
                              <span
                                className="text-[10px] font-mono px-2 py-0.5 rounded-full"
                                style={{
                                  color: theme.colors.primary,
                                  backgroundColor: `${theme.colors.primary}20`,
                                }}
                              >
                                Active
                              </span>
                            </div>

                            <div className="text-center py-2">
                              <span
                                className="text-2xl font-black font-mono block tracking-tight"
                                style={{ color: theme.colors.primary }}
                              >
                                142 Days
                              </span>
                              <span className="text-[11px]" style={{ color: theme.colors.text }}>
                                Current Continuous Streak
                              </span>
                            </div>

                            <div className="flex justify-between text-[10px] pt-1" style={{ color: theme.colors.text }}>
                              <span>Longest: 289 days</span>
                              <span>Total: 3,490</span>
                            </div>
                          </div>
                        )}

                        {previewCardType === "banner" && (
                          <div className="space-y-2 py-1">
                            <div className="flex items-center gap-2">
                              <div
                                className="w-2.5 h-2.5 rounded-full"
                                style={{ backgroundColor: theme.colors.primary }}
                              />
                              <span
                                className="text-sm font-bold tracking-wide"
                                style={{ color: theme.colors.primary }}
                              >
                                Developer Portfolio
                              </span>
                            </div>
                            <p className="text-xs line-clamp-1" style={{ color: theme.colors.text }}>
                              Full-Stack Engineer & System Architect
                            </p>
                            <div
                              className="h-1 w-full rounded-full mt-2"
                              style={{
                                background: `linear-gradient(90deg, ${theme.colors.primary}, ${theme.colors.secondary})`,
                              }}
                            />
                          </div>
                        )}
                      </div>

                      {/* Theme Details & Swatches */}
                      <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-base group-hover:text-primary transition-colors">
                              {theme.name}
                            </h3>
                            <Badge variant="outline" className="text-[10px] border-white/10 text-muted-foreground">
                              {theme.category}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                            {theme.description}
                          </p>
                        </div>

                        {/* Swatch Strip */}
                        <div className="space-y-2 pt-2">
                          <span className="text-[10px] text-muted-foreground/80 uppercase tracking-wider font-mono">
                            Color Palette
                          </span>
                          <div className="flex items-center gap-2">
                            {[
                              { label: "Background", color: theme.colors.bg },
                              { label: "Primary", color: theme.colors.primary },
                              { label: "Secondary", color: theme.colors.secondary },
                              { label: "Text", color: theme.colors.text },
                              { label: "Border", color: theme.colors.border },
                            ].map((swatch) => (
                              <button
                                key={swatch.label}
                                type="button"
                                onClick={() => handleCopyHex(swatch.color, swatch.label)}
                                title={`${swatch.label}: ${swatch.color} (Click to copy)`}
                                className="w-6 h-6 rounded-md border border-white/20 shadow-sm transition-transform hover:scale-125 focus:outline-none focus:ring-1 focus:ring-primary"
                                style={{ backgroundColor: swatch.color }}
                              />
                            ))}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="pt-3 border-t border-white/10 flex items-center gap-2">
                          <Button
                            variant="default"
                            size="sm"
                            className="flex-1 text-xs h-8"
                            onClick={() => navigate(`/generator?theme=${theme.id}`)}
                          >
                            <span>Use Theme</span>
                            <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                          </Button>

                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs h-8 px-2.5 border-white/10 hover:border-white/20"
                            onClick={() => handleCopyColors(theme, "css")}
                            title="Copy CSS variables"
                          >
                            {copiedId === `${theme.id}-css` ? (
                              <Check className="w-3.5 h-3.5 text-green-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </GlassPanel>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {filteredThemes.length === 0 && (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-sm">
                  No themes found matching "{searchQuery}".
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All");
                  }}
                  className="mt-4"
                >
                  Reset Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </PageTransition>
    </Layout>
  );
}
