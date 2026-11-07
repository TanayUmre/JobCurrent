import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  Mail, 
  Sliders, 
  CheckSquare, 
  ShieldCheck, 
  Building2, 
  Briefcase, 
  TrendingUp, 
  ChevronDown, 
  ChevronUp,
  Zap,
  GraduationCap
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { MOCK_JOBS } from '../../data/mockJobs';
import { JobCard } from '../../components/jobs/JobCard';

export function LandingPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState(null);
  const navigate = useNavigate();

  const handleHeroSearch = (e) => {
    e.preventDefault();
    navigate(`/jobs?search=${encodeURIComponent(searchQuery)}`);
  };

  const toggleFaq = (idx) => {
    setOpenFaq(prev => prev === idx ? null : idx);
  };

  const featuredJobs = MOCK_JOBS.slice(0, 3);

  const faqs = [
    {
      q: "How does JobCurrent collect job and internship listings?",
      a: "JobCurrent continuously connects to verified, permitted public job feeds, official company career portals, and open developer APIs (such as Arbeitnow and RemoteOK). We respect platform terms of service, robots policies, and rate limits, deduplicating listings before storing them in our centralized PostgreSQL database."
    },
    {
      q: "What makes the personalized eligibility matching different?",
      a: "Unlike typical job boards that only do simple keyword matching, JobCurrent evaluates deterministic academic constraints such as your graduation batch, degree branch, and minimum CGPA criteria. Missing job requirements are never assumed to be satisfied, ensuring you never waste time applying to roles you are not eligible for."
    },
    {
      q: "Can I explore opportunities without creating an account?",
      a: "Yes! JobCurrent is completely open for public browsing. Visitors can search, apply multi-faceted filters, and view verified application links without registering. An account is only needed if you want personalized eligibility matching, saved jobs, application tracking, and automated daily email digests."
    },
    {
      q: "How does the daily email digest work?",
      a: "Every morning, our background automation checks the newest opportunities against your profile and career preferences. If matching roles are found, JobCurrent generates a clean, concise HTML email digest summarizing eligible roles with direct application links."
    },
    {
      q: "Are the application links authentic?",
      a: "Absolutely. JobCurrent preserves the original company or source application URL. We never fabricate links or mask the destination. If an application URL is unavailable or expired, we clearly disclose it."
    }
  ];

  return (
    <div className="space-y-20 sm:space-y-28 pb-20">
      
      {/* HERO SECTION */}
      <section className="relative pt-12 sm:pt-20 pb-16 overflow-hidden">
        {/* Subtle background ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-brand-500/10 dark:bg-brand-500/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          
          {/* Tagline Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 text-brand-700 dark:text-brand-300 text-xs font-semibold mb-6 animate-fade-in shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            <span>AI-Assisted Career Discovery • Stay Current. Stay Career-Ready.</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            Discover Jobs & Internships <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-brand-800 dark:from-brand-400 dark:to-brand-200">
              Matched to Your Qualifications.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Stop searching across dozens of websites. Discover opportunities from multiple permitted sources, accurately matched against your academic degree, CGPA, skills, and personal career preferences.
          </p>

          {/* Hero Search Box */}
          <form onSubmit={handleHeroSearch} className="mt-8 max-w-2xl mx-auto">
            <div className="p-2 sm:p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xl flex flex-col sm:flex-row items-center gap-2">
              <div className="relative flex-1 w-full flex items-center">
                <Search className="absolute left-3.5 w-5 h-5 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Role, tech stack (e.g. React, Python), or company..."
                  className="w-full pl-11 pr-4 py-2.5 text-sm sm:text-base bg-transparent border-0 focus:outline-none text-slate-900 dark:text-slate-100 placeholder-slate-400"
                />
              </div>
              <Button type="submit" variant="primary" size="md" className="w-full sm:w-auto px-6 font-semibold shadow-md">
                Search Jobs
              </Button>
            </div>
          </form>

          {/* Quick CTA Links */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs">
            <Link to="/jobs">
              <Button variant="outline" size="sm" className="font-medium">
                Browse All Opportunities <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="subtle" size="sm" className="font-medium">
                Create Free Profile & Get Daily Digests
              </Button>
            </Link>
          </div>

          {/* Trust Highlights */}
          <div className="mt-12 pt-8 border-t border-slate-200/60 dark:border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
            <div className="p-3">
              <p className="text-2xl font-bold text-slate-900 dark:text-white">Multi-Source</p>
              <p className="text-xs text-slate-500 mt-0.5">Aggregated from permitted boards & APIs</p>
            </div>
            <div className="p-3">
              <p className="text-2xl font-bold text-brand-600 dark:text-brand-400">Strict CGPA</p>
              <p className="text-xs text-slate-500 mt-0.5">Verified academic eligibility checks</p>
            </div>
            <div className="p-3">
              <p className="text-2xl font-bold text-slate-900 dark:text-white">Daily Digests</p>
              <p className="text-xs text-slate-500 mt-0.5">Personalized email notifications</p>
            </div>
            <div className="p-3">
              <p className="text-2xl font-bold text-emerald-600">100% Real</p>
              <p className="text-xs text-slate-500 mt-0.5">Verified company application links</p>
            </div>
          </div>

        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <Badge variant="blue" size="md" className="mb-2">Automated Architecture</Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            How JobCurrent Works For You
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
            A three-tier discovery system designed to eliminate manual search fatigue and keep you career-ready.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          
          {/* Step 1 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-card space-y-4">
            <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold">
              1
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Scheduled Job Aggregation
            </h3>
            <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
              Our automated background connectors continuously ingest job and internship openings from permitted sources, normalize details, deduplicate descriptions, and update application deadlines.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-card space-y-4">
            <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold">
              2
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Qualification & Eligibility Engine
            </h3>
            <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
              Deterministic parsing and AI extraction check your CGPA, graduation batch, degree branch, and tech skills. Every job gets an explicit status: Eligible, Not Eligible, or Unknown.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-card space-y-4">
            <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold">
              3
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Daily Digest & Application Tracker
            </h3>
            <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
              Wake up to an organized email digest of newly discovered matching roles. Save interesting opportunities and track your pipeline from Applied through Interview to Offer.
            </p>
          </div>

        </div>
      </section>

      {/* FEATURED / RECENT OPPORTUNITIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Latest Verified Opportunities
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Sample listings from our centralized PostgreSQL repository.
            </p>
          </div>
          <Link to="/jobs">
            <Button variant="outline" size="sm">
              View All Opportunities <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredJobs.map(job => (
            <JobCard key={job.id} job={job} showEligibility={false} />
          ))}
        </div>
      </section>

      {/* CORE FEATURES SHOWCASE */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-slate-900 text-white p-8 sm:p-12 lg:p-16 border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl space-y-4 relative z-10">
            <Badge variant="blue" size="md">Engineered for Students & Job Seekers</Badge>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              Personalized Matching That Respects Eligibility Rules.
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Never apply for a role with a 7.5 CGPA cut-off or a 2025 batch lock if you don't qualify. JobCurrent brings radical transparency to career discovery.
            </p>
            
            <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Deterministic CGPA verification</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Eligible graduation year matching</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Missing criteria treated as unknown</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero duplicate listings across sources</span>
              </div>
            </div>

            <div className="pt-4">
              <Link to="/register">
                <Button variant="primary" size="md" className="bg-brand-500 hover:bg-brand-600 text-white font-semibold">
                  Get Started Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQS SECTION */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Everything you need to know about the JobCurrent platform.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900/60 overflow-hidden transition-all"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full p-4 text-left flex items-center justify-between text-sm font-semibold text-slate-900 dark:text-slate-100 hover:text-brand-600"
              >
                <span>{faq.q}</span>
                {openFaq === idx ? (
                  <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                )}
              </button>
              {openFaq === idx && (
                <div className="px-4 pb-4 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
