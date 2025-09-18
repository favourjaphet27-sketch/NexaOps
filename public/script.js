// NexaOps Frontend JavaScript
// Handles API interactions and dynamic UI updates

// API base URL - adjust if running on different port
const API_BASE = '/api';

// Utility function to show messages to user
function showMessage(message, type = 'success') {
    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = type;
    messageDiv.textContent = message;
    
    // Insert at top of container
    const container = document.querySelector('.container');
    container.insertBefore(messageDiv, container.firstChild);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.parentNode.removeChild(messageDiv);
        }
    }, 3000);
}

// Utility function to format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Utility function to format date
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Sales API functions
async function addSale(saleData) {
    try {
        const response = await fetch(`${API_BASE}/sales`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(saleData)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showMessage('Sale added successfully!', 'success');
            loadSales(); // Refresh the sales list
            return result;
        } else {
            // Handle validation errors
            if (result.details && Array.isArray(result.details)) {
                showMessage(`Validation error: ${result.details.join(', ')}`, 'error');
            } else {
                showMessage(result.error || 'Failed to add sale', 'error');
            }
        }
    } catch (error) {
        console.error('Error adding sale:', error);
        showMessage('Network error: Could not add sale', 'error');
    }
}

async function loadSales() {
    const resultsDiv = document.getElementById('salesResults');
    resultsDiv.innerHTML = '<div class="loading">Loading sales...</div>';
    
    try {
        const response = await fetch(`${API_BASE}/sales`);
        const result = await response.json();
        
        if (response.ok) {
            displaySales(result.data);
        } else {
            resultsDiv.innerHTML = '<div class="error">Failed to load sales</div>';
        }
    } catch (error) {
        console.error('Error loading sales:', error);
        resultsDiv.innerHTML = '<div class="error">Network error: Could not load sales</div>';
    }
}

function displaySales(sales) {
    const resultsDiv = document.getElementById('salesResults');
    
    if (!sales || sales.length === 0) {
        resultsDiv.innerHTML = '<div class="empty">No sales recorded yet</div>';
        return;
    }
    
    // Create HTML for each sale
    const salesHTML = sales.map(sale => `
        <div class="item">
            <h3>${sale.item_name}</h3>
            <p><strong>Amount:</strong> ${formatCurrency(sale.amount)}</p>
            <p><strong>Date:</strong> ${formatDate(sale.date)}</p>
            ${sale.customer ? `<p><strong>Customer:</strong> ${sale.customer}</p>` : ''}
            <p><strong>Added:</strong> ${formatDate(sale.created_at)}</p>
        </div>
    `).join('');
    
    resultsDiv.innerHTML = salesHTML;
}

// Expenses API functions
async function addExpense(expenseData) {
    try {
        const response = await fetch(`${API_BASE}/expenses`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(expenseData)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showMessage('Expense added successfully!', 'success');
            loadExpenses(); // Refresh the expenses list
            return result;
        } else {
            // Handle validation errors
            if (result.details && Array.isArray(result.details)) {
                showMessage(`Validation error: ${result.details.join(', ')}`, 'error');
            } else {
                showMessage(result.error || 'Failed to add expense', 'error');
            }
        }
    } catch (error) {
        console.error('Error adding expense:', error);
        showMessage('Network error: Could not add expense', 'error');
    }
}

async function loadExpenses() {
    const resultsDiv = document.getElementById('expensesResults');
    resultsDiv.innerHTML = '<div class="loading">Loading expenses...</div>';
    
    try {
        const response = await fetch(`${API_BASE}/expenses`);
        const result = await response.json();
        
        if (response.ok) {
            displayExpenses(result.data);
        } else {
            resultsDiv.innerHTML = '<div class="error">Failed to load expenses</div>';
        }
    } catch (error) {
        console.error('Error loading expenses:', error);
        resultsDiv.innerHTML = '<div class="error">Network error: Could not load expenses</div>';
    }
}

