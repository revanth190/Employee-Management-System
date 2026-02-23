import React, { useState, useEffect } from 'react';
import { auditApi } from '../services/api';

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      setLoading(true);
      const res = await auditApi.getAll();
      setLogs(res.data.data || []);
    } catch (e) { 
      console.error('Load failed:', e.message);
      setError('Failed to load audit logs');
      // Fallback sample data
      setLogs([
        { logId: 1, accountUsername: 'admin', action: 'CREATE', entityName: 'Account', entityId: 10, timestamp: '2024-03-20 10:30:00', details: 'Created new account' },
        { logId: 2, accountUsername: 'manager1', action: 'UPDATE', entityName: 'Project', entityId: 5, timestamp: '2024-03-20 09:15:00', details: 'Updated project status' },
        { logId: 3, accountUsername: 'emp1', action: 'VIEW', entityName: 'LeaveRequest', entityId: 8, timestamp: '2024-03-20 08:00:00', details: 'Viewed leave request' },
      ]);
    }
    finally { setLoading(false); }
  };

  const filtered = logs.filter(l =>
    l.action?.toLowerCase().includes(search.toLowerCase()) ||
    l.accountUsername?.toLowerCase().includes(search.toLowerCase()) ||
    l.entityName?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="loading"><div className="spinner"></div>Loading...</div>;

  return (
    <div>
      {error && <div className="alert alert-error">⚠️ {error}</div>}
      <div className="page-header">
        <div>
          <h1 className="page-title">Audit Logs</h1>
          <p className="page-subtitle">System activity and security monitoring</p>
        </div>
      </div>

      <input className="form-control" style={{ maxWidth: 300, marginBottom: 20 }}
        placeholder="🔍 Search logs..." value={search} onChange={e => setSearch(e.target.value)} />

      <div className="table-container">
        <table>
          <thead>
            <tr><th>Timestamp</th><th>User</th><th>Action</th><th>Entity</th><th>Entity ID</th><th>Details</th></tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>No logs found</td></tr>
            ) : filtered.map(log => (
              <tr key={log.logId}>
                <td style={{ fontSize: 11, color: 'var(--text-muted)' }}>{log.createdAt ? new Date(log.createdAt).toLocaleString() : '—'}</td>
                <td><code style={{ fontSize: 11, color: 'var(--primary-light)' }}>{log.accountUsername}</code></td>
                <td><span style={{ fontSize: 12, fontWeight: 600, color: getActionColor(log.action) }}>{log.action}</span></td>
                <td style={{ fontSize: 12 }}>{log.entityName || '—'}</td>
                <td style={{ fontSize: 12 }}>{log.entityId || '—'}</td>
                <td style={{ fontSize: 12, maxWidth: 200 }}>{log.details?.substring(0, 60) || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function getActionColor(action) {
  if (!action) return 'var(--text-muted)';
  if (action === 'LOGIN') return '#22c55e';
  if (action === 'CREATE') return '#6366f1';
  if (action === 'UPDATE') return '#f59e0b';
  if (action === 'DELETE') return '#ef4444';
  return 'var(--text-secondary)';
}
