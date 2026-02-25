import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { LeadContext } from '../context/LeadContext';
import { FiPlus, FiSearch, FiX, FiCalendar, FiAlertCircle, FiDollarSign } from 'react-icons/fi';
import './LeadList.css';

const LeadList = () => {
  const { leads, loading, filters, setFilters, createLead } = useContext(LeadContext);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    source: 'Website',
    status: 'New',
    priority: 'Medium',
    value: 0,
    followUpDate: ''
  });

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  const handleCreateLead = async (e) => {
    e.preventDefault();
    const submitData = { ...formData };
    if (!submitData.followUpDate) delete submitData.followUpDate;
    const success = await createLead(submitData);
    if (success) {
      setShowCreateModal(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        source: 'Website',
        status: 'New',
        priority: 'Medium',
        value: 0,
        followUpDate: ''
      });
    }
  };

  const isOverdue = (date) => {
    return date && new Date(date) < new Date();
  };

  return (
    <div className="lead-list-page">
      <div className="container">
        <div className="page-header">
          <div>
            <h1>All Leads</h1>
            <p className="page-subtitle">{leads.length} total leads</p>
          </div>
          <button onClick={() => setShowCreateModal(true)} className="btn btn-primary">
            <FiPlus /> Create Lead
          </button>
        </div>

        <div className="filters-section">
          <div className="search-box">
            <FiSearch />
            <input
              type="text"
              placeholder="Search by name, email, company, or tags..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-controls">
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="filter-select"
            >
              <option value="">All Statuses</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Qualified">Qualified</option>
              <option value="Converted">Converted</option>
              <option value="Lost">Lost</option>
            </select>

            <select
              value={filters.source}
              onChange={(e) => handleFilterChange('source', e.target.value)}
              className="filter-select"
            >
              <option value="">All Sources</option>
              <option value="Website">Website</option>
              <option value="Referral">Referral</option>
              <option value="Social Media">Social Media</option>
              <option value="Email Campaign">Email Campaign</option>
              <option value="Direct">Direct</option>
              <option value="Other">Other</option>
            </select>

            <select
              value={filters.priority || ''}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
              className="filter-select"
            >
              <option value="">All Priorities</option>
              <option value="Urgent">Urgent</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="filter-select"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name">Name A-Z</option>
              <option value="value-high">Value: High to Low</option>
              <option value="value-low">Value: Low to High</option>
              <option value="priority">Priority</option>
              <option value="followup">Follow-up Date</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="spinner"></div>
        ) : leads.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>No leads found</h3>
            <p>Create your first lead to get started!</p>
          </div>
        ) : (
          <div className="leads-grid">
            {leads.map(lead => (
              <Link key={lead._id} to={`/leads/${lead._id}`} className="lead-card">
                <div className="lead-card-header">
                  <h3>{lead.name}</h3>
                  <div className="lead-card-badges">
                    <span className={`priority-badge priority-${(lead.priority || 'medium').toLowerCase()}`}>
                      {lead.priority || 'Medium'}
                    </span>
                    <span className={`badge badge-${lead.status.toLowerCase()}`}>
                      {lead.status}
                    </span>
                  </div>
                </div>
                <div className="lead-card-body">
                  <p className="lead-email">{lead.email}</p>
                  {lead.company && <p className="lead-company">{lead.company}</p>}
                  {lead.value > 0 && (
                    <p className="lead-value-tag"><FiDollarSign />{lead.value.toLocaleString()}</p>
                  )}
                  <div className="lead-meta">
                    <span className="lead-source">{lead.source}</span>
                    {lead.followUpDate && (
                      <span className={`lead-followup ${isOverdue(lead.followUpDate) ? 'overdue' : ''}`}>
                        <FiCalendar /> {new Date(lead.followUpDate).toLocaleDateString()}
                        {isOverdue(lead.followUpDate) && <FiAlertCircle className="overdue-icon" />}
                      </span>
                    )}
                    <span className="lead-date">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {lead.notes && lead.notes.length > 0 && (
                    <p className="lead-notes-count">{lead.notes.length} note(s)</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Create New Lead</h2>
              <button onClick={() => setShowCreateModal(false)} className="btn-icon">
                <FiX />
              </button>
            </div>
            <form onSubmit={handleCreateLead}>
              <div className="modal-body">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Name *</label>
                    <input
                      type="text"
                      id="name"
                      className="form-control"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email *</label>
                    <input
                      type="email"
                      id="email"
                      className="form-control"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="phone">Phone</label>
                    <input
                      type="tel"
                      id="phone"
                      className="form-control"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+1 234 567 8900"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="company">Company</label>
                    <input
                      type="text"
                      id="company"
                      className="form-control"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="Acme Inc."
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="source">Source</label>
                    <select
                      id="source"
                      className="form-control"
                      value={formData.source}
                      onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                    >
                      <option value="Website">Website</option>
                      <option value="Referral">Referral</option>
                      <option value="Social Media">Social Media</option>
                      <option value="Email Campaign">Email Campaign</option>
                      <option value="Direct">Direct</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="priority">Priority</label>
                    <select
                      id="priority"
                      className="form-control"
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Urgent">Urgent</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="value">Estimated Value ($)</label>
                    <input
                      type="number"
                      id="value"
                      className="form-control"
                      value={formData.value}
                      onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                      min="0"
                      placeholder="0"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="followUpDate">Follow-up Date</label>
                    <input
                      type="date"
                      id="followUpDate"
                      className="form-control"
                      value={formData.followUpDate}
                      onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setShowCreateModal(false)} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadList;
