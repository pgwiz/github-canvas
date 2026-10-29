import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { PageTransition } from "@/components/layout/PageTransition";
import { templates } from "@/lib/templates";
import { generateCardSVG, CardParams, PRESET_STACKS } from "@/lib/cardRenderer";
import { TechStackModal } from "@/components/generator/TechStackModal";
import { 
  BarChart3, Code2, Flame, Activity, Quote, Sparkles, Grid3X3, Bookmark, 
  Layers, SlidersHorizontal, RotateCcw, ChevronDown, AtSign, RefreshCw, 
  Wand2, Blend, Download, Copy, Check, Monitor, Layers3, CheckCircle2, Sliders 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useGitHubStats, GitHubStats } from "@/hooks/useGitHubStats";
import { useDevQuote, DevQuote } from "@/hooks/useDevQuote";
import confetti from "canvas-confetti";

export type CardType = 
  | "stats" 
  | "languages" 
  | "streak" 
  | "activity" 
  | "quote" 
  | "custom" 
  | "banner" 
  | "contribution" 
  | "pin" 
  | "skills";

export type QuoteTopic = "random" | "debugging" | "architecture" | "coffee" | "deadlines" | "testing";
export type WaveStyle = "wave" | "pulse" | "flow" | "glitch";
export type ExportFormat = "url" | "markdown" | "html";
export type ViewMode = "single" | "stack";

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
  strokeWidth: number;
  showBorder: boolean;
  customText: string;
  customDescription: string;
  width: number;
  height: number;
  animation: string;
  animationSpeed: string;
  gradientEnabled: boolean;
  gradientType: string;
  gradientAngle: number;
  gradientStart: string;
  gradientEnd: string;
  quoteTopic: QuoteTopic;
  bannerName: string;
  bannerDescription: string;
  waveStyle: WaveStyle;
  repo: string;
  showOwner: boolean;
  skills: string;
  stacks: string[];
  skillsLayout: "matrix" | "stacks" | "compact" | "icons";
}

const defaultConfig: CardConfig = {
  username: "pgwiz",
  type: "stats",
  theme: "electric-blue",
  bgColor: "#0b1220",
  primaryColor: "#3B82F6",
  secondaryColor: "#06B6D4",
  textColor: "#f1f5f9",
  borderColor: "#3B82F6",
  borderRadius: 12,
  strokeWidth: 1.5,
  showBorder: true,
  customText: "",
  customDescription: "",
  width: 495,
  height: 195,
  animation: "fadeIn",
  animationSpeed: "normal",
  gradientEnabled: false,
  gradientType: "linear",
  gradientAngle: 135,
  gradientStart: "#3b82f6",
  gradientEnd: "#06b6d4",
  quoteTopic: "random",
  bannerName: "Developer Portfolio",
  bannerDescription: "Full Stack Architect & Open-Source Builder",
  waveStyle: "wave",
  repo: "pgwiz.cloud",
  showOwner: false,
  skills: "",
  stacks: ["languages", "farm", "pern", "lemp", "django"],
  skillsLayout: "icons",
};

const TYPE_CONFIGS: Record<CardType, { label: string; icon: typeof BarChart3; dims: { width: number; height: number } }> = {
  stats: { label: "Stats", icon: BarChart3, dims: { width: 495, height: 195 } },
  languages: { label: "Langs", icon: Code2, dims: { width: 340, height: 320 } },
  streak: { label: "Streak", icon: Flame, dims: { width: 495, height: 195 } },
  activity: { label: "Active", icon: Activity, dims: { width: 495, height: 195 } },
  quote: { label: "Quote", icon: Quote, dims: { width: 495, height: 195 } },
  banner: { label: "Banner", icon: Sparkles, dims: { width: 600, height: 200 } },
  contribution: { label: "Grid", icon: Grid3X3, dims: { width: 720, height: 250 } },
  pin: { label: "Pinned", icon: Bookmark, dims: { width: 400, height: 120 } },
  skills: { label: "Skills", icon: Layers, dims: { width: 500, height: 260 } },
  custom: { label: "Custom", icon: SlidersHorizontal, dims: { width: 495, height: 195 } },
};

