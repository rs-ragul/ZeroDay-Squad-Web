import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { CyberCard } from "@/components/cyber/CyberCard";
import { Badge } from "@/components/ui/badge";
import { useProfile } from "@/hooks/useProfiles";
import { useProjects } from "@/hooks/useProjects";
import { useAchievements } from "@/hooks/useAchievements";
import { ArrowLeft, Github, Linkedin, Globe, Terminal, Trophy, Code } from "lucide-react";

export default function MemberProfile() {
  const { id } = useParams<{ id: string }>();
  const { data: profile, isLoading } = useProfile(id);
  const { data: allProjects } = useProjects();
  const { data: allAchievements } = useAchievements();

  const memberProjects = allProjects?.filter(
    (p) => p.owner_id === id || p.members?.some((m) => m.id === id)
  );
  const memberAchievements = allAchievements?.filter(
    (a) => a.owner_id === id || a.members?.some((m) => m.id === id)
  );

  if (isLoading) {
    return (
      <Layout>
        <section className="min-h-[85vh] flex items-center justify-center">
          <Terminal className="w-8 h-8 text-primary animate-pulse" />
        </section>
      </Layout>
    );
  }

  if (!profile) {
    return (
      <Layout>
        <section className="py-20 px-4 text-center">
          <p className="text-muted-foreground">Member not found</p>
          <Link to="/members" className="text-primary hover:underline mt-4 inline-block">
            Back to members
          </Link>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <Link to="/members" className="inline-flex items-center text-muted-foreground hover:text-primary mb-8 font-mono text-sm">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to members
          </Link>

          <CyberCard className="p-8 mb-8">
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
              <div className="w-32 h-32 rounded-lg border-2 border-primary/50 bg-primary/10 flex items-center justify-center overflow-hidden">
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt={profile.username || ""} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-5xl">👤</span>
                )}
              </div>
              <div className="flex-1 text-center md:text-left">
                <h1 className="font-display text-3xl font-bold text-foreground mb-1">
                  {profile.full_name || profile.username || "Unknown"}
                </h1>
                <p className="text-primary font-mono mb-4">@{profile.username}</p>
                {(profile.team_role || profile.department) && (
                  <div className="flex flex-col gap-2 mb-4 items-center md:items-start">
                    {profile.team_role && (
                      <Badge
                        variant="outline"
                        className="border-destructive/60 text-destructive bg-destructive/10 font-mono text-xs"
                      >
                        {profile.team_role}
                      </Badge>
                    )}
                    {profile.department && (
                      <Badge
                        variant="outline"
                        className="border-primary/40 text-primary font-mono text-xs"
                      >
                        Department of {profile.department}
                      </Badge>
                    )}
                  </div>
                )}
                {profile.bio && <p className="text-muted-foreground mb-4">{profile.bio}</p>}
                {profile.skills && profile.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4 justify-center md:justify-start">
                    {profile.skills.map((skill) => (
                      <Badge key={skill} variant="outline" className="border-primary/30">{skill}</Badge>
                    ))}
                  </div>
                )}
                <div className="flex gap-4 justify-center md:justify-start">
                  {profile.github_url && (
                    <a href={profile.github_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                      <Github className="w-5 h-5" />
                    </a>
                  )}
                  {profile.linkedin_url && (
                    <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                      <Linkedin className="w-5 h-5" />
                    </a>
                  )}
                  {profile.website_url && (
                    <a href={profile.website_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                      <Globe className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </CyberCard>

          {memberProjects && memberProjects.length > 0 && (
            <div className="mb-8">
              <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
                <Code className="w-5 h-5 text-primary" /> Projects
              </h2>
              <div className="grid gap-4">
                {memberProjects.map((p) => (
                  <Link key={p.id} to={`/project/${p.id}`}>
                    <CyberCard className="p-4 hover:scale-[1.02] transition-all duration-300 cursor-pointer">
                      <h3 className="font-semibold text-foreground">{p.title}</h3>
                      <p className="text-muted-foreground text-sm">{p.description}</p>
                    </CyberCard>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {memberAchievements && memberAchievements.length > 0 && (
            <div>
              <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-secondary" /> Achievements
              </h2>
              <div className="grid gap-4">
                {memberAchievements.map((a) => (
                  <Link key={a.id} to={`/achievement/${a.id}`}>
                    <CyberCard className="p-4 hover:scale-[1.02] transition-all duration-300 cursor-pointer">
                      <h3 className="font-semibold text-foreground">{a.title}</h3>
                      <p className="text-muted-foreground text-sm">{a.description}</p>
                    </CyberCard>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
