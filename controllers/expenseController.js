const { validateExpense } = require('../models/schema');
const { pool } = require('../db');

/**
 * Add a new expense to the database
 * 
 * @param {Object} expenseData - Expense information
 * @param {string} expenseData.description - Description of the expense
 * @param {number} expenseData.amount - Expense amount (must be >= 0)
 * @param {string} expenseData.date - Expense date (ISO-8601 format)
 * @returns {Promise<Object>} Result object with success status and data/error
 */
async function addExpense(expenseData) {
  // Validate input data
  const validation = validateExpense(expenseData);
  if (!validation.valid) {
    return {
      success: false,
      error: 'Validation failed',
      details: validation.errors
    };
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO expenses (description, amount, date)
       VALUES ($1, $2, $3)
       RETURNING id, description, amount, date, created_at`,
      [
        expenseData.description.trim(),
        expenseData.amount,
        expenseData.date
      ]
    );
    
    console.log(`✅ Successfully added expense: ${expenseData.description} - $${expenseData.amount}`);
    return {
      success: true,
      data: rows[0],
      message: 'Expense added successfully'
    };
  } catch (err) {
    console.error('❌ Database error adding expense:', err.message);
    console.error('Error details:', {
      code: err.code,
      detail: err.detail,
      hint: err.hint
    });
    
    return {
      success: false,
      error: 'Failed to add expense to database',
      details: err.message
    };
  }
}

/**
 * Retrieve all expenses from the database
 * 
 * @returns {Promise<Array>} Array of all expense records
 */
async function getAllExpenses() {
  try {
    const { rows } = await pool.query(
      `SELECT id, description, amount, date, created_at
       FROM expenses
       ORDER BY created_at DESC`
    );
    console.log(`✅ Successfully fetched ${rows.length} expense records`);
    return rows || [];
  } catch (err) {
    console.error('❌ Database error fetching expenses:', err.message);
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
  addExpense,
  getAllExpenses
};
