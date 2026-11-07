-- ====================================================================
-- JobCurrent — Initial Database Schema & Security Migration
-- Fully compliant with JobCurrent Data Model, RLS, and Constraints
-- ====================================================================

-- Enable pgcrypto for UUID generation and cryptographic hashing
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- --------------------------------------------------------------------
-- 1. PROFILES TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    college TEXT,
    degree TEXT,
    branch TEXT,
    current_year INT CHECK (current_year BETWEEN 1 AND 6),
    cgpa NUMERIC(3, 2) CHECK (cgpa >= 0.00 AND cgpa <= 10.00),
    graduation_year INT CHECK (graduation_year BETWEEN 2000 AND 2050),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- --------------------------------------------------------------------
-- 2. USER PREFERENCES TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    interested_roles TEXT[] DEFAULT '{}',
    preferred_domains TEXT[] DEFAULT '{}',
    skills TEXT[] DEFAULT '{}',
    preferred_locations TEXT[] DEFAULT '{}',
    work_modes TEXT[] DEFAULT '{}', -- 'remote', 'onsite', 'hybrid'
    job_types TEXT[] DEFAULT '{}',   -- 'internship', 'full-time', 'part-time'
    minimum_salary NUMERIC DEFAULT 0,
    minimum_stipend NUMERIC DEFAULT 0,
    paid_only BOOLEAN DEFAULT false,
    include_unknown_eligibility BOOLEAN DEFAULT true,
    email_enabled BOOLEAN DEFAULT true,
    notification_frequency VARCHAR(50) DEFAULT 'daily',
    notification_time TIME DEFAULT '08:00:00',
    timezone VARCHAR(100) DEFAULT 'Asia/Kolkata',
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT uq_user_preferences_user_id UNIQUE (user_id)
);

-- --------------------------------------------------------------------
-- 3. JOBS TABLE (Centralized repository)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    company_name TEXT NOT NULL,
    company_logo TEXT,
    description TEXT NOT NULL,
    source_name VARCHAR(100) NOT NULL,
    source_job_id VARCHAR(255),
    original_url TEXT NOT NULL,
    application_url TEXT NOT NULL,
    location TEXT,
    work_mode VARCHAR(50) DEFAULT 'onsite', -- 'remote', 'onsite', 'hybrid'
    job_type VARCHAR(50) DEFAULT 'full-time', -- 'internship', 'full-time', 'part-time'
    salary_min NUMERIC,
    salary_max NUMERIC,
    stipend NUMERIC,
    currency VARCHAR(10) DEFAULT 'INR',
    paid_status VARCHAR(20) DEFAULT 'paid', -- 'paid', 'unpaid'
    required_skills TEXT[] DEFAULT '{}',
    preferred_skills TEXT[] DEFAULT '{}',
    minimum_cgpa NUMERIC(3, 2),
    eligible_branches TEXT[] DEFAULT '{}',
    eligible_graduation_years INT[] DEFAULT '{}',
    experience_required VARCHAR(100),
    duration VARCHAR(100),
    application_deadline TIMESTAMPTZ,
    posted_at TIMESTAMPTZ DEFAULT NOW(),
    first_seen_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    last_seen_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    description_hash VARCHAR(64),
    extraction_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'completed', 'failed', 'deterministic'
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'expired', 'closed'
    is_demo BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT uq_source_job_id_source UNIQUE (source_name, source_job_id)
);

-- --------------------------------------------------------------------
-- 4. JOB MATCHES TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.job_matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
    match_score INT CHECK (match_score BETWEEN 0 AND 100) NOT NULL,
    eligibility_status VARCHAR(50) DEFAULT 'unknown', -- 'eligible', 'not_eligible', 'unknown'
    match_explanation JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT uq_user_job_match UNIQUE (user_id, job_id)
);

-- --------------------------------------------------------------------
-- 5. SAVED JOBS TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.saved_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT uq_user_saved_job UNIQUE (user_id, job_id)
);

-- --------------------------------------------------------------------
-- 6. APPLICATIONS TRACKER TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
    application_status VARCHAR(50) DEFAULT 'applied', -- 'interested', 'saved', 'applied', 'interview_scheduled', 'rejected', 'selected'
    applied_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT uq_user_application UNIQUE (user_id, job_id)
);

-- --------------------------------------------------------------------
-- 7. EMAIL LOGS TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.email_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    job_id UUID REFERENCES public.jobs(id) ON DELETE SET NULL,
    email_type VARCHAR(100) NOT NULL,
    delivery_status VARCHAR(50) DEFAULT 'sent',
    provider_message_id TEXT,
    sent_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- --------------------------------------------------------------------
-- 8. NOTIFICATION QUEUE TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.notification_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'processing', 'sent', 'failed'
    scheduled_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    attempts INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- --------------------------------------------------------------------
-- 9. JOB SOURCES TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.job_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_name VARCHAR(100) NOT NULL UNIQUE,
    enabled BOOLEAN DEFAULT true,
    configuration JSONB DEFAULT '{}'::jsonb,
    last_successful_run TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- --------------------------------------------------------------------
-- 10. COLLECTION LOGS TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.collection_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_id UUID REFERENCES public.job_sources(id) ON DELETE SET NULL,
    execution_status VARCHAR(50) NOT NULL, -- 'success', 'partial', 'failed'
    jobs_found INT DEFAULT 0,
    jobs_inserted INT DEFAULT 0,
    jobs_updated INT DEFAULT 0,
    error_message TEXT,
    started_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    completed_at TIMESTAMPTZ
);

