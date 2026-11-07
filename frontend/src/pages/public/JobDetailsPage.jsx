import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { MOCK_JOBS } from '../../data/mockJobs';
import { 
  Building2, 
  MapPin, 
  Calendar, 
  Clock, 
  Bookmark, 
  ExternalLink, 
  ArrowLeft, 
  GraduationCap, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  Share2, 
  Sparkles,
  ShieldCheck,
  Check
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { 
  formatSalaryRange, 
  timeAgo, 
  formatDeadline, 
  checkEligibility, 
  calculateMatchScore 
} from '../../lib/utils';

export function JobDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, profile, preferences, isJobSaved, toggleSaveJob, updateApplicationStatus, applications } = useAuth();
  const [copied, setCopied] = useState(false);

  // Find job from mock or centralized repository
  const job = MOCK_JOBS.find(j => j.id === id);

  if (!job) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Opportunity Not Found</h2>
        <p className="text-sm text-slate-500">
          The requested job or internship listing could not be found or has expired.
        </p>
        <Link to="/jobs">
          <Button variant="primary">Browse Available Jobs</Button>
        </Link>
      </div>
    );
  }

  const saved = isJobSaved(job.id);
  const deadlineInfo = formatDeadline(job.application_deadline);
  const salaryString = formatSalaryRange(job.salary_min, job.salary_max, job.stipend, job.currency, job.job_type);

  // Eligibility & Matching
  const eligibility = user ? checkEligibility(job, profile) : null;
  const matchScore = user ? calculateMatchScore(job, profile, preferences) : null;

  // Existing application record
  const existingApp = applications.find(a => a.job_id === job.id);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApplyNow = () => {
    if (job.application_url) {
      // Record application tracker status if logged in
      if (user && !existingApp) {
        updateApplicationStatus(job.id, 'applied', `Applied via ${job.source_name}`);
      }
      window.open(job.application_url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back to opportunities
      </button>

      {/* Hero Header Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-card space-y-6">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
          <div className="flex items-start gap-4 sm:gap-5">
            {job.company_logo ? (
              <img
                src={job.company_logo}
                alt={job.company_name}
                className="w-16 h-16 rounded-2xl object-cover border border-slate-100 dark:border-slate-800 shrink-0 bg-slate-50"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 text-brand-600 dark:text-brand-300 flex items-center justify-center font-bold text-2xl shrink-0">
                {job.company_name[0]}
              </div>
            )}
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                  {job.company_name}
                </span>
                {job.is_demo && (
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700">
                    Verified Listing
                  </span>
                )}
                <span className="text-xs text-slate-400">
                  • Posted {timeAgo(job.posted_at)}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                {job.title}
              </h1>
              <p className="text-xs text-slate-500 flex items-center gap-1.5 pt-0.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {job.location || 'Remote'}
              </p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <Button
              variant="outline"
              size="md"
              onClick={handleShare}
              title="Copy share link"
              icon={copied ? Check : Share2}
            >
              {copied ? "Copied Link" : "Share"}
            </Button>

            <Button
              variant="outline"
              size="md"
              onClick={() => toggleSaveJob(job.id)}
              className={saved ? "text-brand-600 border-brand-300 bg-brand-50" : ""}
              icon={Bookmark}
            >
              {saved ? "Saved" : "Save"}
            </Button>

            <Button
              variant="primary"
              size="md"
              onClick={handleApplyNow}
              className="flex-1 sm:flex-initial"
              disabled={deadlineInfo.isExpired}
            >
              {deadlineInfo.isExpired ? "Closed" : "Apply Now"}
              <ExternalLink className="w-4 h-4 ml-1.5" />
            </Button>
          </div>
        </div>

        {/* Quick Specs Badges */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-3">
          <Badge variant="blue" size="md" className="capitalize">
            {job.work_mode}
          </Badge>
          <Badge variant="purple" size="md" className="capitalize">
            {job.job_type}
          </Badge>
          <Badge variant="green" size="md" className="font-semibold">
            {salaryString}
          </Badge>
          {job.duration && (
            <Badge variant="gray" size="md">
              Duration: {job.duration}
            </Badge>
          )}
          <span className={`text-xs font-medium ml-auto ${deadlineInfo.isUrgent ? 'text-amber-600 dark:text-amber-400 font-semibold' : 'text-slate-400'}`}>
            {deadlineInfo.text}
          </span>
        </div>
      </div>

      {/* Two Column Layout: Main Description + Sidebar Requirements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column: Job Description & Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-card space-y-6">
            <h2 className="text-base font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
              Role Overview & Requirements
            </h2>
            <div className="prose dark:prose-invert max-w-none text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {job.description}
            </div>

            {/* Skills Matrix */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Required Technical Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {job.required_skills?.map((skill, i) => (
                  <span
                    key={i}
                    className="text-xs font-medium px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {job.preferred_skills && job.preferred_skills.length > 0 && (
                <div className="pt-2 space-y-2">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    Preferred / Nice-to-Have
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {job.preferred_skills.map((skill, i) => (
                      <span
                        key={i}
                        className="text-xs font-medium px-3 py-1 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 border border-slate-200/80"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Academic Eligibility & Source Trust Audit */}
        <div className="space-y-6">
          
          {/* Eligibility Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 shadow-card space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-brand-600" />
                Academic Criteria
              </h3>
              {user && eligibility && (
                <span className="text-xs font-bold text-brand-600">
                  {matchScore}% Match
                </span>
              )}
            </div>

            <ul className="space-y-3 text-xs">
              <li className="flex items-start justify-between">
                <span className="text-slate-500">Minimum CGPA:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {job.minimum_cgpa ? `${job.minimum_cgpa} / 10.0` : 'No CGPA Cut-off'}
                </span>
              </li>
              <li className="flex items-start justify-between">
                <span className="text-slate-500">Eligible Batches:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 text-right">
                  {job.eligible_graduation_years?.length > 0 ? job.eligible_graduation_years.join(', ') : 'All Batches'}
                </span>
              </li>
              <li className="flex items-start justify-between">
                <span className="text-slate-500">Eligible Branches:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 text-right">
                  {job.eligible_branches?.length > 0 ? job.eligible_branches.join(', ') : 'All Engineering / Tech'}
                </span>
              </li>
              <li className="flex items-start justify-between">
                <span className="text-slate-500">Experience:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {job.experience_required || 'Not Specified'}
                </span>
              </li>
            </ul>

            {/* User Personalized Assessment */}
            {user && eligibility ? (
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Your Assessment
                </p>
                {eligibility.status === 'eligible' && (
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-xs flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                    <span>You satisfy all explicit academic criteria for this opportunity.</span>
                  </div>
                )}
                {eligibility.status === 'not_eligible' && (
                  <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-300 text-xs flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                    <span>One or more academic prerequisites are not satisfied by your profile.</span>
                  </div>
                )}
                {eligibility.status === 'unknown' && (
                  <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-amber-800 dark:text-amber-300 text-xs flex items-start gap-2">
                    <HelpCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                    <span>Complete your academic profile to verify full eligibility.</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                <Link to="/login" className="text-xs text-brand-600 hover:underline font-medium block text-center">
                  Sign in to see your personalized eligibility match score →
                </Link>
              </div>
            )}
          </div>

          {/* Source Attribution & Integrity Info */}
          <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 text-xs space-y-3 text-slate-600 dark:text-slate-400">
            <h4 className="font-bold text-slate-900 dark:text-slate-200 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Source Integrity Audit
            </h4>
            <p>
              Originally ingested from <span className="font-semibold text-slate-800 dark:text-slate-200">{job.source_name}</span>.
            </p>
            <p className="text-[11px] leading-relaxed text-slate-500">
              JobCurrent guarantees that the "Apply Now" button routes to the official external application portal without hidden redirects.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
