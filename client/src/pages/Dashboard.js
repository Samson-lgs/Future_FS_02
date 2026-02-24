import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { LeadContext } from '../context/LeadContext';
import { FiUsers, FiUserCheck, FiTrendingUp, FiClock } from 'react-icons/fi';
import './Dashboard.css';

const Dashboard = () => {
  const { leads } = useContext(LeadContext);

  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === 'New').length,
    contacted: leads.filter(l => l.status === 'Contacted').length,
    converted: leads.filter(l => l.status === 'Converted').length
  };

  const recentLeads = leads.slice(0, 5);

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>Dashboard</h1>
          <Link to="/leads" className="btn btn-primary">View All Leads</Link>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#dbeafe', color: '#1e40af' }}>
              <FiUsers />
            </div>
            <div className="stat-content">
              <h3>Total Leads</h3>
              <p className="stat-value">{stats.total}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#fef3c7', color: '#92400e' }}>
              <FiClock />
            </div>
            <div className="stat-content">
              <h3>New Leads</h3>
              <p className="stat-value">{stats.new}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#e0e7ff', color: '#3730a3' }}>
              <FiUserCheck />
            </div>
            <div className="stat-content">
              <h3>Contacted</h3>
              <p className="stat-value">{stats.contacted}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#d1fae5', color: '#065f46' }}>
              <FiTrendingUp />
            </div>
            <div className="stat-content">
              <h3>Converted</h3>
              <p className="stat-value">{stats.converted}</p>
            </div>
          </div>
        </div>

        <div className="recent-leads">
          <div className="section-header">
            <h2>Recent Leads</h2>
            <Link to="/leads" className="view-all-link">View all →</Link>
          </div>

          {recentLeads.length === 0 ? (
            <div className="empty-state">
              <p>No leads yet. Start by creating your first lead!</p>
              <Link to="/leads" className="btn btn-primary">Create Lead</Link>
            </div>
          ) : (
            <div className="leads-table-container">
              <table className="leads-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Source</th>
                    <th>Status</th>
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
                      <td>{lead.email}</td>
                      <td>{lead.source}</td>
                      <td>
                        <span className={`badge badge-${lead.status.toLowerCase()}`}>
                          {lead.status}
                        </span>
                      </td>
                      <td>{new Date(lead.createdAt).toLocaleDateString()}</td>
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
