# VYGC Verification - Deployment Guide

## 🎨 Design Features

- **Glassmorphism UI** with animated gradient background
- **Fully responsive** design (mobile, tablet, desktop)
- **Smooth animations** and hover effects
- **Modern typography** (Inter + Playfair Display)
- **Toast notifications** instead of alerts
- **Real-time validation** feedback

---

## Backend Deployment (Render)

1. **Deploy the backend** to Render:
   - Connect your GitHub: https://github.com/Reine-chimene/backend-verification
   - Create new **Web Service**
   - Build command: `npm install`
   - Start command: `npm start`
   - Node version: 18+

2. **Set environment variables** in Render dashboard:

| Variable | Description |
|----------|-------------|
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_ANON_KEY` | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key |
| `CLIENT_URL` | `https://scintillant-haupia-303f02.netlify.app` |
| `SMTP_HOST` | `smtp.gmail.com` |
| `SMTP_PORT` | `587` |
| `SMTP_USER` | Your Gmail address |
| `SMTP_PASS` | Gmail app password (16 chars) |
| `REVIEWER_EMAIL` | Email that receives approval requests |
| `NODE_ENV` | `production` |
| `PORT` | `3000` |

3. **Deploy** → Get your backend URL:
   - Example: `https://verification-backend-66j0.onrender.com`

---

## Frontend Configuration (Netlify)

4. **Set Netlify environment variable**:
   - Go to **Site settings** → **Environment variables**
   - Add: `API_BASE_URL` = `https://verification-backend-66j0.onrender.com`

5. **Deploy frontend**:
   - Repo: https://github.com/Reine-chimene/verification
   - Build command: `node netlify-build.js`
   - Publish directory: `.` (root)
   - Netlify will auto-generate `config.js` from env var

6. **Trigger deploy**: Deploys → "Trigger deploy" → "Deploy site"

---

## 🔧 CORS Configuration

Backend CORS is automatically configured via `CLIENT_URL` env var on Render.

Supports multiple URLs (comma-separated):
```
CLIENT_URL=https://site.netlify.app,http://localhost:8000
```

---

## ✅ Verification Steps

1. **Check backend health**: `https://your-backend.onrender.com/api/health`
2. **Check Netlify console** (F12) → should show: `✅ API_BASE_URL configured: https://...`
3. **Test form submission** → should show success toast
4. **Check Render logs** → confirm POST request received
5. **Check Supabase** → new row in `submissions` table

---

## 📁 Project Structure

```
frontend/
├── index.html          # Main HTML with modern structure
├── style.css           # Modern CSS with glassmorphism
├── script.js           # Form handler & validation
├── config.example.js   # Config template (for local dev)
├── netlify.toml        # Netlify build configuration
├── netlify-build.js    # Build script that generates config.js
└── vygc-api.js         # API client library

backend/
├── server.js           # Express server with CORS, Supabase, Nodemailer
├── .env.example        # Environment variables template
└── railway.json        # Railway deployment config (optional)
```

---

## 🐛 Troubleshooting

### "Connection error" message
- ✅ Verify `API_BASE_URL` in Netlify env vars (no trailing slash)
- ✅ Check Render `CLIENT_URL` matches your Netlify URL exactly
- ✅ Ensure backend is "Live" on Render (green status)
- ✅ Test API endpoint directly in browser

### CORS errors
- ✅ On Render, `CLIENT_URL` must include `https://`
- ✅ Multiple URLs separated by commas (no spaces)
- ✅ Backend logs will show CORS rejection if misconfigured

### Email not sending
- ✅ Use Gmail App Password (not regular password)
- ✅ Enable 2FA on Gmail before creating app password
- ✅ Check SMTP credentials in Render env vars

### Submissions not appearing in Supabase
- ✅ Run SQL schema from `backend/server.js` (lines 46-79) in Supabase SQL Editor
- ✅ Table name: `submissions`
- ✅ Check Supabase Dashboard → Table Editor

---

## 🎯 Quick Deploy Checklist

**Backend (Render)**:
- [ ] Repo connected: backend-verification
- [ ] All 11 env vars set
- [ ] Service is Live (green)
- [ ] URL copied: `https://...onrender.com`

**Frontend (Netlify)**:
- [ ] Repo connected: verification
- [ ] `API_BASE_URL` set to backend URL
- [ ] Build triggered successfully
- [ ] Site published

**Supabase**:
- [ ] SQL schema executed
- [ ] Table `submissions` exists
- [ ] RLS policies enabled

**Test**:
- [ ] Visit Netlify URL
- [ ] Fill form → submit
- [ ] See success toast
- [ ] Check Render logs (POST /api/submissions)
- [ ] Verify Supabase entry
