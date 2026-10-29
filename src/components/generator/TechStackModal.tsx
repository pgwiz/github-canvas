import { useState, useEffect } from "react";
import { TECH_CATALOG, TechIconDef } from "@/lib/techIcons";
import { PRESET_STACKS } from "@/lib/cardRenderer";
import { 
  Search, X, Plus, Check, Sparkles, Layers, Code2, 
  Database, Server, Cpu, Trash2, RotateCcw 
} from "lucide-react";
import confetti from "canvas-confetti";

interface TechStackModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSkills: string[];
  onSave: (skills: string[]) => void;
}

type CategoryFilter = "All" | "Languages" | "Frontend" | "Backend" | "Databases" | "DevOps & Tools";

export function TechStackModal({ isOpen, onClose, selectedSkills, onSave }: TechStackModalProps) {
  const [activeSkills, setActiveSkills] = useState<string[]>(selectedSkills);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("All");
  const [customInput, setCustomInput] = useState("");

  // Keep activeSkills synced strictly when modal opens, preventing wiping on keystrokes
  useEffect(() => {
    if (isOpen) {
      setActiveSkills(selectedSkills);
      setCustomInput("");
      setSearchQuery("");
      setActiveCategory("All");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const categories: CategoryFilter[] = ["All", "Languages", "Frontend", "Backend", "Databases", "DevOps & Tools"];

  const filteredCatalog = TECH_CATALOG.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = activeCategory === "All" || item.category === activeCategory;
    return matchesSearch && matchesCat;
  });

  const isSelected = (name: string) => {
    return activeSkills.some((s) => s.toLowerCase() === name.toLowerCase());
  };

  const toggleSkill = (name: string) => {
    if (isSelected(name)) {
      setActiveSkills((prev) => prev.filter((s) => s.toLowerCase() !== name.toLowerCase()));
    } else {
      setActiveSkills((prev) => [...prev, name]);
    }
  };

  const removeSkill = (name: string) => {
    setActiveSkills((prev) => prev.filter((s) => s.toLowerCase() !== name.toLowerCase()));
  };

  const handleAddCustom = () => {
    const trimmed = customInput.trim();
    if (!trimmed) return;
    if (!isSelected(trimmed)) {
      setActiveSkills((prev) => [...prev, trimmed]);
    }
    setCustomInput("");
  };

  const handleApplyPreset = (presetKey: string) => {
    const preset = PRESET_STACKS[presetKey];
    if (!preset) return;
    const combined = [...activeSkills];
    preset.skills.forEach((skill) => {
      if (!combined.some((s) => s.toLowerCase() === skill.toLowerCase())) {
        combined.push(skill);
      }
    });
    setActiveSkills(combined);
  };

  const handleClear = () => {
    setActiveSkills([]);
  };

  const handleSave = () => {
    onSave(activeSkills);
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
      colors: ["#3b82f6", "#06b6d4", "#ffffff"],
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-3xl max-h-[90vh] bg-surface border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between shrink-0 bg-surface/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center text-primary">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white">Customize Tech Stack & Languages</h2>
              <p className="text-xs text-slate-400">Select technologies, load stack presets, or add custom languages</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/5 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Selected Skills Bar */}
        <div className="px-5 py-3 border-b border-white/10 bg-black/30 shrink-0">
          <div className="flex items-center justify-between mb-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-300">Active Stack</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30">
                {activeSkills.length} Selected
              </span>
            </div>
            {activeSkills.length > 0 && (
              <button
                onClick={handleClear}
                className="text-[11px] text-slate-400 hover:text-red-400 flex items-center gap-1 transition-colors"
              >
                <Trash2 className="w-3 h-3" /> Clear All
              </button>
            )}
          </div>

          {/* Active Chips */}
          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto no-scrollbar py-1">
            {activeSkills.length === 0 ? (
              <span className="text-xs text-slate-500 italic py-1">No technologies selected yet. Click any tool below or add a custom one.</span>
            ) : (
              activeSkills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-primary/15 border border-primary/30 text-slate-200 group"
                >
                  <span>{skill}</span>
                  <button
                    onClick={() => removeSkill(skill)}
                    className="text-slate-400 group-hover:text-red-400 transition-colors ml-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))
            )}
          </div>

          {/* Quick Preset Stacks */}
          <div className="flex items-center gap-1.5 pt-2.5 overflow-x-auto no-scrollbar">
            <span className="text-[10px] uppercase tracking-wider text-slate-500 shrink-0 font-medium">Quick Presets:</span>
            {Object.entries(PRESET_STACKS).map(([key, p]) => (
              <button
                key={key}
                onClick={() => handleApplyPreset(key)}
                className="px-2 py-0.5 rounded text-[10px] font-medium bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white shrink-0 transition-colors"
              >
                + {p.label.split("·")[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Controls: Search & Category Filter */}
        <div className="p-4 border-b border-white/10 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between shrink-0 bg-surface/50">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 150+ programming languages & frameworks..."
              className="w-full bg-black/40 border border-white/10 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-primary/50"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar bg-black/40 p-1 rounded-lg border border-white/10 shrink-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors shrink-0 ${
                  activeCategory === cat
                    ? "bg-primary/20 text-primary border border-primary/30"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Catalog Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 no-scrollbar">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {filteredCatalog.map((item) => {
              const active = isSelected(item.name);
              return (
                <button
                  key={item.name}
                  onClick={() => toggleSkill(item.name)}
                  className={`flex items-center gap-2.5 p-2.5 rounded-xl border transition-all text-left group ${
                    active
                      ? "bg-primary/15 border-primary/50 text-white shadow-sm ring-1 ring-primary/40"
                      : "bg-black/30 border-white/5 hover:border-white/15 text-slate-300 hover:text-white"
                  }`}
                >
                  {/* SVG Icon */}
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border"
                    style={{
                      backgroundColor: `${item.color}15`,
                      borderColor: `${item.color}35`,
                    }}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d={item.svgPath} fill={item.color} />
                    </svg>
                  </div>

                  <div className="min-w-0 flex-1">
                    <span className="block text-xs font-semibold truncate leading-tight">{item.name}</span>
                    <span className="block text-[10px] text-slate-500 truncate">{item.category}</span>
                  </div>

                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 border transition-colors ${
                      active ? "bg-primary border-primary text-black" : "border-white/20 opacity-0 group-hover:opacity-60"
                    }`}
                  >
                    {active && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>

          {filteredCatalog.length === 0 && (
            <div className="text-center py-10">
              <p className="text-xs text-slate-400 mb-2">No predefined tools found matching "{searchQuery}".</p>
              <button
                type="button"
                onClick={() => {
                  const trimmed = searchQuery.trim();
                  if (trimmed && !activeSkills.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
                    setActiveSkills((prev) => [...prev, trimmed]);
                  }
                  setSearchQuery("");
                }}
                className="text-xs text-primary hover:underline font-medium cursor-pointer"
              >
                + Add "{searchQuery}" as a custom language?
              </button>
            </div>
          )}
        </div>

        {/* Custom Language Adder & Footer */}
        <div className="p-4 border-t border-white/10 bg-black/40 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAddCustom();
            }}
            className="flex items-center gap-2 w-full sm:w-auto flex-1 max-w-md"
          >
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="Add any custom language (e.g. Mojo, Zig, Solidity)..."
              className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-primary/50"
            />
            <button
              type="submit"
              disabled={!customInput.trim()}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 disabled:opacity-40 text-xs font-semibold text-white shrink-0 transition-colors cursor-pointer"
            >
              + Add
            </button>
          </form>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg border border-white/10 hover:bg-white/5 text-xs font-medium text-slate-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-xs font-bold text-white transition-all shadow-md active:scale-95"
            >
              Apply Tech Stack ({activeSkills.length})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
