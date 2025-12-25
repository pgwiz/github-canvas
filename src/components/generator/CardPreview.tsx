import { CardConfig } from "@/pages/Generator";
import { GitHubStats } from "@/hooks/useGitHubStats";
import { DevQuote } from "@/hooks/useDevQuote";
import { useState, useEffect, useMemo } from "react";
import { Loader2 } from "lucide-react";

interface CardPreviewProps {
  config: CardConfig;
  githubData?: GitHubStats | null;
  quote?: DevQuote | null;
}

export function CardPreview({ config, githubData, quote }: CardPreviewProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [svgUrl, setSvgUrl] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

  // Build the image URL - same as LinkGenerator
  const imageUrl = useMemo(() => {
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
      width: config.width.toString(),
      height: config.height.toString(),
    });

    if (config.customText) {
      params.set("customText", config.customText);
    }

    return `${supabaseUrl}/functions/v1/generate-card?${params.toString()}`;
  }, [config, supabaseUrl]);

  // Fetch the SVG whenever config changes
  useEffect(() => {
    const fetchSvg = async () => {
      // Don't fetch for stats/languages/streak/activity without username
      if (!config.username && config.type !== "quote" && config.type !== "custom") {
        setError("Enter a GitHub username to preview");
        setSvgUrl("");
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Add cache-busting for quotes to get fresh content
        const url = config.type === "quote" 
          ? `${imageUrl}&t=${Date.now()}`
          : imageUrl;
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error("Failed to generate card");
        }

        const svgText = await response.text();
        
        // Create a blob URL for the SVG
        const blob = new Blob([svgText], { type: "image/svg+xml" });
        const blobUrl = URL.createObjectURL(blob);
        
        // Clean up previous blob URL
        if (svgUrl) {
          URL.revokeObjectURL(svgUrl);
        }
        
        setSvgUrl(blobUrl);
      } catch (err) {
        console.error("Error fetching SVG:", err);
        setError("Failed to generate preview");
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce the fetch to avoid too many requests
    const timeoutId = setTimeout(fetchSvg, 300);
    return () => clearTimeout(timeoutId);
  }, [imageUrl, config.type, config.username]);

  // Re-fetch when quote changes
  useEffect(() => {
    if (config.type === "quote" && quote) {
      const fetchQuoteSvg = async () => {
        setIsLoading(true);
        try {
          const url = `${imageUrl}&t=${Date.now()}`;
          const response = await fetch(url);
          
          if (response.ok) {
            const svgText = await response.text();
            const blob = new Blob([svgText], { type: "image/svg+xml" });
            const blobUrl = URL.createObjectURL(blob);
            
            if (svgUrl) {
              URL.revokeObjectURL(svgUrl);
            }
            
            setSvgUrl(blobUrl);
          }
        } catch (err) {
          console.error("Error fetching quote SVG:", err);
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchQuoteSvg();
    }
  }, [quote]);

  // Cleanup blob URL on unmount
  useEffect(() => {
    return () => {
      if (svgUrl) {
        URL.revokeObjectURL(svgUrl);
      }
    };
  }, []);

  return (
    <div className="flex justify-center items-center min-h-[200px]">
      {isLoading ? (
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="text-sm">Generating preview...</span>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <span className="text-4xl">📊</span>
          <span className="text-sm text-center">{error}</span>
        </div>
      ) : svgUrl ? (
        <img 
          src={svgUrl} 
          alt={`${config.type} card preview`}
          className="max-w-full h-auto rounded-lg"
          style={{ 
            maxWidth: `${config.width}px`,
            maxHeight: `${config.height + 50}px`
          }}
        />
      ) : (
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <span className="text-4xl">📊</span>
          <span className="text-sm">Enter details to preview</span>
        </div>
      )}
    </div>
  );
}
