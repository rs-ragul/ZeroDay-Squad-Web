import { Layout } from "@/components/layout/Layout";
import { CyberCard } from "@/components/cyber/CyberCard";
import { HexagonCard } from "@/components/cyber/HexagonCard";
import { useAchievements } from "@/hooks/useAchievements";
import { useSiteStats } from "@/hooks/useSiteStats";
import { Trophy, Award, Target, Flag, Calendar, Medal, Star, Shield, Terminal } from "lucide-react";
import { Link } from "react-router-dom";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Trophy,
  Award,
  Target,
  Flag,
  Medal,
  Star,
  Shield,
};

const typeColors: Record<string, { bg: string; text: string; border: string }> = {
  competition: {
    bg: "bg-primary/10",
    text: "text-primary",
    border: "border-primary/50",
  },
  recognition: {
    bg: "bg-secondary/10",
    text: "text-secondary",
    border: "border-secondary/50",
  },
  ranking: {
    bg: "bg-accent/10",
    text: "text-accent",
    border: "border-accent/50",
  },
  discovery: {
    bg: "bg-orange-500/10",
    text: "text-orange-500",
    border: "border-orange-500/50",
  },
  certification: {
    bg: "bg-blue-500/10",
    text: "text-blue-500",
    border: "border-blue-500/50",
  },
};

export default function Achievements() {
  const { data: achievements, isLoading } = useAchievements();
  const { data: stats } = useSiteStats();

  const highlightedAchievements = achievements?.filter((a) => a.is_highlighted) || [];

  return (
    <Layout>
      <section className="py-20 px-4">
        <div className="container mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-card/80 border border-secondary/30 rounded-full mb-6">
              <Trophy className="w-4 h-4 text-secondary" />
              <span className="text-sm font-mono text-muted-foreground">
                Hall of Fame
              </span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              <span className="text-secondary">#</span> Achievements
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our proudest moments in cybersecurity competitions, bug bounties, and research
            </p>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <Terminal className="w-8 h-8 text-primary mx-auto mb-4 animate-pulse" />
              <p className="text-muted-foreground font-mono">Loading achievements...</p>
            </div>
          ) : achievements && achievements.length > 0 ? (
            <>
              {/* Featured Achievements */}
              {highlightedAchievements.length > 0 && (
                <div className="flex flex-wrap justify-center gap-8 mb-16">
                  {highlightedAchievements.map((achievement) => {
                    const IconComponent = iconMap[achievement.icon || "Trophy"] || Trophy;
                    return (
                      <HexagonCard
                        key={achievement.id}
                        className="w-64 h-72 flex items-center justify-center p-6"
                        glowColor={achievement.achievement_type === "competition" ? "primary" : "secondary"}
                      >
                        <div className="text-center">
                          <IconComponent
                            className={`w-12 h-12 mx-auto mb-4 ${
                              achievement.achievement_type === "competition"
                                ? "text-primary"
                                : "text-secondary"
                            }`}
                          />
                          <h3 className="font-display font-semibold text-foreground mb-2 text-sm">
                            {achievement.title}
                          </h3>
                          <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2">
                            {achievement.description}
                          </p>
                          {achievement.is_team_achievement ? (
                            achievement.members && achievement.members.length > 0 && (
                              <div className="mt-2 text-xs text-secondary">
                                {achievement.members.map((m, i) => (
                                  <Link
                                    key={m.id}
                                    to={`/member/${m.id}`}
                                    className="hover:underline"
                                  >
                                    @{m.username}
                                    {i < achievement.members!.length - 1 && ", "}
                                  </Link>
                                ))}
                              </div>
                            )
                          ) : (
                            achievement.owner && (
                              <div className="mt-2 text-xs text-secondary">
                                <span className="text-muted-foreground">Posted by </span>
                                <Link
                                  to={`/member/${achievement.owner.id}`}
                                  className="hover:underline"
                                >
                                  @{achievement.owner.username}
                                </Link>
                              </div>
                            )
                          )}
                        </div>
                      </HexagonCard>
                    );
                  })}
                </div>
              )}

              {/* All Achievements */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {achievements.map((achievement, index) => {
                  const colors = typeColors[achievement.achievement_type] || typeColors.competition;
                  const IconComponent = iconMap[achievement.icon || "Trophy"] || Trophy;
                  return (
                    <Link to={`/achievement/${achievement.id}`} key={achievement.id}>
                      <CyberCard
                        className="animate-fade-in hover:scale-[1.02] transition-all duration-300 h-full"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                      <div className="flex items-start gap-4">
                        <div
                          className={`w-12 h-12 flex items-center justify-center rounded-lg ${colors.bg} ${colors.border} border shrink-0`}
                        >
                          <IconComponent className={`w-6 h-6 ${colors.text}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-display font-semibold text-foreground truncate">
                              {achievement.title}
                            </h3>
                            {achievement.is_highlighted && (
                              <span className="text-secondary text-lg">★</span>
                            )}
                          </div>
                          <p className="text-muted-foreground text-sm mb-2 line-clamp-2">
                            {achievement.description}
                          </p>
                          {achievement.is_team_achievement ? (
                            achievement.members && achievement.members.length > 0 && (
                              <div className="text-xs text-secondary mb-2">
                                Team: {achievement.members.map((m, i) => (
                                  <Link
                                    key={m.id}
                                    to={`/member/${m.id}`}
                                    className="hover:underline"
                                  >
                                    @{m.username}
                                    {i < achievement.members!.length - 1 && ", "}
                                  </Link>
                                ))}
                              </div>
                            )
                          ) : (
                            achievement.owner && (
                              <div className="text-xs text-secondary mb-2">
                                <span className="text-muted-foreground">Posted by </span>
                                <Link
                                  to={`/member/${achievement.owner.id}`}
                                  className="hover:underline"
                                >
                                  @{achievement.owner.username}
                                </Link>
                              </div>
                            )
                          )}
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Calendar className="w-3 h-3" />
                            <span className="font-mono">
                              {achievement.achievement_date
                                ? new Date(achievement.achievement_date).toLocaleDateString("en-US", {
                                    month: "long",
                                    year: "numeric",
                                  })
                                : "—"}
                            </span>
                            <span className="text-primary">|</span>
                            <span className={`font-mono uppercase ${colors.text}`}>
                              {achievement.achievement_type}
                            </span>
                          </div>
                        </div>
                        </div>
                      </CyberCard>
                    </Link>
                  );
                })}
              </div>
            </>
          ) : (
            <CyberCard variant="terminal" className="text-center p-12">
              <Terminal className="w-12 h-12 text-primary mx-auto mb-4" />
              <p className="text-muted-foreground font-mono">
                No achievements found. Achievements are added by admin and members.
              </p>
            </CyberCard>
          )}

          {/* Stats */}
          {stats && stats.length > 0 && (
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat) => (
                <CyberCard key={stat.id} className="text-center py-6">
                  <div className="font-display text-3xl font-bold text-primary cyber-text-glow mb-1">
                    {stat.stat_value}
                  </div>
                  <div className="text-muted-foreground text-sm font-mono uppercase">
                    {stat.stat_label}
                  </div>
                </CyberCard>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
