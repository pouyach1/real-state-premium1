const mongoose = require('mongoose');
const leadSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true }, phone: { type: String, required: true, trim: true }, email: { type: String, lowercase: true, trim: true }, message: String,
  propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' }, source: { type: String, enum: ['hero_cta', 'property_card', 'contact_form', 'phone_click'], default: 'contact_form' },
  status: { type: String, enum: ['new', 'contacted', 'qualified', 'closed'], default: 'new', index: true }, assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true, versionKey: false });
module.exports = mongoose.model('Lead', leadSchema);
