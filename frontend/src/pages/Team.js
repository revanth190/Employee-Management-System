import React, { useState, useEffect } from 'react';
import { accountApi } from '../services/api';

const ROLE_BADGE = { ADMIN: 'badge-admin', MANAGER: 'badge-manager', EMPLOYEE: 'badge-employee', USER: 'badge-user' };

export default function Team() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      setLoading(true);
      const res = await accountApi.getTeam();
      setTeam(res.data.data || []);
    } catch (e) { setError('Failed to load team'); }
    finally { setLoading(false); }
  };

  if (loading) return <div className="loading"><div className="spinner"></div>Loading...</div>;

  return (
    <div>
      {error && <div className="alert alert-error">⚠️ {error}</div>}
      <div className="page-header">
        <div>
          <h1 className="page-title">My Team</h1>
          <p className="page-subtitle">{team.length} direct reports</p>
        </div>
      </div>

      {team.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">👥</div>
          <div className="empty-state-title">No team members assigned to you</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {team.map(member => (
            <div key={member.accountId} className="card" style={{ marginBottom: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#818cf8', fontSize: 16 }}>
                  {member.firstName.charAt(0)}{member.lastName.charAt(0)}
                </div>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{member.firstName} {member.lastName}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{member.designation || 'No designation'}</div>
                </div>
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>📧 {member.email}</div>
              {member.phoneNumber && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>📞 {member.phoneNumber}</div>}
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>🏢 {member.departmentName || '—'}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className={`badge ${ROLE_BADGE[member.role]}`}>{member.role}</span>
                <span className={`badge ${member.isActive ? 'badge-active' : 'badge-inactive'}`}>{member.isActive ? 'Active' : 'Inactive'}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
