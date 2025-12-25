import { CardConfig } from "@/pages/Generator";
import { GitHubStats } from "@/hooks/useGitHubStats";
import { DevQuote } from "@/hooks/useDevQuote";
import { useMemo } from "react";

interface CardPreviewProps {
  config: CardConfig;
  githubData?: GitHubStats | null;
  quote?: DevQuote | null;
}

export function CardPreview({ config, githubData, quote }: CardPreviewProps) {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

  // Detect if self-hosted (Vercel) or using Lovable Cloud
  const isVercel = !window.location.hostname.includes('lovable.app') && !window.location.hostname.includes('localhost');
  
  const baseUrl = isVercel ? window.location.origin : supabaseUrl;
  const apiPath = isVercel ? '/api/card' : '/functions/v1/generate-card';

  // Build the image URL
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

    // Add cache-busting for quotes
    if (config.type === "quote") {
      params.set("t", Date.now().toString());
    }

    return `${baseUrl}${apiPath}?${params.toString()}`;
  }, [config, baseUrl, apiPath, quote]);

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

  return (
    <div className="flex justify-center items-center min-h-[200px]">
      <img 
        src={imageUrl}
        alt={`${config.type} card preview`}
        style={{ maxWidth: `${config.width}px` }}
        className="max-w-full h-auto rounded-lg"
      />
    </div>
  );
}