-- --------------------------------------------------------------------
-- 11. USER ROLES TABLE (Admin role management)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'user' NOT NULL, -- 'user', 'admin'
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT uq_user_role UNIQUE (user_id, role)
);

-- Secure function to check if auth.uid() has administrator privileges
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- --------------------------------------------------------------------
-- PERFORMANCE INDEXES (Free-tier optimization)
-- --------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_jobs_status_posted ON public.jobs (status, posted_at DESC);
CREATE INDEX IF NOT EXISTS idx_jobs_work_mode ON public.jobs (work_mode);
CREATE INDEX IF NOT EXISTS idx_jobs_job_type ON public.jobs (job_type);
CREATE INDEX IF NOT EXISTS idx_jobs_skills ON public.jobs USING GIN (required_skills);
CREATE INDEX IF NOT EXISTS idx_jobs_desc_hash ON public.jobs (description_hash);
CREATE INDEX IF NOT EXISTS idx_jobs_extraction_status ON public.jobs (extraction_status);
CREATE INDEX IF NOT EXISTS idx_job_matches_user_score ON public.job_matches (user_id, match_score DESC);
CREATE INDEX IF NOT EXISTS idx_saved_jobs_user ON public.saved_jobs (user_id);
CREATE INDEX IF NOT EXISTS idx_applications_user ON public.applications (user_id);
CREATE INDEX IF NOT EXISTS idx_notif_queue_status_sched ON public.notification_queue (status, scheduled_at);
CREATE INDEX IF NOT EXISTS idx_email_logs_user_job ON public.email_logs (user_id, job_id);

-- --------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- --------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collection_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- PROFILES
CREATE POLICY "Users can read own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- USER PREFERENCES
CREATE POLICY "Users can read own preferences" ON public.user_preferences
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences" ON public.user_preferences
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences" ON public.user_preferences
    FOR UPDATE USING (auth.uid() = user_id);

-- JOBS
-- Public read for active listings (visitors can view without logging in)
CREATE POLICY "Public read active jobs" ON public.jobs
    FOR SELECT USING (status = 'active');

-- Only admins or service role can insert/update/delete jobs
CREATE POLICY "Admins can manage jobs" ON public.jobs
    FOR ALL USING (public.is_admin());

-- SAVED JOBS
CREATE POLICY "Users manage own saved jobs" ON public.saved_jobs
    FOR ALL USING (auth.uid() = user_id);

-- APPLICATIONS
CREATE POLICY "Users manage own applications" ON public.applications
    FOR ALL USING (auth.uid() = user_id);

-- JOB MATCHES
CREATE POLICY "Users read own matches" ON public.job_matches
    FOR SELECT USING (auth.uid() = user_id);

-- EMAIL LOGS
CREATE POLICY "Users read own email logs" ON public.email_logs
    FOR SELECT USING (auth.uid() = user_id);

-- NOTIFICATION QUEUE
CREATE POLICY "Admins manage notification queue" ON public.notification_queue
    FOR ALL USING (public.is_admin());

-- JOB SOURCES & LOGS
CREATE POLICY "Admins manage job sources" ON public.job_sources
    FOR ALL USING (public.is_admin());

CREATE POLICY "Admins read collection logs" ON public.collection_logs
    FOR ALL USING (public.is_admin());

-- USER ROLES
CREATE POLICY "Users read own role" ON public.user_roles
    FOR SELECT USING (auth.uid() = user_id);

-- --------------------------------------------------------------------
-- TRIGGER: Automatically update `updated_at` timestamps
-- --------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp_profiles
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE PROCEDURE public.trigger_set_timestamp();

CREATE TRIGGER set_timestamp_preferences
BEFORE UPDATE ON public.user_preferences
FOR EACH ROW EXECUTE PROCEDURE public.trigger_set_timestamp();

CREATE TRIGGER set_timestamp_jobs
BEFORE UPDATE ON public.jobs
FOR EACH ROW EXECUTE PROCEDURE public.trigger_set_timestamp();

CREATE TRIGGER set_timestamp_applications
BEFORE UPDATE ON public.applications
FOR EACH ROW EXECUTE PROCEDURE public.trigger_set_timestamp();

-- --------------------------------------------------------------------
-- SEED DEFAULT JOB SOURCES (6 Verified Free & Open Sources)
-- --------------------------------------------------------------------
INSERT INTO public.job_sources (source_name, enabled, configuration)
VALUES 
    ('Jobvetta API', true, '{"type": "api", "endpoint": "https://api.jobvetta.com/v1", "rate_limit_ms": 1500, "description": "Indian job listings"}'::jsonb),
    ('Himalayas API', true, '{"type": "api", "endpoint": "https://himalayas.app/jobs/api", "rate_limit_ms": 1500, "description": "International remote jobs"}'::jsonb),
    ('Arbeitnow API', true, '{"type": "api", "endpoint": "https://www.arbeitnow.com/api/job-board-api", "rate_limit_ms": 1500, "description": "International jobs"}'::jsonb),
    ('RemoteOK API', true, '{"type": "api", "endpoint": "https://remoteok.com/api", "rate_limit_ms": 2000, "description": "Remote jobs"}'::jsonb),
    ('Greenhouse Direct API', true, '{"type": "api", "endpoint": "https://boards-api.greenhouse.io/v1/boards", "rate_limit_ms": 1500, "description": "Direct company jobs"}'::jsonb),
    ('Lever Direct API', true, '{"type": "api", "endpoint": "https://api.lever.co/v0/postings", "rate_limit_ms": 1500, "description": "Direct company jobs"}'::jsonb)
ON CONFLICT (source_name) DO UPDATE 
SET configuration = EXCLUDED.configuration;
