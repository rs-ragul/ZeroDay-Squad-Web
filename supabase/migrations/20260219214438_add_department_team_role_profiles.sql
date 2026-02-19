-- Add department and team role to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS department TEXT,
  ADD COLUMN IF NOT EXISTS team_role TEXT;

-- Allow admins to update any profile
DROP POLICY IF EXISTS "Admins can update profiles" ON public.profiles;
CREATE POLICY "Admins can update profiles"
ON public.profiles
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Update public profiles view to expose new fields
CREATE OR REPLACE VIEW public.public_profiles AS
SELECT 
  id,
  user_id,
  username,
  full_name,
  avatar_url,
  bio,
  skills,
  github_url,
  linkedin_url,
  twitter_url,
  website_url,
  department,
  team_role,
  created_at,
  updated_at,
  CASE 
    WHEN auth.uid() = user_id THEN email
    WHEN has_role(auth.uid(), 'admin') THEN email
    ELSE NULL
  END as email
FROM public.profiles;

-- Update profiles-with-roles function to include new fields
CREATE OR REPLACE FUNCTION public.get_profiles_with_roles()
RETURNS TABLE (
  id UUID,
  user_id UUID,
  username TEXT,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  skills TEXT[],
  github_url TEXT,
  linkedin_url TEXT,
  website_url TEXT,
  department TEXT,
  team_role TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  role app_role
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    p.id,
    p.user_id,
    p.username,
    p.full_name,
    p.avatar_url,
    p.bio,
    p.skills,
    p.github_url,
    p.linkedin_url,
    p.website_url,
    p.department,
    p.team_role,
    p.created_at,
    p.updated_at,
    COALESCE(ur.role, 'member'::app_role) as role
  FROM public.profiles p
  LEFT JOIN public.user_roles ur ON p.user_id = ur.user_id
  ORDER BY p.created_at DESC
$$;

GRANT EXECUTE ON FUNCTION public.get_profiles_with_roles() TO anon, authenticated;
