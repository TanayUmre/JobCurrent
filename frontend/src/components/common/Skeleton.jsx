import React from 'react';
import { cn } from '../../lib/utils';

export function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-slate-200/80 dark:bg-slate-800",
        className
      )}
      {...props}
    />
  );
}

export function JobCardSkeleton() {
  return (
    <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex gap-4">
          <Skeleton className="w-12 h-12 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="w-48 h-5" />
            <Skeleton className="w-32 h-4" />
          </div>
        </div>
        <Skeleton className="w-8 h-8 rounded-lg" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="w-20 h-6 rounded-full" />
        <Skeleton className="w-24 h-6 rounded-full" />
        <Skeleton className="w-28 h-6 rounded-full" />
      </div>
      <Skeleton className="w-full h-12" />
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between">
        <Skeleton className="w-32 h-4" />
        <Skeleton className="w-24 h-8 rounded-lg" />
      </div>
    </div>
  );
}
