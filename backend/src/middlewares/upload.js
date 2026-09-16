const multer = require('multer');
const AppError = require('../utils/app-error');

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 15 * 1024 * 1024 }, fileFilter: (req, file, callback) => {
  if (!file.mimetype.startsWith('image/')) return callback(new AppError('Only image files are supported', 400, 'INVALID_FILE_TYPE'));
  callback(null, true);
} });
module.exports = upload;
