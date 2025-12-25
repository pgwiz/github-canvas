import { CardConfig } from "@/pages/Generator";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CustomizationPanelProps {
  config: CardConfig;
  updateConfig: (updates: Partial<CardConfig>) => void;
}

export function CustomizationPanel({ config, updateConfig }: CustomizationPanelProps) {
  return (
    <Tabs defaultValue="colors" className="w-full">
      <TabsList className="grid grid-cols-3 w-full mb-4">
        <TabsTrigger value="colors">Colors</TabsTrigger>
        <TabsTrigger value="layout">Layout</TabsTrigger>
        <TabsTrigger value="content">Content</TabsTrigger>
      </TabsList>

      <TabsContent value="colors" className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm mb-2 block">Background</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={config.bgColor}
                onChange={(e) => updateConfig({ bgColor: e.target.value })}
                className="w-12 h-10 p-1 cursor-pointer"
              />
              <Input
                type="text"
                value={config.bgColor}
                onChange={(e) => updateConfig({ bgColor: e.target.value })}
                className="flex-1 font-mono text-sm"
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
                className="w-12 h-10 p-1 cursor-pointer"
              />
              <Input
                type="text"
                value={config.primaryColor}
                onChange={(e) => updateConfig({ primaryColor: e.target.value })}
                className="flex-1 font-mono text-sm"
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
                className="w-12 h-10 p-1 cursor-pointer"
              />
              <Input
                type="text"
                value={config.secondaryColor}
                onChange={(e) => updateConfig({ secondaryColor: e.target.value })}
                className="flex-1 font-mono text-sm"
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
                className="w-12 h-10 p-1 cursor-pointer"
              />
              <Input
                type="text"
                value={config.textColor}
                onChange={(e) => updateConfig({ textColor: e.target.value })}
                className="flex-1 font-mono text-sm"
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
                className="w-12 h-10 p-1 cursor-pointer"
              />
              <Input
                type="text"
                value={config.borderColor}
                onChange={(e) => updateConfig({ borderColor: e.target.value })}
                className="flex-1 font-mono text-sm"
              />
            </div>
          </div>
        </div>
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
          />
        </div>
        
        <div className="flex items-center justify-between">
          <Label className="text-sm">Show Border</Label>
          <Switch
            checked={config.showBorder}
            onCheckedChange={(v) => updateConfig({ showBorder: v })}
          />
        </div>
      </TabsContent>

      <TabsContent value="content" className="space-y-4">
        {config.type === "custom" && (
          <div>
            <Label className="text-sm mb-2 block">Custom Text</Label>
            <Textarea
              value={config.customText}
              onChange={(e) => updateConfig({ customText: e.target.value })}
              placeholder="Enter your custom text..."
              className="min-h-[100px]"
            />
          </div>
        )}
        
        {config.type !== "custom" && (
          <div className="text-center py-8 text-muted-foreground">
            <p>Content settings are available for custom cards.</p>
            <p className="text-sm mt-2">Select "Custom" card type to add custom text.</p>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
