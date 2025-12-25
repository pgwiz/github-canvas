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
];

export function TemplateGallery({ selectedTheme, onSelectTheme }: TemplateGalleryProps) {
  return (
    <div className="grid grid-cols-4 gap-3">
      {templates.map((template) => (
        <button
          key={template.id}
          onClick={() => onSelectTheme(template.id)}
          className={cn(
            "relative p-3 rounded-lg border-2 transition-all hover:scale-105",
            selectedTheme === template.id
              ? "border-primary shadow-glow"
              : "border-border hover:border-primary/50"
          )}
          style={{ backgroundColor: template.colors.bg }}
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
  );
}

export { templates };
