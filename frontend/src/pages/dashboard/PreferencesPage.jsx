import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Settings, 
  Mail, 
  Clock, 
  MapPin, 
  Briefcase, 
  DollarSign, 
  CheckCircle2, 
  BellRing,
  Globe
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { POPULAR_DOMAINS, WORK_MODES, JOB_TYPES } from '../../data/mockJobs';

export function PreferencesPage() {
  const { preferences, updatePreferences } = useAuth();

  const [interestedRoles, setInterestedRoles] = useState(
    (preferences?.interested_roles || ['Software Engineer', 'Frontend Developer']).join(', ')
  );
  const [preferredDomains, setPreferredDomains] = useState(
    preferences?.preferred_domains || ['Engineering', 'Data & AI']
  );
  const [preferredLocations, setPreferredLocations] = useState(
    (preferences?.preferred_locations || ['Bengaluru', 'Remote']).join(', ')
  );
  const [workModes, setWorkModes] = useState(preferences?.work_modes || ['remote', 'hybrid']);
  const [jobTypes, setJobTypes] = useState(preferences?.job_types || ['internship', 'full-time']);
  const [minSalary, setMinSalary] = useState(preferences?.minimum_salary || 800000);
  const [minStipend, setMinStipend] = useState(preferences?.minimum_stipend || 35000);
  const [paidOnly, setPaidOnly] = useState(preferences?.paid_only ?? true);
  const [includeUnknown, setIncludeUnknown] = useState(preferences?.include_unknown_eligibility ?? true);
  
  // Notification settings
  const [inAppEnabled, setInAppEnabled] = useState(preferences?.in_app_notifications_enabled ?? true);
  const [emailEnabled, setEmailEnabled] = useState(preferences?.email_enabled ?? false);
  const [frequency, setFrequency] = useState(preferences?.notification_frequency || 'daily');
  const [notifTime, setNotifTime] = useState(preferences?.notification_time || '08:00');
  const [timezone, setTimezone] = useState(preferences?.timezone || 'Asia/Kolkata');

  const [savedSuccess, setSavedSuccess] = useState(false);

  const toggleWorkMode = (mode) => {
    setWorkModes(prev => 
      prev.includes(mode) ? prev.filter(m => m !== mode) : [...prev, mode]
    );
  };

  const toggleJobType = (type) => {
    setJobTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const toggleDomain = (domain) => {
    setPreferredDomains(prev => 
      prev.includes(domain) ? prev.filter(d => d !== domain) : [...prev, domain]
    );
  };

  const handleSave = (e) => {
    e.preventDefault();
    updatePreferences({
      interested_roles: interestedRoles.split(',').map(s => s.trim()).filter(Boolean),
      preferred_domains: preferredDomains,
      preferred_locations: preferredLocations.split(',').map(s => s.trim()).filter(Boolean),
      work_modes: workModes,
      job_types: jobTypes,
      minimum_salary: Number(minSalary),
      minimum_stipend: Number(minStipend),
      paid_only: paidOnly,
      include_unknown_eligibility: includeUnknown,
      in_app_notifications_enabled: inAppEnabled,
      email_enabled: emailEnabled,
      notification_frequency: frequency,
      notification_time: notifTime,
      timezone,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-brand-600" />
          Career & Notification Preferences
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Customize what jobs qualify for your personalized dashboard and daily email digests.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Preferences updated! Your recommendation feed and daily digest queues will reflect these settings.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* Section 1: Role & Work Preference */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 shadow-card space-y-5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
            <Briefcase className="w-4 h-4 text-brand-600" />
            Roles & Work Settings
          </h2>

          <Input
            label="Interested Job Titles (comma separated)"
            value={interestedRoles}
            onChange={(e) => setInterestedRoles(e.target.value)}
            placeholder="Software Engineer, Frontend Developer, Data Analyst"
            helperText="We will prioritize jobs whose titles match any of these keywords."
          />

          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Work Modes Accepted
            </label>
            <div className="flex flex-wrap gap-2">
              {['remote', 'hybrid', 'onsite'].map(mode => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => toggleWorkMode(mode)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg border capitalize transition-all ${
                    workModes.includes(mode)
                      ? 'bg-brand-600 border-brand-600 text-white'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Opportunity Types
            </label>
            <div className="flex flex-wrap gap-2">
              {['internship', 'full-time', 'part-time'].map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => toggleJobType(type)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg border capitalize transition-all ${
                    jobTypes.includes(type)
                      ? 'bg-brand-600 border-brand-600 text-white'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <Input
            label="Preferred Locations (comma separated)"
            value={preferredLocations}
            onChange={(e) => setPreferredLocations(e.target.value)}
            placeholder="Bengaluru, Hyderabad, Remote"
          />
        </div>

        {/* Section 2: Compensation & Eligibility Flexibility */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 shadow-card space-y-5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            Compensation & Eligibility Rules
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Minimum Expected Full-Time CTC (INR)"
              type="number"
              value={minSalary}
              onChange={(e) => setMinSalary(e.target.value)}
              placeholder="800000"
              helperText="Ex: 800000 = ₹8 LPA"
            />
            <Input
              label="Minimum Expected Internship Stipend (INR/mo)"
              type="number"
              value={minStipend}
              onChange={(e) => setMinStipend(e.target.value)}
              placeholder="35000"
              helperText="Ex: 35000 = ₹35k/month"
            />
          </div>

          <div className="pt-2 space-y-3">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={paidOnly}
                onChange={(e) => setPaidOnly(e.target.checked)}
                className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
              />
              Filter out unpaid roles (Only show paid jobs & internships)
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={includeUnknown}
                onChange={(e) => setIncludeUnknown(e.target.checked)}
                className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
              />
              Include opportunities where eligibility is unverified or unspecified
            </label>
          </div>
        </div>

        {/* Section 3: Notification & Daily Alert Center */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 shadow-card space-y-5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
            <BellRing className="w-4 h-4 text-brand-600" />
            Daily Alerts & Notification Center
          </h2>

          {/* In-App Notifications (Option 1) */}
          <div className="p-4 rounded-xl bg-brand-50/50 dark:bg-brand-950/30 border border-brand-200/60 dark:border-brand-800/60 space-y-2">
            <label className="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-slate-900 dark:text-white">
              <input
                type="checkbox"
                checked={inAppEnabled}
                onChange={(e) => setInAppEnabled(e.target.checked)}
                className="rounded border-slate-300 text-brand-600 focus:ring-brand-500 w-4 h-4"
              />
              In-App Daily Alert Center (Recommended — 100% Free & Zero Spam)
            </label>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 pl-6.5 leading-relaxed">
              Receive direct notification bell alerts and dashboard banners whenever newly discovered opportunities match your skills and academic criteria. No email setup required.
            </p>
          </div>

          {/* Optional External Email Digest */}
          <div className="space-y-3 pt-2">
            <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-slate-800 dark:text-slate-200">
              <input
                type="checkbox"
                checked={emailEnabled}
                onChange={(e) => setEmailEnabled(e.target.checked)}
                className="rounded border-slate-300 text-brand-600 focus:ring-brand-500 w-4 h-4"
              />
              Also send me email digests (Optional)
            </label>

            {emailEnabled && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="space-y-1.5 text-left">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    Digest Frequency
                  </label>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-800 dark:text-slate-200"
                  >
                    <option value="daily">Daily Digest (Recommended)</option>
                    <option value="weekly">Weekly Summary</option>
                  </select>
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    Delivery Time
                  </label>
                  <input
                    type="time"
                    value={notifTime}
                    onChange={(e) => setNotifTime(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-800 dark:text-slate-200"
                  />
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    Timezone
                  </label>
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-800 dark:text-slate-200"
                  >
                    <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">US Eastern (EST)</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <Button type="submit" variant="primary" size="lg" className="px-8 font-semibold shadow-md">
            Save Preferences
          </Button>
        </div>

      </form>

    </div>
  );
}
