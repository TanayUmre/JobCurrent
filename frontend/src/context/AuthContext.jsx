import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const AuthContext = createContext();

const DEMO_USER = {
  id: 'usr-demo-001',
  email: 'alex.sharma@example.com',
  user_metadata: { full_name: 'Alex Sharma' },
};

const DEFAULT_PROFILE = {
  id: 'usr-demo-001',
  full_name: 'Alex Sharma',
  college: 'National Institute of Technology, Karnataka',
  degree: 'B.Tech',
  branch: 'Computer Science & Engineering',
  current_year: 4,
  cgpa: 8.4,
  graduation_year: 2026,
  skills: ['React', 'JavaScript', 'Node.js', 'SQL', 'Git', 'Python'],
};

const DEFAULT_PREFERENCES = {
  user_id: 'usr-demo-001',
  interested_roles: ['Software Engineer', 'Frontend Developer', 'Full Stack Engineer'],
  preferred_domains: ['Engineering', 'Data & AI'],
  skills: ['React', 'JavaScript', 'Node.js', 'SQL', 'Git', 'Python'],
  preferred_locations: ['Bengaluru', 'Remote', 'Hyderabad'],
  work_modes: ['remote', 'hybrid'],
  job_types: ['internship', 'full-time'],
  minimum_salary: 800000,
  minimum_stipend: 35000,
  paid_only: true,
  include_unknown_eligibility: true,
  in_app_notifications_enabled: true,
  email_enabled: false,
  notification_frequency: 'daily',
  notification_time: '08:00:00',
  timezone: 'Asia/Kolkata',
};

