const Joi = require('joi');
const mediaSchema = Joi.object({ alt: Joi.string().max(180).allow(''), order: Joi.number().integer().min(0).default(0) });
module.exports = { mediaSchema };
