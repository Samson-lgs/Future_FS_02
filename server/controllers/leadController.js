const Lead = require('../models/Lead');

// @desc    Get all leads
// @route   GET /api/leads
// @access  Private
exports.getLeads = async (req, res) => {
  try {
    const { status, source, search, sortBy, priority, followUp } = req.query;
    
    // Build query
    let query = {};
    
    if (status) {
      query.status = status;
    }
    
    if (source) {
      query.source = source;
    }

    if (priority) {
      query.priority = priority;
    }

    // Follow-up filter
    if (followUp === 'overdue') {
      query.followUpDate = { $lt: new Date() };
      query.status = { $nin: ['Converted', 'Lost'] };
    } else if (followUp === 'today') {
      const start = new Date(); start.setHours(0,0,0,0);
      const end = new Date(); end.setHours(23,59,59,999);
      query.followUpDate = { $gte: start, $lte: end };
    } else if (followUp === 'week') {
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      query.followUpDate = { $gte: new Date(), $lte: nextWeek };
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }

    // Sort options
    let sortOptions = {};
    if (sortBy === 'newest') {
      sortOptions = { createdAt: -1 };
    } else if (sortBy === 'oldest') {
      sortOptions = { createdAt: 1 };
    } else if (sortBy === 'name') {
      sortOptions = { name: 1 };
    } else if (sortBy === 'value-high') {
      sortOptions = { value: -1 };
    } else if (sortBy === 'value-low') {
      sortOptions = { value: 1 };
    } else if (sortBy === 'priority') {
      sortOptions = { priority: -1, updatedAt: -1 };
    } else if (sortBy === 'followup') {
      sortOptions = { followUpDate: 1 };
    } else {
      sortOptions = { updatedAt: -1 };
    }

    const leads = await Lead.find(query)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .populate('notes.createdBy', 'name')
      .sort(sortOptions);

    res.json({
      success: true,
      count: leads.length,
      data: leads
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single lead
// @route   GET /api/leads/:id
// @access  Private
exports.getLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .populate('notes.createdBy', 'name');

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    res.json({
      success: true,
      data: lead
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new lead
// @route   POST /api/leads
// @access  Private
exports.createLead = async (req, res) => {
  try {
    const leadData = {
      ...req.body,
      createdBy: req.user._id,
      activityLog: [{
        action: 'Lead Created',
        details: `Lead "${req.body.name}" was created`,
        performedBy: req.user._id,
        timestamp: new Date()
      }]
    };

    const lead = await Lead.create(leadData);

    res.status(201).json({
      success: true,
      data: lead
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update lead
// @route   PUT /api/leads/:id
// @access  Private
exports.updateLead = async (req, res) => {
  try {
    let lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    // Log activity
    const changes = [];
    if (req.body.status && req.body.status !== lead.status) changes.push(`Status: ${lead.status} → ${req.body.status}`);
    if (req.body.priority && req.body.priority !== lead.priority) changes.push(`Priority: ${lead.priority || 'Medium'} → ${req.body.priority}`);
    if (req.body.name && req.body.name !== lead.name) changes.push(`Name updated`);

    const updateData = { ...req.body };
    if (changes.length > 0) {
      updateData.$push = {
        activityLog: {
          action: 'Lead Updated',
          details: changes.join(', '),
          performedBy: req.user._id,
          timestamp: new Date()
        }
      };
    }
    if (req.body.status === 'Contacted' && !lead.lastContactedAt) {
      updateData.lastContactedAt = new Date();
    }

    lead = await Lead.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    ).populate('assignedTo', 'name email')
     .populate('createdBy', 'name email')
     .populate('notes.createdBy', 'name');

    res.json({
      success: true,
      data: lead
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete lead
// @route   DELETE /api/leads/:id
// @access  Private
exports.deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    await lead.deleteOne();

    res.json({
      success: true,
      message: 'Lead deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add note to lead
// @route   POST /api/leads/:id/notes
// @access  Private
exports.addNote = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    const note = {
      content: req.body.content,
      createdBy: req.user._id
    };

    lead.notes.push(note);
    await lead.save();

    const updatedLead = await Lead.findById(req.params.id)
      .populate('notes.createdBy', 'name');

    res.json({
      success: true,
      data: updatedLead
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update lead status
// @route   PATCH /api/leads/:id/status
// @access  Private
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const existingLead = await Lead.findById(req.params.id);
    const oldStatus = existingLead ? existingLead.status : '';

    const updateOps = { 
      status,
      $push: {
        activityLog: {
          action: 'Status Changed',
          details: `${oldStatus} → ${status}`,
          performedBy: req.user._id,
          timestamp: new Date()
        }
      }
    };
    if (status === 'Contacted') {
      updateOps.lastContactedAt = new Date();
    }

    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      updateOps,
      { new: true, runValidators: true }
    ).populate('assignedTo', 'name email')
     .populate('createdBy', 'name email');

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    res.json({
      success: true,
      data: lead
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
