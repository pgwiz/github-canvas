import { useState, useEffect } from "react";
import { X, Sparkles, Copy, Check, Plus, ExternalLink, Compass } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MarkerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (snippet: string) => void;
  defaultUsername?: string;
}

const PRESET_LOGOS = [
  { name: "Codeforces", slug: "codeforces" },
  { name: "Hugging Face", slug: "huggingface" },
  { name: "Google Cloud", slug: "googlecloud" },
  { name: "AWS", slug: "amazonaws" },
  { name: "Docker", slug: "docker" },
  { name: "TypeScript", slug: "typescript" },
  { name: "Python", slug: "python" },
  { name: "FastAPI", slug: "fastapi" },
  { name: "PostgreSQL", slug: "postgresql" },
  { name: "React", slug: "react" },
  { name: "Node.js", slug: "nodedotjs" },
  { name: "Rust", slug: "rust" },
  { name: "Linux", slug: "linux" },
  { name: "GitHub", slug: "github" },
  { name: "Kubernetes", slug: "kubernetes" },
  { name: "Redis", slug: "redis" },
  { name: "MongoDB", slug: "mongodb" },
  { name: "C#", slug: "csharp" },
  { name: "PHP", slug: "php" },
];

const PRESET_TEMPLATES = [
  {
    label: "ENGINEERING EXCELLENCE",
    logo: "codeforces",
    title: "Systems & Architecture",
    desc: "Crafting robust, maintainable codebases that scale from MVP to enterprise.",
  },
  {
    label: "AI INTEGRATION",
    logo: "huggingface",
    title: "Intelligent Systems",
    desc: "Implementing machine learning models in production environments with real business impact.",
  },
  {
    label: "CLOUD ARCHITECTURE",
    logo: "googlecloud",
    title: "Distributed Systems",
    desc: "Designing platforms that handle millions of requests with optimal resilience and throughput.",
  },
  {
    label: "DATA INTELLIGENCE",
    logo: "postgresql",
    title: "Analytics & Pipelines",
    desc: "Extracting actionable insights from complex datasets to drive strategic decisions.",
  },
  {
    label: "DEVOPS CULTURE",
    logo: "docker",
    title: "Continuous Delivery",
    desc: "Automating deployment pipelines and infrastructure for high-velocity releases.",
  },
  {
    label: "FULL-STACK MASTERY",
    logo: "typescript",
    title: "End-to-End Execution",
    desc: "Seamlessly bridging frontend UX with backend logic and database optimization.",
  },
  {
    label: "API ARCHITECTURE",
    logo: "fastapi",
    title: "High-Throughput APIs",
    desc: "Designing resilient RESTful & GraphQL interfaces with comprehensive telemetry.",
  },
  {
    label: "REAL-TIME SYSTEMS",
    logo: "redis",
    title: "Low-Latency Caching",
    desc: "Building real-time pub/sub synchronization and distributed cache layers.",
  },
];

