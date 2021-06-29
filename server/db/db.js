import knex from 'knex'
import knexfile from './knexfile.js'

const db = knex(knexfile.development)
module.exports = db;