export interface TemplateTheme {
  id: string;
  name: string;
  category: "Modern" | "Cyber" | "Popular" | "Minimal" | "Vibrant";
  description: string;
  colors: {
    bg: string;
    primary: string;
    secondary: string;
    text: string;
    border: string;
  };
}

export const templates: TemplateTheme[] = [
  {
    id: "electric-blue",
    name: "Electric Blue",
    category: "Modern",
    description: "Deep oceanic midnight with glowing electric sapphire and cyan neon accents.",
    colors: {
      bg: "#0b1220",
      primary: "#3b82f6",
      secondary: "#06b6d4",
      text: "#f1f5f9",
      border: "#3b82f6",
    },
  },
  {
    id: "midnight",
    name: "Midnight",
    category: "Modern",
    description: "Deep obsidian backdrop with gold stars and lavender glow.",
    colors: {
      bg: "#0f0f23",
      primary: "#ffff66",
      secondary: "#9999cc",
      text: "#cccccc",
      border: "#ffff66",
    },
  },
  {
    id: "tokyo-night",
    name: "Tokyo Night",
    category: "Popular",
    description: "Inspired by the vibrant lights of downtown Tokyo under the night sky.",
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
    category: "Popular",
    description: "The classic dark theme with gothic purples, pinks, and cyans.",
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
    category: "Minimal",
    description: "Official GitHub dark canvas styling with refined slate blues and borders.",
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
    category: "Modern",
    description: "Calm abyssal teal with luminous seafoam green highlights.",
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
    category: "Vibrant",
    description: "Warm crimson coral and twilight yellow gradients over velvet evening.",
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
    category: "Minimal",
    description: "Earthy moss greens and natural sage tones for a balanced organic aesthetic.",
    colors: {
      bg: "#1e2a1e",
      primary: "#7cb342",
      secondary: "#aed581",
      text: "#e8f5e9",
      border: "#7cb342",
    },
  },
  {
    id: "cyberpunk",
    name: "Cyberpunk",
    category: "Cyber",
    description: "High-contrast magenta and laser cyan cutting through deep shadows.",
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
    category: "Minimal",
    description: "Arctic, north-bluish palette created for clean, focused developer environments.",
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
    category: "Vibrant",
    description: "Beloved high-contrast code palette with electric yellow-green and ruby pink.",
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
    category: "Minimal",
    description: "Warm retro groove with vintage amber, turquoise, and aged parchment text.",
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
    category: "Minimal",
    description: "Scientifically engineered color contrasts with deep teal and solar yellow.",
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
    category: "Popular",
    description: "Soothing pastel tones of mocha, lavender, and pink for comfortable viewing.",
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
    category: "Cyber",
    description: "Northern lights celestial cyan and ultraviolet pulses across obsidian.",
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
    category: "Cyber",
    description: "Iconic terminal monochrome green cascading down deep pitch darkness.",
    colors: {
      bg: "#000000",
      primary: "#00ff00",
      secondary: "#00aa00",
      text: "#00ff00",
      border: "#00ff00",
    },
  },
  {
    id: "neon",
    name: "Neon",
    category: "Cyber",
    description: "Cybernetic high-voltage green and laser cyan highlights.",
    colors: {
      bg: "#0d1117",
      primary: "#0CF709",
      secondary: "#00e1ff",
      text: "#c9d1d9",
      border: "#0CF709",
    },
  },
];
