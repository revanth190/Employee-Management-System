import React, { useState, useEffect } from 'react';
import { accountApi, departmentApi } from '../services/api';

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editAcc, setEditAcc] = useState(null);
  const [search, setSearch] = useState('');
  const [filterDept, setFilterDept] = useState('ALL');
  const [form, setForm] = useState({ username: '', email: '', password: '', role: 'EMPLOYEE', firstName: '', lastName: '', designation: '', departmentId: '', phoneNumber: '', hireDate: '' });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      setLoading(true);
      const [empRes, deptRes] = await Promise.all([accountApi.getByRole('EMPLOYEE'), departmentApi.getAll()]);
      setEmployees(empRes.data.data || []);
      setDepartments(deptRes.data.data || []);
    } catch (e) { setError('Failed to load'); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setSuccess('');
    try {
      const payload = { ...form, departmentId: form.departmentId || null, role: 'EMPLOYEE' };
      if (editAcc) { await accountApi.update(editAcc.accountId, { ...payload, password: undefined }); setSuccess('Updated!'); }
      else { await accountApi.create(payload); setSuccess('Employee created!'); }
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
    setForm({ username: acc.username, email: acc.email, password: '', role: 'EMPLOYEE', firstName: acc.firstName, lastName: acc.lastName, designation: acc.designation || '', departmentId: acc.departmentId || '', phoneNumber: acc.phoneNumber || '', hireDate: acc.hireDate || '' });
    setShowModal(true);
  };

  const filtered = employees.filter(e =>
    (filterDept === 'ALL' || String(e.departmentId) === filterDept) &&
    (`${e.firstName} ${e.lastName} ${e.username} ${e.email}`.toLowerCase().includes(search.toLowerCase()))
  );

  if (loading) return <div className="loading"><div className="spinner"></div>Loading...</div>;

  return (
    <div>
      {error && <div className="alert alert-error">⚠️ {error}</div>}
      {success && <div className="alert alert-success">✅ {success}</div>}

      <div className="page-header">
        <div>
          <h1 className="page-title">Employees</h1>
          <p className="page-subtitle">{employees.length} employees</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setEditAcc(null); setForm({ username: '', email: '', password: '', role: 'EMPLOYEE', firstName: '', lastName: '', designation: '', departmentId: '', phoneNumber: '', hireDate: '' }); setShowModal(true); }}>
          + Add Employee
        </button>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <input className="form-control" style={{ maxWidth: 260 }} placeholder="🔍 Search employees..." value={search} onChange={e => setSearch(e.target.value)} />
        <select className="form-control" style={{ maxWidth: 200 }} value={filterDept} onChange={e => setFilterDept(e.target.value)}>
          <option value="ALL">All Departments</option>
          {departments.map(d => <option key={d.departmentId} value={String(d.departmentId)}>{d.departmentName}</option>)}
        </select>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr><th>Name</th><th>Username</th><th>Email</th><th>Designation</th><th>Department</th><th>Hire Date</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan="8" style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>No employees found</td></tr>
            ) : filtered.map(emp => (
              <tr key={emp.accountId}>
                <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{emp.firstName} {emp.lastName}</td>
                <td><code style={{ fontSize: 12, color: 'var(--primary-light)' }}>{emp.username}</code></td>
                <td style={{ fontSize: 12 }}>{emp.email}</td>
                <td style={{ fontSize: 12 }}>{emp.designation || '—'}</td>
                <td style={{ fontSize: 12 }}>{emp.departmentName || '—'}</td>
                <td style={{ fontSize: 12 }}>{emp.hireDate || '—'}</td>
                <td><span className={`badge ${emp.isActive ? 'badge-active' : 'badge-inactive'}`}>{emp.isActive ? 'Active' : 'Inactive'}</span></td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => openEdit(emp)}>✏️</button>
                    <button className={`btn btn-sm ${emp.isActive ? 'btn-danger' : 'btn-success'}`} onClick={() => handleToggle(emp)}>{emp.isActive ? '🔒' : '🔓'}</button>
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
              <span className="modal-title">{editAcc ? 'Edit Employee' : 'Add Employee'}</span>
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
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input className="form-control" value={form.phoneNumber} onChange={e => setForm({ ...form, phoneNumber: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Hire Date</label>
                  <input className="form-control" type="date" value={form.hireDate} onChange={e => setForm({ ...form, hireDate: e.target.value })} />
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
