export interface Profile {
  id: string;
  user_id: string;
  username: string | null;
  email: string | null;
  full_name: string | null;
  bio: string | null;
  skills: string[] | null;
  avatar_url: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  twitter_url: string | null;
  website_url: string | null;
  department: string | null;
  team_role: string | null;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  title: string;
  description: string | null;
  status: string;
  is_team_project: boolean;
  owner_id: string | null;
  github_url: string | null;
  demo_url: string | null;
  image_url: string | null;
  tags: string[] | null;
  language: string | null;
  stars: number | null;
  created_at: string;
  updated_at: string;
  owner?: Profile;
  members?: Profile[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string | null;
  achievement_type: string;
  achievement_date: string | null;
  icon: string | null;
  image_url: string | null;
  is_team_achievement: boolean;
  owner_id: string | null;
  is_highlighted: boolean;
  created_at: string;
  updated_at: string;
  owner?: Profile;
  members?: Profile[];
}

export interface SiteStat {
  id: string;
  stat_key: string;
  stat_label: string;
  stat_value: number;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface ProjectMember {
  id: string;
  project_id: string;
  profile_id: string;
  created_at: string;
  profile?: Profile;
}

export interface AchievementMember {
  id: string;
  achievement_id: string;
  profile_id: string;
  created_at: string;
  profile?: Profile;
}
