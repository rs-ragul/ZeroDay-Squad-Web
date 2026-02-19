import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { CyberCard } from "@/components/cyber/CyberCard";
import { HexagonCard } from "@/components/cyber/HexagonCard";
import { TypewriterText } from "@/components/cyber/TypewriterText";
import { StatCounter } from "@/components/cyber/StatCounter";
import { useSiteStats } from "@/hooks/useSiteStats";
import {
  Shield,
  Terminal,
  Code,
  Users,
  Trophy,
  ChevronRight,
  Zap,
} from "lucide-react";

interface StatDisplay {
  value: number;
  label: string;
  suffix?: string;
}

const features = [
  {
    icon: Shield,
    title: "Cybersecurity Core",
    description: "Offense, defense, and secure engineering at our core",
  },
  {
    icon: Code,
    title: "Projects & Tools",
    description: "Showcasing builds, demos, and open-source work",
  },
  {
    icon: Trophy,
    title: "CTFs & Hackathons",
    description: "Competitive events, problem-solving, and wins",
  },
  {
    icon: Users,
    title: "Events & Community",
    description: "Workshops, meetups, and team collaborations",
  },
];

export default function Index() {
  const { data: siteStats, isLoading: statsLoading } = useSiteStats();

  // Transform site stats for display
  const statsForDisplay: StatDisplay[] = (siteStats || []).map((stat) => ({
    value: stat.stat_value,
    label: stat.stat_label,
    suffix: stat.stat_key.includes("bounty") ? "+" : "",
  }));

  return (
    <Layout>
      {/* Hero Section */}
      <section className="min-h-[90vh] flex items-center justify-center relative overflow-hidden px-4">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 bg-primary/20"
              style={{
                left: `${Math.random() * 100}%`,
                height: `${Math.random() * 200 + 100}px`,
                top: `${Math.random() * 100}%`,
                animation: `scan ${3 + Math.random() * 4}s linear infinite`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        <div className="container mx-auto text-center relative z-10">
          {/* Terminal-style intro */}
          <CyberCard variant="terminal" className="inline-block mb-8 animate-fade-in">
            <code className="text-primary text-sm">
              <span className="text-secondary">$</span> ./init_squad.sh
              <span className="ml-2 text-muted-foreground">--mode=elite</span>
            </code>
          </CyberCard>

          {/* Main heading */}
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-black mb-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <span className="text-foreground">Zero</span>
            <span className="text-primary cyber-text-glow">Day</span>
            <br />
            <span className="text-secondary cyber-text-glow-secondary">Squad</span>
          </h1>

          {/* Subtitle with typewriter effect */}
          <div className="text-xl md:text-2xl text-muted-foreground mb-8 h-8">
            <TypewriterText
              text="> Built by curiosity. Driven by cybersecurity challenges."
              speed={40}
              delay={800}
            />
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: "0.6s" }}>
            <Link to="/projects">
              <Button variant="cyber" size="lg" className="w-full sm:w-auto">
                <Terminal className="w-5 h-5 mr-2" />
                View Projects
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="/members">
              <Button variant="cyber-secondary" size="lg" className="w-full sm:w-auto">
                <Users className="w-5 h-5 mr-2" />
                Meet the Squad
              </Button>
            </Link>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-primary/50 rounded-full flex items-start justify-center p-1">
              <div className="w-1.5 h-3 bg-primary rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 relative">
        <div className="container mx-auto">
          {statsLoading ? (
            <div className="text-center">
              <Terminal className="w-8 h-8 text-primary mx-auto animate-pulse" />
            </div>
          ) : statsForDisplay.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {statsForDisplay.map((stat, index) => (
                <StatCounter
                  key={stat.label}
                  end={stat.value}
                  suffix={stat.suffix}
                  label={stat.label}
                  className="animate-fade-in"
                />
              ))}
            </div>
          ) : null}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 relative">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              <span className="text-primary">&lt;</span>
              Team Portfolio
              <span className="text-primary">/&gt;</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Cybersecurity-first, with projects, events, and competition highlights
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <CyberCard
                key={feature.title}
                className="animate-fade-in text-center hover:scale-105 transition-transform duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-16 h-16 mx-auto mb-4 relative">
                  <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                  <div className="relative w-full h-full flex items-center justify-center border-2 border-primary/50 rounded-lg">
                    <feature.icon className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
              </CyberCard>
            ))}
          </div>
        </div>
      </section>

      {/* Hexagon Showcase */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              <span className="text-secondary">#</span> Quick Access
            </h2>
          </div>

          <div className="flex flex-wrap justify-center gap-8">
            <Link to="/projects">
              <HexagonCard className="w-48 h-56 flex items-center justify-center">
                <div className="text-center">
                  <Code className="w-12 h-12 text-primary mx-auto mb-3" />
                  <span className="font-display font-semibold text-foreground">Projects</span>
                </div>
              </HexagonCard>
            </Link>
            <Link to="/achievements">
              <HexagonCard className="w-48 h-56 flex items-center justify-center" glowColor="secondary">
                <div className="text-center">
                  <Trophy className="w-12 h-12 text-secondary mx-auto mb-3" />
                  <span className="font-display font-semibold text-foreground">Achievements</span>
                </div>
              </HexagonCard>
            </Link>
            <Link to="/members">
              <HexagonCard className="w-48 h-56 flex items-center justify-center">
                <div className="text-center">
                  <Users className="w-12 h-12 text-primary mx-auto mb-3" />
                  <span className="font-display font-semibold text-foreground">Members</span>
                </div>
              </HexagonCard>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 relative">
        <div className="container mx-auto max-w-4xl">
          <CyberCard variant="glow" className="text-center p-12">
            <Zap className="w-16 h-16 text-primary mx-auto mb-6 animate-pulse-glow" />
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Explore Our Work
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Discover our cybersecurity achievements, CTFs, hackathons, and projects.
            </p>
            <div className="flex justify-center">
              <Link to="/achievements" className="w-full sm:w-auto">
                <Button variant="cyber" size="lg" className="w-full">
                  <Trophy className="w-5 h-5 mr-2" />
                  View Achievements
                </Button>
              </Link>
            </div>
          </CyberCard>
        </div>
      </section>
    </Layout>
  );
}
