const assert = require('node:assert/strict');
const fs = require('fs/promises');
const path = require('path');
const sharp = require('sharp');
const bcrypt = require('bcrypt');
const { MongoMemoryServer } = require('mongodb-memory-server');

process.env.NODE_ENV = 'test';
process.env.PORT = '0';
process.env.JWT_ACCESS_SECRET = 'test-access-secret-that-is-long-enough-32';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-that-is-long-enough-32';
process.env.CORS_ORIGIN = 'http://localhost:5500,http://localhost:4173';
process.env.UPLOAD_DIR = path.join(__dirname, '..', `.tmp-test-uploads-${process.pid}`);

async function run() {
  const mongo = await MongoMemoryServer.create({ binary: { version: '7.0.24' }, instance: { port: 0, launchTimeout: 30000 } });
  process.env.MONGO_URI = mongo.getUri();
  const request = require('supertest');
  const app = require('../src/app');
  const { connectDatabase, disconnectDatabase } = require('../src/config/db');
  const User = require('../src/models/user');
  const Property = require('../src/models/property');
  await connectDatabase();

  try {
    const passwordHash = await bcrypt.hash('CorrectPassword123!', 10);
    await User.create({ name: 'Integration Admin', email: 'admin@test.com', passwordHash, role: 'superadmin' });

    const login = await request(app).post('/api/auth/login').send({ email: 'admin@test.com', password: 'CorrectPassword123!' });
    assert.equal(login.status, 200);
    assert.ok(login.body.data.accessToken);
    assert.ok(login.headers['set-cookie']);
    const accessToken = login.body.data.accessToken;
    const refreshCookie = login.headers['set-cookie'][0].split(';')[0];

    const corsAllowed = await request(app).options('/api/health').set('Origin', 'http://localhost:5500');
    assert.equal(corsAllowed.headers['access-control-allow-origin'], 'http://localhost:5500');
    const corsBlocked = await request(app).options('/api/health').set({ Origin: 'https://evil.example', 'Access-Control-Request-Method': 'GET' });
    assert.equal(corsBlocked.headers['access-control-allow-origin'], undefined);

    const created = await request(app).post('/api/admin/properties').set('Authorization', `Bearer ${accessToken}`).send({
      title: 'Integration Glass Villa', price: 185, location: { city: 'Tehran', district: 'Lavasan' }, specs: { area: 620, bedrooms: 4 }, status: 'available'
    });
    assert.equal(created.status, 201);
    assert.equal(created.body.data.slug, 'integration-glass-villa');
    const propertyId = created.body.data._id;

    const listing = await request(app).get('/api/properties?limit=1&district=Lavasan&status=available');
    assert.equal(listing.status, 200);
    assert.equal(listing.body.data.items.length, 1);
    assert.equal(listing.body.meta.pages, 1);

    const png = await sharp({ create: { width: 1200, height: 800, channels: 3, background: '#7dd3fc' } }).png().toBuffer();
    const upload = await request(app).post(`/api/admin/properties/${propertyId}/media`).set('Authorization', `Bearer ${accessToken}`).set('Cookie', refreshCookie).attach('file', png, { filename: 'villa.png', contentType: 'image/png' });
    assert.equal(upload.status, 201);
    for (const [name, url] of Object.entries(upload.body.data.variants)) {
      const filePath = path.join(process.env.UPLOAD_DIR, url.replace('/storage/', ''));
      const metadata = await sharp(filePath).metadata();
      assert.ok(metadata.width <= ({ thumbnail: 320, medium: 900, original: 1800 }[name]));
    }
    const saved = await Property.findById(propertyId).lean();
    assert.equal(saved.media.length, 1);

    const refreshed = await request(app).post('/api/auth/refresh').set('Cookie', refreshCookie);
    assert.equal(refreshed.status, 200);
    assert.ok(refreshed.body.data.accessToken);
    const loggedOut = await request(app).post('/api/auth/logout').set('Cookie', refreshed.headers['set-cookie'][0].split(';')[0]);
    assert.equal(loggedOut.status, 204);

    console.log(JSON.stringify({ login: 'ok', cors: 'ok', property: 'ok', pagination: 'ok', uploadVariants: 'ok', refreshLogout: 'ok' }));
  } finally {
    await disconnectDatabase();
    try { await fs.rm(process.env.UPLOAD_DIR, { recursive: true, force: true, maxRetries: 5, retryDelay: 250 }); } catch (error) { if (error.code !== 'EBUSY') throw error; }
    await mongo.stop();
  }
}

run().catch((error) => { console.error(error); process.exitCode = 1; });
