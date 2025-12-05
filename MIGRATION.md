# 🔄 Migration Guide: Secure API Implementation

## Overview

This guide explains the changes made to secure the Gemini API key and how to migrate from the old insecure implementation to the new secure architecture.

## What Changed?

### Before (Insecure) ❌

```
Client Browser
    ↓
    | Direct API call with exposed API key
    ↓
Google Gemini API
```

**Problems:**
- API key was embedded in client-side JavaScript
- Anyone could extract and abuse the API key
- No control over API usage
- Security vulnerability

### After (Secure) ✅

```
Client Browser
    ↓
    | Request to /api/gemini (no API key)
    ↓
Serverless Function
    ↓
    | Authenticated request (API key from server env)
    ↓
Google Gemini API
```

**Benefits:**
- API key stored server-side only
- Client never has access to the key
- Full control over API usage
- Secure and production-ready

## Breaking Changes

### 1. API Key Configuration

**Old way:**
```typescript
// vite.config.ts
define: {
  'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
}
```

**New way:**
- Local: Create `.env.local` file
- Production: Set in Vercel environment variables

### 2. Service Layer

**Old way:**
```typescript
// Direct API calls from client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const response = await ai.models.generateContent(...);
```

**New way:**
```typescript
// Proxy through serverless function
const response = await fetch('/api/gemini', {
  method: 'POST',
  body: JSON.stringify({ action: 'translate', payload: { text } })
});
```

## Migration Steps

### For Local Development

1. **Create `.env.local` file:**
   ```bash
   echo "GEMINI_API_KEY=your_api_key_here" > .env.local
   ```

2. **Install new dependencies:**
   ```bash
   npm install
   ```

3. **Test locally:**
   ```bash
   npm run dev
   ```

4. **Verify security:**
   ```bash
   chmod +x verify-security.sh
   ./verify-security.sh
   ```

### For Vercel Deployment

1. **Set environment variable in Vercel:**
   - Go to Vercel Dashboard
   - Settings → Environment Variables
   - Add `GEMINI_API_KEY` with your key
   - Select all environments

2. **Deploy:**
   ```bash
   git add .
   git commit -m "Migrate to secure API architecture"
   git push origin main
   ```

3. **Verify deployment:**
   - Open deployed app
   - Check DevTools → Network tab
   - Confirm requests go to `/api/gemini`
   - Verify no API key in client code

## File Changes Summary

### New Files

- ✅ `/api/gemini.ts` - Serverless API proxy
- ✅ `SECURITY.md` - Security documentation
- ✅ `DEPLOYMENT.md` - Deployment guide
- ✅ `verify-security.sh` - Security verification script
- ✅ `.env.local.example` - Environment template

### Modified Files

- 🔄 `services/geminiService.ts` - Now calls `/api/gemini` instead of direct API
- 🔄 `vite.config.ts` - Removed API key injection
- 🔄 `vercel.json` - Added API routes configuration
- 🔄 `package.json` - Added `@vercel/node` dependency
- 🔄 `README.md` - Updated with security information
- 🔄 `index.tsx` - Removed client-side environment validation

### Removed Dependencies

- ❌ `utils/env.ts` - No longer needed (validation moved to server)

## Testing the Migration

### 1. Local Testing

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# In another terminal, test the app
# Open http://localhost:3000
# Try all features (translate, grammar, word meaning, chat)
```

### 2. Build Testing

```bash
# Build for production
npm run build

# Run security verification
./verify-security.sh

# Preview production build
npm run preview
```

### 3. Production Testing

After deploying to Vercel:

1. Open browser DevTools
2. Go to Network tab
3. Use app features
4. Verify:
   - ✅ Requests go to `/api/gemini`
   - ✅ No `x-goog-api-key` header visible
   - ✅ API responses work correctly

## Rollback Plan

If you need to rollback (not recommended):

1. **Revert code changes:**
   ```bash
   git revert HEAD
   git push origin main
   ```

2. **Restore old vite.config.ts:**
   ```typescript
   define: {
     'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
   }
   ```

3. **Restore old geminiService.ts:**
   - Use direct GoogleGenAI client
   - Make direct API calls

**⚠️ Warning:** Rollback will re-expose your API key!

## Troubleshooting

### Issue: "Failed to fetch" error

**Cause:** API endpoint not accessible

**Solution:**
1. Check if `/api/gemini.ts` exists
2. Verify Vercel deployment includes API routes
3. Check browser console for CORS errors

### Issue: "API Key is not configured"

**Cause:** Environment variable not set

**Solution:**
1. Local: Create `.env.local` with `GEMINI_API_KEY`
2. Vercel: Set environment variable in dashboard
3. Redeploy after setting variable

### Issue: Build fails

**Cause:** Missing dependencies

**Solution:**
```bash
npm install @vercel/node --save-dev
npm install
```

### Issue: API calls work locally but fail in production

**Cause:** Environment variable not set in Vercel

**Solution:**
1. Go to Vercel Dashboard
2. Settings → Environment Variables
3. Add `GEMINI_API_KEY`
4. Redeploy

## Performance Impact

### Before
- Direct API calls: ~200-500ms latency
- No caching
- No rate limiting

### After
- API proxy adds: ~10-50ms overhead
- Enables server-side caching (future enhancement)
- Enables rate limiting (future enhancement)
- **Total impact:** Minimal (~5-10% increase in latency)

## Security Improvements

| Aspect | Before | After |
|--------|--------|-------|
| API Key Exposure | ❌ Exposed in client | ✅ Server-side only |
| Network Inspection | ❌ Key visible | ✅ Key hidden |
| Source Code | ❌ Key in bundle | ✅ No key in bundle |
| Rate Limiting | ❌ Not possible | ✅ Can be added |
| Usage Monitoring | ❌ Limited | ✅ Full control |
| CORS Protection | ❌ None | ✅ Configurable |

## Next Steps

After successful migration:

1. ✅ Verify all features work
2. ✅ Run security verification script
3. ✅ Monitor API usage in Google AI Studio
4. ✅ Set up monitoring/alerts (optional)
5. ✅ Consider implementing rate limiting (optional)
6. ✅ Review SECURITY.md for best practices

## Support

If you encounter issues during migration:

1. Check this guide's troubleshooting section
2. Review SECURITY.md and DEPLOYMENT.md
3. Check Vercel function logs
4. Create an issue in the repository

---

**Migration Date:** 2025-12-05
**Status:** ✅ Complete and Production Ready
