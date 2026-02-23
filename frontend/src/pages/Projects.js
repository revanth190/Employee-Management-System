import React, { useState, useEffect } from 'react';
import { projectApi, accountApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

const STATUS_OPTS = ['ACTIVE', 'COMPLETED', 'ON_HOLD', 'CANCELLED'];
const STATUS_BADGE = { ACTIVE: 'badge-approved', COMPLETED: 'badge-manager', ON_HOLD: 'badge-pending', CANCELLED: 'badge-rejected' };

export default function Projects() {
  const { isAdmin, isManager, user } = useAuth();
  const canManage = isAdmin() || isManager();
  const [projects, setProjects] = useState([]);
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editProj, setEditProj] = useState(null);
  const [form, setForm] = useState({ projectName: '', description: '', managerId: '', startDate: '', endDate: '', status: 'ACTIVE' });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      setLoading(true);
      let res;
      // RBAC: Different endpoints based on role
      if (isAdmin()) {
        res = await projectApi.getAll();  // ADMIN sees all projects
      } else if (isManager()) {
        res = await projectApi.getMine(); // MANAGER sees only their managed projects
      } else {
        // EMPLOYEE/USER: See only projects they have assigned tasks
        res = await projectApi.getAssigned();
        if (res.data.data.length === 0) {
          setProjects([]);
          setError('No projects assigned to you yet. Check the Tasks section for available work.');
          setLoading(false);
          return;
        }
      }
      setProjects(res.data.data || []);
      if (canManage) {
        const mRes = await accountApi.getByRole('MANAGER');
        setManagers(mRes.data.data || []);
      }
    } catch (e) { 
      console.error('Load failed:', e.message);
      if (isAdmin()) {
        setError('Failed to load projects'); 
      } else if (isManager()) {
        setError('Failed to load your managed projects');
      } else {
        setError('Failed to load your assigned projects');
      }
      // Fallback sample data for DEV/testing
      if (isAdmin()) {
        setProjects([
          { projectId: 1, projectName: 'Website Redesign', description: 'Complete redesign of company website', status: 'ACTIVE', startDate: '2024-01-15', endDate: '2024-06-30', managerName: 'Alice Johnson' },
          { projectId: 2, projectName: 'Mobile App Dev', description: 'Develop mobile app for iOS and Android', status: 'ACTIVE', startDate: '2024-02-01', endDate: '2024-08-31', managerName: 'Bob Williams' },
          { projectId: 3, projectName: 'Database Migration', description: 'Migrate to new database system', status: 'COMPLETED', startDate: '2023-06-01', endDate: '2024-01-31', managerName: 'Alice Johnson' },
        ]);
      }
      setManagers([
        { accountId: 2, username: 'manager1', firstName: 'Alice', lastName: 'Johnson' },
        { accountId: 3, username: 'manager2', firstName: 'Bob', lastName: 'Williams' },
      ]);
    }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setSuccess('');
    try {
      const payload = { ...form, managerId: form.managerId || null };
      if (editProj) { await projectApi.update(editProj.projectId, payload); setSuccess('Project updated!'); }
      else { await projectApi.create(payload); setSuccess('Project created!'); }
      setShowModal(false); setEditProj(null); load();
    } catch (e) { setError(e.response?.data?.message || 'Operation failed'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    try { await projectApi.delete(id); setSuccess('Deleted!'); load(); }
    catch (e) { setError('Failed to delete project'); }
  };

  const openEdit = (p) => {
    setEditProj(p);
    setForm({ projectName: p.projectName, description: p.description || '', managerId: p.managerId || '', startDate: p.startDate || '', endDate: p.endDate || '', status: p.status });
    setShowModal(true);
  };

  if (loading) return <div className="loading"><div className="spinner"></div>Loading...</div>;

  return (
    <div>
      {error && <div className="alert alert-error">⚠️ {error}</div>}
      {success && <div className="alert alert-success">✅ {success}</div>}

      <div className="page-header">
        <div>
          <h1 className="page-title">Projects</h1>
          <p className="page-subtitle">{projects.length} projects total</p>
        </div>
        {canManage && (
          <button className="btn btn-primary" onClick={() => { setEditProj(null); setForm({ projectName: '', description: '', managerId: '', startDate: '', endDate: '', status: 'ACTIVE' }); setShowModal(true); }}>
            + New Project
          </button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
        {projects.map(p => (
          <div key={p.projectId} className="card" style={{ marginBottom: 0 }}>
            <div className="card-header">
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>📁 {p.projectName}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                  Manager: {p.managerName || '—'}
                </div>
              </div>
              <span className={`badge ${STATUS_BADGE[p.status] || 'badge-todo'}`}>{p.status}</span>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12, lineHeight: 1.5 }}>{p.description || 'No description'}</p>
            <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>
              <span>📅 {p.startDate || '—'} → {p.endDate || '—'}</span>
              <span>📋 {p.taskCount} tasks</span>
            </div>
            {canManage && (
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-secondary btn-sm" onClick={() => openEdit(p)}>✏️ Edit</button>
                {isAdmin() && <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.projectId)}>🗑️ Delete</button>}
              </div>
            )}
          </div>
        ))}
        {projects.length === 0 && (
          <div className="empty-state" style={{ gridColumn: '1/-1' }}>
            <div className="empty-state-icon">📁</div>
            <div className="empty-state-title">No projects found</div>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <span className="modal-title">{editProj ? 'Edit Project' : 'New Project'}</span>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Project Name *</label>
                <input className="form-control" required value={form.projectName} onChange={e => setForm({ ...form, projectName: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-control" rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Manager</label>
                  <select className="form-control" value={form.managerId} onChange={e => setForm({ ...form, managerId: e.target.value })}>
                    <option value="">Select Manager</option>
                    {managers.map(m => <option key={m.accountId} value={m.accountId}>{m.firstName} {m.lastName}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select className="form-control" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                    {STATUS_OPTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Start Date</label>
                  <input className="form-control" type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">End Date</label>
                  <input className="form-control" type="date" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editProj ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
