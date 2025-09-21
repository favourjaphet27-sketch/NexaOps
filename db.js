require('dotenv').config();
const { Pool } = require('pg');

// Validate DATABASE_URL is provided
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is required');
  console.error('Please create a .env file with your Supabase DATABASE_URL');
  console.error('Example: DATABASE_URL=postgresql://username:password@host:port/database');
  process.exit(1);
}

// Create a connection pool using Supabase/Postgres DATABASE_URL
// For Supabase, SSL is required with rejectUnauthorized: false
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
    require: true
  },
  // Connection pool settings for reliability
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 10000, // Return an error after 10 seconds if connection could not be established
  maxUses: 7500, // Close (and replace) a connection after it has been used 7500 times
});

// Test the connection on startup
pool.on('connect', (client) => {
  console.log('✅ Connected to Supabase database');
});

pool.on('error', (err) => {
  console.error('❌ Database connection error:', err);
  // Don't exit the process, let the app handle the error gracefully
});

// Test initial connection
async function testConnection() {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    console.log('🕒 Database server time:', result.rows[0].now);
    client.release();
    return true;
  } catch (err) {
    console.error('❌ Initial database connection test failed:', err.message);
    return false;
  }
}

// Test connection on startup (non-blocking)
testConnection().catch(console.error);

module.exports = { pool, testConnection };


