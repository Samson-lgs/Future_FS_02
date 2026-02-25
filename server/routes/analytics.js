const express = require('express');
const router = express.Router();
const { getDashboardAnalytics, exportLeads } = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/dashboard', getDashboardAnalytics);
router.get('/export', exportLeads);

module.exports = router;
