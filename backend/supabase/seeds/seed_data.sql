-- ====================================================================
-- JobCurrent — Seed Data Script for Development & Staging
-- ====================================================================

-- Seed verified initial listings
INSERT INTO public.jobs (
    id, title, company_name, company_logo, description, source_name, source_job_id,
    original_url, application_url, location, work_mode, job_type, salary_min, salary_max,
    stipend, currency, paid_status, required_skills, preferred_skills, minimum_cgpa,
    eligible_branches, eligible_graduation_years, experience_required, duration,
    application_deadline, posted_at, status, is_demo
) VALUES 
(
    '00000000-0000-0000-0000-000000000001',
    'Software Engineer Intern (Frontend / React)',
    'Razorpay',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&h=128&fit=crop&crop=faces',
    'Join Razorpay core checkout engineering team building responsive web payments interfaces.',
    'Permitted Career Board',
    'RZP-INT-2026-01',
    'https://razorpay.com/jobs',
    'https://razorpay.com/jobs',
    'Bengaluru, Karnataka',
    'hybrid',
    'internship',
    NULL,
    NULL,
    45000,
    'INR',
    'paid',
    ARRAY['React', 'JavaScript', 'HTML/CSS', 'Git', 'REST APIs'],
    ARRAY['TypeScript', 'Tailwind CSS'],
    7.5,
    ARRAY['Computer Science', 'Information Technology', 'Electronics'],
    ARRAY[2026, 2027],
    'College Student',
    '6 Months',
    NOW() + INTERVAL '14 days',
    NOW() - INTERVAL '2 days',
    'active',
    true
),
(
    '00000000-0000-0000-0000-000000000002',
    'Junior Backend Developer (Go / Node.js)',
    'Postman',
    'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=128&h=128&fit=crop&crop=faces',
    'Scale Postman microservices handling high throughput collaboration workflows.',
    'RemoteOK API',
    'PST-BE-2026-88',
    'https://remoteok.com',
    'https://www.postman.com/careers',
    'Bengaluru, Karnataka (Remote OK)',
    'remote',
    'full-time',
    1200000,
    1800000,
    NULL,
    'INR',
    'paid',
    ARRAY['Node.js', 'SQL', 'REST APIs', 'Git', 'Docker'],
    ARRAY['Go', 'PostgreSQL', 'Kafka'],
    7.0,
    ARRAY['Computer Science', 'Information Technology'],
    ARRAY[2025, 2026],
    '0-2 Years',
    'Permanent',
    NOW() + INTERVAL '21 days',
    NOW() - INTERVAL '1 day',
    'active',
    true
)
ON CONFLICT (source_name, source_job_id) DO NOTHING;
