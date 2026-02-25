const Lead = require('../models/Lead');

// @desc    Get dashboard analytics
// @route   GET /api/analytics/dashboard
// @access  Private
exports.getDashboardAnalytics = async (req, res) => {
  try {
    const totalLeads = await Lead.countDocuments();
    
    // Status breakdown
    const statusCounts = await Lead.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Source breakdown
    const sourceCounts = await Lead.aggregate([
      { $group: { _id: '$source', count: { $sum: 1 } } }
    ]);

    // Priority breakdown
    const priorityCounts = await Lead.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);

    // Total pipeline value
    const pipelineValue = await Lead.aggregate([
      { $match: { status: { $nin: ['Lost'] } } },
      { $group: { _id: null, total: { $sum: '$value' } } }
    ]);

    // Converted value
    const convertedValue = await Lead.aggregate([
      { $match: { status: 'Converted' } },
      { $group: { _id: null, total: { $sum: '$value' } } }
    ]);

    // Leads created per month (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const monthlyLeads = await Lead.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 },
          value: { $sum: '$value' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Conversion rate
    const convertedCount = statusCounts.find(s => s._id === 'Converted')?.count || 0;
    const conversionRate = totalLeads > 0 ? ((convertedCount / totalLeads) * 100).toFixed(1) : 0;

    // Overdue follow-ups
    const overdueFollowUps = await Lead.countDocuments({
      followUpDate: { $lt: new Date() },
      status: { $nin: ['Converted', 'Lost'] }
    });

    // Upcoming follow-ups (next 7 days)
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    const upcomingFollowUps = await Lead.find({
      followUpDate: { $gte: new Date(), $lte: nextWeek },
      status: { $nin: ['Converted', 'Lost'] }
    }).select('name email followUpDate status priority').sort('followUpDate').limit(10);

    // Recent activity (last 10 leads updated)
    const recentActivity = await Lead.find()
      .select('name status updatedAt createdAt priority')
      .sort('-updatedAt')
      .limit(10);

    // Average lead value
    const avgValue = await Lead.aggregate([
      { $match: { value: { $gt: 0 } } },
      { $group: { _id: null, avg: { $avg: '$value' } } }
    ]);

    res.json({
      success: true,
      data: {
        totalLeads,
        conversionRate: parseFloat(conversionRate),
        pipelineValue: pipelineValue[0]?.total || 0,
        convertedValue: convertedValue[0]?.total || 0,
        averageLeadValue: Math.round(avgValue[0]?.avg || 0),
        overdueFollowUps,
        statusBreakdown: statusCounts.reduce((acc, curr) => {
          acc[curr._id] = curr.count;
          return acc;
        }, {}),
        sourceBreakdown: sourceCounts.reduce((acc, curr) => {
          acc[curr._id] = curr.count;
          return acc;
        }, {}),
        priorityBreakdown: priorityCounts.reduce((acc, curr) => {
          acc[curr._id || 'Medium'] = curr.count;
          return acc;
        }, {}),
        monthlyLeads,
        upcomingFollowUps,
        recentActivity
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Export leads as CSV
// @route   GET /api/analytics/export
// @access  Private
exports.exportLeads = async (req, res) => {
  try {
    const leads = await Lead.find()
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .sort('-createdAt');

    // Build CSV
    const headers = ['Name', 'Email', 'Phone', 'Company', 'Source', 'Status', 'Priority', 'Value', 'Follow-Up Date', 'Created At', 'Notes Count'];
    const rows = leads.map(lead => [
      lead.name,
      lead.email,
      lead.phone || '',
      lead.company || '',
      lead.source,
      lead.status,
      lead.priority || 'Medium',
      lead.value || 0,
      lead.followUpDate ? new Date(lead.followUpDate).toLocaleDateString() : '',
      new Date(lead.createdAt).toLocaleDateString(),
      lead.notes?.length || 0
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=leads-export.csv');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
