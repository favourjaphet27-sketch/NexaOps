const { db, validateInventoryItem } = require('../models/schema');

/**
 * Add a new inventory item to the database
 * 
 * @param {Object} itemData - Inventory item information
 * @param {string} itemData.item_name - Name of the inventory item
 * @param {number} itemData.quantity - Quantity in stock (must be >= 0)
 * @param {number} itemData.price - Price of the item (must be >= 0)
 * @returns {Promise<Object>} Created inventory item with ID
 * @throws {Error} Validation error or database error
 */
async function addItem(itemData) {
  // Validate input data
  const validation = validateInventoryItem(itemData);
  if (!validation.valid) {
    const error = new Error('Validation failed');
    error.validation = true;
    error.errors = validation.errors;
    throw error;
  }

  return new Promise((resolve, reject) => {
    // Use prepared statement for safety against SQL injection
    const stmt = db.prepare(`
      INSERT INTO inventory (item_name, quantity, price)
      VALUES (?, ?, ?)
    `);

    // Execute prepared statement with parameters
    stmt.run([
      itemData.item_name.trim(),
      itemData.quantity,
      itemData.price
    ], function(err) {
      stmt.finalize(); // Clean up prepared statement
      
      if (err) {
        console.error('Database error adding inventory item:', err);
        reject(new Error('Failed to add inventory item to database'));
        return;
      }

      // Return the created inventory item with the generated ID
      resolve({
        id: this.lastID,
        item_name: itemData.item_name.trim(),
        quantity: itemData.quantity,
        price: itemData.price,
        created_at: new Date().toISOString()
      });
    });
  });
}

/**
 * Retrieve all inventory items from the database
 * 
 * @returns {Promise<Array>} Array of all inventory item records
 * @throws {Error} Database error
 */
async function getAllItems() {
  return new Promise((resolve, reject) => {
    // Use prepared statement for safety
    const stmt = db.prepare(`
      SELECT id, item_name, quantity, price, created_at
      FROM inventory
      ORDER BY created_at DESC
    `);

    // Execute query and collect all results
    stmt.all([], (err, rows) => {
      stmt.finalize(); // Clean up prepared statement
      
      if (err) {
        console.error('Database error fetching inventory items:', err);
        reject(new Error('Failed to fetch inventory items from database'));
        return;
      }

      // Return all inventory item records
      resolve(rows || []);
    });
  });
}

module.exports = {
  addItem,
  getAllItems
};
