# Quick Start Guide

## 🚀 Starting the Application

### Step 1: Start the Backend Server

Open a terminal and run:

```bash
cd backend
npm start
```

The backend should start on `http://localhost:3000`

**Expected output:**
```
Table created successfully
Server is running on port 3000
```

### Step 2: Start the Frontend Server

Open a **NEW** terminal window and run:

```bash
cd frontend
npm run dev
```

The frontend should start on `http://localhost:5173`

### Step 3: Open in Browser

Navigate to: `http://localhost:5173`

## ✅ What Should Work Now

1. **CSS Styling**: Tailwind CSS is now properly configured
2. **API Connection**: Frontend will connect to backend on port 3000
3. **Error Handling**: Better error messages when backend is not running

## 🔧 Troubleshooting

### If CSS is still not working:

1. Stop the frontend dev server (Ctrl+C)
2. Clear Vite cache:
   ```bash
   cd frontend
   Remove-Item -Recurse -Force node_modules\.vite -ErrorAction SilentlyContinue
   ```
3. Restart the dev server:
   ```bash
   npm run dev
   ```

### If you see "ERR_CONNECTION_REFUSED":

- Make sure the backend server is running on port 3000
- Check that no other application is using port 3000
- Verify the backend server started successfully

### If Tailwind classes don't work:

- Make sure `postcss.config.js` exists in the `frontend` folder
- Verify `tailwind.config.js` exists and is properly configured
- Check that `index.css` is imported in `main.jsx`

## 📝 Notes

- Backend runs on: `http://localhost:3000`
- Frontend runs on: `http://localhost:5173`
- API endpoints: `http://localhost:3000/api/products`

