const express = require('express');
const router = express.Router();
const { addExpense, getAllExpenses } = require('../controllers/expenseController');

/**
 * POST /api/expenses
 * Add a new expense record to the database
 * 
 * @route POST /api/expenses
 * @param {Object} req.body - Expense data
 * @param {string} req.body.description - Description of the expense
 * @param {number} req.body.amount - Expense amount (must be >= 0)
 * @param {string} req.body.date - Expense date (ISO-8601 format)
 * @returns {Object} 201 - Created expense record with ID
 * @returns {Object} 400 - Validation error
 * @returns {Object} 500 - Server error
 */
router.post('/', async (req, res) => {
  try {
    const result = await addExpense(req.body);
    res.status(201).json({
      success: true,
      data: result,
      message: 'Expense added successfully'
    });
  } catch (error) {
    if (error.validation) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.errors
      });
    }
    
    console.error('Error adding expense:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add expense',
      message: 'Internal server error'
    });
  }
});

/**
 * GET /api/expenses
 * Retrieve all expenses from the database
 * 
 * @route GET /api/expenses
 * @returns {Object} 200 - Array of all expenses
 * @returns {Object} 500 - Server error
 */
router.get('/', async (req, res) => {
  try {
    const expenses = await getAllExpenses();
    res.status(200).json({
      success: true,
      data: expenses,
      count: expenses.length
    });
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch expenses',
      message: 'Internal server error'
    });
  }
});

module.exports = router;
