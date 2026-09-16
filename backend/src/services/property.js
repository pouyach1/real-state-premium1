const propertyRepository = require('../repositories/property');
const AppError = require('../utils/app-error');
const slugify = require('../utils/slugify');
const mediaService = require('./media');

async function listPublic(query) { return propertyRepository.list(query, query); }
async function getPublicBySlug(slug) {
  const property = await propertyRepository.findBySlug(slug);
  if (!property) throw new AppError('Property not found', 404, 'PROPERTY_NOT_FOUND');
  return propertyRepository.incrementViews(property._id);
}
async function create(data) { return propertyRepository.create({ ...data, slug: data.slug || slugify(data.title) }); }
async function update(id, data) {
  const property = await propertyRepository.updateById(id, data);
  if (!property) throw new AppError('Property not found', 404, 'PROPERTY_NOT_FOUND');
  return property;
}
async function remove(id) {
  const property = await propertyRepository.deleteById(id);
  if (!property) throw new AppError('Property not found', 404, 'PROPERTY_NOT_FOUND');
  return property;
}
async function addMedia(id, file, metadata = {}) {
  const property = await propertyRepository.findById(id);
  if (!property) throw new AppError('Property not found', 404, 'PROPERTY_NOT_FOUND');
  const urls = await mediaService.savePropertyImage(file);
  property.media.push({ url: urls.original, type: 'image', order: metadata.order, alt: metadata.alt || '' });
  await property.save();
  return { property, variants: urls };
}
module.exports = { listPublic, getPublicBySlug, create, update, remove, addMedia };
