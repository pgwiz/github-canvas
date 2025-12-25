import { CardConfig } from "@/pages/Generator";
import { GitHubStats } from "@/hooks/useGitHubStats";
import { DevQuote } from "@/hooks/useDevQuote";

interface CardPreviewProps {
  config: CardConfig;
  githubData?: GitHubStats | null;
  quote?: DevQuote | null;
}

const mockData = {
  stats: {
    stars: 1234,
    commits: 5678,
    repos: 56,
    followers: 789,
    prs: 234,
  },
  languages: [
    { name: "TypeScript", percentage: 45, color: "#3178C6" },
    { name: "Python", percentage: 25, color: "#3776AB" },
    { name: "Rust", percentage: 15, color: "#DEA584" },
    { name: "Go", percentage: 10, color: "#00ADD8" },
    { name: "Other", percentage: 5, color: "#8B8B8B" },
  ],
  streak: {
    current: 15,
    longest: 87,
    total: 2451,
  },
};

const defaultQuotes = [
  { quote: "Code is poetry.", author: "Automattic" },
  { quote: "First, solve the problem. Then, write the code.", author: "John Johnson" },
  { quote: "Any fool can write code that a computer can understand.", author: "Martin Fowler" },
  { quote: "Talk is cheap. Show me the code.", author: "Linus Torvalds" },
];

export function CardPreview({ config, githubData, quote }: CardPreviewProps) {
  const displayQuote = quote || defaultQuotes[Math.floor(Math.random() * defaultQuotes.length)];

  // Use real data if available, otherwise use mock data
  const stats = githubData?.stats || mockData.stats;
  const languages = githubData?.languages || mockData.languages;
  const streak = githubData?.streak || mockData.streak;
  const activity = githubData?.activity || Array.from({ length: 30 }, () => Math.floor(Math.random() * 15));

  const cardStyle = {
    backgroundColor: config.bgColor,
    color: config.textColor,
    borderRadius: `${config.borderRadius}px`,
    border: config.showBorder ? `2px solid ${config.borderColor}` : "none",
    width: "100%",
    maxWidth: `${config.width}px`,
    minHeight: `${config.height}px`,
  };

  const renderContent = () => {
    switch (config.type) {
      case "stats":
        return (
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center text-2xl overflow-hidden"
                style={{ backgroundColor: `${config.primaryColor}20` }}
              >
                {githubData?.user.avatar_url ? (
                  <img 
                    src={githubData.user.avatar_url} 
                    alt={githubData.user.login}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  "👤"
                )}
              </div>
              <div>
                <h3 className="font-bold text-lg" style={{ color: config.primaryColor }}>
                  {config.username || "username"}'s GitHub Stats
                </h3>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <StatItem 
                icon="⭐" 
                label="Total Stars" 
                value={'totalStars' in stats ? stats.totalStars : stats.stars}
                color={config.primaryColor}
              />
              <StatItem 
                icon="📦" 
                label="Repositories" 
                value={'publicRepos' in stats ? stats.publicRepos : stats.repos}
                color={config.secondaryColor}
              />
              <StatItem 
                icon="🔀" 
                label="Total Forks" 
                value={'totalForks' in stats ? stats.totalForks : 0}
                color={config.primaryColor}
              />
              <StatItem 
                icon="👥" 
                label="Followers" 
                value={stats.followers}
                color={config.secondaryColor}
              />
            </div>
          </div>
        );

      case "languages":
        return (
          <div className="p-6">
            <h3 className="font-bold text-lg mb-4" style={{ color: config.primaryColor }}>
              Most Used Languages
            </h3>
            <div className="space-y-3">
              {languages.slice(0, 5).map((lang, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{lang.name}</span>
                    <span style={{ color: config.secondaryColor }}>{lang.percentage}%</span>
                  </div>
                  <div 
                    className="h-2 rounded-full overflow-hidden"
                    style={{ backgroundColor: `${config.primaryColor}20` }}
                  >
                    <div 
                      className="h-full rounded-full transition-all"
                      style={{ 
                        width: `${lang.percentage}%`,
                        backgroundColor: lang.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "streak":
        return (
          <div className="p-6 text-center">
            <h3 className="font-bold text-lg mb-6" style={{ color: config.primaryColor }}>
              🔥 Contribution Streak
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div 
                  className="text-3xl font-bold mb-1"
                  style={{ color: config.secondaryColor }}
                >
                  {streak.current}
                </div>
                <div className="text-xs opacity-70">Current Streak</div>
              </div>
              <div>
                <div 
                  className="text-3xl font-bold mb-1"
                  style={{ color: config.primaryColor }}
                >
                  {streak.longest}
                </div>
                <div className="text-xs opacity-70">Longest Streak</div>
              </div>
              <div>
                <div 
                  className="text-3xl font-bold mb-1"
                  style={{ color: config.secondaryColor }}
                >
                  {streak.total.toLocaleString()}
                </div>
                <div className="text-xs opacity-70">Total Commits</div>
              </div>
            </div>
          </div>
        );

      case "activity":
        return (
          <div className="p-6">
            <h3 className="font-bold text-lg mb-4" style={{ color: config.primaryColor }}>
              Activity Graph
            </h3>
            <div className="flex items-end gap-1 h-24">
              {activity.map((value, i) => {
                const maxValue = Math.max(...activity, 1);
                const height = (value / maxValue) * 100;
                return (
                  <div
                    key={i}
                    className="flex-1 rounded-sm transition-all hover:opacity-80"
                    style={{
                      height: `${height}%`,
                      backgroundColor: height > 60 
                        ? config.primaryColor 
                        : height > 30 
                          ? config.secondaryColor 
                          : `${config.primaryColor}40`,
                    }}
                  />
                );
              })}
            </div>
            <div className="flex justify-between text-xs mt-2 opacity-50">
              <span>30 days ago</span>
              <span>Today</span>
            </div>
          </div>
        );

      case "quote":
        return (
          <div className="p-6 flex flex-col items-center justify-center text-center h-full">
            <div className="text-4xl mb-4" style={{ color: config.primaryColor }}>💬</div>
            <p className="text-lg italic mb-3" style={{ color: config.textColor }}>
              "{displayQuote.quote}"
            </p>
            <p className="text-sm" style={{ color: config.secondaryColor }}>
              — {displayQuote.author}
            </p>
          </div>
        );

      case "custom":
        return (
          <div className="p-6 flex items-center justify-center h-full">
            <p 
              className="text-xl font-bold text-center"
              style={{ color: config.primaryColor }}
            >
              {config.customText || "Your custom text here"}
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex justify-center">
      <div 
        className="transition-all duration-300"
        style={cardStyle}
      >
        {renderContent()}
      </div>
    </div>
  );
}

function StatItem({ 
  icon, 
  label, 
  value, 
  color 
}: { 
  icon: string; 
  label: string; 
  value: number;
  color: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xl">{icon}</span>
      <div>
        <div className="font-bold" style={{ color }}>{value.toLocaleString()}</div>
        <div className="text-xs opacity-70">{label}</div>
      </div>
    </div>
  );
}
