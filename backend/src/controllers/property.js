const propertyService = require('../services/property');
const { success } = require('../utils/response');

async function list(req, res, next) { try { return success(res, await propertyService.listPublic(req.query)); } catch (error) { return next(error); } }
async function getBySlug(req, res, next) { try { return success(res, await propertyService.getPublicBySlug(req.params.slug)); } catch (error) { return next(error); } }
async function create(req, res, next) { try { return success(res, await propertyService.create(req.body), 201); } catch (error) { return next(error); } }
async function update(req, res, next) { try { return success(res, await propertyService.update(req.params.id, req.body)); } catch (error) { return next(error); } }
async function remove(req, res, next) { try { return success(res, await propertyService.remove(req.params.id)); } catch (error) { return next(error); } }
async function addMedia(req, res, next) { try { return success(res, await propertyService.addMedia(req.params.id, req.file, req.body), 201); } catch (error) { return next(error); } }
module.exports = { list, getBySlug, create, update, remove, addMedia };
