import { CardConfig } from "@/pages/Generator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Check, Image, Code, FileText, Twitter, Linkedin, Download } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface LinkGeneratorProps {
  config: CardConfig;
}

export function LinkGenerator({ config }: LinkGeneratorProps) {
  const [copiedTab, setCopiedTab] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();

  // Detect if self-hosted (Vercel) or using Lovable Cloud
  const isVercel = !window.location.hostname.includes('lovable.app') && !window.location.hostname.includes('localhost');
  
  // Use /api/card for self-hosted, Supabase function for Lovable
  const baseUrl = isVercel 
    ? window.location.origin
    : import.meta.env.VITE_SUPABASE_URL;
  
  const apiPath = isVercel ? '/api/card' : '/functions/v1/generate-card';
  
  const imageUrl = `${baseUrl}${apiPath}?type=${config.type}&username=${config.username}&theme=${config.theme}&bg=${encodeURIComponent(config.bgColor)}&primary=${encodeURIComponent(config.primaryColor)}&secondary=${encodeURIComponent(config.secondaryColor)}&text=${encodeURIComponent(config.textColor)}&border=${encodeURIComponent(config.borderColor)}&radius=${config.borderRadius}&showBorder=${config.showBorder}&width=${config.width}&height=${config.height}&animation=${config.animation || 'fadeIn'}${config.customText ? `&customText=${encodeURIComponent(config.customText)}` : ''}`;
  
  const markdownCode = `![${config.username || "GitHub"} Stats](${imageUrl})`;
  
  const htmlCode = `<img src="${imageUrl}" alt="${config.username || "GitHub"} Stats" />`;

  // Social sharing URLs
  const shareText = config.username 
    ? `Check out my GitHub stats! 🚀 Generated with GitHub Stats Visualizer`
    : `Create beautiful GitHub stats cards with GitHub Stats Visualizer! 🎨`;
  
  const currentPageUrl = window.location.origin;
  
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(currentPageUrl)}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentPageUrl)}`;

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

  const downloadAsSVG = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch(imageUrl);
      const svgText = await response.text();
      
      const blob = new Blob([svgText], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `${config.username || 'github'}-${config.type}-card.svg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Downloaded!",
        description: "SVG card saved successfully",
      });
    } catch (err) {
      toast({
        title: "Download failed",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const downloadAsPNG = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch(imageUrl);
      const svgText = await response.text();
      
      // Create an image from SVG
      const img = new window.Image();
      const svgBlob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' });
      const svgUrl = URL.createObjectURL(svgBlob);
      
      img.onload = () => {
        // Create canvas with higher resolution for better quality
        const scale = 2;
        const canvas = document.createElement('canvas');
        canvas.width = config.width * scale;
        canvas.height = config.height * scale;
        
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.scale(scale, scale);
          ctx.drawImage(img, 0, 0, config.width, config.height);
          
          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `${config.username || 'github'}-${config.type}-card.png`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
              
              toast({
                title: "Downloaded!",
                description: "PNG card saved successfully",
              });
            }
            setIsDownloading(false);
          }, 'image/png');
        }
        URL.revokeObjectURL(svgUrl);
      };
      
      img.onerror = () => {
        toast({
          title: "Download failed",
          description: "Could not convert to PNG",
          variant: "destructive",
        });
        setIsDownloading(false);
        URL.revokeObjectURL(svgUrl);
      };
      
      img.src = svgUrl;
    } catch (err) {
      toast({
        title: "Download failed",
        description: "Please try again",
        variant: "destructive",
      });
      setIsDownloading(false);
    }
  };

  const openTwitterShare = () => {
    window.open(twitterUrl, '_blank', 'width=600,height=400');
  };

  const openLinkedInShare = () => {
    window.open(linkedinUrl, '_blank', 'width=600,height=400');
  };

  const CopyButton = ({ text, tab }: { text: string; tab: string }) => (
    <Button
      variant="outline"
      size="sm"
      onClick={() => copyToClipboard(text, tab)}
      className="shrink-0 bg-background/30 backdrop-blur-sm border-border/30"
    >
      {copiedTab === tab ? (
        <Check className="w-4 h-4 text-primary" />
      ) : (
        <Copy className="w-4 h-4" />
      )}
    </Button>
  );

  return (
    <div className="relative rounded-lg overflow-hidden">
      {/* Inner frosted glass panel */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent backdrop-blur-sm" />
      <div className="relative p-4 rounded-lg border border-primary/10 bg-background/15 shadow-[inset_0_1px_1px_rgba(255,255,255,0.03)]">
        <div className="space-y-6">
          {/* Download & Share Buttons */}
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={downloadAsSVG}
              disabled={isDownloading}
              className="flex-1 min-w-[120px] bg-background/30 backdrop-blur-sm border-border/30 hover:bg-background/50"
            >
              <Download className="w-4 h-4 mr-2" />
              SVG
            </Button>
            <Button
              variant="outline"
              onClick={downloadAsPNG}
              disabled={isDownloading}
              className="flex-1 min-w-[120px] bg-background/30 backdrop-blur-sm border-border/30 hover:bg-background/50"
            >
              <Download className="w-4 h-4 mr-2" />
              PNG
            </Button>
            <Button
              variant="outline"
              onClick={openTwitterShare}
              className="flex-1 min-w-[120px] bg-background/30 backdrop-blur-sm border-border/30 hover:bg-background/50"
            >
              <Twitter className="w-4 h-4 mr-2" />
              Twitter/X
            </Button>
            <Button
              variant="outline"
              onClick={openLinkedInShare}
              className="flex-1 min-w-[120px] bg-background/30 backdrop-blur-sm border-border/30 hover:bg-background/50"
            >
              <Linkedin className="w-4 h-4 mr-2" />
              LinkedIn
            </Button>
          </div>

          {/* Link Tabs */}
          <Tabs defaultValue="image" className="w-full">
            <TabsList className="grid grid-cols-3 w-full mb-4 bg-background/30 backdrop-blur-sm">
              <TabsTrigger value="image" className="flex items-center gap-2 data-[state=active]:bg-primary/20">
                <Image className="w-4 h-4" />
                Image URL
              </TabsTrigger>
              <TabsTrigger value="markdown" className="flex items-center gap-2 data-[state=active]:bg-primary/20">
                <FileText className="w-4 h-4" />
                Markdown
              </TabsTrigger>
              <TabsTrigger value="html" className="flex items-center gap-2 data-[state=active]:bg-primary/20">
                <Code className="w-4 h-4" />
                HTML
              </TabsTrigger>
            </TabsList>

            <TabsContent value="image">
              <div className="flex gap-2">
                <Input
                  value={imageUrl}
                  readOnly
                  className="font-mono text-xs bg-background/30 backdrop-blur-sm border-border/30"
                />
                <CopyButton text={imageUrl} tab="image" />
              </div>
              <p className="text-xs text-muted-foreground mt-2 opacity-70">
                Direct link to your SVG stats image — works in READMEs!
              </p>
            </TabsContent>

            <TabsContent value="markdown">
              <div className="flex gap-2">
                <Input
                  value={markdownCode}
                  readOnly
                  className="font-mono text-xs bg-background/30 backdrop-blur-sm border-border/30"
                />
                <CopyButton text={markdownCode} tab="markdown" />
              </div>
              <p className="text-xs text-muted-foreground mt-2 opacity-70">
                Paste this in your README.md file
              </p>
            </TabsContent>

            <TabsContent value="html">
              <div className="flex gap-2">
                <Input
                  value={htmlCode}
                  readOnly
                  className="font-mono text-xs bg-background/30 backdrop-blur-sm border-border/30"
                />
                <CopyButton text={htmlCode} tab="html" />
              </div>
              <p className="text-xs text-muted-foreground mt-2 opacity-70">
                Use this in your website or blog
              </p>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
