import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { JobCard } from '../../components/jobs/JobCard';
import { JobFilterBar } from '../../components/jobs/JobFilterBar';
import { JobSearchBar } from '../../components/jobs/JobSearchBar';
import { EmptyState } from '../../components/common/EmptyState';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { MOCK_JOBS } from '../../data/mockJobs';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { 
  Briefcase, 
  RefreshCw, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  SlidersHorizontal,
  X
} from 'lucide-react';

const ITEMS_PER_PAGE = 12;

export function BrowseJobsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const initialType = searchParams.get('type') || 'all';
  const initialMode = searchParams.get('mode') || 'all';
  const initialDomain = searchParams.get('domain') || 'all';

  const [allListings, setAllListings] = useState(MOCK_JOBS);
  const [query, setQuery] = useState(initialSearch);
  const [location, setLocation] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Sync with Supabase PostgreSQL jobs if available
  useEffect(() => {
    async function loadJobsFromDatabase() {
      if (isSupabaseConfigured) {
        try {
          const { data, error } = await supabase
            .from('jobs')
            .select('*')
            .eq('status', 'active')
            .order('posted_at', { ascending: false });

          if (!error && data && data.length > 0) {
            const indianTerms = [
              'india', 'bengaluru', 'bangalore', 'hyderabad', 'pune', 'mumbai',
              'delhi', 'ncr', 'gurgaon', 'gurugram', 'noida', 'chennai', 'kolkata',
              'ahmedabad', 'kochi', 'coimbatore', 'jaipur', 'chandigarh', 'indore'
            ];
            const indiaJobs = data.filter(j => {
              if (j.currency === 'INR') return true;
              const loc = (j.location || '').toLowerCase();
              return indianTerms.some(term => loc.includes(term));
            });
            if (indiaJobs.length > 0) {
              setAllListings(indiaJobs);
            }
          }
        } catch (e) {
          console.warn('[BrowseJobs] Fallback to verified catalog:', e.message);
        }
      }
    }
    loadJobsFromDatabase();
  }, []);

  const [filters, setFilters] = useState({
    jobType: initialType,
    workMode: initialMode,
    domain: initialDomain,
    skills: [],
    graduationYear: '',
    maxCgpa: 9.0,
    paidOnly: false,
  });

  const lastUpdated = useMemo(() => {
    return new Date(Date.now() - 25 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }, []);

  const handleResetFilters = () => {
    setQuery('');
    setLocation('');
    setSortBy('newest');
    setFilters({
      jobType: 'all',
      workMode: 'all',
      domain: 'all',
      skills: [],
      graduationYear: '',
      maxCgpa: 9.0,
      paidOnly: false,
    });
    setCurrentPage(1);
  };

  // Filter and sort listings
  const filteredJobs = useMemo(() => {
    return allListings.filter(job => {
      // 1. Text Query
      if (query) {
        const q = query.toLowerCase();
        const inTitle = job.title.toLowerCase().includes(q);
        const inCompany = job.company_name.toLowerCase().includes(q);
        const inSkills = (job.required_skills || []).some(s => s.toLowerCase().includes(q));
        if (!inTitle && !inCompany && !inSkills) return false;
      }

      // 2. Location
      if (location) {
        const loc = location.toLowerCase();
        const inLoc = (job.location || '').toLowerCase().includes(loc);
        const isRemote = job.work_mode === 'remote';
        if (!inLoc && !(loc === 'remote' && isRemote)) return false;
      }

      // 3. Job Type
      if (filters.jobType !== 'all' && job.job_type !== filters.jobType) {
        return false;
      }

      // 4. Work Mode
      if (filters.workMode !== 'all' && job.work_mode !== filters.workMode) {
        return false;
      }

      // 5. Domain
      if (filters.domain !== 'all' && job.domain !== filters.domain) {
        return false;
      }

      // 6. Paid only
      if (filters.paidOnly && job.paid_status !== 'paid') {
        return false;
      }

      // 7. Skills
      if (filters.skills && filters.skills.length > 0) {
        const hasSkill = filters.skills.every(skill => 
          (job.required_skills || []).some(js => js.toLowerCase() === skill.toLowerCase())
        );
        if (!hasSkill) return false;
      }

      // 8. Graduation Year
      if (filters.graduationYear) {
        const year = parseInt(filters.graduationYear, 10);
        if (job.eligible_graduation_years && job.eligible_graduation_years.length > 0) {
          if (!job.eligible_graduation_years.includes(year)) return false;
        }
      }

      // 9. CGPA
      if (filters.maxCgpa && job.minimum_cgpa) {
        if (Number(job.minimum_cgpa) > Number(filters.maxCgpa)) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.posted_at) - new Date(a.posted_at);
      }
      if (sortBy === 'oldest') {
        return new Date(a.posted_at) - new Date(b.posted_at);
      }
      if (sortBy === 'deadline') {
        return new Date(a.application_deadline) - new Date(b.application_deadline);
      }
      if (sortBy === 'salary') {
        const compA = a.salary_max || a.stipend || 0;
        const compB = b.salary_max || b.stipend || 0;
        return compB - compA;
      }
      return 0;
    });
  }, [query, location, filters, sortBy]);

  // Pagination logic
  const totalPages = Math.ceil(filteredJobs.length / ITEMS_PER_PAGE) || 1;
  const paginatedJobs = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredJobs.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredJobs, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [query, location, filters, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Banner: Title, Description, and Database Health Status */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Explore Opportunities
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Browse verified jobs & internships aggregated from permitted sources.
          </p>
        </div>

        {/* Database sync status pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>DB Synced at {lastUpdated} IST</span>
        </div>
      </div>

      {/* Main Search & Quick Filters Bar */}
      <JobSearchBar
        query={query}
        setQuery={setQuery}
        location={location}
        setLocation={setLocation}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      {/* Active Filter Chips */}
      {(query || location || filters.jobType !== 'all' || filters.workMode !== 'all' || filters.skills.length > 0 || filters.paidOnly) && (
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-slate-500 font-medium">Active filters:</span>
          {query && (
            <Badge variant="blue" size="sm" className="gap-1">
              Search: {query}
              <button onClick={() => setQuery('')}><X className="w-3 h-3 ml-0.5" /></button>
            </Badge>
          )}
          {location && (
            <Badge variant="blue" size="sm" className="gap-1">
              Location: {location}
              <button onClick={() => setLocation('')}><X className="w-3 h-3 ml-0.5" /></button>
            </Badge>
          )}
          {filters.jobType !== 'all' && (
            <Badge variant="purple" size="sm" className="gap-1">
              Type: {filters.jobType}
              <button onClick={() => setFilters(f => ({ ...f, jobType: 'all' }))}><X className="w-3 h-3 ml-0.5" /></button>
            </Badge>
          )}
          {filters.workMode !== 'all' && (
            <Badge variant="gray" size="sm" className="gap-1">
              Mode: {filters.workMode}
              <button onClick={() => setFilters(f => ({ ...f, workMode: 'all' }))}><X className="w-3 h-3 ml-0.5" /></button>
            </Badge>
          )}
          {filters.paidOnly && (
            <Badge variant="green" size="sm" className="gap-1">
              Paid Only
              <button onClick={() => setFilters(f => ({ ...f, paidOnly: false }))}><X className="w-3 h-3 ml-0.5" /></button>
            </Badge>
          )}
          {filters.skills.map(s => (
            <Badge key={s} variant="blue" size="sm" className="gap-1">
              {s}
              <button onClick={() => setFilters(f => ({ ...f, skills: f.skills.filter(x => x !== s) }))}><X className="w-3 h-3 ml-0.5" /></button>
            </Badge>
          ))}
          <button
            onClick={handleResetFilters}
            className="text-xs text-brand-600 dark:text-brand-400 hover:underline font-medium ml-1"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Mobile filter toggle trigger */}
      <div className="lg:hidden flex justify-between items-center">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setMobileFilterOpen(true)}
          icon={SlidersHorizontal}
        >
          Filters ({filteredJobs.length})
        </Button>
      </div>

      {/* Main Grid: Sidebar Filters + Jobs List */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Desktop Filter Sidebar */}
        <div className="hidden lg:block lg:col-span-1 sticky top-20">
          <JobFilterBar
            filters={filters}
            setFilters={setFilters}
            onReset={handleResetFilters}
            totalCount={filteredJobs.length}
          />
        </div>

        {/* Mobile Filter Drawer */}
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setMobileFilterOpen(false)} />
            <div className="relative ml-auto w-full max-w-xs h-full bg-white dark:bg-slate-900 p-6 overflow-y-auto shadow-2xl z-10 space-y-4">
              <div className="flex justify-between items-center pb-2 border-b">
                <h3 className="font-bold text-sm">Filters</h3>
                <button onClick={() => setMobileFilterOpen(false)}><X className="w-5 h-5" /></button>
              </div>
              <JobFilterBar
                filters={filters}
                setFilters={setFilters}
                onReset={handleResetFilters}
                totalCount={filteredJobs.length}
              />
              <Button variant="primary" className="w-full mt-4" onClick={() => setMobileFilterOpen(false)}>
                Apply Filters
              </Button>
            </div>
          </div>
        )}

        {/* Job Listings Column */}
        <div className="lg:col-span-3 space-y-4">
          
          {filteredJobs.length === 0 ? (
            <EmptyState
              title="No opportunities match your current filters"
              description="Try broadening your search keywords, resetting the graduation batch or work mode filters."
              actionLabel="Reset All Filters"
              onAction={handleResetFilters}
            />
          ) : (
            <div className="space-y-4">
              {paginatedJobs.map(job => (
                <JobCard key={job.id} job={job} showEligibility={true} />
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Page {currentPage} of {totalPages} ({filteredJobs.length} total roles)
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  icon={ChevronLeft}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                >
                  Next <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
