import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { LeadContext } from '../context/LeadContext';
import { FiPlus, FiSearch, FiX } from 'react-icons/fi';
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
    value: 0
  });

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  const handleCreateLead = async (e) => {
    e.preventDefault();
    const success = await createLead(formData);
    if (success) {
      setShowCreateModal(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        source: 'Website',
        status: 'New',
        value: 0
      });
    }
  };

  return (
    <div className="lead-list-page">
      <div className="container">
        <div className="page-header">
          <h1>All Leads</h1>
          <button onClick={() => setShowCreateModal(true)} className="btn btn-primary">
            <FiPlus /> Create Lead
          </button>
        </div>

        <div className="filters-section">
          <div className="search-box">
            <FiSearch />
            <input
              type="text"
              placeholder="Search by name, email, or company..."
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
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="filter-select"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name">Name A-Z</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="spinner"></div>
        ) : leads.length === 0 ? (
          <div className="empty-state">
            <p>No leads found. Create your first lead to get started!</p>
          </div>
        ) : (
          <div className="leads-grid">
            {leads.map(lead => (
              <Link key={lead._id} to={`/leads/${lead._id}`} className="lead-card">
                <div className="lead-card-header">
                  <h3>{lead.name}</h3>
                  <span className={`badge badge-${lead.status.toLowerCase()}`}>
                    {lead.status}
                  </span>
                </div>
                <div className="lead-card-body">
                  <p className="lead-email">{lead.email}</p>
                  {lead.company && <p className="lead-company">{lead.company}</p>}
                  <div className="lead-meta">
                    <span className="lead-source">{lead.source}</span>
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
                <div className="form-group">
                  <label htmlFor="name">Name *</label>
                  <input
                    type="text"
                    id="name"
                    className="form-control"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
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
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone</label>
                  <input
                    type="tel"
                    id="phone"
                    className="form-control"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
                  />
                </div>

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
                  <label htmlFor="value">Estimated Value ($)</label>
                  <input
                    type="number"
                    id="value"
                    className="form-control"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    min="0"
                  />
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
