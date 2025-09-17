const express = require('express');
const router = express.Router();
const { addItem, getAllItems } = require('../controllers/inventoryController');

/**
 * POST /api/inventory
 * Add a new inventory item to the database
 * 
 * @route POST /api/inventory
 * @param {Object} req.body - Inventory item data
 * @param {string} req.body.item_name - Name of the inventory item
 * @param {number} req.body.quantity - Quantity in stock (must be >= 0)
 * @param {number} req.body.price - Price of the item (must be >= 0)
 * @returns {Object} 201 - Created inventory item with ID
 * @returns {Object} 400 - Validation error
 * @returns {Object} 500 - Server error
 */
router.post('/', async (req, res) => {
  try {
    const result = await addItem(req.body);
    res.status(201).json({
      success: true,
      data: result,
      message: 'Inventory item added successfully'
    });
  } catch (error) {
    if (error.validation) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.errors
      });
    }
    
    console.error('Error adding inventory item:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add inventory item',
      message: 'Internal server error'
    });
  }
});

/**
 * GET /api/inventory
 * Retrieve all inventory items from the database
 * 
 * @route GET /api/inventory
 * @returns {Object} 200 - Array of all inventory items
 * @returns {Object} 500 - Server error
 */
router.get('/', async (req, res) => {
  try {
    const items = await getAllItems();
    res.status(200).json({
      success: true,
      data: items,
      count: items.length
    });
  } catch (error) {
    console.error('Error fetching inventory items:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch inventory items',
      message: 'Internal server error'
    });
  }
});

module.exports = router;
