# NexaOps Setup Guide

## 🚀 Quick Start

### 1. Database Setup (Supabase)

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Wait for the project to be ready

2. **Get Your Connection String**
   - Go to **Settings** → **Database**
   - Copy the **Connection string** (URI format)
   - It should look like: `postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres`

3. **Update Your .env File**
   ```bash
   # Edit your .env file
   DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
   ```

4. **Create Database Tables**
   - Go to **SQL Editor** in your Supabase dashboard
   - Copy and paste the contents of `schema.sql`
   - Click **Run** to create the tables

### 2. Test Your Setup

```bash
# Test database connection
npm run test-db

# If connection is successful, seed with sample data
npm run seed

# Start the application
npm start
```

### 3. Verify Everything Works

1. **Check the health endpoint**: `http://localhost:3000/api/health`
2. **Test the API endpoints**:
   - `GET http://localhost:3000/api/sales`
   - `GET http://localhost:3000/api/expenses`
   - `GET http://localhost:3000/api/inventory`

## 🔧 Troubleshooting

### Database Connection Issues

**Error: `getaddrinfo ENOTFOUND`**
- Your Supabase project might be paused or deleted
- Check your project status at [supabase.com](https://supabase.com)
- Verify your connection string is correct

**Error: `SSL connection required`**
- Make sure you're using the correct connection string format
- The connection string should include SSL parameters

**Error: `Authentication failed`**
- Check your password in the connection string
- Make sure your Supabase project is active

### Common Solutions

1. **Refresh your connection string** from Supabase dashboard
2. **Check if your project is paused** - resume it if needed
3. **Verify your .env file** has the correct DATABASE_URL
4. **Run the database test**: `npm run test-db`

## 📁 Project Structure

```
NexaOps/
├── controllers/          # Business logic
│   ├── salesController.js
│   ├── expenseController.js
│   └── inventoryController.js
├── routes/              # API routes
│   ├── sales.js
│   ├── expenses.js
│   └── inventory.js
├── models/              # Data validation
│   └── schema.js
├── public/              # Frontend files
├── db.js               # Database connection
├── server.js           # Main server file
├── seed.js             # Sample data script
├── testdb.js           # Database test script
├── schema.sql          # Database schema
└── .env                # Environment variables
```

## 🎯 API Endpoints

### Sales
- `GET /api/sales` - Get all sales
- `POST /api/sales` - Add new sale

### Expenses
- `GET /api/expenses` - Get all expenses
- `POST /api/expenses` - Add new expense

### Inventory
- `GET /api/inventory` - Get all inventory items
- `POST /api/inventory` - Add new inventory item

## 🛠️ Development

```bash
# Install dependencies
npm install

# Test database connection
npm run test-db

# Seed with sample data
npm run seed

# Start development server
npm start

# Run tests
npm test
```

## 📊 Sample Data

The seed script (`npm run seed`) will populate your database with:
- 3 sample sales records
- 3 sample expense records  
- 3 sample inventory items

## 🔒 Security Notes

- Never commit your `.env` file to version control
- Use environment variables for all sensitive data
- The current setup uses `rejectUnauthorized: false` for SSL - this is acceptable for development but consider proper SSL certificates for production
