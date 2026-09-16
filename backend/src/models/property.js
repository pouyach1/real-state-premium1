const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  url: { type: String, required: true },
  type: { type: String, enum: ['image', 'video'], default: 'image' },
  order: { type: Number, default: 0 },
  alt: { type: String, default: '' }
}, { _id: true });

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 180 },
  slug: { type: String, required: true, unique: true, lowercase: true, index: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true, min: 0 },
  currency: { type: String, default: 'IRR' },
  location: { city: String, district: String, coordinates: { lat: Number, lng: Number } },
  specs: { area: Number, bedrooms: Number, bathrooms: Number, yearBuilt: Number, hasPool: Boolean, parking: Number },
  status: { type: String, enum: ['available', 'reserved', 'sold', 'under_construction'], default: 'available', index: true },
  tag: { type: String, enum: ['new', 'exclusive', 'under_construction', null], default: null },
  media: [mediaSchema],
  featured: { type: Boolean, default: false },
  agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  viewsCount: { type: Number, default: 0 },
  inquiriesCount: { type: Number, default: 0 }
}, { timestamps: true, versionKey: false });

module.exports = mongoose.model('Property', propertySchema);
