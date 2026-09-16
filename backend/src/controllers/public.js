const Lead = require('../models/lead');
const Testimonial = require('../models/testimonial');
const SiteSettings = require('../models/site-settings');
const { success } = require('../utils/response');

async function createLead(req, res, next) { try { return success(res, await Lead.create(req.body), 201); } catch (error) { return next(error); } }
async function testimonials(req, res, next) { try { return success(res, await Testimonial.find({ isPublished: true }).sort('-createdAt')); } catch (error) { return next(error); } }
async function settings(req, res, next) { try { const item = await SiteSettings.findOne({ key: 'default' }).select('stats contact'); return success(res, item || { stats: {}, contact: {} }); } catch (error) { return next(error); } }
module.exports = { createLead, testimonials, settings };
