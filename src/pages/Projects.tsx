import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { CyberCard } from "@/components/cyber/CyberCard";
import { Badge } from "@/components/ui/badge";
import { useProjects } from "@/hooks/useProjects";
import { Code, ExternalLink, GitBranch, Star, Lock, Terminal, Users } from "lucide-react";

const statusColors: Record<string, string> = {
  active: "bg-secondary/20 text-secondary border-secondary/50",
  development: "bg-primary/20 text-primary border-primary/50",
  completed: "bg-green-500/20 text-green-500 border-green-500/50",
  classified: "bg-destructive/20 text-destructive border-destructive/50",
};

const languageColors: Record<string, string> = {
  Python: "bg-yellow-500",
  Rust: "bg-orange-500",
  Go: "bg-cyan-500",
  TypeScript: "bg-blue-500",
  JavaScript: "bg-yellow-400",
  Java: "bg-red-500",
  "C++": "bg-purple-500",
  C: "bg-gray-500",
};

export default function Projects() {
  const { data: projects, isLoading } = useProjects();

  return (
    <Layout>
      <section className="py-20 px-4">
        <div className="container mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-card/80 border border-primary/30 rounded-full mb-6">
              <Code className="w-4 h-4 text-primary" />
              <span className="text-sm font-mono text-muted-foreground">
                Open Source & Research
              </span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              <span className="text-primary">&lt;</span>
              Projects
              <span className="text-primary">/&gt;</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Cybersecurity-first projects, tools, and research — with room for hackathons and community builds
            </p>
          </div>

          {/* Projects Grid */}
          {isLoading ? (
            <div className="text-center py-12">
              <Terminal className="w-8 h-8 text-primary mx-auto mb-4 animate-pulse" />
              <p className="text-muted-foreground font-mono">Loading projects...</p>
            </div>
          ) : projects && projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, index) => (
                <Link to={`/project/${project.id}`} key={project.id}>
                  <CyberCard
                    className="animate-fade-in hover:scale-[1.02] transition-all duration-300 cursor-pointer group h-full"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <GitBranch className="w-5 h-5 text-primary" />
                      <h3 className="font-display font-semibold text-foreground group-hover:text-primary transition-colors">
                        {project.title}
                      </h3>
                    </div>
                    {project.github_url ? (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </a>
                    ) : project.status === "classified" ? (
                      <Lock className="w-4 h-4 text-destructive" />
                    ) : null}
                  </div>

                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {project.description || "No description provided"}
                  </p>

                  {/* Team members or Owner */}
                  {project.is_team_project && project.members && project.members.length > 0 ? (
                    <div className="flex items-center gap-2 mb-4 text-xs text-muted-foreground">
                      <Users className="w-3 h-3 text-secondary" />
                      <span className="flex flex-wrap gap-1">
                        {project.members.map((member, i) => (
                          <Link
                            key={member.id}
                            to={`/member/${member.id}`}
                            className="text-secondary hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            @{member.username}
                            {i < project.members!.length - 1 && ","}
                          </Link>
                        ))}
                      </span>
                    </div>
                  ) : (
                    project.owner && (
                      <div className="flex items-center gap-2 mb-4 text-xs text-muted-foreground">
                        <span>Posted by</span>
                        <Link
                          to={`/member/${project.owner.id}`}
                          className="text-secondary hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          @{project.owner.username}
                        </Link>
                      </div>
                    )
                  )}

                  {/* Tags */}
                  {project.tags && project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="text-xs font-mono border-primary/30 text-muted-foreground"
                        >
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-primary/20">
                    <div className="flex items-center gap-2">
                      {project.language && (
                        <>
                          <div
                            className={`w-3 h-3 rounded-full ${languageColors[project.language] || "bg-gray-400"}`}
                          />
                          <span className="text-xs font-mono text-muted-foreground">
                            {project.language}
                          </span>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      {project.stars && project.stars > 0 && (
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Star className="w-4 h-4" />
                          <span className="text-xs font-mono">{project.stars}</span>
                        </div>
                      )}
                      <Badge
                        variant="outline"
                        className={`text-xs font-mono ${statusColors[project.status] || statusColors.active}`}
                      >
                        {project.status}
                      </Badge>
                    </div>
                    </div>
                  </CyberCard>
                </Link>
              ))}
            </div>
          ) : (
            <CyberCard variant="terminal" className="text-center p-12">
              <Terminal className="w-12 h-12 text-primary mx-auto mb-4" />
              <p className="text-muted-foreground font-mono">
                No projects found. Projects are added by admin and members.
              </p>
            </CyberCard>
          )}

          {/* Terminal Footer */}
          {projects && projects.length > 0 && (
            <div className="mt-16 text-center">
              <CyberCard variant="terminal" className="inline-block">
                <code className="text-sm text-muted-foreground">
                  <span className="text-secondary">$</span> git clone --all
                  <span className="text-primary ml-2">{projects.length} repositories loaded</span>
                  <span className="terminal-text ml-1">_</span>
                </code>
              </CyberCard>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
