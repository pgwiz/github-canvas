import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Star, GitCommit, GitPullRequest, Flame, LucideIcon } from "lucide-react";

type WidgetType = 'stats' | 'streak' | 'languages' | 'activity';

interface PreviewWidgetProps {
  type: WidgetType;
  className?: string;
}

export function PreviewWidget({ type, className }: PreviewWidgetProps) {
  if (type === 'stats') return <StatsWidget className={className} />;
  if (type === 'streak') return <StreakWidget className={className} />;
  if (type === 'languages') return <LanguagesWidget className={className} />;
  return <ActivityWidget className={className} />;
}

function StatsWidget({ className }: { className?: string }) {
  return (
    <div className={cn("w-full h-full flex flex-col justify-center gap-3 p-4", className)}>
      <StatRow icon={Star} label="Total Stars" value="1,234" delay={0} />
      <StatRow icon={GitCommit} label="Total Commits" value="8,432" delay={0.1} />
      <StatRow icon={GitPullRequest} label="Total PRs" value="432" delay={0.2} />
    </div>
  );
}

function StatRow({ icon: Icon, label, value, delay }: { icon: LucideIcon, label: string, value: string, delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="flex items-center justify-between"
    >
      <div className="flex items-center gap-2 text-muted-foreground text-xs">
        <Icon className="w-3 h-3" />
        <span>{label}</span>
      </div>
      <span className="font-mono font-bold text-foreground text-sm">{value}</span>
    </motion.div>
  )
}

function StreakWidget({ className }: { className?: string }) {
  return (
    <div className={cn("w-full h-full flex flex-col items-center justify-center p-4", className)}>
      <motion.div
        animate={{ scale: [1, 1.1, 1], filter: ["brightness(1)", "brightness(1.2)", "brightness(1)"] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="relative"
      >
        <Flame className="w-12 h-12 text-orange-500 fill-orange-500/20" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-2 text-center"
      >
        <div className="text-2xl font-bold">14 Days</div>
        <div className="text-xs text-muted-foreground">Current Streak</div>
      </motion.div>
    </div>
  )
}

function LanguagesWidget({ className }: { className?: string }) {
  return (
    <div className={cn("w-full h-full flex flex-col justify-center gap-4 p-4", className)}>
      <div className="flex h-3 w-full overflow-hidden rounded-full bg-secondary/20">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: "45%" }}
          transition={{ duration: 1, delay: 0.2 }}
          className="h-full bg-blue-500"
        />
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: "30%" }}
          transition={{ duration: 1, delay: 0.4 }}
          className="h-full bg-yellow-500"
        />
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: "25%" }}
          transition={{ duration: 1, delay: 0.6 }}
          className="h-full bg-pink-500"
        />
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs">
         <LangItem color="bg-blue-500" label="TypeScript" percent="45%" delay={0.3} />
         <LangItem color="bg-yellow-500" label="JavaScript" percent="30%" delay={0.5} />
         <LangItem color="bg-pink-500" label="Sass" percent="15%" delay={0.7} />
         <LangItem color="bg-gray-500" label="Other" percent="10%" delay={0.9} />
      </div>
    </div>
  )
}

function LangItem({ color, label, percent, delay }: { color: string, label: string, percent: string, delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ delay }}
      className="flex items-center gap-2"
    >
      <div className={`w-2 h-2 rounded-full ${color}`} />
      <span className="text-muted-foreground">{label} ({percent})</span>
    </motion.div>
  )
}

function ActivityWidget({ className }: { className?: string }) {
  return (
    <div className={cn("w-full h-full flex items-end justify-between gap-1 p-4 pb-2", className)}>
      {[40, 70, 30, 80, 50, 90, 60, 45, 75, 55].map((h, i) => (
        <motion.div
          key={i}
          initial={{ height: 0 }}
          whileInView={{ height: `${h}%` }}
          transition={{ duration: 0.5, delay: i * 0.05 }}
          className="w-full bg-primary/40 rounded-t-sm hover:bg-primary/60 transition-colors"
        />
      ))}
    </div>
  )
}
