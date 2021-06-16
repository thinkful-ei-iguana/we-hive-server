module.exports = {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL,
  TEST_DATABASE_URL:
    process.env.TEST_DATABASE_URL ||
    'postgresql://hive_admin@localhost/we_hive_test',
  JWT_SECRET: process.env.JWT_SECRET || 'change-this-secret',
};
