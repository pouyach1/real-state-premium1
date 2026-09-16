const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const mongoSanitize = require('mongo-sanitize');
const env = require('./config/env');
const routes = require('./routes');
const { notFound, errorHandler } = require('./middlewares/error-handler');

const app = express();
app.disable('x-powered-by');
app.use(helmet());
app.use(cors({
  origin(origin, callback) {
    if (!origin || env.CORS_ORIGINS.includes(origin)) return callback(null, true);
    return callback(null, false);
  },
  credentials: true
}));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser());
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use((req, res, next) => {
  req.body = mongoSanitize(req.body || {});
  req.params = mongoSanitize(req.params || {});
  req.query = mongoSanitize(req.query || {});
  next();
});
app.use('/storage', express.static(env.UPLOAD_DIR));
app.use('/api', routes);
app.use(notFound);
app.use(errorHandler);

module.exports = app;
