const mongoose = require('mongoose');
const testimonialSchema = new mongoose.Schema({ authorName: { type: String, required: true }, authorRole: { type: String, required: true }, quote: { type: String, required: true }, rating: { type: Number, min: 1, max: 5 }, isPublished: { type: Boolean, default: false } }, { timestamps: true, versionKey: false });
module.exports = mongoose.model('Testimonial', testimonialSchema);
