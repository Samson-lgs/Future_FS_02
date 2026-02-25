import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { LeadContext } from '../context/LeadContext';
import { leadAPI } from '../services/api';
import { 
  FiArrowLeft, 
  FiEdit2, 
  FiTrash2, 
  FiMail, 
  FiPhone, 
  FiBriefcase,
  FiCalendar,
  FiMessageSquare,
  FiActivity,
  FiAlertCircle,
  FiDollarSign,
  FiFlag
} from 'react-icons/fi';
import './LeadDetail.css';

const LeadDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateStatus, deleteLead, addNote, updateLead } = useContext(LeadContext);
  
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [noteContent, setNoteContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({});

  useEffect(() => {
    fetchLead();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchLead = async () => {
    try {
      const res = await leadAPI.getLead(id);
      setLead(res.data.data);
      setEditFormData(res.data.data);
    } catch (error) {
      console.error('Failed to fetch lead:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    const updated = await updateStatus(id, newStatus);
    if (updated) {
      setLead(updated);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      const success = await deleteLead(id);
      if (success) {
        navigate('/leads');
      }
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!noteContent.trim()) return;
    
    const updated = await addNote(id, noteContent);
    if (updated) {
      setLead(updated);
      setNoteContent('');
    }
  };

  const handleUpdateLead = async (e) => {
    e.preventDefault();
    const updated = await updateLead(id, editFormData);
    if (updated) {
      setLead(updated);
      setIsEditing(false);
    }
  };

  if (loading) {
    return <div className="spinner"></div>;
  }

  if (!lead) {
    return (
      <div className="container" style={{ padding: '2rem 0' }}>
        <p>Lead not found</p>
        <Link to="/leads" className="btn btn-primary">Back to Leads</Link>
      </div>
    );
  }

  return (
    <div className="lead-detail-page">
      <div className="container">
        <div className="back-button">
          <Link to="/leads" className="btn btn-outline">
            <FiArrowLeft /> Back to Leads
          </Link>
        </div>

        <div className="lead-detail-container">
          <div className="lead-main">
            <div className="card">
              <div className="lead-header">
                <div>
                  <h1>{lead.name}</h1>
                  <div className="lead-header-badges">
                    <span className={`priority-badge priority-${(lead.priority || 'medium').toLowerCase()}`}>
                      <FiFlag /> {lead.priority || 'Medium'}
                    </span>
                    <div className="lead-status-selector">
                      <label>Status:</label>
                      <select
                        value={lead.status}
                        onChange={(e) => handleStatusChange(e.target.value)}
                        className={`status-select badge-${lead.status.toLowerCase()}`}
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Qualified">Qualified</option>
                        <option value="Converted">Converted</option>
                        <option value="Lost">Lost</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="lead-actions">
                  <button onClick={() => setIsEditing(!isEditing)} className="btn btn-outline">
                    <FiEdit2 /> {isEditing ? 'Cancel' : 'Edit'}
                  </button>
                  <button onClick={handleDelete} className="btn btn-danger">
                    <FiTrash2 /> Delete
                  </button>
                </div>
              </div>

              {isEditing ? (
                <form onSubmit={handleUpdateLead} className="edit-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editFormData.name || ''}
                        onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        className="form-control"
                        value={editFormData.email || ''}
                        onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Phone</label>
                      <input
                        type="tel"
                        className="form-control"
                        value={editFormData.phone || ''}
                        onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Company</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editFormData.company || ''}
                        onChange={(e) => setEditFormData({ ...editFormData, company: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Source</label>
                      <select
                        className="form-control"
                        value={editFormData.source || 'Website'}
                        onChange={(e) => setEditFormData({ ...editFormData, source: e.target.value })}
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
                      <label>Priority</label>
                      <select
                        className="form-control"
                        value={editFormData.priority || 'Medium'}
                        onChange={(e) => setEditFormData({ ...editFormData, priority: e.target.value })}
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
                      <label>Estimated Value ($)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={editFormData.value || 0}
                        onChange={(e) => setEditFormData({ ...editFormData, value: e.target.value })}
                        min="0"
                      />
                    </div>
                    <div className="form-group">
                      <label>Follow-up Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={editFormData.followUpDate ? new Date(editFormData.followUpDate).toISOString().split('T')[0] : ''}
                        onChange={(e) => setEditFormData({ ...editFormData, followUpDate: e.target.value })}
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary">
                    Save Changes
                  </button>
                </form>
              ) : (
                <div className="lead-info">
                  <div className="info-row">
                    <FiMail />
                    <div>
                      <label>Email</label>
                      <a href={`mailto:${lead.email}`}>{lead.email}</a>
                    </div>
                  </div>

                  {lead.phone && (
                    <div className="info-row">
                      <FiPhone />
                      <div>
                        <label>Phone</label>
                        <a href={`tel:${lead.phone}`}>{lead.phone}</a>
                      </div>
                    </div>
                  )}

                  {lead.company && (
                    <div className="info-row">
                      <FiBriefcase />
                      <div>
                        <label>Company</label>
                        <p>{lead.company}</p>
                      </div>
                    </div>
                  )}

                  <div className="info-row">
                    <FiCalendar />
                    <div>
                      <label>Created</label>
                      <p>{new Date(lead.createdAt).toLocaleString()}</p>
                    </div>
                  </div>

                  {lead.followUpDate && (
                    <div className={`info-row ${new Date(lead.followUpDate) < new Date() ? 'overdue-row' : ''}`}>
                      <FiAlertCircle />
                      <div>
                        <label>Follow-up Date</label>
                        <p>
                          {new Date(lead.followUpDate).toLocaleDateString()}
                          {new Date(lead.followUpDate) < new Date() && (
                            <span className="overdue-text"> (Overdue!)</span>
                          )}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="info-grid">
                    <div className="info-item">
                      <label>Source</label>
                      <p>{lead.source}</p>
                    </div>
                    <div className="info-item">
                      <label><FiDollarSign /> Value</label>
                      <p className="lead-value-display">${(lead.value || 0).toLocaleString()}</p>
                    </div>
                    <div className="info-item">
                      <label><FiFlag /> Priority</label>
                      <p><span className={`priority-badge priority-${(lead.priority || 'medium').toLowerCase()}`}>{lead.priority || 'Medium'}</span></p>
                    </div>
                    {lead.lastContactedAt && (
                      <div className="info-item">
                        <label>Last Contacted</label>
                        <p>{new Date(lead.lastContactedAt).toLocaleDateString()}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="card">
              <h2><FiMessageSquare /> Notes & Follow-ups</h2>
              
              <form onSubmit={handleAddNote} className="note-form">
                <textarea
                  className="form-control"
                  placeholder="Add a note or follow-up..."
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  rows="3"
                ></textarea>
                <button type="submit" className="btn btn-primary" disabled={!noteContent.trim()}>
                  Add Note
                </button>
              </form>

              <div className="notes-list">
                {lead.notes && lead.notes.length > 0 ? (
                  lead.notes.map((note, index) => (
                    <div key={index} className="note-item">
                      <div className="note-header">
                        <span className="note-author">
                          {note.createdBy?.name || 'Unknown'}
                        </span>
                        <span className="note-date">
                          {new Date(note.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="note-content">{note.content}</p>
                    </div>
                  ))
                ) : (
                  <p className="no-notes">No notes yet. Add your first note above!</p>
                )}
              </div>
            </div>

            {/* Activity Timeline */}
            {lead.activityLog && lead.activityLog.length > 0 && (
              <div className="card">
                <h2><FiActivity /> Activity Timeline</h2>
                <div className="activity-timeline">
                  {[...lead.activityLog].reverse().map((activity, index) => (
                    <div key={index} className="timeline-item">
                      <div className="timeline-dot"></div>
                      <div className="timeline-content">
                        <div className="timeline-header">
                          <span className="timeline-action">{activity.action}</span>
                          <span className="timeline-date">
                            {new Date(activity.timestamp).toLocaleString()}
                          </span>
                        </div>
                        {activity.details && (
                          <p className="timeline-details">{activity.details}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadDetail;
