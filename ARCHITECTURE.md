# Architecture Diagrams

## Before: Insecure Architecture ❌

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT BROWSER                        │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │         JavaScript Bundle (Built by Vite)          │    │
│  │                                                     │    │
│  │  const apiKey = "AIzaSyAZNeVmrKLS_..."  ← EXPOSED!│    │
│  │  const ai = new GoogleGenAI({ apiKey })            │    │
│  │                                                     │    │
│  │  ⚠️  API KEY VISIBLE IN:                          │    │
│  │  • DevTools → Sources                              │    │
│  │  • DevTools → Network (x-goog-api-key header)     │    │
│  │  • Production bundle files                         │    │
│  └────────────────────────────────────────────────────┘    │
│                           │                                  │
│                           │ Direct API Call                  │
│                           │ (with exposed API key)           │
└───────────────────────────┼──────────────────────────────────┘
                            │
                            ▼
                ┌───────────────────────┐
                │   Google Gemini API   │
                │                       │
                │  ✅ Receives request  │
                │  ❌ Key was exposed!  │
                └───────────────────────┘

PROBLEMS:
🔴 API key embedded in client JavaScript
🔴 Anyone can extract and abuse the key
🔴 No control over API usage
🔴 Potential for unauthorized costs
```

---

## After: Secure Architecture ✅

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT BROWSER                        │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │         JavaScript Bundle (Built by Vite)          │    │
│  │                                                     │    │
│  │  // NO API KEY HERE! ✅                           │    │
│  │  const response = await fetch('/api/gemini', {     │    │
│  │    method: 'POST',                                 │    │
│  │    body: JSON.stringify({                          │    │
│  │      action: 'translate',                          │    │
│  │      payload: { text: '...' }                      │    │
│  │    })                                               │    │
│  │  })                                                 │    │
│  │                                                     │    │
│  │  ✅ NO API KEY IN CLIENT CODE                     │    │
│  └────────────────────────────────────────────────────┘    │
│                           │                                  │
│                           │ POST /api/gemini                 │
│                           │ (no API key needed)              │
└───────────────────────────┼──────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    VERCEL SERVERLESS FUNCTION                │
│                      /api/gemini.ts                          │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  export default async function handler(req, res) { │    │
│  │                                                     │    │
│  │    // 1. Get API key from server environment       │    │
│  │    const apiKey = process.env.GEMINI_API_KEY       │    │
│  │    // ✅ Only accessible on server!                │    │
│  │                                                     │    │
│  │    // 2. Validate request                          │    │
│  │    const { action, payload } = req.body            │    │
│  │                                                     │    │
│  │    // 3. Call Gemini API with secure key           │    │
│  │    const ai = new GoogleGenAI({ apiKey })          │    │
│  │    const result = await ai.models.generateContent()│    │
│  │                                                     │    │
│  │    // 4. Return result to client                   │    │
│  │    return res.json({ success: true, data: result })│    │
│  │  }                                                  │    │
│  └────────────────────────────────────────────────────┘    │
│                           │                                  │
│                           │ Authenticated Request            │
│                           │ (with secure API key)            │
└───────────────────────────┼──────────────────────────────────┘
                            │
                            ▼
                ┌───────────────────────┐
                │   Google Gemini API   │
                │                       │
                │  ✅ Receives request  │
                │  ✅ Key is secure!    │
                └───────────────────────┘

BENEFITS:
✅ API key stored server-side only
✅ Client never has access to the key
✅ Full control over API usage
✅ Can add rate limiting
✅ Can add caching
✅ Can add monitoring
```

---

## Request Flow Comparison

### Before (Insecure)

```
User Action
    │
    ▼
┌─────────────────┐
│  React Component│
│                 │
│  onClick={() => {
│    const result = await translateAndCheck(text)
│  }}
└────────┬────────┘
         │
         ▼
┌─────────────────────────┐
│  geminiService.ts       │
│                         │
│  const ai = new         │
│    GoogleGenAI({        │
│      apiKey: process    │  ← API KEY EXPOSED!
│        .env.API_KEY     │
│    })                   │
│                         │
│  await ai.models        │
│    .generateContent()   │
└────────┬────────────────┘
         │
         │ HTTPS Request
         │ Header: x-goog-api-key: AIzaSy...  ← VISIBLE!
         │
         ▼
┌─────────────────────────┐
│  Google Gemini API      │
└─────────────────────────┘
```

### After (Secure)

