import React, { useState, useEffect } from 'react';
import { accountApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

const ROLE_COLOR = { ADMIN: '#6366f1', MANAGER: '#14b8a6', EMPLOYEE: '#f59e0b', USER: '#94a3b8' };

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [pwdModal, setPwdModal] = useState(false);
  const [form, setForm] = useState({});
  const [pwdForm, setPwdForm] = useState({ currentPassword: '', newPassword: '' });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      setLoading(true);
      const res = await accountApi.getMe();
      setProfile(res.data.data);
      const p = res.data.data;
      setForm({ firstName: p.firstName, lastName: p.lastName, phoneNumber: p.phoneNumber || '', address: p.address || '', emergencyContactName: p.emergencyContactName || '', emergencyContactPhone: p.emergencyContactPhone || '' });
    } catch (e) { setError('Failed to load profile'); }
    finally { setLoading(false); }
  };

  const handleUpdate = async (e) => {
    e.preventDefault(); setError(''); setSuccess('');
    try {
      await accountApi.updateMe(form);
      setSuccess('Profile updated!'); setEditMode(false); load();
    } catch (e) { setError(e.response?.data?.message || 'Update failed'); }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault(); setError(''); setSuccess('');
    try {
      await accountApi.changePassword(pwdForm);
      setSuccess('Password changed!'); setPwdModal(false); setPwdForm({ currentPassword: '', newPassword: '' });
    } catch (e) { setError(e.response?.data?.message || 'Failed to change password'); }
  };

  if (loading) return <div className="loading"><div className="spinner"></div>Loading...</div>;
  if (!profile) return <div className="alert alert-error">Failed to load profile</div>;

  const color = ROLE_COLOR[profile.role] || '#6366f1';

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      {error && <div className="alert alert-error">⚠️ {error}</div>}
      {success && <div className="alert alert-success">✅ {success}</div>}

      {/* Profile Header */}
      <div className="card" style={{ background: `linear-gradient(135deg, ${color}15, transparent)`, border: `1px solid ${color}30` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ width: 72, height: 72, borderRadius: 16, background: `${color}20`, border: `2px solid ${color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 700, color, flexShrink: 0 }}>
            {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)' }}>{profile.firstName} {profile.lastName}</h2>
            <div style={{ display: 'flex', gap: 8, marginTop: 6, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 12, fontWeight: 600, color, background: `${color}20`, padding: '3px 10px', borderRadius: 999 }}>{profile.role}</span>
              {profile.designation && <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>• {profile.designation}</span>}
              {profile.departmentName && <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>• {profile.departmentName}</span>}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{profile.email}</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-secondary btn-sm" onClick={() => setEditMode(!editMode)}>✏️ Edit</button>
            <button className="btn btn-secondary btn-sm" onClick={() => setPwdModal(true)}>🔑 Password</button>
          </div>
        </div>
      </div>

      {/* Profile Details */}
      {!editMode ? (
        <div className="grid-2" style={{ gap: 16 }}>
          <div className="card" style={{ marginBottom: 0 }}>
            <div className="card-header"><span className="card-title">👤 Personal Info</span></div>
            <InfoRow label="Full Name" value={`${profile.firstName} ${profile.lastName}`} />
            <InfoRow label="Email" value={profile.email} />
            <InfoRow label="Phone" value={profile.phoneNumber} />
            <InfoRow label="Address" value={profile.address} />
            <InfoRow label="Date of Birth" value={profile.dateOfBirth} />
          </div>
          <div className="card" style={{ marginBottom: 0 }}>
            <div className="card-header"><span className="card-title">💼 Work Info</span></div>
            <InfoRow label="Designation" value={profile.designation} />
            <InfoRow label="Department" value={profile.departmentName} />
            <InfoRow label="Reporting Manager" value={profile.reportingManagerName} />
            <InfoRow label="Hire Date" value={profile.hireDate} />
            <InfoRow label="Status" value={profile.isActive ? '🟢 Active' : '🔴 Inactive'} />
          </div>
          <div className="card" style={{ marginBottom: 0, gridColumn: '1/-1' }}>
            <div className="card-header"><span className="card-title">🚨 Emergency Contact</span></div>
            <div className="grid-2">
              <InfoRow label="Contact Name" value={profile.emergencyContactName} />
              <InfoRow label="Contact Phone" value={profile.emergencyContactPhone} />
            </div>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="card-header">
            <span className="card-title">✏️ Edit Profile</span>
            <button className="btn btn-secondary btn-sm" onClick={() => setEditMode(false)}>Cancel</button>
          </div>
          <form onSubmit={handleUpdate}>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">First Name</label>
                <input className="form-control" value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Last Name</label>
                <input className="form-control" value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} />
              </div>
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input className="form-control" value={form.phoneNumber} onChange={e => setForm({ ...form, phoneNumber: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Address</label>
                <input className="form-control" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
              </div>
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Emergency Contact Name</label>
                <input className="form-control" value={form.emergencyContactName} onChange={e => setForm({ ...form, emergencyContactName: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Emergency Contact Phone</label>
                <input className="form-control" value={form.emergencyContactPhone} onChange={e => setForm({ ...form, emergencyContactPhone: e.target.value })} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setEditMode(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary">Save Changes</button>
            </div>
          </form>
        </div>
      )}

      {/* Change Password Modal */}
      {pwdModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setPwdModal(false)}>
          <div className="modal" style={{ maxWidth: 380 }}>
            <div className="modal-header">
              <span className="modal-title">🔑 Change Password</span>
              <button className="modal-close" onClick={() => setPwdModal(false)}>✕</button>
            </div>
            <form onSubmit={handleChangePassword}>
              <div className="form-group">
                <label className="form-label">Current Password *</label>
                <input className="form-control" type="password" required value={pwdForm.currentPassword} onChange={e => setPwdForm({ ...pwdForm, currentPassword: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">New Password *</label>
                <input className="form-control" type="password" required value={pwdForm.newPassword} onChange={e => setPwdForm({ ...pwdForm, newPassword: e.target.value })} placeholder="Min 6 characters" />
              </div>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setPwdModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Change</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)', alignItems: 'center' }}>
      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{label}</span>
      <span style={{ fontSize: 13, color: value ? 'var(--text-primary)' : 'var(--text-muted)' }}>{value || '—'}</span>
    </div>
  );
}
