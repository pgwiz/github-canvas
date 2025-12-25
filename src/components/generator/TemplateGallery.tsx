import { cn } from "@/lib/utils";

interface TemplateGalleryProps {
  selectedTheme: string;
  onSelectTheme: (theme: string) => void;
}

const templates = [
  {
    id: "neon",
    name: "Neon",
    colors: {
      bg: "#0d1117",
      primary: "#0CF709",
      secondary: "#00e1ff",
      text: "#c9d1d9",
      border: "#0CF709",
    },
  },
  {
    id: "tokyo-night",
    name: "Tokyo Night",
    colors: {
      bg: "#1a1b26",
      primary: "#7aa2f7",
      secondary: "#bb9af7",
      text: "#c0caf5",
      border: "#7aa2f7",
    },
  },
  {
    id: "dracula",
    name: "Dracula",
    colors: {
      bg: "#282a36",
      primary: "#ff79c6",
      secondary: "#bd93f9",
      text: "#f8f8f2",
      border: "#ff79c6",
    },
  },
  {
    id: "github-dark",
    name: "GitHub Dark",
    colors: {
      bg: "#0d1117",
      primary: "#58a6ff",
      secondary: "#8b949e",
      text: "#c9d1d9",
      border: "#30363d",
    },
  },
  {
    id: "ocean",
    name: "Ocean",
    colors: {
      bg: "#0a192f",
      primary: "#64ffda",
      secondary: "#8892b0",
      text: "#ccd6f6",
      border: "#64ffda",
    },
  },
  {
    id: "sunset",
    name: "Sunset",
    colors: {
      bg: "#1a1a2e",
      primary: "#ff6b6b",
      secondary: "#ffd93d",
      text: "#f0f0f0",
      border: "#ff6b6b",
    },
  },
  {
    id: "forest",
    name: "Forest",
    colors: {
      bg: "#1e2a1e",
      primary: "#7cb342",
      secondary: "#aed581",
      text: "#e8f5e9",
      border: "#7cb342",
    },
  },
  {
    id: "midnight",
    name: "Midnight",
    colors: {
      bg: "#0f0f23",
      primary: "#ffff66",
      secondary: "#9999cc",
      text: "#cccccc",
      border: "#ffff66",
    },
  },
  // New themes
  {
    id: "cyberpunk",
    name: "Cyberpunk",
    colors: {
      bg: "#0a0a0f",
      primary: "#f706cf",
      secondary: "#00f0ff",
      text: "#ffffff",
      border: "#f706cf",
    },
  },
  {
    id: "nord",
    name: "Nord",
    colors: {
      bg: "#2e3440",
      primary: "#88c0d0",
      secondary: "#81a1c1",
      text: "#eceff4",
      border: "#4c566a",
    },
  },
  {
    id: "monokai",
    name: "Monokai",
    colors: {
      bg: "#272822",
      primary: "#a6e22e",
      secondary: "#f92672",
      text: "#f8f8f2",
      border: "#a6e22e",
    },
  },
  {
    id: "gruvbox",
    name: "Gruvbox",
    colors: {
      bg: "#282828",
      primary: "#fabd2f",
      secondary: "#83a598",
      text: "#ebdbb2",
      border: "#fabd2f",
    },
  },
  {
    id: "solarized",
    name: "Solarized",
    colors: {
      bg: "#002b36",
      primary: "#b58900",
      secondary: "#268bd2",
      text: "#839496",
      border: "#b58900",
    },
  },
  {
    id: "catppuccin",
    name: "Catppuccin",
    colors: {
      bg: "#1e1e2e",
      primary: "#cba6f7",
      secondary: "#f5c2e7",
      text: "#cdd6f4",
      border: "#cba6f7",
    },
  },
  {
    id: "aurora",
    name: "Aurora",
    colors: {
      bg: "#0b0d17",
      primary: "#00d9ff",
      secondary: "#ff6bcb",
      text: "#e0e0e0",
      border: "#00d9ff",
    },
  },
  {
    id: "matrix",
    name: "Matrix",
    colors: {
      bg: "#000000",
      primary: "#00ff00",
      secondary: "#00aa00",
      text: "#00ff00",
      border: "#00ff00",
    },
  },
];

export function TemplateGallery({ selectedTheme, onSelectTheme }: TemplateGalleryProps) {
  return (
    <div className="relative rounded-lg overflow-hidden">
      {/* Inner frosted glass panel */}
      <div className="absolute inset-0 bg-gradient-to-br from-chart-3/5 to-transparent backdrop-blur-sm" />
      <div className="relative p-3 rounded-lg border border-chart-3/10 bg-background/15 shadow-[inset_0_1px_1px_rgba(255,255,255,0.03)]">
        <div className="grid grid-cols-4 gap-3 max-h-64 overflow-y-auto pr-2">
          {templates.map((template) => (
            <button
              key={template.id}
              onClick={() => onSelectTheme(template.id)}
              className={cn(
                "relative p-3 rounded-lg border transition-all hover:scale-105",
                selectedTheme === template.id
                  ? "border-primary/60 shadow-[0_0_20px_-4px_hsl(var(--primary)/0.4)]"
                  : "border-border/20 hover:border-border/40 bg-background/20 backdrop-blur-sm"
              )}
              style={{ backgroundColor: `${template.colors.bg}cc` }}
            >
              <div className="flex gap-1 mb-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: template.colors.primary }}
                />
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: template.colors.secondary }}
                />
              </div>
              <span 
                className="text-xs font-medium"
                style={{ color: template.colors.text }}
              >
                {template.name}
              </span>
              {selectedTheme === template.id && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-primary-foreground text-xs">✓</span>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export { templates };
