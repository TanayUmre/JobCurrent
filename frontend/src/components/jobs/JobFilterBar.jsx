import React from 'react';
import { 
  Filter, 
  RotateCcw, 
  Briefcase, 
  MapPin, 
  GraduationCap, 
  DollarSign, 
  SlidersHorizontal 
} from 'lucide-react';
import { Button } from '../common/Button';
import { POPULAR_SKILLS, POPULAR_DOMAINS, WORK_MODES, JOB_TYPES } from '../../data/mockJobs';

export function JobFilterBar({ filters, setFilters, onReset, totalCount }) {
  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleSkill = (skill) => {
    setFilters(prev => {
      const current = prev.skills || [];
      const updated = current.includes(skill)
        ? current.filter(s => s !== skill)
        : [...current, skill];
      return { ...prev, skills: updated };
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-card space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Filters ({totalCount} opportunities)
          </h3>
        </div>
        <button
          onClick={onReset}
          className="text-xs font-medium text-slate-500 hover:text-brand-600 dark:hover:text-brand-400 flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          Reset All
        </button>
      </div>

      {/* Opportunity Type */}
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
          Opportunity Type
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {JOB_TYPES.map(type => (
            <button
              key={type.value}
              onClick={() => updateFilter('jobType', type.value)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all text-left truncate ${
                filters.jobType === type.value
                  ? 'bg-brand-50 border-brand-300 text-brand-700 dark:bg-brand-950/60 dark:border-brand-800 dark:text-brand-300 font-semibold'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Work Mode */}
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
          Work Mode
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {WORK_MODES.map(mode => (
            <button
              key={mode.value}
              onClick={() => updateFilter('workMode', mode.value)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all text-left truncate ${
                filters.workMode === mode.value
                  ? 'bg-brand-50 border-brand-300 text-brand-700 dark:bg-brand-950/60 dark:border-brand-800 dark:text-brand-300 font-semibold'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* Domain */}
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
          Career Domain
        </label>
        <select
          value={filters.domain || 'all'}
          onChange={(e) => updateFilter('domain', e.target.value)}
          className="w-full text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          <option value="all">All Domains</option>
          {POPULAR_DOMAINS.map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      {/* Academic Eligibility: Graduation Year & CGPA */}
      <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
          <GraduationCap className="w-3.5 h-3.5 text-slate-500" />
          Academic Filters
        </label>

        <div className="space-y-2">
          <div className="flex justify-between text-xs text-slate-600 dark:text-slate-300">
            <span>Graduation Year</span>
            <span className="font-semibold text-brand-600">{filters.graduationYear || 'Any'}</span>
          </div>
          <select
            value={filters.graduationYear || ''}
            onChange={(e) => updateFilter('graduationYear', e.target.value)}
            className="w-full text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-slate-800 dark:text-slate-200"
          >
            <option value="">Any Graduation Batch</option>
            <option value="2025">2025 Batch</option>
            <option value="2026">2026 Batch</option>
            <option value="2027">2027 Batch</option>
            <option value="2028">2028 Batch</option>
          </select>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-xs text-slate-600 dark:text-slate-300">
            <span>Max Required CGPA</span>
            <span className="font-semibold text-brand-600">{filters.maxCgpa ? `<= ${filters.maxCgpa}` : 'Any'}</span>
          </div>
          <input
            type="range"
            min="6.0"
            max="9.0"
            step="0.5"
            value={filters.maxCgpa || 9.0}
            onChange={(e) => updateFilter('maxCgpa', e.target.value)}
            className="w-full accent-brand-600"
          />
        </div>
      </div>

      {/* Skills Filter */}
      <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
          Required Skills
        </label>
        <div className="flex flex-wrap gap-1.5 max-h-44 overflow-y-auto pr-1">
          {POPULAR_SKILLS.map(skill => {
            const isSelected = (filters.skills || []).includes(skill);
            return (
              <button
                key={skill}
                onClick={() => toggleSkill(skill)}
                className={`text-[11px] font-medium px-2.5 py-1 rounded-md border transition-all ${
                  isSelected
                    ? 'bg-brand-600 border-brand-600 text-white'
                    : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                {skill}
              </button>
            );
          })}
        </div>
      </div>

      {/* Compensation Type */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
        <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-300">
          <input
            type="checkbox"
            checked={Boolean(filters.paidOnly)}
            onChange={(e) => updateFilter('paidOnly', e.target.checked)}
            className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
          />
          Show Paid Opportunities Only
        </label>
      </div>

    </div>
  );
}
