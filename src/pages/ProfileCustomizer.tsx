import { useState, useRef, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { PageTransition } from "@/components/layout/PageTransition";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { extractTextFromFile } from "@/lib/cvExtractor";
import { MarkdownPreview } from "@/components/profile/MarkdownPreview";
import { templates } from "@/lib/templates";
import { ShareModal } from "@/components/generator/ShareModal";
import confetti from "canvas-confetti";
import { 
  Sparkles, UploadCloud, FileText, Copy, Check, Download, 
  Eye, Code2, Columns, Settings2, ArrowRight, Trash2, 
  RefreshCw, CheckCircle2, UserCheck, Layers, BarChart3, 
  Flame, Grid3X3, Bookmark, Quote, Activity, Share2, 
  ChevronDown, Plus, ExternalLink, Terminal, Shield, Zap
} from "lucide-react";

export const getCardApiBase = () => {
  if (typeof window !== "undefined" && window.location.origin) {
    return window.location.origin;
  }
  return "https://github-canvas.pgwiz.cloud";
};

const AVAILABLE_CARDS = [
  { id: "banner", label: "Hero Banner", description: "Animated top banner with wave style", icon: Layers },
  { id: "stats", label: "GitHub Stats", description: "Stars, commits, repos and rank", icon: BarChart3 },
  { id: "streak", label: "Streak Tracker", description: "Current and longest active streak", icon: Flame },
  { id: "languages", label: "Top Languages", description: "Percentages & progress bars", icon: Code2 },
  { id: "skills", label: "Tech Stack Matrix", description: "Clean vector tech stack icons", icon: Grid3X3 },
  { id: "activity", label: "Weekly Activity", description: "Commit density sparkline", icon: Activity },
  { id: "quote", label: "Daily Dev Quote", description: "Inspiring developer quote", icon: Quote },
  { id: "pin", label: "Pinned Repo", description: "Repository showcase badge", icon: Bookmark },
];

export const createInitialMarkdown = (username: string, theme: string, base: string = getCardApiBase()) => `# Hi there, I'm ${username || "Developer"} 👋

<div align="center">
  <img src="${base}/api/card?type=banner&username=${encodeURIComponent(username || "developer")}&bannerName=${encodeURIComponent(username || "Developer")}&bannerDescription=Full-Stack%20Engineer%20%26%20Open-Source%20Craftsman&theme=${theme}&animation=wave" alt="Header Banner" width="100%" />
</div>

## 🚀 About Me

I am a passionate software engineer focused on building robust distributed systems, modern full-stack web applications, and developer tooling. I love transforming complex ideas into clean, performant, and resilient architectures.

- 🔭 **Current Focus:** Distributed edge runtimes & real-time collaborative workspaces.
- 🌱 **Learning & Exploring:** AI-agentic coding systems, vector databases, and Rust.
- 💬 **Ask me about:** TypeScript, React, Node.js, Cloudflare, and PostgreSQL.
- 📫 **Connect:** [GitHub](https://github.com/${username || "octocat"}) • [Portfolio](https://pgwiz.cloud) • [LinkedIn](https://linkedin.com)

## 🛠️ Tech Stack & Tooling

<div align="center">
  <img src="${base}/api/card?type=skills&skills=TypeScript,React,Node.js,Python,PostgreSQL,Docker,TailwindCSS,Linux&theme=${theme}&layout=matrix" alt="Tech Stack" width="100%" />
</div>

## 📊 GitHub Metrics & Activity

<p align="center">
  <img src="${base}/api/card?type=stats&username=${encodeURIComponent(username || "octocat")}&theme=${theme}&animation=fadeIn" alt="GitHub Stats" height="175" />
  <img src="${base}/api/card?type=streak&username=${encodeURIComponent(username || "octocat")}&theme=${theme}&animation=fadeIn" alt="GitHub Streak" height="175" />
</p>

<p align="center">
  <img src="${base}/api/card?type=languages&username=${encodeURIComponent(username || "octocat")}&theme=${theme}&animation=fadeIn" alt="Top Languages" height="175" />
  <img src="${base}/api/card?type=activity&username=${encodeURIComponent(username || "octocat")}&theme=${theme}&animation=fadeIn" alt="Activity Sparkline" height="175" />
</p>

## 💡 Developer Wisdom

<p align="center">
  <img src="${base}/api/card?type=quote&theme=${theme}&animation=fadeIn" alt="Dev Quote" />
</p>
`;

export default function ProfileCustomizer() {
  const [username, setUsername] = useState("pgwiz");
  const [targetRole, setTargetRole] = useState("Full-Stack Software Engineer");
  const [tone, setTone] = useState("Modern & Impactful");
  const [portfolio, setPortfolio] = useState("");
  const [cvText, setCvText] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [selectedTheme, setSelectedTheme] = useState("electric-blue");
  const [selectedCards, setSelectedCards] = useState<string[]>([
    "banner", "stats", "streak", "languages", "skills", "activity", "quote"
  ]);
  const [generatedMarkdown, setGeneratedMarkdown] = useState<string>(() =>
    createInitialMarkdown("pgwiz", "electric-blue")
  );
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<"split" | "preview" | "editor">("split");
  const [isDragging, setIsDragging] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  const charCount = generatedMarkdown.length;
  const wordCount = useMemo(() => {
    return generatedMarkdown.trim() ? generatedMarkdown.trim().split(/\s+/).length : 0;
  }, [generatedMarkdown]);

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

  // Generate Profile using AI or smart template fallback
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
          portfolio: portfolio || targetRole,
          cvText: cvText || `${targetRole} - Tone: ${tone}`,
          theme: selectedTheme,
          selectedCards,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.markdown) {
        throw new Error(data.error || "Failed to generate profile.");
      }

      setGeneratedMarkdown(data.markdown);
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#3b82f6", "#06b6d4", "#ffffff"],
      });
      toast({
        title: "Profile Generated",
        description: "Your personalized GitHub Profile README is ready!",
      });
    } catch (err) {
      console.warn("AI generation fallback:", err instanceof Error ? err.message : String(err));
      // Local fallback with valid base URL
      setGeneratedMarkdown(createInitialMarkdown(username.trim(), selectedTheme));
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
      description: "Ready to commit to your GitHub profile repository.",
    });
  };

  // Helper to append a snippet into the active markdown editor
  const insertSnippet = (snippet: string, title: string) => {
    setGeneratedMarkdown((prev) => `${prev.trim()}\n\n${snippet}\n`);
    toast({
      title: `Inserted ${title}`,
      description: "Appended to your Markdown README canvas.",
    });
  };

  const apiBase = getCardApiBase();
  const safeUser = encodeURIComponent(username || "developer");

  return (
    <Layout hideFooter={true}>
      <PageTransition>
        <div className="flex-1 flex flex-col sm:flex-row sm:h-[calc(100dvh-4rem)] sm:min-h-0 sm:overflow-hidden bg-background text-slate-100">

          {/* =========================================================================
              LEFT COLUMN: SETUP, RESUME UPLOAD & AI CONFIG (340px)
              ========================================================================= */}
          <aside className="w-full sm:w-[320px] md:w-[350px] shrink-0 border-b sm:border-b-0 sm:border-r border-white/10 bg-surface/90 flex flex-col sm:h-full sm:min-h-0 z-20">
            {/* Header */}
            <div className="h-11 px-4 border-b border-white/10 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-400 shrink-0 bg-surface/50">
              <span className="flex items-center gap-2 text-slate-200">
                <Settings2 className="w-4 h-4 text-primary" /> Profile Setup
              </span>
              <button
                onClick={() => {
                  setUsername("pgwiz");
                  setSelectedTheme("electric-blue");
                  setGeneratedMarkdown(createInitialMarkdown("pgwiz", "electric-blue"));
                  toast({ title: "Sample Reset", description: "Default profile restored." });
                }}
                className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
              >
                <RefreshCw className="w-3 h-3" /> Reset
              </button>
            </div>

            {/* Scrollable Form Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
              {/* GitHub Username */}
              <div className="space-y-1.5">
                <Label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  GitHub Username
                </Label>
                <div className="relative">
                  <UserCheck className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <Input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. pgwiz"
                    className="pl-8 bg-black/40 border-white/10 h-8 text-xs font-mono text-white focus:border-primary/50"
                  />
                </div>
              </div>

              {/* Card Color Theme */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Card Theme
                  </Label>
                  <Link to="/themes" className="text-[10px] text-primary hover:underline flex items-center gap-0.5">
                    View all <ArrowRight className="w-2.5 h-2.5" />
                  </Link>
                </div>
                <Select value={selectedTheme} onValueChange={setSelectedTheme}>
                  <SelectTrigger className="bg-black/40 border-white/10 h-8 text-xs text-white focus:border-primary/50">
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent className="bg-surface border-white/10 text-white max-h-60 no-scrollbar">
                    {templates.map((t) => (
                      <SelectItem key={t.id} value={t.id} className="text-xs">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full border border-white/20 shrink-0"
                            style={{ backgroundColor: t.colors.primary }}
                          />
                          <span className="truncate">{t.name}</span>
                          <span className="text-[10px] text-slate-500 font-mono ml-auto">({t.category})</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Collapsible CV & Resume Uploader */}
              <div className="rounded-xl border border-white/10 bg-black/30 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(!isUploadOpen)}
                  className="w-full px-3.5 py-2.5 flex items-center justify-between text-left text-xs font-semibold uppercase tracking-wider text-slate-300 hover:text-white bg-white/5 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <UploadCloud className="w-3.5 h-3.5 text-primary" /> Resume / CV Extraction
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isUploadOpen ? "rotate-180" : ""}`} />
                </button>

                {isUploadOpen && (
                  <div className="p-3 space-y-3 border-t border-white/10">
                    {/* Dropzone */}
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                      }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={onDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-lg p-3 text-center cursor-pointer transition-all ${
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
                        <div className="flex items-center justify-between text-xs text-primary font-medium">
                          <span className="flex items-center gap-1.5 truncate max-w-[200px]">
                            <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-primary" />
                            <span className="truncate">{uploadedFileName}</span>
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setUploadedFileName(null);
                              setCvText("");
                            }}
                            className="text-red-400 hover:text-red-300 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <UploadCloud className="w-5 h-5 mx-auto text-slate-400" />
                          <p className="text-[11px] font-medium text-slate-200">
                            Upload CV (.pdf, .txt, .md, .json)
                          </p>
                          <p className="text-[10px] text-slate-500">
                            Drop resume file to parse skills
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Extracted text snippet */}
                    {cvText && (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[10px] text-slate-400">
                          <span>Extracted Content</span>
                          <span>{cvText.length} chars</span>
                        </div>
                        <Textarea
                          value={cvText}
                          onChange={(e) => setCvText(e.target.value)}
                          rows={3}
                          className="bg-black/40 border-white/10 text-[11px] font-mono text-slate-300 resize-none p-2"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Career Goal & Role Input */}
              <div className="space-y-1.5">
                <Label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Target Role / Headline
                </Label>
                <Input
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g. Senior Full-Stack Engineer"
                  className="bg-black/40 border-white/10 h-8 text-xs text-white focus:border-primary/50"
                />
              </div>

              {/* Tone Selection */}
              <div className="space-y-1.5">
                <Label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Profile Tone
                </Label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger className="bg-black/40 border-white/10 h-8 text-xs text-white focus:border-primary/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-surface border-white/10 text-white">
                    <SelectItem value="Modern & Impactful">Modern & Impactful</SelectItem>
                    <SelectItem value="Senior & Technical">Senior & Technical</SelectItem>
                    <SelectItem value="Minimalist & Clean">Minimalist & Clean</SelectItem>
                    <SelectItem value="Cyberpunk Hacker">Cyberpunk Hacker</SelectItem>
                    <SelectItem value="Open Source Craftsman">Open Source Craftsman</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Embed Cards Selection */}
              <div className="space-y-2 pt-1">
                <Label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                  Embed Dynamic Cards
                </Label>
                <div className="grid grid-cols-2 gap-1.5">
                  {AVAILABLE_CARDS.map((card) => {
                    const Icon = card.icon;
                    const isChecked = selectedCards.includes(card.id);
                    return (
                      <button
                        key={card.id}
                        type="button"
                        onClick={() => handleCardToggle(card.id)}
                        className={`flex items-center gap-2 p-1.5 rounded-lg border text-left transition-all ${
                          isChecked
                            ? "border-primary/50 bg-primary/10 text-white shadow-sm"
                            : "border-white/5 bg-black/20 text-slate-400 hover:text-white"
                        }`}
                      >
                        <Checkbox
                          checked={isChecked}
                          onCheckedChange={() => handleCardToggle(card.id)}
                          className="border-white/20 data-[state=checked]:bg-primary h-3.5 w-3.5"
                        />
                        <Icon className="w-3 h-3 text-primary shrink-0" />
                        <span className="text-[11px] font-medium truncate">{card.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Bottom Generate Button */}
            <div className="p-3 border-t border-white/10 bg-surface/90 shrink-0">
              <Button
                onClick={handleGenerate}
                disabled={isLoading}
                className="w-full h-9 bg-primary hover:bg-primary/90 text-xs font-bold text-white transition-all shadow-md active:scale-95"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Architecting Profile...</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Generate AI Profile README</span>
                  </span>
                )}
              </Button>
            </div>
          </aside>


          {/* =========================================================================
              CENTER COLUMN: LIVE PREVIEW & CODE STAGE (FLEX-1)
              ========================================================================= */}
          <main className="flex-1 min-w-0 flex flex-col bg-background relative sm:min-h-0 sm:overflow-hidden">
            {/* Top Workspace Bar */}
            <div className="min-h-11 py-1.5 px-4 border-b border-white/10 flex flex-wrap items-center justify-between text-xs text-slate-400 bg-surface/50 shrink-0 z-20 gap-2">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-primary" />
                  <span className="font-semibold text-slate-200">README Canvas</span>
                  <span className="text-slate-600">•</span>
                  <span className="font-mono text-[11px] text-slate-400">
                    {charCount} chars ({wordCount} words)
                  </span>
                </div>
              </div>

              {/* View Mode Switcher */}
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-black/50 p-0.5 rounded-lg border border-white/10">
                  <button
                    onClick={() => setViewMode("preview")}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${
                      viewMode === "preview" ? "bg-primary/20 text-primary font-semibold" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" /> Preview
                  </button>
                  <button
                    onClick={() => setViewMode("editor")}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${
                      viewMode === "editor" ? "bg-primary/20 text-primary font-semibold" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <Code2 className="w-3.5 h-3.5" /> Code
                  </button>
                  <button
                    onClick={() => setViewMode("split")}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${
                      viewMode === "split" ? "bg-primary/20 text-primary font-semibold" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <Columns className="w-3.5 h-3.5" /> Split
                  </button>
                </div>

                <button
                  onClick={() => setIsShareOpen(true)}
                  className="px-2.5 py-1 rounded-lg border border-white/10 hover:bg-white/10 text-xs font-medium text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
                  title="Share Profile README"
                >
                  <Share2 className="w-3.5 h-3.5 text-primary" /> Share
                </button>
              </div>
            </div>

            {/* Stage Canvas Area */}
            <div className="canvas-grid flex-1 relative sm:min-h-0 overflow-hidden flex flex-col">
              {/* MODE 1: LIVE PREVIEW ONLY */}
              {viewMode === "preview" && (
                <div className="flex-1 overflow-y-auto p-4 sm:p-8 no-scrollbar flex justify-center">
                  <div className="w-full max-w-4xl bg-surface/90 border border-white/10 rounded-2xl shadow-2xl p-6 sm:p-10 text-slate-200">
                    <MarkdownPreview content={generatedMarkdown} />
                  </div>
                </div>
              )}

              {/* MODE 2: CODE EDITOR ONLY */}
              {viewMode === "editor" && (
                <div className="flex-1 flex flex-col p-4 sm:p-6 overflow-hidden">
                  <div className="flex-1 border border-white/10 rounded-2xl bg-black/50 overflow-hidden flex flex-col">
                    <div className="px-4 py-2 border-b border-white/10 bg-white/5 text-[11px] font-mono text-slate-400 flex items-center justify-between">
                      <span>README.md Editor</span>
                      <span>Raw GitHub Flavored Markdown</span>
                    </div>
                    <textarea
                      ref={textareaRef}
                      value={generatedMarkdown}
                      onChange={(e) => setGeneratedMarkdown(e.target.value)}
                      className="flex-1 p-4 bg-transparent font-mono text-xs text-slate-100 resize-none focus:outline-none overflow-y-auto leading-relaxed selection:bg-primary/30 no-scrollbar"
                      spellCheck={false}
                    />
                  </div>
                </div>
              )}

              {/* MODE 3: SPLIT VIEW (Code Left, Preview Right) */}
              {viewMode === "split" && (
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3 p-3 sm:p-4 overflow-hidden min-h-0">
                  {/* Left Half: Raw Markdown Editor */}
                  <div className="border border-white/10 rounded-xl bg-black/60 overflow-hidden flex flex-col h-full min-h-0">
                    <div className="px-3.5 py-2 border-b border-white/10 bg-white/5 text-[11px] font-mono text-slate-400 flex items-center justify-between shrink-0">
                      <span className="flex items-center gap-1.5 text-slate-300">
                        <Code2 className="w-3.5 h-3.5 text-primary" /> Markdown Editor
                      </span>
                      <span>README.md</span>
                    </div>
                    <textarea
                      ref={textareaRef}
                      value={generatedMarkdown}
                      onChange={(e) => setGeneratedMarkdown(e.target.value)}
                      className="flex-1 p-3.5 bg-transparent font-mono text-xs text-slate-100 resize-none focus:outline-none overflow-y-auto leading-relaxed selection:bg-primary/30 no-scrollbar"
                      spellCheck={false}
                    />
                  </div>

                  {/* Right Half: Live GitHub Rendered Preview */}
                  <div className="border border-white/10 rounded-xl bg-surface/90 overflow-hidden flex flex-col h-full min-h-0">
                    <div className="px-3.5 py-2 border-b border-white/10 bg-white/5 text-[11px] font-mono text-slate-400 flex items-center justify-between shrink-0">
                      <span className="flex items-center gap-1.5 text-slate-300">
                        <Eye className="w-3.5 h-3.5 text-secondary" /> GitHub Rendered View
                      </span>
                      <span className="text-primary font-semibold">Live SVG Cards</span>
                    </div>
                    <div className="flex-1 p-4 sm:p-6 overflow-y-auto no-scrollbar">
                      <MarkdownPreview content={generatedMarkdown} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Action Dock */}
            <div className="w-full bg-surface/95 border-t border-white/10 shrink-0 z-30 px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Shield className="w-3.5 h-3.5 text-primary" />
                <span>Tip: Commit to <code className="text-primary font-mono">{username || "username"}/{username || "username"}</code> repo</span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyToClipboard}
                  className="h-8 border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-xs text-white"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 mr-1.5 text-primary" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 mr-1.5" /> Copy Markdown
                    </>
                  )}
                </Button>

                <Button
                  size="sm"
                  onClick={downloadReadme}
                  className="h-8 bg-primary hover:bg-primary/90 text-xs font-semibold text-white transition-all shadow-sm active:scale-95"
                >
                  <Download className="w-3.5 h-3.5 mr-1.5" /> Download README.md
                </Button>
              </div>
            </div>
          </main>


          {/* =========================================================================
              RIGHT COLUMN: QUICK CARD INJECTOR & SECTION TEMPLATES (290px)
              ========================================================================= */}
          <aside className="w-full sm:w-[260px] md:w-[290px] shrink-0 border-t sm:border-t-0 sm:border-l border-white/10 bg-surface/90 flex flex-col sm:h-full sm:min-h-0 z-20">
            {/* Header */}
            <div className="h-11 px-4 border-b border-white/10 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-400 shrink-0 bg-surface/50">
              <span className="flex items-center gap-2 text-slate-200">
                <Zap className="w-4 h-4 text-secondary" /> Card Library
              </span>
              <span className="text-[10px] text-slate-500">1-Click Inject</span>
            </div>

            {/* Injector Items */}
            <div className="flex-1 overflow-y-auto p-3.5 space-y-4 no-scrollbar">
              {/* Dynamic SVG Cards */}
              <div className="space-y-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block px-1">
                  Dynamic GitStats Cards:
                </span>
                <div className="flex flex-col gap-1.5">
                  <button
                    onClick={() =>
                      insertSnippet(
                        `<div align="center">\n  <img src="${apiBase}/api/card?type=banner&username=${safeUser}&bannerName=${safeUser}&bannerDescription=Software%20Engineer&theme=${selectedTheme}&animation=wave" alt="Banner" width="100%" />\n</div>`,
                        "Hero Banner"
                      )
                    }
                    className="flex items-center justify-between p-2 rounded-lg bg-black/40 hover:bg-white/5 border border-white/5 hover:border-white/15 text-xs text-slate-300 hover:text-white transition-all text-left group"
                  >
                    <span className="flex items-center gap-2">
                      <Layers className="w-3.5 h-3.5 text-primary" /> + Hero Banner
                    </span>
                    <Plus className="w-3 h-3 text-slate-500 group-hover:text-primary transition-colors" />
                  </button>

                  <button
                    onClick={() =>
                      insertSnippet(
                        `<img src="${apiBase}/api/card?type=stats&username=${safeUser}&theme=${selectedTheme}&animation=fadeIn" alt="GitHub Stats" />`,
                        "Stats Card"
                      )
                    }
                    className="flex items-center justify-between p-2 rounded-lg bg-black/40 hover:bg-white/5 border border-white/5 hover:border-white/15 text-xs text-slate-300 hover:text-white transition-all text-left group"
                  >
                    <span className="flex items-center gap-2">
                      <BarChart3 className="w-3.5 h-3.5 text-secondary" /> + Stats Card
                    </span>
                    <Plus className="w-3 h-3 text-slate-500 group-hover:text-secondary transition-colors" />
                  </button>

                  <button
                    onClick={() =>
                      insertSnippet(
                        `<img src="${apiBase}/api/card?type=streak&username=${safeUser}&theme=${selectedTheme}&animation=fadeIn" alt="Streak Tracker" />`,
                        "Streak Tracker"
                      )
                    }
                    className="flex items-center justify-between p-2 rounded-lg bg-black/40 hover:bg-white/5 border border-white/5 hover:border-white/15 text-xs text-slate-300 hover:text-white transition-all text-left group"
                  >
                    <span className="flex items-center gap-2">
                      <Flame className="w-3.5 h-3.5 text-amber-400" /> + Streak Tracker
                    </span>
                    <Plus className="w-3 h-3 text-slate-500 group-hover:text-amber-400 transition-colors" />
                  </button>

                  <button
                    onClick={() =>
                      insertSnippet(
                        `<img src="${apiBase}/api/card?type=languages&username=${safeUser}&theme=${selectedTheme}&animation=fadeIn" alt="Top Languages" />`,
                        "Top Languages"
                      )
                    }
                    className="flex items-center justify-between p-2 rounded-lg bg-black/40 hover:bg-white/5 border border-white/5 hover:border-white/15 text-xs text-slate-300 hover:text-white transition-all text-left group"
                  >
                    <span className="flex items-center gap-2">
                      <Code2 className="w-3.5 h-3.5 text-emerald-400" /> + Top Languages
                    </span>
                    <Plus className="w-3 h-3 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                  </button>

                  <button
                    onClick={() =>
                      insertSnippet(
                        `<div align="center">\n  <img src="${apiBase}/api/card?type=skills&skills=TypeScript,React,Node.js,Python,PostgreSQL,Docker,TailwindCSS,Linux&theme=${selectedTheme}&layout=matrix" alt="Skills Matrix" width="100%" />\n</div>`,
                        "Tech Stack Matrix"
                      )
                    }
                    className="flex items-center justify-between p-2 rounded-lg bg-black/40 hover:bg-white/5 border border-white/5 hover:border-white/15 text-xs text-slate-300 hover:text-white transition-all text-left group"
                  >
                    <span className="flex items-center gap-2">
                      <Grid3X3 className="w-3.5 h-3.5 text-primary" /> + Tech Stack Matrix
                    </span>
                    <Plus className="w-3 h-3 text-slate-500 group-hover:text-primary transition-colors" />
                  </button>

                  <button
                    onClick={() =>
                      insertSnippet(
                        `<img src="${apiBase}/api/card?type=activity&username=${safeUser}&theme=${selectedTheme}&animation=fadeIn" alt="Weekly Activity" />`,
                        "Weekly Activity"
                      )
                    }
                    className="flex items-center justify-between p-2 rounded-lg bg-black/40 hover:bg-white/5 border border-white/5 hover:border-white/15 text-xs text-slate-300 hover:text-white transition-all text-left group"
                  >
                    <span className="flex items-center gap-2">
                      <Activity className="w-3.5 h-3.5 text-sky-400" /> + Activity Graph
                    </span>
                    <Plus className="w-3 h-3 text-slate-500 group-hover:text-sky-400 transition-colors" />
                  </button>

                  <button
                    onClick={() =>
                      insertSnippet(
                        `<img src="${apiBase}/api/card?type=quote&theme=${selectedTheme}&animation=fadeIn" alt="Dev Quote" />`,
                        "Dev Quote"
                      )
                    }
                    className="flex items-center justify-between p-2 rounded-lg bg-black/40 hover:bg-white/5 border border-white/5 hover:border-white/15 text-xs text-slate-300 hover:text-white transition-all text-left group"
                  >
                    <span className="flex items-center gap-2">
                      <Quote className="w-3.5 h-3.5 text-purple-400" /> + Dev Quote
                    </span>
                    <Plus className="w-3 h-3 text-slate-500 group-hover:text-purple-400 transition-colors" />
                  </button>

                  <button
                    onClick={() =>
                      insertSnippet(
                        `<img src="${apiBase}/api/pin?username=${safeUser}&repo=portfolio&theme=${selectedTheme}" alt="Pinned Repo" />`,
                        "Pinned Repo"
                      )
                    }
                    className="flex items-center justify-between p-2 rounded-lg bg-black/40 hover:bg-white/5 border border-white/5 hover:border-white/15 text-xs text-slate-300 hover:text-white transition-all text-left group"
                  >
                    <span className="flex items-center gap-2">
                      <Bookmark className="w-3.5 h-3.5 text-pink-400" /> + Pinned Repo
                    </span>
                    <Plus className="w-3 h-3 text-slate-500 group-hover:text-pink-400 transition-colors" />
                  </button>
                </div>
              </div>

              {/* Section Blocks */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block px-1">
                  README Section Templates:
                </span>
                <div className="flex flex-col gap-1.5">
                  <button
                    onClick={() =>
                      insertSnippet(
                        `## 👨‍💻 About Me\n\n- 🔭 I’m currently working on distributed systems and AI developer tools.\n- 🌱 I’m currently learning Rust and WebGPU.\n- 💬 Ask me about TypeScript, React, and high-performance web backends.\n- 📫 How to reach me: @${username || "developer"}`,
                        "About Me Section"
                      )
                    }
                    className="flex items-center justify-between p-2 rounded-lg bg-black/40 hover:bg-white/5 border border-white/5 hover:border-white/15 text-xs text-slate-300 hover:text-white transition-all text-left group"
                  >
                    <span>+ About Me Bio</span>
                    <Plus className="w-3 h-3 text-slate-500 group-hover:text-white transition-colors" />
                  </button>

                  <button
                    onClick={() =>
                      insertSnippet(
                        `## 🌟 Featured Projects\n\n| Project | Description | Stack |\n| :--- | :--- | :--- |\n| **[Project Alpha](https://github.com/${username})** | Ultra-fast distributed key-value store | \`Rust\` \`Raft\` |\n| **[GitCanvas](https://github.com/${username})** | Dynamic SVG Profile Customizer | \`TypeScript\` \`React\` |\n| **[CloudAgent](https://github.com/${username})** | Edge-runtime autonomous AI pair programmer | \`Workers\` \`Gemini\` |`,
                        "Featured Projects Table"
                      )
                    }
                    className="flex items-center justify-between p-2 rounded-lg bg-black/40 hover:bg-white/5 border border-white/5 hover:border-white/15 text-xs text-slate-300 hover:text-white transition-all text-left group"
                  >
                    <span>+ Featured Projects Table</span>
                    <Plus className="w-3 h-3 text-slate-500 group-hover:text-white transition-colors" />
                  </button>

                  <button
                    onClick={() =>
                      insertSnippet(
                        `## 🌐 Connect & Socials\n\n<p align="left">\n  <a href="https://github.com/${username}" target="_blank">\n    <img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" />\n  </a>\n  <a href="https://linkedin.com" target="_blank">\n    <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" />\n  </a>\n  <a href="https://twitter.com" target="_blank">\n    <img src="https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white" alt="Twitter" />\n  </a>\n</p>`,
                        "Social Connect Badges"
                      )
                    }
                    className="flex items-center justify-between p-2 rounded-lg bg-black/40 hover:bg-white/5 border border-white/5 hover:border-white/15 text-xs text-slate-300 hover:text-white transition-all text-left group"
                  >
                    <span>+ Social Badges</span>
                    <Plus className="w-3 h-3 text-slate-500 group-hover:text-white transition-colors" />
                  </button>

                  <button
                    onClick={() =>
                      insertSnippet(
                        `## 🏆 GitHub Trophies\n\n<p align="center">\n  <a href="https://github.com/ryo-ma/github-profile-trophy">\n    <img src="https://github-profile-trophy.vercel.app/?username=${safeUser}&theme=monokai&no-frame=true&no-bg=true&margin-w=4" alt="GitHub Trophies" />\n  </a>\n</p>`,
                        "GitHub Trophies"
                      )
                    }
                    className="flex items-center justify-between p-2 rounded-lg bg-black/40 hover:bg-white/5 border border-white/5 hover:border-white/15 text-xs text-slate-300 hover:text-white transition-all text-left group"
                  >
                    <span>+ GitHub Trophies</span>
                    <Plus className="w-3 h-3 text-slate-500 group-hover:text-white transition-colors" />
                  </button>
                </div>
              </div>

              {/* Jump to Generator link */}
              <div className="pt-2">
                <Link
                  to="/generator"
                  className="w-full flex items-center justify-center gap-1.5 p-2 rounded-lg border border-primary/30 bg-primary/10 hover:bg-primary/20 text-xs font-semibold text-primary transition-all text-center"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Open Studio Generator
                </Link>
              </div>
            </div>
          </aside>
        </div>

        {/* Share Profile Modal */}
        <ShareModal
          isOpen={isShareOpen}
          onClose={() => setIsShareOpen(false)}
          url={`/api/card?type=banner&username=${safeUser}&theme=${selectedTheme}`}
          title={`${username || "Developer"}'s GitHub Profile`}
          username={username}
        />
      </PageTransition>
    </Layout>
  );
}
