const authService = require('../services/auth');
const { success } = require('../utils/response');
const env = require('../config/env');
const refreshCookie = { httpOnly: true, secure: env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 7 * 24 * 60 * 60 * 1000 };

async function login(req, res, next) { try { const result = await authService.login(req.body.email, req.body.password); res.cookie('refreshToken', result.refreshToken, refreshCookie); delete result.refreshToken; return success(res, result); } catch (error) { return next(error); } }
async function refresh(req, res, next) { try { const result = await authService.refresh(req.cookies.refreshToken); res.cookie('refreshToken', result.refreshToken, refreshCookie); delete result.refreshToken; return success(res, result); } catch (error) { return next(error); } }
async function logout(req, res, next) { try { await authService.logout(req.cookies.refreshToken); res.clearCookie('refreshToken', { httpOnly: refreshCookie.httpOnly, secure: refreshCookie.secure, sameSite: refreshCookie.sameSite }); return success(res, null, 204); } catch (error) { return next(error); } }
module.exports = { login, refresh, logout };
