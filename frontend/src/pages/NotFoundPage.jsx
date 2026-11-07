import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, ArrowLeft } from 'lucide-react';
import { Button } from '../components/common/Button';

export function NotFoundPage() {
  return (
    <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center px-4 py-16 text-center">
      <div className="space-y-4 max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 text-brand-600 dark:text-brand-400 flex items-center justify-center mx-auto text-2xl font-bold">
          404
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Page Not Found</h1>
        <p className="text-xs text-slate-500">
          The page or opportunity you are looking for has been moved, closed, or does not exist.
        </p>
        <div className="pt-2">
          <Link to="/">
            <Button variant="primary">
              <ArrowLeft className="w-4 h-4 mr-1.5" /> Return to JobCurrent Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
