const bcrypt = require('bcrypt');
const User = require('../models/user');
const AppError = require('../utils/app-error');
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../utils/jwt');

async function login(email, password) {
  const user = await User.findOne({ email: email.toLowerCase(), isActive: true }).select('+passwordHash +refreshTokenHash');
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
  const payload = { sub: user._id.toString(), role: user.role, email: user.email };
  const accessToken = signAccessToken(payload); const refreshToken = signRefreshToken({ sub: payload.sub });
  user.refreshTokenHash = await bcrypt.hash(refreshToken, 12); await user.save({ validateBeforeSave: false });
  return { user: { id: user._id, name: user.name, email: user.email, role: user.role }, accessToken, refreshToken };
}
async function refresh(token) {
  if (!token) throw new AppError('Refresh token required', 401, 'UNAUTHORIZED');
  let payload; try { payload = verifyRefreshToken(token); } catch { throw new AppError('Invalid refresh token', 401, 'UNAUTHORIZED'); }
  const user = await User.findOne({ _id: payload.sub, isActive: true }).select('+refreshTokenHash');
  if (!user || !user.refreshTokenHash || !(await bcrypt.compare(token, user.refreshTokenHash))) throw new AppError('Refresh token revoked', 401, 'UNAUTHORIZED');
  const accessToken = signAccessToken({ sub: user._id.toString(), role: user.role, email: user.email });
  const refreshToken = signRefreshToken({ sub: user._id.toString() });
  user.refreshTokenHash = await bcrypt.hash(refreshToken, 12); await user.save({ validateBeforeSave: false });
  return { accessToken, refreshToken };
}
async function logout(token) {
  if (!token) return;
  try { const payload = verifyRefreshToken(token); await User.findByIdAndUpdate(payload.sub, { $unset: { refreshTokenHash: 1 } }); } catch { /* revoked or expired tokens are already logged out */ }
}
module.exports = { login, refresh, logout };
