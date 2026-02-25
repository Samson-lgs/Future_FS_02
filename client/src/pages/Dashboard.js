// Dashboard v2 - Analytics Enhanced
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { LeadContext } from '../context/LeadContext';
import { AuthContext } from '../context/AuthContext';
import { analyticsAPI } from '../services/api';
import { 
  FiUsers, FiTrendingUp, FiClock, 
  FiDollarSign, FiDownload, FiAlertCircle, FiBarChart2,
  FiPieChart, FiActivity, FiCalendar, FiArrowUp, FiArrowDown
} from 'react-icons/fi';
import './Dashboard.css';

const Dashboard = () => {
  const { leads } = useContext(LeadContext);
  const { user } = useContext(AuthContext);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeChart, setActiveChart] = useState('status');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await analyticsAPI.getDashboard();
      setAnalytics(res.data.data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = async () => {
    try {
      const res = await analyticsAPI.exportCSV();
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `leads-export-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const stats = {
    total: analytics?.totalLeads || leads.length,
    new: analytics?.statusBreakdown?.New || leads.filter(l => l.status === 'New').length,
    contacted: analytics?.statusBreakdown?.Contacted || leads.filter(l => l.status === 'Contacted').length,
    qualified: analytics?.statusBreakdown?.Qualified || leads.filter(l => l.status === 'Qualified').length,
    converted: analytics?.statusBreakdown?.Converted || leads.filter(l => l.status === 'Converted').length,
    lost: analytics?.statusBreakdown?.Lost || leads.filter(l => l.status === 'Lost').length,
  };

  const getStatusBarWidth = (count) => {
    return stats.total > 0 ? (count / stats.total) * 100 : 0;
  };

  const recentLeads = leads.slice(0, 8);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="container">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="container">
        {/* Welcome Section */}
        <div className="dashboard-welcome">
          <div className="welcome-text">
            <h1>{getGreeting()}, {user?.name?.split(' ')[0] || 'Admin'}!</h1>
            <p>Here's what's happening with your leads today</p>
          </div>
          <div className="welcome-actions">
            <button onClick={handleExportCSV} className="btn btn-outline btn-export">
              <FiDownload /> Export CSV
            </button>
            <Link to="/leads" className="btn btn-primary">
              <FiUsers /> View All Leads
            </Link>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="metrics-grid">
          <div className="metric-card metric-total">
            <div className="metric-icon">
              <FiUsers />
            </div>
            <div className="metric-content">
              <span className="metric-label">Total Leads</span>
              <span className="metric-value">{stats.total}</span>
            </div>
            <div className="metric-trend trend-up">
              <FiArrowUp /> Active
            </div>
          </div>

          <div className="metric-card metric-conversion">
            <div className="metric-icon">
              <FiTrendingUp />
            </div>
            <div className="metric-content">
              <span className="metric-label">Conversion Rate</span>
              <span className="metric-value">{analytics?.conversionRate || 0}%</span>
            </div>
            <div className="metric-trend trend-up">
              <FiArrowUp /> {stats.converted} converted
            </div>
          </div>

          <div className="metric-card metric-pipeline">
            <div className="metric-icon">
              <FiDollarSign />
            </div>
            <div className="metric-content">
              <span className="metric-label">Pipeline Value</span>
              <span className="metric-value">${(analytics?.pipelineValue || 0).toLocaleString()}</span>
            </div>
            <div className="metric-trend">
              Won: ${(analytics?.convertedValue || 0).toLocaleString()}
            </div>
          </div>

          <div className="metric-card metric-followup">
            <div className="metric-icon">
              <FiAlertCircle />
            </div>
            <div className="metric-content">
              <span className="metric-label">Overdue Follow-ups</span>
              <span className="metric-value">{analytics?.overdueFollowUps || 0}</span>
            </div>
            <div className={`metric-trend ${analytics?.overdueFollowUps > 0 ? 'trend-down' : 'trend-up'}`}>
              {analytics?.overdueFollowUps > 0 ? <><FiArrowDown /> Needs attention</> : <><FiArrowUp /> All clear</>}
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="charts-row">
          {/* Status Pipeline */}
          <div className="chart-card">
            <div className="chart-header">
              <h2><FiBarChart2 /> Lead Pipeline</h2>
              <div className="chart-tabs">
                <button 
                  className={`chart-tab ${activeChart === 'status' ? 'active' : ''}`}
                  onClick={() => setActiveChart('status')}
                >Status</button>
                <button 
                  className={`chart-tab ${activeChart === 'source' ? 'active' : ''}`}
                  onClick={() => setActiveChart('source')}
                >Source</button>
              </div>
            </div>
            <div className="chart-body">
              {activeChart === 'status' ? (
                <div className="pipeline-bars">
                  {[
                    { label: 'New', count: stats.new, color: '#3b82f6' },
                    { label: 'Contacted', count: stats.contacted, color: '#8b5cf6' },
                    { label: 'Qualified', count: stats.qualified, color: '#f59e0b' },
                    { label: 'Converted', count: stats.converted, color: '#10b981' },
                    { label: 'Lost', count: stats.lost, color: '#ef4444' },
                  ].map(item => (
                    <div key={item.label} className="pipeline-item">
                      <div className="pipeline-label">
                        <span className="pipeline-dot" style={{ backgroundColor: item.color }}></span>
                        <span>{item.label}</span>
                        <span className="pipeline-count">{item.count}</span>
                      </div>
                      <div className="pipeline-bar-bg">
                        <div 
                          className="pipeline-bar-fill" 
                          style={{ 
                            width: `${getStatusBarWidth(item.count)}%`,
                            backgroundColor: item.color 
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="pipeline-bars">
                  {analytics?.sourceBreakdown && Object.entries(analytics.sourceBreakdown).map(([source, count]) => {
                    const colors = {
                      'Website': '#3b82f6', 'Referral': '#10b981', 'Social Media': '#8b5cf6',
                      'Email Campaign': '#f59e0b', 'Direct': '#ef4444', 'Other': '#6b7280'
                    };
                    return (
                      <div key={source} className="pipeline-item">
                        <div className="pipeline-label">
                          <span className="pipeline-dot" style={{ backgroundColor: colors[source] || '#6b7280' }}></span>
                          <span>{source}</span>
                          <span className="pipeline-count">{count}</span>
                        </div>
                        <div className="pipeline-bar-bg">
                          <div 
                            className="pipeline-bar-fill" 
                            style={{ 
                              width: `${getStatusBarWidth(count)}%`,
                              backgroundColor: colors[source] || '#6b7280' 
                            }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                  {(!analytics?.sourceBreakdown || Object.keys(analytics.sourceBreakdown).length === 0) && (
                    <p className="no-data">No source data yet</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Priority & Quick Stats */}
          <div className="chart-card">
            <div className="chart-header">
              <h2><FiPieChart /> Quick Stats</h2>
            </div>
            <div className="chart-body">
              <div className="quick-stats">
                <div className="quick-stat-item">
                  <div className="quick-stat-circle">
                    <span>{analytics?.conversionRate || 0}%</span>
                  </div>
                  <span className="quick-stat-label">Conversion Rate</span>
                </div>
                <div className="quick-stat-item">
                  <div className="quick-stat-value">${analytics?.averageLeadValue || 0}</div>
                  <span className="quick-stat-label">Avg. Lead Value</span>
                </div>
              </div>

              <div className="priority-breakdown">
                <h3>Priority Distribution</h3>
                <div className="priority-bars">
                  {[
                    { label: 'Urgent', color: '#ef4444', count: analytics?.priorityBreakdown?.Urgent || 0 },
                    { label: 'High', color: '#f59e0b', count: analytics?.priorityBreakdown?.High || 0 },
                    { label: 'Medium', color: '#3b82f6', count: analytics?.priorityBreakdown?.Medium || 0 },
                    { label: 'Low', color: '#6b7280', count: analytics?.priorityBreakdown?.Low || 0 },
                  ].map(p => (
                    <div key={p.label} className="priority-bar-item">
                      <span className="priority-label">{p.label}</span>
                      <div className="priority-bar-bg">
                        <div className="priority-bar-fill" style={{ 
                          width: `${stats.total > 0 ? (p.count / stats.total) * 100 : 0}%`, 
                          backgroundColor: p.color 
                        }}></div>
                      </div>
                      <span className="priority-count">{p.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Follow-ups */}
        {analytics?.upcomingFollowUps && analytics.upcomingFollowUps.length > 0 && (
          <div className="followup-section">
            <div className="section-header">
              <h2><FiCalendar /> Upcoming Follow-ups</h2>
            </div>
            <div className="followup-cards">
              {analytics.upcomingFollowUps.map(lead => (
                <Link key={lead._id} to={`/leads/${lead._id}`} className="followup-card">
                  <div className="followup-info">
                    <span className="followup-name">{lead.name}</span>
                    <span className="followup-email">{lead.email}</span>
                  </div>
                  <div className="followup-meta">
                    <span className={`badge badge-${lead.status?.toLowerCase()}`}>{lead.status}</span>
                    <span className="followup-date">
                      <FiClock /> {new Date(lead.followUpDate).toLocaleDateString()}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Recent Leads Table */}
        <div className="recent-leads">
          <div className="section-header">
            <h2><FiActivity /> Recent Leads</h2>
            <Link to="/leads" className="view-all-link">View all →</Link>
          </div>

          {recentLeads.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📊</div>
              <h3>No leads yet</h3>
              <p>Start by creating your first lead to see analytics!</p>
              <Link to="/leads" className="btn btn-primary">Create First Lead</Link>
            </div>
          ) : (
            <div className="leads-table-container">
              <table className="leads-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Company</th>
                    <th>Source</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Value</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentLeads.map(lead => (
                    <tr key={lead._id}>
                      <td>
                        <Link to={`/leads/${lead._id}`} className="lead-name">
                          {lead.name}
                        </Link>
                      </td>
                      <td className="lead-email-cell">{lead.email}</td>
                      <td>{lead.company || '-'}</td>
                      <td><span className="source-tag">{lead.source}</span></td>
                      <td>
                        <span className={`priority-badge priority-${(lead.priority || 'medium').toLowerCase()}`}>
                          {lead.priority || 'Medium'}
                        </span>
                      </td>
                      <td>
                        <span className={`badge badge-${lead.status.toLowerCase()}`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="lead-value">${lead.value || 0}</td>
                      <td className="lead-date">{new Date(lead.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
