const mongoose = require('mongoose');
const siteSettingsSchema = new mongoose.Schema({
  key: { type: String, default: 'default', unique: true },
  stats: { propertiesSold: Number, yearsActive: Number, satisfactionRate: Number, avgSaleDays: Number, pricingAccuracy: Number, returningClients: Number },
  contact: { phone: String, email: String, address: String }
}, { timestamps: true, versionKey: false });
module.exports = mongoose.model('SiteSettings', siteSettingsSchema);
