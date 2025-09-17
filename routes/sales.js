const express = require('express');
const router = express.Router();
const { addSale, getAllSales } = require('../controllers/salesController');

/**
 * POST /api/sales
 * Add a new sale record to the database
 * 
 * @route POST /api/sales
 * @param {Object} req.body - Sale data
 * @param {string} req.body.item_name - Name of the item sold
 * @param {number} req.body.amount - Sale amount (must be >= 0)
 * @param {string} req.body.date - Sale date (ISO-8601 format)
 * @param {string} [req.body.customer] - Customer name (optional)
 * @returns {Object} 201 - Created sale record with ID
 * @returns {Object} 400 - Validation error
 * @returns {Object} 500 - Server error
 */
router.post('/', async (req, res) => {
  try {
    const result = await addSale(req.body);
    res.status(201).json({
      success: true,
      data: result,
      message: 'Sale added successfully'
    });
  } catch (error) {
    if (error.validation) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.errors
      });
    }
    
    console.error('Error adding sale:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add sale',
      message: 'Internal server error'
    });
  }
});

/**
 * GET /api/sales
 * Retrieve all sales from the database
 * 
 * @route GET /api/sales
 * @returns {Object} 200 - Array of all sales
 * @returns {Object} 500 - Server error
 */
router.get('/', async (req, res) => {
  try {
    const sales = await getAllSales();
    res.status(200).json({
      success: true,
      data: sales,
      count: sales.length
    });
  } catch (error) {
    console.error('Error fetching sales:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch sales',
      message: 'Internal server error'
    });
  }
});

module.exports = router;
