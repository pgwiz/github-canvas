import { CardConfig, WaveStyle } from "@/pages/Generator";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { Paintbrush, LayoutTemplate, Type, Palette, Move, Box, Layers, AlignCenterVertical, AlignCenterHorizontal } from "lucide-react";

const animations = [
  { value: "fadeIn", label: "Fade In", icon: "✨" },
  { value: "scaleIn", label: "Scale In", icon: "🎯" },
  { value: "wave", label: "Wave", icon: "🌊" },
  { value: "glow", label: "Glow", icon: "💫" },
  { value: "blink", label: "Blink", icon: "👁️" },
  { value: "typing", label: "Typing", icon: "⌨️" },
  { value: "slideInLeft", label: "Slide Left", icon: "⬅️" },
  { value: "slideInRight", label: "Slide Right", icon: "➡️" },
  { value: "slideInUp", label: "Slide Up", icon: "⬆️" },
  { value: "bounce", label: "Bounce", icon: "🏀" },
  { value: "none", label: "None", icon: "⏸️" },
];

const speeds = [
  { value: "slow", label: "Slow", icon: "🐢" },
  { value: "normal", label: "Normal", icon: "🚶" },
  { value: "fast", label: "Fast", icon: "🚀" },
];

const gradientTypes = [
  { value: "linear", label: "Linear", icon: "↗️" },
  { value: "radial", label: "Radial", icon: "⭕" },
];

const gradientPresets = [
  { name: "Purple Haze", start: "#667eea", end: "#764ba2" },
  { name: "Sunset", start: "#f093fb", end: "#f5576c" },
  { name: "Ocean", start: "#4facfe", end: "#00f2fe" },
  { name: "Forest", start: "#38ef7d", end: "#11998e" },
  { name: "Fire", start: "#f12711", end: "#f5af19" },
  { name: "Night Sky", start: "#0f0c29", end: "#302b63" },
];

const waveStyles: { value: WaveStyle; label: string; icon: string; description: string }[] = [
  { value: "wave", label: "Wave", icon: "🌊", description: "Smooth flowing waves" },
  { value: "pulse", label: "Pulse", icon: "💓", description: "Pulsing motion" },
  { value: "flow", label: "Flow", icon: "〰️", description: "Flowing curves" },
  { value: "glitch", label: "Glitch", icon: "⚡", description: "Dev-style glitch effect" },
];
interface CustomizationPanelProps {
  config: CardConfig;
  updateConfig: (updates: Partial<CardConfig>) => void;
}

