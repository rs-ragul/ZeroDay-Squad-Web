import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { CyberCard } from "@/components/cyber/CyberCard";
import { GlitchText } from "@/components/cyber/GlitchText";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminMembersPanel } from "@/components/admin/AdminMembersPanel";
import { AdminProjectsPanel } from "@/components/admin/AdminProjectsPanel";
import { AdminAchievementsPanel } from "@/components/admin/AdminAchievementsPanel";
import { AdminStatsPanel } from "@/components/admin/AdminStatsPanel";
import { ProfileEditDialog } from "@/components/ProfileEditDialog";
import {
  Crown,
  LogOut,
  Terminal,
  Users,
  FolderKanban,
  Trophy,
  Activity,
  Edit,
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

export default function AdminDashboard() {
  const { user, role, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [isProfileEditOpen, setIsProfileEditOpen] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    if (!loading && (!user || role !== "admin")) {
      navigate("/auth");
    }
  }, [user, role, loading, navigate]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      const { data } = await supabase
        .from("profiles")
        .select("id,user_id,username,full_name,avatar_url,department,team_role,email")
        .eq("user_id", user.id)
        .single();
      if (data) setProfile(data as Profile);
    };
    if (user) fetchProfile();
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <Layout>
        <section className="min-h-[85vh] flex items-center justify-center">
          <div className="text-center">
            <Terminal className="w-12 h-12 text-primary mx-auto mb-4 animate-pulse" />
            <p className="text-muted-foreground font-mono">Loading admin terminal...</p>
          </div>
        </section>
      </Layout>
    );
  }

  if (!user || role !== "admin") {
    return null;
  }

  return (
    <Layout>
      <section className="min-h-[85vh] px-4 py-20">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Crown className="w-8 h-8 text-yellow-500" />
                <GlitchText
                  text="Admin Control Center"
                  className="text-3xl md:text-4xl font-display font-bold"
                />
              </div>
              <p className="text-muted-foreground font-mono text-sm">
                <span className="text-secondary">$</span> root@zerodaysquad ~# sudo access granted
              </p>
            </div>
            <div className="flex gap-2 mt-4 md:mt-0">
              <Button
                variant="cyber"
                onClick={() => setIsProfileEditOpen(true)}
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
              <Button
                variant="cyber-secondary"
                onClick={handleSignOut}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>

          {/* Admin Profile Card */}
          <CyberCard variant="glow" className="p-6 mb-8">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="w-20 h-20 rounded-full border-2 border-primary overflow-hidden flex items-center justify-center bg-primary/10">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Crown className="w-10 h-10 text-yellow-500" />
                )}
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="font-display font-bold text-xl text-foreground mb-1">
                  {profile?.full_name || profile?.username || "Admin"}
                </h3>
                <p className="text-muted-foreground font-mono text-sm mb-2">
                  {user?.email}
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
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/20 text-secondary text-sm font-mono">
                  <Crown className="w-4 h-4 text-yellow-500" />
                  ADMIN
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

          {/* Tabs for management */}
          <Tabs defaultValue="members" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8 bg-card/50 border border-primary/20">
              <TabsTrigger value="members" className="flex items-center gap-2 data-[state=active]:bg-primary/20">
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Members</span>
              </TabsTrigger>
              <TabsTrigger value="projects" className="flex items-center gap-2 data-[state=active]:bg-secondary/20">
                <FolderKanban className="w-4 h-4" />
                <span className="hidden sm:inline">Projects</span>
              </TabsTrigger>
              <TabsTrigger value="achievements" className="flex items-center gap-2 data-[state=active]:bg-yellow-500/20">
                <Trophy className="w-4 h-4" />
                <span className="hidden sm:inline">Achievements</span>
              </TabsTrigger>
              <TabsTrigger value="stats" className="flex items-center gap-2 data-[state=active]:bg-primary/20">
                <Activity className="w-4 h-4" />
                <span className="hidden sm:inline">Stats</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="members">
              <AdminMembersPanel />
            </TabsContent>
            <TabsContent value="projects">
              <AdminProjectsPanel />
            </TabsContent>
            <TabsContent value="achievements">
              <AdminAchievementsPanel />
            </TabsContent>
            <TabsContent value="stats">
              <AdminStatsPanel />
            </TabsContent>
          </Tabs>

          {/* Profile Edit Dialog */}
          {user && (
            <ProfileEditDialog
              open={isProfileEditOpen}
              onOpenChange={setIsProfileEditOpen}
              userId={user.id}
            />
          )}
        </div>
      </section>
    </Layout>
  );
}
