import React from 'react';
import { useLocation } from 'react-router-dom';

const PAGE_TITLES = {
  '/dashboard': { title: 'Dashboard', sub: 'Welcome back!' },
  '/accounts': { title: 'All Accounts', sub: 'Manage all system accounts' },
  '/employees': { title: 'Employees', sub: 'Manage employee accounts' },
  '/users': { title: 'Users', sub: 'Manage user accounts' },
  '/team': { title: 'My Team', sub: 'Manage your direct reports' },
  '/departments': { title: 'Departments', sub: 'Department management' },
  '/projects': { title: 'Projects', sub: 'Project & resource management' },
  '/tasks': { title: 'Tasks', sub: 'Task tracking and management' },
  '/kpis': { title: 'KPIs', sub: 'Key Performance Indicators' },
  '/leave-requests': { title: 'Leave & Requests', sub: 'HR requests management' },
  '/performance': { title: 'Performance Reviews', sub: 'Appraisal cycles and ratings' },
  '/audit-logs': { title: 'Audit Logs', sub: 'System activity and security logs' },
  '/profile': { title: 'My Profile', sub: 'View and update your information' },
};

export default function Header() {
  const location = useLocation();
  const page = PAGE_TITLES[location.pathname] || { title: 'EMSA', sub: '' };
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <header style={styles.header}>
      <div>
        <h2 style={styles.title}>{page.title}</h2>
        <p style={styles.sub}>{page.sub}</p>
      </div>
      <div style={styles.right}>
        <span style={styles.date}>{dateStr}</span>
      </div>
    </header>
  );
}

const styles = {
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 24px',
    background: 'var(--bg-card)',
    borderBottom: '1px solid var(--border)',
    position: 'sticky',
    top: 0,
    zIndex: 50,
  },
  title: { fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' },
  sub: { fontSize: 12, color: 'var(--text-muted)', marginTop: 2 },
  right: { display: 'flex', alignItems: 'center', gap: 12 },
  date: { fontSize: 12, color: 'var(--text-muted)' },
};
