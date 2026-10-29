import { useState, useEffect } from "react";
import { X, Image as ImageIcon, Copy, Check, Plus, ExternalLink, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AttachImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (snippet: string) => void;
  defaultUsername?: string;
}

export function AttachImageModal({ isOpen, onClose, onInsert, defaultUsername = "pgwiz" }: AttachImageModalProps) {
  const [url, setUrl] = useState("");
  const [alt, setAlt] = useState("Project Visual");
  const [link, setLink] = useState(`https://github.com/${defaultUsername}`);
  const [align, setAlign] = useState<"center" | "left" | "right">("center");
  const [width, setWidth] = useState("100%");
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

  const buildSnippet = () => {
    const cleanUrl = url.trim();
    if (!cleanUrl) return "";

    if (align === "center") {
      return `<div align="center">\n  ${link.trim() ? `<a href="${link.trim()}">\n    ` : ""}<img src="${cleanUrl}" alt="${alt.trim()}" ${width ? `width="${width}"` : ""} />${link.trim() ? `\n  </a>` : ""}\n</div>`;
    }

    if (link.trim()) {
      return `[![${alt.trim()}](${cleanUrl})](${link.trim()})`;
    }

    return `![${alt.trim()}](${cleanUrl})`;
  };

  const handleInsert = () => {
    if (!url.trim()) {
      toast({
        title: "Image URL required",
        description: "Please enter an image or SVG link.",
        variant: "destructive",
      });
      return;
    }
    const snippet = buildSnippet();
    onInsert(snippet);
    onClose();
    toast({
      title: "Image Attached",
      description: "Inserted image with formatted markup.",
    });
  };

  const handleCopy = () => {
    const snippet = buildSnippet();
    if (!snippet) return;
    navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Copied to Clipboard",
      description: "Image snippet copied successfully.",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-surface border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between shrink-0 bg-surface/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-secondary/20 border border-secondary/30 flex items-center justify-center text-secondary">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Attach Image / Visual</h3>
              <p className="text-[11px] text-slate-400">Embed SVG cards, banners, diagrams, or hosted images</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto no-scrollbar">
          {/* URL Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-primary" /> Image or Card URL
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://github-canvas.pgwiz.cloud/api/card?..."
              className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-secondary/50 font-mono"
            />
          </div>

          {/* Quick presets */}
          <div className="space-y-1.5">
            <span className="text-[10px] text-slate-400">Sample Card Shortcuts:</span>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setUrl(`https://github-canvas.pgwiz.cloud/api/card?type=skills&username=${defaultUsername}&theme=electric-blue&bg=transparent&radius=3&strokeWidth=0`)}
                className="text-[10px] px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300"
              >
                Tech Stack Card
              </button>
              <button
                type="button"
                onClick={() => setUrl(`https://github-canvas.pgwiz.cloud/api/card?type=stats&username=${defaultUsername}&theme=electric-blue&bg=transparent&radius=3&strokeWidth=0`)}
                className="text-[10px] px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300"
              >
                GitHub Stats Card
              </button>
              <button
                type="button"
                onClick={() => setUrl(`https://github-canvas.pgwiz.cloud/api/card?type=streak&username=${defaultUsername}&theme=electric-blue&bg=transparent&radius=3&strokeWidth=0`)}
                className="text-[10px] px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300"
              >
                Streak Card
              </button>
            </div>
          </div>

          {/* Alt text */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Alt Text (Accessibility Description)</label>
            <input
              type="text"
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              placeholder="e.g. Project Architecture Diagram"
              className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-secondary/50"
            />
          </div>

          {/* Link URL */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <ExternalLink className="w-3.5 h-3.5 text-secondary" /> Clickable Link (Optional)
            </label>
            <input
              type="text"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://github.com/..."
              className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-secondary/50 font-mono"
            />
          </div>

          {/* Alignment & Width */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Alignment</label>
              <select
                value={align}
                onChange={(e) => setAlign(e.target.value as "center" | "left" | "right")}
                className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-secondary/50"
              >
                <option value="center">Center (&lt;div align="center"&gt;)</option>
                <option value="left">Left Aligned</option>
                <option value="right">Right Aligned</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Width (e.g. 100%, 450)</label>
              <input
                type="text"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                placeholder="100%"
                className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-secondary/50 font-mono"
              />
            </div>
          </div>

          {/* Live Preview */}
          {url.trim() && (
            <div className="p-3 bg-black/60 rounded-xl border border-white/10 space-y-1.5">
              <span className="text-[10px] text-slate-400 font-mono block">Image Preview:</span>
              <div className="flex items-center justify-center p-2 bg-surface/50 rounded-lg border border-white/5 overflow-hidden max-h-36">
                <img
                  src={url.trim()}
                  alt={alt}
                  className="max-h-32 object-contain rounded"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
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
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-secondary hover:bg-secondary/90 text-xs font-semibold text-slate-950 shadow-lg shadow-secondary/25 transition-all"
            >
              <Plus className="w-3.5 h-3.5" /> Attach Image
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
