import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { MOCK_JOBS } from '../../data/mockJobs';
import { JobCard } from '../../components/jobs/JobCard';
import { 
  Sparkles, 
  Bookmark, 
  CheckSquare, 
  Calendar, 
  ArrowRight, 
  User, 
  CheckCircle2, 
  AlertTriangle,
  Briefcase,
  Sliders,
  TrendingUp,
  Bell,
  ExternalLink
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { calculateMatchScore, checkEligibility, formatDeadline } from '../../lib/utils';

export function DashboardPage() {
  const { 
    user, 
    profile, 
    preferences, 
    profileCompletion, 
    savedJobIds, 
    applications,
    notifications,
    unreadCount,
    markNotificationAsRead
  } = useAuth();

  // Calculate recommendation matches
  const recommendedJobs = MOCK_JOBS.map(job => {
    const score = calculateMatchScore(job, profile, preferences);
    const eligibility = checkEligibility(job, profile);
    return { ...job, matchScore: score, eligibility };
  }).sort((a, b) => b.matchScore - a.matchScore);

  // Filter saved jobs
  const savedJobs = MOCK_JOBS.filter(j => savedJobIds.includes(j.id));

  // Upcoming application deadlines
  const upcomingDeadlines = MOCK_JOBS.filter(j => {
    if (!j.application_deadline) return false;
    const diff = (new Date(j.application_deadline) - new Date()) / (1000 * 60 * 60 * 24);
    return diff > 0 && diff <= 10;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-brand-600 via-brand-700 to-indigo-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5" />
            Stay Current. Stay Career-Ready.
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {profile?.full_name || user?.email?.split('@')[0] || 'Friend'}!
          </h1>
          <p className="text-xs sm:text-sm text-brand-100 leading-relaxed">
            Here are today's verified opportunities tailored to your academic profile ({profile?.branch || 'Engineering'}, {profile?.graduation_year || '2026'} Batch).
          </p>
        </div>

        {/* Profile Completion Warning if < 100% */}
        {profileCompletion < 100 && (
          <div className="mt-6 pt-6 border-t border-white/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-semibold">
                <span>Profile Readiness: {profileCompletion}% Complete</span>
              </div>
              <div className="w-64 h-2 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-400 rounded-full transition-all duration-500" 
                  style={{ width: `${profileCompletion}%` }}
                />
              </div>
            </div>
            <Link to="/dashboard/profile">
              <Button size="sm" className="bg-white text-brand-700 hover:bg-brand-50 border-0 font-semibold text-xs">
                Complete Academic Profile <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Summary Stat Tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        <Link to="/jobs" className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-card hover:border-brand-300 dark:hover:border-brand-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Recommended</span>
            <div className="p-2 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">
            {recommendedJobs.length}
          </p>
          <span className="text-[11px] text-slate-400">High match accuracy</span>
        </Link>

        <Link to="/dashboard/saved" className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-card hover:border-brand-300 dark:hover:border-brand-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Saved Jobs</span>
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600">
              <Bookmark className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">
            {savedJobIds.length}
          </p>
          <span className="text-[11px] text-slate-400">Bookmarked for later</span>
        </Link>

        <Link to="/dashboard/tracker" className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-card hover:border-brand-300 dark:hover:border-brand-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Applications</span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600">
              <CheckSquare className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">
            {applications.length}
          </p>
          <span className="text-[11px] text-slate-400">Tracked in pipeline</span>
        </Link>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Urgent Deadlines</span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">
            {upcomingDeadlines.length}
          </p>
          <span className="text-[11px] text-slate-400">Closing within 10 days</span>
        </div>

      </div>

      {/* Main Split: Recommended Jobs + Quick Action Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left 2 Cols: Personalized Recommendations */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between pb-2">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-brand-600" />
                Opportunities Matched for You
              </h2>
              <p className="text-xs text-slate-500">
                Ranked by qualification score, skills overlap, and career preferences.
              </p>
            </div>
            <Link to="/jobs" className="text-xs font-semibold text-brand-600 hover:underline">
              View All
            </Link>
          </div>

          <div className="space-y-4">
            {recommendedJobs.slice(0, 4).map(job => (
              <JobCard key={job.id} job={job} showEligibility={true} />
            ))}
          </div>
        </div>

        {/* Right 1 Col: Quick Settings & Deadlines */}
        <div className="space-y-6">
          
          {/* Quick Academic Profile Summary Card */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-card space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                <User className="w-4 h-4 text-brand-600" />
                Active Academic Profile
              </h3>
              <Link to="/dashboard/profile" className="text-xs text-brand-600 font-semibold hover:underline">
                Edit
              </Link>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Degree & Branch:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 text-right truncate max-w-[180px]">
                  {profile?.degree || 'B.Tech'} - {profile?.branch || 'CSE'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">CGPA:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {profile?.cgpa || '8.4'} / 10.0
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Graduation Year:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {profile?.graduation_year || 2026}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">College:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 text-right truncate max-w-[180px]">
                  {profile?.college || 'National Institute of Tech'}
                </span>
              </div>
            </div>

            {/* User Skills Tags */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Recognized Skills
              </p>
              <div className="flex flex-wrap gap-1.5">
                {(profile?.skills || ['React', 'JavaScript', 'Python', 'SQL']).map((s, i) => (
                  <span key={i} className="text-[11px] font-medium px-2 py-0.5 rounded bg-brand-50 text-brand-700 dark:bg-brand-950/50 dark:text-brand-300">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* In-App Daily Alert Center */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-card space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                <Bell className="w-4 h-4 text-brand-600" />
                In-App Daily Alerts
              </h3>
              {unreadCount > 0 ? (
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-400 border border-brand-200/60 dark:border-brand-800">
                  {unreadCount} New
                </span>
              ) : (
                <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> All caught up
                </span>
              )}
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Real-time alerts for opportunities matching your academic qualifications and skills.
            </p>

            {/* List of Latest 3 In-App Alerts */}
            <div className="space-y-2.5">
              {notifications && notifications.length > 0 ? (
                notifications.slice(0, 3).map((notif) => (
                  <div 
                    key={notif.id}
                    className={`p-3 rounded-xl border transition text-left ${
                      !notif.is_read 
                        ? 'border-brand-200 bg-brand-50/40 dark:border-brand-900/60 dark:bg-brand-950/20' 
                        : 'border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-xs ${!notif.is_read ? 'font-bold text-slate-900 dark:text-white' : 'font-medium text-slate-700 dark:text-slate-300'} truncate`}>
                        {notif.title}
                      </p>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                      {notif.message}
                    </p>
                    {notif.job_id && (
                      <Link 
                        to={`/jobs/${notif.job_id}`}
                        onClick={() => markNotificationAsRead(notif.id)}
                        className="inline-flex items-center gap-1 text-[10px] text-brand-600 dark:text-brand-400 font-semibold mt-2 hover:underline"
                      >
                        Inspect Opportunity <ExternalLink className="w-2.5 h-2.5" />
                      </Link>
                    )}
                  </div>
                ))
              ) : (
                <div className="py-4 text-center text-xs text-slate-400">
                  No alerts currently pending.
                </div>
              )}
            </div>

            <div className="pt-2">
              <Link to="/dashboard/preferences">
                <Button variant="outline" size="sm" className="w-full text-xs">
                  Notification & Alert Preferences
                </Button>
              </Link>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
