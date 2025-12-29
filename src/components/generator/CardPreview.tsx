import { CardConfig } from "@/pages/Generator";
import { GitHubStats } from "@/hooks/useGitHubStats";
import { DevQuote } from "@/hooks/useDevQuote";
import { useMemo, useState, useEffect } from "react";
import { TiltCard } from "@/components/ui/TiltCard";

interface CardPreviewProps {
  config: CardConfig;
  githubData?: GitHubStats | null;
  quote?: DevQuote | null;
}

export function CardPreview({ config, githubData, quote }: CardPreviewProps) {
  // Get env variables - with fallback construction from project ID
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 
    (import.meta.env.VITE_SUPABASE_PROJECT_ID ? `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co` : null);
  const selfHostedApiUrl = import.meta.env.VITE_API_URL;
  
  const [imageSrc, setImageSrc] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Determine API endpoint - memoized to prevent recreation
  const apiEndpoint = useMemo(() => {
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
    
    // Self-hosted (Vercel, Netlify, custom domain) or Localhost (if API is running) - use /api/card route
    return `${window.location.origin}/api/card`;
  }, [supabaseUrl, selfHostedApiUrl]);

  // Build the base params URL
  const paramsUrl = useMemo(() => {
    const params = new URLSearchParams({
      type: config.type,
      username: config.username || "",
      theme: config.theme,
      bg: config.bgColor,
      primary: config.primaryColor,
      secondary: config.secondaryColor,
      text: config.textColor,
      border: config.borderColor,
      radius: config.borderRadius.toString(),
      showBorder: config.showBorder.toString(),
      paddingTop: (config.paddingTop || 25).toString(),
      paddingRight: (config.paddingRight || 25).toString(),
      paddingBottom: (config.paddingBottom || 25).toString(),
      paddingLeft: (config.paddingLeft || 25).toString(),
      width: config.width.toString(),
      height: config.height.toString(),
      animation: config.animation || "fadeIn",
      speed: config.animationSpeed || "normal",
      gradient: config.gradientEnabled ? "true" : "false",
      gradientType: config.gradientType || "linear",
      gradientAngle: config.gradientAngle.toString(),
      gradientStart: config.gradientStart,
      gradientEnd: config.gradientEnd,
    });

    if (config.type === "banner") {
      if (config.bannerName) params.set("bannerName", config.bannerName);
      if (config.bannerDescription) params.set("bannerDescription", config.bannerDescription);
      if (config.waveStyle) params.set("waveStyle", config.waveStyle);
    }

    if (config.customText) {
      params.set("customText", config.customText);
    }

    if (config.type === "quote") {
      params.set("t", Date.now().toString());
    }

    return params.toString();
  }, [config, quote]);

  // Always fetch as base64 for reliable cross-platform rendering
  useEffect(() => {
    const fetchImage = async () => {
      setIsLoading(true);
      setError(null);
      
      const fullUrl = `${apiEndpoint}?${paramsUrl}&format=base64`;
      
      try {
        const response = await fetch(fullUrl);
        
        if (response.ok) {
          const dataUrl = await response.text();
          // Validate it's actually a data URL
          if (dataUrl && dataUrl.startsWith('data:')) {
            setImageSrc(dataUrl);
          } else {
            // If response isn't a data URL, it might be raw SVG - convert it
            const svgContent = dataUrl;
            const base64 = btoa(unescape(encodeURIComponent(svgContent)));
            setImageSrc(`data:image/svg+xml;base64,${base64}`);
          }
        } else {
          setError(`API error: ${response.status}`);
        }
      } catch (err) {
        console.error('Card fetch error:', err);
        setError('Failed to load preview');
      } finally {
        setIsLoading(false);
      }
    };

    fetchImage();
  }, [paramsUrl, apiEndpoint]);

  // Check if we need a username
  const needsUsername = !config.username && config.type !== "quote" && config.type !== "custom";

  if (needsUsername) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <span className="text-4xl">📊</span>
          <span className="text-sm text-center">Enter a GitHub username to preview</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <span className="text-4xl">⚠️</span>
          <span className="text-sm text-center">{error}</span>
          <span className="text-xs opacity-60">Check console for details</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-[200px]">
      {isLoading ? (
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          <span className="text-sm">Loading preview...</span>
        </div>
      ) : imageSrc ? (
        <TiltCard
          maxTilt={5}
          scale={1.02}
          glareMaxOpacity={0.15}
          className="rounded-lg shadow-2xl"
        >
          <img
            src={imageSrc}
            alt={`${config.type} card preview`}
            style={{ maxWidth: `${config.width}px` }}
            className="max-w-full h-auto rounded-lg"
          />
        </TiltCard>
      ) : (
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <span className="text-4xl">🖼️</span>
          <span className="text-sm">Generating card...</span>
        </div>
      )}
    </div>
  );
}
