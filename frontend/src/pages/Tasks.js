import React, { useState, useEffect } from 'react';
import { taskApi, projectApi, accountApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

const STATUS_OPTS = ['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'];
const PRIORITY_OPTS = ['LOW', 'MEDIUM', 'HIGH'];
const STATUS_BADGE = { TODO: 'badge-todo', IN_PROGRESS: 'badge-in-progress', REVIEW: 'badge-pending', DONE: 'badge-done' };
const PRIORITY_COLOR = { LOW: '#22c55e', MEDIUM: '#f59e0b', HIGH: '#ef4444' };

export default function Tasks() {
  const { isAdmin, isManager } = useAuth();
  const canManage = isAdmin() || isManager();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [form, setForm] = useState({ projectId: '', assignedToId: '', title: '', description: '', status: 'TODO', priority: 'MEDIUM', dueDate: '', hoursLogged: 0 });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      setLoading(true);
      // RBAC: Different endpoints based on role
      let res;
      if (isAdmin()) {
        res = await taskApi.getAll();  // ADMIN sees all tasks
      } else {
        res = await taskApi.getMe();   // EMPLOYEE/USER/MANAGER see only their tasks
      }
      setTasks(res.data.data || []);
      
      // Load projects only for ADMIN (for task creation)
      if (isAdmin()) {
        const pRes = await projectApi.getAll();
        setProjects(pRes.data.data || []);
      } else {
        // For others, just use sample projects
        setProjects([
          { projectId: 1, projectName: 'Website Redesign' },
          { projectId: 2, projectName: 'Mobile App Dev' },
        ]);
      }
      
      if (canManage) {
        const empRes = await accountApi.getByRole('EMPLOYEE');
        setEmployees(empRes.data.data || []);
      }
    } catch (e) { 
      console.error('Load failed:', e.message);
      if (isAdmin()) {
        setError('Failed to load tasks');
      }
      // Fallback sample data
      setTasks([
        { taskId: 1, title: 'Design Homepage', description: 'Create mockups for homepage', status: 'IN_PROGRESS', priority: 'HIGH', projectName: 'Website Redesign', dueDate: '2024-03-15', hoursLogged: 12 },
        { taskId: 2, title: 'API Integration', description: 'Integrate payment gateway API', status: 'TODO', priority: 'HIGH', projectName: 'Mobile App Dev', dueDate: '2024-03-20', hoursLogged: 0 },
        { taskId: 3, title: 'Database Schema', description: 'Design and optimize schema', status: 'DONE', priority: 'MEDIUM', projectName: 'Database Migration', dueDate: '2023-12-31', hoursLogged: 24 },
      ]);
      setProjects([
        { projectId: 1, projectName: 'Website Redesign' },
        { projectId: 2, projectName: 'Mobile App Dev' },
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
      const payload = { ...form, assignedToId: form.assignedToId || null, projectId: Number(form.projectId) };
      if (editTask) { await taskApi.update(editTask.taskId, payload); setSuccess('Task updated!'); }
      else { await taskApi.create(payload); setSuccess('Task created!'); }
      setShowModal(false); setEditTask(null); load();
    } catch (e) { setError(e.response?.data?.message || 'Operation failed'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try { await taskApi.delete(id); setSuccess('Deleted!'); load(); }
    catch (e) { setError('Failed to delete task'); }
  };

  const openEdit = (t) => {
    setEditTask(t);
    setForm({ projectId: t.projectId, assignedToId: t.assignedToId || '', title: t.title, description: t.description || '', status: t.status, priority: t.priority, dueDate: t.dueDate || '', hoursLogged: t.hoursLogged || 0 });
    setShowModal(true);
  };

  const filtered = tasks.filter(t => filterStatus === 'ALL' || t.status === filterStatus);

  if (loading) return <div className="loading"><div className="spinner"></div>Loading...</div>;

  return (
    <div>
      {error && <div className="alert alert-error">⚠️ {error}</div>}
      {success && <div className="alert alert-success">✅ {success}</div>}

      <div className="page-header">
        <div>
          <h1 className="page-title">Tasks</h1>
          <p className="page-subtitle">{tasks.length} tasks total</p>
        </div>
        {canManage && (
          <button className="btn btn-primary" onClick={() => { setEditTask(null); setForm({ projectId: '', assignedToId: '', title: '', description: '', status: 'TODO', priority: 'MEDIUM', dueDate: '', hoursLogged: 0 }); setShowModal(true); }}>
            + New Task
          </button>
        )}
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {['ALL', ...STATUS_OPTS].map(s => (
          <button key={s} className={`btn btn-sm ${filterStatus === s ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFilterStatus(s)}>{s}</button>
        ))}
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Title</th><th>Project</th><th>Assigned To</th><th>Priority</th>
              <th>Status</th><th>Due Date</th><th>Hours</th>
              {canManage && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan="8" style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>No tasks found</td></tr>
            ) : filtered.map(t => (
              <tr key={t.taskId}>
                <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{t.title}</td>
                <td style={{ fontSize: 12 }}>{t.projectName}</td>
                <td style={{ fontSize: 12 }}>{t.assignedToName || '—'}</td>
                <td><span style={{ fontSize: 12, fontWeight: 600, color: PRIORITY_COLOR[t.priority] }}>● {t.priority}</span></td>
                <td><span className={`badge ${STATUS_BADGE[t.status] || 'badge-todo'}`}>{t.status}</span></td>
                <td style={{ fontSize: 12 }}>{t.dueDate || '—'}</td>
                <td style={{ fontSize: 12 }}>{t.hoursLogged}h</td>
                {canManage && (
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => openEdit(t)}>✏️</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(t.taskId)}>🗑️</button>
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
              <span className="modal-title">{editTask ? 'Edit Task' : 'New Task'}</span>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
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
                  <label className="form-label">Project *</label>
                  <select className="form-control" required value={form.projectId} onChange={e => setForm({ ...form, projectId: e.target.value })}>
                    <option value="">Select Project</option>
                    {projects.map(p => <option key={p.projectId} value={p.projectId}>{p.projectName}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Assign To</label>
                  <select className="form-control" value={form.assignedToId} onChange={e => setForm({ ...form, assignedToId: e.target.value })}>
                    <option value="">Unassigned</option>
                    {employees.map(e => <option key={e.accountId} value={e.accountId}>{e.firstName} {e.lastName}</option>)}
                  </select>
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
                  <label className="form-label">Priority</label>
                  <select className="form-control" value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
                    {PRIORITY_OPTS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Due Date</label>
                  <input className="form-control" type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Hours Logged</label>
                  <input className="form-control" type="number" step="0.5" min="0" value={form.hoursLogged} onChange={e => setForm({ ...form, hoursLogged: e.target.value })} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editTask ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
