import React from 'react';
import { Briefcase } from 'lucide-react';
import { Button } from './Button';

export function EmptyState({
  title = "No opportunities found",
  description = "Try adjusting your search criteria or filters to explore more opportunities.",
  actionLabel,
  onAction,
  icon: Icon = Briefcase,
}) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-white/50 dark:bg-slate-900/40">
      <div className="p-4 rounded-full bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 mb-4">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6">{description}</p>
      {actionLabel && onAction && (
        <Button variant="outline" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
