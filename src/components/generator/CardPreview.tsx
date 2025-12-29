import { CardConfig } from "@/pages/Generator";
import { GitHubStats } from "@/hooks/useGitHubStats";
import { DevQuote } from "@/hooks/useDevQuote";
import { useMemo, useState, useEffect, useRef } from "react";

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
  
  const [svgContent, setSvgContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const svgContainerRef = useRef<HTMLDivElement>(null);

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

  // Construct a dependency that EXCLUDES padding
  // This allows us to re-fetch only when necessary (theme, type, etc), but not when dragging sliders
  const fetchTrigger = useMemo(() => {
    const {
      paddingTop, paddingRight, paddingBottom, paddingLeft,
      width, height, // we might want to refetch on size change, but let's try client update first?
      ...rest
    } = config;
    return JSON.stringify({ ...rest, quote, apiEndpoint });
  }, [config, quote, apiEndpoint]);

  // But we still need the FULL params for the initial fetch to be correct
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

  // Fetch Logic
  useEffect(() => {
    const fetchImage = async () => {
      setIsLoading(true);
      setError(null);
      
      // Request raw SVG (no format=base64)
      const fullUrl = `${apiEndpoint}?${paramsUrl}`;
      
      try {
        const response = await fetch(fullUrl);
        
        if (response.ok) {
          const text = await response.text();
          if (text.trim().startsWith('<svg') || text.trim().startsWith('<?xml')) {
             setSvgContent(text);
          } else if (text.startsWith('data:')) {
             // Handle base64 fallback if needed
             const base64 = text.split(',')[1];
             setSvgContent(atob(base64));
          } else {
             // Fallback
             setSvgContent(text);
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
  }, [fetchTrigger]); // Only refetch when NON-padding props change

  // DOM Manipulation Logic for instant updates
  useEffect(() => {
     if (!svgContainerRef.current) return;
     const svg = svgContainerRef.current.querySelector('svg');
     if (!svg) return;

     const { paddingTop, paddingRight, paddingBottom, paddingLeft, width } = config;

     // 1. Update Main Group Transform
     const mainGroup = svg.querySelector('#main-content') || svg.querySelector('g[transform^="translate"]');
     if (mainGroup) {
         mainGroup.setAttribute('transform', `translate(${paddingLeft}, ${paddingTop})`);
     }

     // 2. Languages Card Specifics
     if (config.type === 'languages' && githubData?.languages) {
        const barWidth = width - paddingLeft - paddingRight;

        // Update container clipping rect
        const clipRect = svg.querySelector('#bar-clip-rect');
        if (clipRect) {
            clipRect.setAttribute('width', barWidth.toString());
        }

        // Recalculate segments
        // We need to re-implement the segment logic here to match backend
        const gapSize = 1; // hardcoded in backend
        const totalGapWidth = Math.max(0, githubData.languages.length - 1) * gapSize;
        const availableWidth = Math.max(0, barWidth - totalGapWidth);

        let currentX = 0;
        const segments = svg.querySelectorAll('.lang-segment');

        segments.forEach((segment, index) => {
            const lang = githubData.languages[index];
            if (lang) {
                const w = (lang.percentage / 100) * availableWidth;
                const finalW = Math.max(w, 0);

                segment.setAttribute('x', currentX.toString());
                segment.setAttribute('width', finalW.toString());

                if (finalW > 0) {
                    currentX += finalW + gapSize;
                }
            }
        });
     }

     // 3. Stats Card Specifics
     if (config.type === 'stats') {
         const contentWidth = width - paddingLeft - paddingRight;
         const colWidth = contentWidth / 4;

         // Assuming stats card has groups for each stat.
         // In backend: main-content -> g (stars), g (repos), g (followers), g (forks)
         // They have transforms: translate(0, 45), translate(colWidth, 45), etc.

         // Select direct children 'g' of mainGroup
         // We might need to select them by index or class if we added them.
         // Since we didn't add classes to stat groups in backend, we rely on child index or transform attribute assumption.
         // The backend outputs them in order.
         if (mainGroup) {
             const groups = Array.from(mainGroup.children).filter(el => el.tagName === 'g');
             if (groups.length >= 4) {
                 groups[0].setAttribute('transform', `translate(0, 45)`);
                 groups[1].setAttribute('transform', `translate(${colWidth}, 45)`);
                 groups[2].setAttribute('transform', `translate(${colWidth * 2}, 45)`);
                 groups[3].setAttribute('transform', `translate(${colWidth * 3}, 45)`);
             }
         }
     }

  }, [config.paddingTop, config.paddingLeft, config.paddingRight, config.paddingBottom, config.width, svgContent, githubData]);

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
      ) : svgContent ? (
        <div
            ref={svgContainerRef}
            className="max-w-full h-auto rounded-lg overflow-hidden"
            dangerouslySetInnerHTML={{ __html: svgContent }}
            style={{ maxWidth: `${config.width}px` }}
        />
      ) : (
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <span className="text-4xl">🖼️</span>
          <span className="text-sm">Generating card...</span>
        </div>
      )}
    </div>
  );
}
