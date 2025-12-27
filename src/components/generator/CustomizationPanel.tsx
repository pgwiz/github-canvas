import { CardConfig, WaveStyle } from "@/pages/Generator";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  return (
    <div className="relative rounded-lg overflow-hidden">
      {/* Inner frosted glass panel */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent backdrop-blur-sm" />
      <div className="relative p-4 rounded-lg border border-primary/10 bg-background/15 shadow-[inset_0_1px_1px_rgba(255,255,255,0.03)]">
        <Tabs defaultValue="colors" className="w-full">
          <TabsList className="grid grid-cols-3 w-full mb-4 bg-background/30 backdrop-blur-sm">
            <TabsTrigger value="colors" className="data-[state=active]:bg-primary/20">Colors</TabsTrigger>
            <TabsTrigger value="layout" className="data-[state=active]:bg-primary/20">Layout</TabsTrigger>
            <TabsTrigger value="content" className="data-[state=active]:bg-primary/20">Content</TabsTrigger>
          </TabsList>

          <TabsContent value="colors" className="space-y-4">
            {/* Gradient Toggle */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-background/20 border border-border/20">
              <div>
                <Label className="text-sm">Gradient Background</Label>
                <p className="text-xs text-muted-foreground">Use gradient instead of solid color</p>
              </div>
              <Switch
                checked={config.gradientEnabled}
                onCheckedChange={(v) => updateConfig({ gradientEnabled: v })}
              />
            </div>

            {config.gradientEnabled ? (
              <div className="space-y-4">
                {/* Gradient Presets */}
                <div>
                  <Label className="text-sm mb-2 block">Presets</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {gradientPresets.map((preset) => (
                      <button
                        key={preset.name}
                        onClick={() => updateConfig({ gradientStart: preset.start, gradientEnd: preset.end })}
                        className="h-8 rounded-md border border-border/30 transition-all hover:scale-105"
                        style={{
                          background: `linear-gradient(135deg, ${preset.start}, ${preset.end})`,
                        }}
                        title={preset.name}
                      />
                    ))}
                  </div>
                </div>

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
                    <Label className="text-sm mb-2 block">
                      Angle: {config.gradientAngle}°
                    </Label>
                    <Slider
                      value={[config.gradientAngle]}
                      onValueChange={([v]) => updateConfig({ gradientAngle: v })}
                      min={0}
                      max={360}
                      step={15}
                      className="[&_[role=slider]]:bg-primary"
                    />
                  </div>
                )}

                {/* Gradient Colors */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm mb-2 block">Start Color</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={config.gradientStart}
                        onChange={(e) => updateConfig({ gradientStart: e.target.value })}
                        className="w-12 h-10 p-1 cursor-pointer bg-background/30 border-border/30"
                      />
                      <Input
                        type="text"
                        value={config.gradientStart}
                        onChange={(e) => updateConfig({ gradientStart: e.target.value })}
                        className="flex-1 font-mono text-sm bg-background/30 border-border/30"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm mb-2 block">End Color</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={config.gradientEnd}
                        onChange={(e) => updateConfig({ gradientEnd: e.target.value })}
                        className="w-12 h-10 p-1 cursor-pointer bg-background/30 border-border/30"
                      />
                      <Input
                        type="text"
                        value={config.gradientEnd}
                        onChange={(e) => updateConfig({ gradientEnd: e.target.value })}
                        className="flex-1 font-mono text-sm bg-background/30 border-border/30"
                      />
                    </div>
                  </div>
                </div>

                {/* Preview */}
                <div
                  className="h-12 rounded-lg border border-border/30"
                  style={{
                    background: config.gradientType === "linear"
                      ? `linear-gradient(${config.gradientAngle}deg, ${config.gradientStart}, ${config.gradientEnd})`
                      : `radial-gradient(circle, ${config.gradientStart}, ${config.gradientEnd})`,
                  }}
                />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm mb-2 block">Background</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={config.bgColor}
                      onChange={(e) => updateConfig({ bgColor: e.target.value })}
                      className="w-12 h-10 p-1 cursor-pointer bg-background/30 border-border/30"
                    />
                    <Input
                      type="text"
                      value={config.bgColor}
                      onChange={(e) => updateConfig({ bgColor: e.target.value })}
                      className="flex-1 font-mono text-sm bg-background/30 border-border/30"
                    />
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm mb-2 block">Primary</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={config.primaryColor}
                      onChange={(e) => updateConfig({ primaryColor: e.target.value })}
                      className="w-12 h-10 p-1 cursor-pointer bg-background/30 border-border/30"
                    />
                    <Input
                      type="text"
                      value={config.primaryColor}
                      onChange={(e) => updateConfig({ primaryColor: e.target.value })}
                      className="flex-1 font-mono text-sm bg-background/30 border-border/30"
                    />
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm mb-2 block">Secondary</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={config.secondaryColor}
                      onChange={(e) => updateConfig({ secondaryColor: e.target.value })}
                      className="w-12 h-10 p-1 cursor-pointer bg-background/30 border-border/30"
                    />
                    <Input
                      type="text"
                      value={config.secondaryColor}
                      onChange={(e) => updateConfig({ secondaryColor: e.target.value })}
                      className="flex-1 font-mono text-sm bg-background/30 border-border/30"
                    />
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm mb-2 block">Text</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={config.textColor}
                      onChange={(e) => updateConfig({ textColor: e.target.value })}
                      className="w-12 h-10 p-1 cursor-pointer bg-background/30 border-border/30"
                    />
                    <Input
                      type="text"
                      value={config.textColor}
                      onChange={(e) => updateConfig({ textColor: e.target.value })}
                      className="flex-1 font-mono text-sm bg-background/30 border-border/30"
                    />
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm mb-2 block">Border</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={config.borderColor}
                      onChange={(e) => updateConfig({ borderColor: e.target.value })}
                      className="w-12 h-10 p-1 cursor-pointer bg-background/30 border-border/30"
                    />
                    <Input
                      type="text"
                      value={config.borderColor}
                      onChange={(e) => updateConfig({ borderColor: e.target.value })}
                      className="flex-1 font-mono text-sm bg-background/30 border-border/30"
                    />
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="layout" className="space-y-4">
            <div>
              <Label className="text-sm mb-2 block">
                Border Radius: {config.borderRadius}px
              </Label>
              <Slider
                value={[config.borderRadius]}
                onValueChange={([v]) => updateConfig({ borderRadius: v })}
                min={0}
                max={24}
                step={1}
                className="[&_[role=slider]]:bg-primary"
              />
            </div>
            
            <div>
              <Label className="text-sm mb-2 block">
                Width: {config.width}px
              </Label>
              <Slider
                value={[config.width]}
                onValueChange={([v]) => updateConfig({ width: v })}
                min={300}
                max={800}
                step={5}
                className="[&_[role=slider]]:bg-primary"
              />
            </div>
            
            <div>
              <Label className="text-sm mb-2 block">
                Height: {config.height}px
              </Label>
              <Slider
                value={[config.height]}
                onValueChange={([v]) => updateConfig({ height: v })}
                min={100}
                max={400}
                step={5}
                className="[&_[role=slider]]:bg-primary"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label className="text-sm">Show Border</Label>
              <Switch
                checked={config.showBorder}
                onCheckedChange={(v) => updateConfig({ showBorder: v })}
              />
            </div>

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
              <Label className="text-sm mb-2 block">Animation Speed</Label>
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
              <p className="text-xs text-muted-foreground mt-1">
                Controls animation timing
              </p>
            </div>

          </TabsContent>

          <TabsContent value="content" className="space-y-4">
            {config.type === "banner" && (
              <div className="space-y-4">
                <div>
                  <Label className="text-sm mb-2 block">Your Name</Label>
                  <Input
                    value={config.bannerName}
                    onChange={(e) => updateConfig({ bannerName: e.target.value })}
                    placeholder="e.g., PETER BRIAN GWADENYA"
                    className="bg-background/30 border-border/30"
                  />
                </div>
                <div>
                  <Label className="text-sm mb-2 block">Description / Tagline</Label>
                  <Input
                    value={config.bannerDescription}
                    onChange={(e) => updateConfig({ bannerDescription: e.target.value })}
                    placeholder="e.g., Full-Stack Developer | AI Architect | System Designer"
                    className="bg-background/30 border-border/30"
                  />
                </div>
                <div>
                  <Label className="text-sm mb-2 block">Wave Animation Style</Label>
                  <Select
                    value={config.waveStyle}
                    onValueChange={(v) => updateConfig({ waveStyle: v as WaveStyle })}
                  >
                    <SelectTrigger className="bg-background/30 border-border/30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {waveStyles.map((style) => (
                        <SelectItem key={style.value} value={style.value}>
                          <div className="flex items-center gap-2">
                            <span>{style.icon}</span>
                            <span>{style.label}</span>
                            <span className="text-xs text-muted-foreground">- {style.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <p className="text-xs text-muted-foreground">
                  Create an animated header/footer banner for your GitHub profile
                </p>
              </div>
            )}

            {config.type === "custom" && (
              <div>
                <Label className="text-sm mb-2 block">Custom Text</Label>
                <Textarea
                  value={config.customText}
                  onChange={(e) => updateConfig({ customText: e.target.value })}
                  placeholder="Enter your custom text..."
                  className="min-h-[100px] bg-background/30 border-border/30"
                />
              </div>
            )}
            
            {config.type !== "custom" && config.type !== "banner" && (
              <div className="text-center py-8 text-muted-foreground">
                <p>Content settings are available for Banner and Custom cards.</p>
                <p className="text-sm mt-2 opacity-70">Select "Banner" or "Custom" card type to customize content.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
