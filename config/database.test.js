export default {
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST || 'database',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'health_user',
    password: process.env.DB_PASSWORD || 'health_password',
    database: process.env.DB_NAME || 'health_app_test'
  },
  pool: {
    min: 1,
    max: 5
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: '../migrations'
  },
  seeds: {
    directory: '../seeds/test'
  }
};