# 🚀 Deployment Guide - Vercel

## Prerequisites

- A Vercel account (sign up at [vercel.com](https://vercel.com))
- Your code pushed to a Git repository (GitHub, GitLab, or Bitbucket)
- A Gemini API key from [Google AI Studio](https://ai.studio)

## Step-by-Step Deployment

### 1. Prepare Your Repository

Ensure your code is committed and pushed to your Git repository:

```bash
git add .
git commit -m "Add secure API proxy for Gemini"
git push origin main
```

### 2. Import Project to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **"Import Project"**
3. Select your Git provider (GitHub, GitLab, or Bitbucket)
4. Find and select your repository
5. Click **"Import"**

### 3. Configure Project Settings

Vercel will auto-detect your project settings. Verify:

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 4. Set Environment Variables

**This is the most critical step for security!**

1. In the import screen, expand **"Environment Variables"**
2. Add the following variable:
   - **Name**: `GEMINI_API_KEY`
   - **Value**: Your actual Gemini API key (e.g., `AIzaSy...`)
   - **Environment**: Select all (Production, Preview, Development)

3. Click **"Add"**

### 5. Deploy

1. Click **"Deploy"**
2. Wait for the build to complete (usually 1-2 minutes)
3. Once deployed, you'll get a URL like `https://your-app.vercel.app`

### 6. Verify Deployment

After deployment, verify security:

1. Open your deployed app in a browser
2. Open DevTools (F12) → Network tab
3. Use any feature of the app
4. Check the network requests:
   - ✅ Requests should go to `/api/gemini`
   - ✅ No `x-goog-api-key` header should be visible
   - ✅ No API key in request/response bodies

5. Open DevTools → Sources tab
6. Search for your API key or "AIzaSy"
   - ✅ Should return no results

## Post-Deployment Configuration

### Custom Domain (Optional)

1. Go to your project in Vercel Dashboard
2. Click **"Settings"** → **"Domains"**
3. Add your custom domain
4. Follow DNS configuration instructions

### Environment Variables Management

To update your API key:

1. Go to Vercel Dashboard
2. Select your project
3. Go to **"Settings"** → **"Environment Variables"**
4. Find `GEMINI_API_KEY`
5. Click **"Edit"** or **"Delete"** and add a new one
6. **Important**: Redeploy for changes to take effect

### Automatic Deployments

Vercel automatically deploys:
- **Production**: When you push to `main` branch
- **Preview**: When you push to other branches or open a PR

## Troubleshooting

### Issue: "API Key is not configured"

**Solution:**
1. Verify `GEMINI_API_KEY` is set in Vercel environment variables
2. Make sure it's enabled for the correct environment (Production/Preview)
3. Redeploy the application

### Issue: API calls failing with 500 error

**Solution:**
1. Check Vercel Function Logs:
   - Go to your project → **"Deployments"**
   - Click on the latest deployment
   - Click **"Functions"** → **"View Logs"**
2. Look for error messages
3. Verify API key is valid in Google AI Studio

### Issue: CORS errors

**Solution:**
1. Check `api/gemini.ts` CORS headers
2. If using a custom domain, update `ALLOWED_ORIGIN` environment variable:
   - Name: `ALLOWED_ORIGIN`
   - Value: `https://yourdomain.com`

### Issue: Build fails

**Solution:**
1. Check build logs in Vercel
2. Verify all dependencies are in `package.json`
3. Test build locally: `npm run build`
4. Check Node.js version compatibility

## Monitoring & Maintenance

### View Logs

1. Go to Vercel Dashboard
2. Select your project
3. Click **"Deployments"**
4. Click on a deployment
5. View **"Build Logs"** or **"Function Logs"**

### Monitor API Usage

1. Go to [Google AI Studio](https://ai.studio)
2. Check your API usage and quotas
3. Set up alerts for unusual activity

### Performance Monitoring

Vercel provides built-in analytics:
1. Go to your project dashboard
2. Click **"Analytics"** tab
3. Monitor:
   - Page load times
   - Function execution times
   - Error rates

## Security Best Practices

- ✅ Never commit `.env.local` to Git
- ✅ Rotate API keys periodically
- ✅ Monitor API usage for anomalies
- ✅ Use Vercel's preview deployments for testing
- ✅ Enable Vercel's security features (DDoS protection, etc.)

## Rollback Procedure

If you need to rollback to a previous version:

1. Go to Vercel Dashboard → **"Deployments"**
2. Find the working deployment
3. Click **"⋯"** (three dots)
4. Click **"Promote to Production"**

## Cost Considerations

- **Vercel**: Free tier includes:
  - 100 GB bandwidth/month
  - Unlimited deployments
  - Serverless function executions (100 GB-hours)

- **Google Gemini API**: Check current pricing at [ai.studio](https://ai.studio)

## Support

- Vercel Documentation: [vercel.com/docs](https://vercel.com/docs)
- Vercel Support: [vercel.com/support](https://vercel.com/support)
- Project Issues: Create an issue in your repository

---

**Last Updated:** 2025-12-05
