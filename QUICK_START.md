# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Setup Environment
Create `.env` file:
```env
PORT=3000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=ecommerce_db
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
UPLOAD_DIR=uploads
MAX_FILE_SIZE=5242880
CORS_ORIGIN=http://localhost:3000
```

### Step 3: Create Database
```bash
createdb ecommerce_db
```

### Step 4: Run Migrations
```bash
npm run migration:run
```

### Step 5: Seed Database
```bash
npm run seed
```

### Step 6: Start Server
```bash
npm run dev
```

### Step 7: Access API Docs
Open: `http://localhost:3000/api-docs`

---

## 🧪 Test the API

### 1. Login as Admin
```bash
POST http://localhost:3000/api/auth/login
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

### 2. Get Your Profile
```bash
GET http://localhost:3000/api/users/me
Authorization: Bearer <your-token>
```

### 3. Browse Products
```bash
GET http://localhost:3000/api/products
```

### 4. Place an Order
```bash
POST http://localhost:3000/api/orders
Authorization: Bearer <your-token>
{
  "items": [
    {
      "productId": "<product-id>",
      "quantity": 1
    }
  ]
}
```

---

## 📋 Test Credentials

After running `npm run seed`:

**Admin:**
- Email: `admin@example.com`
- Password: `admin123`

**User:**
- Email: `john@example.com`
- Password: `user123`

---

## 📚 Next Steps

1. Read [DOCUMENTATION.md](./DOCUMENTATION.md) for complete details
2. Explore API endpoints in Swagger UI
3. Review [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) for project overview

---

## ❓ Common Issues

### Database Connection Error
- Ensure PostgreSQL is running
- Check database credentials in `.env`
- Verify database exists: `createdb ecommerce_db`

### Migration Errors
- Check if tables already exist
- Run: `npm run migration:status`
- If needed, drop and recreate database

### Port Already in Use
- Change PORT in `.env` file
- Or stop the process using port 3000

---

**Need Help?** Check the full [DOCUMENTATION.md](./DOCUMENTATION.md)
