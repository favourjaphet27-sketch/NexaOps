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
    
    if (result.success) {
      res.status(201).json(result);
    } else {
      // Handle validation errors
      if (result.error === 'Validation failed') {
        res.status(400).json(result);
      } else {
        // Handle database errors
        res.status(500).json(result);
      }
    }
  } catch (error) {
    console.error('Unexpected error in sales route:', error);
    res.status(500).json({
      success: false,
      error: 'Unexpected server error',
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
