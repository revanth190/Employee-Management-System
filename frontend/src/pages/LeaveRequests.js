import React, { useState, useEffect } from 'react';
import { leaveApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

const TYPES = ['LEAVE', 'WFH', 'REIMBURSEMENT', 'HR_REQUEST'];
const STATUS_BADGE = { PENDING: 'badge-pending', APPROVED: 'badge-approved', REJECTED: 'badge-rejected' };

export default function LeaveRequests() {
  const { isAdmin, isManager } = useAuth();
  const canReview = isAdmin() || isManager();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [reviewModal, setReviewModal] = useState(null);
  const [form, setForm] = useState({ requestType: 'LEAVE', description: '', startDate: '', endDate: '' });
  const [reviewForm, setReviewForm] = useState({ status: 'APPROVED', reviewComment: '' });
  const [tab, setTab] = useState('mine');

  useEffect(() => { load(); }, [tab]);

  const load = async () => {
    try {
      setLoading(true);
      let res;
      if (tab === 'mine') res = await leaveApi.getMe();
      else if (tab === 'team') res = await leaveApi.getTeam();
      else res = await leaveApi.getAll();
      setRequests(res.data.data || []);
    } catch (e) { 
      console.error('Load failed:', e.message);
      setError('Failed to load requests');
      // Fallback sample data
      setRequests([
        { requestId: 1, requestType: 'LEAVE', description: 'Annual leave', startDate: '2024-03-15', endDate: '2024-03-20', status: 'APPROVED', employeeName: 'Charlie Brown', submitDate: '2024-03-01' },
        { requestId: 2, requestType: 'WFH', description: 'Work from home', startDate: '2024-03-22', endDate: '2024-03-22', status: 'PENDING', employeeName: 'Diana Davis', submitDate: '2024-03-15' },
        { requestId: 3, requestType: 'REIMBURSEMENT', description: 'Office supplies', startDate: '2024-02-28', endDate: '2024-02-28', status: 'REJECTED', employeeName: 'Eve Martinez', submitDate: '2024-03-05' },
      ]);
    }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setSuccess('');
    try {
      await leaveApi.submit(form);
      setSuccess('Request submitted!'); setShowModal(false);
      setForm({ requestType: 'LEAVE', description: '', startDate: '', endDate: '' }); load();
    } catch (e) { setError(e.response?.data?.message || 'Operation failed'); }
  };

  const handleReview = async (e) => {
    e.preventDefault(); setError(''); setSuccess('');
    try {
      await leaveApi.review(reviewModal, reviewForm);
      setSuccess('Request reviewed!'); setReviewModal(null); load();
    } catch (e) { setError('Failed to review request'); }
  };

  if (loading) return <div className="loading"><div className="spinner"></div>Loading...</div>;

  return (
    <div>
      {error && <div className="alert alert-error">⚠️ {error}</div>}
      {success && <div className="alert alert-success">✅ {success}</div>}

      <div className="page-header">
        <div>
          <h1 className="page-title">Leave & HR Requests</h1>
          <p className="page-subtitle">{requests.length} requests</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Submit Request</button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        <button className={`btn btn-sm ${tab === 'mine' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setTab('mine')}>My Requests</button>
        {canReview && <button className={`btn btn-sm ${tab === 'team' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setTab('team')}>Team Requests</button>}
        {isAdmin() && <button className={`btn btn-sm ${tab === 'all' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setTab('all')}>All Requests</button>}
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr><th>Employee</th><th>Type</th><th>Description</th><th>Dates</th><th>Status</th><th>Reviewed By</th>{canReview && <th>Action</th>}</tr>
          </thead>
          <tbody>
            {requests.length === 0 ? (
              <tr><td colSpan="7" style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>No requests found</td></tr>
            ) : requests.map(r => (
              <tr key={r.requestId}>
                <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{r.accountName}</td>
                <td><span className="badge badge-user">{r.requestType}</span></td>
                <td style={{ fontSize: 12, maxWidth: 200 }}>{r.description?.substring(0, 60) || '—'}</td>
                <td style={{ fontSize: 12 }}>{r.startDate ? `${r.startDate} → ${r.endDate || '?'}` : '—'}</td>
                <td><span className={`badge ${STATUS_BADGE[r.status]}`}>{r.status}</span></td>
                <td style={{ fontSize: 12 }}>{r.reviewedByName || '—'}</td>
                {canReview && (
                  <td>
                    {r.status === 'PENDING' && (
                      <button className="btn btn-secondary btn-sm" onClick={() => { setReviewModal(r.requestId); setReviewForm({ status: 'APPROVED', reviewComment: '' }); }}>
                        Review
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Submit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal" style={{ maxWidth: 420 }}>
            <div className="modal-header">
              <span className="modal-title">Submit Request</span>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Request Type *</label>
                <select className="form-control" value={form.requestType} onChange={e => setForm({ ...form, requestType: e.target.value })}>
                  {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-control" rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
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
                <button type="submit" className="btn btn-primary">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {reviewModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setReviewModal(null)}>
          <div className="modal" style={{ maxWidth: 380 }}>
            <div className="modal-header">
              <span className="modal-title">Review Request</span>
              <button className="modal-close" onClick={() => setReviewModal(null)}>✕</button>
            </div>
            <form onSubmit={handleReview}>
              <div className="form-group">
                <label className="form-label">Decision *</label>
                <select className="form-control" value={reviewForm.status} onChange={e => setReviewForm({ ...reviewForm, status: e.target.value })}>
                  <option value="APPROVED">APPROVED</option>
                  <option value="REJECTED">REJECTED</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Comment</label>
                <textarea className="form-control" rows={3} value={reviewForm.reviewComment} onChange={e => setReviewForm({ ...reviewForm, reviewComment: e.target.value })} />
              </div>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setReviewModal(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
