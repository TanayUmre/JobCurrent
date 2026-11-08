import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Activity, 
  Database, 
  Server, 
  Mail, 
  Cpu, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Play, 
  ToggleLeft, 
  ToggleRight,
  TrendingUp,
  Layers,
  Clock
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';

export function AdminDashboardPage() {
  const [sources, setSources] = useState([
    { id: 'src-01', name: 'Jobvetta API', market: 'India', type: 'REST API', enabled: true, jobsFound: 1850, lastRun: '10m ago', status: 'healthy' },
    { id: 'src-02', name: 'Himalayas API', market: 'International Remote', type: 'REST API', enabled: true, jobsFound: 920, lastRun: '20m ago', status: 'healthy' },
    { id: 'src-03', name: 'Arbeitnow API', market: 'International', type: 'REST API', enabled: true, jobsFound: 1420, lastRun: '15m ago', status: 'healthy' },
    { id: 'src-04', name: 'RemoteOK API', market: 'Global Remote', type: 'REST API', enabled: true, jobsFound: 890, lastRun: '30m ago', status: 'healthy' },
    { id: 'src-05', name: 'Greenhouse Direct API', market: 'Direct Company', type: 'Job Board API', enabled: true, jobsFound: 2450, lastRun: '45m ago', status: 'healthy' },
    { id: 'src-06', name: 'Lever Direct API', market: 'Direct Company', type: 'Postings API', enabled: true, jobsFound: 1680, lastRun: '50m ago', status: 'healthy' },
  ]);

  const [collecting, setCollecting] = useState(false);
  const [lastManualTrigger, setLastManualTrigger] = useState(null);

  const toggleSource = (id) => {
    setSources(prev => prev.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s));
  };

  const handleManualRun = () => {
    setCollecting(true);
    setTimeout(() => {
      setCollecting(false);
      setLastManualTrigger(new Date().toLocaleTimeString());
    }, 1500);
  };

  const stats = [
    { label: 'Total Registered Users', value: '1,280', delta: '+14% this week', icon: Database },
    { label: 'Active Jobs in PostgreSQL', value: '4,460', delta: 'Deduplicated', icon: Layers },
    { label: 'Jobs Ingested Today', value: '184', delta: 'Verified sources', icon: Activity },
    { label: 'Digest Emails Sent', value: '3,840', delta: '99.4% delivery', icon: Mail },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-brand-600" />
            JobCurrent Administrator Monitoring
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            System health, connector telemetry, AI extraction pipeline, and cron logs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {lastManualTrigger && (
            <span className="text-[11px] text-emerald-600 font-medium">
              Ran at {lastManualTrigger}
            </span>
          )}
          <Button
            variant="primary"
            size="sm"
            onClick={handleManualRun}
            isLoading={collecting}
            icon={Play}
          >
            Trigger Ingestion Run
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((st, i) => {
          const Icon = st.icon;
          return (
            <div key={i} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-card">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">{st.label}</span>
                <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">
                {st.value}
              </p>
              <span className="text-[11px] text-emerald-600 font-medium">{st.delta}</span>
            </div>
          );
        })}
      </div>

      {/* Connector Health & Controls */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 shadow-card space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <Server className="w-4 h-4 text-brand-600" />
              Source Connector Architecture
            </h2>
            <p className="text-xs text-slate-500">
              Manage permitted collection feeds and inspect automated sync schedules.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="pb-3">Source Name</th>
                <th className="pb-3">Integration Type</th>
                <th className="pb-3">Jobs Ingested</th>
                <th className="pb-3">Last Sync</th>
                <th className="pb-3">Health Status</th>
                <th className="pb-3 text-right">Enabled</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {sources.map(src => (
                <tr key={src.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="py-3.5 font-bold text-slate-900 dark:text-slate-100">
                    {src.name}
                  </td>
                  <td className="py-3.5 text-slate-500">
                    {src.type}
                  </td>
                  <td className="py-3.5 font-mono text-slate-700 dark:text-slate-300">
                    {src.jobsFound.toLocaleString()}
                  </td>
                  <td className="py-3.5 text-slate-500">
                    {src.lastRun}
                  </td>
                  <td className="py-3.5">
                    {src.status === 'healthy' ? (
                      <span className="inline-flex items-center gap-1 font-semibold text-emerald-600">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 font-semibold text-amber-600">
                        <AlertCircle className="w-3.5 h-3.5" /> {src.status.replace('_', ' ')}
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 text-right">
                    <button
                      onClick={() => toggleSource(src.id)}
                      className={`text-xs font-semibold px-2.5 py-1 rounded-lg border transition ${
                        src.enabled
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/60'
                          : 'bg-slate-100 border-slate-200 text-slate-500 dark:bg-slate-800'
                      }`}
                    >
                      {src.enabled ? 'Enabled' : 'Disabled'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Infrastructure & AI Usage */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Groq AI Pipeline */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-card space-y-3 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-brand-600" />
              Groq AI Structured Extraction
            </h3>
            <span className="font-mono text-emerald-600 font-semibold">Online</span>
          </div>
          <p className="text-slate-500">
            Model: <span className="font-mono text-slate-800 dark:text-slate-200 font-medium">llama-3.3-70b-versatile</span>
          </p>
          <p className="text-slate-500">
            Cache hit rate: <span className="font-semibold text-slate-800 dark:text-slate-200">88.4%</span> (Deduplicated via MD5 description hashes to prevent unnecessary AI token expenditure).
          </p>
          <p className="text-slate-500">
            Deterministic fallback: <span className="font-semibold text-emerald-600">Operational</span>
          </p>
        </div>

        {/* Supabase Cron Schedule */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-card space-y-3 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-purple-600" />
              Supabase pg_cron Schedule (IST)
            </h3>
            <span className="font-mono text-emerald-600 font-semibold">Enabled</span>
          </div>
          <ul className="space-y-1.5 text-slate-500">
            <li>• <span className="font-mono font-medium text-slate-700 dark:text-slate-300">06:00 AM</span> – Ingest new job feeds</li>
            <li>• <span className="font-mono font-medium text-slate-700 dark:text-slate-300">06:30 AM</span> – Normalization & URL deduplication</li>
            <li>• <span className="font-mono font-medium text-slate-700 dark:text-slate-300">07:00 AM</span> – Groq batch requirement extraction</li>
            <li>• <span className="font-mono font-medium text-slate-700 dark:text-slate-300">07:30 AM</span> – Personalized user match calculation</li>
            <li>• <span className="font-mono font-medium text-slate-700 dark:text-slate-300">08:00 AM</span> – Resend personalized email dispatch</li>
          </ul>
        </div>

      </div>

    </div>
  );
}
