import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Building2, 
  MapPin, 
  Clock, 
  Calendar, 
  Bookmark, 
  CheckCircle, 
  AlertCircle, 
  HelpCircle,
  ExternalLink,
  GraduationCap,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { 
  formatSalaryRange, 
  timeAgo, 
  formatDeadline, 
  checkEligibility, 
  calculateMatchScore 
} from '../../lib/utils';

export function JobCard({ job, showEligibility = true }) {
  const { user, profile, preferences, isJobSaved, toggleSaveJob } = useAuth();
  const saved = isJobSaved(job.id);

  const deadlineInfo = formatDeadline(job.application_deadline);
  const salaryString = formatSalaryRange(
    job.salary_min, 
    job.salary_max, 
    job.stipend, 
    job.currency, 
    job.job_type
  );

  // Compute eligibility and match score if user is logged in
  const eligibility = user ? checkEligibility(job, profile) : null;
  const matchScore = user ? calculateMatchScore(job, profile, preferences) : null;

  return (
    <div className="group relative bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-card hover:shadow-card-hover hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200 flex flex-col justify-between">
      
      {/* Top Header: Logo, Company, Title, Save Button */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-start gap-3.5">
            {job.company_logo ? (
              <img
                src={job.company_logo}
                alt={job.company_name}
                className="w-12 h-12 rounded-xl object-cover border border-slate-100 dark:border-slate-800 shrink-0 bg-slate-50 dark:bg-slate-800"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div 
              style={{ display: job.company_logo ? 'none' : 'flex' }}
              className="w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-950/60 border border-brand-100 dark:border-brand-900/40 text-brand-700 dark:text-brand-300 items-center justify-center font-bold text-lg shrink-0"
            >
              {job.company_name ? job.company_name[0] : 'J'}
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  {job.company_name}
                </span>
                {job.is_demo && (
                  <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700">
                    Verified Listing
                  </span>
                )}
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  • <Clock className="w-3 h-3" /> {timeAgo(job.posted_at)}
                </span>
              </div>
              <Link to={`/jobs/${job.id}`}>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-1 mt-0.5">
                  {job.title}
                </h3>
              </Link>
            </div>
          </div>

          {/* Bookmark Button */}
          <button
            onClick={() => toggleSaveJob(job.id)}
            title={saved ? "Remove from saved" : "Save opportunity"}
            className={`p-2 rounded-xl border transition-all ${
              saved 
                ? 'bg-brand-50 border-brand-200 text-brand-600 dark:bg-brand-950/50 dark:border-brand-900/80 dark:text-brand-400' 
                : 'border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Badges: Work Mode, Type, Compensation, Location */}
        <div className="flex flex-wrap items-center gap-2 mb-3.5">
          <Badge variant="blue" size="sm" className="capitalize">
            {job.work_mode}
          </Badge>
          <Badge variant="purple" size="sm" className="capitalize">
            {job.job_type}
          </Badge>
          <Badge variant="green" size="sm" className="font-semibold">
            {salaryString}
          </Badge>
          {job.location && (
            <span className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
              <MapPin className="w-3 h-3 text-slate-400" />
              {job.location}
            </span>
          )}
        </div>

        {/* Academic Eligibility Requirements (CGPA, Grad Years) */}
        {(job.minimum_cgpa || (job.eligible_graduation_years && job.eligible_graduation_years.length > 0)) && (
          <div className="flex items-center gap-2 mb-3.5 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
            <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">
              {job.minimum_cgpa && `Min CGPA: ${job.minimum_cgpa}`}
              {job.minimum_cgpa && job.eligible_graduation_years?.length > 0 && " • "}
              {job.eligible_graduation_years?.length > 0 && `Batches: ${job.eligible_graduation_years.join(', ')}`}
            </span>
          </div>
        )}

        {/* Skills Tag Pills */}
        {job.required_skills && job.required_skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {job.required_skills.slice(0, 4).map((skill, idx) => (
              <span
                key={idx}
                className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
              >
                {skill}
              </span>
            ))}
            {job.required_skills.length > 4 && (
              <span className="text-[11px] font-medium px-1.5 py-0.5 text-slate-400">
                +{job.required_skills.length - 4} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer Info & Personalized Match Bar */}
      <div>
        {/* Match and Eligibility Breakdown if user logged in */}
        {showEligibility && user && eligibility && (
          <div className="mb-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {matchScore}% Match
              </span>
            </div>
            
            <div>
              {eligibility.status === 'eligible' && (
                <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle className="w-3.5 h-3.5" /> Eligible
                </span>
              )}
              {eligibility.status === 'not_eligible' && (
                <span className="inline-flex items-center gap-1 font-semibold text-rose-600 dark:text-rose-400">
                  <AlertCircle className="w-3.5 h-3.5" /> Not Eligible
                </span>
              )}
              {eligibility.status === 'unknown' && (
                <span className="inline-flex items-center gap-1 font-medium text-amber-600 dark:text-amber-400">
                  <HelpCircle className="w-3.5 h-3.5" /> Eligibility Unchecked
                </span>
              )}
            </div>
          </div>
        )}

        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
          {/* Source Attribution & Deadline */}
          <div className="text-[11px] text-slate-500 space-y-0.5">
            <p className="truncate">
              Source: <span className="font-medium text-slate-700 dark:text-slate-300">{job.source_name}</span>
            </p>
            <p className={`font-medium ${deadlineInfo.isUrgent ? 'text-amber-600 dark:text-amber-400 font-semibold' : 'text-slate-400'}`}>
              {deadlineInfo.text}
            </p>
          </div>

          {/* Action Button */}
          <Link to={`/jobs/${job.id}`}>
            <Button variant="outline" size="sm" className="group-hover:bg-brand-50 group-hover:border-brand-200 group-hover:text-brand-700 dark:group-hover:bg-brand-950/40">
              Details
              <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
