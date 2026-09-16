const AppError = require('../utils/app-error');

function notFound(req, res, next) {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404, 'NOT_FOUND'));
}

function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const error = { code: err.code || 'INTERNAL_ERROR', message: statusCode >= 500 ? 'Internal server error' : err.message };
  if (err.details) error.fields = err.details;
  if (process.env.NODE_ENV !== 'production') error.debug = err.message;
  res.status(statusCode).json({ success: false, error });
}

module.exports = { notFound, errorHandler };
