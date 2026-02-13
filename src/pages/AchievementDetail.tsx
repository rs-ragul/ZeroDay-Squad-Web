import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { CyberCard } from "@/components/cyber/CyberCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAchievements } from "@/hooks/useAchievements";
import {
  Trophy,
  Award,
  Target,
  Flag,
  Medal,
  Star,
  Shield,
  Terminal,
  Users,
  ArrowLeft,
  Calendar,
} from "lucide-react";

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

export default function AchievementDetail() {
  const { id } = useParams();
  const { data: achievements, isLoading } = useAchievements();

  const achievement = achievements?.find((a) => a.id === id);

  if (isLoading) {
    return (
      <Layout>
        <section className="min-h-[85vh] flex items-center justify-center">
          <div className="text-center">
            <Terminal className="w-12 h-12 text-primary mx-auto mb-4 animate-pulse" />
            <p className="text-muted-foreground font-mono">
              Loading achievement...
            </p>
          </div>
        </section>
      </Layout>
    );
  }

  if (!achievement) {
    return (
      <Layout>
        <section className="min-h-[85vh] flex items-center justify-center px-4">
          <CyberCard variant="terminal" className="text-center p-12 max-w-md">
            <Terminal className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-xl font-display font-bold text-foreground mb-2">
              Achievement Not Found
            </h2>
            <p className="text-muted-foreground font-mono mb-6">
              The achievement you're looking for doesn't exist.
            </p>
            <Link to="/achievements">
              <Button variant="cyber">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Achievements
              </Button>
            </Link>
          </CyberCard>
        </section>
      </Layout>
    );
  }

  const IconComponent = iconMap[achievement.icon || "Trophy"] || Trophy;
  const colors = typeColors[achievement.achievement_type] || typeColors.competition;

  return (
    <Layout>
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Back Button */}
          <Link to="/achievements" className="inline-block mb-8">
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Achievements
            </Button>
          </Link>

          {/* Achievement Image */}
          {achievement.image_url && (
            <div className="mb-8 rounded-lg overflow-hidden border border-primary/20">
              <img
                src={achievement.image_url}
                alt={achievement.title}
                className="w-full h-64 md:h-96 object-cover"
              />
            </div>
          )}

          {/* Achievement Card */}
          <CyberCard variant="glow" className="p-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
              <div className="flex items-start gap-4">
                <div
                  className={`w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-lg ${colors.bg} ${colors.border} border-2 shrink-0`}
                >
                  <IconComponent className={`w-8 h-8 sm:w-10 sm:h-10 ${colors.text}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
                      {achievement.title}
                    </h1>
                    {achievement.is_highlighted && (
                      <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                    )}
                  </div>
                  <div className="flex flex-wrap gap-4">
                    <Badge
                      variant="outline"
                      className={`${colors.text} ${colors.border} uppercase`}
                    >
                      {achievement.achievement_type}
                    </Badge>
                    {achievement.achievement_date && (
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm font-mono">
                          {new Date(achievement.achievement_date).toLocaleDateString(
                            "en-US",
                            {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              {achievement.description || "No description provided"}
            </p>

            {/* Team Members or Owner */}
            {achievement.is_team_achievement &&
              achievement.members &&
              achievement.members.length > 0 ? (
                <div className="pt-6 border-t border-primary/20">
                  <div className="flex items-center gap-2 mb-4">
                    <Users className="w-5 h-5 text-secondary" />
                    <span className="font-display font-semibold text-foreground">
                      Team Members
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {achievement.members.map((member) => (
                      <Link
                        key={member.id}
                        to={`/member/${member.id}`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 border border-secondary/30 rounded-full hover:bg-secondary/20 transition-colors"
                      >
                        {member.avatar_url ? (
                          <img
                            src={member.avatar_url}
                            alt={member.username || "Member"}
                            className="w-6 h-6 rounded-full"
                          />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-secondary/30" />
                        )}
                        <span className="text-sm text-secondary">
                          @{member.username || member.email?.split("@")[0]}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                achievement.owner && (
                  <div className="pt-6 border-t border-primary/20">
                    <div className="flex items-center gap-2 mb-4">
                      <Users className="w-5 h-5 text-secondary" />
                      <span className="font-display font-semibold text-foreground">
                        Owner
                      </span>
                    </div>
                    <Link
                      to={`/member/${achievement.owner.id}`}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 border border-secondary/30 rounded-full hover:bg-secondary/20 transition-colors"
                    >
                      {achievement.owner.avatar_url ? (
                        <img
                          src={achievement.owner.avatar_url}
                          alt={achievement.owner.username || "Owner"}
                          className="w-6 h-6 rounded-full"
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-secondary/30" />
                      )}
                      <span className="text-sm text-secondary">
                        @{achievement.owner.username || achievement.owner.email?.split("@")[0]}
                      </span>
                    </Link>
                  </div>
                )
              )}
          </CyberCard>
        </div>
      </section>
    </Layout>
  );
}
