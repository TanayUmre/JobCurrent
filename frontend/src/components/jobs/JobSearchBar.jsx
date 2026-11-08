import React from 'react';
import { Search, MapPin, ArrowUpDown } from 'lucide-react';

export function JobSearchBar({ 
  query, 
  setQuery, 
  location, 
  setLocation, 
  sortBy, 
  setSortBy 
}) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-2.5 sm:p-3 shadow-card flex flex-col md:flex-row items-center gap-2.5">
      
      {/* Title / Role / Skills Search */}
      <div className="relative flex-1 w-full">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search job title, company name, or technology skills..."
          className="w-full pl-10 pr-4 py-2 text-sm bg-transparent border-0 focus:ring-0 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
        />
      </div>

      <div className="hidden md:block w-px h-6 bg-slate-200 dark:bg-slate-800" />

      {/* Location Filter */}
      <div className="relative w-full md:w-56">
        <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        <input
          type="text"
          list="indian-cities-list"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Bengaluru, Pune, Remote..."
          className="w-full pl-10 pr-4 py-2 text-sm bg-transparent border-0 focus:ring-0 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
        />
        <datalist id="indian-cities-list">
          <option value="Bengaluru, Karnataka" />
          <option value="Hyderabad, Telangana" />
          <option value="Pune, Maharashtra" />
          <option value="Mumbai, Maharashtra" />
          <option value="Delhi / NCR" />
          <option value="Gurgaon, Haryana" />
          <option value="Noida, Uttar Pradesh" />
          <option value="Chennai, Tamil Nadu" />
          <option value="Kolkata, West Bengal" />
          <option value="Ahmedabad, Gujarat" />
          <option value="Kochi, Kerala" />
          <option value="Remote (India)" />
        </datalist>
      </div>

      <div className="hidden md:block w-px h-6 bg-slate-200 dark:bg-slate-800" />

      {/* Sort Options */}
      <div className="relative w-full md:w-52">
        <div className="flex items-center gap-1.5 px-3 py-2 border rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full text-xs font-medium bg-transparent border-0 focus:outline-none text-slate-700 dark:text-slate-200 cursor-pointer"
          >
            <option value="newest">Newest Posted</option>
            <option value="deadline">Closest Deadline</option>
            <option value="salary">Highest Compensation</option>
            <option value="relevance">Relevance</option>
          </select>
        </div>
      </div>

    </div>
  );
}
