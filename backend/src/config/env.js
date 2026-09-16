const Joi = require('joi');
require('dotenv').config();

const schema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'test', 'production').default('development'),
  PORT: Joi.number().port().default(4000),
  MONGO_URI: Joi.string().uri({ scheme: ['mongodb', 'mongodb+srv'] }).default('mongodb://127.0.0.1:27017/derakhshan_premium'),
  JWT_ACCESS_SECRET: Joi.string().min(32).default('development-access-secret-change-me-32'),
  JWT_REFRESH_SECRET: Joi.string().min(32).default('development-refresh-secret-change-me-32'),
  CORS_ORIGIN: Joi.string().default('http://localhost:5500'),
  STORAGE_DRIVER: Joi.string().valid('local', 's3').default('local'),
  UPLOAD_DIR: Joi.string().default('storage/uploads')
}).unknown(true);

const { value, error } = schema.validate(process.env);
if (error) throw new Error(`Invalid environment: ${error.message}`);

module.exports = { ...value, CORS_ORIGINS: value.CORS_ORIGIN.split(',').map((origin) => origin.trim()) };
