const Joi = require('joi');
const createLeadSchema = Joi.object({ name: Joi.string().trim().min(2).max(120).required(), phone: Joi.string().trim().min(7).max(30).required(), email: Joi.string().email().allow(''), message: Joi.string().max(2000).allow(''), propertyId: Joi.string().hex().length(24).allow(null), source: Joi.string().valid('hero_cta', 'property_card', 'contact_form', 'phone_click').default('contact_form') }).unknown(false);
module.exports = { createLeadSchema };
