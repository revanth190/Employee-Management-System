import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { accountApi, projectApi, taskApi, leaveApi, departmentApi } from '../services/api';

function StatCard({ icon, label, value, bg, color }) {
  return (
    <div className="stat-card">
      <div className="stat-icon" style={{ background: bg }}>
        <span style={{ color }}>{icon}</span>
      </div>
      <div className="stat-info">
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user, isAdmin, isManager, isEmployee } = useAuth();
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [recentTasks, setRecentTasks] = useState([]);
  const [recentRequests, setRecentRequests] = useState([]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      console.log('Dashboard: Starting loadData, user.role:', user?.role);
      
      const tasks = await taskApi.getMe().catch(e => {
        console.error('Dashboard: taskApi.getMe() failed:', e.message);
        return { data: { data: [] } };
      });
      setRecentTasks(tasks.data.data?.slice(0, 5) || []);

      const requests = await leaveApi.getMe().catch(e => {
        console.error('Dashboard: leaveApi.getMe() failed:', e.message);
        return { data: { data: [] } };
      });
      setRecentRequests(requests.data.data?.slice(0, 3) || []);

      const s = {};

      if (isAdmin()) {
        console.log('Dashboard: Loading ADMIN stats...');
        const [accs, depts, projs] = await Promise.allSettled([
          accountApi.getAll().catch(e => { console.error('getAll() failed:', e.message); return { data: { data: [] } }; }),
          departmentApi.getAll().catch(e => { console.error('getAll() failed:', e.message); return { data: { data: [] } }; }),
          projectApi.getAll().catch(e => { console.error('getAll() failed:', e.message); return { data: { data: [] } }; }),
        ]);
        console.log('Dashboard: ADMIN stats resolved. accs:', accs.status, 'depts:', depts.status, 'projs:', projs.status);
        s.totalAccounts = accs.status === 'fulfilled' ? accs.value.data.data?.length : 0;
        s.totalDepts = depts.status === 'fulfilled' ? depts.value.data.data?.length : 0;
        s.totalProjects = projs.status === 'fulfilled' ? projs.value.data.data?.length : 0;
        s.activeProjects = projs.status === 'fulfilled' ? projs.value.data.data?.filter(p => p.status === 'ACTIVE').length : 0;
      } else if (isManager()) {
        console.log('Dashboard: Loading MANAGER stats...');
        const [team, projs] = await Promise.allSettled([
          accountApi.getTeam().catch(e => { console.error('getTeam() failed:', e.message); return { data: { data: [] } }; }),
          projectApi.getMine().catch(e => { console.error('getMine() failed:', e.message); return { data: { data: [] } }; }),
        ]);
        s.teamSize = team.status === 'fulfilled' ? team.value.data.data?.length : 0;
        s.myProjects = projs.status === 'fulfilled' ? projs.value.data.data?.length : 0;
      }

      s.myTasks = tasks.data.data?.length || 0;
      s.pendingTasks = tasks.data.data?.filter(t => t.status === 'TODO' || t.status === 'IN_PROGRESS').length || 0;
      s.myRequests = requests.data.data?.length || 0;
      s.pendingRequests = requests.data.data?.filter(r => r.status === 'PENDING').length || 0;
      console.log('Dashboard: Stats loaded:', s);
      setStats(s);
    } catch (e) {
      console.error('Dashboard loadData error:', e);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const map = {
      'TODO': 'badge-todo', 'IN_PROGRESS': 'badge-in-progress', 'DONE': 'badge-done',
      'PENDING': 'badge-pending', 'APPROVED': 'badge-approved', 'REJECTED': 'badge-rejected',
    };
    return <span className={`badge ${map[status] || 'badge-todo'}`}>{status}</span>;
  };

  if (loading) return <div className="loading"><div className="spinner"></div>Loading dashboard...</div>;

  return (
    <div>
      {/* Welcome */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)' }}>
          Good day, {user?.fullName?.split(' ')[0]}! 👋
        </h2>
        <p style={{ color: 'var(--text-muted)', marginTop: 4, fontSize: 14 }}>
          Here's what's happening in your workspace today.
        </p>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {isAdmin() && (
          <>
            <StatCard icon="👥" label="Total Accounts" value={stats.totalAccounts || 0} bg="rgba(99,102,241,0.15)" color="#818cf8" />
            <StatCard icon="🏢" label="Departments" value={stats.totalDepts || 0} bg="rgba(20,184,166,0.15)" color="#2dd4bf" />
            <StatCard icon="📁" label="Total Projects" value={stats.totalProjects || 0} bg="rgba(245,158,11,0.15)" color="#fbbf24" />
            <StatCard icon="🟢" label="Active Projects" value={stats.activeProjects || 0} bg="rgba(34,197,94,0.15)" color="#4ade80" />
          </>
        )}
        {isManager() && (
          <>
            <StatCard icon="👥" label="Team Members" value={stats.teamSize || 0} bg="rgba(20,184,166,0.15)" color="#2dd4bf" />
            <StatCard icon="📁" label="My Projects" value={stats.myProjects || 0} bg="rgba(245,158,11,0.15)" color="#fbbf24" />
          </>
        )}
        <StatCard icon="✅" label="My Tasks" value={stats.myTasks || 0} bg="rgba(99,102,241,0.15)" color="#818cf8" />
        <StatCard icon="⏳" label="Pending Tasks" value={stats.pendingTasks || 0} bg="rgba(239,68,68,0.15)" color="#f87171" />
        <StatCard icon="📝" label="My Requests" value={stats.myRequests || 0} bg="rgba(20,184,166,0.15)" color="#2dd4bf" />
        <StatCard icon="🕐" label="Pending Requests" value={stats.pendingRequests || 0} bg="rgba(245,158,11,0.15)" color="#fbbf24" />
      </div>

      <div className="grid-2" style={{ gap: 20 }}>
        {/* Recent Tasks */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">✅ Recent Tasks</span>
          </div>
          {recentTasks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📋</div>
              <div className="empty-state-title">No tasks assigned</div>
            </div>
          ) : (
            <div>
              {recentTasks.map(task => (
                <div key={task.taskId} style={taskStyles.item}>
                  <div style={taskStyles.taskTitle}>{task.title}</div>
                  <div style={taskStyles.taskMeta}>
                    <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>{task.projectName}</span>
                    {getStatusBadge(task.status)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Requests */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">📝 Recent Requests</span>
          </div>
          {recentRequests.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📋</div>
              <div className="empty-state-title">No requests submitted</div>
            </div>
          ) : (
            <div>
              {recentRequests.map(req => (
                <div key={req.requestId} style={taskStyles.item}>
                  <div style={taskStyles.taskTitle}>{req.requestType}</div>
                  <div style={taskStyles.taskMeta}>
                    <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>
                      {req.startDate ? `${req.startDate} to ${req.endDate}` : req.description?.substring(0, 30) + '...'}
                    </span>
                    {getStatusBadge(req.status)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Role Info */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">🎯 Your Access Level</span>
        </div>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {getRoleCapabilities(user?.role).map((cap, i) => (
            <div key={i} style={capStyle}>
              <span style={{ fontSize: 18 }}>{cap.icon}</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{cap.label}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{cap.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const taskStyles = {
  item: { padding: '10px 0', borderBottom: '1px solid var(--border)' },
  taskTitle: { fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 4 },
  taskMeta: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
};

const capStyle = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: 10,
  padding: '12px 16px',
  background: 'rgba(99,102,241,0.05)',
  border: '1px solid rgba(99,102,241,0.15)',
  borderRadius: 8,
  flex: '1 1 200px',
};

function getRoleCapabilities(role) {
  const map = {
    ADMIN: [
      { icon: '👥', label: 'User Management', desc: 'Create and manage all accounts' },
      { icon: '🏢', label: 'Departments', desc: 'Full department control' },
      { icon: '📊', label: 'Reports & Analytics', desc: 'Company-wide analytics' },
      { icon: '🔍', label: 'Audit Logs', desc: 'System security monitoring' },
      { icon: '⚙️', label: 'System Config', desc: 'All system settings' },
    ],
    MANAGER: [
      { icon: '👥', label: 'Team Management', desc: 'View and manage direct reports' },
      { icon: '📁', label: 'Project Management', desc: 'Create and assign projects' },
      { icon: '📊', label: 'Team Reports', desc: 'Team-level analytics' },
      { icon: '⭐', label: 'Performance', desc: 'Conduct appraisal reviews' },
    ],
    EMPLOYEE: [
      { icon: '👤', label: 'My Profile', desc: 'View and update your info' },
      { icon: '✅', label: 'My Tasks', desc: 'View assigned tasks' },
      { icon: '📊', label: 'My KPIs', desc: 'Track your performance goals' },
      { icon: '📝', label: 'HR Requests', desc: 'Submit leaves and requests' },
    ],
    USER: [
      { icon: '👤', label: 'My Profile', desc: 'Basic profile management' },
      { icon: '✅', label: 'My Tasks', desc: 'View assigned tasks' },
      { icon: '📝', label: 'Requests', desc: 'Submit basic requests' },
    ],
  };
  return map[role] || map.USER;
}
