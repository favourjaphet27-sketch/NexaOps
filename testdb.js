// testdb.js - Test Supabase database connection
require('dotenv').config();
const { pool, testConnection } = require('./db');

async function runConnectionTest() {
  console.log('🔌 Testing NexaOps database connection...');
  console.log('=====================================');
  
  try {
    // Test the connection
    const success = await testConnection();
    
    if (success) {
      console.log('✅ Database connection test successful!');
      
      // Test a simple query
      const client = await pool.connect();
      const result = await client.query('SELECT version()');
      console.log('📊 PostgreSQL version:', result.rows[0].version.split(' ')[0]);
      client.release();
      
      console.log('=====================================');
      console.log('🎉 Your NexaOps database is ready to use!');
      console.log('Run "node seed.js" to populate with sample data.');
    } else {
      console.log('❌ Database connection test failed!');
      console.log('Please check your DATABASE_URL in the .env file.');
    }
  } catch (err) {
    console.error('❌ Connection test error:', err.message);
    console.error('Please verify your Supabase connection string.');
  } finally {
    // Close the connection pool
    await pool.end();
    console.log('🔌 Connection closed.');
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  runConnectionTest();
}

module.exports = { runConnectionTest };

