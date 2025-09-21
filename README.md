# NexaOps

## Project Overview
NexaOps is a mobile-first tool for small businesses to track sales, expenses, and inventory, and to send automated reminders. The app is designed with an offline-first approach so core workflows continue to function without connectivity and sync when online. It also supports WhatsApp/SMS notifications in a demo mode to illustrate messaging flows without incurring provider costs.

## Tech Stack
- **Backend**: Node.js + Express
- **Database**: Supabase (Postgres) via `pg`
- **Frontend**: Minimal HTML/CSS + JavaScript
- **Messaging**: WhatsApp API (demo) and SMS (demo)

## AI Plan
AI (via Cursor) will accelerate delivery by:
- **Scaffolding endpoints and database models** to ensure consistent patterns and faster iteration
- **Generating helper utilities** (validation, formatting, pagination, error handling)
- **Creating tests** (unit/integration) to safeguard core logic and APIs
- **Producing inline documentation and README sections** to keep contributors unblocked

## Planned APIs
Concise, REST-style endpoints for Sales, Expenses, Inventory, and Notifications. Routes are prefixed with `/api`.

### Sales
- `GET /api/sales` — List sales with optional filters/pagination
- `POST /api/sales` — Create a new sale record
- `GET /api/sales/:id` — Retrieve a sale by ID
- `PUT /api/sales/:id` — Update a sale by ID
- `DELETE /api/sales/:id` — Delete a sale by ID

### Expenses
- `GET /api/expenses` — List expenses with optional filters/pagination
- `POST /api/expenses` — Create a new expense record
- `GET /api/expenses/:id` — Retrieve an expense by ID
- `PUT /api/expenses/:id` — Update an expense by ID
- `DELETE /api/expenses/:id` — Delete an expense by ID

### Inventory
- `GET /api/inventory/items` — List inventory items (stock levels, SKU, cost/price)
- `POST /api/inventory/items` — Create a new inventory item
- `GET /api/inventory/items/:id` — Retrieve an inventory item by ID
- `PUT /api/inventory/items/:id` — Update an inventory item by ID
- `DELETE /api/inventory/items/:id` — Delete an inventory item by ID
- `POST /api/inventory/items/:id/adjust` — Adjust stock levels (in/out)

### Notifications (Demo)
- `POST /api/notifications/whatsapp/demo` — Simulate sending a WhatsApp message
- `POST /api/notifications/sms/demo` — Simulate sending an SMS
- `GET /api/notifications/logs` — View notification attempts/logs (for demos)

> Note: Messaging routes operate in demo mode only until provider credentials and billing are configured.

## Setup (Supabase)

### 1. Database Setup
- This project uses Supabase (Postgres) for data storage.
- Run `schema.sql` in the Supabase SQL editor to create the required tables:
  - `sales` table with columns: `id`, `item_name`, `amount`, `date`, `customer`
  - `expenses` table with columns: `id`, `description`, `amount`, `date`
  - `inventory` table with columns: `id`, `item_name`, `quantity`, `price`

### 2. Environment Configuration
- Copy `env.sample` to `.env`: `cp env.sample .env`
- Update the `.env` file with your Supabase connection details:
  ```
  DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
  ```
- Get your connection string from: Supabase Dashboard → Project Settings → Database → Connection string

### 3. Install Dependencies & Start
```bash
npm install
npm start
```
- Open `http://localhost:3000` to access the application
- API endpoints are available at `http://localhost:3000/api`

### 4. Test Database Connection
```bash
node testdb.js
```
This will verify your Supabase connection is working correctly.
