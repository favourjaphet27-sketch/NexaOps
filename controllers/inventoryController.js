const { validateInventoryItem } = require('../models/schema');
const { pool } = require('../db');

/**
 * Add a new inventory item to the database
 * 
 * @param {Object} itemData - Inventory item information
 * @param {string} itemData.item_name - Name of the inventory item
 * @param {number} itemData.quantity - Quantity in stock (must be >= 0)
 * @param {number} itemData.price - Price of the item (must be >= 0)
 * @returns {Promise<Object>} Result object with success status and data/error
 */
async function addItem(itemData) {
  // Validate input data
  const validation = validateInventoryItem(itemData);
  if (!validation.valid) {
    return {
      success: false,
      error: 'Validation failed',
      details: validation.errors
    };
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO inventory (item_name, quantity, price)
       VALUES ($1, $2, $3)
       RETURNING id, item_name, quantity, price, created_at`,
      [
        itemData.item_name.trim(),
        itemData.quantity,
        itemData.price
      ]
    );
    
    console.log(`✅ Successfully added inventory item: ${itemData.item_name} - Qty: ${itemData.quantity}, Price: $${itemData.price}`);
    return {
      success: true,
      data: rows[0],
      message: 'Inventory item added successfully'
    };
  } catch (err) {
    console.error('❌ Database error adding inventory item:', err.message);
    console.error('Error details:', {
      code: err.code,
      detail: err.detail,
      hint: err.hint
    });
    
    return {
      success: false,
      error: 'Failed to add inventory item to database',
      details: err.message
    };
  }
}

/**
 * Retrieve all inventory items from the database
 * 
 * @returns {Promise<Array>} Array of all inventory item records
 */
async function getAllItems() {
  try {
    const { rows } = await pool.query(
      `SELECT id, item_name, quantity, price, created_at
       FROM inventory
       ORDER BY created_at DESC`
    );
    console.log(`✅ Successfully fetched ${rows.length} inventory items`);
    return rows || [];
  } catch (err) {
    console.error('❌ Database error fetching inventory items:', err.message);
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
  addItem,
  getAllItems
};
