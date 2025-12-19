# 🚢 Deployment Guide

## Deploying to Vercel (Recommended)

Vercel is the recommended platform as it's made by the Next.js team.

### Prerequisites
- GitHub account
- Vercel account (free at [vercel.com](https://vercel.com))
- Code pushed to GitHub repository

### Step-by-Step

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/aether-board.git
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Configure Environment Variables**
   - In project settings, go to "Environment Variables"
   - Add:
     ```
     NEXT_PUBLIC_SUPABASE_URL = your_production_supabase_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY = your_production_anon_key
     ```
   - Click "Save"

4. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Your site is live! 🎉

5. **Configure Domain (Optional)**
   - Go to Settings → Domains
   - Add your custom domain
   - Update DNS records as instructed

### Automatic Deployments

Every push to `main` branch will automatically deploy:
```bash
git add .
git commit -m "Update feature"
git push
# Vercel automatically deploys!
```

## Deploying to Netlify

### Setup

1. **Build Settings**
   ```
   Build command: npm run build
   Publish directory: .next
   ```

2. **Environment Variables**
   - Add the same Supabase credentials
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY

3. **Deploy**
   - Connect GitHub repository
   - Click "Deploy site"

### netlify.toml (Optional)

Create `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

## Deploying to Railway

Railway offers great PostgreSQL hosting alongside your app.

### Setup

1. **Create Project**
   - Go to [railway.app](https://railway.app)
   - Click "New Project"
   - Select "Deploy from GitHub repo"

2. **Configure**
   ```
   Build Command: npm run build
   Start Command: npm start
   ```

3. **Environment Variables**
   - Add Supabase credentials
   - Railway will provide a public URL

## Self-Hosting with Docker

### Dockerfile

```dockerfile
FROM node:18-alpine AS base

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Build application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

### docker-compose.yml

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
      - NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
    restart: unless-stopped
```

### Deploy

```bash
# Build
docker build -t aether-board .

# Run
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=your_url \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key \
  aether-board

# Or with docker-compose
docker-compose up -d
```

## Post-Deployment Checklist

### Security
- [ ] All environment variables set correctly
- [ ] No sensitive data in code
- [ ] Supabase RLS policies enabled
- [ ] OAuth redirect URLs updated

### Performance
- [ ] Enable Vercel Analytics (optional)
- [ ] Configure CDN for static assets
- [ ] Enable gzip/brotli compression
- [ ] Set up monitoring (Sentry, LogRocket, etc.)

### Supabase Production Setup
- [ ] Update OAuth redirect URLs in Supabase:
  ```
  https://your-domain.com/auth/callback
  ```
- [ ] Configure custom SMTP for emails (optional)
- [ ] Set up database backups
- [ ] Enable Connection Pooling if needed

### Domain Configuration

If using custom domain:

1. **Add to Vercel**
   - Settings → Domains
   - Add your domain
   - Get DNS records

2. **Update DNS**
   ```
   Type: A
   Name: @
   Value: 76.76.21.21

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

3. **Update Supabase**
   - Add production URL to allowed redirect URLs
   - Update OAuth providers with new domain

## Monitoring & Analytics

### Vercel Analytics (Built-in)
```bash
# Install
npm install @vercel/analytics

# Add to layout.tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

### Error Tracking with Sentry

```bash
npm install @sentry/nextjs

# Follow setup wizard
npx @sentry/wizard -i nextjs
```

## CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm test
        
      - name: Build
        run: npm run build
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
        
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## Performance Optimization

### Next.js Config

```javascript
// next.config.js
module.exports = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['your-supabase-project.supabase.co'],
    formats: ['image/avif', 'image/webp'],
  },
  compress: true,
  poweredByHeader: false,
}
```

### Caching Strategy

```javascript
// Enable static generation where possible
export const revalidate = 60 // ISR: revalidate every 60 seconds
```

## Scaling Considerations

### Database
- Upgrade Supabase tier as needed
- Enable connection pooling (PgBouncer)
- Add read replicas for scaling reads
- Monitor query performance

### CDN
- Use Vercel's Edge Network (automatic)
- Or CloudFlare CDN for additional caching

### WebSocket Scaling
- Supabase Realtime scales automatically
- Monitor concurrent connections
- Consider connection limits per plan

## Troubleshooting Deployment

### Build fails
```bash
# Check build locally first
npm run build

# Check logs in Vercel dashboard
```

### Environment variables not working
- Redeploy after adding variables
- Check variable names match exactly
- No quotes needed in Vercel UI

### Database connection issues
- Verify Supabase project URL is correct
- Check that database is accessible
- Verify RLS policies allow access

## Support

- Vercel: [vercel.com/support](https://vercel.com/support)
- Supabase: [supabase.com/docs](https://supabase.com/docs)
- Issues: Open a GitHub issue

---

**Happy deploying! 🚀**
