const { validateSale } = require('../models/schema');
const { pool } = require('../db');

/**
 * Add a new sale to the database
 * 
 * @param {Object} saleData - Sale information
 * @param {string} saleData.item_name - Name of the item sold
 * @param {number} saleData.amount - Sale amount (must be >= 0)
 * @param {string} saleData.date - Sale date (ISO-8601 format)
 * @param {string} [saleData.customer] - Customer name (optional)
 * @returns {Promise<Object>} Result object with success status and data/error
 */
async function addSale(saleData) {
  // Validate input data
  const validation = validateSale(saleData);
  if (!validation.valid) {
    return {
      success: false,
      error: 'Validation failed',
      details: validation.errors
    };
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO sales (item_name, amount, date, customer)
       VALUES ($1, $2, $3, $4)
       RETURNING id, item_name, amount, date, customer, created_at`,
      [
        saleData.item_name.trim(),
        saleData.amount,
        saleData.date,
        saleData.customer ? saleData.customer.trim() : null
      ]
    );
    
    console.log(`✅ Successfully added sale: ${saleData.item_name} - $${saleData.amount}`);
    return {
      success: true,
      data: rows[0],
      message: 'Sale added successfully'
    };
  } catch (err) {
    console.error('❌ Database error adding sale:', err.message);
    console.error('Error details:', {
      code: err.code,
      detail: err.detail,
      hint: err.hint
    });
    
    return {
      success: false,
      error: 'Failed to add sale to database',
      details: err.message
    };
  }
}

/**
 * Retrieve all sales from the database
 * 
 * @returns {Promise<Array>} Array of all sales records
 */
async function getAllSales() {
  try {
    const { rows } = await pool.query(
      `SELECT id, item_name, amount, date, customer, created_at
       FROM sales
       ORDER BY created_at DESC`
    );
    console.log(`✅ Successfully fetched ${rows.length} sales records`);
    return rows || [];
  } catch (err) {
    console.error('❌ Database error fetching sales:', err.message);
    console.error('Error details:', {
      code: err.code,
      detail: err.detail,
      hint: err.hint
    });
    // Return empty array for graceful error handling
    return [];
  }
}

module.exports = {
  addSale,
  getAllSales
};
