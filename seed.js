// seed.js - Populate NexaOps database with sample data
require('dotenv').config();
const { pool } = require('./db');

// Sample data for seeding - Updated with requested totals
const sampleSales = [
  {
    item_name: 'Premium Product A',
    amount: 2500.00,
    date: '2024-01-15',
    customer: 'Enterprise Client'
  },
  {
    item_name: 'Standard Product B',
    amount: 1200.00,
    date: '2024-01-14',
    customer: 'Business Customer'
  },
  {
    item_name: 'Basic Product C',
    amount: 500.00,
    date: '2024-01-13',
    customer: 'Individual Buyer'
  }
];

const sampleExpenses = [
  {
    description: 'Office rent and utilities',
    amount: 5000.00,
    date: '2024-01-15'
  },
  {
    description: 'Marketing and advertising',
    amount: 2000.00,
    date: '2024-01-14'
  },
  {
    description: 'Equipment and supplies',
    amount: 1500.00,
    date: '2024-01-13'
  }
];

const sampleInventory = [
  {
    item_name: 'Premium Product A',
    quantity: 10,
    price: 250.00
  },
  {
    item_name: 'Standard Product B',
    quantity: 15,
    price: 80.00
  },
  {
    item_name: 'Basic Product C',
    quantity: 50,
    price: 10.00
  }
];

/**
 * Clear existing data from tables
 */
async function clearTables() {
  try {
    console.log('🧹 Clearing existing data...');
    
    await pool.query('DELETE FROM sales');
    console.log('✅ Cleared sales table');
    
    await pool.query('DELETE FROM expenses');
    console.log('✅ Cleared expenses table');
    
    await pool.query('DELETE FROM inventory');
    console.log('✅ Cleared inventory table');
    
  } catch (err) {
    console.error('❌ Error clearing tables:', err.message);
    throw err;
  }
}

/**
 * Insert sample sales data
 */
async function seedSales() {
  try {
    console.log('📊 Seeding sales data...');
    
    for (const sale of sampleSales) {
      const { rows } = await pool.query(
        `INSERT INTO sales (item_name, amount, date, customer)
         VALUES ($1, $2, $3, $4)
         RETURNING id, item_name, amount, date, customer`,
        [sale.item_name, sale.amount, sale.date, sale.customer]
      );
      console.log(`✅ Added sale: ${sale.item_name} - $${sale.amount}`);
    }
    
    console.log(`✅ Successfully seeded ${sampleSales.length} sales records`);
  } catch (err) {
    console.error('❌ Error seeding sales:', err.message);
    throw err;
  }
}

/**
 * Insert sample expenses data
 */
async function seedExpenses() {
  try {
    console.log('💰 Seeding expenses data...');
    
    for (const expense of sampleExpenses) {
      const { rows } = await pool.query(
        `INSERT INTO expenses (description, amount, date)
         VALUES ($1, $2, $3)
         RETURNING id, description, amount, date`,
        [expense.description, expense.amount, expense.date]
      );
      console.log(`✅ Added expense: ${expense.description} - $${expense.amount}`);
    }
    
    console.log(`✅ Successfully seeded ${sampleExpenses.length} expense records`);
  } catch (err) {
    console.error('❌ Error seeding expenses:', err.message);
    throw err;
  }
}

/**
 * Insert sample inventory data
 */
async function seedInventory() {
  try {
    console.log('📦 Seeding inventory data...');
    
    for (const item of sampleInventory) {
      const { rows } = await pool.query(
        `INSERT INTO inventory (item_name, quantity, price)
         VALUES ($1, $2, $3)
         RETURNING id, item_name, quantity, price`,
        [item.item_name, item.quantity, item.price]
      );
      console.log(`✅ Added inventory item: ${item.item_name} - Qty: ${item.quantity}, Price: $${item.price}`);
    }
    
    console.log(`✅ Successfully seeded ${sampleInventory.length} inventory records`);
  } catch (err) {
    console.error('❌ Error seeding inventory:', err.message);
    throw err;
  }
}

/**
 * Verify seeded data
 */
async function verifySeededData() {
  try {
    console.log('🔍 Verifying seeded data...');
    
    const salesCount = await pool.query('SELECT COUNT(*) FROM sales');
    const expensesCount = await pool.query('SELECT COUNT(*) FROM expenses');
    const inventoryCount = await pool.query('SELECT COUNT(*) FROM inventory');
    
    console.log(`📊 Sales records: ${salesCount.rows[0].count}`);
    console.log(`💰 Expense records: ${expensesCount.rows[0].count}`);
    console.log(`📦 Inventory records: ${inventoryCount.rows[0].count}`);
    
    if (salesCount.rows[0].count == sampleSales.length &&
        expensesCount.rows[0].count == sampleExpenses.length &&
        inventoryCount.rows[0].count == sampleInventory.length) {
      console.log('✅ All data seeded successfully!');
      return true;
    } else {
      console.log('⚠️ Data count mismatch detected');
      return false;
    }
  } catch (err) {
    console.error('❌ Error verifying data:', err.message);
    return false;
  }
}

/**
 * Main seeding function
 */
async function seedDatabase() {
  console.log('🌱 Starting NexaOps database seeding...');
  console.log('=====================================');
  
  try {
    // Test database connection first
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    console.log('✅ Database connection successful');
    console.log(`🕒 Server time: ${result.rows[0].now}`);
    client.release();
    
    // Clear existing data
    await clearTables();
    
    // Seed all tables
    await seedSales();
    await seedExpenses();
    await seedInventory();
    
    // Verify the data
    const success = await verifySeededData();
    
    if (success) {
      console.log('=====================================');
      console.log('🎉 Database seeding completed successfully!');
      console.log('Your NexaOps database is now ready with sample data.');
    } else {
      console.log('=====================================');
      console.log('⚠️ Database seeding completed with warnings.');
    }
    
  } catch (err) {
    console.error('=====================================');
    console.error('❌ Database seeding failed:', err.message);
    console.error('Please check your database connection and try again.');
    process.exit(1);
  } finally {
    // Close the connection pool
    await pool.end();
    console.log('🔌 Database connection closed.');
  }
}

// Run the seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = {
  seedDatabase,
  clearTables,
  seedSales,
  seedExpenses,
  seedInventory,
  verifySeededData
};
