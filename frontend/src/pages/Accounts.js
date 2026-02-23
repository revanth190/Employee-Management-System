import React, { useState, useEffect } from 'react';
import { accountApi, departmentApi } from '../services/api';

const ROLES = ['ADMIN', 'MANAGER', 'EMPLOYEE', 'USER'];
const ROLE_COLORS = { ADMIN: 'badge-admin', MANAGER: 'badge-manager', EMPLOYEE: 'badge-employee', USER: 'badge-user' };

export default function Accounts() {
  const [accounts, setAccounts] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editAccount, setEditAccount] = useState(null);
  const [filterRole, setFilterRole] = useState('ALL');
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ username: '', email: '', password: '', role: 'EMPLOYEE', firstName: '', lastName: '', designation: '', departmentId: '', phoneNumber: '', hireDate: '' });
  const [showResetModal, setShowResetModal] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState('');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      setLoading(true);
      const [accsRes, deptsRes] = await Promise.all([accountApi.getAll(), departmentApi.getAll()]);
      setAccounts(accsRes.data.data || []);
      setDepartments(deptsRes.data.data || []);
    } catch (e) { 
      console.error('Load failed:', e.message);
      setError('Failed to load accounts');
      // Fallback sample data
      setAccounts([
        { accountId: 1, username: 'admin', email: 'admin@emsa.com', firstName: 'System', lastName: 'Administrator', role: 'ADMIN', departmentName: 'Engineering', designation: 'System Admin', isActive: true },
        { accountId: 2, username: 'emp1', email: 'emp1@emsa.com', firstName: 'Charlie', lastName: 'Brown', role: 'EMPLOYEE', departmentName: 'Engineering', designation: 'Senior Developer', isActive: true },
        { accountId: 3, username: 'emp2', email: 'emp2@emsa.com', firstName: 'Diana', lastName: 'Davis', role: 'EMPLOYEE', departmentName: 'Engineering', designation: 'Junior Developer', isActive: true },
        { accountId: 4, username: 'manager1', email: 'manager1@emsa.com', firstName: 'Alice', lastName: 'Johnson', role: 'MANAGER', departmentName: 'Engineering', designation: 'Engineering Manager', isActive: true },
      ]);
      setDepartments([
        { departmentId: 1, departmentName: 'Engineering', description: 'Software development' },
        { departmentId: 2, departmentName: 'Human Resources', description: 'HR operations' },
      ]);
    }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      const payload = { ...form, departmentId: form.departmentId || null };
      if (editAccount) {
        await accountApi.update(editAccount.accountId, { ...payload, password: undefined });
      } else {
        await accountApi.create(payload);
      }
      setSuccess(editAccount ? 'Account updated!' : 'Account created!');
      setShowModal(false); setEditAccount(null);
      resetForm(); load();
    } catch (e) { setError(e.response?.data?.message || 'Operation failed'); }
  };

  const resetForm = () => setForm({ username: '', email: '', password: '', role: 'EMPLOYEE', firstName: '', lastName: '', designation: '', departmentId: '', phoneNumber: '', hireDate: '' });

  const openEdit = (acc) => {
    setEditAccount(acc);
    setForm({ username: acc.username, email: acc.email, password: '', role: acc.role, firstName: acc.firstName, lastName: acc.lastName, designation: acc.designation || '', departmentId: acc.departmentId || '', phoneNumber: acc.phoneNumber || '', hireDate: acc.hireDate || '' });
    setShowModal(true);
  };

  const handleToggleActive = async (acc) => {
    try {
      if (acc.isActive) await accountApi.deactivate(acc.accountId);
      else await accountApi.activate(acc.accountId);
      setSuccess(`Account ${acc.isActive ? 'deactivated' : 'activated'}`);
      load();
    } catch (e) { setError('Failed to update status'); }
  };

  const handleResetPassword = async () => {
    try {
      await accountApi.resetPassword(showResetModal, { newPassword });
      setSuccess('Password reset!'); setShowResetModal(null); setNewPassword('');
    } catch (e) { setError('Failed to reset password'); }
  };

  const handleDelete = async () => {
    if (deleteConfirm !== 'DELETE') return;
    try {
      await accountApi.delete(showDeleteModal.accountId);
      setSuccess('Account deleted successfully!'); setShowDeleteModal(null); setDeleteConfirm('');
      load();
    } catch (e) { setError('Failed to delete account'); }
  };

  const filtered = accounts.filter(a =>
    (filterRole === 'ALL' || a.role === filterRole) &&
    (a.username.toLowerCase().includes(search.toLowerCase()) ||
     a.firstName.toLowerCase().includes(search.toLowerCase()) ||
     a.lastName.toLowerCase().includes(search.toLowerCase()) ||
     a.email.toLowerCase().includes(search.toLowerCase()))
  );

  if (loading) return <div className="loading"><div className="spinner"></div>Loading...</div>;

  return (
    <div>
      {error && <div className="alert alert-error">⚠️ {error}</div>}
      {success && <div className="alert alert-success">✅ {success}</div>}

      <div className="page-header">
        <div>
          <h1 className="page-title">All Accounts</h1>
          <p className="page-subtitle">Manage all system accounts ({accounts.length} total)</p>
        </div>
        <button className="btn btn-primary" onClick={() => { resetForm(); setEditAccount(null); setShowModal(true); }}>
          + Create Account
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <input className="form-control" style={{ maxWidth: 260 }} placeholder="🔍 Search accounts..."
          value={search} onChange={e => setSearch(e.target.value)} />
        <select className="form-control" style={{ maxWidth: 160 }} value={filterRole} onChange={e => setFilterRole(e.target.value)}>
          <option value="ALL">All Roles</option>
          {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      <div className="table-container">
        <table>
          <thead><tr>
            <th>Name</th><th>Username</th><th>Email</th><th>Role</th>
            <th>Department</th><th>Designation</th><th>Status</th><th>Actions</th>
          </tr></thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan="8" style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>No accounts found</td></tr>
            ) : filtered.map(acc => (
              <tr key={acc.accountId}>
                <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{acc.firstName} {acc.lastName}</td>
                <td><code style={{ fontSize: 12, color: 'var(--primary-light)' }}>{acc.username}</code></td>
                <td style={{ fontSize: 12 }}>{acc.email}</td>
                <td><span className={`badge ${ROLE_COLORS[acc.role]}`}>{acc.role}</span></td>
                <td>{acc.departmentName || '—'}</td>
                <td style={{ fontSize: 12 }}>{acc.designation || '—'}</td>
                <td><span className={`badge ${acc.isActive ? 'badge-active' : 'badge-inactive'}`}>{acc.isActive ? 'Active' : 'Inactive'}</span></td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => openEdit(acc)}>✏️</button>
                    <button className={`btn btn-sm ${acc.isActive ? 'btn-danger' : 'btn-success'}`} onClick={() => handleToggleActive(acc)}>
                      {acc.isActive ? '🔒' : '🔓'}
                    </button>
                    <button className="btn btn-secondary btn-sm" onClick={() => setShowResetModal(acc.accountId)}>🔑</button>
                    <button className="btn btn-danger btn-sm" onClick={() => setShowDeleteModal(acc)}>🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <span className="modal-title">{editAccount ? 'Edit Account' : 'Create Account'}</span>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">First Name *</label>
                  <input className="form-control" required value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name *</label>
                  <input className="form-control" required value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Username *</label>
                <input className="form-control" required value={form.username} onChange={e => setForm({...form, username: e.target.value})} disabled={!!editAccount} />
              </div>
              <div className="form-group">
                <label className="form-label">Email *</label>
                <input className="form-control" type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
              </div>
              {!editAccount && (
                <div className="form-group">
                  <label className="form-label">Password *</label>
                  <input className="form-control" type="password" required value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
                </div>
              )}
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Role *</label>
                  <select className="form-control" value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
                    {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Department</label>
                  <select className="form-control" value={form.departmentId} onChange={e => setForm({...form, departmentId: e.target.value})}>
                    <option value="">None</option>
                    {departments.map(d => <option key={d.departmentId} value={d.departmentId}>{d.departmentName}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Designation</label>
                  <input className="form-control" value={form.designation} onChange={e => setForm({...form, designation: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input className="form-control" value={form.phoneNumber} onChange={e => setForm({...form, phoneNumber: e.target.value})} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Hire Date</label>
                <input className="form-control" type="date" value={form.hireDate} onChange={e => setForm({...form, hireDate: e.target.value})} />
              </div>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editAccount ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {showResetModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowResetModal(null)}>
          <div className="modal" style={{ maxWidth: 360 }}>
            <div className="modal-header">
              <span className="modal-title">🔑 Reset Password</span>
              <button className="modal-close" onClick={() => setShowResetModal(null)}>✕</button>
            </div>
            <div className="form-group">
              <label className="form-label">New Password</label>
              <input className="form-control" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Min 6 characters" />
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={() => setShowResetModal(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleResetPassword}>Reset</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowDeleteModal(null)}>
          <div className="modal" style={{ maxWidth: 420 }}>
            <div className="modal-header">
              <span className="modal-title">⚠️ Delete Account</span>
              <button className="modal-close" onClick={() => setShowDeleteModal(null)}>✕</button>
            </div>
            <div style={{ marginBottom: 20 }}>
              <p style={{ color: 'var(--text-muted)', marginBottom: 12 }}>
                Are you sure you want to permanently delete <strong>{showDeleteModal.firstName} {showDeleteModal.lastName}</strong>?<br/>
                This action cannot be undone.
              </p>
              <p style={{ fontSize: 12, color: 'var(--danger-light)', marginBottom: 16 }}>
                Type <strong>DELETE</strong> to confirm:
              </p>
              <input 
                className="form-control" 
                value={deleteConfirm} 
                onChange={e => setDeleteConfirm(e.target.value)} 
                placeholder="Type DELETE to confirm"
              />
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={() => { setShowDeleteModal(null); setDeleteConfirm(''); }}>Cancel</button>
              <button 
                className="btn btn-danger" 
                onClick={handleDelete}
                disabled={deleteConfirm !== 'DELETE'}
                style={{ opacity: deleteConfirm !== 'DELETE' ? 0.5 : 1, cursor: deleteConfirm !== 'DELETE' ? 'not-allowed' : 'pointer' }}
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
