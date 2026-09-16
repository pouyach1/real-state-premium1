const bcrypt = require('bcrypt');
const Lead = require('../models/lead');
const User = require('../models/user');
const Testimonial = require('../models/testimonial');
const SiteSettings = require('../models/site-settings');
const Property = require('../models/property');
const AppError = require('../utils/app-error');

async function listLeads(query) { const page = Number(query.page || 1); const limit = Math.min(Number(query.limit || 20), 100); const filter = query.status ? { status: query.status } : {}; const [items, total] = await Promise.all([Lead.find(filter).sort('-createdAt').skip((page - 1) * limit).limit(limit).populate('propertyId', 'title slug').populate('assignedTo', 'name email'), Lead.countDocuments(filter)]); return { items, total, page, limit, pages: Math.ceil(total / limit) }; }
async function updateLead(id, data) { const item = await Lead.findByIdAndUpdate(id, data, { new: true, runValidators: true }); if (!item) throw new AppError('Lead not found', 404, 'LEAD_NOT_FOUND'); return item; }
async function listTestimonials() { return Testimonial.find().sort('-createdAt'); }
async function createTestimonial(data) { return Testimonial.create(data); }
async function updateTestimonial(id, data) { const item = await Testimonial.findByIdAndUpdate(id, data, { new: true, runValidators: true }); if (!item) throw new AppError('Testimonial not found', 404, 'TESTIMONIAL_NOT_FOUND'); return item; }
async function deleteTestimonial(id) { const item = await Testimonial.findByIdAndDelete(id); if (!item) throw new AppError('Testimonial not found', 404, 'TESTIMONIAL_NOT_FOUND'); return item; }
async function listAgents() { return User.find().select('-passwordHash -refreshTokenHash').sort('name'); }
async function createAgent(data) { const passwordHash = await bcrypt.hash(data.password, 12); return User.create({ name: data.name, email: data.email, phone: data.phone, role: data.role || 'agent', passwordHash }); }
async function dashboard() { const week = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); const [activeProperties, leadsThisWeek, closedLeads, totalLeads] = await Promise.all([Property.countDocuments({ status: 'available' }), Lead.countDocuments({ createdAt: { $gte: week } }), Lead.countDocuments({ status: 'closed' }), Lead.countDocuments()]); return { activeProperties, leadsThisWeek, conversionRate: totalLeads ? Number((closedLeads / totalLeads * 100).toFixed(1)) : 0 }; }
async function updateSettings(data) { return SiteSettings.findOneAndUpdate({ key: 'default' }, { $set: data, $setOnInsert: { key: 'default' } }, { new: true, upsert: true, runValidators: true }); }
module.exports = { listLeads, updateLead, listTestimonials, createTestimonial, updateTestimonial, deleteTestimonial, listAgents, createAgent, dashboard, updateSettings };
