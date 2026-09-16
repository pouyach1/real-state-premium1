const AppError = require('../utils/app-error');

function validate(schema, source = 'body') {
  return (req, res, next) => {
    const { value, error } = schema.validate(req[source], { abortEarly: false, stripUnknown: true });
    if (error) return next(new AppError('Validation failed', 400, 'VALIDATION_ERROR', error.details.map((item) => ({ field: item.path.join('.'), message: item.message }))));
    req[source] = value;
    next();
  };
}

module.exports = validate;