function displayExpenses(expenses) {
    const resultsDiv = document.getElementById('expensesResults');
    
    if (!expenses || expenses.length === 0) {
        resultsDiv.innerHTML = '<div class="empty">No expenses recorded yet</div>';
        return;
    }
    
    // Create HTML for each expense
    const expensesHTML = expenses.map(expense => `
        <div class="item">
            <h3>${expense.description}</h3>
            <p><strong>Amount:</strong> ${formatCurrency(expense.amount)}</p>
            <p><strong>Date:</strong> ${formatDate(expense.date)}</p>
            <p><strong>Added:</strong> ${formatDate(expense.created_at)}</p>
        </div>
    `).join('');
    
    resultsDiv.innerHTML = expensesHTML;
}

// Inventory API functions
async function addInventoryItem(itemData) {
    try {
        const response = await fetch(`${API_BASE}/inventory`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(itemData)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showMessage('Inventory item added successfully!', 'success');
            loadInventory(); // Refresh the inventory list
            return result;
        } else {
            // Handle validation errors
            if (result.details && Array.isArray(result.details)) {
                showMessage(`Validation error: ${result.details.join(', ')}`, 'error');
            } else {
                showMessage(result.error || 'Failed to add inventory item', 'error');
            }
        }
    } catch (error) {
        console.error('Error adding inventory item:', error);
        showMessage('Network error: Could not add inventory item', 'error');
    }
}

async function loadInventory() {
    const resultsDiv = document.getElementById('inventoryResults');
    resultsDiv.innerHTML = '<div class="loading">Loading inventory...</div>';
    
    try {
        const response = await fetch(`${API_BASE}/inventory`);
        const result = await response.json();
        
        if (response.ok) {
            displayInventory(result.data);
        } else {
            resultsDiv.innerHTML = '<div class="error">Failed to load inventory</div>';
        }
    } catch (error) {
        console.error('Error loading inventory:', error);
        resultsDiv.innerHTML = '<div class="error">Network error: Could not load inventory</div>';
    }
}

function displayInventory(items) {
    const resultsDiv = document.getElementById('inventoryResults');
    
    if (!items || items.length === 0) {
        resultsDiv.innerHTML = '<div class="empty">No inventory items yet</div>';
        return;
    }
    
    // Create HTML for each inventory item
    const inventoryHTML = items.map(item => `
        <div class="item">
            <h3>${item.item_name}</h3>
            <p><strong>Quantity:</strong> ${item.quantity}</p>
            <p><strong>Price:</strong> ${formatCurrency(item.price)}</p>
            <p><strong>Total Value:</strong> ${formatCurrency(item.quantity * item.price)}</p>
            <p><strong>Added:</strong> ${formatDate(item.created_at)}</p>
        </div>
    `).join('');
    
    resultsDiv.innerHTML = inventoryHTML;
}

// Form submission handlers
document.addEventListener('DOMContentLoaded', function() {
    // Set today's date as default for date inputs
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('saleDate').value = today;
    document.getElementById('expenseDate').value = today;
    
    // Sales form submission
    document.getElementById('salesForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const saleData = {
            item_name: formData.get('item_name'),
            amount: parseFloat(formData.get('amount')),
            date: formData.get('date'),
            customer: formData.get('customer') || null
        };
        
        // Clear form after submission
        this.reset();
        document.getElementById('saleDate').value = today;
        
        addSale(saleData);
    });
    
    // Expenses form submission
    document.getElementById('expensesForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const expenseData = {
            description: formData.get('description'),
            amount: parseFloat(formData.get('amount')),
            date: formData.get('date')
        };
        
        // Clear form after submission
        this.reset();
        document.getElementById('expenseDate').value = today;
        
        addExpense(expenseData);
    });
    
    // Inventory form submission
    document.getElementById('inventoryForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const itemData = {
            item_name: formData.get('item_name'),
            quantity: parseInt(formData.get('quantity')),
            price: parseFloat(formData.get('price'))
        };
        
        // Clear form after submission
        this.reset();
        
        addInventoryItem(itemData);
    });
    
    // Load initial data when page loads
    loadSales();
    loadExpenses();
    loadInventory();
});
