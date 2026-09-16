const bcrypt = require('bcrypt');
const { connectDatabase } = require('../src/config/db');
const User = require('../src/models/user');
const SiteSettings = require('../src/models/site-settings');

(async () => {
  await connectDatabase();
  const passwordHash = await bcrypt.hash(process.env.SEED_ADMIN_PASSWORD || 'change-this-password', 12);
  await User.updateOne({ email: 'admin@derakhshan.co' }, { $set: { name: 'Derakhshan Admin', email: 'admin@derakhshan.co', passwordHash, role: 'superadmin', isActive: true } }, { upsert: true });
  await SiteSettings.updateOne({ key: 'default' }, { $setOnInsert: { key: 'default', stats: { propertiesSold: 480, yearsActive: 21, satisfactionRate: 98, avgSaleDays: 45, pricingAccuracy: 96, returningClients: 62 }, contact: { phone: '+982100000000', email: 'info@derakhshan.co', address: 'Niavaran, Tehran' } } }, { upsert: true });
  console.log('Seed completed. Set SEED_ADMIN_PASSWORD before production use.');
  process.exit(0);
})().catch((error) => { console.error(error); process.exit(1); });
