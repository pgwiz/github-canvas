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
import { MarkerModal } from "@/components/profile/MarkerModal";
import { AttachImageModal } from "@/components/profile/AttachImageModal";
import confetti from "canvas-confetti";
import { 
  Sparkles, UploadCloud, FileText, Copy, Check, Download, 
  Eye, EyeOff, Code2, Columns, Settings2, ArrowRight, Trash2, 
  RefreshCw, CheckCircle2, UserCheck, Layers, BarChart3, 
  Flame, Grid3X3, Bookmark, Quote, Activity, Share2, 
  ChevronDown, ChevronUp, Plus, ExternalLink, Terminal, Shield, Zap,
  GripVertical, RotateCcw, ListOrdered, ArrowUpDown,
  Bold, Italic, Link as LinkIcon, Image as ImageIcon, Stamp, Compass
} from "lucide-react";

const getCardApiBase = () => {
  if (typeof window !== "undefined" && window.location.origin) {
    return window.location.origin;
  }
  return "https://github-canvas.pgwiz.cloud";
};

interface ProfileSection {
  id: string;
  type: string;
  title: string;
  iconName: string;
  content: string;
  enabled: boolean;
}

const SECTION_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  header: Sparkles,
  banner: Layers,
  about: FileText,
  skills: Grid3X3,
  stats: BarChart3,
  streak: Flame,
  languages: Code2,
  activity: Activity,
  quote: Quote,
  pin: Bookmark,
  projects: Layers,
  socials: Share2,
  trophies: Zap,
  competencies: Compass,
  custom: Code2,
};

const CARD_TEMPLATES: Record<
  string,
  {
    title: string;
    icon: React.ComponentType<{ className?: string }>;
    getContent: (username: string, theme: string, base: string) => string;
  }
