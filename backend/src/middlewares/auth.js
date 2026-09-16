const AppError = require('../utils/app-error');
const { verifyAccessToken } = require('../utils/jwt');
const User = require('../models/user');

async function requireAuth(req, res, next) {
  try {
    const header = req.get('authorization') || '';
    if (!header.startsWith('Bearer ')) throw new AppError('Authentication required', 401, 'UNAUTHORIZED');
    const payload = verifyAccessToken(header.slice(7));
    const user = await User.findOne({ _id: payload.sub, isActive: true });
    if (!user) throw new AppError('User is inactive or missing', 401, 'UNAUTHORIZED');
    req.user = user;
    next();
  } catch (error) { next(error instanceof AppError ? error : new AppError('Invalid access token', 401, 'UNAUTHORIZED')); }
}

function requireRole(roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) return next(new AppError('Insufficient permissions', 403, 'FORBIDDEN'));
    next();
  };
}

module.exports = { requireAuth, requireRole };
