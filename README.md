# NexaOps

## Project Overview
NexaOps is a mobile-first tool for small businesses to track sales, expenses, and inventory, and to send automated reminders. The app is designed with an offline-first approach so core workflows continue to function without connectivity and sync when online. It also supports WhatsApp/SMS notifications in a demo mode to illustrate messaging flows without incurring provider costs.

## Tech Stack
- **Backend**: Node.js + Express
- **Database**: SQLite
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
