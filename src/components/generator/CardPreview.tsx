import { CardConfig } from "@/pages/Generator";
import { GitHubStats } from "@/hooks/useGitHubStats";
import { DevQuote } from "@/hooks/useDevQuote";
import { useMemo, useState, useEffect } from "react";
import { TiltCard } from "@/components/ui/TiltCard";
import { Sparkles, Layers } from "lucide-react";
import { CreativeLoader } from "@/components/ui/CreativeLoader";
import { generateCardSVG, CardParams } from "@/lib/cardRenderer";

interface CardPreviewProps {
  config: CardConfig;
  githubData?: GitHubStats | null;
  quote?: DevQuote | null;
}

export function CardPreview({ config, githubData, quote }: CardPreviewProps) {
  const [imageSrc, setImageSrc] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  // Check if we need a username
  const needsUsername = !config.username && config.type !== "quote" && config.type !== "custom" && config.type !== "banner";

  useEffect(() => {
    if (needsUsername) {
      setImageSrc("");
      return;
    }

    setIsLoading(true);

    try {
      const cardParams: CardParams = {
        type: config.type,
        username: config.username || "developer",
        theme: config.theme,
        bgColor: config.bgColor,
        primaryColor: config.primaryColor,
        secondaryColor: config.secondaryColor,
        textColor: config.textColor,
        borderColor: config.borderColor,
        borderRadius: config.borderRadius,
        showBorder: config.showBorder,
        width: config.width,
        height: config.height,
        customText: config.customText,
        animate: config.animation !== "none",
        animation: config.animation,
        speed: config.animationSpeed,
        gradient: config.gradientEnabled,
        gradientType: config.gradientType,
        gradientAngle: config.gradientAngle,
        gradientStart: config.gradientStart,
        gradientEnd: config.gradientEnd,
        bannerName: config.bannerName,
        bannerDescription: config.bannerDescription,
        waveStyle: config.waveStyle,
        quoteTopic: config.quoteTopic,
        repo: config.repo,
        customDescription: config.customDescription,
        showOwner: config.showOwner,
      };

      if (githubData) {
        cardParams.stats = {
          totalStars: githubData.stats.totalStars,
          publicRepos: githubData.stats.publicRepos,
          followers: githubData.stats.followers,
          totalForks: githubData.stats.totalForks,
        };
        cardParams.languages = githubData.languages;
        cardParams.streak = githubData.streak;
        cardParams.activity = githubData.activity;
      }

      if (quote) {
        cardParams.quote = quote;
      }

      const svg = generateCardSVG(cardParams);
      const base64 = btoa(unescape(encodeURIComponent(svg)));
      setImageSrc(`data:image/svg+xml;base64,${base64}`);
    } catch (err) {
      console.error("Error generating local card preview:", err);
    } finally {
      setIsLoading(false);
    }
  }, [config, githubData, quote, needsUsername]);

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
