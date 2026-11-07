import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  User, 
  GraduationCap, 
  CheckCircle2, 
  Plus, 
  X, 
  Sparkles, 
  ArrowLeft 
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { POPULAR_SKILLS } from '../../data/mockJobs';

export function ProfilePage() {
  const { profile, updateProfile, profileCompletion, user } = useAuth();

  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [college, setCollege] = useState(profile?.college || '');
  const [degree, setDegree] = useState(profile?.degree || 'B.Tech');
  const [branch, setBranch] = useState(profile?.branch || 'Computer Science & Engineering');
  const [currentYear, setCurrentYear] = useState(profile?.current_year || 4);
  const [cgpa, setCgpa] = useState(profile?.cgpa || 8.4);
  const [graduationYear, setGraduationYear] = useState(profile?.graduation_year || 2026);
  const [skills, setSkills] = useState(profile?.skills || ['React', 'JavaScript', 'Node.js', 'SQL']);
  const [customSkill, setCustomSkill] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleAddSkill = (skillToAdd) => {
    const trimmed = skillToAdd.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills(prev => [...prev, trimmed]);
    }
    setCustomSkill('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(prev => prev.filter(s => s !== skillToRemove));
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile({
      full_name: fullName,
      college,
      degree,
      branch,
      current_year: Number(currentYear),
      cgpa: Number(cgpa),
      graduation_year: Number(graduationYear),
      skills,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-brand-600" />
            Academic & Skill Profile
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            JobCurrent's eligibility engine uses these criteria to verify cut-offs before recommending jobs.
          </p>
        </div>

        {/* Readiness Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 text-xs text-brand-700 dark:text-brand-300 font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-brand-600" />
          <span>Profile Readiness: {profileCompletion}%</span>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Academic profile successfully updated! Real-time match scores have been recalculated.</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSave} className="space-y-8">
        
        {/* Section 1: Basic Identity */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 shadow-card space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
            <User className="w-4 h-4 text-brand-600" />
            Personal Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Full Name"
              required
            />
            <Input
              label="Email Address"
              value={user?.email || 'user@example.com'}
              disabled
              helperText="Managed by authentication provider"
            />
          </div>
        </div>

        {/* Section 2: College & Academic Standing */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 shadow-card space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4 text-brand-600" />
            Academic Qualifications
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Input
                label="College / University"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                placeholder="e.g. National Institute of Technology, Surathkal"
                required
              />
            </div>
            
            <div className="space-y-1.5 text-left">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Degree Program
              </label>
              <select
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-100"
              >
                <option value="B.Tech">B.Tech / B.E.</option>
                <option value="BCA">BCA</option>
                <option value="B.Sc">B.Sc Computer Science</option>
                <option value="M.Tech">M.Tech / M.E.</option>
                <option value="MCA">MCA</option>
                <option value="M.Sc">M.Sc</option>
                <option value="Other">Other Degree</option>
              </select>
            </div>

            <div className="space-y-1.5 text-left">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Branch / Specialization
              </label>
              <input
                type="text"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                placeholder="e.g. Computer Science & Engineering"
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-100"
                required
              />
            </div>

            <div>
              <Input
                label="Cumulative CGPA (0.00 – 10.00)"
                type="number"
                step="0.01"
                min="0.0"
                max="10.0"
                value={cgpa}
                onChange={(e) => setCgpa(e.target.value)}
                placeholder="8.5"
                required
              />
            </div>

            <div className="space-y-1.5 text-left">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Graduation Year
              </label>
              <select
                value={graduationYear}
                onChange={(e) => setGraduationYear(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-100"
              >
                <option value="2025">2025</option>
                <option value="2026">2026</option>
                <option value="2027">2027</option>
                <option value="2028">2028</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Skills Inventory */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Skills & Technologies
            </h2>
            <span className="text-xs text-slate-400">{skills.length} selected</span>
          </div>

          {/* Active Skills Chips */}
          <div className="flex flex-wrap gap-2 min-h-12 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
            {skills.map(skill => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg bg-brand-50 border border-brand-200 text-brand-700 dark:bg-brand-950/60 dark:border-brand-800 dark:text-brand-300"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="hover:text-red-500 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>

          {/* Add custom skill input */}
          <div className="flex gap-2">
            <Input
              value={customSkill}
              onChange={(e) => setCustomSkill(e.target.value)}
              placeholder="Add another technology or skill (e.g. Next.js, Kubernetes)"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSkill(customSkill);
                }
              }}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => handleAddSkill(customSkill)}
              icon={Plus}
            >
              Add
            </Button>
          </div>

          {/* Popular Skill Suggestions */}
          <div className="space-y-1.5 pt-2">
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Quick Suggestions
            </p>
            <div className="flex flex-wrap gap-1.5">
              {POPULAR_SKILLS.filter(s => !skills.includes(s)).slice(0, 10).map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleAddSkill(s)}
                  className="text-xs px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-brand-500 hover:text-brand-600 transition"
                >
                  + {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex justify-end pt-2">
          <Button type="submit" variant="primary" size="lg" className="px-8 font-semibold shadow-md">
            Save Academic Profile
          </Button>
        </div>

      </form>

    </div>
  );
}
