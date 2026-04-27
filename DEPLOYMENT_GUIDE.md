## 🔧 IMPORTANT: Supabase Database Setup

### Étape 1: Créer la table dans Supabase

1. Allez sur Supabase → Votre projet → **SQL Editor**
2. Exécutez le SQL depuis `backend/server.js` (lignes 54-79) OU utilisez le fichier de migration:
   ```sql
   -- Copiez-collez le SQL complet de server.js lignes 54-79
   CREATE TABLE submissions (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
     recharge_type VARCHAR(50) NOT NULL,
     recharge_code TEXT NOT NULL,
     currency VARCHAR(10) NOT NULL,
     email VARCHAR(255) NOT NULL,
     status VARCHAR(20) DEFAULT 'pending',
     approval_token VARCHAR(255),
     reject_token VARCHAR(255),
     verified_at TIMESTAMP WITH TIME ZONE,
     ip_address INET,
     user_agent TEXT,
     metadata JSONB
   );
   
   CREATE INDEX idx_submissions_status ON submissions(status);
   CREATE INDEX idx_submissions_created_at ON submissions(created_at DESC);
   CREATE INDEX idx_submissions_email ON submissions(email);
   CREATE INDEX idx_submissions_approval_token ON submissions(approval_token);
   CREATE INDEX idx_submissions_reject_token ON submissions(reject_token);
   
   ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
   
   CREATE POLICY "Public insert only" ON submissions
     FOR INSERT WITH CHECK (true);
   
   CREATE POLICY "Service role full access" ON submissions
     FOR ALL USING (auth.jwt() ? true : false);
   ```

### Étape 2: Si la table existe déjà mais sans colonnes

Si vous avez une erreur: `"Could not find the 'approval_token' column"`, exécutez la migration:
```sql
-- backend/migration-add-columns.sql
ALTER TABLE submissions 
ADD COLUMN IF NOT EXISTS approval_token VARCHAR(255);
ADD COLUMN IF NOT EXISTS reject_token VARCHAR(255);
ADD COLUMN IF NOT EXISTS ip_address INET;
ADD COLUMN IF NOT EXISTS user_agent TEXT;
ADD COLUMN IF NOT EXISTS metadata JSONB;
```

---

## 🚀 Backend Deployment (Render)

1. **Deploy** from GitHub: `Reine-chimene/backend-verification`
2. **Build command**: `npm install`
3. **Start command**: `npm start`
4. **Node version**: 18+ (Render uses 25 automatically)

### Environment Variables (ALL required):

| Variable | Value |
|----------|-------|
| `SUPABASE_URL` | `https://xxxx.supabase.co` |
| `SUPABASE_ANON_KEY` | `eyJ...` |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJ...` |
| `CLIENT_URL` | `https://rechargeverification.netlify.app` |
| `SMTP_HOST` | `smtp.gmail.com` |
| `SMTP_PORT` | `587` |
| `SMTP_USER` | your email |
| `SMTP_PASS` | 16-char app password |
| `REVIEWER_EMAIL` | reviewer email |
| `NODE_ENV` | `production` |

**⚠️ Critical**: 
- `SUPABASE_URL` must NOT have trailing `/`
- `CLIENT_URL` must include `https://` and match your Netlify URL exactly
- Use **Gmail App Password** (not regular password)

---

## 🔧 Frontend Configuration (Netlify)

### Environment Variable:

**Key**: `API_BASE_URL`  
**Value**: `https://verification-backend-66j0.onrender.com`

### Build Settings:

- **Build command**: `node netlify-build.js`
- **Publish directory**: `.` (root folder)

---

## 🐛 Troubleshooting CORS

If you see CORS errors:

1. **Check Render logs** for: `🔧 CORS configured for origins: [...]`
2. **Ensure `CLIENT_URL`** on Render matches your Netlify URL exactly
3. **Restart Render service** after changing env vars (not just rebuild)

---

## ✅ Testing Checklist

- [ ] **Supabase**: Table `submissions` exists with all columns
- [ ] **Render**: Service is Live (green)
- [ ] **Render Logs**: Show `✅ Connected to Supabase successfully`
- [ ] **Render Logs**: Show `🛣️  Registered routes:` with 4 routes
- [ ] **Health check**: `https://verification-backend-66j0.onrender.com/api/health` returns JSON
- [ ] **Netlify**: `API_BASE_URL` env var set correctly
- [ ] **Netlify**: `config.js` contains correct backend URL (check Sources tab)
- [ ] **Form submission**: Returns success toast, no CORS errors in Console

---

## 📞 Support

If issues persist:
1. Check Render Logs (real-time)
2. Check Netlify DevTools Console (F12)
3. Test API directly: `curl https://verification-backend-66j0.onrender.com/api/health`
