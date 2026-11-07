import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { MOCK_JOBS } from '../../data/mockJobs';
import { JobCard } from '../../components/jobs/JobCard';
import { EmptyState } from '../../components/common/EmptyState';
import { Bookmark, ArrowRight } from 'lucide-react';
import { Button } from '../../components/common/Button';

export function SavedJobsPage() {
  const { savedJobIds } = useAuth();
  const savedJobs = MOCK_JOBS.filter(job => savedJobIds.includes(job.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Bookmark className="w-6 h-6 text-brand-600" />
            Saved Opportunities ({savedJobs.length})
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Jobs and internships you have bookmarked for review and tracking.
          </p>
        </div>

        <Link to="/jobs">
          <Button variant="outline" size="sm">
            Discover More Jobs <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </Link>
      </div>

      {/* List */}
      {savedJobs.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="No saved opportunities yet"
          description="Click the bookmark icon on any job card to save it for quick reference or tracking later."
          actionLabel="Browse Available Jobs"
          onAction={() => window.location.href = '/jobs'}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedJobs.map(job => (
            <JobCard key={job.id} job={job} showEligibility={true} />
          ))}
        </div>
      )}

    </div>
  );
}
