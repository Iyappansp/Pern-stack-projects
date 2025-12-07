# Quick Start Guide

## 📋 Prerequisites

- Node.js (v20 or higher)
- npm or yarn
- Neon Database account (or PostgreSQL database)
- Arcjet API key (optional, for production)

## 🚀 Starting the Application

### Step 1: Install Dependencies

From the project root:

```bash
npm install
cd frontend
npm install
cd ..
```

### Step 2: Environment Setup

Create a `.env` file in the **root directory** with the following variables:

```env
# Database Configuration (Neon PostgreSQL)
DATABASE_URL=your_neon_database_connection_string
# OR use individual variables:
# PGHOST=your_host
# PGUSER=your_user
# PGPASSWORD=your_password
# PGDATABASE=your_database
# PGPORT=5432

# Arcjet Configuration (for bot protection and rate limiting)
ARCJET_KEY=your_arcjet_api_key

# Server Port (optional, defaults to 3001)
PORT=3001
```

**Note:** For development, you can use a test Arcjet key or the service will run in DRY_RUN mode.

### Step 3: Start the Backend Server

Open a terminal in the **project root** and run:

```bash
npm run dev
```

Or manually:

```bash
cd backend
node server.js
```

**Expected output:**

```
Server is running on port 3001
```

**⚠️ Important:** The backend runs on port **3001** by default. If you want to use port 3000, either:

- Set `PORT=3000` in your `.env` file, OR
- Update `frontend/src/services/api.js` to use `http://localhost:3001/api`

### Step 4: Start the Frontend Server

Open a **NEW** terminal window and run:

```bash
cd frontend
npm run dev
```

The frontend should start on `http://localhost:5173`

**Expected output:**

```
  VITE v7.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Step 5: Open in Browser

Navigate to: `http://localhost:5173`

## ✅ What Should Work Now

1. **CSS Styling**: Tailwind CSS is properly configured with PostCSS
2. **API Connection**: Frontend connects to backend on the configured port
3. **CORS**: Properly configured to allow requests from `http://localhost:5173`
4. **Security**: Arcjet protection for bot detection and rate limiting
5. **Database**: Automatic table creation on first run

## 🔧 Configuration Details

### Port Configuration

- **Backend**: Runs on port `3001` (configurable via `PORT` env variable)
- **Frontend**: Runs on port `5173` (Vite default)
- **API Base URL**: `http://localhost:3000/api` (default in `api.js`)

**⚠️ Port Mismatch Fix:**

If your backend is on port 3001 but frontend is calling 3000, you have two options:

**Option 1:** Change backend to port 3000

```bash
# In .env file
PORT=3000
```

**Option 2:** Update frontend API URL

```javascript
// In frontend/src/services/api.js
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001/api";
```

Or create `frontend/.env`:

```env
VITE_API_URL=http://localhost:3001/api
```

### CORS Configuration

CORS is configured in `backend/server.js` to allow:

- **Origin**: `http://localhost:5173`
- **Methods**: GET, POST, PUT, DELETE, OPTIONS
- **Headers**: Content-Type, Authorization
- **Credentials**: Enabled

### Arcjet Security

The backend uses Arcjet for:

- **Bot Detection**: Blocks bots except search engines
- **Rate Limiting**: Token bucket algorithm (5 tokens per 10 seconds, capacity 10)
- **Shield Protection**: SQL injection, XSS, CSRF protection

**Arcjet Configuration:**

- Import: `detectBot` (not `bot`) from `@arcjet/node`
- Mode: `LIVE` (blocks in production)
- OPTIONS requests bypass Arcjet for CORS preflight

## 🐛 Troubleshooting

### CORS Errors

**Error:** `Access to XMLHttpRequest blocked by CORS policy`

**Solutions:**

1. Verify backend is running on the correct port
2. Check that CORS middleware is before other middleware in `server.js`
3. Ensure frontend origin matches: `http://localhost:5173`
4. Hard refresh browser: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
5. Clear browser cache

### Port Mismatch Errors

**Error:** `ERR_CONNECTION_REFUSED` or `404 Not Found`

**Solutions:**

1. Check backend is running: Visit `http://localhost:3001/api/products` in browser
2. Verify port in `.env` file matches frontend API URL
3. Check terminal output for actual port number
4. Ensure no other application is using the port

### CSS Not Loading

