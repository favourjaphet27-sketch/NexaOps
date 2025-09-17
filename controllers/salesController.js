const { db, validateSale } = require('../models/schema');

/**
 * Add a new sale to the database
 * 
 * @param {Object} saleData - Sale information
 * @param {string} saleData.item_name - Name of the item sold
 * @param {number} saleData.amount - Sale amount (must be >= 0)
 * @param {string} saleData.date - Sale date (ISO-8601 format)
 * @param {string} [saleData.customer] - Customer name (optional)
 * @returns {Promise<Object>} Created sale record with ID
 * @throws {Error} Validation error or database error
 */
async function addSale(saleData) {
  // Validate input data
  const validation = validateSale(saleData);
  if (!validation.valid) {
    const error = new Error('Validation failed');
    error.validation = true;
    error.errors = validation.errors;
    throw error;
  }

  return new Promise((resolve, reject) => {
    // Use prepared statement for safety against SQL injection
    const stmt = db.prepare(`
      INSERT INTO sales (item_name, amount, date, customer)
      VALUES (?, ?, ?, ?)
    `);

    // Execute prepared statement with parameters
    stmt.run([
      saleData.item_name.trim(),
      saleData.amount,
      saleData.date,
      saleData.customer ? saleData.customer.trim() : null
    ], function(err) {
      stmt.finalize(); // Clean up prepared statement
      
      if (err) {
        console.error('Database error adding sale:', err);
        reject(new Error('Failed to add sale to database'));
        return;
      }

      // Return the created sale with the generated ID
      resolve({
        id: this.lastID,
        item_name: saleData.item_name.trim(),
        amount: saleData.amount,
        date: saleData.date,
        customer: saleData.customer ? saleData.customer.trim() : null,
        created_at: new Date().toISOString()
      });
    });
  });
}

/**
 * Retrieve all sales from the database
 * 
 * @returns {Promise<Array>} Array of all sales records
 * @throws {Error} Database error
 */
async function getAllSales() {
  return new Promise((resolve, reject) => {
    // Use prepared statement for safety
    const stmt = db.prepare(`
      SELECT id, item_name, amount, date, customer, created_at
      FROM sales
      ORDER BY created_at DESC
    `);

    // Execute query and collect all results
    stmt.all([], (err, rows) => {
      stmt.finalize(); // Clean up prepared statement
      
      if (err) {
        console.error('Database error fetching sales:', err);
        reject(new Error('Failed to fetch sales from database'));
        return;
      }

      // Return all sales records
      resolve(rows || []);
    });
  });
}

module.exports = {
  addSale,
  getAllSales
};
