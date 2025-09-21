require('dotenv').config();
const express = require('express');
const path = require('path');

// Import route modules
const salesRoutes = require('./routes/sales');
const expensesRoutes = require('./routes/expenses');
const inventoryRoutes = require('./routes/inventory');
const notificationsRoutes = require('./routes/notifications');

// Create Express application
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Serve static files from public directory
app.use(express.static('public'));

// API routes
app.use('/api/sales', salesRoutes);
app.use('/api/expenses', expensesRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/notifications', notificationsRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'NexaOps API is running',
        timestamp: new Date().toISOString()
    });
});

// Catch-all route for SPA (serve index.html for any non-API routes)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Initialize and start server
async function startServer() {
    try {
        // Start the server
        app.listen(PORT, () => {
            console.log(`🚀 NexaOps server running on http://localhost:${PORT}`);
            console.log(`📱 Frontend available at http://localhost:${PORT}`);
            console.log(`🔗 API endpoints available at http://localhost:${PORT}/api`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down NexaOps server...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Shutting down NexaOps server...');
    process.exit(0);
});

// Start the server
startServer();
