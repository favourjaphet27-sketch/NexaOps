const { db, validateExpense } = require('../models/schema');

/**
 * Add a new expense to the database
 * 
 * @param {Object} expenseData - Expense information
 * @param {string} expenseData.description - Description of the expense
 * @param {number} expenseData.amount - Expense amount (must be >= 0)
 * @param {string} expenseData.date - Expense date (ISO-8601 format)
 * @returns {Promise<Object>} Created expense record with ID
 * @throws {Error} Validation error or database error
 */
async function addExpense(expenseData) {
  // Validate input data
  const validation = validateExpense(expenseData);
  if (!validation.valid) {
    const error = new Error('Validation failed');
    error.validation = true;
    error.errors = validation.errors;
    throw error;
  }

  return new Promise((resolve, reject) => {
    // Use prepared statement for safety against SQL injection
    const stmt = db.prepare(`
      INSERT INTO expenses (description, amount, date)
      VALUES (?, ?, ?)
    `);

    // Execute prepared statement with parameters
    stmt.run([
      expenseData.description.trim(),
      expenseData.amount,
      expenseData.date
    ], function(err) {
      stmt.finalize(); // Clean up prepared statement
      
      if (err) {
        console.error('Database error adding expense:', err);
        reject(new Error('Failed to add expense to database'));
        return;
      }

      // Return the created expense with the generated ID
      resolve({
        id: this.lastID,
        description: expenseData.description.trim(),
        amount: expenseData.amount,
        date: expenseData.date,
        created_at: new Date().toISOString()
      });
    });
  });
}

/**
 * Retrieve all expenses from the database
 * 
 * @returns {Promise<Array>} Array of all expense records
 * @throws {Error} Database error
 */
async function getAllExpenses() {
  return new Promise((resolve, reject) => {
    // Use prepared statement for safety
    const stmt = db.prepare(`
      SELECT id, description, amount, date, created_at
      FROM expenses
      ORDER BY created_at DESC
    `);

    // Execute query and collect all results
    stmt.all([], (err, rows) => {
      stmt.finalize(); // Clean up prepared statement
      
      if (err) {
        console.error('Database error fetching expenses:', err);
        reject(new Error('Failed to fetch expenses from database'));
        return;
      }

      // Return all expense records
      resolve(rows || []);
    });
  });
}

module.exports = {
  addExpense,
  getAllExpenses
};
