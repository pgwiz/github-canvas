import { GlassPanel, GlassInnerPanel } from "@/components/ui/GlassPanel";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  ArrowRight, 
  BarChart3, 
  Code2, 
  Flame, 
  Activity, 
  Quote, 
  Sparkles, 
  Star, 
  GitCommit, 
  GitPullRequest, 
  GitFork, 
  CheckCircle2,
  SlidersHorizontal
} from "lucide-react";
import { TiltCard } from "@/components/ui/TiltCard";

interface CardTypeItem {
  id: "stats" | "languages" | "streak" | "activity" | "quote" | "banner";
  name: string;
  description: string;
  accent: "blue" | "teal" | "purple";
  icon: typeof BarChart3;
  badge: string;
  renderPreview: () => JSX.Element;
}

export function CardTypesSection() {
  const cardTypes: CardTypeItem[] = [
    {
      id: "stats",
      name: "User Stats Card",
      description: "Display total stars, commits, PRs, issues, and repositories with custom themes",
      accent: "blue",
      icon: BarChart3,
      badge: "Most Popular",
      renderPreview: () => (
        <div className="w-full h-full p-4 flex flex-col justify-between font-mono">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="text-xs font-semibold text-primary">octocat's GitHub Stats</span>
            <span className="text-[10px] text-white/40">A+ Rank</span>
          </div>
          <div className="grid grid-cols-2 gap-3 py-2">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <div>
                <div className="text-sm font-bold text-white">1,842</div>
                <div className="text-[9px] text-white/50">Total Stars</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <GitCommit className="w-4 h-4 text-blue-400" />
              <div>
                <div className="text-sm font-bold text-white">3,249</div>
                <div className="text-[9px] text-white/50">Commits</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <GitPullRequest className="w-4 h-4 text-indigo-400" />
              <div>
                <div className="text-sm font-bold text-white">218</div>
                <div className="text-[9px] text-white/50">Pull Requests</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <GitFork className="w-4 h-4 text-cyan-400" />
              <div>
                <div className="text-sm font-bold text-white">412</div>
                <div className="text-[9px] text-white/50">Forks</div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "languages",
      name: "Language Breakdown",
      description: "Showcase your top programming languages with proportionate visual progress bars",
      accent: "purple",
      icon: Code2,
      badge: "Multi-Language",
      renderPreview: () => (
        <div className="w-full h-full p-4 flex flex-col justify-between font-mono">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="text-xs font-semibold text-purple-400">Top Languages</span>
            <span className="text-[10px] text-white/40">6 Tracked</span>
          </div>
          {/* Stacked multi-color progress bar */}
          <div className="w-full h-2 rounded-full overflow-hidden flex my-2 bg-white/5">
            <div className="bg-blue-500 h-full" style={{ width: '45%' }} />
            <div className="bg-cyan-400 h-full" style={{ width: '25%' }} />
            <div className="bg-amber-400 h-full" style={{ width: '15%' }} />
            <div className="bg-purple-500 h-full" style={{ width: '15%' }} />
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[10px]">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500" /> TypeScript</span>
              <span className="text-white/60">45%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-cyan-400" /> Python</span>
              <span className="text-white/60">25%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-400" /> Rust</span>
              <span className="text-white/60">15%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-purple-500" /> Go</span>
              <span className="text-white/60">15%</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "streak",
      name: "Contribution Streak",
      description: "Track consecutive coding activity, current streak, and all-time records",
      accent: "teal",
      icon: Flame,
      badge: "Gamified",
      renderPreview: () => (
        <div className="w-full h-full p-4 flex flex-col justify-between font-mono">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="text-xs font-semibold text-secondary flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-secondary" /> Daily Streak
            </span>
            <span className="text-[10px] text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Active Today
            </span>
          </div>
          <div className="flex items-center justify-between py-2">
            <div className="text-center">
              <div className="text-lg font-extrabold text-secondary">28 Days</div>
              <div className="text-[9px] text-white/50 uppercase tracking-wider">Current Streak</div>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div className="text-center">
              <div className="text-lg font-extrabold text-white">142 Days</div>
              <div className="text-[9px] text-white/50 uppercase tracking-wider">Longest Streak</div>
            </div>
          </div>
          <div className="flex gap-1.5 justify-between">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="h-2 flex-1 rounded-sm"
                style={{
                  backgroundColor: i > 9 ? '#0ea5e9' : i > 5 ? '#38bdf8' : '#0284c7',
                  opacity: 0.3 + (i * 0.06),
                }}
              />
            ))}
          </div>
        </div>
      ),
    },
    {
      id: "activity",
      name: "Activity Graph",
      description: "Visualize weekly commits and activity trendlines with smooth vector curves",
      accent: "teal",
      icon: Activity,
      badge: "Trends",
      renderPreview: () => (
        <div className="w-full h-full p-4 flex flex-col justify-between font-mono">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="text-xs font-semibold text-cyan-400">Weekly Commits</span>
            <span className="text-[10px] text-white/40">Last 12 Weeks</span>
          </div>
          {/* Mini Sparkline Chart */}
          <div className="py-2">
            <svg viewBox="0 0 200 45" className="w-full h-10 overflow-visible">
              <defs>
                <linearGradient id="sparklineGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M 0 35 Q 20 30, 40 20 T 80 25 T 120 10 T 160 18 T 200 8 L 200 45 L 0 45 Z"
                fill="url(#sparklineGrad)"
              />
              <path
                d="M 0 35 Q 20 30, 40 20 T 80 25 T 120 10 T 160 18 T 200 8"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2"
              />
              <circle cx="200" cy="8" r="3" fill="#38bdf8" />
            </svg>
          </div>
          <div className="flex justify-between text-[10px] text-white/50">
            <span>May: 32</span>
            <span>Jun: 68</span>
            <span>Jul: 94</span>
            <span className="text-cyan-400 font-bold">Aug: 142</span>
          </div>
        </div>
      ),
    },
    {
      id: "quote",
      name: "Developer Quotes",
      description: "AI-curated inspirational quotes and programming wisdom for your profile",
      accent: "purple",
      icon: Quote,
      badge: "AI Powered",
      renderPreview: () => (
        <div className="w-full h-full p-4 flex flex-col justify-between font-mono">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="text-xs font-semibold text-purple-400 flex items-center gap-1.5">
              <Quote className="w-3.5 h-3.5" /> Quote of the Day
            </span>
            <span className="text-[10px] text-purple-300/70">#debugging</span>
          </div>
          <div className="py-2.5">
            <p className="text-xs text-white/90 italic font-sans leading-relaxed">
              "First, solve the problem. Then, write the code."
            </p>
          </div>
          <div className="text-right text-[10px] text-secondary font-medium">
            — John Johnson
          </div>
        </div>
      ),
    },
    {
      id: "banner",
      name: "Profile Banner",
      description: "High-resolution hero header with animated waves, custom title, and developer bio",
      accent: "blue",
      icon: Sparkles,
      badge: "Header Hero",
      renderPreview: () => (
        <div className="w-full h-full p-4 flex flex-col justify-between font-mono bg-gradient-to-r from-blue-900/20 via-cyan-900/10 to-transparent">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="text-xs font-semibold text-primary">Alex Mercer</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/20 text-primary">OPEN TO WORK</span>
          </div>
          <div className="py-2">
            <div className="text-xs font-bold text-white font-sans">Full Stack Architect & Cloud Engineer</div>
            <div className="text-[10px] text-white/60 mt-0.5">Distributed Systems • Next.js • Go</div>
          </div>
          <div className="flex items-center justify-between text-[10px] text-white/40 pt-1 border-t border-white/5">
            <span>github.com/alex</span>
            <span className="text-primary">Ready to deploy</span>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section className="py-24 relative bg-muted/10 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 mb-4 backdrop-blur-sm">
            <SlidersHorizontal className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium text-primary uppercase tracking-wider">Diverse Catalog</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">6 Card Types</span> to Choose From
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Each fully customizable with rich themes, custom colors, animation styles, and dynamic layouts
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {cardTypes.map((card, index) => {
            const IconComponent = card.icon;
            return (
              <div
                key={card.id}
                className="animate-in fade-in slide-in-from-bottom-8 fill-mode-backwards"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <TiltCard className="h-full">
                  <GlassPanel hover accent={card.accent} className="h-full flex flex-col justify-between group">
                    <div>
                      {/* Interactive Visual Preview Box */}
                      <GlassInnerPanel accent={card.accent} className="h-36 mb-4 group-hover:scale-[1.01] transition-all duration-300 bg-background/40">
                        {card.renderPreview()}
                      </GlassInnerPanel>

                      {/* Header and description */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                            <IconComponent className="w-4 h-4 text-primary" />
                          </div>
                          <h3 className="text-base font-semibold text-white">
                            {card.name}
                          </h3>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/60">
                          {card.badge}
                        </span>
                      </div>
                      
                      <p className="text-xs text-white/60 leading-relaxed mb-4">
                        {card.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                      <Link
                        to={`/generator?type=${card.id}`}
                        className="text-xs font-medium text-primary hover:text-primary/80 inline-flex items-center gap-1.5 transition-colors group-hover:translate-x-0.5"
                      >
                        Customize {card.name}
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                      <span className="text-[10px] text-white/40 font-mono">SVG • Ready</span>
                    </div>
                  </GlassPanel>
                </TiltCard>
              </div>
            );
          })}
        </div>

        <div className="text-center animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild size="lg" className="group px-8 bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link to="/generator">
              Launch Card Generator
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="px-8 border-white/10 hover:bg-white/5">
            <Link to="/themes">
              Browse All Themes
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
