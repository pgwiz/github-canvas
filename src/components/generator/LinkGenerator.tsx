import { CardConfig } from "@/pages/Generator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Check, Image, Code, FileText, Twitter, Linkedin, Download, Link2 } from "lucide-react";
import { useState, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface LinkGeneratorProps {
  config: CardConfig;
}

interface CopyButtonProps {
  text: string;
  tab: string;
  copiedTab: string | null;
  onCopy: (text: string, tab: string) => void;
}

const CopyButton = ({ text, tab, copiedTab, onCopy }: CopyButtonProps) => (
  <Button
    variant="outline"
    size="sm"
    onClick={() => onCopy(text, tab)}
    className={cn(
      "shrink-0 bg-background/30 backdrop-blur-sm border-border/30 transition-all duration-300 relative overflow-hidden",
      copiedTab === tab
        ? "bg-primary/20 border-primary/50 text-primary scale-105"
        : "hover:bg-background/50 hover:scale-105"
    )}
  >
    <div className="relative w-4 h-4">
      <Check
        className={cn(
          "w-4 h-4 absolute inset-0 transition-all duration-300",
          copiedTab === tab ? "opacity-100 rotate-0 scale-100" : "opacity-0 rotate-90 scale-0"
        )}
      />
      <Copy
        className={cn(
          "w-4 h-4 absolute inset-0 transition-all duration-300",
          copiedTab === tab ? "opacity-0 -rotate-90 scale-0" : "opacity-100 rotate-0 scale-100"
        )}
      />
    </div>
  </Button>
);

export function LinkGenerator({ config }: LinkGeneratorProps) {
  const [copiedTab, setCopiedTab] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();

  // Determine API endpoint with fallback
  const apiEndpoint = useMemo(() => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ||
      (import.meta.env.VITE_SUPABASE_PROJECT_ID ? `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co` : null);
    const selfHostedApiUrl = import.meta.env.VITE_API_URL;

    // If a custom API URL is explicitly set, use it
    if (selfHostedApiUrl) {
      return selfHostedApiUrl;
    }

    const hostname = window.location.hostname;

    // On Lovable preview or localhost - always use Supabase edge function
    const isLovable = hostname.includes('lovable.app') || hostname.includes('lovableproject.com');

    if (isLovable && supabaseUrl) {
      return `${supabaseUrl}/functions/v1/generate-card`;
    }

    if (config.type === 'pin') {
      return `${window.location.origin}/api/pin`;
    }

    // Self-hosted (Vercel, Netlify, custom domain) or Localhost (if API is running) - use /api/card route
    return `${window.location.origin}/api/card`;
  }, [config.type]);

  const imageUrl = useMemo(() => {
    const params = new URLSearchParams();
    if (config.type !== 'pin') {
      params.set('type', config.type);
    }
    if (config.username) params.set('username', config.username);
    if (config.type === 'pin' && config.repo) params.set('repo', config.repo);
    if (config.theme) params.set('theme', config.theme);
    if (config.bgColor) params.set('bg', config.bgColor);
    if (config.primaryColor) params.set('primary', config.primaryColor);
    if (config.secondaryColor) params.set('secondary', config.secondaryColor);
    if (config.textColor) params.set('text', config.textColor);
    if (config.borderColor) params.set('border', config.borderColor);
    if (config.borderRadius !== undefined) params.set('radius', String(config.borderRadius));
    if (config.showBorder !== undefined) params.set('showBorder', String(config.showBorder));
    if (config.width) params.set('width', String(config.width));
    if (config.height) params.set('height', String(config.height));
    if (config.animation && config.animation !== 'none') params.set('animation', config.animation);
    if (config.animationSpeed) params.set('speed', config.animationSpeed);
    if (config.gradientEnabled) {
      params.set('gradient', 'true');
      if (config.gradientType) params.set('gradientType', config.gradientType);
      if (config.gradientAngle) params.set('gradientAngle', String(config.gradientAngle));
      if (config.gradientStart) params.set('gradientStart', config.gradientStart);
      if (config.gradientEnd) params.set('gradientEnd', config.gradientEnd);
    }
    if (config.type === 'banner') {
      if (config.bannerName) params.set('bannerName', config.bannerName);
      if (config.bannerDescription) params.set('bannerDescription', config.bannerDescription);
      if (config.waveStyle) params.set('waveStyle', config.waveStyle);
    }
    if (config.type === 'pin') {
      if (config.customDescription) params.set('description', config.customDescription);
      if (config.showOwner) params.set('show_owner', 'true');
    }
    if (config.type === 'skills') {
      if (config.stacks && config.stacks.length > 0) params.set('stacks', config.stacks.join(','));
      if (config.skills) params.set('skills', config.skills);
      if (config.skillsLayout) params.set('skillsLayout', config.skillsLayout);
    }
    if (config.customDescription && config.type !== 'pin') params.set('description', config.customDescription);
    if (config.customText) params.set('customText', config.customText);

    return `${apiEndpoint}?${params.toString()}`;
  }, [apiEndpoint, config]);

  const markdownCode = `![${config.username || "GitHub"} Stats](${imageUrl})`;

  const htmlCode = `<img src="${imageUrl}" alt="${config.username || "GitHub"} Stats" />`;

  // Social sharing URLs
  const shareText = config.username
    ? `Check out my GitHub stats! Generated with GitHub Stats Visualizer`
    : `Create beautiful GitHub stats cards with GitHub Stats Visualizer!`;

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

  return (
    <div className="relative rounded-lg overflow-hidden">
      {/* Inner frosted glass panel */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent backdrop-blur-sm" />
      <div className="relative p-4 rounded-lg border border-primary/10 bg-background/15 shadow-[inset_0_1px_1px_rgba(255,255,255,0.03)]">
        <div className="space-y-6">
          {/* Copy Quote URL Button (shown only for quote type) */}
          {config.type === "quote" && (
            <Button
              onClick={() => copyToClipboard(imageUrl, "quoteUrl")}
              className={cn(
                "w-full transition-all duration-300 border",
                copiedTab === "quoteUrl"
                  ? "bg-primary/20 hover:bg-primary/30 border-primary/50 text-primary"
                  : "bg-primary/20 hover:bg-primary/30 border-primary/30"
              )}
              variant="outline"
            >
              <div className="relative w-4 h-4 mr-2">
                 <Check
                  className={cn(
                    "w-4 h-4 absolute inset-0 transition-all duration-300",
                    copiedTab === "quoteUrl" ? "opacity-100 rotate-0 scale-100" : "opacity-0 rotate-90 scale-0"
                  )}
                />
                <Link2
                  className={cn(
                    "w-4 h-4 absolute inset-0 transition-all duration-300",
                    copiedTab === "quoteUrl" ? "opacity-0 -rotate-90 scale-0" : "opacity-100 rotate-0 scale-100"
                  )}
                />
              </div>
              {copiedTab === "quoteUrl" ? "Copied!" : "Copy Quote Card URL"}
            </Button>
          )}

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
                <CopyButton text={imageUrl} tab="image" copiedTab={copiedTab} onCopy={copyToClipboard} />
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
                <CopyButton text={markdownCode} tab="markdown" copiedTab={copiedTab} onCopy={copyToClipboard} />
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
                <CopyButton text={htmlCode} tab="html" copiedTab={copiedTab} onCopy={copyToClipboard} />
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
