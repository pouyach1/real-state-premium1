const express = require('express');
const rateLimit = require('express-rate-limit');
const controller = require('../controllers/property');
const validate = require('../middlewares/validate');
const { requireAuth, requireRole } = require('../middlewares/auth');
const { createPropertySchema, updatePropertySchema, listPropertySchema } = require('../validators/property');
const upload = require('../middlewares/upload');

const router = express.Router();
const publicLimiter = rateLimit({ windowMs: 60 * 1000, limit: 120, standardHeaders: true, legacyHeaders: false });
router.get('/', publicLimiter, validate(listPropertySchema, 'query'), controller.list);
router.get('/:slug', publicLimiter, controller.getBySlug);
router.post('/admin', requireAuth, requireRole(['admin', 'superadmin']), validate(createPropertySchema), controller.create);
router.patch('/admin/:id', requireAuth, requireRole(['admin', 'superadmin']), validate(updatePropertySchema), controller.update);
router.post('/admin/:id/media', requireAuth, requireRole(['admin', 'superadmin']), upload.single('file'), controller.addMedia);
router.delete('/admin/:id', requireAuth, requireRole(['admin', 'superadmin']), controller.remove);
module.exports = router;
