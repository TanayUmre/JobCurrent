import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

// Pages
import { LandingPage } from './pages/public/LandingPage';
import { BrowseJobsPage } from './pages/public/BrowseJobsPage';
import { JobDetailsPage } from './pages/public/JobDetailsPage';
import { TermsPage } from './pages/public/TermsPage';
import { PrivacyPage } from './pages/public/PrivacyPage';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { VerifyEmailPage } from './pages/auth/VerifyEmailPage';

// Dashboard Pages
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { ProfilePage } from './pages/dashboard/ProfilePage';
import { PreferencesPage } from './pages/dashboard/PreferencesPage';
import { SavedJobsPage } from './pages/dashboard/SavedJobsPage';
import { TrackerPage } from './pages/dashboard/TrackerPage';

// Admin Page
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Protected Route Component
function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
            <Navbar />
            <main className="flex-1">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/jobs" element={<BrowseJobsPage />} />
                <Route path="/jobs/:id" element={<JobDetailsPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />

                {/* Authentication Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/verify-email" element={<VerifyEmailPage />} />

                {/* Protected User Dashboard Routes */}
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/dashboard/profile" 
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/dashboard/preferences" 
                  element={
                    <ProtectedRoute>
                      <PreferencesPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/dashboard/saved" 
                  element={
                    <ProtectedRoute>
                      <SavedJobsPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/dashboard/tracker" 
                  element={
                    <ProtectedRoute>
                      <TrackerPage />
                    </ProtectedRoute>
                  } 
                />

                {/* Admin Route */}
                <Route path="/admin" element={<AdminDashboardPage />} />

                {/* 404 Route */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}
