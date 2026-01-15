# E-Commerce Backend Server

A production-ready e-commerce backend built with Node.js, TypeScript, Express.js, TypeORM, and PostgreSQL.

> 📚 **For complete documentation, see [DOCUMENTATION.md](./DOCUMENTATION.md)**

## Features

- 🔐 JWT Authentication with role-based access control (ADMIN/USER)
- 📦 Complete CRUD operations for Products, Orders, Users
- 🛒 Order management with automatic stock updates
- 📊 Dashboard with analytics and charts
- 🔔 Notification system
- 📝 Request validation with Zod
- 📸 Image upload with Multer
- 📚 Swagger API documentation
- 🔒 Security with Helmet and CORS
- 📝 Request logging with Morgan

## Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **ORM**: TypeORM
- **Database**: PostgreSQL
- **Authentication**: JWT
- **Validation**: Zod
- **File Upload**: Multer
- **Documentation**: Swagger (OpenAPI 3)
- **Security**: Helmet, CORS, bcrypt

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd E-commerce-server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=ecommerce_db

JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

UPLOAD_DIR=uploads
MAX_FILE_SIZE=5242880

CORS_ORIGIN=http://localhost:3000
```

4. Create the PostgreSQL database:
```bash
createdb ecommerce_db
```

5. Run migrations:
```bash
npm run migration:run
```

6. (Optional) Create an admin user:
```bash
npm run create:admin
```
This will create an admin user with:
- Email: `admin@example.com`
- Password: `admin123`
**Important**: Change the password after first login!

7. Start the development server:
```bash
npm run dev
```

The server will start on `http://localhost:3000`

## API Documentation

Once the server is running, access the Swagger documentation at:
- **Swagger UI**: `http://localhost:3000/api-docs`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/reset-password` - Reset password
- `PUT /api/auth/profile` - Update profile (requires auth)

### Users (Admin Only)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Products
- `GET /api/products` - Get all products (public, filtered by visibility for non-admins)
- `GET /api/products/:id` - Get product by ID (public)
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)
- `PATCH /api/products/:id/visibility` - Update visibility (admin only)
- `PATCH /api/products/:id/stock` - Update stock (admin only)
- `POST /api/products/:id/upload` - Upload product image (admin only)

### Orders
- `POST /api/orders` - Place order (authenticated users)
- `GET /api/orders` - Get all orders (admin only)
- `PATCH /api/orders/:id/proceed` - Proceed order (admin only)
- `PATCH /api/orders/:id/cancel` - Cancel order (admin only)

### Dashboard (Admin Only)
- `GET /api/dashboard/summary` - Get dashboard summary
- `GET /api/dashboard/charts` - Get dashboard charts

### Notifications
- `GET /api/notifications` - Get all notifications (authenticated)
- `PATCH /api/notifications/:id/read` - Mark notification as read (authenticated)

## Project Structure

```
src/
 ├─ app.ts                 # Express app configuration
 ├─ server.ts              # Server entry point
 ├─ config/
 │   ├─ datasource.ts      # TypeORM datasource
 │   ├─ env.ts             # Environment variables
 ├─ modules/
 │   ├─ auth/              # Authentication module
 │   ├─ users/             # Users module
 │   ├─ products/          # Products module
 │   ├─ orders/            # Orders module
 │   ├─ dashboard/         # Dashboard module
 │   └─ notifications/     # Notifications module
 ├─ middlewares/
 │   ├─ auth.middleware.ts      # JWT authentication
 │   ├─ role.middleware.ts      # Role-based access
 │   ├─ error.middleware.ts     # Error handling
 │   ├─ validate.middleware.ts  # Request validation
 ├─ entities/              # TypeORM entities
 ├─ routes/                # Route definitions
 ├─ utils/                 # Utility functions
 ├─ swagger/               # Swagger configuration
 └─ migrations/            # Database migrations
```

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run migration:generate` - Generate a new migration
- `npm run migration:run` - Run pending migrations
- `npm run migration:revert` - Revert last migration
- `npm run create:admin` - Create an admin user

## Security Features

- Password hashing with bcrypt (10 salt rounds)
- JWT token-based authentication
- Role-based access control (ADMIN/USER)
- Request validation with Zod
- Helmet for security headers
- CORS configuration
- Input sanitization

## Business Rules

1. **Order Stock Management**:
   - When an order is PROCEEDED, product stock decreases
   - When an order is CANCELLED, product stock increases (if previously proceeded)

2. **Product Visibility**:
   - Non-admin users can only see products with `isVisible: true`
   - Admins can see all products

3. **Notifications**:
   - Created automatically when:
     - New order is placed
     - Order is proceeded
     - Order is cancelled

## Response Format

All API responses follow this standard format:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

Error responses:
```json
{
  "success": false,
  "message": "Error message"
}
```

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## License

ISC
