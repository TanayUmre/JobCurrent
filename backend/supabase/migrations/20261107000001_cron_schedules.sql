-- ====================================================================
-- JobCurrent — Scheduled Cron Automation via pg_cron & pg_net
-- Configured for Asia/Kolkata (IST = UTC + 5:30)
-- ====================================================================

-- Enable pg_cron and pg_net extensions in Supabase
CREATE EXTENSION IF NOT EXISTS "pg_cron";
CREATE EXTENSION IF NOT EXISTS "pg_net";

-- Grant usage to postgres
GRANT USAGE ON SCHEMA cron TO postgres;

-- --------------------------------------------------------------------
-- 1. 06:00 AM IST (00:30 UTC) — Scheduled Job Collection
-- --------------------------------------------------------------------
SELECT cron.schedule(
    'jobcurrent-scheduled-collection',
    '30 0 * * *',
    $$
    SELECT net.http_post(
        url := current_setting('app.settings.edge_function_url', true) || '/collect-jobs',
        headers := jsonb_build_object(
            'Content-Type', 'application/json',
            'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
        ),
        body := '{"scheduled": true, "batch_size": 50}'::jsonb
    );
    $$
);

-- --------------------------------------------------------------------
-- 2. 07:00 AM IST (01:30 UTC) — Groq AI Extraction in Batches
-- --------------------------------------------------------------------
SELECT cron.schedule(
    'jobcurrent-ai-extraction',
    '30 1 * * *',
    $$
    SELECT net.http_post(
        url := current_setting('app.settings.edge_function_url', true) || '/extract-ai',
        headers := jsonb_build_object(
            'Content-Type', 'application/json',
            'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
        ),
        body := '{"batch_size": 25}'::jsonb
    );
    $$
);

-- --------------------------------------------------------------------
-- 3. 07:30 AM IST (02:00 UTC) — Personalized User-Job Matching
-- --------------------------------------------------------------------
SELECT cron.schedule(
    'jobcurrent-user-matching',
    '0 2 * * *',
    $$
    SELECT net.http_post(
        url := current_setting('app.settings.edge_function_url', true) || '/match-engine',
        headers := jsonb_build_object(
            'Content-Type', 'application/json',
            'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
        ),
        body := '{"recalculate_all": false}'::jsonb
    );
    $$
);

-- --------------------------------------------------------------------
-- 4. 08:00 AM IST (02:30 UTC) — Resend Personalized Daily Digests
-- --------------------------------------------------------------------
SELECT cron.schedule(
    'jobcurrent-daily-digest-email',
    '30 2 * * *',
    $$
    SELECT net.http_post(
        url := current_setting('app.settings.edge_function_url', true) || '/send-digest',
        headers := jsonb_build_object(
            'Content-Type', 'application/json',
            'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
        ),
        body := '{"digest_date": CURRENT_DATE}'::jsonb
    );
    $$
);
