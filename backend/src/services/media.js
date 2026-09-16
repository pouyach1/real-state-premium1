const fs = require('fs/promises');
const path = require('path');
const crypto = require('crypto');
const sharp = require('sharp');
const env = require('../config/env');
const AppError = require('../utils/app-error');

async function savePropertyImage(file) {
  if (!file) throw new AppError('Image file is required', 400, 'FILE_REQUIRED');
  const baseDir = path.resolve(env.UPLOAD_DIR, 'properties', crypto.randomUUID());
  await fs.mkdir(baseDir, { recursive: true });
  const sizes = { thumbnail: 320, medium: 900, original: 1800 };
  const urls = {};
  for (const [name, width] of Object.entries(sizes)) {
    const filename = `${name}.webp`;
    await sharp(file.buffer).resize({ width, withoutEnlargement: true }).webp({ quality: 84 }).toFile(path.join(baseDir, filename));
    urls[name] = `/storage/properties/${path.basename(baseDir)}/${filename}`;
  }
  return urls;
}
module.exports = { savePropertyImage };
