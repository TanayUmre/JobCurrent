import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  Sun, 
  Moon, 
  Briefcase, 
  Menu, 
  X, 
  User, 
  Bookmark, 
  CheckSquare, 
  Settings, 
  LogOut, 
  LayoutDashboard,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { Button } from '../common/Button';
import { NotificationBell } from '../notifications/NotificationBell';

export function Navbar() {
  const { user, profile, logout, loginAsDemo } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-600 to-brand-800 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
              JobCurrent
              <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            </span>
            <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 hidden sm:block -mt-1 tracking-wide">
              Stay Current. Stay Career-Ready.
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-7">
          <Link
            to="/jobs"
            className={`text-sm font-medium transition-colors ${
              isActive('/jobs')
                ? 'text-brand-600 dark:text-brand-400'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Browse Jobs
          </Link>
          <a
            href="/#how-it-works"
            className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            How It Works
          </a>
          <a
            href="/#features"
            className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            Features
          </a>
          {user && (
            <Link
              to="/dashboard"
              className={`text-sm font-medium transition-colors flex items-center gap-1.5 ${
                isActive('/dashboard')
                  ? 'text-brand-600 dark:text-brand-400'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>
          )}
        </nav>

        {/* Right Action Icons & Auth Controls */}
        <div className="hidden md:flex items-center gap-3">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* In-App Notifications Bell for Authenticated Users */}
          {user && <NotificationBell />}

          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(prev => !prev)}
                className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <div className="w-7 h-7 rounded-full bg-brand-600 text-white flex items-center justify-center text-xs font-semibold">
                  {(profile?.full_name || user.email || 'U')[0].toUpperCase()}
                </div>
                <span className="text-xs font-medium text-slate-800 dark:text-slate-200 max-w-[120px] truncate">
                  {profile?.full_name || user.email.split('@')[0]}
                </span>
              </button>

              {dropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-56 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-2 z-50 animate-fade-in"
                  onClick={() => setDropdownOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                      {profile?.full_name || 'Member'}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                  </div>
                  
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80"
                  >
                    <LayoutDashboard className="w-4 h-4 text-slate-400" />
                    Overview
                  </Link>
                  <Link
                    to="/dashboard/profile"
                    className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80"
                  >
                    <User className="w-4 h-4 text-slate-400" />
                    Academic Profile
                  </Link>
                  <Link
                    to="/dashboard/preferences"
                    className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80"
                  >
                    <Settings className="w-4 h-4 text-slate-400" />
                    Career & Notification Settings
                  </Link>
                  <Link
                    to="/dashboard/saved"
                    className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80"
                  >
                    <Bookmark className="w-4 h-4 text-slate-400" />
                    Saved Jobs
                  </Link>
                  <Link
                    to="/dashboard/tracker"
                    className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80"
                  >
                    <CheckSquare className="w-4 h-4 text-slate-400" />
                    Application Tracker
                  </Link>
                  <Link
                    to="/admin"
                    className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800"
                  >
                    <ShieldAlert className="w-4 h-4 text-brand-500" />
                    Admin Monitoring
                  </Link>

                  <div className="border-t border-slate-100 dark:border-slate-800 mt-1 pt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  loginAsDemo();
                  navigate('/dashboard');
                }}
                className="text-brand-600 dark:text-brand-400 font-semibold text-xs flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Demo Tour
              </Button>
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu trigger */}
        <div className="flex items-center gap-1.5 md:hidden">
          {user && <NotificationBell />}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(prev => !prev)}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 pt-3 pb-6 space-y-3">
          <Link
            to="/jobs"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-slate-700 dark:text-slate-200"
          >
            Browse Jobs
          </Link>
          <a
            href="/#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-slate-700 dark:text-slate-200"
          >
            How It Works
          </a>
          <a
            href="/#features"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-slate-700 dark:text-slate-200"
          >
            Features
          </a>
          {user ? (
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-1.5 text-sm font-medium text-brand-600 dark:text-brand-400"
              >
                Personalized Dashboard
              </Link>
              <Link
                to="/dashboard/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-1.5 text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                Academic Profile
              </Link>
              <Link
                to="/dashboard/preferences"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-1.5 text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                Preferences
              </Link>
              <Link
                to="/dashboard/tracker"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-1.5 text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                Application Tracker
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left py-2 text-sm font-medium text-red-600"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <Button
                variant="subtle"
                className="w-full"
                onClick={() => {
                  loginAsDemo();
                  setMobileMenuOpen(false);
                  navigate('/dashboard');
                }}
              >
                Explore Demo Dashboard
              </Button>
              <div className="grid grid-cols-2 gap-2">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full">Login</Button>
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" className="w-full">Sign Up</Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
