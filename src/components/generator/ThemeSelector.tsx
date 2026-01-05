import { cn } from "@/lib/utils";
import { templates } from "@/components/generator/TemplateGallery";
import { Check } from "lucide-react";
import { GlassPanel } from "@/components/ui/GlassPanel";

interface ThemeSelectorProps {
  selectedTheme: string;
  onSelectTheme: (theme: string) => void;
}

export function ThemeSelector({ selectedTheme, onSelectTheme }: ThemeSelectorProps) {
  return (
    <GlassPanel accent="purple" className="relative">
      <div className="mb-4 flex items-center justify-between">
        <label className="text-lg font-semibold block">Choose a Theme</label>
        <span className="text-xs text-muted-foreground bg-white/5 px-2 py-1 rounded-full border border-white/10">
          {templates.length} presets
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
        {templates.map((template) => {
          const isSelected = selectedTheme === template.id;

          return (
            <button
              key={template.id}
              onClick={() => onSelectTheme(template.id)}
              className={cn(
                "group relative flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-300 border text-left",
                isSelected
                  ? "bg-white/10 border-primary/50 shadow-[0_0_15px_-3px_rgba(var(--primary),0.3)] scale-[1.02]"
                  : "bg-black/20 border-white/5 hover:bg-white/5 hover:border-white/20 hover:scale-[1.02]"
              )}
            >
              {/* Color Preview Swatches */}
              <div className="flex gap-1.5 w-full justify-center py-2 bg-black/40 rounded-lg mb-1 border border-white/5 group-hover:border-white/10 transition-colors">
                <div
                  className="w-4 h-4 rounded-full shadow-sm ring-1 ring-white/10"
                  style={{ backgroundColor: template.colors.primary }}
                />
                <div
                  className="w-4 h-4 rounded-full shadow-sm ring-1 ring-white/10"
                  style={{ backgroundColor: template.colors.secondary }}
                />
                <div
                  className="w-4 h-4 rounded-full shadow-sm ring-1 ring-white/10"
                  style={{ backgroundColor: template.colors.bg }}
                />
              </div>

              <span
                className={cn(
                  "text-xs font-medium w-full text-center truncate px-1",
                  isSelected ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                )}
              >
                {template.name}
              </span>

              {/* Selection Checkmark */}
              {isSelected && (
                <div className="absolute top-2 right-2 w-4 h-4 bg-primary rounded-full flex items-center justify-center animate-in zoom-in duration-300">
                  <Check className="w-2.5 h-2.5 text-primary-foreground stroke-[3]" />
                </div>
              )}

              {/* Hover Glow Effect */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </button>
          );
        })}
      </div>

      {/* Selected Theme Detail Preview */}
      <div className="mt-4 pt-4 border-t border-white/10">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="font-medium">Selected:</span>
          <span className="text-foreground bg-white/5 px-2 py-0.5 rounded border border-white/10">
             {templates.find(t => t.id === selectedTheme)?.name || selectedTheme}
          </span>
        </div>
      </div>
    </GlassPanel>
  );
}
