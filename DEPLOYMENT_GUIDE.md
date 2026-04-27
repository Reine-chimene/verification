# VYGC Verification - Deployment Guide

## Backend Deployment (Railway / Render)

1. **Deploy the backend** to Railway or Render:
   - Connect your GitHub repo: `https://github.com/Reine-chimene/backend-verification`
   - Use the following build settings:
     - **Build command**: `npm install`
     - **Start command**: `npm start`
     - **Node version**: 18+

2. **Set environment variables** on your backend hosting:
   ```
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   CLIENT_URL=https://your-frontend-url.netlify.app
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_app_password
   REVIEWER_EMAIL=reviewer@example.com
   ```

3. **Get your backend URL** (e.g., `https://vygc-backend.railway.app`)

## Frontend Configuration

4. **Update `config.js`** in the frontend with your backend URL:
   ```javascript
   window.API_BASE_URL = 'https://your-backend-url.com';
   ```

5. **Deploy frontend to Netlify**:
   - Connect repo: `https://github.com/Reine-chimene/verification`
   - Build settings: (no build needed - static files)
   - Publish directory: `.` (root)
   - Set environment variable (optional): `API_BASE_URL` (if using build generation)

6. **Update Netlify CORS headers** (optional, in `_headers` file):
   ```
   /*
     Access-Control-Allow-Origin: https://your-frontend-url.netlify.app
   ```

## Testing

- Visit your Netlify URL and test the form
- Check backend logs for incoming requests
- Verify Supabase database entries

## Notes

- Ensure Supabase table `submissions` exists (see SQL in backend/server.js)
- Use app passwords for Gmail SMTP (2FA enabled)
- Backend supports multiple CORS origins (comma-separated in CLIENT_URL)
