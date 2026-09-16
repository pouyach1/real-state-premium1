function slugify(value) {
  return String(value).normalize('NFKD').toLowerCase().trim().replace(/[^a-z0-9\u0600-\u06ff]+/g, '-').replace(/^-+|-+$/g, '');
}
module.exports = slugify;
