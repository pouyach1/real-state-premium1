const Joi = require('joi');
const leadUpdateSchema = Joi.object({ status: Joi.string().valid('new', 'contacted', 'qualified', 'closed'), assignedTo: Joi.string().hex().length(24).allow(null) }).min(1);
const testimonialSchema = Joi.object({ authorName: Joi.string().required(), authorRole: Joi.string().required(), quote: Joi.string().required(), rating: Joi.number().min(1).max(5).allow(null), isPublished: Joi.boolean() }).min(1);
const settingsSchema = Joi.object({ stats: Joi.object(), contact: Joi.object() }).min(1);
module.exports = { leadUpdateSchema, testimonialSchema, settingsSchema };
