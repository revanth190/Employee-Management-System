import React, { useState, useEffect } from 'react';
import { reviewApi, accountApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

const STATUS_BADGE = { DRAFT: 'badge-todo', SUBMITTED: 'badge-pending', REVIEWED: 'badge-in-progress', APPROVED: 'badge-approved' };

export default function Performance() {
  const { isAdmin, isManager, isEmployee } = useAuth();
  const canCreate = isAdmin() || isManager();
  const [reviews, setReviews] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selfModal, setSelfModal] = useState(null);
  const [selfText, setSelfText] = useState('');
  const [form, setForm] = useState({ employeeId: '', cycleName: '', managerFeedback: '', rating: '', status: 'DRAFT', incrementRecommended: '' });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      setLoading(true);
      const res = isAdmin() ? await reviewApi.getAll() : await reviewApi.getMe();
      setReviews(res.data.data || []);
      if (canCreate) {
        const empRes = await accountApi.getByRole('EMPLOYEE');
        setEmployees(empRes.data.data || []);
      }
    } catch (e) { 
      console.error('Load failed:', e.message);
      setError('Failed to load reviews');
      // Fallback sample data
      setReviews([
        { reviewId: 1, employeeName: 'Charlie Brown', cycleName: 'Q1 2024', status: 'APPROVED', rating: 4.5, managerFeedback: 'Excellent work', submittedDate: '2024-02-15' },
        { reviewId: 2, employeeName: 'Diana Davis', cycleName: 'Q1 2024', status: 'SUBMITTED', rating: 3.8, managerFeedback: 'Good performance', submittedDate: '2024-02-10' },
        { reviewId: 3, employeeName: 'Eve Martinez', cycleName: 'Q1 2024', status: 'DRAFT', rating: null, managerFeedback: '', submittedDate: '2024-03-01' },
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
      const payload = { ...form, employeeId: Number(form.employeeId), rating: form.rating ? Number(form.rating) : null, incrementRecommended: form.incrementRecommended ? Number(form.incrementRecommended) : null };
      await reviewApi.create(payload);
      setSuccess('Review created!'); setShowModal(false); load();
    } catch (e) { setError(e.response?.data?.message || 'Operation failed'); }
  };

  const handleSelfAppraisal = async (e) => {
    e.preventDefault();
    try {
      await reviewApi.selfAppraisal(selfModal, { selfAppraisal: selfText });
      setSuccess('Self-appraisal submitted!'); setSelfModal(null); load();
    } catch (e) { setError(e.response?.data?.message || 'Failed to submit'); }
  };

  const renderStars = (rating) => {
    if (!rating) return '—';
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  if (loading) return <div className="loading"><div className="spinner"></div>Loading...</div>;

  return (
    <div>
      {error && <div className="alert alert-error">⚠️ {error}</div>}
      {success && <div className="alert alert-success">✅ {success}</div>}

      <div className="page-header">
        <div>
          <h1 className="page-title">Performance Reviews</h1>
          <p className="page-subtitle">Appraisal cycles and ratings</p>
        </div>
        {canCreate && (
          <button className="btn btn-primary" onClick={() => { setForm({ employeeId: '', cycleName: '', managerFeedback: '', rating: '', status: 'DRAFT', incrementRecommended: '' }); setShowModal(true); }}>
            + Create Review
          </button>
        )}
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr><th>Employee</th><th>Cycle</th><th>Reviewer</th><th>Rating</th><th>Status</th><th>Increment</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {reviews.length === 0 ? (
              <tr><td colSpan="7" style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>No reviews found</td></tr>
            ) : reviews.map(r => (
              <tr key={r.reviewId}>
                <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{r.employeeName}</td>
                <td style={{ fontSize: 12 }}>{r.cycleName || '—'}</td>
                <td style={{ fontSize: 12 }}>{r.reviewerName}</td>
                <td style={{ fontSize: 13 }}>{renderStars(r.rating)}</td>
                <td><span className={`badge ${STATUS_BADGE[r.status] || 'badge-todo'}`}>{r.status}</span></td>
                <td style={{ fontSize: 12 }}>{r.incrementRecommended ? `${r.incrementRecommended}%` : '—'}</td>
                <td>
                  {isEmployee() && r.status === 'DRAFT' && (
                    <button className="btn btn-secondary btn-sm" onClick={() => { setSelfModal(r.reviewId); setSelfText(r.selfAppraisal || ''); }}>
                      ✍️ Appraise
                    </button>
                  )}
                  {canCreate && (
                    <button className="btn btn-secondary btn-sm" onClick={() => { /* view details */ }}>👁️</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Review Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <span className="modal-title">Create Performance Review</span>
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
                <label className="form-label">Cycle Name</label>
                <input className="form-control" placeholder="e.g. Q4 2024 Annual Review" value={form.cycleName} onChange={e => setForm({ ...form, cycleName: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Manager Feedback</label>
                <textarea className="form-control" rows={3} value={form.managerFeedback} onChange={e => setForm({ ...form, managerFeedback: e.target.value })} />
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Rating (1-5)</label>
                  <select className="form-control" value={form.rating} onChange={e => setForm({ ...form, rating: e.target.value })}>
                    <option value="">None</option>
                    {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} ⭐</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Increment % Recommended</label>
                  <input className="form-control" type="number" step="0.1" min="0" value={form.incrementRecommended} onChange={e => setForm({ ...form, incrementRecommended: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select className="form-control" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                  {['DRAFT','SUBMITTED','REVIEWED','APPROVED'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Self Appraisal Modal */}
      {selfModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setSelfModal(null)}>
          <div className="modal" style={{ maxWidth: 440 }}>
            <div className="modal-header">
              <span className="modal-title">✍️ Submit Self-Appraisal</span>
              <button className="modal-close" onClick={() => setSelfModal(null)}>✕</button>
            </div>
            <form onSubmit={handleSelfAppraisal}>
              <div className="form-group">
                <label className="form-label">Self-Appraisal *</label>
                <textarea className="form-control" rows={6} required value={selfText} onChange={e => setSelfText(e.target.value)} placeholder="Describe your achievements, challenges, and goals..." />
              </div>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setSelfModal(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
