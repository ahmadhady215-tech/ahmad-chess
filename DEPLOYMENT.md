# 🚢 Deployment Guide

## Deploying to Netlify (Recommended)

Netlify provides excellent support for Next.js applications with automated builds and global distribution.

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

2. **Import to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add New Site" -> "Import an existing project"
   - Import your GitHub repository
   - Netlify will auto-detect Next.js settings

3. **Configure Environment Variables**
   - In site settings, go to "Environment variables"
   - Add:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

4. **Deploy**
   - Click "Deploy site"
   - Your site will be live on a generated subdomain!

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

## Monitoring & Analytics

### Error Tracking with Sentry

```bash
npm install @sentry/nextjs

# Follow setup wizard
npx @sentry/wizard - i nextjs
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
```

## Troubleshooting Deployment

### Build fails
```bash
# Check build locally first
npm run build
```

### Environment variables not working
- Redeploy after adding variables
- Check variable names match exactly

### Database connection issues
- Verify Supabase project URL is correct
- Check that database is accessible
- Verify RLS policies allow access

## Support

- Supabase: [supabase.com/docs](https://supabase.com/docs)
- Issues: Open a GitHub issue

---

**Happy deploying! 🚀**