export default function Generator() {
  const [searchParams] = useSearchParams();
  const [config, setConfig] = useState<CardConfig>(defaultConfig);
  const [viewMode, setViewMode] = useState<ViewMode>("single");
  const [exportFormat, setExportFormat] = useState<ExportFormat>("url");
  const [isCopied, setIsCopied] = useState(false);
  const [githubData, setGithubData] = useState<GitHubStats | null>(null);
  const [currentQuote, setCurrentQuote] = useState<DevQuote | null>(null);
  const [isStackModalOpen, setIsStackModalOpen] = useState(false);
  const { toast } = useToast();

  const { loading: statsLoading, fetchStats } = useGitHubStats();
  const { loading: quoteLoading, generateQuote } = useDevQuote();

  // Sync from URL search params on mount
  useEffect(() => {
    const themeParam = searchParams.get("theme");
    const typeParam = searchParams.get("type");
    const userParam = searchParams.get("username") || searchParams.get("user");

    if (themeParam) {
      const found = templates.find((t) => t.id === themeParam);
      if (found) {
        setConfig((prev) => ({
          ...prev,
          theme: found.id,
          bgColor: found.colors.bg,
          primaryColor: found.colors.primary,
          secondaryColor: found.colors.secondary,
          textColor: found.colors.text,
          borderColor: found.colors.border,
        }));
      }
    }
    if (typeParam && (typeParam in TYPE_CONFIGS)) {
      const cType = typeParam as CardType;
      setConfig((prev) => ({ 
        ...prev, 
        type: cType, 
        width: TYPE_CONFIGS[cType].dims.width, 
        height: TYPE_CONFIGS[cType].dims.height 
      }));
    }
    if (userParam) {
      setConfig((prev) => ({ ...prev, username: userParam }));
      fetchStats(userParam).then((res) => { if (res) setGithubData(res); });
    } else {
      fetchStats("pgwiz").then((res) => { if (res) setGithubData(res); });
    }
  }, [searchParams]);

  // Handle Card Type change
  const handleSelectType = (type: CardType) => {
    const dims = TYPE_CONFIGS[type]?.dims || { width: 495, height: 195 };
    setConfig((prev) => ({
      ...prev,
      type,
      width: dims.width,
      height: dims.height,
    }));
  };

  // Handle Theme Change with Synchronized Colors
  const handleSelectTheme = (themeId: string) => {
    const tmpl = templates.find((t) => t.id === themeId);
    if (!tmpl) return;

    setConfig((prev) => ({
      ...prev,
      theme: tmpl.id,
      bgColor: tmpl.colors.bg,
      primaryColor: tmpl.colors.primary,
      secondaryColor: tmpl.colors.secondary,
      textColor: tmpl.colors.text,
      borderColor: tmpl.colors.border,
      gradientStart: tmpl.colors.primary,
      gradientEnd: tmpl.colors.secondary,
    }));

    toast({
      title: "Theme Applied",
      description: `Active palette set to ${tmpl.name}`,
    });
  };

  // Magic Theme Randomizer
  const handleMagicTheme = () => {
    const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
    const enableGradient = Math.random() > 0.4;
    const angle = Math.floor(Math.random() * 360);

    setConfig((prev) => ({
      ...prev,
      theme: randomTemplate.id,
      bgColor: randomTemplate.colors.bg,
      primaryColor: randomTemplate.colors.primary,
      secondaryColor: randomTemplate.colors.secondary,
      textColor: randomTemplate.colors.text,
      borderColor: randomTemplate.colors.border,
      gradientEnabled: enableGradient,
      gradientAngle: angle,
      gradientStart: randomTemplate.colors.primary,
      gradientEnd: randomTemplate.colors.secondary,
      animation: "fadeIn",
    }));

    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: [randomTemplate.colors.primary, randomTemplate.colors.secondary, "#ffffff"],
    });

    toast({
      title: "Random Theme Applied",
      description: `Generated style based on ${randomTemplate.name}`,
    });
  };

  // Reset to Defaults
  const handleReset = () => {
    const tmpl = templates.find((t) => t.id === "electric-blue") || templates[0];
    setConfig({
      ...defaultConfig,
      bgColor: tmpl.colors.bg,
      primaryColor: tmpl.colors.primary,
      secondaryColor: tmpl.colors.secondary,
      textColor: tmpl.colors.text,
      borderColor: tmpl.colors.border,
    });
    toast({
      title: "Settings Reset",
      description: "Restored default Electric Blue configuration",
    });
  };

  // User Sync
  const handleSyncUser = async () => {
    if (!config.username) return;
    const res = await fetchStats(config.username);
    if (res) {
      setGithubData(res);
      toast({
        title: "Stats Refreshed",
        description: `Loaded data for @${config.username}`,
      });
    }
  };

  // Generate Quote
  const handleGenerateQuote = async () => {
    const topic = config.quoteTopic === "random" ? undefined : config.quoteTopic;
    const q = await generateQuote(topic);
    if (q) {
      setCurrentQuote(q);
      toast({
        title: "New Quote Generated",
        description: `Generated quote by ${q.author}`,
      });
    }
  };

  // Construct Card Parameters
  const cardParams: CardParams = useMemo(() => {
    const p: CardParams = {
      type: config.type,
      username: config.username || "developer",
      theme: config.theme,
      bgColor: config.bgColor,
      primaryColor: config.primaryColor,
      secondaryColor: config.secondaryColor,
      textColor: config.textColor,
      borderColor: config.borderColor,
      borderRadius: config.borderRadius,
      showBorder: config.showBorder,
      width: config.width,
      height: config.height,
      customText: config.customText || undefined,
      customDescription: config.customDescription || undefined,
      animate: config.animation !== "none",
      animation: config.animation,
      speed: config.animationSpeed,
      gradient: config.gradientEnabled,
      gradientType: config.gradientType,
      gradientAngle: config.gradientAngle,
      gradientStart: config.gradientStart,
      gradientEnd: config.gradientEnd,
      bannerName: config.bannerName,
      bannerDescription: config.bannerDescription,
      waveStyle: config.waveStyle,
      quoteTopic: config.quoteTopic,
      repo: config.repo,
      showOwner: config.showOwner,
      skills: config.skills || undefined,
      stacks: config.stacks,
      skillsLayout: config.skillsLayout,
    };

    if (githubData) {
      p.stats = {
        totalStars: githubData.stats.totalStars,
        publicRepos: githubData.stats.publicRepos,
        followers: githubData.stats.followers,
        totalForks: githubData.stats.totalForks,
      };
      p.languages = githubData.languages;
      p.streak = githubData.streak;
      p.activity = githubData.activity;
    }

    if (currentQuote) {
      p.quote = currentQuote;
    }

    return p;
  }, [config, githubData, currentQuote]);

  // Live SVG Output
  const liveSvg = useMemo(() => {
    try {
      return generateCardSVG(cardParams);
    } catch (e) {
      console.error("SVG generation error:", e);
      return "";
    }
  }, [cardParams]);

  // Generate URL for API
  const liveUrl = useMemo(() => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://github-canvas.pgwiz.cloud";
    const endpoint = config.type === "pin" ? `${origin}/api/pin` : `${origin}/api/card`;
    const params = new URLSearchParams();

    if (config.type !== "pin") {
      params.set("type", config.type);
    }
    if (config.username) params.set("username", config.username);
    if (config.type === "pin" && config.repo) params.set("repo", config.repo);
    if (config.theme) params.set("theme", config.theme);

    // Only pass custom colors if they deviate from selected template
    const tmpl = templates.find((t) => t.id === config.theme);
    if (!tmpl || config.bgColor !== tmpl.colors.bg) params.set("bg", config.bgColor);
    if (!tmpl || config.primaryColor !== tmpl.colors.primary) params.set("primary", config.primaryColor);
    if (!tmpl || config.secondaryColor !== tmpl.colors.secondary) params.set("secondary", config.secondaryColor);
    if (!tmpl || config.textColor !== tmpl.colors.text) params.set("text", config.textColor);
    if (!tmpl || config.borderColor !== tmpl.colors.border) params.set("border", config.borderColor);

    if (config.borderRadius !== 12) params.set("radius", String(config.borderRadius));
    if (!config.showBorder) params.set("showBorder", "false");
    if (config.animation && config.animation !== "fadeIn") params.set("animation", config.animation);
    if (config.animationSpeed && config.animationSpeed !== "normal") params.set("speed", config.animationSpeed);

    if (config.gradientEnabled) {
      params.set("gradient", "true");
      params.set("gradientStart", config.gradientStart);
      params.set("gradientEnd", config.gradientEnd);
    }

    if (config.type === "skills") {
      if (config.stacks && config.stacks.length > 0) params.set("stacks", config.stacks.join(","));
      if (config.skills) params.set("skills", config.skills);
      if (config.skillsLayout && config.skillsLayout !== "matrix") params.set("layout", config.skillsLayout);
    }

    if (config.customText) params.set("customText", config.customText);
    if (config.customDescription) params.set("description", config.customDescription);

    return `${endpoint}?${params.toString()}`;
  }, [config]);

  // Code Output based on active export tab
  const snippetOutput = useMemo(() => {
    const title = `${config.username || "GitHub"} Stats`;
    if (exportFormat === "markdown") {
      return `![${title}](${liveUrl})`;
    }
    if (exportFormat === "html") {
      return `<img src="${liveUrl}" alt="${title}" />`;
    }
    return liveUrl;
  }, [exportFormat, liveUrl, config.username]);

  // Copy Snippet Action
  const handleCopySnippet = async () => {
    try {
      await navigator.clipboard.writeText(snippetOutput);
      setIsCopied(true);
      toast({
        title: "Copied to Clipboard",
        description: `${exportFormat.toUpperCase()} snippet ready to paste.`,
      });
      setTimeout(() => setIsCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  // Download SVG Action
  const handleDownloadSvg = () => {
    const blob = new Blob([liveSvg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${config.username || "github"}-${config.type}-card.svg`;
    a.click();
    URL.revokeObjectURL(url);
    toast({
      title: "SVG Downloaded",
      description: `${a.download} saved to your device.`,
    });
  };

  // Stack View SVGs
  const stackCards: Array<{ type: CardType; title: string }> = [
    { type: "stats", title: "GitHub Stats" },
    { type: "languages", title: "Top Languages" },
    { type: "streak", title: "Contribution Streak" },
    { type: "skills", title: "Tech Stack & Skills" },
    { type: "contribution", title: "Contribution Heatmap" },
    { type: "quote", title: "Dev Wisdom Quote" },
    { type: "pin", title: "Pinned Repository" },
  ];

  return (
    <Layout hideFooter={true}>
      <PageTransition>
        <div className="flex-1 flex flex-col sm:flex-row sm:min-h-0 sm:h-[calc(100vh-4rem)] sm:overflow-hidden select-none bg-background text-slate-100">
          
          {/* FAR LEFT ICON TOOLBAR */}
          <aside className="sticky top-0 sm:static w-full sm:w-16 shrink-0 border-b sm:border-b-0 sm:border-r border-white/10 bg-surface/90 backdrop-blur-md flex flex-row sm:flex-col items-center py-2 sm:py-4 px-3 sm:px-0 gap-2 sm:gap-3 z-30 sm:h-full overflow-x-auto sm:overflow-x-hidden sm:overflow-y-auto">
            {(Object.keys(TYPE_CONFIGS) as CardType[]).map((cType) => {
              const item = TYPE_CONFIGS[cType];
              const Icon = item.icon;
              const isActive = config.type === cType;
              return (
                <button
                  key={cType}
                  onClick={() => handleSelectType(cType)}
                  className={`shrink-0 flex flex-col items-center justify-center gap-1 w-12 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-primary/20 text-primary border border-primary/40 shadow-sm"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                  title={`${item.label} Card`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-[9px] font-semibold uppercase tracking-wider">{item.label}</span>
                </button>
              );
            })}
          </aside>

          {/* CENTER CANVAS & EXPORT DOCK */}
          <section className="flex-1 min-w-0 flex flex-col bg-background relative sm:min-h-0 sm:overflow-hidden">
            {/* Top Status Bar */}
            <div className="min-h-10 py-1.5 px-4 gap-2 border-b border-white/10 flex items-center justify-between text-xs text-slate-400 bg-surface/40 shrink-0 z-20">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Monitor className="w-3.5 h-3.5 text-primary" />
                  <span className="font-medium text-slate-200">Studio Stage</span>
                  <span className="text-slate-600">•</span>
                  <span className="font-mono text-[11px] text-slate-400">
                    {config.width} × {config.height} px
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Single vs Stack switcher */}
                <div className="flex items-center bg-black/40 p-0.5 rounded-md border border-white/10">
                  <button
                    onClick={() => setViewMode("single")}
                    className={`px-2.5 py-0.5 rounded text-[11px] font-medium transition-colors ${
                      viewMode === "single" ? "bg-primary/20 text-primary" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Single
                  </button>
                  <button
                    onClick={() => setViewMode("stack")}
                    className={`px-2.5 py-0.5 rounded text-[11px] font-medium transition-colors ${
                      viewMode === "stack" ? "bg-primary/20 text-primary" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Stack
                  </button>
                </div>

                {/* Quick Username Input */}
                <div className="flex items-center bg-black/40 border border-white/10 rounded-md px-2 h-7 focus-within:border-primary/50 transition-colors">
                  <AtSign className="w-3 h-3 text-slate-500 mr-1 shrink-0" />
                  <input
                    type="text"
                    value={config.username}
                    onChange={(e) => setConfig((prev) => ({ ...prev, username: e.target.value }))}
                    onKeyDown={(e) => e.key === "Enter" && handleSyncUser()}
                    placeholder="Username..."
                    className="bg-transparent text-[11px] font-mono text-white focus:outline-none w-24 sm:w-28"
                  />
                  <button
                    onClick={handleSyncUser}
                    disabled={statsLoading}
                    title="Sync GitHub User Stats"
                    className="text-slate-400 hover:text-primary transition-colors pl-1 shrink-0"
                  >
                    <RefreshCw className={`w-3 h-3 ${statsLoading ? "animate-spin text-primary" : ""}`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Interactive Preview Canvas */}
            <div className="canvas-grid flex-1 relative p-4 sm:p-8 min-h-[300px] sm:min-h-0 overflow-y-auto overflow-x-hidden flex items-center justify-center">
              {viewMode === "single" ? (
                <div className="relative z-10 m-auto max-w-full flex justify-center">
                  <div
                    className="rounded-xl shadow-2xl overflow-hidden ring-1 ring-white/10 bg-background max-w-full"
                    dangerouslySetInnerHTML={{ __html: liveSvg }}
                  />
                </div>
              ) : (
                <div className="relative z-10 m-auto w-full max-w-2xl py-6 flex flex-col gap-6">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs text-slate-400">
                    <span className="flex items-center gap-1.5 font-semibold text-slate-200">
                      <Layers3 className="w-4 h-4 text-primary" /> Full Stack Readme Gallery
                    </span>
                    <span>Ready for GitHub Profile</span>
                  </div>
                  {stackCards.map((sc) => {
                    const stackParams: CardParams = {
                      ...cardParams,
                      type: sc.type,
                      width: TYPE_CONFIGS[sc.type]?.dims.width || 495,
                      height: TYPE_CONFIGS[sc.type]?.dims.height || 195,
                    };
                    const svgMarkup = generateCardSVG(stackParams);
                    return (
                      <div key={sc.type} className="flex flex-col gap-1.5">
                        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider pl-1">
                          {sc.title}
                        </span>
                        <div
                          className="rounded-xl shadow-lg overflow-hidden ring-1 ring-white/10 bg-background"
                          dangerouslySetInnerHTML={{ __html: svgMarkup }}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* BOTTOM EXPORT DOCK */}
            <div className="w-full bg-surface/95 border-t border-white/10 shrink-0 z-30 px-4 sm:px-6 py-3 flex flex-col justify-center">
              <div className="w-full flex flex-wrap items-center justify-between gap-2 mb-2">
                {/* Format Tabs */}
                <div className="flex items-center bg-black/40 p-0.5 rounded-lg border border-white/10">
                  {(["url", "markdown", "html"] as ExportFormat[]).map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => setExportFormat(fmt)}
                      className={`px-3 py-1 rounded-md text-xs font-medium uppercase tracking-wider transition-all ${
                        exportFormat === fmt
                          ? "bg-primary/20 text-primary border border-primary/30"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDownloadSvg}
                    className="px-3.5 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-medium text-white transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
                  >
                    <Download className="w-3.5 h-3.5" /> SVG
                  </button>
                  <button
                    onClick={handleCopySnippet}
                    className="px-4 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-xs font-semibold text-white transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copy {exportFormat.toUpperCase()}
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Output Readonly Field */}
              <textarea
                readOnly
                rows={1}
                value={snippetOutput}
                onClick={(e) => (e.target as HTMLTextAreaElement).select()}
                className="block w-full resize-none overflow-x-auto overflow-y-hidden whitespace-pre bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none focus:ring-1 focus:ring-primary/50"
              />
            </div>
          </section>

          {/* RIGHT PROPERTIES SIDEBAR */}
          <aside className="w-full sm:w-[280px] md:w-[320px] shrink-0 border-t sm:border-t-0 sm:border-l border-white/10 bg-surface/80 flex flex-col sm:h-full sm:min-h-0 z-20">
            {/* Header */}
            <div className="h-10 px-4 border-b border-white/10 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-400 shrink-0 bg-surface/50">
              <span>Card Settings</span>
              <button
                onClick={handleReset}
                title="Reset to defaults"
                className="text-slate-400 hover:text-white transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Scrollable Settings Accordions */}
            <div className="sm:flex-1 sm:min-h-0 flex flex-col pb-6 sm:overflow-y-auto">
              
              {/* ACCORDION 1: General */}
              <details className="group border-b border-white/10" open>
                <summary className="flex items-center justify-between p-3.5 cursor-pointer hover:bg-white/5 select-none text-xs font-semibold uppercase tracking-wider text-slate-400">
                  <span>General</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500 transition-transform group-open:rotate-180" />
                </summary>
                <div className="px-3.5 pb-4 space-y-3.5 text-xs">
                  {/* GitHub Username */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400">GitHub Username</label>
                    <div className="flex items-center bg-black/40 border border-white/10 rounded-md px-2 focus-within:border-primary/50 transition-colors h-8">
                      <AtSign className="w-3.5 h-3.5 text-slate-500 mr-1.5 shrink-0" />
                      <input
                        type="text"
                        value={config.username}
                        onChange={(e) => setConfig((prev) => ({ ...prev, username: e.target.value }))}
                        onKeyDown={(e) => e.key === "Enter" && handleSyncUser()}
                        placeholder="GitHub Username..."
                        className="bg-transparent text-xs font-mono text-white focus:outline-none w-full h-full"
                      />
                      <button
                        onClick={handleSyncUser}
                        disabled={statsLoading}
                        title="Sync User Data"
                        className="text-slate-400 hover:text-primary transition-colors pl-1 shrink-0"
                      >
                        <RefreshCw className={`w-3 h-3 ${statsLoading ? "animate-spin text-primary" : ""}`} />
                      </button>
                    </div>
                  </div>

                  {/* Quote-specific options */}
                  {config.type === "quote" && (
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] text-slate-400">Topic</label>
                        <span className="text-[9px] text-primary bg-primary/10 px-1.5 py-0.5 rounded border border-primary/20">AI Generated</span>
                      </div>
                      <select
                        value={config.quoteTopic}
                        onChange={(e) => setConfig((prev) => ({ ...prev, quoteTopic: e.target.value as QuoteTopic }))}
                        className="w-full h-8 rounded-md bg-black/40 border border-white/10 px-2 text-xs text-slate-200 focus:outline-none focus:border-primary/50"
                      >
                        <option value="random">Topic: Random Wisdom</option>
                        <option value="debugging">Topic: Debugging & Bugs</option>
                        <option value="architecture">Topic: Architecture</option>
                        <option value="coffee">Topic: Coffee & Late Nights</option>
                        <option value="deadlines">Topic: Deadlines</option>
                        <option value="testing">Topic: Testing Code</option>
                      </select>
                      <button
                        onClick={handleGenerateQuote}
                        disabled={quoteLoading}
                        className="w-full h-8 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium flex items-center justify-center gap-1.5 transition-all active:scale-95 mt-2"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${quoteLoading ? "animate-spin text-primary" : ""}`} /> New Quote
                      </button>
                    </div>
                  )}

                  {/* Skills & Stacks Options */}
                  {config.type === "skills" && (
                    <div className="space-y-2.5 pt-1">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] text-slate-400">Skills Display Style</label>
                        <span className="text-[9px] text-primary bg-primary/10 px-1.5 py-0.5 rounded border border-primary/20">De-duplicated</span>
                      </div>
                      <select
                        value={config.skillsLayout}
                        onChange={(e) => setConfig((prev) => ({ ...prev, skillsLayout: e.target.value as "matrix" | "stacks" | "icons" }))}
                        className="w-full h-8 rounded-md bg-black/40 border border-white/10 px-2 text-xs text-slate-200 focus:outline-none focus:border-primary/50 cursor-pointer"
                      >
                        <option value="icons">Minimalist Icon Grid (Icons only · Name on hover)</option>
                        <option value="matrix">Categorized Matrix (Clean & Deduplicated)</option>
                        <option value="stacks">Stack Clusters (FARM, PERN, LEMP, Django)</option>
                      </select>

                      {/* Customize in Popup Modal Button */}
                      <button
                        type="button"
                        onClick={() => setIsStackModalOpen(true)}
                        className="w-full h-8 rounded-md bg-primary/15 hover:bg-primary/25 border border-primary/40 text-xs font-semibold text-primary flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95"
                      >
                        <Sliders className="w-3.5 h-3.5" /> Customize Stack in Popup Modal
                      </button>

                      <label className="text-[10px] text-slate-400 block pt-1">Included Tech Stacks</label>
                      <div className="grid grid-cols-2 gap-1.5">
                        {Object.entries(PRESET_STACKS).map(([stkKey, stk]) => {
                          const isChecked = config.stacks.includes(stkKey);
                          return (
                            <label
                              key={stkKey}
                              className={`flex items-center gap-1.5 p-1.5 rounded-md border text-[11px] cursor-pointer transition-colors ${
                                isChecked
                                  ? "bg-primary/10 border-primary/40 text-primary"
                                  : "bg-black/30 border-white/5 text-slate-400 hover:text-slate-200"
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={(e) => {
                                  const next = e.target.checked
                                    ? [...config.stacks, stkKey]
                                    : config.stacks.filter((s) => s !== stkKey);
                                  setConfig((prev) => ({ ...prev, stacks: next }));
                                }}
                                className="accent-primary w-3 h-3"
                              />
                              <span className="truncate">{stk.label.split("·")[0]}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Pinned Repo Options */}
                  {config.type === "pin" && (
                    <div className="space-y-2 pt-1">
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1">Repository Name</label>
                        <input
                          type="text"
                          value={config.repo}
                          onChange={(e) => setConfig((prev) => ({ ...prev, repo: e.target.value }))}
                          placeholder="e.g. pgwiz.cloud"
                          className="w-full h-8 rounded bg-black/40 border border-white/10 px-2.5 text-xs text-white focus:outline-none focus:border-primary/50"
                        />
                      </div>
                      <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer pt-1">
                        <input
                          type="checkbox"
                          checked={config.showOwner}
                          onChange={(e) => setConfig((prev) => ({ ...prev, showOwner: e.target.checked }))}
                          className="accent-primary w-3.5 h-3.5"
                        />
                        Show Repository Owner
                      </label>
                    </div>
                  )}

                  {/* Banner Options */}
                  {config.type === "banner" && (
                    <div className="space-y-2 pt-1">
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1">Banner Title</label>
                        <input
                          type="text"
                          value={config.bannerName}
                          onChange={(e) => setConfig((prev) => ({ ...prev, bannerName: e.target.value }))}
                          className="w-full h-8 rounded bg-black/40 border border-white/10 px-2.5 text-xs text-white focus:outline-none focus:border-primary/50"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1">Banner Subtitle</label>
                        <input
                          type="text"
                          value={config.bannerDescription}
                          onChange={(e) => setConfig((prev) => ({ ...prev, bannerDescription: e.target.value }))}
                          className="w-full h-8 rounded bg-black/40 border border-white/10 px-2.5 text-xs text-white focus:outline-none focus:border-primary/50"
                        />
                      </div>
                    </div>
                  )}

                  {/* Theme Presets Dropdown */}
                  <div className="pt-2 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] text-slate-400 font-medium">Theme Preset</label>
                      <button
                        onClick={handleMagicTheme}
                        className="text-[10px] text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
                      >
                        <Wand2 className="w-3 h-3" /> Random
                      </button>
                    </div>
                    <select
                      value={config.theme}
                      onChange={(e) => handleSelectTheme(e.target.value)}
                      className="w-full h-8 rounded-md bg-black/40 border border-white/10 px-2 text-xs text-slate-200 focus:outline-none focus:border-primary/50 cursor-pointer"
                    >
                      {templates.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name} ({t.category})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </details>

              {/* ACCORDION 2: Colors */}
              <details className="group border-b border-white/10" open>
                <summary className="flex items-center justify-between p-3.5 cursor-pointer hover:bg-white/5 select-none text-xs font-semibold uppercase tracking-wider text-slate-400">
                  <span>Appearance & Colors</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500 transition-transform group-open:rotate-180" />
                </summary>
                <div className="px-3.5 pb-4 space-y-3 text-xs">
                  {/* Gradient Background Toggle */}
                  <div className="flex items-center justify-between px-2.5 py-1.5 rounded-md bg-black/40 border border-white/10">
                    <div className="flex items-center gap-2">
                      <Blend className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-xs text-slate-300">Gradient Background</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={config.gradientEnabled}
                      onChange={(e) => setConfig((prev) => ({ ...prev, gradientEnabled: e.target.checked }))}
                      className="accent-primary w-3.5 h-3.5 cursor-pointer"
                    />
                  </div>

                  {/* Color Pickers & Hex */}
                  <div className="grid grid-cols-2 gap-2">
                    {/* Background */}
                    <div className="bg-black/30 border border-white/10 rounded-md p-1.5 flex items-center gap-2">
                      <input
                        type="color"
                        value={config.bgColor}
                        onChange={(e) => setConfig((prev) => ({ ...prev, bgColor: e.target.value }))}
                        className="w-6 h-6 rounded cursor-pointer bg-transparent shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <label className="block text-[9px] text-slate-400 leading-none">Background</label>
                        <input
                          type="text"
                          value={config.bgColor}
                          onChange={(e) => setConfig((prev) => ({ ...prev, bgColor: e.target.value }))}
                          className="w-full bg-transparent text-[11px] font-mono text-white focus:outline-none mt-0.5"
                        />
                      </div>
                    </div>

                    {/* Primary */}
                    <div className="bg-black/30 border border-white/10 rounded-md p-1.5 flex items-center gap-2">
                      <input
                        type="color"
                        value={config.primaryColor}
                        onChange={(e) => setConfig((prev) => ({ ...prev, primaryColor: e.target.value }))}
                        className="w-6 h-6 rounded cursor-pointer bg-transparent shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <label className="block text-[9px] text-slate-400 leading-none">Primary</label>
                        <input
                          type="text"
                          value={config.primaryColor}
                          onChange={(e) => setConfig((prev) => ({ ...prev, primaryColor: e.target.value }))}
                          className="w-full bg-transparent text-[11px] font-mono text-white focus:outline-none mt-0.5"
                        />
                      </div>
                    </div>

                    {/* Secondary */}
                    <div className="bg-black/30 border border-white/10 rounded-md p-1.5 flex items-center gap-2">
                      <input
                        type="color"
                        value={config.secondaryColor}
                        onChange={(e) => setConfig((prev) => ({ ...prev, secondaryColor: e.target.value }))}
                        className="w-6 h-6 rounded cursor-pointer bg-transparent shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <label className="block text-[9px] text-slate-400 leading-none">Secondary</label>
                        <input
                          type="text"
                          value={config.secondaryColor}
                          onChange={(e) => setConfig((prev) => ({ ...prev, secondaryColor: e.target.value }))}
                          className="w-full bg-transparent text-[11px] font-mono text-white focus:outline-none mt-0.5"
                        />
                      </div>
                    </div>

                    {/* Text */}
                    <div className="bg-black/30 border border-white/10 rounded-md p-1.5 flex items-center gap-2">
                      <input
                        type="color"
                        value={config.textColor}
                        onChange={(e) => setConfig((prev) => ({ ...prev, textColor: e.target.value }))}
                        className="w-6 h-6 rounded cursor-pointer bg-transparent shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <label className="block text-[9px] text-slate-400 leading-none">Text</label>
                        <input
                          type="text"
                          value={config.textColor}
                          onChange={(e) => setConfig((prev) => ({ ...prev, textColor: e.target.value }))}
                          className="w-full bg-transparent text-[11px] font-mono text-white focus:outline-none mt-0.5"
                        />
                      </div>
                    </div>

                    {/* Border Color & Toggle */}
                    <div className="bg-black/30 border border-white/10 rounded-md p-1.5 flex items-center gap-2 col-span-2">
                      <input
                        type="color"
                        value={config.borderColor}
                        onChange={(e) => setConfig((prev) => ({ ...prev, borderColor: e.target.value }))}
                        className="w-6 h-6 rounded cursor-pointer bg-transparent shrink-0"
                      />
                      <div className="min-w-0 flex-1 flex items-center justify-between">
                        <div>
                          <label className="block text-[9px] text-slate-400 leading-none">Border</label>
                          <input
                            type="text"
                            value={config.borderColor}
                            onChange={(e) => setConfig((prev) => ({ ...prev, borderColor: e.target.value }))}
                            className="w-24 bg-transparent text-[11px] font-mono text-white focus:outline-none mt-0.5"
                          />
                        </div>
                        <label className="flex items-center gap-1.5 text-[11px] text-slate-400 pr-1 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={config.showBorder}
                            onChange={(e) => setConfig((prev) => ({ ...prev, showBorder: e.target.checked }))}
                            className="accent-primary w-3.5 h-3.5"
                          />
                          Show Border
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </details>

              {/* ACCORDION 3: Layout */}
              <details className="group border-b border-white/10">
                <summary className="flex items-center justify-between p-3.5 cursor-pointer hover:bg-white/5 select-none text-xs font-semibold uppercase tracking-wider text-slate-400">
                  <span>Layout & Sizing</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500 transition-transform group-open:rotate-180" />
                </summary>
                <div className="px-3.5 pb-4 space-y-3.5 text-xs">
                  {/* Border Radius */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Border Radius</span>
                      <span className="font-mono text-slate-200">{config.borderRadius}px</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="28"
                      value={config.borderRadius}
                      onChange={(e) => setConfig((prev) => ({ ...prev, borderRadius: parseInt(e.target.value, 10) }))}
                      className="w-full accent-primary h-1.5 bg-black/50 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Animation */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400">Animation</label>
                    <select
                      value={config.animation}
                      onChange={(e) => setConfig((prev) => ({ ...prev, animation: e.target.value }))}
                      className="w-full h-8 rounded-md bg-black/40 border border-white/10 px-2 text-xs text-slate-200 focus:outline-none focus:border-primary/50"
                    >
                      <option value="none">None (Static)</option>
                      <option value="fadeIn">Fade In (Clean)</option>
                      <option value="slideUp">Slide Up</option>
                      <option value="pulse">Subtle Pulse</option>
                    </select>
                  </div>
                </div>
              </details>

              {/* ACCORDION 4: Content Override */}
              <details className="group border-b border-white/10">
                <summary className="flex items-center justify-between p-3.5 cursor-pointer hover:bg-white/5 select-none text-xs font-semibold uppercase tracking-wider text-slate-400">
                  <span>Content Overrides</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500 transition-transform group-open:rotate-180" />
                </summary>
                <div className="px-3.5 pb-4 space-y-2.5 text-xs">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Card Header Title</label>
                    <input
                      type="text"
                      value={config.customText}
                      onChange={(e) => setConfig((prev) => ({ ...prev, customText: e.target.value }))}
                      placeholder="Default Title..."
                      className="w-full h-8 rounded bg-black/40 border border-white/10 px-2.5 text-xs text-white focus:outline-none focus:border-primary/50"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Custom Tag / Subtitle</label>
                    <input
                      type="text"
                      value={config.customDescription}
                      onChange={(e) => setConfig((prev) => ({ ...prev, customDescription: e.target.value }))}
                      placeholder="e.g. #developer · architecture"
                      className="w-full h-8 rounded bg-black/40 border border-white/10 px-2.5 text-xs text-white focus:outline-none focus:border-primary/50"
                    />
                  </div>
                </div>
              </details>

            </div>
          </aside>
        </div>

        {/* Tech Stack Customization Popup Window */}
        <TechStackModal
          isOpen={isStackModalOpen}
          onClose={() => setIsStackModalOpen(false)}
          selectedSkills={
            config.skills && config.skills.trim().length > 0
              ? config.skills.split(",").map((s) => s.trim()).filter(Boolean)
              : config.stacks.flatMap((stk) => PRESET_STACKS[stk]?.skills || [])
          }
          onSave={(skills) => {
            setConfig((prev) => ({
              ...prev,
              skills: skills.join(","),
            }));
            toast({
              title: "Tech Stack Updated",
              description: `${skills.length} technologies saved to your card.`,
            });
          }}
        />
      </PageTransition>
    </Layout>
  );
}
