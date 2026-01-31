import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

export function CardSkeleton({ className }: { className?: string }) {
  // Generate random heights and opacities once
  const bars = useMemo(() => {
    return Array.from({ length: 20 }, () => ({
      height: `${Math.random() * 100}%`,
      opacity: 0.3 + Math.random() * 0.5,
    }));
  }, []);

  return (
    <div className={cn("relative w-[495px] h-[195px] rounded-xl overflow-hidden bg-background/50 border border-border/50", className)}>
      {/* Background Shimmer */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent animate-pulse" />

      <div className="relative z-10 p-6 flex flex-col h-full justify-between">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Skeleton className="w-12 h-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="space-y-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-5 w-12" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-5 w-12" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-5 w-12" />
          </div>
        </div>

        {/* Bottom Graph/Footer Area */}
        <div className="mt-auto pt-4 flex items-end gap-1 h-12">
           {bars.map((bar, i) => (
             <Skeleton
               key={i}
               className="w-full rounded-sm"
               style={{
                 height: bar.height,
                 opacity: bar.opacity
               }}
             />
           ))}
        </div>
      </div>
    </div>
  );
}