> = {
  banner: {
    title: "Hero Banner",
    icon: Layers,
    getContent: (username, theme, base) => {
      const safe = encodeURIComponent(username || "developer");
      const display = username || "Developer";
      return `<div align="center">\n  <img src="${base}/api/card?type=banner&username=${safe}&bannerName=${encodeURIComponent(display)}&bannerDescription=Full-Stack%20Engineer%20%26%20Open-Source%20Craftsman&theme=${theme}&animation=wave" alt="Header Banner" width="100%" />\n</div>`;
    },
  },
  stats: {
    title: "GitHub Stats",
    icon: BarChart3,
    getContent: (username, theme, base) => {
      const safe = encodeURIComponent(username || "octocat");
      return `## 📊 GitHub Stats\n\n<p align="center">\n  <img src="${base}/api/card?type=stats&username=${safe}&theme=${theme}&animation=fadeIn" alt="GitHub Stats" height="175" />\n</p>`;
    },
  },
  streak: {
    title: "Streak Tracker",
    icon: Flame,
    getContent: (username, theme, base) => {
      const safe = encodeURIComponent(username || "octocat");
      return `## 🔥 Streak Tracker\n\n<p align="center">\n  <img src="${base}/api/card?type=streak&username=${safe}&theme=${theme}&animation=fadeIn" alt="GitHub Streak" height="175" />\n</p>`;
    },
  },
  languages: {
    title: "Top Languages",
    icon: Code2,
    getContent: (username, theme, base) => {
      const safe = encodeURIComponent(username || "octocat");
      return `## 💻 Top Languages\n\n<p align="center">\n  <img src="${base}/api/card?type=languages&username=${safe}&theme=${theme}&animation=fadeIn" alt="Top Languages" height="175" />\n</p>`;
    },
  },
  skills: {
    title: "Tech Stack Matrix",
    icon: Grid3X3,
    getContent: (_username, theme, base) => {
      return `## 🛠️ Tech Stack & Tooling\n\n<div align="center">\n  <img src="${base}/api/card?type=skills&skills=TypeScript,React,Node.js,Python,PostgreSQL,Docker,TailwindCSS,Linux&theme=${theme}&layout=matrix" alt="Tech Stack" width="100%" />\n</div>`;
    },
  },
  competencies: {
    title: "Core Competencies",
    icon: Compass,
    getContent: (username) => {
      const display = username || "developer";
      return `## CORE COMPETENCIES\n\n<table>\n  <tr>\n    <td width="50%" valign="top">\n      <a href="https://github.com/${display}?tab=repositories">\n        <img src="https://img.shields.io/badge/ENGINEERING%20EXCELLENCE-090D16?style=for-the-badge&logo=codeforces&logoColor=3B82F6" alt="Engineering Excellence" />\n      </a>\n      <br /><br />\n      <b>Systems & Architecture</b> &bull; Crafting robust, maintainable codebases that scale from MVP to enterprise.\n    </td>\n    <td width="50%" valign="top">\n      <a href="https://github.com/${display}?tab=repositories">\n        <img src="https://img.shields.io/badge/AI%20INTEGRATION-090D16?style=for-the-badge&logo=huggingface&logoColor=3B82F6" alt="AI Integration" />\n      </a>\n      <br /><br />\n      <b>Intelligent Systems</b> &bull; Implementing machine learning models in production environments with real business impact.\n    </td>\n  </tr>\n  <tr>\n    <td width="50%" valign="top">\n      <a href="https://github.com/${display}?tab=repositories">\n        <img src="https://img.shields.io/badge/CLOUD%20ARCHITECTURE-090D16?style=for-the-badge&logo=googlecloud&logoColor=3B82F6" alt="Cloud Architecture" />\n      </a>\n      <br /><br />\n      <b>Distributed Systems</b> &bull; Designing platforms that handle millions of requests with optimal resilience and throughput.\n    </td>\n    <td width="50%" valign="top">\n      <a href="https://github.com/${display}?tab=repositories">\n        <img src="https://img.shields.io/badge/DATA%20INTELLIGENCE-090D16?style=for-the-badge&logo=postgresql&logoColor=3B82F6" alt="Data Intelligence" />\n      </a>\n      <br /><br />\n      <b>Analytics & Pipelines</b> &bull; Extracting actionable insights from complex datasets to drive strategic decisions.\n    </td>\n  </tr>\n  <tr>\n    <td width="50%" valign="top">\n      <a href="https://github.com/${display}?tab=repositories">\n        <img src="https://img.shields.io/badge/DEVOPS%20CULTURE-090D16?style=for-the-badge&logo=docker&logoColor=3B82F6" alt="DevOps Culture" />\n      </a>\n      <br /><br />\n      <b>Continuous Delivery</b> &bull; Automating deployment pipelines and infrastructure for high-velocity releases.\n    </td>\n    <td width="50%" valign="top">\n      <a href="https://github.com/${display}?tab=repositories">\n        <img src="https://img.shields.io/badge/FULL--STACK%20MASTERY-090D16?style=for-the-badge&logo=typescript&logoColor=3B82F6" alt="Full-Stack Mastery" />\n      </a>\n      <br /><br />\n      <b>End-to-End Execution</b> &bull; Seamlessly bridging frontend UX with backend logic and database optimization.\n    </td>\n  </tr>\n</table>`;
    },
  },
  activity: {
    title: "Weekly Activity",
    icon: Activity,
    getContent: (username, theme, base) => {
      const safe = encodeURIComponent(username || "octocat");
      return `## 📈 Weekly Activity\n\n<p align="center">\n  <img src="${base}/api/card?type=activity&username=${safe}&theme=${theme}&animation=fadeIn" alt="Activity Sparkline" height="175" />\n</p>`;
    },
  },
  quote: {
    title: "Dev Quote",
    icon: Quote,
    getContent: (_username, theme, base) => {
      return `## 💡 Developer Wisdom\n\n<p align="center">\n  <img src="${base}/api/card?type=quote&theme=${theme}&animation=fadeIn" alt="Dev Quote" />\n</p>`;
    },
  },
  pin: {
    title: "Pinned Repo",
    icon: Bookmark,
    getContent: (username, theme, base) => {
      const safe = encodeURIComponent(username || "developer");
      return `## 📌 Featured Repository\n\n<p align="center">\n  <img src="${base}/api/pin?username=${safe}&repo=portfolio&theme=${theme}" alt="Pinned Repo" />\n</p>`;
    },
  },
  about: {
    title: "About Me",
    icon: FileText,
    getContent: (username) => {
      const display = username || "octocat";
      return `## 🚀 About Me\n\nI am a passionate software engineer focused on building robust distributed systems, modern full-stack web applications, and developer tooling. I love transforming complex ideas into clean, performant, and resilient architectures.\n\n- 🔭 **Current Focus:** Distributed edge runtimes & real-time collaborative workspaces.\n- 🌱 **Learning & Exploring:** AI-agentic coding systems, vector databases, and Rust.\n- 💬 **Ask me about:** TypeScript, React, Node.js, Cloudflare, and PostgreSQL.\n- 📫 **Connect:** [GitHub](https://github.com/${display}) • [Portfolio](https://pgwiz.cloud) • [LinkedIn](https://linkedin.com)`;
    },
  },
  projects: {
    title: "Featured Projects",
    icon: Layers,
    getContent: (username) => {
      const display = username || "developer";
      return `## 🌟 Featured Projects\n\n| Project | Description | Stack |\n| :--- | :--- | :--- |\n| **[Project Alpha](https://github.com/${display})** | Ultra-fast distributed key-value store | \`Rust\` \`Raft\` |\n| **[GitCanvas](https://github.com/${display})** | Dynamic SVG Profile Customizer | \`TypeScript\` \`React\` |\n| **[CloudAgent](https://github.com/${display})** | Edge-runtime autonomous AI pair programmer | \`Workers\` \`Gemini\` |`;
    },
  },
  socials: {
    title: "Connect & Socials",
    icon: Share2,
    getContent: (username) => {
      const display = username || "developer";
      return `## 🌐 Connect & Socials\n\n<p align="left">\n  <a href="https://github.com/${display}" target="_blank">\n    <img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" />\n  </a>\n  <a href="https://linkedin.com" target="_blank">\n    <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" />\n  </a>\n  <a href="https://twitter.com" target="_blank">\n    <img src="https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white" alt="Twitter" />\n  </a>\n</p>`;
    },
  },
  trophies: {
    title: "GitHub Trophies",
    icon: Zap,
    getContent: (username) => {
      const safe = encodeURIComponent(username || "octocat");
      return `## 🏆 GitHub Trophies\n\n<p align="center">\n  <a href="https://github.com/ryo-ma/github-profile-trophy">\n    <img src="https://github-profile-trophy.vercel.app/?username=${safe}&theme=monokai&no-frame=true&no-bg=true&margin-w=4" alt="GitHub Trophies" />\n  </a>\n</p>`;
    },
  },
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

const createDefaultSections = (
  username: string,
  theme: string,
  base: string = getCardApiBase()
): ProfileSection[] => {
  const safeUser = encodeURIComponent(username || "developer");
  const displayUser = username || "Developer";

  return [
    {
      id: "sec-header",
      type: "header",
      title: "Header Greeting",
      iconName: "header",
      content: `# Hi there, I'm ${displayUser} 👋`,
      enabled: true,
    },
    {
      id: "sec-banner",
      type: "banner",
      title: "Hero Banner",
      iconName: "banner",
      content: `<div align="center">\n  <img src="${base}/api/card?type=banner&username=${safeUser}&bannerName=${encodeURIComponent(displayUser)}&bannerDescription=Full-Stack%20Engineer%20%26%20Open-Source%20Craftsman&theme=${theme}&animation=wave" alt="Header Banner" width="100%" />\n</div>`,
      enabled: true,
    },
    {
      id: "sec-about",
      type: "about",
      title: "About Me",
      iconName: "about",
      content: `## 🚀 About Me\n\nI am a passionate software engineer focused on building robust distributed systems, modern full-stack web applications, and developer tooling. I love transforming complex ideas into clean, performant, and resilient architectures.\n\n- 🔭 **Current Focus:** Distributed edge runtimes & real-time collaborative workspaces.\n- 🌱 **Learning & Exploring:** AI-agentic coding systems, vector databases, and Rust.\n- 💬 **Ask me about:** TypeScript, React, Node.js, Cloudflare, and PostgreSQL.\n- 📫 **Connect:** [GitHub](https://github.com/${username || "octocat"}) • [Portfolio](https://pgwiz.cloud) • [LinkedIn](https://linkedin.com)`,
      enabled: true,
    },
    {
      id: "sec-skills",
      type: "skills",
      title: "Tech Stack Matrix",
      iconName: "skills",
      content: `## 🛠️ Tech Stack & Tooling\n\n<div align="center">\n  <img src="${base}/api/card?type=skills&skills=TypeScript,React,Node.js,Python,PostgreSQL,Docker,TailwindCSS,Linux&theme=${theme}&layout=matrix" alt="Tech Stack" width="100%" />\n</div>`,
      enabled: true,
    },
    {
      id: "sec-stats",
      type: "stats",
      title: "GitHub Stats",
      iconName: "stats",
      content: `## 📊 GitHub Stats\n\n<p align="center">\n  <img src="${base}/api/card?type=stats&username=${safeUser}&theme=${theme}&animation=fadeIn" alt="GitHub Stats" height="175" />\n</p>`,
      enabled: true,
    },
    {
      id: "sec-streak",
      type: "streak",
      title: "Streak Tracker",
      iconName: "streak",
      content: `## 🔥 Streak Tracker\n\n<p align="center">\n  <img src="${base}/api/card?type=streak&username=${safeUser}&theme=${theme}&animation=fadeIn" alt="GitHub Streak" height="175" />\n</p>`,
      enabled: true,
    },
    {
      id: "sec-languages",
      type: "languages",
      title: "Top Languages",
      iconName: "languages",
      content: `## 💻 Top Languages\n\n<p align="center">\n  <img src="${base}/api/card?type=languages&username=${safeUser}&theme=${theme}&animation=fadeIn" alt="Top Languages" height="175" />\n</p>`,
      enabled: true,
    },
    {
      id: "sec-activity",
      type: "activity",
      title: "Weekly Activity",
      iconName: "activity",
      content: `## 📈 Weekly Activity\n\n<p align="center">\n  <img src="${base}/api/card?type=activity&username=${safeUser}&theme=${theme}&animation=fadeIn" alt="Activity Sparkline" height="175" />\n</p>`,
      enabled: true,
    },
    {
      id: "sec-quote",
      type: "quote",
      title: "Dev Quote",
      iconName: "quote",
      content: `## 💡 Developer Wisdom\n\n<p align="center">\n  <img src="${base}/api/card?type=quote&theme=${theme}&animation=fadeIn" alt="Dev Quote" />\n</p>`,
      enabled: true,
    },
  ];
};

const compileSectionsToMarkdown = (sections: ProfileSection[]): string => {
  return (
    sections
      .filter((sec) => sec.enabled && sec.content.trim().length > 0)
      .map((sec) => sec.content.trim())
      .join("\n\n") + "\n"
  );
};

const createInitialMarkdown = (
  username: string,
  theme: string,
  base: string = getCardApiBase()
) => {
  return compileSectionsToMarkdown(createDefaultSections(username, theme, base));
};

const parseMarkdownToSections = (
  markdown: string,
  defaultUsername: string = "pgwiz",
  defaultTheme: string = "electric-blue",
  existingSections: ProfileSection[] = []
): ProfileSection[] => {
  if (!markdown || !markdown.trim()) {
    return existingSections.length > 0
      ? existingSections
      : createDefaultSections(defaultUsername, defaultTheme);
  }

  const normalized = markdown.replace(/\r\n/g, "\n").trim();
  const lines = normalized.split("\n");
  const rawBlocks: string[] = [];
  let currentLines: string[] = [];

  const isHeading = (l: string) => /^#{1,6}\s+/.test(l.trim());
  const isCenteredHtmlOpen = (l: string) =>
    /^<(?:div|p)[^>]*align=["']center["'][^>]*>/i.test(l.trim());

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (isHeading(line)) {
      if (currentLines.length > 0) {
        const text = currentLines.join("\n").trim();
        if (text) rawBlocks.push(text);
        currentLines = [];
      }
      currentLines.push(line);
      continue;
    }

    if (isCenteredHtmlOpen(line)) {
      const hasHeading = currentLines.some((l) => isHeading(l));
      const hasPreviousHtml = currentLines.some((l) => /<\/(?:div|p)>/i.test(l));
      const isGreetingHeader =
        currentLines.length > 0 &&
        currentLines.every((l) => !l.trim() || /^#\s+/.test(l.trim()));

      if (isGreetingHeader || hasPreviousHtml || (!hasHeading && currentLines.length > 0)) {
        const text = currentLines.join("\n").trim();
        if (text) rawBlocks.push(text);
        currentLines = [];
      }
    }

    currentLines.push(line);
  }

  if (currentLines.length > 0) {
    const text = currentLines.join("\n").trim();
    if (text) rawBlocks.push(text);
  }

  if (rawBlocks.length === 0) {
    return existingSections.length > 0
      ? existingSections
      : createDefaultSections(defaultUsername, defaultTheme);
  }

  const sections: ProfileSection[] = [];
  let counter = 0;
  const remainingExisting = [...existingSections];

  for (const block of rawBlocks) {
    counter++;
    let type = "custom";
    let title = "Custom Block";
    let iconName = "custom";

    if (/type=banner/i.test(block) || /alt="[^"]*banner/i.test(block)) {
      type = "banner";
      title = "Hero Banner";
      iconName = "banner";
    } else if (/type=stats/i.test(block) || /github stats/i.test(block)) {
      type = "stats";
      title = "GitHub Stats";
      iconName = "stats";
    } else if (/type=streak/i.test(block) || /streak tracker/i.test(block) || /streak/i.test(block)) {
      type = "streak";
      title = "Streak Tracker";
      iconName = "streak";
    } else if (/type=languages/i.test(block) || /top languages/i.test(block)) {
      type = "languages";
      title = "Top Languages";
      iconName = "languages";
    } else if (/type=skills/i.test(block) || /tech stack/i.test(block)) {
      type = "skills";
      title = "Tech Stack Matrix";
      iconName = "skills";
    } else if (/type=activity/i.test(block) || /weekly activity/i.test(block)) {
      type = "activity";
      title = "Weekly Activity";
      iconName = "activity";
    } else if (/type=quote/i.test(block) || /developer wisdom/i.test(block) || /dev quote/i.test(block)) {
      type = "quote";
      title = "Dev Quote";
      iconName = "quote";
    } else if (/api\/pin/i.test(block) || /pinned repo/i.test(block)) {
      type = "pin";
      title = "Pinned Repo";
      iconName = "pin";
    } else if (/github-profile-trophy/i.test(block) || /trophies/i.test(block)) {
      type = "trophies";
      title = "GitHub Trophies";
      iconName = "trophies";
    } else if (/about me/i.test(block)) {
      type = "about";
      title = "About Me";
      iconName = "about";
    } else if (/featured projects/i.test(block) || /projects/i.test(block)) {
      type = "projects";
      title = "Featured Projects";
      iconName = "projects";
    } else if (/connect/i.test(block) || /social/i.test(block)) {
      type = "socials";
      title = "Connect & Socials";
      iconName = "socials";
    } else if (/^#\s+/m.test(block)) {
      type = "header";
      title = "Header Greeting";
      iconName = "header";
    } else {
      type = "custom";
      const headingMatch = block.match(/^#{1,3}\s+(.+)$/m);
      if (headingMatch) {
        title = headingMatch[1].replace(/[#*`_]/g, "").trim();
      } else {
        title = "Custom Section";
      }
      iconName = "custom";
    }

    let matchIndex = remainingExisting.findIndex((e) => e.content.trim() === block.trim());
    if (matchIndex === -1) {
      matchIndex = remainingExisting.findIndex((e) => e.type === type);
    }

    let id = `sec-${type}-${counter}`;
    if (matchIndex !== -1) {
      const [matched] = remainingExisting.splice(matchIndex, 1);
      id = matched.id;
      if (matched.title && type === matched.type) {
        title = matched.title;
      }
    }

    sections.push({
      id,
      type,
      title,
      iconName,
      content: block,
      enabled: true,
    });
  }

  for (const hidden of remainingExisting) {
    if (!hidden.enabled) {
      sections.push(hidden);
    }
  }

  return sections;
};

export default function ProfileCustomizer() {
  const [username, setUsername] = useState("pgwiz");
  const [targetRole, setTargetRole] = useState("Full-Stack Software Engineer");
  const [tone, setTone] = useState("Modern & Impactful");
  const [portfolio, setPortfolio] = useState("");
  const [cvText, setCvText] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [selectedTheme, setSelectedTheme] = useState("electric-blue");

  const [sections, setSections] = useState<ProfileSection[]>(() =>
    createDefaultSections("pgwiz", "electric-blue")
  );
  const [generatedMarkdown, setGeneratedMarkdown] = useState<string>(() =>
    createInitialMarkdown("pgwiz", "electric-blue")
  );
  const [rightTab, setRightTab] = useState<"order" | "library">("order");
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [expandedSectionId, setExpandedSectionId] = useState<string | null>(null);
  const isManualEditRef = useRef(false);

  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<"split" | "preview" | "editor">("split");
  const [isDragging, setIsDragging] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(true);
  const [isMarkerModalOpen, setIsMarkerModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  const apiBase = getCardApiBase();
  const safeUser = encodeURIComponent(username || "developer");

  const charCount = generatedMarkdown.length;
  const wordCount = useMemo(() => {
    return generatedMarkdown.trim() ? generatedMarkdown.trim().split(/\s+/).length : 0;
  }, [generatedMarkdown]);

  const getFreshSections = (overrideMarkdown?: string): ProfileSection[] => {
    const md = overrideMarkdown !== undefined ? overrideMarkdown : generatedMarkdown;
    if (isManualEditRef.current || overrideMarkdown !== undefined) {
      const fresh = parseMarkdownToSections(md, username, selectedTheme, sections);
      isManualEditRef.current = false;
      setSections(fresh);
      return fresh;
    }
    return sections;
  };

  const selectedCards = useMemo(() => {
    return sections.filter((s) => s.enabled).map((s) => s.type);
  }, [sections]);

  // Synchronize manual text edits from editor
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    isManualEditRef.current = true;
    setGeneratedMarkdown(e.target.value);
  };

  const insertTextAtCursor = (textToInsert: string) => {
    isManualEditRef.current = true;
    const el = textareaRef.current;
    if (el) {
      const start = el.selectionStart ?? el.value.length;
      const end = el.selectionEnd ?? el.value.length;
      const before = generatedMarkdown.substring(0, start);
      const after = generatedMarkdown.substring(end);
      const updated = before + textToInsert + after;
      setGeneratedMarkdown(updated);
      setTimeout(() => {
        el.focus();
        el.setSelectionRange(start + textToInsert.length, start + textToInsert.length);
      }, 50);
    } else {
      setGeneratedMarkdown((prev) => (prev ? `${prev}\n\n${textToInsert}` : textToInsert));
    }
  };

  const wrapSelection = (prefix: string, suffix: string, defaultText = "text") => {
    isManualEditRef.current = true;
    const el = textareaRef.current;
    if (el) {
      const start = el.selectionStart ?? 0;
      const end = el.selectionEnd ?? 0;
      const selected = el.value.substring(start, end) || defaultText;
      const replacement = `${prefix}${selected}${suffix}`;
      const before = el.value.substring(0, start);
      const after = el.value.substring(end);
      const updated = before + replacement + after;
      setGeneratedMarkdown(updated);
      setTimeout(() => {
        el.focus();
        el.setSelectionRange(start + prefix.length, start + prefix.length + selected.length);
      }, 50);
    }
  };

  const renderEditorToolbar = () => (
    <div className="px-3 py-1.5 border-b border-white/10 bg-white/5 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar shrink-0">
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          type="button"
          onClick={() => setIsMarkerModalOpen(true)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 text-xs font-semibold transition-all hover:scale-[1.02] shadow-sm"
          title="Interactive Badge Marker (Logo + Title + Description + Link)"
        >
          <Stamp className="w-3.5 h-3.5" /> Badge Marker
        </button>

        <button
          type="button"
          onClick={() => setIsImageModalOpen(true)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-secondary/20 hover:bg-secondary/30 text-secondary border border-secondary/30 text-xs font-semibold transition-all hover:scale-[1.02] shadow-sm"
          title="Attach Image or Card URL with Text"
        >
          <ImageIcon className="w-3.5 h-3.5" /> Attach Image
        </button>

        <button
          type="button"
          onClick={() => {
            const snippet = CARD_TEMPLATES.competencies.getContent(username, selectedTheme, apiBase);
            insertSnippet(snippet, "Core Competencies", "competencies");
            toast({
              title: "Core Competencies Added",
              description: "Added 6-marker interactive table with 0 emojis.",
            });
          }}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-medium transition-all"
          title="Insert 2-Column Core Competencies Grid"
        >
          <Compass className="w-3.5 h-3.5 text-cyan-400" /> + Competencies
        </button>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          onClick={() => wrapSelection("**", "**", "bold text")}
          className="w-7 h-7 rounded hover:bg-white/10 text-slate-300 hover:text-white flex items-center justify-center transition-colors text-xs font-bold"
          title="Bold (**text**)"
        >
          <Bold className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => wrapSelection("*", "*", "italic text")}
          className="w-7 h-7 rounded hover:bg-white/10 text-slate-300 hover:text-white flex items-center justify-center transition-colors text-xs italic"
          title="Italic (*text*)"
        >
          <Italic className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => wrapSelection("`", "`", "code")}
          className="w-7 h-7 rounded hover:bg-white/10 text-slate-300 hover:text-white flex items-center justify-center transition-colors text-xs font-mono"
          title="Inline Code (`code`)"
        >
          <Code2 className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => wrapSelection("[", "](https://example.com)", "link text")}
          className="w-7 h-7 rounded hover:bg-white/10 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
          title="Insert Link ([text](url))"
        >
          <LinkIcon className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );

  // Reorder sections by delta (-1 for up, +1 for down)
  const moveSection = (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    const currentSections = getFreshSections();
    if (targetIndex < 0 || targetIndex >= currentSections.length) return;

    const updated = [...currentSections];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    setSections(updated);
    const newMarkdown = compileSectionsToMarkdown(updated);
    setGeneratedMarkdown(newMarkdown);

    toast({
      title: "Order Updated",
      description: `Moved "${temp.title}" ${direction === -1 ? "up" : "down"}.`,
    });
  };

  // Reorder sections via drag-and-drop
  const moveSectionToIndex = (fromIndex: number, toIndex: number) => {
    const currentSections = getFreshSections();
    if (
      fromIndex === toIndex ||
      fromIndex < 0 ||
      toIndex < 0 ||
      fromIndex >= currentSections.length ||
      toIndex >= currentSections.length
    ) {
      return;
    }

    const updated = [...currentSections];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);

    setSections(updated);
    const newMarkdown = compileSectionsToMarkdown(updated);
    setGeneratedMarkdown(newMarkdown);

    toast({
      title: "Order Updated",
      description: `Moved "${moved.title}" to position #${toIndex + 1}.`,
    });
  };

  // Toggle visibility of a section
  const toggleSectionEnabled = (id: string) => {
    const currentSections = getFreshSections();
    const updated = currentSections.map((sec) =>
      sec.id === id ? { ...sec, enabled: !sec.enabled } : sec
    );

    const toggled = updated.find((s) => s.id === id);
    setSections(updated);
    setGeneratedMarkdown(compileSectionsToMarkdown(updated));

    if (toggled) {
      toast({
        title: toggled.enabled ? "Section Enabled" : "Section Hidden",
        description: toggled.enabled
          ? `"${toggled.title}" included in generated README.`
          : `"${toggled.title}" hidden from generated README.`,
      });
    }
  };

  // Delete a section
  const deleteSection = (id: string) => {
    const currentSections = getFreshSections();
    const deleted = currentSections.find((s) => s.id === id);
    const updated = currentSections.filter((sec) => sec.id !== id);

    setSections(updated);
    setGeneratedMarkdown(compileSectionsToMarkdown(updated));

    toast({
      title: "Section Removed",
      description: deleted ? `Removed "${deleted.title}".` : "Section deleted.",
    });
  };

  // Update markdown content of a single section
  const updateSectionContent = (id: string, newContent: string) => {
    const currentSections = getFreshSections();
    const updated = currentSections.map((sec) =>
      sec.id === id ? { ...sec, content: newContent } : sec
    );
    setSections(updated);
    setGeneratedMarkdown(compileSectionsToMarkdown(updated));
  };

  // Add section from library template
  const addSectionFromTemplate = (type: string, title: string, content: string) => {
    const currentSections = getFreshSections();
    const newSection: ProfileSection = {
      id: `sec-${type}-${Date.now().toString(36)}`,
      type,
      title,
      iconName: type,
      content,
      enabled: true,
    };

    const updated = [...currentSections, newSection];
    setSections(updated);
    setGeneratedMarkdown(compileSectionsToMarkdown(updated));

    toast({
      title: `Added ${title}`,
      description: "Added to active sections. You can rearrange its position anytime.",
    });
  };

  // Reset order to default layout
  const resetToDefaultOrder = () => {
    const defaults = createDefaultSections(username, selectedTheme);
    setSections(defaults);
    setGeneratedMarkdown(compileSectionsToMarkdown(defaults));
    isManualEditRef.current = false;
    toast({
      title: "Layout Reset",
      description: "Default section order restored.",
    });
  };

  // Toggle card from left sidebar checklist
  const handleCardToggle = (cardId: string) => {
    const currentSections = getFreshSections();
    const existingIndex = currentSections.findIndex((s) => s.type === cardId);

    if (existingIndex !== -1) {
      const existing = currentSections[existingIndex];
      const updated = currentSections.map((sec) =>
        sec.id === existing.id ? { ...sec, enabled: !sec.enabled } : sec
      );
      setSections(updated);
      setGeneratedMarkdown(compileSectionsToMarkdown(updated));
      toast({
        title: !existing.enabled ? "Section Enabled" : "Section Hidden",
        description: !existing.enabled
          ? `"${existing.title}" included in generated README.`
          : `"${existing.title}" hidden from generated README.`,
      });
    } else {
      const template = CARD_TEMPLATES[cardId];
      if (template) {
        const newSection: ProfileSection = {
          id: `sec-${cardId}-${Date.now().toString(36)}`,
          type: cardId,
          title: template.title,
          iconName: cardId,
          content: template.getContent(username, selectedTheme, apiBase),
          enabled: true,
        };
        const updated = [...currentSections, newSection];
        setSections(updated);
        setGeneratedMarkdown(compileSectionsToMarkdown(updated));
        toast({
          title: `Added ${template.title}`,
          description: "Added to active sections. You can rearrange its position anytime.",
        });
      }
    }
  };

  // Update theme across all embedded SVG cards
  const handleThemeChange = (newTheme: string) => {
    setSelectedTheme(newTheme);
    const currentSections = getFreshSections();
    const updated = currentSections.map((sec) => ({
      ...sec,
      content: sec.content.replace(/theme=[a-zA-Z0-9_-]+/g, `theme=${newTheme}`),
    }));
    setSections(updated);
    setGeneratedMarkdown(compileSectionsToMarkdown(updated));
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

      const parsedSections = parseMarkdownToSections(data.markdown, username, selectedTheme);
      setSections(parsedSections);
      setGeneratedMarkdown(data.markdown);
      isManualEditRef.current = false;

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
      const fallbackSections = createDefaultSections(username.trim(), selectedTheme);
      setSections(fallbackSections);
      setGeneratedMarkdown(compileSectionsToMarkdown(fallbackSections));
      isManualEditRef.current = false;

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

  // Helper to append a snippet into the active markdown editor & active sections
  const insertSnippet = (snippet: string, title: string, type: string = "custom") => {
    addSectionFromTemplate(type, title, snippet);
  };

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
                  const initialSections = createDefaultSections("pgwiz", "electric-blue");
                  setSections(initialSections);
                  setGeneratedMarkdown(compileSectionsToMarkdown(initialSections));
                  isManualEditRef.current = false;
                  toast({ title: "Sample Reset", description: "Default profile and layout restored." });
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
                <Select value={selectedTheme} onValueChange={handleThemeChange}>
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
                <button
                  type="button"
                  onClick={() => {
                    getFreshSections();
                    setRightTab("order");
                  }}
                  className={`px-2.5 py-1 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors ${
                    rightTab === "order"
                      ? "border-primary/40 bg-primary/10 text-primary font-semibold"
                      : "border-white/10 hover:bg-white/10 text-slate-300 hover:text-white"
                  }`}
                  title="Rearrange order of cards and sections"
                >
                  <ArrowUpDown className="w-3.5 h-3.5 text-primary" />
                  <span>Rearrange Order</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/40 font-mono text-slate-300">
                    {sections.filter((s) => s.enabled).length}
                  </span>
                </button>

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
                    {renderEditorToolbar()}
                    <textarea
                      ref={textareaRef}
                      value={generatedMarkdown}
                      onChange={handleTextareaChange}
                      onBlur={() => {
                        getFreshSections();
                      }}
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
                    {renderEditorToolbar()}
                    <textarea
                      ref={textareaRef}
                      value={generatedMarkdown}
                      onChange={handleTextareaChange}
                      onBlur={() => {
                        getFreshSections();
                      }}
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
              RIGHT COLUMN: SECTIONS REORDER & CARD LIBRARY (320px)
              ========================================================================= */}
          <aside className="w-full sm:w-[280px] md:w-[320px] lg:w-[340px] shrink-0 border-t sm:border-t-0 sm:border-l border-white/10 bg-surface/90 flex flex-col sm:h-full sm:min-h-0 z-20">
            {/* Header Tabs */}
            <div className="h-11 px-3 border-b border-white/10 flex items-center justify-between bg-surface/50 shrink-0">
              <div className="flex items-center gap-1 bg-black/40 p-1 rounded-lg border border-white/10 w-full">
                <button
                  type="button"
                  onClick={() => {
                    getFreshSections();
                    setRightTab("order");
                  }}
                  className={`flex-1 py-1 px-2 rounded text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    rightTab === "order"
                      ? "bg-primary text-white shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <ListOrdered className="w-3.5 h-3.5" />
                  <span>Rearrange Order</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/40 font-mono text-white/90">
                    {sections.filter((s) => s.enabled).length}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setRightTab("library")}
                  className={`flex-1 py-1 px-2 rounded text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    rightTab === "library"
                      ? "bg-primary text-white shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Card Library</span>
                </button>
              </div>
            </div>

            {/* TAB 1: REARRANGE ORDER */}
            {rightTab === "order" && (
              <div className="flex-1 overflow-y-auto p-3 space-y-3 no-scrollbar">
                {/* Helper instruction & header actions */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 px-0.5">
                  <span className="text-slate-400 font-medium">Reorder active cards</span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={resetToDefaultOrder}
                      className="text-slate-400 hover:text-white flex items-center gap-1 transition-colors text-[10px] px-1.5 py-0.5 rounded hover:bg-white/5"
                      title="Reset to default section layout"
                    >
                      <RotateCcw className="w-2.5 h-2.5" /> Reset
                    </button>
                    <button
                      type="button"
                      onClick={() => setRightTab("library")}
                      className="text-primary hover:text-primary/80 flex items-center gap-0.5 transition-colors text-[10px] font-semibold px-1.5 py-0.5 rounded hover:bg-primary/10"
                    >
                      <Plus className="w-2.5 h-2.5" /> Add
                    </button>
                  </div>
                </div>

                {/* Section List */}
                <div className="space-y-1.5">
                  {sections.map((section, index) => {
                    const Icon = SECTION_ICONS[section.iconName] || SECTION_ICONS[section.type] || Code2;
                    const isDraggingThis = draggedIndex === index;
                    const isDropTarget = dragOverIndex === index && draggedIndex !== index;
                    const isExpanded = expandedSectionId === section.id;

                    return (
                      <div
                        key={section.id}
                        onDragOver={(e) => {
                          e.preventDefault();
                          e.dataTransfer.dropEffect = "move";
                          if (dragOverIndex !== index) {
                            setDragOverIndex(index);
                          }
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          if (draggedIndex !== null && draggedIndex !== index) {
                            moveSectionToIndex(draggedIndex, index);
                          }
                          setDraggedIndex(null);
                          setDragOverIndex(null);
                        }}
                        className={`group rounded-lg border transition-all ${
                          !section.enabled
                            ? "bg-black/20 border-white/5 opacity-60"
                            : isDraggingThis
                            ? "bg-primary/15 border-primary/50 opacity-40"
                            : isDropTarget
                            ? "bg-primary/20 border-primary ring-1 ring-primary/50 shadow-md"
                            : "bg-black/40 hover:bg-white/5 border-white/10 hover:border-white/20"
                        }`}
                      >
                        {/* Top row */}
                        <div className="flex items-center gap-1.5 p-2">
                          {/* Drag Handle */}
                          <div
                            draggable={!isExpanded}
                            onDragStart={(e) => {
                              e.dataTransfer.effectAllowed = "move";
                              e.dataTransfer.setData("text/plain", index.toString());
                              setDraggedIndex(index);
                            }}
                            onDragEnd={() => {
                              setDraggedIndex(null);
                              setDragOverIndex(null);
                            }}
                            className="cursor-grab active:cursor-grabbing p-1 -ml-0.5 text-slate-500 hover:text-primary transition-colors shrink-0 rounded hover:bg-white/5"
                            title="Drag to rearrange position"
                            aria-label="Drag handle"
                          >
                            <GripVertical className="w-3.5 h-3.5" />
                          </div>

                          {/* Order number */}
                          <span className="text-[10px] font-mono text-slate-500 w-4 shrink-0 text-center">
                            #{index + 1}
                          </span>

                          {/* Icon */}
                          <Icon className={`w-3.5 h-3.5 shrink-0 ${section.enabled ? "text-primary" : "text-slate-500"}`} />

                          {/* Title */}
                          <div className="flex-1 min-w-0">
                            <span className={`text-xs font-medium truncate block ${section.enabled ? "text-slate-200" : "text-slate-500 line-through"}`}>
                              {section.title}
                            </span>
                          </div>

                          {/* Status pill if hidden */}
                          {!section.enabled && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono shrink-0">
                              Hidden
                            </span>
                          )}

                          {/* Action Buttons */}
                          <div className="flex items-center gap-0.5 shrink-0">
                            {/* Move Up */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                moveSection(index, -1);
                              }}
                              disabled={index === 0}
                              aria-label={`Move ${section.title} up`}
                              className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-20 disabled:hover:text-slate-400 disabled:hover:bg-transparent transition-colors"
                              title="Move Up"
                            >
                              <ChevronUp className="w-3.5 h-3.5" />
                            </button>

                            {/* Move Down */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                moveSection(index, 1);
                              }}
                              disabled={index === sections.length - 1}
                              aria-label={`Move ${section.title} down`}
                              className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-20 disabled:hover:text-slate-400 disabled:hover:bg-transparent transition-colors"
                              title="Move Down"
                            >
                              <ChevronDown className="w-3.5 h-3.5" />
                            </button>

                            {/* Visibility Toggle */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleSectionEnabled(section.id);
                              }}
                              className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                              title={section.enabled ? "Hide Section" : "Show Section"}
                              aria-label={section.enabled ? `Hide ${section.title}` : `Show ${section.title}`}
                            >
                              {section.enabled ? (
                                <Eye className="w-3.5 h-3.5 text-slate-400 hover:text-primary" />
                              ) : (
                                <EyeOff className="w-3.5 h-3.5 text-amber-400" />
                              )}
                            </button>

                            {/* Expand / Edit snippet */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setExpandedSectionId(isExpanded ? null : section.id);
                              }}
                              className={`p-1 rounded transition-colors ${
                                isExpanded ? "text-primary bg-primary/10" : "text-slate-400 hover:text-white hover:bg-white/10"
                              }`}
                              title="Edit Section Content"
                              aria-label={`Edit ${section.title} snippet`}
                            >
                              <Code2 className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteSection(section.id);
                              }}
                              className="p-1 rounded text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                              title="Delete Section"
                              aria-label={`Delete ${section.title}`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Expandable Code snippet editor */}
                        {isExpanded && (
                          <div className="p-2.5 border-t border-white/10 bg-black/60">
                            <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1.5">
                              <span>Raw Markdown Snippet</span>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => setIsMarkerModalOpen(true)}
                                  className="text-primary hover:underline text-[10px] flex items-center gap-1 font-medium"
                                  title="Add Badge Marker"
                                >
                                  <Stamp className="w-2.5 h-2.5" /> + Marker
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setIsImageModalOpen(true)}
                                  className="text-secondary hover:underline text-[10px] flex items-center gap-1 font-medium"
                                  title="Attach Image"
                                >
                                  <ImageIcon className="w-2.5 h-2.5" /> + Image
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setExpandedSectionId(null)}
                                  className="text-slate-400 hover:text-white text-[10px]"
                                >
                                  Done
                                </button>
                              </div>
                            </div>
                            <textarea
                              value={section.content}
                              onChange={(e) => updateSectionContent(section.id, e.target.value)}
                              rows={5}
                              className="w-full p-2 bg-black/80 border border-white/10 rounded text-[11px] font-mono text-slate-200 resize-none focus:outline-none focus:border-primary/50 no-scrollbar leading-relaxed"
                              spellCheck={false}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Add Card Prompt */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setRightTab("library")}
                    className="w-full flex items-center justify-center gap-1.5 p-2 rounded-lg border border-dashed border-white/15 hover:border-primary/40 bg-white/5 hover:bg-primary/5 text-xs font-medium text-slate-300 hover:text-white transition-all text-center"
                  >
                    <Plus className="w-3.5 h-3.5 text-primary" /> Add Card / Section
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: CARD LIBRARY */}
            {rightTab === "library" && (
              <div className="flex-1 overflow-y-auto p-3.5 space-y-4 no-scrollbar">
                <div className="flex items-center justify-between pb-1 border-b border-white/10">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    1-Click Card Library
                  </span>
                  <button
                    type="button"
                    onClick={() => setRightTab("order")}
                    className="text-[10px] text-primary hover:underline flex items-center gap-1 font-medium"
                  >
                    <ListOrdered className="w-3 h-3" /> View Order ({sections.filter((s) => s.enabled).length})
                  </button>
                </div>

                {/* Dynamic SVG Cards */}
                <div className="space-y-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block px-1">
                    Dynamic GitStats Cards:
                  </span>
                  <div className="flex flex-col gap-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        insertSnippet(
                          CARD_TEMPLATES.banner.getContent(username, selectedTheme, apiBase),
                          "Hero Banner",
                          "banner"
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
                      type="button"
                      onClick={() =>
                        insertSnippet(
                          CARD_TEMPLATES.stats.getContent(username, selectedTheme, apiBase),
                          "GitHub Stats",
                          "stats"
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
                      type="button"
                      onClick={() =>
                        insertSnippet(
                          CARD_TEMPLATES.streak.getContent(username, selectedTheme, apiBase),
                          "Streak Tracker",
                          "streak"
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
                      type="button"
                      onClick={() =>
                        insertSnippet(
                          CARD_TEMPLATES.languages.getContent(username, selectedTheme, apiBase),
                          "Top Languages",
                          "languages"
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
                      type="button"
                      onClick={() =>
                        insertSnippet(
                          CARD_TEMPLATES.skills.getContent(username, selectedTheme, apiBase),
                          "Tech Stack Matrix",
                          "skills"
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
                      type="button"
                      onClick={() =>
                        insertSnippet(
                          CARD_TEMPLATES.activity.getContent(username, selectedTheme, apiBase),
                          "Weekly Activity",
                          "activity"
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
                      type="button"
                      onClick={() =>
                        insertSnippet(
                          CARD_TEMPLATES.quote.getContent(username, selectedTheme, apiBase),
                          "Dev Quote",
                          "quote"
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
                      type="button"
                      onClick={() =>
                        insertSnippet(
                          CARD_TEMPLATES.pin.getContent(username, selectedTheme, apiBase),
                          "Pinned Repo",
                          "pin"
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
                    README Section Templates & Builders:
                  </span>
                  <div className="flex flex-col gap-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        insertSnippet(
                          CARD_TEMPLATES.competencies.getContent(username, selectedTheme, apiBase),
                          "Core Competencies",
                          "competencies"
                        )
                      }
                      className="flex items-center justify-between p-2 rounded-lg bg-black/40 hover:bg-white/5 border border-white/5 hover:border-white/15 text-xs text-slate-300 hover:text-white transition-all text-left group"
                    >
                      <span className="flex items-center gap-2">
                        <Compass className="w-3.5 h-3.5 text-cyan-400" /> + Core Competencies (Table Grid)
                      </span>
                      <Plus className="w-3 h-3 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsMarkerModalOpen(true)}
                      className="flex items-center justify-between p-2 rounded-lg bg-primary/10 hover:bg-primary/20 border border-primary/25 hover:border-primary/40 text-xs text-primary transition-all text-left group"
                    >
                      <span className="flex items-center gap-2 font-medium">
                        <Stamp className="w-3.5 h-3.5 text-primary" /> + Badge Marker Builder
                      </span>
                      <Plus className="w-3 h-3 text-primary transition-colors" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsImageModalOpen(true)}
                      className="flex items-center justify-between p-2 rounded-lg bg-secondary/10 hover:bg-secondary/20 border border-secondary/25 hover:border-secondary/40 text-xs text-secondary transition-all text-left group"
                    >
                      <span className="flex items-center gap-2 font-medium">
                        <ImageIcon className="w-3.5 h-3.5 text-secondary" /> + Attach Visual / Image
                      </span>
                      <Plus className="w-3 h-3 text-secondary transition-colors" />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        insertSnippet(
                          CARD_TEMPLATES.about.getContent(username, selectedTheme, apiBase),
                          "About Me Bio",
                          "about"
                        )
                      }
                      className="flex items-center justify-between p-2 rounded-lg bg-black/40 hover:bg-white/5 border border-white/5 hover:border-white/15 text-xs text-slate-300 hover:text-white transition-all text-left group"
                    >
                      <span className="flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5 text-primary" /> + About Me Bio
                      </span>
                      <Plus className="w-3 h-3 text-slate-500 group-hover:text-white transition-colors" />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        insertSnippet(
                          CARD_TEMPLATES.projects.getContent(username, selectedTheme, apiBase),
                          "Featured Projects Table",
                          "projects"
                        )
                      }
                      className="flex items-center justify-between p-2 rounded-lg bg-black/40 hover:bg-white/5 border border-white/5 hover:border-white/15 text-xs text-slate-300 hover:text-white transition-all text-left group"
                    >
                      <span className="flex items-center gap-2">
                        <Layers className="w-3.5 h-3.5 text-secondary" /> + Featured Projects Table
                      </span>
                      <Plus className="w-3 h-3 text-slate-500 group-hover:text-white transition-colors" />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        insertSnippet(
                          CARD_TEMPLATES.socials.getContent(username, selectedTheme, apiBase),
                          "Social Badges",
                          "socials"
                        )
                      }
                      className="flex items-center justify-between p-2 rounded-lg bg-black/40 hover:bg-white/5 border border-white/5 hover:border-white/15 text-xs text-slate-300 hover:text-white transition-all text-left group"
                    >
                      <span className="flex items-center gap-2">
                        <Share2 className="w-3.5 h-3.5 text-sky-400" /> + Social Badges
                      </span>
                      <Plus className="w-3 h-3 text-slate-500 group-hover:text-white transition-colors" />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        insertSnippet(
                          CARD_TEMPLATES.trophies.getContent(username, selectedTheme, apiBase),
                          "GitHub Trophies",
                          "trophies"
                        )
                      }
                      className="flex items-center justify-between p-2 rounded-lg bg-black/40 hover:bg-white/5 border border-white/5 hover:border-white/15 text-xs text-slate-300 hover:text-white transition-all text-left group"
                    >
                      <span className="flex items-center gap-2">
                        <Zap className="w-3.5 h-3.5 text-amber-400" /> + GitHub Trophies
                      </span>
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
            )}
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

        {/* Interactive Badge Marker Modal */}
        <MarkerModal
          isOpen={isMarkerModalOpen}
          onClose={() => setIsMarkerModalOpen(false)}
          onInsert={(snippet) => insertTextAtCursor(`\n\n${snippet}\n\n`)}
          defaultUsername={username}
        />

        {/* Attach Image Modal */}
        <AttachImageModal
          isOpen={isImageModalOpen}
          onClose={() => setIsImageModalOpen(false)}
          onInsert={(snippet) => insertTextAtCursor(`\n\n${snippet}\n\n`)}
          defaultUsername={username}
        />
      </PageTransition>
    </Layout>
  );
}
