const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 120 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  passwordHash: { type: String, required: true, select: false },
  role: { type: String, enum: ['superadmin', 'admin', 'agent'], default: 'agent' },
  avatarUrl: String,
  phone: String,
  refreshTokenHash: { type: String, select: false },
  isActive: { type: Boolean, default: true }
}, { timestamps: true, versionKey: false });

module.exports = mongoose.model('User', userSchema);
