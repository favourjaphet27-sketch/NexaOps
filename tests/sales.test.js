const request = require('supertest');
const express = require('express');
const salesRoutes = require('../routes/sales');

// Mock the sales controller to isolate route testing
jest.mock('../controllers/salesController', () => ({
  addSale: jest.fn(),
  getAllSales: jest.fn()
}));

const { addSale, getAllSales } = require('../controllers/salesController');

// Create Express app for testing
const app = express();
app.use(express.json());
app.use('/api/sales', salesRoutes);

describe('Sales API Routes', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('POST /api/sales', () => {
    it('should add a new sale successfully', async () => {
      // Arrange: Mock successful sale creation
      const mockSaleData = {
        item_name: 'Test Product',
        amount: 25.99,
        date: '2024-01-15',
        customer: 'John Doe'
      };
      
      const mockCreatedSale = {
        id: 1,
        item_name: 'Test Product',
        amount: 25.99,
        date: '2024-01-15',
        customer: 'John Doe',
        created_at: '2024-01-15T10:30:00.000Z'
      };

      // Mock the controller function to return successful result
      addSale.mockResolvedValue(mockCreatedSale);

      // Act: Send POST request to create a sale
      const response = await request(app)
        .post('/api/sales')
        .send(mockSaleData)
        .expect(201);

      // Assert: Verify response structure and data
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockCreatedSale);
      expect(response.body.message).toBe('Sale added successfully');
      
      // Verify controller was called with correct data
      expect(addSale).toHaveBeenCalledWith(mockSaleData);
      expect(addSale).toHaveBeenCalledTimes(1);
    });

    it('should return 400 for validation errors', async () => {
      // Arrange: Mock validation error
      const invalidSaleData = {
        item_name: '', // Invalid: empty string
        amount: -10,   // Invalid: negative amount
        date: 'invalid-date' // Invalid: bad date format
      };

      const validationError = new Error('Validation failed');
      validationError.validation = true;
      validationError.errors = [
        'item_name is required and must be a non-empty string.',
        'amount is required and must be a non-negative number.',
        'date is required and must be ISO-8601 (YYYY-MM-DD or ISO datetime).'
      ];

      // Mock controller to throw validation error
      addSale.mockRejectedValue(validationError);

      // Act: Send POST request with invalid data
      const response = await request(app)
        .post('/api/sales')
        .send(invalidSaleData)
        .expect(400);

      // Assert: Verify error response structure
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Validation failed');
      expect(response.body.details).toEqual(validationError.errors);
      
      // Verify controller was called with invalid data
      expect(addSale).toHaveBeenCalledWith(invalidSaleData);
    });

    it('should return 500 for server errors', async () => {
      // Arrange: Mock server error
      const mockSaleData = {
        item_name: 'Test Product',
        amount: 25.99,
        date: '2024-01-15'
      };

      const serverError = new Error('Database connection failed');
      // Mock controller to throw non-validation error
      addSale.mockRejectedValue(serverError);

      // Act: Send POST request
      const response = await request(app)
        .post('/api/sales')
        .send(mockSaleData)
        .expect(500);

      // Assert: Verify error response structure
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Failed to add sale');
      expect(response.body.message).toBe('Internal server error');
      
      // Verify controller was called
      expect(addSale).toHaveBeenCalledWith(mockSaleData);
    });

    it('should handle sale without customer (optional field)', async () => {
      // Arrange: Mock sale without customer field
      const mockSaleData = {
        item_name: 'Test Product',
        amount: 15.50,
        date: '2024-01-15'
        // customer field omitted (should be optional)
      };

      const mockCreatedSale = {
        id: 2,
        item_name: 'Test Product',
        amount: 15.50,
        date: '2024-01-15',
        customer: null,
        created_at: '2024-01-15T10:30:00.000Z'
      };

      addSale.mockResolvedValue(mockCreatedSale);

      // Act: Send POST request without customer
      const response = await request(app)
        .post('/api/sales')
        .send(mockSaleData)
        .expect(201);

      // Assert: Verify successful creation without customer
      expect(response.body.success).toBe(true);
      expect(response.body.data.customer).toBeNull();
      expect(addSale).toHaveBeenCalledWith(mockSaleData);
    });
  });

  describe('GET /api/sales', () => {
    it('should return all sales successfully', async () => {
      // Arrange: Mock sales data
      const mockSales = [
        {
          id: 1,
          item_name: 'Product A',
          amount: 25.99,
          date: '2024-01-15',
          customer: 'John Doe',
          created_at: '2024-01-15T10:30:00.000Z'
        },
        {
          id: 2,
          item_name: 'Product B',
          amount: 15.50,
          date: '2024-01-14',
          customer: null,
          created_at: '2024-01-14T09:15:00.000Z'
        }
      ];

      // Mock controller to return sales array
      getAllSales.mockResolvedValue(mockSales);

      // Act: Send GET request to fetch all sales
      const response = await request(app)
        .get('/api/sales')
        .expect(200);

      // Assert: Verify response structure and data
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockSales);
      expect(response.body.count).toBe(2);
      expect(Array.isArray(response.body.data)).toBe(true);
      
      // Verify controller was called
      expect(getAllSales).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no sales exist', async () => {
      // Arrange: Mock empty sales array
      getAllSales.mockResolvedValue([]);

      // Act: Send GET request when no sales exist
      const response = await request(app)
        .get('/api/sales')
        .expect(200);

      // Assert: Verify empty response
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual([]);
      expect(response.body.count).toBe(0);
      expect(Array.isArray(response.body.data)).toBe(true);
      
      // Verify controller was called
      expect(getAllSales).toHaveBeenCalledTimes(1);
    });

    it('should return 500 for server errors', async () => {
      // Arrange: Mock server error
      const serverError = new Error('Database query failed');
      getAllSales.mockRejectedValue(serverError);

      // Act: Send GET request
      const response = await request(app)
        .get('/api/sales')
        .expect(500);

      // Assert: Verify error response structure
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Failed to fetch sales');
      expect(response.body.message).toBe('Internal server error');
      
      // Verify controller was called
      expect(getAllSales).toHaveBeenCalledTimes(1);
    });
  });
});
