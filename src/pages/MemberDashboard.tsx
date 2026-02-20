import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { CyberCard } from "@/components/cyber/CyberCard";
import { GlitchText } from "@/components/cyber/GlitchText";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { ProfileEditDialog } from "@/components/ProfileEditDialog";
import { MemberProjectsPanel } from "@/components/member/MemberProjectsPanel";
import { MemberAchievementsPanel } from "@/components/member/MemberAchievementsPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  FolderKanban,
  Trophy,
  LogOut,
  Terminal,
  Edit,
  Shield,
} from "lucide-react";

interface Profile {
  id: string;
  username: string | null;
  email: string | null;
  avatar_url: string | null;
  full_name: string | null;
  department: string | null;
  team_role: string | null;
}

export default function MemberDashboard() {
  const { user, role, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isProfileEditOpen, setIsProfileEditOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
    // Redirect admins to admin dashboard
    if (!loading && user && role === "admin") {
      navigate("/admin");
    }
  }, [user, role, loading, navigate]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      const { data } = await supabase
        .from("profiles")
        .select("id,user_id,username,full_name,avatar_url,bio,skills,github_url,linkedin_url,website_url,department,team_role")
        .eq("user_id", user.id)
        .single();

      if (data) {
        setProfile(data as Profile);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const refreshProfile = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("profiles")
      .select("id,user_id,username,full_name,avatar_url,bio,skills,github_url,linkedin_url,website_url,department,team_role")
      .eq("user_id", user.id)
      .single();
    if (data) {
      setProfile(data as Profile);
    }
  };

  if (loading) {
    return (
      <Layout>
        <section className="min-h-[85vh] flex items-center justify-center">
          <div className="text-center">
            <Terminal className="w-12 h-12 text-primary mx-auto mb-4 animate-pulse" />
            <p className="text-muted-foreground font-mono">Loading operative terminal...</p>
          </div>
        </section>
      </Layout>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Layout>
      <section className="min-h-[85vh] px-4 py-20">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <User className="w-8 h-8 text-primary" />
                <GlitchText
                  text="Operative Dashboard"
                  className="text-3xl md:text-4xl font-display font-bold"
                />
              </div>
              <p className="text-muted-foreground font-mono text-sm">
                <span className="text-secondary">$</span> {profile?.username || user.email} ~# status: active
              </p>
            </div>
            <Button
              variant="cyber-secondary"
              onClick={handleSignOut}
              className="mt-4 md:mt-0"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>

          {/* Profile Card */}
          <CyberCard variant="glow" className="p-6 mb-8">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="w-24 h-24 rounded-full border-2 border-primary overflow-hidden flex items-center justify-center bg-primary/10">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-12 h-12 text-primary" />
                )}
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="font-display font-bold text-xl text-foreground mb-1">
                  {profile?.full_name || profile?.username || "Operative"}
                </h3>
                <p className="text-muted-foreground font-mono text-sm mb-2">
                  {user.email}
                </p>
                {(profile?.team_role || profile?.department) && (
                  <div className="flex flex-wrap gap-2 justify-center sm:justify-start mb-2">
                    {profile?.team_role && (
                      <Badge
                        variant="outline"
                        className="border-destructive/60 text-destructive bg-destructive/10 font-mono text-xs"
                      >
                        {profile.team_role}
                      </Badge>
                    )}
                    {profile?.department && (
                      <Badge
                        variant="outline"
                        className="border-primary/40 text-primary font-mono text-xs"
                      >
                        {profile.department}
                      </Badge>
                    )}
                  </div>
                )}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-mono">
                  <Shield className="w-4 h-4" />
                  MEMBER
                </div>
              </div>
              <Button
                variant="cyber"
                onClick={() => setIsProfileEditOpen(true)}
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </CyberCard>

          {/* Tabs for Projects and Achievements */}
          <Tabs defaultValue="projects" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-card/50 border border-primary/20">
              <TabsTrigger
                value="projects"
                className="flex items-center gap-2 data-[state=active]:bg-primary/20"
              >
                <FolderKanban className="w-4 h-4" />
                My Projects
              </TabsTrigger>
              <TabsTrigger
                value="achievements"
                className="flex items-center gap-2 data-[state=active]:bg-secondary/20"
              >
                <Trophy className="w-4 h-4" />
                My Achievements
              </TabsTrigger>
            </TabsList>

            <TabsContent value="projects">
              {profile && <MemberProjectsPanel profileId={profile.id} />}
            </TabsContent>

            <TabsContent value="achievements">
              {profile && <MemberAchievementsPanel profileId={profile.id} />}
            </TabsContent>
          </Tabs>

          {/* Profile Edit Dialog */}
          {user && (
            <ProfileEditDialog
              open={isProfileEditOpen}
              onOpenChange={setIsProfileEditOpen}
              userId={user.id}
              onSuccess={refreshProfile}
            />
          )}
        </div>
      </section>
    </Layout>
  );
}