const DEFAULT_NOTIFICATIONS = [
  {
    id: 'notif-001',
    title: '🎯 94% Match: SDE Backend at Swiggy',
    message: 'New role in Bengaluru matching your Python, PostgreSQL, and 2026 Batch preferences.',
    type: 'match',
    job_id: 'job-001',
    is_read: false,
    created_at: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
  },
  {
    id: 'notif-002',
    title: '⚡ High Eligibility: Frontend Intern at Razorpay',
    message: 'Your 8.4 CGPA meets all criteria. ₹45,000/mo stipend in Bengaluru (Hybrid).',
    type: 'match',
    job_id: 'job-002',
    is_read: false,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'notif-003',
    title: '⏰ Application Deadline Reminder',
    message: 'Software Engineer role at GitLab application window closes in 48 hours.',
    type: 'deadline',
    job_id: 'job-003',
    is_read: true,
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'notif-004',
    title: '🔔 In-App Daily Alerts Activated',
    message: 'Zero spam, zero email setup required. All fresh job matches now arrive directly in your in-app notification center.',
    type: 'system',
    job_id: null,
    is_read: true,
    created_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
  }
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('jobcurrent_auth_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('jobcurrent_user_profile');
    return saved ? JSON.parse(saved) : null;
  });

  const [preferences, setPreferences] = useState(() => {
    const saved = localStorage.getItem('jobcurrent_user_preferences');
    return saved ? JSON.parse(saved) : null;
  });

  const [savedJobIds, setSavedJobIds] = useState(() => {
    const saved = localStorage.getItem('jobcurrent_saved_jobs');
    return saved ? JSON.parse(saved) : ['job-001', 'job-003'];
  });

  const [applications, setApplications] = useState(() => {
    const saved = localStorage.getItem('jobcurrent_applications');
    return saved ? JSON.parse(saved) : [
      {
        id: 'app-001',
        job_id: 'job-001',
        application_status: 'interview_scheduled',
        applied_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        notes: 'Passed technical coding round. Round 2 architecture interview on Friday.'
      },
      {
        id: 'app-002',
        job_id: 'job-002',
        application_status: 'applied',
        applied_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        notes: 'Applied through official company career portal.'
      }
    ];
  });

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('jobcurrent_notifications');
    return saved ? JSON.parse(saved) : DEFAULT_NOTIFICATIONS;
  });

  const unreadCount = useMemo(() => {
    return notifications.filter(n => !n.is_read).length;
  }, [notifications]);

  const [loading, setLoading] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('jobcurrent_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    if (user) localStorage.setItem('jobcurrent_auth_user', JSON.stringify(user));
    else localStorage.removeItem('jobcurrent_auth_user');
  }, [user]);

  useEffect(() => {
    if (profile) localStorage.setItem('jobcurrent_user_profile', JSON.stringify(profile));
    else localStorage.removeItem('jobcurrent_user_profile');
  }, [profile]);

  useEffect(() => {
    if (preferences) localStorage.setItem('jobcurrent_user_preferences', JSON.stringify(preferences));
    else localStorage.removeItem('jobcurrent_user_preferences');
  }, [preferences]);

  useEffect(() => {
    localStorage.setItem('jobcurrent_saved_jobs', JSON.stringify(savedJobIds));
  }, [savedJobIds]);

  useEffect(() => {
    localStorage.setItem('jobcurrent_applications', JSON.stringify(applications));
  }, [applications]);

  // Compute profile completion percentage
  const profileCompletion = useMemo(() => {
    if (!profile) return 0;
    const fields = [
      profile.full_name,
      profile.college,
      profile.degree,
      profile.branch,
      profile.current_year,
      profile.cgpa,
      profile.graduation_year,
      profile.skills && profile.skills.length > 0
    ];
    const completed = fields.filter(Boolean).length;
    return Math.round((completed / fields.length) * 100);
  }, [profile]);

  // Authentication methods
  const login = async (email, password) => {
    setLoading(true);
    try {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setUser(data.user);
        return { success: true };
      } else {
        // Fallback demo login
        const loggedUser = { id: 'usr-' + Date.now(), email, user_metadata: { full_name: email.split('@')[0] } };
        setUser(loggedUser);
        if (!profile) setProfile({ ...DEFAULT_PROFILE, id: loggedUser.id, full_name: loggedUser.user_metadata.full_name });
        if (!preferences) setPreferences({ ...DEFAULT_PREFERENCES, user_id: loggedUser.id });
        return { success: true };
      }
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password, fullName) => {
    setLoading(true);
    try {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } },
        });
        if (error) throw error;
        setUser(data.user);
        return { success: true, user: data.user };
      } else {
        const newUser = { id: 'usr-' + Date.now(), email, user_metadata: { full_name: fullName } };
        setUser(newUser);
        setProfile({ ...DEFAULT_PROFILE, id: newUser.id, full_name: fullName });
        setPreferences({ ...DEFAULT_PREFERENCES, user_id: newUser.id });
        return { success: true, user: newUser };
      }
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const loginAsDemo = () => {
    setUser(DEMO_USER);
    setProfile(DEFAULT_PROFILE);
    setPreferences(DEFAULT_PREFERENCES);
    return { success: true };
  };

  const logout = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setProfile(null);
    setPreferences(null);
    localStorage.removeItem('jobcurrent_auth_user');
    localStorage.removeItem('jobcurrent_user_profile');
    localStorage.removeItem('jobcurrent_user_preferences');
  };

  const updateProfile = (updates) => {
    setProfile(prev => ({ ...(prev || {}), ...updates }));
  };

  const updatePreferences = (updates) => {
    setPreferences(prev => ({ ...(prev || {}), ...updates }));
  };

  const toggleSaveJob = (jobId) => {
    setSavedJobIds(prev => 
      prev.includes(jobId) ? prev.filter(id => id !== jobId) : [...prev, jobId]
    );
  };

  const isJobSaved = (jobId) => savedJobIds.includes(jobId);

  const markNotificationAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const addNotification = (notif) => {
    setNotifications(prev => [
      {
        id: 'notif-' + Date.now(),
        created_at: new Date().toISOString(),
        is_read: false,
        ...notif
      },
      ...prev
    ]);
  };

  const updateApplicationStatus = (jobId, newStatus, notes = '') => {
    setApplications(prev => {
      const existingIndex = prev.findIndex(a => a.job_id === jobId);
      if (existingIndex >= 0) {
        const copy = [...prev];
        copy[existingIndex] = {
          ...copy[existingIndex],
          application_status: newStatus,
          notes: notes || copy[existingIndex].notes,
          updated_at: new Date().toISOString()
        };
        return copy;
      } else {
        return [
          ...prev,
          {
            id: 'app-' + Date.now(),
            job_id: jobId,
            application_status: newStatus,
            applied_at: new Date().toISOString(),
            notes: notes
          }
        ];
      }
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        preferences,
        savedJobIds,
        applications,
        notifications,
        unreadCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        deleteNotification,
        addNotification,
        profileCompletion,
        loading,
        isSupabaseConfigured,
        login,
        register,
        loginAsDemo,
        logout,
        updateProfile,
        updatePreferences,
        toggleSaveJob,
        isJobSaved,
        updateApplicationStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
