import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Accounts from './pages/Accounts';
import Employees from './pages/Employees';
import Users from './pages/Users';
import Team from './pages/Team';
import Departments from './pages/Departments';
import Projects from './pages/Projects';
import Tasks from './pages/Tasks';
import Kpis from './pages/Kpis';
import LeaveRequests from './pages/LeaveRequests';
import Performance from './pages/Performance';
import AuditLogs from './pages/AuditLogs';
import Profile from './pages/Profile';

function PrivateRoute({ children, roles }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading"><div className="spinner"></div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return <Layout>{children}</Layout>;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading"><div className="spinner"></div>Loading...</div>;
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />

      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
      <Route path="/departments" element={<PrivateRoute><Departments /></PrivateRoute>} />
      <Route path="/projects" element={<PrivateRoute><Projects /></PrivateRoute>} />
      <Route path="/tasks" element={<PrivateRoute><Tasks /></PrivateRoute>} />
      <Route path="/leave-requests" element={<PrivateRoute><LeaveRequests /></PrivateRoute>} />
      <Route path="/performance" element={<PrivateRoute roles={['ADMIN', 'MANAGER', 'EMPLOYEE']}><Performance /></PrivateRoute>} />
      <Route path="/kpis" element={<PrivateRoute roles={['ADMIN', 'MANAGER', 'EMPLOYEE']}><Kpis /></PrivateRoute>} />

      {/* Manager routes */}
      <Route path="/team" element={<PrivateRoute roles={['ADMIN', 'MANAGER']}><Team /></PrivateRoute>} />

      {/* Admin only routes */}
      <Route path="/accounts" element={<PrivateRoute roles={['ADMIN']}><Accounts /></PrivateRoute>} />
      <Route path="/employees" element={<PrivateRoute roles={['ADMIN']}><Employees /></PrivateRoute>} />
      <Route path="/users" element={<PrivateRoute roles={['ADMIN']}><Users /></PrivateRoute>} />
      <Route path="/audit-logs" element={<PrivateRoute roles={['ADMIN']}><AuditLogs /></PrivateRoute>} />

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
