const service = require('../services/admin');
const { success } = require('../utils/response');
const methods = {
  leads: 'listLeads', updateLead: 'updateLead', testimonials: 'listTestimonials', createTestimonial: 'createTestimonial', updateTestimonial: 'updateTestimonial', deleteTestimonial: 'deleteTestimonial', agents: 'listAgents', createAgent: 'createAgent', dashboard: 'dashboard', settings: 'updateSettings'
};
function handler(method, status = 200) { return async (req, res, next) => { try { const args = method === 'updateLead' || method === 'updateTestimonial' ? [req.params.id, req.body] : method === 'deleteTestimonial' ? [req.params.id] : method === 'createTestimonial' || method === 'createAgent' || method === 'settings' ? [req.body] : method === 'leads' ? [req.query] : []; return success(res, await service[methods[method]](...args), status); } catch (error) { return next(error); } }; }
module.exports = { leads: handler('leads'), updateLead: handler('updateLead'), testimonials: handler('testimonials'), createTestimonial: handler('createTestimonial', 201), updateTestimonial: handler('updateTestimonial'), deleteTestimonial: handler('deleteTestimonial'), agents: handler('agents'), createAgent: handler('createAgent', 201), dashboard: handler('dashboard'), settings: handler('settings') };
