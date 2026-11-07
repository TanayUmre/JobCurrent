import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Lock } from 'lucide-react';

export function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 transition">
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>

      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-8 shadow-card space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            JobCurrent Privacy Policy
          </h1>
          <p className="text-xs text-slate-400">Effective Date: November 2026</p>
        </div>

        <div className="prose dark:prose-invert max-w-none text-xs text-slate-600 dark:text-slate-400 leading-relaxed space-y-4">
          <p>
            At JobCurrent, we protect your personal and academic privacy. We do not sell your personal data or application notes to third-party advertisers.
          </p>

          <h3 className="text-sm font-bold text-slate-900 dark:text-white">1. Data Collected</h3>
          <p>
            We collect the information you explicitly provide: email address, full name, academic degree, branch, CGPA, graduation year, skills inventory, and career preferences.
          </p>

          <h3 className="text-sm font-bold text-slate-900 dark:text-white">2. How We Protect Your Data</h3>
          <p>
            All user profiles and preference tables are safeguarded with PostgreSQL Row Level Security (RLS) in Supabase. Only authenticated users can access their own records.
          </p>

          <h3 className="text-sm font-bold text-slate-900 dark:text-white">3. Deletion Rights</h3>
          <p>
            You have the right to modify, export, or delete your account, saved opportunities, and application history at any time.
          </p>
        </div>
      </div>
    </div>
  );
}
