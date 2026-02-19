import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/types/database";

export type ProfileWithRole = Profile & { role: "admin" | "member" };

export function useProfiles() {
  return useQuery({
    queryKey: ["profiles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id,user_id,username,full_name,avatar_url,bio,skills,github_url,linkedin_url,website_url,department,team_role,created_at,updated_at")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as Profile[];
    },
  });
}

export function useProfilesWithRoles() {
  return useQuery({
    queryKey: ["profiles-with-roles"],
    queryFn: async () => {
      // Try to get profiles with roles using the database function
      const { data, error } = await supabase.rpc("get_profiles_with_roles");
      
      // If RPC succeeds, return the data with roles
      if (!error && data) {
        return data as ProfileWithRole[];
      }
      
      // Fallback: If RPC fails (function not yet deployed, etc.), 
      // fetch profiles directly and default all roles to "member"
      console.warn("get_profiles_with_roles RPC failed, falling back to profiles table:", error);
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id,user_id,username,full_name,avatar_url,bio,skills,github_url,linkedin_url,website_url,department,team_role,created_at,updated_at")
        .order("created_at", { ascending: false });
      
      if (profilesError) throw profilesError;
      
      // Map profiles to include default role
      return (profiles || []).map(profile => ({
        ...profile,
        role: "member" as const
      })) as ProfileWithRole[];
    },
  });
}

export function useProfile(id: string | undefined) {
  return useQuery({
    queryKey: ["profile", id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("id,user_id,username,full_name,avatar_url,bio,skills,github_url,linkedin_url,website_url,department,team_role")
        .eq("id", id)
        .maybeSingle();
      
      if (error) throw error;
      return data as Profile | null;
    },
    enabled: !!id,
  });
}

export function useProfileByUserId(userId: string | undefined) {
  return useQuery({
    queryKey: ["profile-by-user", userId],
    queryFn: async () => {
      if (!userId) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("id,user_id,username,full_name,avatar_url,bio,skills,github_url,linkedin_url,website_url,department,team_role")
        .eq("user_id", userId)
        .maybeSingle();
      
      if (error) throw error;
      return data as Profile | null;
    },
    enabled: !!userId,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Profile> }) => {
      const { data, error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profiles"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}
