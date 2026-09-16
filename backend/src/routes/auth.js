const express = require('express');
const rateLimit = require('express-rate-limit');
const controller = require('../controllers/auth');
const validate = require('../middlewares/validate');
const { loginSchema } = require('../validators/auth');

const router = express.Router();
const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: true, legacyHeaders: false });
router.post('/login', loginLimiter, validate(loginSchema), controller.login);
router.post('/refresh', controller.refresh);
router.post('/logout', controller.logout);
module.exports = router;
