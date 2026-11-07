import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Heart, Shield, CheckCircle2, ArrowUpRight } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Col 1: Brand & Tagline */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-600 to-brand-800 flex items-center justify-center text-white">
                <Briefcase className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                JobCurrent
              </span>
            </Link>
            <p className="text-xs font-semibold text-brand-600 dark:text-brand-400">
              Stay Current. Stay Career-Ready.
            </p>
            <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              Discover the latest jobs and internships from multiple sources, matched to your skills, academic qualifications and career preferences.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-600 dark:text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              All aggregation sources operational
            </div>
          </div>

          {/* Col 2: Platform Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              Discovery
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/jobs" className="hover:text-brand-600 dark:hover:text-brand-400 transition">
                  Browse All Jobs & Internships
                </Link>
              </li>
              <li>
                <Link to="/jobs?type=internship" className="hover:text-brand-600 dark:hover:text-brand-400 transition">
                  Summer & College Internships
                </Link>
              </li>
              <li>
                <Link to="/jobs?mode=remote" className="hover:text-brand-600 dark:hover:text-brand-400 transition">
                  Remote Opportunities
                </Link>
              </li>
              <li>
                <Link to="/jobs?domain=Data%20%26%20AI" className="hover:text-brand-600 dark:hover:text-brand-400 transition">
                  AI & Machine Learning Roles
                </Link>
              </li>
              <li>
                <a href="/#how-it-works" className="hover:text-brand-600 dark:hover:text-brand-400 transition">
                  Eligibility Matching Algorithm
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Permitted Sources */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              Integrated Sources
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center justify-between text-slate-500">
                <span>Jobvetta (India)</span>
                <span className="text-[10px] text-emerald-600 font-medium">Verified Active</span>
              </li>
              <li className="flex items-center justify-between text-slate-500">
                <span>Himalayas (Remote)</span>
                <span className="text-[10px] text-emerald-600 font-medium">Verified Active</span>
              </li>
              <li className="flex items-center justify-between text-slate-500">
                <span>Arbeitnow (Global)</span>
                <span className="text-[10px] text-emerald-600 font-medium">Verified Active</span>
              </li>
              <li className="flex items-center justify-between text-slate-500">
                <span>RemoteOK (Remote)</span>
                <span className="text-[10px] text-emerald-600 font-medium">Verified Active</span>
              </li>
              <li className="flex items-center justify-between text-slate-500">
                <span>Greenhouse & Lever</span>
                <span className="text-[10px] text-emerald-600 font-medium">Direct Company</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Trust & Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              Platform & Legal
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/terms" className="hover:text-brand-600 dark:hover:text-brand-400 transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-brand-600 dark:hover:text-brand-400 transition">
                  Privacy Policy & Data Rights
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-brand-600 dark:hover:text-brand-400 transition">
                  Admin System Health
                </Link>
              </li>
              <li className="text-[11px] text-slate-400 pt-1">
                Zero spam policy. Unsubscribe anytime from daily digests.
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p>© {new Date().getFullYear()} JobCurrent Technologies Inc. All rights reserved.</p>
          <p className="flex items-center gap-1.5 text-slate-400">
            Built with modern precision for career discoverability.
          </p>
        </div>
      </div>
    </footer>
  );
}
