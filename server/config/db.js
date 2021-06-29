import knex from 'knex'
import dotenv from 'dotenv'

dotenv.config()

const connectDB = knex({
        client: 'pg',
        connection: {
            port: process.env.PORT_DB,
            host: `${process.env.HOST_DB}`,
            user: `${process.env.USER_DB}`,
            password: `${process.env.PASSWORD_DB}`,
            database: `${process.env.DB_NAME}`
        }
})

  export default connectDB