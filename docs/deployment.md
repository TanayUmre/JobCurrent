# JobCurrent — Deployment & Production Setup Guide

---

## ☁️ 1. Supabase Backend Setup

1. Create a project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor** and run:
   - `backend/supabase/migrations/20261107000000_initial_schema.sql`
   - `backend/supabase/migrations/20261107000001_cron_schedules.sql`
   - (Optional seed) `backend/supabase/seeds/seed_data.sql`
3. In **Project Settings -> API**, copy:
   - `Project URL`
   - `anon public key`
   - `service_role secret key`
4. Deploy Edge Functions using the Supabase CLI:
   ```bash
   supabase functions deploy collect-jobs
   supabase functions deploy extract-ai
   supabase functions deploy match-engine
   supabase functions deploy send-digest
   ```
5. Set secrets in Supabase:
   ```bash
   supabase secrets set GROQ_API_KEY=gsk_...
   supabase secrets set RESEND_API_KEY=re_...
   ```

---

## 🚀 2. Vercel Frontend Deployment

1. Import your GitHub repository into [Vercel](https://vercel.com).
2. Set the **Root Directory** to `frontend`.
3. Add environment variables:
   - `VITE_SUPABASE_URL`: Your Supabase Project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase Anon Public Key
4. Deploy! Vercel will automatically build the React + Vite application.
