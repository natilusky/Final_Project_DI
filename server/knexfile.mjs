// Update with your config settings.
// import dotenv from 'dotenv'

// dotenv.config()


export default {
  development: {
    client: 'pg',
    connection: {
      port: process.env.PORT_DB,
      host: `${process.env.HOST_DB}`,
      user: `${process.env.USER_DB}`,
      password: `${process.env.PASSWORD_DB}`,
      database: `${process.env.DB_NAME}`
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: __dirname + '/knex/migrations',
      loadExtensions: ['.mjs'] // 
    }
  }
};
