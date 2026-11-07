import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Briefcase, Sparkles, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loginAsDemo, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await login(email, password);
    if (res.success) {
      navigate('/dashboard');
    } else {
      setError(res.error || 'Failed to authenticate. Please check your credentials.');
    }
  };

  const handleDemoLogin = () => {
    loginAsDemo();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-8 shadow-card space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 flex items-center justify-center mx-auto text-white shadow-sm">
            <Briefcase className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Welcome back to JobCurrent
          </h1>
          <p className="text-xs text-slate-500">
            Sign in to access your personalized recommendations and application tracker.
          </p>
        </div>

        {/* Demo Fast Login Banner */}
        <div className="p-3.5 rounded-2xl bg-brand-50/80 dark:bg-brand-950/40 border border-brand-200/70 dark:border-brand-900/60 flex items-center justify-between gap-3">
          <div className="text-xs">
            <p className="font-semibold text-brand-900 dark:text-brand-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-brand-600" /> Instant Demo Mode
            </p>
            <p className="text-[11px] text-brand-700/80 dark:text-brand-300">Explore authenticated dashboard in 1-click</p>
          </div>
          <Button
            size="sm"
            variant="primary"
            onClick={handleDemoLogin}
            className="text-xs shrink-0"
          >
            Try Demo
          </Button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-xs text-red-600 dark:text-red-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@university.edu"
            icon={Mail}
          />
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Password
              </label>
              <Link to="/forgot-password" className="text-xs text-brand-600 dark:text-brand-400 hover:underline">
                Forgot password?
              </Link>
            </div>
            <Input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              icon={Lock}
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full py-2.5 font-semibold"
            isLoading={loading}
          >
            Sign In <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </form>

        <p className="text-center text-xs text-slate-500">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-brand-600 dark:text-brand-400 hover:underline">
            Create an account
          </Link>
        </p>

      </div>
    </div>
  );
}
