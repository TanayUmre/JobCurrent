import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { MOCK_JOBS } from '../../data/mockJobs';
import { 
  CheckSquare, 
  ExternalLink, 
  Edit3, 
  Trash2, 
  Calendar, 
  Building2, 
  Plus,
  Clock
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { EmptyState } from '../../components/common/EmptyState';

const TRACKER_STATUSES = [
  { id: 'interested', label: 'Interested', color: 'gray' },
  { id: 'saved', label: 'Saved', color: 'purple' },
  { id: 'applied', label: 'Applied', color: 'blue' },
  { id: 'interview_scheduled', label: 'Interview Scheduled', color: 'amber' },
  { id: 'selected', label: 'Selected / Offer', color: 'green' },
  { id: 'rejected', label: 'Rejected', color: 'red' },
];

export function TrackerPage() {
  const { applications, updateApplicationStatus } = useAuth();
  const [selectedApp, setSelectedApp] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editStatus, setEditStatus] = useState('applied');
  const [editNotes, setEditNotes] = useState('');

  const openEditModal = (app) => {
    setSelectedApp(app);
    setEditStatus(app.application_status);
    setEditNotes(app.notes || '');
    setModalOpen(true);
  };

  const handleSaveModal = () => {
    if (selectedApp) {
      updateApplicationStatus(selectedApp.job_id, editStatus, editNotes);
    }
    setModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-brand-600" />
            Application Tracker ({applications.length})
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Keep track of every job and internship application lifecycle and interview progress.
          </p>
        </div>

        <Link to="/jobs">
          <Button variant="outline" size="sm">
            Browse Opportunities
          </Button>
        </Link>
      </div>

      {applications.length === 0 ? (
        <EmptyState
          icon={CheckSquare}
          title="No tracked applications yet"
          description="When you apply to any job or want to track an opportunity, click 'Apply' or save it to your pipeline."
          actionLabel="Browse Available Opportunities"
          onAction={() => window.location.href = '/jobs'}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {applications.map(app => {
            const job = MOCK_JOBS.find(j => j.id === app.job_id) || {
              id: app.job_id,
              title: "Software Engineering Opportunity",
              company_name: "Hiring Organization",
              location: "Remote / Onsite",
              source_name: "Career Board"
            };

            const statusObj = TRACKER_STATUSES.find(s => s.id === app.application_status) || {
              label: app.application_status,
              color: 'blue'
            };

            return (
              <div
                key={app.id || app.job_id}
                className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-card space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-xs font-semibold text-slate-500">{job.company_name}</span>
                    <Link to={`/jobs/${job.id}`}>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1 hover:text-brand-600">
                        {job.title}
                      </h3>
                    </Link>
                  </div>
                  <Badge variant={statusObj.color} size="sm" className="shrink-0 font-medium capitalize">
                    {statusObj.label}
                  </Badge>
                </div>

                {app.notes ? (
                  <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800 line-clamp-3">
                    {app.notes}
                  </p>
                ) : (
                  <p className="text-xs italic text-slate-400 bg-slate-50/50 dark:bg-slate-800/30 p-2 rounded-lg">
                    No notes recorded yet.
                  </p>
                )}

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(app.applied_at).toLocaleDateString()}
                  </span>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(app)}
                      className="text-xs font-semibold text-brand-600 hover:underline flex items-center gap-1"
                    >
                      <Edit3 className="w-3 h-3" /> Update
                    </button>
                    {job.application_url && (
                      <a
                        href={job.application_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                        title="Open career portal"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Application Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Update Application Status & Notes"
      >
        <div className="space-y-4">
          <div className="space-y-1.5 text-left">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Current Application Pipeline Stage
            </label>
            <select
              value={editStatus}
              onChange={(e) => setEditStatus(e.target.value)}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-100"
            >
              {TRACKER_STATUSES.map(s => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5 text-left">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Notes / Interview Prep Notes
            </label>
            <textarea
              rows={4}
              value={editNotes}
              onChange={(e) => setEditNotes(e.target.value)}
              placeholder="e.g. Completed OA on HackerRank. Recruiter scheduled round 1 on Tuesday."
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleSaveModal}>
              Save Updates
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
}
