import { useState, useEffect } from "react";
import { 
  X, Check, Copy, ExternalLink, Share2, Twitter, 
  Linkedin, MessageCircle, Send, Globe, Code, FileText 
} from "lucide-react";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  title?: string;
  username?: string;
}

export function ShareModal({ isOpen, onClose, url, title = "GitHub Card", username = "developer" }: ShareModalProps) {
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

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

  const fullUrl = url.startsWith("http")
    ? url
    : typeof window !== "undefined"
    ? `${window.location.origin}${url}`
    : `https://github-canvas.pgwiz.cloud${url}`;

  const markdownSnippet = `![${title}](${fullUrl})`;
  const htmlSnippet = `<img src="${fullUrl}" alt="${title}" />`;
  const linkedBadge = `[![${title}](${fullUrl})](https://github.com/${username})`;

  const copyToClipboard = (text: string, formatId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFormat(formatId);
    setTimeout(() => {
      setCopiedFormat((current) => (current === formatId ? null : current));
    }, 2000);
  };

  const shareText = encodeURIComponent(`Check out my dynamic GitHub profile card generated with GitHub Canvas!`);
  const encodedUrl = encodeURIComponent(fullUrl);

  const socialShares = [
    {
      name: "X (Twitter)",
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?text=${shareText}&url=${encodedUrl}`,
      color: "hover:bg-slate-800 text-sky-400",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      color: "hover:bg-blue-950 text-blue-400",
    },
    {
      name: "Reddit",
      icon: Globe,
      url: `https://reddit.com/submit?url=${encodedUrl}&title=${shareText}`,
      color: "hover:bg-orange-950 text-orange-400",
    },
    {
      name: "WhatsApp",
      icon: MessageCircle,
      url: `https://api.whatsapp.com/send?text=${shareText}%20${encodedUrl}`,
      color: "hover:bg-emerald-950 text-emerald-400",
    },
    {
      name: "Telegram",
      icon: Send,
      url: `https://t.me/share/url?url=${encodedUrl}&text=${shareText}`,
      color: "hover:bg-sky-950 text-sky-300",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-xl bg-surface border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between shrink-0 bg-surface/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center text-primary">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Share & Embed Card</h3>
              <p className="text-[11px] text-slate-400">Copy links or share directly to your profile and socials</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto no-scrollbar">
          {/* Direct Card URL */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-primary" /> Direct SVG Card URL
              </span>
              <a
                href={fullUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-primary hover:underline flex items-center gap-1"
              >
                Open in tab <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={fullUrl}
                onClick={(e) => (e.target as HTMLInputElement).select()}
                className="flex-1 bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-primary/50 overflow-hidden text-ellipsis whitespace-nowrap cursor-pointer selection:bg-primary/30"
              />
              <button
                onClick={() => copyToClipboard(fullUrl, "url")}
                className="px-3.5 py-2 rounded-lg bg-primary/20 hover:bg-primary/30 border border-primary/40 text-primary text-xs font-medium transition-colors shrink-0 flex items-center gap-1.5"
              >
                {copiedFormat === "url" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedFormat === "url" ? "Copied" : "Copy"}
              </button>
            </div>
          </div>

          {/* GitHub Markdown Embed */}
          <div className="space-y-1.5">
            <span className="font-semibold text-xs text-slate-300 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-secondary" /> Markdown (For README.md)
            </span>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={markdownSnippet}
                onClick={(e) => (e.target as HTMLInputElement).select()}
                className="flex-1 bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-primary/50 overflow-hidden text-ellipsis whitespace-nowrap cursor-pointer selection:bg-primary/30"
              />
              <button
                onClick={() => copyToClipboard(markdownSnippet, "md")}
                className="px-3.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-medium transition-colors shrink-0 flex items-center gap-1.5"
              >
                {copiedFormat === "md" ? <Check className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedFormat === "md" ? "Copied" : "Copy"}
              </button>
            </div>
          </div>

          {/* HTML Embed */}
          <div className="space-y-1.5">
            <span className="font-semibold text-xs text-slate-300 flex items-center gap-1.5">
              <Code className="w-3.5 h-3.5 text-accent" /> HTML Tag
            </span>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={htmlSnippet}
                onClick={(e) => (e.target as HTMLInputElement).select()}
                className="flex-1 bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-primary/50 overflow-hidden text-ellipsis whitespace-nowrap cursor-pointer selection:bg-primary/30"
              />
              <button
                onClick={() => copyToClipboard(htmlSnippet, "html")}
                className="px-3.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-medium transition-colors shrink-0 flex items-center gap-1.5"
              >
                {copiedFormat === "html" ? <Check className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedFormat === "html" ? "Copied" : "Copy"}
              </button>
            </div>
          </div>

          {/* Linked Badge (Clickable to User's GitHub profile) */}
          <div className="space-y-1.5">
            <span className="font-semibold text-xs text-slate-300 flex items-center gap-1.5">
              <Share2 className="w-3.5 h-3.5 text-slate-400" /> Clickable Badge (Redirects to GitHub)
            </span>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={linkedBadge}
                onClick={(e) => (e.target as HTMLInputElement).select()}
                className="flex-1 bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-primary/50 overflow-hidden text-ellipsis whitespace-nowrap cursor-pointer selection:bg-primary/30"
              />
              <button
                onClick={() => copyToClipboard(linkedBadge, "badge")}
                className="px-3.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-medium transition-colors shrink-0 flex items-center gap-1.5"
              >
                {copiedFormat === "badge" ? <Check className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedFormat === "badge" ? "Copied" : "Copy"}
              </button>
            </div>
          </div>

          {/* Direct Social Share Buttons */}
          <div className="pt-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2.5">
              Instant Social Share:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {socialShares.map((s) => {
                const Icon = s.icon;
                return (
                  <a
                    key={s.name}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-center gap-1.5 p-2 rounded-lg bg-black/40 border border-white/10 text-xs font-medium transition-all ${s.color}`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{s.name.split(" ")[0]}</span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-black/40 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-xs font-medium text-white transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
