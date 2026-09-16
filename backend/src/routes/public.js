const express = require('express');
const rateLimit = require('express-rate-limit');
const validate = require('../middlewares/validate');
const controller = require('../controllers/public');
const { createLeadSchema } = require('../validators/lead');

const router = express.Router();
const leadLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 20, standardHeaders: true, legacyHeaders: false });
router.post('/leads', leadLimiter, validate(createLeadSchema), controller.createLead);
router.get('/testimonials', controller.testimonials);
router.get('/settings/public', controller.settings);
module.exports = router;
