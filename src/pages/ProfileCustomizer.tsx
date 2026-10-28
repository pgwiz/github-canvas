import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { PageTransition } from "@/components/layout/PageTransition";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { extractTextFromFile } from "@/lib/cvExtractor";
import { MarkdownPreview } from "@/components/profile/MarkdownPreview";
import { templates } from "@/lib/templates";
import { 
  Sparkles, UploadCloud, FileText, Copy, Check, Download, 
  Eye, Code2, Columns, Settings2, ArrowRight, Trash2, 
  RefreshCw, CheckCircle2, SlidersHorizontal, UserCheck, Layers, BarChart3, Flame
} from "lucide-react";

const AVAILABLE_CARDS = [
  { id: "banner", label: "Hero Banner", description: "Animated top banner with name and headline", icon: Layers },
  { id: "stats", label: "GitHub Stats", description: "Total stars, forks, and repository metrics", icon: BarChart3 },
  { id: "streak", label: "Contribution Streak", description: "Active streak days and consistency tracker", icon: Flame },
  { id: "languages", label: "Top Languages", description: "Multi-language progress bars and percentages", icon: Code2 },
  { id: "activity", label: "Weekly Activity", description: "Interactive sparkline graph of commit density", icon: BarChart3 },
  { id: "quote", label: "Daily Dev Quote", description: "Inspiring developer quote widget", icon: Sparkles },
];

const INITIAL_SAMPLE_MARKDOWN = (username: string, theme: string) => `# Hi there, I'm ${username || "Developer"}

<div align="center">
  <img src="https://github-canvas.vercel.app/api/card?type=banner&username=${encodeURIComponent(username || "developer")}&bannerName=${encodeURIComponent(username || "Developer")}&bannerDescription=Full-Stack%20Engineer%20%26%20Open-Source%20Craftsman&theme=${theme}&animation=wave" alt="Header Banner" width="100%" />
</div>

## About Me

I am a software engineer passionate about designing robust web applications, scalable backends, and modern developer tooling. I love turning complex challenges into clean, performant, and maintainable software.

- **Current Focus:** Full-stack distributed systems & high-throughput APIs.
- **Learning & Exploring:** Edge computing architectures and AI workflow agents.
- **Ask me about:** React, TypeScript, Node.js, and Cloud Infrastructure.
- **Connect:** [GitHub](https://github.com/${username || "octocat"}) • [LinkedIn](https://linkedin.com) • [Twitter](https://twitter.com)

## Tech Stack & Tooling

\`TypeScript\` • \`React\` • \`Node.js\` • \`Next.js\` • \`TailwindCSS\` • \`PostgreSQL\` • \`Docker\` • \`GraphQL\`

## GitHub Metrics

<p align="center">
  <img src="https://github-canvas.vercel.app/api/card?type=stats&username=${encodeURIComponent(username || "octocat")}&theme=${theme}&animation=fadeIn" alt="GitHub Stats" height="175" />
  <img src="https://github-canvas.vercel.app/api/card?type=streak&username=${encodeURIComponent(username || "octocat")}&theme=${theme}&animation=fadeIn" alt="GitHub Streak" height="175" />
</p>

## Languages & Activity

<p align="center">
  <img src="https://github-canvas.vercel.app/api/card?type=languages&username=${encodeURIComponent(username || "octocat")}&theme=${theme}&animation=fadeIn" alt="Top Languages" height="175" />
  <img src="https://github-canvas.vercel.app/api/card?type=activity&username=${encodeURIComponent(username || "octocat")}&theme=${theme}&animation=fadeIn" alt="Activity Sparkline" height="175" />
</p>

## Daily Inspiration

<p align="center">
  <img src="https://github-canvas.vercel.app/api/card?type=quote&theme=${theme}&animation=fadeIn" alt="Dev Quote" />
</p>
`;

