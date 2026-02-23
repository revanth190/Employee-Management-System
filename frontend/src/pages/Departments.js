import React, { useState, useEffect } from 'react';
import { departmentApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Departments() {
  const { isAdmin } = useAuth();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editDept, setEditDept] = useState(null);
  const [form, setForm] = useState({ departmentName: '', description: '' });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      setLoading(true);
      const res = await departmentApi.getAll();
      setDepartments(res.data.data || []);
    } catch (e) { 
      console.error('Load failed:', e.message);
      setError('Failed to load departments');
      // Fallback sample data
      setDepartments([
        { departmentId: 1, departmentName: 'Engineering', description: 'Software development and architecture' },
        { departmentId: 2, departmentName: 'Human Resources', description: 'HR operations and employee relations' },
        { departmentId: 3, departmentName: 'Finance', description: 'Financial planning and accounting' },
      ]);
    }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setSuccess('');
    try {
      if (editDept) { await departmentApi.update(editDept.departmentId, form); setSuccess('Department updated!'); }
      else { await departmentApi.create(form); setSuccess('Department created!'); }
      setShowModal(false); setEditDept(null); setForm({ departmentName: '', description: '' }); load();
    } catch (e) { setError(e.response?.data?.message || 'Operation failed'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this department?')) return;
    try { await departmentApi.delete(id); setSuccess('Deleted!'); load(); }
    catch (e) { setError('Cannot delete department with assigned members'); }
  };

  if (loading) return <div className="loading"><div className="spinner"></div>Loading...</div>;

  return (
    <div>
      {error && <div className="alert alert-error">⚠️ {error}</div>}
      {success && <div className="alert alert-success">✅ {success}</div>}

      <div className="page-header">
        <div>
          <h1 className="page-title">Departments</h1>
          <p className="page-subtitle">Sorted by users → employees → managers count</p>
        </div>
        {isAdmin() && (
          <button className="btn btn-primary" onClick={() => { setEditDept(null); setForm({ departmentName: '', description: '' }); setShowModal(true); }}>
            + Add Department
          </button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
        {departments.map(dept => (
          <div key={dept.departmentId} className="card" style={{ marginBottom: 0 }}>
            <div className="card-header">
              <div>
                <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>🏢 {dept.departmentName}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{dept.description || 'No description'}</div>
              </div>
              {isAdmin() && (
                <div style={{ display: 'flex', gap: 6 }}>
                  <button className="btn btn-secondary btn-sm" onClick={() => { setEditDept(dept); setForm({ departmentName: dept.departmentName, description: dept.description || '' }); setShowModal(true); }}>✏️</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(dept.departmentId)}>🗑️</button>
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <div style={countStyle('#f59e0b')}>
                <div style={{ fontSize: 22, fontWeight: 700 }}>{dept.userCount}</div>
                <div style={{ fontSize: 11 }}>Users</div>
              </div>
              <div style={countStyle('#22c55e')}>
                <div style={{ fontSize: 22, fontWeight: 700 }}>{dept.employeeCount}</div>
                <div style={{ fontSize: 11 }}>Employees</div>
              </div>
              <div style={countStyle('#6366f1')}>
                <div style={{ fontSize: 22, fontWeight: 700 }}>{dept.managerCount}</div>
                <div style={{ fontSize: 11 }}>Managers</div>
              </div>
            </div>
          </div>
        ))}
        {departments.length === 0 && (
          <div className="empty-state" style={{ gridColumn: '1/-1' }}>
            <div className="empty-state-icon">🏢</div>
            <div className="empty-state-title">No departments yet</div>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal" style={{ maxWidth: 400 }}>
            <div className="modal-header">
              <span className="modal-title">{editDept ? 'Edit Department' : 'Create Department'}</span>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Department Name *</label>
                <input className="form-control" required value={form.departmentName} onChange={e => setForm({ ...form, departmentName: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-control" rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              </div>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editDept ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const countStyle = (color) => ({
  flex: 1, textAlign: 'center', padding: '12px 8px',
  background: `${color}10`, border: `1px solid ${color}30`,
  borderRadius: 8, color,
});