export function CustomizationPanel({ config, updateConfig }: CustomizationPanelProps) {
  const [activeTab, setActiveTab] = useState("colors");

  useEffect(() => {
    if (config.type === "banner" || config.type === "custom") {
      setActiveTab("content");
    }
  }, [config.type]);

  return (
    <div className="relative rounded-lg overflow-hidden transition-all duration-300">
      {/* Inner frosted glass panel */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent backdrop-blur-sm" />
      <div className="relative p-4 rounded-lg border border-primary/10 bg-background/15 shadow-[inset_0_1px_1px_rgba(255,255,255,0.03)]">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 w-full mb-6 bg-background/30 backdrop-blur-sm p-1 gap-1">
            <TabsTrigger value="colors" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary transition-all duration-300 gap-2">
              <Palette className="w-4 h-4" />
              Colors
            </TabsTrigger>
            <TabsTrigger value="layout" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary transition-all duration-300 gap-2">
              <LayoutTemplate className="w-4 h-4" />
              Layout
            </TabsTrigger>
            <TabsTrigger value="content" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary transition-all duration-300 gap-2">
              <Type className="w-4 h-4" />
              Content
            </TabsTrigger>
          </TabsList>

          <div className="min-h-[300px]">
            <TabsContent value="colors" className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
              {/* Gradient Toggle */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-background/20 border border-border/20 transition-all hover:bg-background/30">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-md ${config.gradientEnabled ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                    <Paintbrush className="w-5 h-5" />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Gradient Background</Label>
                    <p className="text-xs text-muted-foreground">Use gradient instead of solid color</p>
                  </div>
                </div>
                <Switch
                  checked={config.gradientEnabled}
                  onCheckedChange={(v) => updateConfig({ gradientEnabled: v })}
                />
              </div>

              {config.gradientEnabled ? (
                <div className="space-y-6">
                  {/* Gradient Presets */}
                  <div>
                    <Label className="text-sm mb-3 block text-muted-foreground">Quick Presets</Label>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {gradientPresets.map((preset) => (
                        <button
                          key={preset.name}
                          onClick={() => updateConfig({ gradientStart: preset.start, gradientEnd: preset.end })}
                          className="group relative h-10 w-full rounded-md border border-border/30 transition-all hover:scale-105 hover:border-primary/50 overflow-hidden"
                          title={preset.name}
                        >
                          <div
                            className="absolute inset-0"
                            style={{ background: `linear-gradient(135deg, ${preset.start}, ${preset.end})` }}
                          />
                          <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Gradient Type */}
                    <div>
                      <Label className="text-sm mb-2 block">Type</Label>
                      <Select
                        value={config.gradientType}
                        onValueChange={(v) => updateConfig({ gradientType: v })}
                      >
                        <SelectTrigger className="bg-background/30 border-border/30">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {gradientTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.icon} {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                     {/* Gradient Angle (for linear) */}
                    {config.gradientType === "linear" && (
                      <div>
                        <Label className="text-sm mb-2 block flex justify-between">
                          <span>Angle</span>
                          <span className="text-muted-foreground">{config.gradientAngle}°</span>
                        </Label>
                        <Slider
                          value={[config.gradientAngle]}
                          onValueChange={([v]) => updateConfig({ gradientAngle: v })}
                          min={0}
                          max={360}
                          step={15}
                          className="[&_[role=slider]]:bg-primary py-2"
                        />
                      </div>
                    )}
                  </div>

                  {/* Gradient Colors */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm">Start Color</Label>
                      <div className="flex gap-2 group">
                        <div className="relative overflow-hidden w-10 h-10 rounded-md border border-border/30">
                          <Input
                            type="color"
                            value={config.gradientStart}
                            onChange={(e) => updateConfig({ gradientStart: e.target.value })}
                            className="absolute -top-2 -left-2 w-16 h-16 p-0 cursor-pointer bg-transparent border-none"
                          />
                        </div>
                        <Input
                          type="text"
                          value={config.gradientStart}
                          onChange={(e) => updateConfig({ gradientStart: e.target.value })}
                          className="flex-1 font-mono text-sm bg-background/30 border-border/30 group-hover:border-primary/30 transition-colors"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">End Color</Label>
                      <div className="flex gap-2 group">
                        <div className="relative overflow-hidden w-10 h-10 rounded-md border border-border/30">
                          <Input
                            type="color"
                            value={config.gradientEnd}
                            onChange={(e) => updateConfig({ gradientEnd: e.target.value })}
                            className="absolute -top-2 -left-2 w-16 h-16 p-0 cursor-pointer bg-transparent border-none"
                          />
                        </div>
                        <Input
                          type="text"
                          value={config.gradientEnd}
                          onChange={(e) => updateConfig({ gradientEnd: e.target.value })}
                          className="flex-1 font-mono text-sm bg-background/30 border-border/30 group-hover:border-primary/30 transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Preview Bar */}
                  <div className="space-y-2">
                     <Label className="text-xs text-muted-foreground">Gradient Preview</Label>
                    <div
                      className="h-12 rounded-lg border border-border/30 shadow-inner"
                      style={{
                        background: config.gradientType === "linear"
                          ? `linear-gradient(${config.gradientAngle}deg, ${config.gradientStart}, ${config.gradientEnd})`
                          : `radial-gradient(circle, ${config.gradientStart}, ${config.gradientEnd})`,
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                   <div className="space-y-2">
                    <Label className="text-sm">Background</Label>
                    <div className="flex gap-2 group">
                      <div className="relative overflow-hidden w-10 h-10 rounded-md border border-border/30">
                        <Input
                          type="color"
                          value={config.bgColor}
                          onChange={(e) => updateConfig({ bgColor: e.target.value })}
                          className="absolute -top-2 -left-2 w-16 h-16 p-0 cursor-pointer bg-transparent border-none"
                        />
                      </div>
                      <Input
                        type="text"
                        value={config.bgColor}
                        onChange={(e) => updateConfig({ bgColor: e.target.value })}
                        className="flex-1 font-mono text-sm bg-background/30 border-border/30 group-hover:border-primary/30 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm">Primary</Label>
                    <div className="flex gap-2 group">
                      <div className="relative overflow-hidden w-10 h-10 rounded-md border border-border/30">
                        <Input
                          type="color"
                          value={config.primaryColor}
                          onChange={(e) => updateConfig({ primaryColor: e.target.value })}
                          className="absolute -top-2 -left-2 w-16 h-16 p-0 cursor-pointer bg-transparent border-none"
                        />
                      </div>
                      <Input
                        type="text"
                        value={config.primaryColor}
                        onChange={(e) => updateConfig({ primaryColor: e.target.value })}
                        className="flex-1 font-mono text-sm bg-background/30 border-border/30 group-hover:border-primary/30 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm">Secondary</Label>
                    <div className="flex gap-2 group">
                      <div className="relative overflow-hidden w-10 h-10 rounded-md border border-border/30">
                        <Input
                          type="color"
                          value={config.secondaryColor}
                          onChange={(e) => updateConfig({ secondaryColor: e.target.value })}
                          className="absolute -top-2 -left-2 w-16 h-16 p-0 cursor-pointer bg-transparent border-none"
                        />
                      </div>
                      <Input
                        type="text"
                        value={config.secondaryColor}
                        onChange={(e) => updateConfig({ secondaryColor: e.target.value })}
                        className="flex-1 font-mono text-sm bg-background/30 border-border/30 group-hover:border-primary/30 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm">Text</Label>
                    <div className="flex gap-2 group">
                      <div className="relative overflow-hidden w-10 h-10 rounded-md border border-border/30">
                        <Input
                          type="color"
                          value={config.textColor}
                          onChange={(e) => updateConfig({ textColor: e.target.value })}
                          className="absolute -top-2 -left-2 w-16 h-16 p-0 cursor-pointer bg-transparent border-none"
                        />
                      </div>
                      <Input
                        type="text"
                        value={config.textColor}
                        onChange={(e) => updateConfig({ textColor: e.target.value })}
                        className="flex-1 font-mono text-sm bg-background/30 border-border/30 group-hover:border-primary/30 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm">Border</Label>
                    <div className="flex gap-2 group">
                      <div className="relative overflow-hidden w-10 h-10 rounded-md border border-border/30">
                        <Input
                          type="color"
                          value={config.borderColor}
                          onChange={(e) => updateConfig({ borderColor: e.target.value })}
                          className="absolute -top-2 -left-2 w-16 h-16 p-0 cursor-pointer bg-transparent border-none"
                        />
                      </div>
                      <Input
                        type="text"
                        value={config.borderColor}
                        onChange={(e) => updateConfig({ borderColor: e.target.value })}
                        className="flex-1 font-mono text-sm bg-background/30 border-border/30 group-hover:border-primary/30 transition-colors"
                      />
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="layout" className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="space-y-4 border rounded-lg p-4 bg-background/20 border-border/20">
                <div className="flex items-center gap-2 mb-2">
                  <Move className="w-4 h-4 text-primary" />
                  <Label className="text-sm font-semibold">Padding Controls</Label>
                </div>

                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label className="text-xs text-muted-foreground">Top</Label>
                      <span className="text-xs font-mono">{config.paddingTop}px</span>
                    </div>
                    <Slider
                      value={[config.paddingTop || 25]}
                      onValueChange={([v]) => updateConfig({ paddingTop: v })}
                      min={0}
                      max={100}
                      step={1}
                      className="[&_[role=slider]]:bg-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                       <Label className="text-xs text-muted-foreground">Right</Label>
                       <span className="text-xs font-mono">{config.paddingRight}px</span>
                    </div>
                    <Slider
                      value={[config.paddingRight || 25]}
                      onValueChange={([v]) => updateConfig({ paddingRight: v })}
                      min={0}
                      max={100}
                      step={1}
                      className="[&_[role=slider]]:bg-primary"
                    />
                  </div>
                  <div className="space-y-2">
                     <div className="flex justify-between">
                       <Label className="text-xs text-muted-foreground">Bottom</Label>
                       <span className="text-xs font-mono">{config.paddingBottom}px</span>
                    </div>
                    <Slider
                      value={[config.paddingBottom || 25]}
                      onValueChange={([v]) => updateConfig({ paddingBottom: v })}
                      min={0}
                      max={100}
                      step={1}
                      className="[&_[role=slider]]:bg-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                       <Label className="text-xs text-muted-foreground">Left</Label>
                       <span className="text-xs font-mono">{config.paddingLeft}px</span>
                    </div>
                    <Slider
                      value={[config.paddingLeft || 25]}
                      onValueChange={([v]) => updateConfig({ paddingLeft: v })}
                      min={0}
                      max={100}
                      step={1}
                      className="[&_[role=slider]]:bg-primary"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label className="text-sm">Border Radius</Label>
                    <span className="text-xs font-mono text-muted-foreground">{config.borderRadius}px</span>
                  </div>
                  <Slider
                    value={[config.borderRadius]}
                    onValueChange={([v]) => updateConfig({ borderRadius: v })}
                    min={0}
                    max={24}
                    step={1}
                    className="[&_[role=slider]]:bg-primary"
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-background/20 border border-border/20">
                  <div className="flex items-center gap-2">
                     <Box className="w-4 h-4 text-primary" />
                     <Label className="text-sm">Show Border</Label>
                  </div>
                  <Switch
                    checked={config.showBorder}
                    onCheckedChange={(v) => updateConfig({ showBorder: v })}
                  />
                </div>
              </div>

              <div className="space-y-4">
                 <div className="flex items-center gap-2 text-muted-foreground">
                    <AlignCenterHorizontal className="w-4 h-4" />
                    <Label className="text-xs font-semibold uppercase tracking-wider">Dimensions</Label>
                 </div>

                 <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <Label className="text-sm">Width</Label>
                        <span className="text-xs font-mono text-muted-foreground">{config.width}px</span>
                      </div>
                      <Slider
                        value={[config.width]}
                        onValueChange={([v]) => updateConfig({ width: v })}
                        min={300}
                        max={800}
                        step={5}
                        className="[&_[role=slider]]:bg-primary"
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <Label className="text-sm">Height</Label>
                        <span className="text-xs font-mono text-muted-foreground">{config.height}px</span>
                      </div>
                      <Slider
                        value={[config.height]}
                        onValueChange={([v]) => updateConfig({ height: v })}
                        min={100}
                        max={400}
                        step={5}
                        className="[&_[role=slider]]:bg-primary"
                      />
                    </div>
                 </div>
              </div>

              <div className="space-y-4">
                 <div className="flex items-center gap-2 text-muted-foreground">
                    <Layers className="w-4 h-4" />
                    <Label className="text-xs font-semibold uppercase tracking-wider">Motion</Label>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm mb-2 block">Animation</Label>
                      <Select
                        value={config.animation}
                        onValueChange={(v) => updateConfig({ animation: v })}
                      >
                        <SelectTrigger className="bg-background/30 border-border/30">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {animations.map((anim) => (
                            <SelectItem key={anim.value} value={anim.value}>
                              {anim.icon} {anim.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-sm mb-2 block">Speed</Label>
                      <Select
                        value={config.animationSpeed}
                        onValueChange={(v) => updateConfig({ animationSpeed: v })}
                      >
                        <SelectTrigger className="bg-background/30 border-border/30">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {speeds.map((speed) => (
                            <SelectItem key={speed.value} value={speed.value}>
                              {speed.icon} {speed.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                 </div>
              </div>

            </TabsContent>

            <TabsContent value="content" className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              {config.type === "banner" && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm mb-2 block">Your Name</Label>
                      <Input
                        value={config.bannerName}
                        onChange={(e) => updateConfig({ bannerName: e.target.value })}
                        placeholder="e.g. John Doe"
                        className="bg-background/30 border-border/30 focus:border-primary/50 transition-colors"
                      />
                    </div>
                    <div>
                      <Label className="text-sm mb-2 block">Description / Tagline</Label>
                      <Input
                        value={config.bannerDescription}
                        onChange={(e) => updateConfig({ bannerDescription: e.target.value })}
                        placeholder="e.g. Full-Stack Developer"
                        className="bg-background/30 border-border/30 focus:border-primary/50 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-background/20 border border-border/20">
                    <Label className="text-sm mb-3 block">Wave Animation Style</Label>
                    <div className="grid grid-cols-2 gap-2">
                       {waveStyles.map((style) => (
                         <button
                           key={style.value}
                           onClick={() => updateConfig({ waveStyle: style.value })}
                           className={`flex items-center gap-2 p-2 rounded-md border text-sm transition-all ${config.waveStyle === style.value ? 'border-primary bg-primary/10 text-primary' : 'border-transparent hover:bg-white/5'}`}
                         >
                           <span>{style.icon}</span>
                           <span>{style.label}</span>
                         </button>
                       ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-md text-blue-200 text-xs">
                    <span className="text-lg">💡</span>
                    <p>
                      Create an animated header/footer banner for your GitHub profile
                    </p>
                  </div>
                </div>
              )}

              {config.type === "custom" && (
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm mb-2 block">Custom Text</Label>
                    <Textarea
                      value={config.customText}
                      onChange={(e) => updateConfig({ customText: e.target.value })}
                      placeholder="Enter your custom text..."
                      className="min-h-[150px] bg-background/30 border-border/30 focus:border-primary/50 transition-colors font-mono text-sm"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Supports basic text. New lines are preserved.
                  </p>
                </div>
              )}

              {config.type === "contribution" && (
                <div className="space-y-4">
                  <div className="p-6 text-center border border-dashed border-border/40 rounded-lg">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 text-primary">
                       <Layers className="w-6 h-6" />
                    </div>
                    <h3 className="text-sm font-medium mb-1">Standard Settings</h3>
                    <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                      This card uses standard GitHub Contribution Graph settings. Customization for square size and gaps coming soon.
                    </p>
                  </div>
                </div>
              )}

              {config.type !== "custom" && config.type !== "banner" && config.type !== "contribution" && (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground animate-in fade-in zoom-in duration-300">
                  <div className="w-16 h-16 rounded-full bg-background/30 flex items-center justify-center mb-4">
                    <Type className="w-8 h-8 opacity-50" />
                  </div>
                  <p className="font-medium">No content settings available</p>
                  <p className="text-sm mt-2 opacity-70 max-w-xs text-center">Select "Banner" or "Custom" card type to customize specific text content.</p>
                </div>
              )}
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
