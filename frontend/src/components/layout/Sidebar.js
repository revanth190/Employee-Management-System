import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../services/api';

const NAV_ITEMS = {
  ADMIN: [
    { path: '/dashboard', icon: '🏠', label: 'Dashboard' },
    { path: '/accounts', icon: '👥', label: 'All Accounts' },
    { path: '/employees', icon: '👨‍💼', label: 'Employees' },
    { path: '/users', icon: '🔑', label: 'Users' },
    { path: '/departments', icon: '🏢', label: 'Departments' },
    { path: '/projects', icon: '📁', label: 'Projects' },
    { path: '/tasks', icon: '✅', label: 'Tasks' },
    { path: '/kpis', icon: '📊', label: 'KPIs' },
    { path: '/leave-requests', icon: '📝', label: 'Leave Requests' },
    { path: '/performance', icon: '⭐', label: 'Performance' },
    { path: '/audit-logs', icon: '🔍', label: 'Audit Logs' },
    { path: '/profile', icon: '👤', label: 'My Profile' },
  ],
  MANAGER: [
    { path: '/dashboard', icon: '🏠', label: 'Dashboard' },
    { path: '/team', icon: '👥', label: 'My Team' },
    { path: '/departments', icon: '🏢', label: 'Departments' },
    { path: '/projects', icon: '📁', label: 'Projects' },
    { path: '/tasks', icon: '✅', label: 'Tasks' },
    { path: '/kpis', icon: '📊', label: 'KPIs' },
    { path: '/leave-requests', icon: '📝', label: 'Leave Requests' },
    { path: '/performance', icon: '⭐', label: 'Performance' },
    { path: '/profile', icon: '👤', label: 'My Profile' },
  ],
  EMPLOYEE: [
    { path: '/dashboard', icon: '🏠', label: 'Dashboard' },
    { path: '/departments', icon: '🏢', label: 'Departments' },
    { path: '/projects', icon: '📁', label: 'Projects' },
    { path: '/tasks', icon: '✅', label: 'My Tasks' },
    { path: '/kpis', icon: '📊', label: 'My KPIs' },
    { path: '/leave-requests', icon: '📝', label: 'My Requests' },
    { path: '/performance', icon: '⭐', label: 'My Reviews' },
    { path: '/profile', icon: '👤', label: 'My Profile' },
  ],
  USER: [
    { path: '/dashboard', icon: '🏠', label: 'Dashboard' },
    { path: '/tasks', icon: '✅', label: 'My Tasks' },
    { path: '/leave-requests', icon: '📝', label: 'My Requests' },
    { path: '/profile', icon: '👤', label: 'My Profile' },
  ],
};

const ROLE_COLORS = {
  ADMIN: '#6366f1',
  MANAGER: '#14b8a6',
  EMPLOYEE: '#f59e0b',
  USER: '#94a3b8',
};

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = NAV_ITEMS[user?.role] || NAV_ITEMS.USER;

  const handleLogout = async () => {
    try { await authApi.logout(); } catch (e) {}
    logout();
    navigate('/login');
  };

  return (
    <aside style={styles.sidebar}>
      {/* Logo */}
      <div style={styles.logo}>
        <div style={styles.logoIcon}>⚡</div>
        <div>
          <div style={styles.logoText}>EMSA</div>
          <div style={styles.logoSub}>Employee Management</div>
        </div>
      </div>

      {/* User info */}
      <div style={styles.userInfo}>
        <div style={{ ...styles.avatar, background: `${ROLE_COLORS[user?.role]}20`, border: `1px solid ${ROLE_COLORS[user?.role]}40` }}>
          <span style={{ color: ROLE_COLORS[user?.role] }}>
            {user?.fullName?.charAt(0) || '?'}
          </span>
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={styles.userName}>{user?.fullName}</div>
          <div style={{ ...styles.userRole, color: ROLE_COLORS[user?.role] }}>
            {user?.role}
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={styles.nav}>
        {navItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({
              ...styles.navLink,
              ...(isActive ? styles.navLinkActive : {}),
            })}
          >
            <span style={styles.navIcon}>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div style={styles.bottom}>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          🚪 Sign Out
        </button>
      </div>
    </aside>
  );
}

const styles = {
  sidebar: {
    position: 'fixed',
    left: 0,
    top: 0,
    bottom: 0,
    width: 'var(--sidebar-width)',
    background: 'var(--bg-card)',
    borderRight: '1px solid var(--border)',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 100,
    overflow: 'hidden',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '20px 16px',
    borderBottom: '1px solid var(--border)',
  },
  logoIcon: { fontSize: 24 },
  logoText: {
    fontSize: 18,
    fontWeight: 800,
    background: 'linear-gradient(135deg, #6366f1, #14b8a6)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  logoSub: { fontSize: 10, color: 'var(--text-muted)', marginTop: 1 },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '14px 16px',
    borderBottom: '1px solid var(--border)',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: 16,
    flexShrink: 0,
  },
  userName: {
    fontSize: 13,
    fontWeight: 600,
    color: 'var(--text-primary)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  userRole: { fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' },
  nav: { flex: 1, overflow: 'auto', padding: '8px 10px' },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '9px 10px',
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 500,
    color: 'var(--text-secondary)',
    textDecoration: 'none',
    marginBottom: 2,
    transition: 'all 0.15s',
  },
  navLinkActive: {
    background: 'rgba(99,102,241,0.12)',
    color: 'var(--primary-light)',
    fontWeight: 600,
  },
  navIcon: { fontSize: 15, width: 20, textAlign: 'center' },
  bottom: {
    padding: '12px 10px',
    borderTop: '1px solid var(--border)',
  },
  logoutBtn: {
    width: '100%',
    padding: '9px 12px',
    background: 'transparent',
    border: '1px solid var(--border)',
    borderRadius: 8,
    color: 'var(--text-secondary)',
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.15s',
  },
};
