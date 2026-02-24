import React, { createContext, useState, useEffect } from 'react';
import { leadAPI } from '../services/api';
import { toast } from 'react-toastify';

export const LeadContext = createContext();

export const LeadProvider = ({ children }) => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    source: '',
    search: '',
    sortBy: 'newest'
  });

  useEffect(() => {
    fetchLeads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await leadAPI.getLeads(filters);
      setLeads(res.data.data);
    } catch (error) {
      console.error('Failed to fetch leads:', error);
      toast.error('Failed to load leads');
    } finally {
      setLoading(false);
    }
  };

  const createLead = async (leadData) => {
    try {
      const res = await leadAPI.createLead(leadData);
      setLeads([res.data.data, ...leads]);
      toast.success('Lead created successfully!');
      return true;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create lead';
      toast.error(message);
      return false;
    }
  };

  const updateLead = async (id, leadData) => {
    try {
      const res = await leadAPI.updateLead(id, leadData);
      setLeads(leads.map(lead => lead._id === id ? res.data.data : lead));
      toast.success('Lead updated successfully!');
      return res.data.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update lead';
      toast.error(message);
      return null;
    }
  };

  const deleteLead = async (id) => {
    try {
      await leadAPI.deleteLead(id);
      setLeads(leads.filter(lead => lead._id !== id));
      toast.success('Lead deleted successfully!');
      return true;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete lead';
      toast.error(message);
      return false;
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const res = await leadAPI.updateStatus(id, status);
      setLeads(leads.map(lead => lead._id === id ? res.data.data : lead));
      toast.success('Status updated successfully!');
      return res.data.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update status';
      toast.error(message);
      return null;
    }
  };

  const addNote = async (id, noteContent) => {
    try {
      const res = await leadAPI.addNote(id, { content: noteContent });
      toast.success('Note added successfully!');
      return res.data.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add note';
      toast.error(message);
      return null;
    }
  };

  return (
    <LeadContext.Provider value={{
      leads,
      loading,
      filters,
      setFilters,
      fetchLeads,
      createLead,
      updateLead,
      deleteLead,
      updateStatus,
      addNote
    }}>
      {children}
    </LeadContext.Provider>
  );
};
