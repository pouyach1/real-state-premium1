const app = require('./app');
const env = require('./config/env');
const { connectDatabase } = require('./config/db');

async function start() {
  await connectDatabase();
  app.listen(env.PORT, () => console.log(`Derakhshan API listening on port ${env.PORT}`));
}

start().catch((error) => {
  console.error('Failed to start API:', error.message);
  process.exitCode = 1;
});
