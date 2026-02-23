import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../services/api';

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await authApi.login(form);
      console.log('Login API response (raw):', res);
      // Backend returns {success, message, data, timestamp}, so extract the data field
      const authData = res.data.data || res.data;
      console.log('Auth data passed to login():', authData);
      login(authData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.bg}></div>
      <div style={styles.card}>
        <div style={styles.logo}>
          <div style={styles.logoIcon}>⚡</div>
          <h1 style={styles.logoText}>EMSA</h1>
          <p style={styles.logoSub}>Employee Management System</p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="alert alert-error" style={{ marginBottom: 20 }}>
              ⚠️ {error}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              className="form-control"
              type="text"
              placeholder="Enter your username"
              value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-control"
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          <button
            className="btn btn-primary"
            type="submit"
            disabled={loading}
            style={{ width: '100%', padding: '12px', fontSize: '15px', marginTop: 8 }}
          >
            {loading ? <><span className="spinner"></span> Signing in...</> : '🔑 Sign In'}
          </button>
        </form>

        <div style={styles.hints}>
          <div style={styles.hintTitle}>Default Accounts</div>
          <div style={styles.hintRow}>
            <span style={styles.hintRole}>Admin</span>
            <code style={styles.code}>admin / admin123</code>
          </div>
          <div style={styles.hintRow}>
            <span style={styles.hintRole}>Manager</span>
            <code style={styles.code}>manager1 / manager123</code>
          </div>
          <div style={styles.hintRow}>
            <span style={styles.hintRole}>Employee</span>
            <code style={styles.code}>emp1 / emp123</code>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  bg: {
    position: 'fixed',
    inset: 0,
    background: 'radial-gradient(ellipse at 20% 50%, rgba(99,102,241,0.15) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(20,184,166,0.1) 0%, transparent 50%)',
    pointerEvents: 'none',
  },
  card: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 20,
    padding: '40px',
    width: '100%',
    maxWidth: 420,
    position: 'relative',
    zIndex: 1,
  },
  logo: {
    textAlign: 'center',
    marginBottom: 32,
  },
  logoIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 800,
    background: 'linear-gradient(135deg, #6366f1, #14b8a6)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  logoSub: {
    fontSize: 13,
    color: 'var(--text-muted)',
    marginTop: 4,
  },
  hints: {
    marginTop: 24,
    padding: 16,
    background: 'rgba(99,102,241,0.05)',
    border: '1px solid rgba(99,102,241,0.15)',
    borderRadius: 10,
  },
  hintTitle: {
    fontSize: 11,
    fontWeight: 600,
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: 8,
  },
  hintRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '4px 0',
  },
  hintRole: {
    fontSize: 12,
    color: 'var(--text-secondary)',
  },
  code: {
    fontSize: 11,
    color: 'var(--primary-light)',
    background: 'rgba(99,102,241,0.1)',
    padding: '2px 8px',
    borderRadius: 4,
    fontFamily: 'monospace',
  },
};
