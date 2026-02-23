import React, { useState, useEffect } from 'react';
import { accountApi, departmentApi } from '../services/api';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editAcc, setEditAcc] = useState(null);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ username: '', email: '', password: '', role: 'USER', firstName: '', lastName: '', designation: '', departmentId: '', phoneNumber: '' });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      setLoading(true);
      const [userRes, deptRes] = await Promise.all([accountApi.getByRole('USER'), departmentApi.getAll()]);
      setUsers(userRes.data.data || []);
      setDepartments(deptRes.data.data || []);
    } catch (e) { setError('Failed to load'); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setSuccess('');
    try {
      const payload = { ...form, departmentId: form.departmentId || null, role: 'USER' };
      if (editAcc) { await accountApi.update(editAcc.accountId, { ...payload, password: undefined }); setSuccess('Updated!'); }
      else { await accountApi.create(payload); setSuccess('User created!'); }
      setShowModal(false); setEditAcc(null); load();
    } catch (e) { setError(e.response?.data?.message || 'Failed'); }
  };

  const handleToggle = async (acc) => {
    try {
      if (acc.isActive) await accountApi.deactivate(acc.accountId);
      else await accountApi.activate(acc.accountId);
      setSuccess(`Account ${acc.isActive ? 'deactivated' : 'activated'}`); load();
    } catch (e) { setError('Failed'); }
  };

  const openEdit = (acc) => {
    setEditAcc(acc);
    setForm({ username: acc.username, email: acc.email, password: '', role: 'USER', firstName: acc.firstName, lastName: acc.lastName, designation: acc.designation || '', departmentId: acc.departmentId || '', phoneNumber: acc.phoneNumber || '' });
    setShowModal(true);
  };

  const filtered = users.filter(u => `${u.firstName} ${u.lastName} ${u.username} ${u.email}`.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <div className="loading"><div className="spinner"></div>Loading...</div>;

  return (
    <div>
      {error && <div className="alert alert-error">⚠️ {error}</div>}
      {success && <div className="alert alert-success">✅ {success}</div>}

      <div className="page-header">
        <div>
          <h1 className="page-title">Users</h1>
          <p className="page-subtitle">Contractors, temporary staff &amp; consultants ({users.length} total)</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setEditAcc(null); setForm({ username: '', email: '', password: '', role: 'USER', firstName: '', lastName: '', designation: '', departmentId: '', phoneNumber: '' }); setShowModal(true); }}>
          + Add User
        </button>
      </div>

      <input className="form-control" style={{ maxWidth: 280, marginBottom: 20 }} placeholder="🔍 Search users..." value={search} onChange={e => setSearch(e.target.value)} />

      <div className="table-container">
        <table>
          <thead>
            <tr><th>Name</th><th>Username</th><th>Email</th><th>Designation</th><th>Department</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan="7" style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>No users found</td></tr>
            ) : filtered.map(u => (
              <tr key={u.accountId}>
                <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{u.firstName} {u.lastName}</td>
                <td><code style={{ fontSize: 12, color: 'var(--primary-light)' }}>{u.username}</code></td>
                <td style={{ fontSize: 12 }}>{u.email}</td>
                <td style={{ fontSize: 12 }}>{u.designation || '—'}</td>
                <td style={{ fontSize: 12 }}>{u.departmentName || '—'}</td>
                <td><span className={`badge ${u.isActive ? 'badge-active' : 'badge-inactive'}`}>{u.isActive ? 'Active' : 'Inactive'}</span></td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => openEdit(u)}>✏️</button>
                    <button className={`btn btn-sm ${u.isActive ? 'btn-danger' : 'btn-success'}`} onClick={() => handleToggle(u)}>{u.isActive ? '🔒' : '🔓'}</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <span className="modal-title">{editAcc ? 'Edit User' : 'Add User'}</span>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">First Name *</label>
                  <input className="form-control" required value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name *</label>
                  <input className="form-control" required value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Username *</label>
                <input className="form-control" required value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} disabled={!!editAcc} />
              </div>
              <div className="form-group">
                <label className="form-label">Email *</label>
                <input className="form-control" type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              </div>
              {!editAcc && (
                <div className="form-group">
                  <label className="form-label">Password *</label>
                  <input className="form-control" type="password" required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                </div>
              )}
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Designation</label>
                  <input className="form-control" value={form.designation} onChange={e => setForm({ ...form, designation: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Department</label>
                  <select className="form-control" value={form.departmentId} onChange={e => setForm({ ...form, departmentId: e.target.value })}>
                    <option value="">None</option>
                    {departments.map(d => <option key={d.departmentId} value={d.departmentId}>{d.departmentName}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editAcc ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
