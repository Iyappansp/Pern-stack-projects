# Troubleshooting: "Cannot connect to server" Error

## Quick Fix Steps

### 1. Verify Backend is Running
The backend should show: `Server is running on port 3000`

If not running, start it:
```bash
npm run dev
```

### 2. Verify Frontend is Running in Development Mode
**IMPORTANT:** Make sure you're running the frontend in **development mode**, not using a production build.

Start the frontend dev server:
```bash
cd frontend
npm run dev
```

You should see:
```
VITE v7.x.x  ready in xxx ms
➜  Local:   http://localhost:5173/
```

### 3. Check Browser Console
Open your browser's developer console (F12) and look for:
- `🔧 API Configuration:` - Should show `baseURL: http://localhost:3000/api`
- `[API Request] GET http://localhost:3000/api/products`

If you see `baseURL: /api` or a different URL, the frontend is using a production build.

### 4. Clear Browser Cache
1. Hard refresh: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
2. Or clear cache: `Ctrl + Shift + Delete` → Clear cached images and files

### 5. Test Backend Connection
Test if the backend is accessible:
```bash
# In a new terminal
node test-connection.js
```

Or open in browser: `http://localhost:3000/api/health`

You should see:
```json
{
  "status": "ok",
  "message": "Backend is running",
  "port": 3000,
  "timestamp": "..."
}
```

### 6. Check CORS
The backend allows requests from `http://localhost:5173`. Make sure:
- Frontend is running on port 5173 (Vite default)
- You're accessing the frontend at `http://localhost:5173` (not file:// or another port)

## Common Issues

### Issue: Frontend shows old error or wrong API URL
**Solution:** 
1. Stop the frontend dev server (Ctrl+C)
2. Delete `frontend/node_modules/.vite` folder (Vite cache)
3. Restart: `cd frontend && npm run dev`
4. Hard refresh browser

### Issue: Backend on different port
If your backend is on port 3001 (or another port), either:
- Set `PORT=3000` in your `.env` file, OR
- Create `frontend/.env` with:
  ```
  VITE_API_URL=http://localhost:3001/api
  ```

### Issue: Using Production Build
If you're serving the `frontend/dist` folder, the API will try to use relative URLs.
**Solution:** Always use `npm run dev` for development.

## Verification Checklist

- [ ] Backend is running on port 3000
- [ ] Frontend dev server is running (`npm run dev` in frontend folder)
- [ ] Browser console shows `baseURL: http://localhost:3000/api`
- [ ] No CORS errors in browser console
- [ ] Browser cache cleared
- [ ] Test endpoint works: `http://localhost:3000/api/health`

## Still Having Issues?

1. Check backend terminal for errors
2. Check browser Network tab (F12 → Network) for failed requests
3. Verify both servers are running in separate terminals
4. Make sure no firewall is blocking localhost connections