```
User Action
    │
    ▼
┌─────────────────┐
│  React Component│
│                 │
│  onClick(() => {
│    const result = await translateAndCheck(text)
│  }}
└────────┬────────┘
         │
         ▼
┌─────────────────────────┐
│  geminiService.ts       │
│                         │
│  await fetch(           │
│    '/api/gemini',       │
│    {                    │
│      method: 'POST',    │  ← NO API KEY!
│      body: JSON         │
│        .stringify({     │
│          action,        │
│          payload        │
│        })               │
│    }                    │
│  )                      │
└────────┬────────────────┘
         │
         │ POST /api/gemini
         │ Body: { action: 'translate', payload: {...} }
         │ ← NO API KEY IN REQUEST!
         │
         ▼
┌─────────────────────────┐
│  Vercel Function        │
│  /api/gemini.ts         │
│                         │
│  const apiKey =         │
│    process.env          │  ← SECURE! Server-side only
│      .GEMINI_API_KEY    │
│                         │
│  const ai = new         │
│    GoogleGenAI({        │
│      apiKey             │
│    })                   │
│                         │
│  const result =         │
│    await ai.models      │
│      .generateContent() │
└────────┬────────────────┘
         │
         │ HTTPS Request
         │ Header: x-goog-api-key: [SECURE]
         │ ← API KEY NEVER LEAVES SERVER!
         │
         ▼
┌─────────────────────────┐
│  Google Gemini API      │
└─────────────────────────┘
```

---

## Environment Variables Flow

### Development (Local)

```
.env.local (gitignored)
    │
    │ GEMINI_API_KEY=AIzaSy...
    │
    ▼
Vercel Dev Server (npm run dev)
    │
    ├─→ Client: NO ACCESS to env vars ✅
    │
    └─→ Serverless Function: HAS ACCESS ✅
            │
            └─→ process.env.GEMINI_API_KEY
```

### Production (Vercel)

```
Vercel Dashboard
    │
    │ Environment Variables
    │ GEMINI_API_KEY = AIzaSy...
    │
    ▼
Vercel Production Environment
    │
    ├─→ Static Files (dist/): NO API KEY ✅
    │
    └─→ Serverless Functions: HAS ACCESS ✅
            │
            └─→ process.env.GEMINI_API_KEY
```

---

## Security Layers

```
┌─────────────────────────────────────────────────────────┐
│                    SECURITY LAYERS                       │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Layer 1: Client-Side Protection                        │
│  ┌────────────────────────────────────────────────┐    │
│  │ ✅ No API key in JavaScript bundle             │    │
│  │ ✅ No API key in environment variables         │    │
│  │ ✅ No API key in localStorage/sessionStorage   │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  Layer 2: Network Protection                            │
│  ┌────────────────────────────────────────────────┐    │
│  │ ✅ No API key in request headers               │    │
│  │ ✅ No API key in request body                  │    │
│  │ ✅ No API key in URL parameters                │    │
│  │ ✅ CORS headers configured                     │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  Layer 3: Server-Side Protection                        │
│  ┌────────────────────────────────────────────────┐    │
│  │ ✅ API key in environment variables only       │    │
│  │ ✅ Input validation on all endpoints           │    │
│  │ ✅ Error messages don't leak sensitive info    │    │
│  │ ✅ Rate limiting ready (can be added)          │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  Layer 4: Build-Time Protection                         │
│  ┌────────────────────────────────────────────────┐    │
│  │ ✅ .env.local is gitignored                    │    │
│  │ ✅ No API key injection in Vite config         │    │
│  │ ✅ Security verification script                │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## File Structure

```
ailan-1/
│
├── 🔒 SECURITY FILES (New)
│   ├── api/
│   │   └── gemini.ts              ← Serverless API proxy (CRITICAL)
│   ├── .env.local                 ← API key (gitignored, local only)
│   ├── .env.local.example         ← Template
│   ├── SECURITY.md                ← Security documentation
│   ├── DEPLOYMENT.md              ← Deployment guide
│   ├── MIGRATION.md               ← Migration guide
│   ├── SECURITY_FIX_SUMMARY.md    ← Executive summary
│   ├── QUICK_REFERENCE.md         ← Quick reference
│   ├── README_VI.md               ← Vietnamese summary
│   └── verify-security.sh         ← Security check script
│
├── 🔄 MODIFIED FILES
│   ├── services/
│   │   └── geminiService.ts       ← Now calls /api/gemini
│   ├── vite.config.ts             ← Removed API key injection
│   ├── vercel.json                ← Added API routes config
│   ├── package.json               ← Added @vercel/node
│   ├── index.tsx                  ← Removed client env validation
│   ├── README.md                  ← Updated with security info
│   └── CHANGELOG.md               ← Added security fix entry
│
└── ❌ REMOVED FILES
    └── utils/env.ts               ← No longer needed
```

---

**Created:** 2025-12-05  
**Purpose:** Visual explanation of security architecture
