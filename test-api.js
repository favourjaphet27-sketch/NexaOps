// test-api.js - Test NexaOps API endpoints
const http = require('http');

const BASE_URL = 'http://localhost:3000';

/**
 * Make HTTP request
 */
function makeRequest(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

/**
 * Test health endpoint
 */
async function testHealth() {
  console.log('🏥 Testing health endpoint...');
  try {
    const response = await makeRequest('/api/health');
    if (response.status === 200 && response.data.status === 'OK') {
      console.log('✅ Health check passed');
      return true;
    } else {
      console.log('❌ Health check failed:', response.data);
      return false;
    }
  } catch (err) {
    console.log('❌ Health check error:', err.message);
    return false;
  }
}

/**
 * Test sales endpoints
 */
async function testSales() {
  console.log('💰 Testing sales endpoints...');
  try {
    // Test GET sales
    const getResponse = await makeRequest('/api/sales');
    if (getResponse.status === 200) {
      console.log(`✅ GET /api/sales - Found ${getResponse.data.data.length} sales`);
    } else {
      console.log('❌ GET /api/sales failed:', getResponse.data);
    }

    // Test POST sales
    const newSale = {
      item_name: 'Test Product',
      amount: 29.99,
      date: '2024-01-20',
      customer: 'Test Customer'
    };
    
    const postResponse = await makeRequest('/api/sales', 'POST', newSale);
    if (postResponse.status === 201 && postResponse.data.success) {
      console.log('✅ POST /api/sales - Sale added successfully');
    } else {
      console.log('❌ POST /api/sales failed:', postResponse.data);
    }
  } catch (err) {
    console.log('❌ Sales test error:', err.message);
  }
}

/**
 * Test expenses endpoints
 */
async function testExpenses() {
  console.log('💸 Testing expenses endpoints...');
  try {
    // Test GET expenses
    const getResponse = await makeRequest('/api/expenses');
    if (getResponse.status === 200) {
      console.log(`✅ GET /api/expenses - Found ${getResponse.data.data.length} expenses`);
    } else {
      console.log('❌ GET /api/expenses failed:', getResponse.data);
    }

    // Test POST expenses
    const newExpense = {
      description: 'Test Expense',
      amount: 15.50,
      date: '2024-01-20'
    };
    
    const postResponse = await makeRequest('/api/expenses', 'POST', newExpense);
    if (postResponse.status === 201 && postResponse.data.success) {
      console.log('✅ POST /api/expenses - Expense added successfully');
    } else {
      console.log('❌ POST /api/expenses failed:', postResponse.data);
    }
  } catch (err) {
    console.log('❌ Expenses test error:', err.message);
  }
}

/**
 * Test inventory endpoints
 */
async function testInventory() {
  console.log('📦 Testing inventory endpoints...');
  try {
    // Test GET inventory
    const getResponse = await makeRequest('/api/inventory');
    if (getResponse.status === 200) {
      console.log(`✅ GET /api/inventory - Found ${getResponse.data.data.length} inventory items`);
    } else {
      console.log('❌ GET /api/inventory failed:', getResponse.data);
    }

    // Test POST inventory
    const newItem = {
      item_name: 'Test Item',
      quantity: 10,
      price: 19.99
    };
    
    const postResponse = await makeRequest('/api/inventory', 'POST', newItem);
    if (postResponse.status === 201 && postResponse.data.success) {
      console.log('✅ POST /api/inventory - Inventory item added successfully');
    } else {
      console.log('❌ POST /api/inventory failed:', postResponse.data);
    }
  } catch (err) {
    console.log('❌ Inventory test error:', err.message);
  }
}

/**
 * Main test function
 */
async function runTests() {
  console.log('🧪 Starting NexaOps API Tests...');
  console.log('=====================================');
  
  try {
    // Test health endpoint
    const healthOk = await testHealth();
    if (!healthOk) {
      console.log('❌ Server is not running. Please start the server with: npm start');
      return;
    }

    console.log('');

    // Test all endpoints
    await testSales();
    console.log('');
    await testExpenses();
    console.log('');
    await testInventory();

    console.log('=====================================');
    console.log('🎉 API tests completed!');
    console.log('If you see any ❌ errors above, check your database connection.');
    
  } catch (err) {
    console.error('❌ Test suite error:', err.message);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests();
}

module.exports = { runTests };
