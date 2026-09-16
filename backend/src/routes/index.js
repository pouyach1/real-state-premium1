const express = require('express');
const authRoutes = require('./auth');
const propertyRoutes = require('./properties');
const publicRoutes = require('./public');
const adminRoutes = require('./admin');

const router = express.Router();
router.get('/health', (req, res) => res.json({ success: true, data: { service: 'derakhshan-api', status: 'ok', timestamp: new Date().toISOString() } }));
router.use('/auth', authRoutes);
router.use('/properties', propertyRoutes);
router.use('/', publicRoutes);
router.use('/admin', adminRoutes);

module.exports = router;