export function MarkerModal({ isOpen, onClose, onInsert, defaultUsername = "pgwiz" }: MarkerModalProps) {
  const [label, setLabel] = useState("ENGINEERING EXCELLENCE");
  const [logo, setLogo] = useState("codeforces");
  const [bg, setBg] = useState("090D16");
  const [color, setColor] = useState("3B82F6");
  const [style, setStyle] = useState<"for-the-badge" | "flat-square" | "flat" | "plastic">("for-the-badge");
  const [title, setTitle] = useState("Systems & Architecture");
  const [desc, setDesc] = useState("Crafting robust, maintainable codebases that scale from MVP to enterprise.");
  const [linkUrl, setLinkUrl] = useState(`https://github.com/${defaultUsername}?tab=repositories`);
  const [format, setFormat] = useState<"table-cell" | "standalone" | "markdown">("table-cell");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const safeLogo = encodeURIComponent(logo.trim());
  const safeLabel = encodeURIComponent(label.trim());
  const badgeUrl = `https://img.shields.io/badge/${safeLabel}-${bg}?style=${style}&logo=${safeLogo}&logoColor=${color}`;
  const targetLink = linkUrl.trim() || `https://github.com/${defaultUsername}`;

  const buildSnippet = () => {
    if (format === "table-cell") {
      return `<td width="50%" valign="top">\n  <a href="${targetLink}">\n    <img src="${badgeUrl}" alt="${label}" />\n  </a>\n  <br /><br />\n  <b>${title}</b> &bull; ${desc}\n</td>`;
    }

    if (format === "standalone") {
      return `<p align="left">\n  <a href="${targetLink}">\n    <img src="${badgeUrl}" alt="${label}" />\n  </a>\n  <br /><br />\n  <b>${title}</b> &bull; ${desc}\n</p>`;
    }

    // Markdown inline format
    return `[![${label}](${badgeUrl})](${targetLink})\n\n**${title}** &bull; ${desc}`;
  };

  const handleApplyTemplate = (tpl: typeof PRESET_TEMPLATES[0]) => {
    setLabel(tpl.label);
    setLogo(tpl.logo);
    setTitle(tpl.title);
    setDesc(tpl.desc);
  };

  const handleInsert = () => {
    const snippet = buildSnippet();
    onInsert(snippet);
    onClose();
    toast({
      title: "Badge Marker Inserted",
      description: `Added "${label}" to your README.`,
    });
  };

  const handleCopy = () => {
    const snippet = buildSnippet();
    navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Copied to Clipboard",
      description: "Marker snippet copied successfully.",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl bg-surface border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100 max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between shrink-0 bg-surface/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center text-primary">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Interactive Marker & Badge Editor</h3>
              <p className="text-[11px] text-slate-400">Design icon badge markers with formatted text and links</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 space-y-5 overflow-y-auto no-scrollbar">
          {/* Quick Preset Templates */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-primary" /> Preset Competency Templates
            </label>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_TEMPLATES.map((tpl) => (
                <button
                  key={tpl.label}
                  type="button"
                  onClick={() => handleApplyTemplate(tpl)}
                  className={`text-[11px] px-2.5 py-1 rounded-md border transition-all ${
                    label === tpl.label
                      ? "bg-primary/20 border-primary/50 text-white font-medium"
                      : "bg-white/5 border-white/10 text-slate-400 hover:text-slate-200 hover:bg-white/10"
                  }`}
                >
                  {tpl.title}
                </button>
              ))}
            </div>
          </div>

          {/* Live Preview Box */}
          <div className="p-4 rounded-xl border border-primary/20 bg-black/60 space-y-2">
            <span className="text-[10px] font-mono text-primary uppercase tracking-wider block">Live GitHub Render Preview:</span>
            <div className="p-3 bg-surface/80 rounded-lg border border-white/5">
              <a href={targetLink} target="_blank" rel="noreferrer" className="inline-block group">
                <img src={badgeUrl} alt={label} className="rounded shadow-sm group-hover:opacity-90 transition-opacity" />
              </a>
              <div className="mt-2 text-xs text-slate-200 leading-relaxed">
                <b className="text-white">{title}</b> &bull; {desc}
              </div>
            </div>
          </div>

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Badge Label */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Badge Label (Upper Text)</label>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="e.g. ENGINEERING EXCELLENCE"
                className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-primary/50 font-mono"
              />
            </div>

            {/* Logo Slug */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Brand Logo (Simple Icons slug)</label>
              <input
                type="text"
                value={logo}
                onChange={(e) => setLogo(e.target.value.toLowerCase().replace(/\s+/g, ""))}
                placeholder="e.g. codeforces, docker, react"
                className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-primary/50 font-mono"
              />
            </div>

            {/* Quick Logo Selector */}
            <div className="sm:col-span-2 space-y-1.5">
              <span className="text-[10px] text-slate-400">Quick Logo Select:</span>
              <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto no-scrollbar p-1 rounded-lg bg-black/30 border border-white/5">
                {PRESET_LOGOS.map((item) => (
                  <button
                    key={item.slug}
                    type="button"
                    onClick={() => setLogo(item.slug)}
                    className={`text-[10px] px-2 py-0.5 rounded border ${
                      logo === item.slug
                        ? "bg-primary/20 border-primary text-primary font-semibold"
                        : "bg-white/5 border-white/5 text-slate-400 hover:text-white"
                    }`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Subtitle / Domain Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Domain / Subtitle</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Systems & Architecture"
                className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-primary/50"
              />
            </div>

            {/* Target Link */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Clickable Link URL</label>
              <input
                type="text"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://github.com/..."
                className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-primary/50 font-mono"
              />
            </div>

            {/* Description Text */}
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Competency Description</label>
              <textarea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                rows={2}
                placeholder="Crafting robust, maintainable codebases..."
                className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-primary/50 resize-none leading-relaxed"
              />
            </div>

            {/* Badge Style */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Badge Style</label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value as "for-the-badge" | "flat-square" | "flat" | "plastic")}
                className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-primary/50"
              >
                <option value="for-the-badge">for-the-badge (Modern Wide)</option>
                <option value="flat-square">flat-square (Crisp Edge)</option>
                <option value="flat">flat (Rounded Clean)</option>
                <option value="plastic">plastic (Embossed)</option>
              </select>
            </div>

            {/* Output Format */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Insertion Format</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as "table-cell" | "standalone" | "markdown")}
                className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-primary/50"
              >
                <option value="table-cell">Table Cell (&lt;td width="50%"&gt; for 2-column grid)</option>
                <option value="standalone">Standalone HTML Block (&lt;p&gt;)</option>
                <option value="markdown">Inline Markdown ([![...](...)])</option>
              </select>
            </div>

            {/* Background & Accent Color */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Badge Background Hex</label>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-400">#</span>
                <input
                  type="text"
                  value={bg}
                  onChange={(e) => setBg(e.target.value.replace(/#/g, ""))}
                  className="flex-1 px-3 py-1.5 bg-black/50 border border-white/10 rounded-lg text-xs text-slate-100 font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Logo & Text Accent Hex</label>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-400">#</span>
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value.replace(/#/g, ""))}
                  className="flex-1 px-3 py-1.5 bg-black/50 border border-white/10 rounded-lg text-xs text-slate-100 font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="px-5 py-3 border-t border-white/10 bg-surface/80 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-slate-300 hover:text-white transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copied" : "Copy Snippet"}
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium text-slate-300 hover:text-white transition-all"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleInsert}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-xs font-semibold text-white shadow-lg shadow-primary/25 transition-all"
            >
              <Plus className="w-3.5 h-3.5" /> Insert Marker
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
