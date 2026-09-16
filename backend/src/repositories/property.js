const Property = require('../models/property');

async function list(filters, { page, limit, sort }) {
  const query = {};
  if (filters.city) query['location.city'] = filters.city;
  if (filters.district) query['location.district'] = filters.district;
  if (filters.status) query.status = filters.status;
  if (filters.bedrooms !== undefined) query['specs.bedrooms'] = { $gte: filters.bedrooms };
  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) query.price = { ...(filters.minPrice !== undefined ? { $gte: filters.minPrice } : {}), ...(filters.maxPrice !== undefined ? { $lte: filters.maxPrice } : {}) };
  const [items, total] = await Promise.all([Property.find(query).sort(sort).skip((page - 1) * limit).limit(limit).populate('agentId', 'name phone'), Property.countDocuments(query)]);
  return { items, total, page, limit, pages: Math.ceil(total / limit) };
}
function findBySlug(slug) { return Property.findOne({ slug }).populate('agentId', 'name phone'); }
function findById(id) { return Property.findById(id); }
function create(data) { return Property.create(data); }
function updateById(id, data) { return Property.findByIdAndUpdate(id, data, { new: true, runValidators: true }); }
function deleteById(id) { return Property.findByIdAndDelete(id); }
function incrementViews(id) { return Property.findByIdAndUpdate(id, { $inc: { viewsCount: 1 } }, { new: true }).populate('agentId', 'name phone'); }
module.exports = { list, findBySlug, findById, create, updateById, deleteById, incrementViews };
