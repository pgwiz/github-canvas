import { CardConfig } from "@/pages/Generator";
import { GitHubStats } from "@/hooks/useGitHubStats";
import { DevQuote } from "@/hooks/useDevQuote";
import { useMemo, useState, useEffect } from "react";
import { TiltCard } from "@/components/ui/TiltCard";
import { Sparkles, AlertTriangle, Layers } from "lucide-react";
import { CreativeLoader } from "@/components/ui/CreativeLoader";

interface CardPreviewProps {
  config: CardConfig;
  githubData?: GitHubStats | null;
  quote?: DevQuote | null;
}

export function CardPreview({ config, githubData, quote }: CardPreviewProps) {
  // Get env variables - with fallback construction from project ID
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ||
    (import.meta.env.VITE_SUPABASE_PROJECT_ID ? `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co` : null) ||
    'https://edxiyetfcnugrmxhmvpq.supabase.co';
  const selfHostedApiUrl = import.meta.env.VITE_API_URL;

  const [imageSrc, setImageSrc] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Determine API endpoints to try (primary + fallback)
  const apiEndpoints = useMemo(() => {
    const list: string[] = [];
    if (selfHostedApiUrl) {
      list.push(selfHostedApiUrl);
    }
    const hostname = window.location.hostname;
    const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
    const isLovable = hostname.includes('lovable.app') || hostname.includes('lovableproject.com');

    if ((isLovable || isLocalhost) && supabaseUrl) {
      list.push(`${supabaseUrl}/functions/v1/generate-card`);
    }

    list.push(`${window.location.origin}/api/card`);

    if (supabaseUrl && !list.includes(`${supabaseUrl}/functions/v1/generate-card`)) {
      list.push(`${supabaseUrl}/functions/v1/generate-card`);
    }

    return list;
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

  // Fetch with automatic fallback across endpoints
  useEffect(() => {
    let cancelled = false;

    const fetchImage = async () => {
      setIsLoading(true);
      setError(null);

      let success = false;
      let lastErrorMessage = 'Failed to load preview';

      for (const endpoint of apiEndpoints) {
        if (cancelled) break;
        const fullUrl = `${endpoint}?${paramsUrl}&format=base64`;
        try {
          const response = await fetch(fullUrl);
          if (response.ok) {
            const dataUrl = await response.text();
            if (dataUrl && dataUrl.startsWith('data:')) {
              setImageSrc(dataUrl);
            } else if (dataUrl && (dataUrl.includes('<svg') || dataUrl.startsWith('<'))) {
              const base64 = btoa(unescape(encodeURIComponent(dataUrl)));
              setImageSrc(`data:image/svg+xml;base64,${base64}`);
            } else {
              setImageSrc(dataUrl);
            }
            success = true;
            break;
          } else {
            lastErrorMessage = `API status ${response.status}`;
          }
        } catch (err) {
          lastErrorMessage = err instanceof Error ? err.message : 'Network error';
        }
      }

      if (!cancelled) {
        if (!success) {
          setError(lastErrorMessage);
        }
        setIsLoading(false);
      }
    };

    fetchImage();

    return () => {
      cancelled = true;
    };
  }, [paramsUrl, apiEndpoints]);

  // Check if we need a username
  const needsUsername = !config.username && config.type !== "quote" && config.type !== "custom" && config.type !== "banner";

  if (needsUsername) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="flex flex-col items-center gap-4 text-muted-foreground animate-in fade-in zoom-in duration-500">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center relative overflow-hidden group border border-primary/20">
            <div className="absolute inset-0 bg-primary/20 scale-0 group-hover:scale-100 transition-transform duration-500 rounded-full" />
            <Sparkles className="w-8 h-8 text-primary relative z-10" />
          </div>
          <div className="text-center">
            <h3 className="font-semibold text-foreground">Ready to Create</h3>
            <span className="text-sm">Enter a GitHub username to preview</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="flex flex-col items-center gap-4 text-destructive">
          <div className="w-16 h-16 rounded-full bg-destructive/10 border border-destructive/20 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-destructive" />
          </div>
          <div className="text-center">
            <h3 className="font-semibold">Card Generation Offline</h3>
            <span className="text-sm opacity-80">{error}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-[300px] relative">
      {isLoading ? (
        <CreativeLoader />
      ) : imageSrc ? (
        <div className="animate-in fade-in zoom-in slide-in-from-bottom-4 duration-500 ease-out-back">
          <TiltCard
            maxTilt={5}
            scale={1.02}
            glareMaxOpacity={0.12}
            className="rounded-lg shadow-2xl relative group"
          >
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/15 via-secondary/15 to-primary/15 rounded-xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 -z-10" />
            <img
              src={imageSrc}
              alt={`${config.type} card preview`}
              style={{ maxWidth: `${config.width}px` }}
              className="max-w-full h-auto rounded-lg shadow-md"
            />
          </TiltCard>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Layers className="w-10 h-10 text-muted-foreground/60 animate-pulse" />
          <span className="text-sm font-medium">Generating card...</span>
        </div>
      )}
    </div>
  );
}