**Error:** Tailwind classes not working

**Solutions:**

1. Stop the frontend dev server (Ctrl+C)
2. Clear Vite cache:
   ```bash
   cd frontend
   Remove-Item -Recurse -Force node_modules\.vite -ErrorAction SilentlyContinue
   # Or on Mac/Linux:
   rm -rf node_modules/.vite
   ```
3. Restart the dev server:
   ```bash
   npm run dev
   ```
4. Hard refresh browser

### Database Connection Errors

**Error:** `Error connecting to the database`

**Solutions:**

1. Verify `.env` file exists in root directory
2. Check `DATABASE_URL` or individual database variables are set
3. Ensure database credentials are correct
4. Test connection string format for Neon PostgreSQL
5. Check network connectivity

### Arcjet Import Errors

**Error:** `The requested module '@arcjet/node' does not provide an export named 'bot'`

**Solution:**

- Use `detectBot` instead of `bot`:
  ```javascript
  import arcjet, { tokenBucket, shield, detectBot } from "@arcjet/node";
  ```

### Backend Not Starting

**Error:** Server crashes on startup

**Solutions:**

1. Check all environment variables are set
2. Verify Node.js version is v20 or higher
3. Check database connection string is valid
4. Review terminal error messages
5. Ensure all dependencies are installed: `npm install`

### API Endpoints Not Found (404)

**Error:** `GET http://localhost:3000/api/products 404 (Not Found)`

**Solutions:**

1. Verify backend server is running
2. Check route mounting in `server.js`: `app.use("/api/products", productRoutes)`
3. Test endpoint directly in browser: `http://localhost:3001/api/products`
4. Verify frontend API base URL matches backend port

## 📝 API Endpoints

All endpoints are prefixed with `/api/products`:

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

## 🗂️ Project Structure

```
working-nama-tha-enimel/
├── backend/
│   ├── config/
│   │   └── db.js              # Database configuration
│   ├── controllers/
│   │   └── productController.js
│   ├── lib/
│   │   └── arcjet.js          # Arcjet security configuration
│   ├── routes/
│   │   └── productRoutes.js
│   └── server.js              # Express server entry point
├── frontend/
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── pages/             # Page components
│   │   ├── services/
│   │   │   └── api.js         # Axios API client
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env                   # Frontend environment variables (optional)
│   └── package.json
├── .env                       # Backend environment variables (REQUIRED)
├── package.json
└── QUICK_START.md            # This file
```

## 🔐 Security Features

1. **Helmet.js**: Security headers
2. **Arcjet**: Bot detection, rate limiting, and attack protection
3. **CORS**: Configured for specific origin
4. **Input Validation**: Required fields validation in controllers

## 📦 Key Dependencies

### Backend

- `express` - Web framework
- `@arcjet/node` - Security and rate limiting
- `@neondatabase/serverless` - PostgreSQL database
- `cors` - Cross-origin resource sharing
- `helmet` - Security headers
- `morgan` - HTTP request logger

### Frontend

- `react` - UI library
- `react-router-dom` - Routing
- `axios` - HTTP client
- `tailwindcss` - CSS framework
- `zustand` - State management
- `react-hot-toast` - Notifications

## 🎯 Development Tips

1. **Use nodemon**: Backend auto-restarts on file changes
2. **Check terminal logs**: Both servers show helpful error messages
3. **Browser DevTools**: Check Network tab for API request/response details
4. **Environment variables**: Never commit `.env` files to git
5. **Port conflicts**: Use `netstat` or `lsof` to check port usage

## 📞 Quick Reference

- **Backend URL**: `http://localhost:3001`
- **Frontend URL**: `http://localhost:5173`
- **API Base**: `http://localhost:3000/api` (or 3001 if configured)
- **Database**: Neon PostgreSQL (configured via `.env`)

## ✅ Verification Checklist

Before reporting issues, verify:

- [ ] Backend server is running and shows "Server is running on port X"
- [ ] Frontend server is running and accessible at `http://localhost:5173`
- [ ] `.env` file exists in root with all required variables
- [ ] Database connection string is valid
- [ ] Port numbers match between frontend API URL and backend
- [ ] Browser console shows no CORS errors
- [ ] Network tab shows successful API requests (200 status)

---

**Need Help?** Check the error messages in your terminal and browser console for specific details.
