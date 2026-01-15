# E-Commerce Backend API - Complete Documentation

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#project-structure)
5. [Installation & Setup](#installation--setup)
6. [Database Schema](#database-schema)
7. [API Documentation](#api-documentation)
8. [Authentication Flow](#authentication-flow)
9. [Business Logic](#business-logic)
10. [Usage Examples](#usage-examples)
11. [Testing](#testing)
12. [Deployment](#deployment)

---

## 🎯 Project Overview

This is a **production-ready e-commerce backend API** built with Node.js and TypeScript. The system provides a complete solution for managing an online store, including user management, product catalog, order processing, inventory management, and administrative dashboards.

### Key Highlights
- **RESTful API** with comprehensive endpoints
- **JWT-based authentication** with role-based access control
- **Real-time inventory management** with automatic stock updates
- **Comprehensive dashboard** with analytics and reporting
- **Notification system** for order events
- **Image upload** functionality for products
- **Complete API documentation** with Swagger

---

## ✨ Features

### Authentication & Authorization
- User registration and login
- JWT token-based authentication
- Role-based access control (Admin/User)
- Password reset functionality
- Profile management

### Product Management
- CRUD operations for products
- Product visibility control
- Stock management
- Image upload for products
- Automatic margin calculation
- Public product listing (filtered by visibility)

### Order Management
- Place orders (authenticated users)
- Order status tracking (PLACED, PROCEEDED, CANCELLED)
- Automatic stock updates on order status changes
- Order history and details

### Dashboard & Analytics (Admin Only)
- Summary statistics (total orders, revenue, profit, loss)
- Daily charts (orders, revenue, profit per day)
- Business insights and reporting

### User Management (Admin Only)
- View all users
- Create, update, and delete users
- User role management
- User activation/deactivation

### Notifications
- Automatic notification creation on order events
- Mark notifications as read
- Notification history

---

## 🛠 Technology Stack

### Core Technologies
- **Node.js** - Runtime environment
- **TypeScript** - Programming language
- **Express.js** - Web framework

### Database & ORM
- **PostgreSQL** - Relational database
- **TypeORM** - Object-Relational Mapping

### Security & Authentication
- **JWT (jsonwebtoken)** - Token-based authentication
- **bcrypt** - Password hashing
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing

### Validation & Documentation
- **Zod** - Schema validation
- **Swagger (OpenAPI 3)** - API documentation

### File Upload
- **Multer** - File upload handling

### Utilities
- **Morgan** - HTTP request logger
- **dotenv** - Environment variable management

---

## 📁 Project Structure

```
E-commerce-server/
├── src/
│   ├── app.ts                 # Express app configuration
│   ├── server.ts              # Server entry point
│   ├── config/
│   │   ├── datasource.ts      # TypeORM database configuration
│   │   └── env.ts             # Environment variables
│   ├── entities/              # TypeORM entities
│   │   ├── User.ts
│   │   ├── Product.ts
│   │   ├── Order.ts
│   │   ├── OrderItem.ts
│   │   └── Notification.ts
│   ├── modules/               # Feature modules
│   │   ├── auth/              # Authentication module
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.routes.ts
│   │   │   └── auth.schemas.ts
│   │   ├── users/             # User management module
│   │   ├── products/          # Product management module
│   │   ├── orders/            # Order management module
│   │   ├── dashboard/         # Dashboard & analytics module
│   │   └── notifications/     # Notification module
│   ├── middlewares/           # Express middlewares
│   │   ├── auth.middleware.ts      # JWT authentication
│   │   ├── role.middleware.ts      # Role-based access
│   │   ├── error.middleware.ts      # Error handling
│   │   └── validate.middleware.ts  # Request validation
│   ├── routes/
│   │   └── index.ts           # Route aggregation
│   ├── utils/                 # Utility functions
│   │   ├── jwt.ts             # JWT token utilities
│   │   ├── password.ts        # Password hashing
│   │   ├── response.ts         # Response formatting
│   │   ├── createAdmin.ts     # Admin creation script
│   │   └── seed.ts            # Database seeding
│   ├── swagger/
│   │   └── swagger.config.ts  # Swagger configuration
│   └── migrations/            # Database migrations
├── uploads/                   # Uploaded files directory
├── .env                       # Environment variables (not in git)
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd E-commerce-server
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Environment Configuration
Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=ecommerce_db

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# File Upload
UPLOAD_DIR=uploads
MAX_FILE_SIZE=5242880

# CORS
CORS_ORIGIN=http://localhost:3000
```

### Step 4: Create Database
```bash
createdb ecommerce_db
```

### Step 5: Run Migrations
```bash
npm run migration:run
```

### Step 6: Seed Database (Optional)
Populate the database with test data:
```bash
npm run seed
```

### Step 7: Start the Server
```bash
# Development mode (with hot reload)
npm run dev

# Production mode
npm run build
npm start
```

The server will start on `http://localhost:3000`

### Step 8: Access API Documentation
Open your browser and navigate to:
```
http://localhost:3000/api-docs
```

---

## 🗄 Database Schema

### Entity Relationship Diagram

```
┌─────────────┐         ┌─────────────┐
│    User     │         │   Product   │
├─────────────┤         ├─────────────┤
│ id (PK)     │         │ id (PK)     │
│ name        │         │ name        │
│ email (UK)  │         │ description │
│ password    │         │ purchasePrice│
│ role        │         │ salePrice   │
│ isActive    │         │ margin      │
│ createdAt   │         │ stock       │
│ updatedAt   │         │ isVisible   │
└──────┬──────┘         │ images[]    │
       │                │ createdAt   │
       │                │ updatedAt   │
       │                └──────┬──────┘
       │                       │
       │                ┌──────┴──────┐
       │                │  OrderItem   │
       │                ├──────────────┤
       │                │ id (PK)     │
       │                │ orderId (FK) │
       │                │ productId(FK)│
       │                │ quantity    │
       │                │ price       │
       │                └──────┬──────┘
       │                       │
┌──────┴──────┐                │
│    Order    │◄───────────────┘
├─────────────┤
│ id (PK)     │
│ userId (FK)  │
│ status      │
│ totalAmount │
│ createdAt   │
└─────────────┘

┌─────────────┐
│Notification │
├─────────────┤
│ id (PK)     │
│ title       │
│ message     │
│ isRead      │
│ createdAt   │
└─────────────┘
```

### Tables Description

#### Users Table
- **id**: UUID (Primary Key)
- **name**: User's full name
- **email**: Unique email address
- **password**: Hashed password (bcrypt)
- **role**: Enum (ADMIN | USER)
- **isActive**: Boolean (account status)
- **createdAt**: Timestamp
- **updatedAt**: Timestamp

#### Products Table
- **id**: UUID (Primary Key)
- **name**: Product name
- **description**: Product description
- **purchasePrice**: Cost price
- **salePrice**: Selling price
- **margin**: Calculated (salePrice - purchasePrice)
- **stock**: Available quantity
- **isVisible**: Boolean (public visibility)
- **images**: Array of image URLs
- **createdAt**: Timestamp
- **updatedAt**: Timestamp

#### Orders Table
- **id**: UUID (Primary Key)
- **userId**: Foreign Key to Users
- **status**: Enum (PLACED | PROCEEDED | CANCELLED)
- **totalAmount**: Total order value
- **createdAt**: Timestamp

#### OrderItems Table
- **id**: UUID (Primary Key)
- **orderId**: Foreign Key to Orders
- **productId**: Foreign Key to Products
- **quantity**: Number of items
- **price**: Price at time of order

#### Notifications Table
- **id**: UUID (Primary Key)
- **title**: Notification title
- **message**: Notification message
- **isRead**: Boolean (read status)
- **createdAt**: Timestamp

---

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication

All endpoints (except login and register) require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Response Format

All API responses follow this standard format:

**Success Response:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error message"
}
```

### API Endpoints

#### Authentication Endpoints

##### 1. Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "USER"
    },
    "token": "jwt-token"
  }
}
```

##### 2. Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

##### 3. Get Current User
```http
GET /api/users/me
Authorization: Bearer <token>
```

##### 4. Update Profile
```http
PUT /api/auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Updated",
  "email": "newemail@example.com"
}
```

##### 5. Reset Password
```http
POST /api/auth/reset-password
Content-Type: application/json

{
  "email": "john@example.com",
  "newPassword": "newpassword123"
}
```

##### 6. Create Admin (Admin Only)
```http
POST /api/auth/create-admin
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "admin123"
}
```

#### Product Endpoints

##### 1. Get All Products (Public)
```http
GET /api/products?page=1&limit=10&search=laptop
```

##### 2. Get Product by ID (Public)
```http
GET /api/products/:id
```

##### 3. Create Product (Admin Only)
```http
POST /api/products
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "name": "Laptop Pro",
  "description": "High-performance laptop",
  "purchasePrice": 800.00,
  "salePrice": 1299.99,
  "stock": 25,
  "isVisible": true
}
```

##### 4. Update Product (Admin Only)
```http
PUT /api/products/:id
Authorization: Bearer <admin-token>
```

##### 5. Delete Product (Admin Only)
```http
DELETE /api/products/:id
Authorization: Bearer <admin-token>
```

##### 6. Upload Product Image (Admin Only)
```http
POST /api/products/:id/upload
Authorization: Bearer <admin-token>
Content-Type: multipart/form-data

image: <file>
```

##### 7. Update Product Visibility (Admin Only)
```http
PATCH /api/products/:id/visibility
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "isVisible": false
}
```

##### 8. Update Product Stock (Admin Only)
```http
PATCH /api/products/:id/stock
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "stock": 50
}
```

#### Order Endpoints

##### 1. Place Order (Authenticated Users)
```http
POST /api/orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "items": [
    {
      "productId": "product-uuid",
      "quantity": 2
    }
  ]
}
```

##### 2. Get All Orders (Admin Only)
```http
GET /api/orders?page=1&limit=10&status=PLACED
Authorization: Bearer <admin-token>
```

##### 3. Proceed Order (Admin Only)
```http
PATCH /api/orders/:id/proceed
Authorization: Bearer <admin-token>
```

##### 4. Cancel Order (Admin Only)
```http
PATCH /api/orders/:id/cancel
Authorization: Bearer <admin-token>
```

#### Dashboard Endpoints (Admin Only)

##### 1. Get Dashboard Summary
```http
GET /api/dashboard/summary
Authorization: Bearer <admin-token>
```

**Response:**
```json
{
  "success": true,
  "message": "Dashboard summary retrieved successfully",
  "data": {
    "totalOrders": 150,
    "totalRevenue": 50000.00,
    "totalProfit": 15000.00,
    "totalLoss": 500.00
  }
}
```

##### 2. Get Dashboard Charts
```http
GET /api/dashboard/charts?days=30
Authorization: Bearer <admin-token>
```

#### User Management Endpoints (Admin Only)

##### 1. Get All Users
```http
GET /api/users?page=1&limit=10
Authorization: Bearer <admin-token>
```

##### 2. Get User by ID
```http
GET /api/users/:id
Authorization: Bearer <admin-token>
```

##### 3. Create User
```http
POST /api/users
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "name": "New User",
  "email": "newuser@example.com",
  "password": "password123",
  "role": "USER"
}
```

##### 4. Update User
```http
PUT /api/users/:id
Authorization: Bearer <admin-token>
```

##### 5. Delete User
```http
DELETE /api/users/:id
Authorization: Bearer <admin-token>
```

#### Notification Endpoints

##### 1. Get All Notifications
```http
GET /api/notifications?page=1&limit=10&isRead=false
Authorization: Bearer <token>
```

##### 2. Mark Notification as Read
```http
PATCH /api/notifications/:id/read
Authorization: Bearer <token>
```

---

## 🔐 Authentication Flow

### Registration Flow
1. User sends registration request with name, email, password
2. System validates input using Zod schema
3. Password is hashed using bcrypt (10 salt rounds)
4. User is created with USER role by default
5. JWT token is generated and returned
6. User can now use the token for authenticated requests

### Login Flow
1. User sends login request with email and password
2. System finds user by email
3. Password is verified using bcrypt
4. JWT token is generated with user info (userId, email, role)
5. Token is returned to client
6. Client stores token and includes it in subsequent requests

### Protected Route Flow
1. Client includes JWT token in Authorization header
2. `authMiddleware` extracts and verifies token
3. User is fetched from database
4. User object is attached to request
5. Route handler processes request with user context

### Role-Based Access Flow
1. Request passes through `authMiddleware`
2. `requireAdmin` middleware checks if user role is ADMIN
3. If not admin, request is rejected with 403 Forbidden
4. If admin, request proceeds to handler

---

## 💼 Business Logic

### Order Processing Logic

#### When Order is PLACED:
- Order is created with status PLACED
- Order items are saved
- Notification is created: "New Order Placed"
- **Stock is NOT decreased yet**

#### When Order is PROCEEDED:
- Order status changes to PROCEEDED
- For each order item:
  - Product stock is decreased by item quantity
  - If stock becomes insufficient, error is thrown
- Notification is created: "Order Proceeded"
- **Stock is decreased**

#### When Order is CANCELLED:
- Order status changes to CANCELLED
- If order was previously PROCEEDED:
  - For each order item:
    - Product stock is increased back by item quantity
- Notification is created: "Order Cancelled"
- **Stock is restored if order was proceeded**

### Product Margin Calculation
- Margin is automatically calculated: `salePrice - purchasePrice`
- Updated whenever purchasePrice or salePrice changes

### Product Visibility
- Non-admin users can only see products where `isVisible = true`
- Admins can see all products regardless of visibility
- Used to hide products from public catalog while keeping them in system

### Notification System
Notifications are automatically created when:
- New order is placed
- Order status changes to PROCEEDED
- Order is cancelled

---

## 📖 Usage Examples

### Example 1: Complete Order Flow

#### Step 1: Register a User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

#### Step 2: Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

Response includes token:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { ... },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Step 3: Browse Products
```bash
curl http://localhost:3000/api/products
```

#### Step 4: Place an Order
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "productId": "product-uuid-here",
        "quantity": 2
      }
    ]
  }'
```

#### Step 5: Admin Proceeds Order
```bash
curl -X PATCH http://localhost:3000/api/orders/:orderId/proceed \
  -H "Authorization: Bearer <admin-token>"
```

### Example 2: Admin Product Management

#### Create Product
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Wireless Mouse",
    "description": "Ergonomic wireless mouse",
    "purchasePrice": 8.50,
    "salePrice": 19.99,
    "stock": 100,
    "isVisible": true
  }'
```

#### Upload Product Image
```bash
curl -X POST http://localhost:3000/api/products/:productId/upload \
  -H "Authorization: Bearer <admin-token>" \
  -F "image=@/path/to/image.jpg"
```

### Example 3: Dashboard Analytics

```bash
curl http://localhost:3000/api/dashboard/summary \
  -H "Authorization: Bearer <admin-token>"
```

---

## 🧪 Testing

### Test Credentials (After Seeding)

**Admin Users:**
- Email: `admin@example.com` | Password: `admin123`
- Email: `superadmin@example.com` | Password: `admin123`

**Regular Users:**
- Email: `john@example.com` | Password: `user123`
- Email: `jane@example.com` | Password: `user123`
- Email: `bob@example.com` | Password: `user123`

### Testing with Swagger UI

1. Start the server: `npm run dev`
2. Open `http://localhost:3000/api-docs`
3. Click "Authorize" button
4. Enter your JWT token
5. Test endpoints directly from the UI

### Testing with Postman/Insomnia

1. Import the API collection (if available)
2. Set base URL: `http://localhost:3000/api`
3. For protected routes:
   - Login first to get token
   - Set Authorization header: `Bearer <token>`

### Manual Testing Checklist

- [ ] User registration
- [ ] User login
- [ ] Get current user details
- [ ] Update profile
- [ ] Browse products (public)
- [ ] Place order
- [ ] Admin: View all orders
- [ ] Admin: Proceed order (check stock decrease)
- [ ] Admin: Cancel order (check stock increase)
- [ ] Admin: Create product
- [ ] Admin: Upload product image
- [ ] Admin: View dashboard
- [ ] Admin: Manage users
- [ ] View notifications

---

## 🚢 Deployment

### Environment Variables for Production

```env
NODE_ENV=production
PORT=3000

DB_HOST=your-db-host
DB_PORT=5432
DB_USERNAME=your-db-user
DB_PASSWORD=your-secure-password
DB_NAME=ecommerce_db

JWT_SECRET=your-very-secure-random-secret-key
JWT_EXPIRES_IN=7d

UPLOAD_DIR=uploads
MAX_FILE_SIZE=5242880

CORS_ORIGIN=https://your-frontend-domain.com
```

### Build for Production

```bash
npm run build
```

### Production Considerations

1. **Security:**
   - Use strong JWT_SECRET
   - Enable HTTPS
   - Configure CORS properly
   - Use environment variables for sensitive data
   - Implement rate limiting

2. **Database:**
   - Use connection pooling
   - Set up database backups
   - Monitor database performance

3. **File Storage:**
   - Consider cloud storage (AWS S3, Cloudinary) for images
   - Implement file size limits
   - Validate file types

4. **Monitoring:**
   - Set up logging (Winston, Pino)
   - Implement error tracking (Sentry)
   - Monitor API performance

5. **Scaling:**
   - Use PM2 or similar for process management
   - Consider load balancing
   - Implement caching (Redis)

---

## 📝 Available Scripts

```bash
# Development
npm run dev              # Start development server with hot reload

# Production
npm run build           # Build TypeScript to JavaScript
npm start               # Start production server

# Database
npm run migration:generate  # Generate new migration
npm run migration:run       # Run pending migrations
npm run migration:revert    # Revert last migration
npm run migration:status   # Check migration status

# Utilities
npm run seed            # Seed database with test data
npm run create:admin    # Create admin user
```

---

## 🎓 Project Highlights for College Submission

### Technical Achievements
1. **Type-Safe Development**: Full TypeScript implementation with strict type checking
2. **Clean Architecture**: Modular structure with separation of concerns
3. **Database Design**: Well-normalized schema with proper relationships
4. **Security**: JWT authentication, password hashing, role-based access control
5. **API Documentation**: Complete Swagger/OpenAPI documentation
6. **Error Handling**: Centralized error handling middleware
7. **Validation**: Request validation using Zod schemas
8. **Business Logic**: Complex order processing with stock management

### Best Practices Implemented
- RESTful API design
- Environment-based configuration
- Database migrations (no sync)
- Input validation
- Error handling
- Code organization
- Documentation

### Learning Outcomes Demonstrated
- Backend development with Node.js/Express
- TypeScript programming
- Database design and ORM usage
- Authentication and authorization
- API design and documentation
- Software architecture patterns

---

## 📞 Support & Contact

For questions or issues, please refer to:
- API Documentation: `http://localhost:3000/api-docs`
- Project Repository: [GitHub URL]
- Documentation: This file

---

## 📄 License

ISC License

---

**Document Version:** 1.0  
**Last Updated:** 2024  
**Project Status:** Production Ready
