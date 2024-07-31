const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  ssl: {
      require: true,
      rejectUnauthorized: false 
    }
});

const createUsersTable = `
  CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    isAdmin BOOLEAN,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`

const createAdminTable = `
      CREATE TABLE admin (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) NOT NULL,
        password VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `

const createProductsTable = `
      CREATE TABLE products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        price NUMERIC(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `

async function connectDB() {
    await pool.connect().then(() => {
        console.log('Database connection successful')
    })
        // .then(() => {
        // pool.query(createUsersTable)
        // pool.query(createAdminTable)
        // pool.query(createProductsTable)
        // })
        .catch(err => {
        throw err
    })
    //     .then(() => {
        
    // })
    // try {
    // const client = await pool.connect();
        // await client.query('CREATE DATABASE users_db;');
        // await client.query('CREATE DATABASE admin_db;');
        // await client.query('CREATE DATABASE products_db;');
        


    //     console.log('Database and tables creation successful')
    // } catch (error) {
    //     console.log('Error creating databases and tables', error)
    // } finally {
    //     pool.end()
    // }
}

module.exports = { pool, connectDB };