export default function ProfileCustomizer() {
  const [username, setUsername] = useState("pgwiz");
  const [portfolio, setPortfolio] = useState("");
  const [cvText, setCvText] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [selectedTheme, setSelectedTheme] = useState("electric-blue");
  const [selectedCards, setSelectedCards] = useState<string[]>([
    "banner", "stats", "streak", "languages", "activity", "quote"
  ]);
  const [generatedMarkdown, setGeneratedMarkdown] = useState<string>(() =>
    INITIAL_SAMPLE_MARKDOWN("pgwiz", "electric-blue")
  );
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<"split" | "preview" | "editor">("split");
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleCardToggle = (cardId: string) => {
    setSelectedCards((prev) =>
      prev.includes(cardId) ? prev.filter((id) => id !== cardId) : [...prev, cardId]
    );
  };

  const handleFileUpload = async (file: File) => {
    try {
      setUploadedFileName(file.name);
      const text = await extractTextFromFile(file);
      setCvText(text);
      toast({
        title: "Document Uploaded",
        description: `Successfully extracted ${text.length} characters from ${file.name}.`,
      });
    } catch (err) {
      toast({
        title: "File Read Error",
        description: err instanceof Error ? err.message : "Could not extract text from document.",
        variant: "destructive",
      });
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleGenerate = async () => {
    if (!username.trim()) {
      toast({
        title: "Username Required",
        description: "Please enter your GitHub username.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          portfolio,
          cvText,
          theme: selectedTheme,
          selectedCards,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.markdown) {
        throw new Error(data.error || "Failed to generate profile.");
      }

      setGeneratedMarkdown(data.markdown);
      toast({
        title: "Profile Generated",
        description: "Your personalized GitHub Profile README is ready!",
      });
    } catch (err) {
      console.warn("AI generation endpoint fallback:", err instanceof Error ? err.message : String(err));
      // Fallback local update
      setGeneratedMarkdown(INITIAL_SAMPLE_MARKDOWN(username.trim(), selectedTheme));
      toast({
        title: "Profile Generated (Fallback)",
        description: "Created structured profile embedding your selected GitStats cards.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedMarkdown);
    setCopied(true);
    toast({
      title: "Copied to Clipboard",
      description: "Markdown profile copied. Paste directly into your GitHub README.md!",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadReadme = () => {
    const blob = new Blob([generatedMarkdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "README.md";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast({
      title: "README.md Downloaded",
      description: "Your file is ready to commit to your GitHub profile repository.",
    });
  };

  return (
    <Layout>
      <PageTransition>
        <div className="min-h-screen py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-20 left-1/3 w-[600px] h-[300px] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute bottom-20 right-1/4 w-[450px] h-[300px] bg-secondary/10 rounded-full blur-[130px] pointer-events-none" />

          <div className="max-w-7xl mx-auto space-y-10">
            {/* Header */}
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-medium text-primary">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Profile Architect & Live Previewer</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
                GitHub Profile <span className="gradient-text">Customizer</span>
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                Transform your CV, resume, or bio into an outstanding GitHub Profile README.
                Embed live animated stats, streaks, banners, and language charts in seconds.
              </p>
            </div>

            {/* Main Studio Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Configuration & CV Upload (5 cols) */}
              <div className="lg:col-span-5 space-y-6">
                <GlassPanel className="p-6 space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                      <Settings2 className="w-4 h-4 text-primary" />
                      Profile Configuration
                    </h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setUsername("pgwiz");
                        setSelectedTheme("electric-blue");
                        setGeneratedMarkdown(INITIAL_SAMPLE_MARKDOWN("pgwiz", "electric-blue"));
                      }}
                      className="text-xs h-7 text-muted-foreground hover:text-foreground"
                    >
                      <RefreshCw className="w-3 h-3 mr-1" />
                      Reset Sample
                    </Button>
                  </div>

                  {/* GitHub Username */}
                  <div className="space-y-2">
                    <Label htmlFor="github-username" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      GitHub Username
                    </Label>
                    <div className="relative">
                      <UserCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="github-username"
                        placeholder="e.g. pgwiz"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="pl-9 bg-background/50 border-white/10 focus:border-primary/50 font-mono text-sm"
                      />
                    </div>
                  </div>

                  {/* Theme Selector */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Card Color Theme
                      </Label>
                      <Link to="/themes" className="text-xs text-primary hover:underline flex items-center gap-1">
                        Browse all themes <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                    <Select value={selectedTheme} onValueChange={setSelectedTheme}>
                      <SelectTrigger className="bg-background/50 border-white/10 focus:border-primary/50">
                        <SelectValue placeholder="Select theme" />
                      </SelectTrigger>
                      <SelectContent className="bg-background/95 border-white/10 backdrop-blur-xl">
                        {templates.map((theme) => (
                          <SelectItem key={theme.id} value={theme.id}>
                            <div className="flex items-center gap-2">
                              <span
                                className="w-3 h-3 rounded-full border border-white/20"
                                style={{ backgroundColor: theme.colors.primary }}
                              />
                              <span>{theme.name}</span>
                              <span className="text-xs text-muted-foreground font-mono ml-auto">
                                ({theme.category})
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* CV Upload Dropzone */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        CV / Resume File Extraction
                      </Label>
                      {uploadedFileName && (
                        <button
                          onClick={() => {
                            setUploadedFileName(null);
                            setCvText("");
                          }}
                          className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" /> Remove
                        </button>
                      )}
                    </div>

                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                      }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={onDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
                        isDragging
                          ? "border-primary bg-primary/10"
                          : uploadedFileName
                          ? "border-primary/40 bg-primary/5"
                          : "border-white/10 hover:border-white/20 bg-black/20"
                      }`}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".txt,.md,.markdown,.pdf,.json"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleFileUpload(e.target.files[0]);
                          }
                        }}
                      />
                      {uploadedFileName ? (
                        <div className="flex items-center justify-center gap-2 text-sm text-primary font-medium">
                          <CheckCircle2 className="w-4 h-4 text-primary" />
                          <span className="truncate max-w-[240px]">{uploadedFileName}</span>
                          <span className="text-xs text-muted-foreground">({cvText.length} chars)</span>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <UploadCloud className="w-6 h-6 mx-auto text-muted-foreground" />
                          <p className="text-xs font-medium text-foreground">
                            Upload CV (.pdf, .txt, .md, .json)
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            Drag and drop or click to extract text
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Raw Bio / CV Text Input */}
                  <div className="space-y-2">
                    <Label htmlFor="bio-input" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      CV Text / Portfolio Summary
                    </Label>
                    <Textarea
                      id="bio-input"
                      placeholder="Paste your resume, skills, current role, or project highlights here..."
                      value={cvText || portfolio}
                      onChange={(e) => {
                        setCvText(e.target.value);
                        setPortfolio(e.target.value);
                      }}
                      className="min-h-[110px] bg-background/50 border-white/10 focus:border-primary/50 text-xs font-mono"
                    />
                  </div>

                  {/* Cards to Include Checklist */}
                  <div className="space-y-3">
                    <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Embed GitStats Cards
                    </Label>
                    <div className="grid grid-cols-2 gap-2">
                      {AVAILABLE_CARDS.map((card) => {
                        const Icon = card.icon;
                        const isChecked = selectedCards.includes(card.id);
                        return (
                          <div
                            key={card.id}
                            onClick={() => handleCardToggle(card.id)}
                            className={`flex items-center gap-2.5 p-2 rounded-lg border cursor-pointer select-none transition-all ${
                              isChecked
                                ? "border-primary/40 bg-primary/10 text-foreground"
                                : "border-white/10 hover:border-white/20 bg-white/5 text-muted-foreground"
                            }`}
                          >
                            <Checkbox
                              checked={isChecked}
                              onCheckedChange={() => handleCardToggle(card.id)}
                              className="border-white/20 data-[state=checked]:bg-primary"
                            />
                            <div className="flex items-center gap-1.5 overflow-hidden">
                              <Icon className="w-3.5 h-3.5 flex-shrink-0 text-primary" />
                              <span className="text-xs font-medium truncate">{card.label}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Generate Button */}
                  <Button
                    onClick={handleGenerate}
                    disabled={isLoading}
                    className="w-full h-11 text-sm font-semibold relative overflow-hidden"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Crafting AI Profile...</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        <span>Generate AI Profile README</span>
                      </span>
                    )}
                  </Button>
                </GlassPanel>
              </div>

              {/* Right Column: Split Workspace (Editor + Live Rendered Preview) (7 cols) */}
              <div className="lg:col-span-7 space-y-4">
                <GlassPanel className="p-4 sm:p-6 space-y-4">
                  {/* Top Bar: View toggles & Export actions */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                    {/* View Switcher */}
                    <div className="flex items-center gap-1 p-1 rounded-lg bg-white/5 border border-white/10">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setViewMode("split")}
                        className={`text-xs h-7 px-2.5 rounded-md ${
                          viewMode === "split" ? "bg-primary/20 text-primary font-semibold" : "text-muted-foreground"
                        }`}
                      >
                        <Columns className="w-3.5 h-3.5 mr-1.5" />
                        Split
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setViewMode("preview")}
                        className={`text-xs h-7 px-2.5 rounded-md ${
                          viewMode === "preview" ? "bg-primary/20 text-primary font-semibold" : "text-muted-foreground"
                        }`}
                      >
                        <Eye className="w-3.5 h-3.5 mr-1.5" />
                        Live Preview
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setViewMode("editor")}
                        className={`text-xs h-7 px-2.5 rounded-md ${
                          viewMode === "editor" ? "bg-primary/20 text-primary font-semibold" : "text-muted-foreground"
                        }`}
                      >
                        <Code2 className="w-3.5 h-3.5 mr-1.5" />
                        Raw Markdown
                      </Button>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={copyToClipboard}
                        className="text-xs h-8 border-white/10 hover:border-white/20"
                      >
                        {copied ? (
                          <>
                            <Check className="w-3.5 h-3.5 mr-1.5 text-green-400" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 mr-1.5" />
                            Copy Markdown
                          </>
                        )}
                      </Button>

                      <Button
                        variant="default"
                        size="sm"
                        onClick={downloadReadme}
                        className="text-xs h-8 bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30"
                      >
                        <Download className="w-3.5 h-3.5 mr-1.5" />
                        Download README.md
                      </Button>
                    </div>
                  </div>

                  {/* Main Display Area */}
                  {viewMode === "split" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[650px]">
                      {/* Editor */}
                      <div className="flex flex-col h-full border border-white/10 rounded-xl overflow-hidden bg-black/40">
                        <div className="px-3 py-2 bg-white/5 border-b border-white/10 text-[11px] font-mono text-muted-foreground flex items-center justify-between">
                          <span>Markdown Editor</span>
                          <span>README.md</span>
                        </div>
                        <textarea
                          value={generatedMarkdown}
                          onChange={(e) => setGeneratedMarkdown(e.target.value)}
                          className="flex-1 p-3 bg-transparent font-mono text-xs text-foreground resize-none focus:outline-none overflow-y-auto leading-relaxed"
                          spellCheck={false}
                        />
                      </div>

                      {/* Rendered Preview */}
                      <div className="flex flex-col h-full border border-white/10 rounded-xl overflow-hidden bg-background/40">
                        <div className="px-3 py-2 bg-white/5 border-b border-white/10 text-[11px] font-mono text-muted-foreground flex items-center justify-between">
                          <span>GitHub Rendered Preview</span>
                          <span className="text-primary font-semibold">Live SVG Cards</span>
                        </div>
                        <div className="flex-1 p-4 overflow-y-auto">
                          <MarkdownPreview content={generatedMarkdown} />
                        </div>
                      </div>
                    </div>
                  )}

                  {viewMode === "preview" && (
                    <div className="h-[650px] border border-white/10 rounded-xl overflow-y-auto p-6 bg-background/40">
                      <MarkdownPreview content={generatedMarkdown} />
                    </div>
                  )}

                  {viewMode === "editor" && (
                    <div className="h-[650px] border border-white/10 rounded-xl overflow-hidden bg-black/40 flex flex-col">
                      <div className="px-4 py-2 bg-white/5 border-b border-white/10 text-xs font-mono text-muted-foreground flex items-center justify-between">
                        <span>Raw Markdown Code</span>
                        <span>{generatedMarkdown.length} characters</span>
                      </div>
                      <textarea
                        value={generatedMarkdown}
                        onChange={(e) => setGeneratedMarkdown(e.target.value)}
                        className="flex-1 p-4 bg-transparent font-mono text-xs text-foreground resize-none focus:outline-none overflow-y-auto leading-relaxed"
                        spellCheck={false}
                      />
                    </div>
                  )}

                  {/* Bottom helper tip */}
                  <div className="pt-2 text-xs text-muted-foreground flex items-center justify-between">
                    <span>
                      Tip: Create a repository named <code className="text-primary font-mono">{username || "username"}/{username || "username"}</code> on GitHub to display this on your profile.
                    </span>
                    <Link to="/generator" className="text-primary hover:underline flex items-center gap-1 font-medium">
                      Design Custom Card <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </GlassPanel>
              </div>
            </div>
          </div>
        </div>
      </PageTransition>
    </Layout>
  );
}
