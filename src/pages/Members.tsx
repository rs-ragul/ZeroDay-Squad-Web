import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { CyberCard } from "@/components/cyber/CyberCard";
import { Badge } from "@/components/ui/badge";
import { useProfilesWithRoles } from "@/hooks/useProfiles";
import { 
  Users, 
  Shield, 
  Github, 
  Linkedin, 
  Globe,
  Terminal,
} from "lucide-react";

const levelColors: Record<string, { bg: string; text: string; border: string }> = {
  admin: {
    bg: "bg-secondary/20",
    text: "text-secondary",
    border: "border-secondary/50",
  },
  member: {
    bg: "bg-primary/20",
    text: "text-primary",
    border: "border-primary/50",
  },
};

export default function Members() {
  const { data: profiles, isLoading } = useProfilesWithRoles();

  return (
    <Layout>
      <section className="py-20 px-4">
        <div className="container mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-card/80 border border-primary/30 rounded-full mb-6">
              <Users className="w-4 h-4 text-primary" />
              <span className="text-sm font-mono text-muted-foreground">
                The Squad
              </span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              <span className="text-primary">@</span> Members
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Meet the elite operatives securing the digital frontier
            </p>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {Object.entries(levelColors).map(([level, colors]) => (
              <div
                key={level}
                className={`flex items-center gap-2 px-3 py-1 rounded-full ${colors.bg} ${colors.border} border`}
              >
                <Shield className={`w-3 h-3 ${colors.text}`} />
                <span className={`text-xs font-mono uppercase ${colors.text}`}>
                  {level}
                </span>
              </div>
            ))}
          </div>

          {/* Members Grid */}
          {isLoading ? (
            <div className="text-center py-12">
              <Terminal className="w-8 h-8 text-primary mx-auto mb-4 animate-pulse" />
              <p className="text-muted-foreground font-mono">Loading operatives...</p>
            </div>
          ) : profiles && profiles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...profiles]
                .sort((a, b) => {
                  if (a.role === "admin" && b.role !== "admin") return -1;
                  if (a.role !== "admin" && b.role === "admin") return 1;
                  const aName = a.full_name || a.username || "";
                  const bName = b.full_name || b.username || "";
                  return aName.localeCompare(bName);
                })
                .map((member, index) => {
                // Get the role directly from the member object
                const memberRole = member.role;
                const colors = levelColors[memberRole] || levelColors.member;
                return (
                  <Link to={`/member/${member.id}`} key={member.id}>
                    <CyberCard
                      className="animate-fade-in hover:scale-105 transition-all duration-300 cursor-pointer group text-center h-full"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      {/* Role Badge */}
                      <div className="flex justify-center mb-2">
                        <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${colors.bg} ${colors.border} border`}>
                          <Shield className={`w-3 h-3 ${colors.text}`} />
                          <span className={`text-xs font-mono uppercase ${colors.text}`}>
                            {memberRole}
                          </span>
                        </div>
                      </div>
                      
                      {/* Avatar */}
                      <div className="relative inline-block mb-4">
                        <div
                          className={`w-20 h-20 mx-auto flex items-center justify-center text-4xl rounded-lg ${colors.bg} ${colors.border} border group-hover:scale-110 transition-transform duration-300 overflow-hidden`}
                        >
                          {member.avatar_url ? (
                            <img
                              src={member.avatar_url}
                              alt={member.username || "Member"}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-2xl">👤</span>
                          )}
                        </div>
                      </div>

                      {/* Name */}
                      <h3 className="font-display text-lg text-primary cyber-text-glow mb-2">
                        {member.full_name || member.username || "Unknown"}
                      </h3>

                      {/* Team Role / Department */}
                      {(member.team_role || member.department) && (
                        <div className="flex flex-col items-center gap-1 mb-2">
                          {member.team_role && (
                            <Badge
                              variant="outline"
                              className="border-destructive/60 text-destructive bg-destructive/10 font-mono text-xs"
                            >
                              {member.team_role}
                            </Badge>
                          )}
                          {member.department && (
                            <Badge
                              variant="outline"
                              className="border-primary/40 text-primary font-mono text-xs"
                            >
                              {member.department}
                            </Badge>
                          )}
                        </div>
                      )}

                      {/* Skills */}
                      {member.skills && member.skills.length > 0 && (
                        <>
                          <div className="w-full h-px bg-primary/20 my-2" />
                          <div className="flex flex-wrap justify-center gap-1 mb-3">
                            {member.skills.slice(0, 2).map((skill) => (
                              <Badge
                                key={skill}
                                variant="outline"
                                className={`${colors.border} ${colors.text} font-mono text-xs`}
                              >
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </>
                      )}

                      {/* Social Links */}
                      <div className="flex justify-center gap-3 mt-4 pt-4 border-t border-primary/20">
                        {member.github_url && (
                          <a
                            href={member.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-primary transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Github className="w-4 h-4" />
                          </a>
                        )}
                        {member.linkedin_url && (
                          <a
                            href={member.linkedin_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-primary transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Linkedin className="w-4 h-4" />
                          </a>
                        )}
                        {member.website_url && (
                          <a
                            href={member.website_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-primary transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Globe className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </CyberCard>
                  </Link>
                );
              })}
            </div>
          ) : (
            <CyberCard variant="terminal" className="text-center p-12">
              <Terminal className="w-12 h-12 text-primary mx-auto mb-4" />
              <p className="text-muted-foreground font-mono">
                No operatives found. Members are added by admin.
              </p>
            </CyberCard>
          )}
        </div>
      </section>
    </Layout>
  );
}
