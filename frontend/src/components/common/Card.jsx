import React from 'react';
import { cn } from '../../lib/utils';

export function Card({ children, className, hoverEffect = false, ...props }) {
  return (
    <div
      className={cn(
        "bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl shadow-card transition-all duration-200",
        hoverEffect && "hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-card-hover",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className, ...props }) {
  return <div className={cn("p-5 border-b border-slate-100 dark:border-slate-800", className)} {...props}>{children}</div>;
}

export function CardContent({ children, className, ...props }) {
  return <div className={cn("p-5", className)} {...props}>{children}</div>;
}

export function CardFooter({ children, className, ...props }) {
  return <div className={cn("p-5 pt-0 border-t border-slate-100 dark:border-slate-800", className)} {...props}>{children}</div>;
}
