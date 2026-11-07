import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';

export function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 transition">
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>

      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-8 shadow-card space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            JobCurrent Terms of Service
          </h1>
          <p className="text-xs text-slate-400">Effective Date: November 2026</p>
        </div>

        <div className="prose dark:prose-invert max-w-none text-xs text-slate-600 dark:text-slate-400 leading-relaxed space-y-4">
          <p>
            Welcome to JobCurrent ("JobCurrent", "we", "our", or "us"). By accessing or using our platform, website, or services, you agree to be bound by these Terms of Service.
          </p>

          <h3 className="text-sm font-bold text-slate-900 dark:text-white">1. Permitted Aggregation & Application Integrity</h3>
          <p>
            JobCurrent aggregates public job and internship listings from permitted career pages, developer APIs, and open job boards. We preserve authentic application URLs and never alter application links. Users must submit applications directly through the designated third-party employers.
          </p>

          <h3 className="text-sm font-bold text-slate-900 dark:text-white">2. User Accounts & Academic Details</h3>
          <p>
            Users are responsible for providing truthful academic qualifications (CGPA, degree, graduation year). JobCurrent uses this data to compute eligibility and match recommendations.
          </p>

          <h3 className="text-sm font-bold text-slate-900 dark:text-white">3. Notifications & Email Digests</h3>
          <p>
            By opting into daily email notifications, you consent to receive periodic digests of matching opportunities. You may modify notification preferences or unsubscribe at any time.
          </p>
        </div>
      </div>
    </div>
  );
}
