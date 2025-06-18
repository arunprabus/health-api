export default {
  client: 'mysql2',
  connection: process.env.DB_URL || {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
  },
  pool: {
    min: 5,
    max: 20
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: '../migrations'
  },
  acquireConnectionTimeout: 60000,
  timeout: 30000
};