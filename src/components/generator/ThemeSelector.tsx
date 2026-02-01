import { motion, AnimatePresence } from "framer-motion";
import { Check, Wand2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { templates } from "@/lib/templates";
import { TiltCard } from "@/components/ui/TiltCard";

interface ThemeSelectorProps {
  selectedTheme: string;
  onSelectTheme: (theme: string) => void;
  onMagicTheme: () => void;
}

export function ThemeSelector({ selectedTheme, onSelectTheme, onMagicTheme }: ThemeSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-lg font-semibold">Choose a Template</Label>
        <Button
          variant="outline"
          size="sm"
          onClick={onMagicTheme}
          className="bg-primary/10 border-primary/20 hover:bg-primary/20 text-primary hover:text-primary transition-all duration-300 hover:scale-105 active:scale-95 group"
        >
          <Wand2 className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
          Magic Theme
        </Button>
      </div>

      <ScrollArea className="h-[320px] rounded-xl border border-white/10 bg-black/20 p-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <AnimatePresence>
            {templates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <TiltCard
                  onClick={() => onSelectTheme(template.id)}
                  className={cn(
                    "group relative flex flex-col items-center justify-between p-3 rounded-xl border cursor-pointer h-full",
                    selectedTheme === template.id
                      ? "border-primary ring-1 ring-primary shadow-[0_0_20px_-5px_hsl(var(--primary)/0.3)]"
                      : "border-white/10 hover:border-white/20 hover:bg-white/5"
                  )}
                  style={{
                    background: `linear-gradient(145deg, ${template.colors.bg}dd, ${template.colors.bg})`,
                  }}
                  scale={1.05}
                  maxTilt={15}
                  glareMaxOpacity={0.2}
                >
                  {/* Selection Indicator */}
                  {selectedTheme === template.id && (
                    <motion.div
                      layoutId="theme-check"
                      className="absolute top-2 right-2 p-1 rounded-full bg-primary text-primary-foreground shadow-sm z-10"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <Check className="w-3 h-3" />
                    </motion.div>
                  )}

                  {/* Color Preview Circles */}
                  <div className="flex gap-2 mb-3 mt-1 pointer-events-none">
                    <div
                      className="w-8 h-8 rounded-full shadow-lg border border-white/10 ring-2 ring-black/20"
                      style={{ backgroundColor: template.colors.primary }}
                    />
                    <div
                      className="w-8 h-8 rounded-full shadow-lg border border-white/10 ring-2 ring-black/20 -ml-4"
                      style={{ backgroundColor: template.colors.secondary }}
                    />
                  </div>

                  {/* Theme Name */}
                  <span
                    className={cn(
                      "text-xs font-medium w-full text-center py-1 rounded-md transition-colors pointer-events-none",
                      selectedTheme === template.id
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground group-hover:text-foreground"
                    )}
                  >
                    {template.name}
                  </span>

                  {/* Hover Glow Effect */}
                  <div
                    className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at center, ${template.colors.primary}20 0%, transparent 70%)`
                    }}
                  />
                </TiltCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </ScrollArea>
    </div>
  );
}
