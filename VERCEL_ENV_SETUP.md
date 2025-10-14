# Vercel Environment Variables Configuration

## CRITICAL: Set this in Vercel Dashboard

Go to: https://vercel.com/dashboard → Your Project → Settings → Environment Variables

Add the following variable for **Production**, **Preview**, and **Development**:

```
VITE_API_URL=https://sgts-farmashaio-api.onrender.com
```

**Important Notes:**
- The variable MUST start with `VITE_` to be exposed to the frontend
- The URL is `sgts-farmashaio-api.onrender.com` (with `-api`)
- NO trailing slash
- Apply to all environments (Production, Preview, Development)

## After Adding the Variable:

1. Go to Deployments
2. Click on the latest deployment
3. Click "Redeploy"
4. Select "Use existing Build Cache" = NO (force rebuild)

## Verification:

Once deployed, the frontend will use:
- **Production**: `https://sgts-farmashaio-api.onrender.com` (from env var or fallback)
- **Local Dev**: `http://localhost:5000` (from `.env` file)

## Current Configuration:

### Frontend `.env` (for local development):
```
VITE_API_URL=http://localhost:5000
```

### Frontend `constants.js` (fallback for production):
```javascript
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://sgts-farmashaio-api.onrender.com';
```

This ensures that even if the Vercel env var is not set, it will use the correct production URL.
