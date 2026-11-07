import React from 'react';
import { Link } from 'react-router-dom';
import { MailCheck, ArrowRight, Briefcase } from 'lucide-react';
import { Button } from '../../components/common/Button';

export function VerifyEmailPage() {
  return (
    <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-8 shadow-card text-center space-y-6">
        <div className="w-14 h-14 rounded-2xl bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 text-brand-600 dark:text-brand-400 flex items-center justify-center mx-auto">
          <MailCheck className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            Verify Your Email Address
          </h1>
          <p className="text-xs text-slate-500 leading-relaxed">
            We have dispatched a verification link to your inbox. Please click the link to confirm your account and enable daily digest notifications.
          </p>
        </div>

        <div className="pt-2">
          <Link to="/dashboard">
            <Button variant="primary" className="w-full">
              Proceed to Dashboard <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
