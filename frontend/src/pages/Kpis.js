import React, { useState, useEffect } from 'react';
import { kpiApi, accountApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

const STATUS_OPTS = ['PENDING', 'IN_PROGRESS', 'ACHIEVED', 'NOT_ACHIEVED'];
const STATUS_BADGE = { PENDING: 'badge-pending', IN_PROGRESS: 'badge-in-progress', ACHIEVED: 'badge-approved', NOT_ACHIEVED: 'badge-rejected' };

export default function Kpis() {
  const { isAdmin, isManager } = useAuth();
  const canCreate = isAdmin() || isManager();
  const [kpis, setKpis] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editKpi, setEditKpi] = useState(null);
  const [form, setForm] = useState({ employeeId: '', title: '', description: '', targetValue: '', achievedValue: '', status: 'PENDING', dueDate: '' });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      setLoading(true);
      const res = await kpiApi.getMe();
      setKpis(res.data.data || []);
      if (canCreate) {
        const empRes = await accountApi.getByRole('EMPLOYEE');
        setEmployees(empRes.data.data || []);
      }
    } catch (e) { 
      console.error('Load failed:', e.message);
      setError('Failed to load KPIs');
      // Fallback sample data
      setKpis([
        { kpiId: 1, title: 'Code Quality', description: 'Maintain code test coverage above 80%', targetValue: 80, achievedValue: 85, status: 'ACHIEVED', employeeName: 'Charlie Brown', dueDate: '2024-03-31' },
        { kpiId: 2, title: 'Delivery On Time', description: 'Complete sprint tasks within planned estimate', targetValue: 95, achievedValue: 92, status: 'IN_PROGRESS', employeeName: 'Diana Davis', dueDate: '2024-03-31' },
        { kpiId: 3, title: 'Customer Satisfaction', description: 'Maintain customer satisfaction score above 4.5/5', targetValue: 4.5, achievedValue: 4.6, status: 'ACHIEVED', employeeName: 'Eve Martinez', dueDate: '2024-02-28' },
      ]);
      setEmployees([
        { accountId: 2, username: 'emp1', firstName: 'Charlie', lastName: 'Brown' },
        { accountId: 3, username: 'emp2', firstName: 'Diana', lastName: 'Davis' },
      ]);
    }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setSuccess('');
    try {
      const payload = { ...form, employeeId: Number(form.employeeId) };
      if (editKpi) { await kpiApi.update(editKpi.kpiId, payload); setSuccess('KPI updated!'); }
      else { await kpiApi.create(payload); setSuccess('KPI created!'); }
      setShowModal(false); setEditKpi(null); load();
    } catch (e) { setError(e.response?.data?.message || 'Operation failed'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this KPI?')) return;
    try { await kpiApi.delete(id); setSuccess('Deleted!'); load(); }
    catch (e) { setError('Failed to delete KPI'); }
  };

  const openEdit = (k) => {
    setEditKpi(k);
    setForm({ employeeId: k.employeeId, title: k.title, description: k.description || '', targetValue: k.targetValue || '', achievedValue: k.achievedValue || '', status: k.status, dueDate: k.dueDate ? k.dueDate.substring(0, 10) : '' });
    setShowModal(true);
  };

  if (loading) return <div className="loading"><div className="spinner"></div>Loading...</div>;

  return (
    <div>
      {error && <div className="alert alert-error">⚠️ {error}</div>}
      {success && <div className="alert alert-success">✅ {success}</div>}

      <div className="page-header">
        <div>
          <h1 className="page-title">KPIs</h1>
          <p className="page-subtitle">Key Performance Indicators</p>
        </div>
        {canCreate && (
          <button className="btn btn-primary" onClick={() => { setEditKpi(null); setForm({ employeeId: '', title: '', description: '', targetValue: '', achievedValue: '', status: 'PENDING', dueDate: '' }); setShowModal(true); }}>
            + Add KPI
          </button>
        )}
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr><th>Title</th><th>Employee</th><th>Target</th><th>Achieved</th><th>Status</th><th>Due Date</th><th>Assigned By</th>{canCreate && <th>Actions</th>}</tr>
          </thead>
          <tbody>
            {kpis.length === 0 ? (
              <tr><td colSpan="8" style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>No KPIs found</td></tr>
            ) : kpis.map(k => (
              <tr key={k.kpiId}>
                <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{k.title}</td>
                <td style={{ fontSize: 12 }}>{k.employeeName}</td>
                <td style={{ fontSize: 12 }}>{k.targetValue || '—'}</td>
                <td style={{ fontSize: 12 }}>{k.achievedValue || '—'}</td>
                <td><span className={`badge ${STATUS_BADGE[k.status] || 'badge-todo'}`}>{k.status}</span></td>
                <td style={{ fontSize: 12 }}>{k.dueDate ? k.dueDate.substring(0, 10) : '—'}</td>
                <td style={{ fontSize: 12 }}>{k.assignedByName}</td>
                {canCreate && (
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => openEdit(k)}>✏️</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(k.kpiId)}>🗑️</button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <span className="modal-title">{editKpi ? 'Edit KPI' : 'Create KPI'}</span>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Employee *</label>
                <select className="form-control" required value={form.employeeId} onChange={e => setForm({ ...form, employeeId: e.target.value })}>
                  <option value="">Select Employee</option>
                  {employees.map(e => <option key={e.accountId} value={e.accountId}>{e.firstName} {e.lastName}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Title *</label>
                <input className="form-control" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-control" rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Target Value</label>
                  <input className="form-control" value={form.targetValue} onChange={e => setForm({ ...form, targetValue: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Achieved Value</label>
                  <input className="form-control" value={form.achievedValue} onChange={e => setForm({ ...form, achievedValue: e.target.value })} />
                </div>
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select className="form-control" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                    {STATUS_OPTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Due Date</label>
                  <input className="form-control" type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editKpi ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
