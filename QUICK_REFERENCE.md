# ⚡ Quick Reference - Deployment & Security

## 🚨 URGENT: First-Time Setup

### 1. Revoke Exposed API Key
```
1. Go to: https://ai.studio
2. Find key: AIzaSy********************* (exposed key)
3. Click "Delete" or "Revoke"
4. Generate new key
```

### 2. Deploy to Vercel
```bash
# Push to GitHub
git add .
git commit -m "Fix: Secure API key implementation"
git push origin main

# Then in Vercel Dashboard:
# Settings → Environment Variables
# Add: GEMINI_API_KEY = <your_new_key>
# Deploy!
```

---

## 🔍 Quick Security Check

```bash
# Run this before every deployment
./verify-security.sh
```

**Expected output:**
```
✓ .env.local is properly gitignored
✓ Build successful
✓ No API key patterns found in build output
✓ API proxy file exists
✓ Vite config is secure
```

---

## 🛠️ Local Development

```bash
# 1. Create .env.local (first time only)
echo "GEMINI_API_KEY=your_new_key_here" > .env.local

# 2. Install dependencies
npm install

# 3. Run dev server
npm run dev

# 4. Open browser
# http://localhost:3000
```

---

## 🚀 Production Deployment

### Vercel Environment Variables

| Variable | Value | Environment |
|----------|-------|-------------|
| `GEMINI_API_KEY` | Your API key | All (Prod, Preview, Dev) |

### Deployment Commands

```bash
# Deploy to production
git push origin main

# Check deployment status
# Go to: https://vercel.com/dashboard

# View logs
# Vercel Dashboard → Deployments → View Logs
```

---

## 🔒 Security Verification

### In Browser DevTools

1. **Network Tab:**
   - ✅ Requests to `/api/gemini` (not `generativelanguage.googleapis.com`)
   - ✅ No `x-goog-api-key` header
   - ✅ No API key in request/response

2. **Sources Tab:**
   - ✅ Search for "AIzaSy" → No results
   - ✅ Search for "GEMINI_API_KEY" → No results

3. **Console Tab:**
   - ✅ No API key logged
   - ✅ No errors

---

## 📁 File Structure

```
ailan-1/
├── api/
│   └── gemini.ts          ← Serverless API proxy (CRITICAL)
├── services/
│   └── geminiService.ts   ← Client service (calls /api/gemini)
├── .env.local             ← Local API key (GITIGNORED)
├── .env.local.example     ← Template
├── vercel.json            ← Vercel config
├── SECURITY.md            ← Security docs
├── DEPLOYMENT.md          ← Deployment guide
└── verify-security.sh     ← Security check script
```

---

## 🐛 Troubleshooting

### "API Key is not configured"

**Local:**
```bash
# Check .env.local exists
ls -la .env.local

# If not, create it
echo "GEMINI_API_KEY=your_key" > .env.local
```

**Production:**
```
1. Vercel Dashboard
2. Settings → Environment Variables
3. Verify GEMINI_API_KEY is set
4. Redeploy
```

### "Failed to fetch /api/gemini"

**Check:**
1. Is `/api/gemini.ts` file present?
2. Did you deploy to Vercel?
3. Check Vercel function logs

**Fix:**
```bash
# Verify file exists
ls -la api/gemini.ts

# Redeploy
git push origin main
```

### Build Fails

```bash
# Install dependencies
npm install

# Try building locally
npm run build

# Check for errors in output
```

---

## 📊 Monitoring

### Google AI Studio
- URL: https://ai.studio
- Check: API usage, quotas, costs
- Set: Usage alerts

### Vercel Dashboard
- URL: https://vercel.com/dashboard
- Check: Deployments, function logs, analytics
- Monitor: Error rates, response times

---

## ⚙️ Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview production build

# Security
./verify-security.sh     # Run security checks
chmod +x verify-security.sh  # Make script executable

# Git
git status               # Check changes
git add .                # Stage all changes
git commit -m "message"  # Commit changes
git push origin main     # Deploy to production
```

---

## 🔑 API Key Management

### Generate New Key
1. Go to https://ai.studio
2. Click "Get API Key"
3. Click "Create API Key"
4. Copy the key

### Update Key

**Local:**
```bash
# Edit .env.local
echo "GEMINI_API_KEY=new_key_here" > .env.local
```

**Vercel:**
```
1. Vercel Dashboard
2. Settings → Environment Variables
3. Click "Edit" on GEMINI_API_KEY
4. Paste new key
5. Save
6. Redeploy
```

### Revoke Key
1. Go to https://ai.studio
2. Find the key
3. Click "Delete" or "Revoke"

---

## 📞 Support Resources

- **Security Guide:** [SECURITY.md](SECURITY.md)
- **Deployment Guide:** [DEPLOYMENT.md](DEPLOYMENT.md)
- **Migration Guide:** [MIGRATION.md](MIGRATION.md)
- **Vercel Docs:** https://vercel.com/docs
- **Gemini API Docs:** https://ai.google.dev/docs

---

## ✅ Pre-Deployment Checklist

- [ ] Run `./verify-security.sh`
- [ ] All tests pass
- [ ] `.env.local` is gitignored
- [ ] No API key in git history
- [ ] Environment variables set in Vercel
- [ ] Code pushed to GitHub
- [ ] Deployment successful
- [ ] Production verification complete

---

**Last Updated:** 2025-12-05  
**Quick Help:** Run `./verify-security.sh` for instant security check
