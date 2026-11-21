-- ==============================================================================
-- SAMAD GROUPS — MULTI-USER STATIC WEBSITE HOSTING & DEPLOYMENT SYSTEM
-- PRODUCTION SUPABASE POSTGRESQL SCHEMA WITH ROW LEVEL SECURITY (RLS)
-- ==============================================================================

-- 1. EXTENSIONS & UUID GENERATION
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. USER PROFILES TABLE (Linked with Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    avatar_url TEXT DEFAULT '',
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    storage_quota_bytes BIGINT DEFAULT 104857600, -- 100MB default quota
    storage_used_bytes BIGINT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index on email
CREATE INDEX IF NOT EXISTS idx_users_profiles_email ON public.users_profiles(email);

-- 3. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users_profiles(id) ON DELETE CASCADE,
    project_name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT DEFAULT '',
    visibility TEXT DEFAULT 'public' CHECK (visibility IN ('public', 'private')),
    custom_domain TEXT DEFAULT NULL,
    active_deployment_id UUID DEFAULT NULL,
    deployment_url TEXT DEFAULT '',
    deployment_status TEXT DEFAULT 'draft' CHECK (deployment_status IN ('draft', 'pending', 'building', 'live', 'failed')),
    thumbnail TEXT DEFAULT '',
    storage_used_bytes BIGINT DEFAULT 0,
    total_deployments INT DEFAULT 0,
    view_count BIGINT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for rapid search and lookup
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_visibility ON public.projects(visibility);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(deployment_status);
CREATE INDEX IF NOT EXISTS idx_projects_search ON public.projects USING gin(to_tsvector('english', project_name || ' ' || description || ' ' || slug));

-- 4. DEPLOYMENTS TABLE
CREATE TABLE IF NOT EXISTS public.deployments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users_profiles(id) ON DELETE CASCADE,
    deployment_status TEXT NOT NULL DEFAULT 'pending' CHECK (deployment_status IN ('pending', 'building', 'live', 'failed')),
    deployment_url TEXT NOT NULL DEFAULT '',
    storage_path TEXT NOT NULL DEFAULT '',
    file_count INT DEFAULT 0,
    total_size BIGINT DEFAULT 0,
    entry_file TEXT DEFAULT 'index.html',
    logs JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    published_at TIMESTAMPTZ DEFAULT NULL
);

CREATE INDEX IF NOT EXISTS idx_deployments_project_id ON public.deployments(project_id);
CREATE INDEX IF NOT EXISTS idx_deployments_user_id ON public.deployments(user_id);
CREATE INDEX IF NOT EXISTS idx_deployments_status ON public.deployments(deployment_status);

-- Add foreign key constraint to projects.active_deployment_id
ALTER TABLE public.projects 
    DROP CONSTRAINT IF EXISTS fk_projects_active_deployment;

ALTER TABLE public.projects 
    ADD CONSTRAINT fk_projects_active_deployment 
    FOREIGN KEY (active_deployment_id) REFERENCES public.deployments(id) ON DELETE SET NULL;

-- 5. PROJECT FILES TABLE
CREATE TABLE IF NOT EXISTS public.project_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    deployment_id UUID NOT NULL REFERENCES public.deployments(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    content_type TEXT NOT NULL DEFAULT 'application/octet-stream',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_project_files_project_id ON public.project_files(project_id);
CREATE INDEX IF NOT EXISTS idx_project_files_deployment_id ON public.project_files(deployment_id);
CREATE INDEX IF NOT EXISTS idx_project_files_path ON public.project_files(file_path);

-- 6. ROW LEVEL SECURITY (RLS) POLICIES

-- Enable RLS on all tables
ALTER TABLE public.users_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deployments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_files ENABLE ROW LEVEL SECURITY;

-- users_profiles RLS:
-- Users can view their own profile; admins can view all. Public can view minimal profile for project cards.
CREATE POLICY "Users can read own profile" ON public.users_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users_profiles
    FOR UPDATE USING (auth.uid() = id);

-- projects RLS:
-- Anyone can read public & live projects; users can read all their own projects
CREATE POLICY "Public projects discoverable by everyone" ON public.projects
    FOR SELECT USING (visibility = 'public' AND deployment_status = 'live');

CREATE POLICY "Users can view all own projects" ON public.projects
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own projects" ON public.projects
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects" ON public.projects
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects" ON public.projects
    FOR DELETE USING (auth.uid() = user_id);

-- deployments RLS:
CREATE POLICY "Anyone can view live deployments for public projects" ON public.deployments
    FOR SELECT USING (
        deployment_status = 'live' AND 
        EXISTS (SELECT 1 FROM public.projects WHERE projects.id = deployments.project_id AND projects.visibility = 'public')
    );

CREATE POLICY "Users can view own deployments" ON public.deployments
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own deployments" ON public.deployments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- project_files RLS:
CREATE POLICY "Anyone can view files of live public deployments" ON public.project_files
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.projects WHERE projects.id = project_files.project_id AND projects.visibility = 'public' AND projects.deployment_status = 'live')
    );

CREATE POLICY "Users can view own project files" ON public.project_files
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.projects WHERE projects.id = project_files.project_id AND projects.user_id = auth.uid())
    );

-- 7. AUTOMATIC PROFILE CREATION TRIGGER ON SUPABASE AUTH SIGN-UP
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.users_profiles (id, full_name, email, avatar_url, role)
    VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
        new.email,
        COALESCE(new.raw_user_meta_data->>'avatar_url', ''),
        'user'
    );
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
