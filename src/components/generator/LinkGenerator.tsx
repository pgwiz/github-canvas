import { CardConfig } from "@/pages/Generator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Check, Image, Code, FileText } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface LinkGeneratorProps {
  config: CardConfig;
}

export function LinkGenerator({ config }: LinkGeneratorProps) {
  const [copiedTab, setCopiedTab] = useState<string | null>(null);
  const { toast } = useToast();

  // Use the edge function URL for embeddable images
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  
  const imageUrl = `${supabaseUrl}/functions/v1/generate-card?type=${config.type}&username=${config.username}&theme=${config.theme}&bg=${encodeURIComponent(config.bgColor)}&primary=${encodeURIComponent(config.primaryColor)}&secondary=${encodeURIComponent(config.secondaryColor)}&text=${encodeURIComponent(config.textColor)}&border=${encodeURIComponent(config.borderColor)}&radius=${config.borderRadius}&showBorder=${config.showBorder}&width=${config.width}&height=${config.height}${config.customText ? `&customText=${encodeURIComponent(config.customText)}` : ''}`;
  
  const markdownCode = `![${config.username || "GitHub"} Stats](${imageUrl})`;
  
  const htmlCode = `<img src="${imageUrl}" alt="${config.username || "GitHub"} Stats" />`;

  const copyToClipboard = async (text: string, tab: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedTab(tab);
      toast({
        title: "Copied!",
        description: "Link copied to clipboard",
      });
      setTimeout(() => setCopiedTab(null), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const CopyButton = ({ text, tab }: { text: string; tab: string }) => (
    <Button
      variant="outline"
      size="sm"
      onClick={() => copyToClipboard(text, tab)}
      className="shrink-0"
    >
      {copiedTab === tab ? (
        <Check className="w-4 h-4 text-primary" />
      ) : (
        <Copy className="w-4 h-4" />
      )}
    </Button>
  );

  return (
    <Tabs defaultValue="image" className="w-full">
      <TabsList className="grid grid-cols-3 w-full mb-4">
        <TabsTrigger value="image" className="flex items-center gap-2">
          <Image className="w-4 h-4" />
          Image URL
        </TabsTrigger>
        <TabsTrigger value="markdown" className="flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Markdown
        </TabsTrigger>
        <TabsTrigger value="html" className="flex items-center gap-2">
          <Code className="w-4 h-4" />
          HTML
        </TabsTrigger>
      </TabsList>

      <TabsContent value="image">
        <div className="flex gap-2">
          <Input
            value={imageUrl}
            readOnly
            className="font-mono text-xs bg-background/50"
          />
          <CopyButton text={imageUrl} tab="image" />
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Direct link to your SVG stats image — works in READMEs!
        </p>
      </TabsContent>

      <TabsContent value="markdown">
        <div className="flex gap-2">
          <Input
            value={markdownCode}
            readOnly
            className="font-mono text-xs bg-background/50"
          />
          <CopyButton text={markdownCode} tab="markdown" />
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Paste this in your README.md file
        </p>
      </TabsContent>

      <TabsContent value="html">
        <div className="flex gap-2">
          <Input
            value={htmlCode}
            readOnly
            className="font-mono text-xs bg-background/50"
          />
          <CopyButton text={htmlCode} tab="html" />
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Use this in your website or blog
        </p>
      </TabsContent>
    </Tabs>
  );
}
