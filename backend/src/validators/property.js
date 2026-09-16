const Joi = require('joi');

const media = Joi.object({ url: Joi.string().uri().required(), type: Joi.string().valid('image', 'video'), order: Joi.number().integer().min(0), alt: Joi.string().max(180) });
const propertyFields = {
  title: Joi.string().trim().min(3).max(180), description: Joi.string().allow(''), price: Joi.number().min(0).required(), currency: Joi.string().max(8),
  slug: Joi.string().lowercase().pattern(/^[a-z0-9-]+$/), location: Joi.object({ city: Joi.string(), district: Joi.string(), coordinates: Joi.object({ lat: Joi.number(), lng: Joi.number() }) }),
  specs: Joi.object({ area: Joi.number().min(0), bedrooms: Joi.number().integer().min(0), bathrooms: Joi.number().min(0), yearBuilt: Joi.number().integer(), hasPool: Joi.boolean(), parking: Joi.number().integer().min(0) }),
  status: Joi.string().valid('available', 'reserved', 'sold', 'under_construction'), tag: Joi.string().valid('new', 'exclusive', 'under_construction').allow(null), media: Joi.array().items(media), featured: Joi.boolean(), agentId: Joi.string().hex().length(24).allow(null)
};
const createPropertySchema = Joi.object({ ...propertyFields, title: propertyFields.title.required() }).unknown(false);
const updatePropertySchema = Joi.object(propertyFields).min(1).unknown(false);
const listPropertySchema = Joi.object({ page: Joi.number().integer().min(1).default(1), limit: Joi.number().integer().min(1).max(100).default(12), city: Joi.string(), district: Joi.string(), minPrice: Joi.number().min(0), maxPrice: Joi.number().min(0), bedrooms: Joi.number().integer().min(0), status: Joi.string().valid('available', 'reserved', 'sold', 'under_construction'), sort: Joi.string().valid('createdAt', '-createdAt', 'price', '-price', 'viewsCount', '-viewsCount').default('-createdAt') });
module.exports = { createPropertySchema, updatePropertySchema, listPropertySchema };
