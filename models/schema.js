const fs = require('fs');
const path = require('path');
// Validators only. Database moved to Postgres via pg in db.js

// Ensure data directory exists
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
	fs.mkdirSync(dataDir, { recursive: true });
}

// No local SQLite database anymore

// Basic ISO-8601 date (YYYY-MM-DD or full datetime) validator
function isISODateString(value) {
	if (typeof value !== 'string') return false;
	// Accept YYYY-MM-DD or YYYY-MM-DDTHH:MM(:SS)?(Z|±HH:MM)?
	const dateOnly = /^\d{4}-\d{2}-\d{2}$/;
	const dateTime = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?(Z|[+-]\d{2}:\d{2})?$/;
	return dateOnly.test(value) || dateTime.test(value);
}

// Validation helpers
function validateSale(sale) {
	const errors = [];
	if (!sale || typeof sale !== 'object') {
		errors.push('Sale payload must be an object.');
		return { valid: false, errors };
	}
	if (!sale.item_name || typeof sale.item_name !== 'string' || sale.item_name.trim().length === 0) {
		errors.push('item_name is required and must be a non-empty string.');
	}
	if (typeof sale.amount !== 'number' || !Number.isFinite(sale.amount) || sale.amount < 0) {
		errors.push('amount is required and must be a non-negative number.');
	}
	if (!sale.date || !isISODateString(sale.date)) {
		errors.push('date is required and must be ISO-8601 (YYYY-MM-DD or ISO datetime).');
	}
	if (sale.customer != null && (typeof sale.customer !== 'string' || sale.customer.trim().length === 0)) {
		errors.push('customer, if provided, must be a non-empty string.');
	}
	return { valid: errors.length === 0, errors };
}

function validateExpense(expense) {
	const errors = [];
	if (!expense || typeof expense !== 'object') {
		errors.push('Expense payload must be an object.');
		return { valid: false, errors };
	}
	if (!expense.description || typeof expense.description !== 'string' || expense.description.trim().length === 0) {
		errors.push('description is required and must be a non-empty string.');
	}
	if (typeof expense.amount !== 'number' || !Number.isFinite(expense.amount) || expense.amount < 0) {
		errors.push('amount is required and must be a non-negative number.');
	}
	if (!expense.date || !isISODateString(expense.date)) {
		errors.push('date is required and must be ISO-8601 (YYYY-MM-DD or ISO datetime).');
	}
	return { valid: errors.length === 0, errors };
}

function validateInventoryItem(item) {
	const errors = [];
	if (!item || typeof item !== 'object') {
		errors.push('Inventory item payload must be an object.');
		return { valid: false, errors };
	}
	if (!item.item_name || typeof item.item_name !== 'string' || item.item_name.trim().length === 0) {
		errors.push('item_name is required and must be a non-empty string.');
	}
	if (!Number.isInteger(item.quantity) || item.quantity < 0) {
		errors.push('quantity is required and must be a non-negative integer.');
	}
	if (typeof item.price !== 'number' || !Number.isFinite(item.price) || item.price < 0) {
		errors.push('price is required and must be a non-negative number.');
	}
	return { valid: errors.length === 0, errors };
}

// No-op now; schema is managed via schema.sql in Supabase
function initSchema() { return; }

module.exports = {
	initSchema,
	validateSale,
	validateExpense,
	validateInventoryItem,
};


