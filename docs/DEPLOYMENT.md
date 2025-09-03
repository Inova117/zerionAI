# 🚀 DEPLOYMENT GUIDE - SINTRA AI LATAM

## 📋 **PRE-DEPLOYMENT CHECKLIST**

### **✅ Required Setup**
- [ ] Supabase project configured
- [ ] Stripe account with products created
- [ ] Environment variables ready
- [ ] Database migrations executed
- [ ] DNS domain purchased (optional)

### **✅ Code Ready**
- [ ] All tests passing
- [ ] No TypeScript errors
- [ ] Production build successful
- [ ] Environment variables validated

---

## 🌐 **VERCEL DEPLOYMENT (Recommended)**

### **1. Initial Setup**

```bash
# Install Vercel CLI
npm i -g vercel@latest

# Login to Vercel
vercel login

# Initialize project
vercel
```

### **2. Configure Environment Variables**

In Vercel Dashboard → Settings → Environment Variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Stripe
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Price IDs (Production)
STRIPE_STARTER_PRICE_ID=price_...
STRIPE_PROFESSIONAL_PRICE_ID=price_...
STRIPE_ENTERPRISE_PRICE_ID=price_...

# App Configuration
NEXT_PUBLIC_SITE_URL=https://sintra-latam.vercel.app
NODE_ENV=production
```

### **3. Domain Configuration**

#### **Option A: Vercel Subdomain**
- Automatic: `sintra-latam.vercel.app`
- No additional setup needed

#### **Option B: Custom Domain**
```bash
# Add domain in Vercel dashboard
# Configure DNS records:
# Type: CNAME
# Name: @ (or subdomain)
# Value: cname.vercel-dns.com
```

### **4. Deploy**

```bash
# Automatic deployment via Git
git push origin main

# Or manual deployment
vercel --prod
```

---

## 🐳 **DOCKER DEPLOYMENT**

### **1. Create Dockerfile**

```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### **2. Build and Run**

```bash
# Build image
docker build -t sintra-latam .

# Run container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=your_url \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key \
  # ... other env vars
  sintra-latam
```

---

## ☁️ **AWS DEPLOYMENT**

### **1. Using AWS Amplify**

```bash
# Install Amplify CLI
npm install -g @aws-amplify/cli

# Initialize
amplify init

# Add hosting
amplify add hosting

# Deploy
amplify publish
```

### **2. Using EC2 + Nginx**

```bash
# 1. Launch EC2 instance (Ubuntu 22.04)
# 2. Install Node.js and dependencies
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs nginx

# 3. Clone and build
git clone https://github.com/your-repo/sintra-latam.git
cd sintra-latam
npm install
npm run build

# 4. Configure Nginx
sudo nano /etc/nginx/sites-available/sintra-latam

# 5. Start services
sudo systemctl enable nginx
sudo systemctl start nginx
pm2 start npm --name "sintra-latam" -- start
pm2 startup
pm2 save
```

**Nginx Configuration:**
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 📊 **POST-DEPLOYMENT SETUP**

### **1. Update External Services**

#### **Supabase Configuration**
```sql
-- Update Auth Settings
-- Site URL: https://your-domain.com
-- Redirect URLs:
--   - https://your-domain.com/dashboard
--   - https://your-domain.com/login
--   - https://your-domain.com/auth/callback
```

#### **Stripe Configuration**
```bash
# Update webhook endpoint
# URL: https://your-domain.com/api/billing/webhooks
# Events: (same as development)
```

### **2. DNS Configuration**

```dns
# A Record
Type: A
Name: @
Value: your-server-ip

# CNAME (for Vercel)
Type: CNAME  
Name: @
Value: cname.vercel-dns.com

# SSL (Let's Encrypt)
sudo certbot --nginx -d your-domain.com
```

### **3. Monitoring Setup**

#### **Uptime Monitoring**
```bash
# UptimeRobot
curl -X POST "https://api.uptimerobot.com/v2/newMonitor" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "api_key=your_api_key&format=json&type=1&url=https://your-domain.com&friendly_name=Sintra LATAM"
```

#### **Error Tracking (Sentry)**
```bash
npm install @sentry/nextjs

# Add to next.config.js
const { withSentryConfig } = require('@sentry/nextjs');
module.exports = withSentryConfig(nextConfig, sentryWebpackPluginOptions);
```

---

## 🔒 **SECURITY HARDENING**

### **1. Environment Security**
```bash
# Rotate all API keys
# Use separate production keys
# Enable 2FA on all services
# Set up IP whitelisting where possible
```

### **2. Application Security**
```typescript
// Add to next.config.js
const nextConfig = {
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'Referrer-Policy',
          value: 'origin-when-cross-origin',
        },
        {
          key: 'Content-Security-Policy',
          value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval';",
        },
      ],
    },
  ],
};
```

### **3. Database Security**
```sql
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Backup strategy
-- Enable point-in-time recovery
-- Set up automated backups
```

---

## 📈 **PERFORMANCE OPTIMIZATION**

### **1. CDN Configuration**
```bash
# Vercel: Automatic global CDN
# CloudFlare: Add domain to CloudFlare
# AWS CloudFront: Configure distribution
```

### **2. Database Optimization**
```sql
-- Add database indexes
CREATE INDEX CONCURRENTLY idx_messages_conversation_created 
ON messages(conversation_id, created_at);

CREATE INDEX CONCURRENTLY idx_conversations_user_updated
ON conversations(user_id, updated_at);
```

### **3. Image Optimization**
```typescript
// next.config.js
const nextConfig = {
  images: {
    domains: ['your-domain.com'],
    formats: ['image/webp', 'image/avif'],
  },
};
```

---

## 🧪 **TESTING IN PRODUCTION**

### **1. Smoke Tests**
```bash
# Health check endpoint
curl https://your-domain.com/api/health

# Authentication flow
# Registration flow  
# Payment flow
# Chat functionality
```

### **2. Load Testing**
```bash
# Using k6
k6 run --vus 10 --duration 30s load-test.js

# Using artillery
artillery run artillery-config.yml
```

---

## 🚨 **TROUBLESHOOTING**

### **Common Deployment Issues**

#### **Build Failures**
```bash
# TypeScript errors
npx tsc --noEmit

# Missing environment variables
vercel env ls

# Memory issues
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"
```

#### **Runtime Errors**
```bash
# Check Vercel logs
vercel logs

# Check Supabase logs
# Go to Supabase Dashboard → Logs

# Check Stripe webhooks
# Go to Stripe Dashboard → Webhooks → View attempts
```

#### **Performance Issues**
```bash
# Analyze bundle size
npm run analyze

# Check Core Web Vitals
# Use PageSpeed Insights
# Use Vercel Speed Insights
```

---

## 📊 **SUCCESS METRICS**

### **Technical KPIs**
- ✅ **Uptime**: >99.5%
- ✅ **Response Time**: <500ms avg
- ✅ **Error Rate**: <1%
- ✅ **Build Time**: <3 minutes

### **Business KPIs**  
- 🎯 **First 24h**: 10+ registrations
- 🎯 **First Week**: 50+ users, 5+ paid
- 🎯 **First Month**: 200+ users, 25+ paid

---

## 🎉 **LAUNCH CHECKLIST**

### **Pre-Launch (Final Check)**
- [ ] ✅ All environment variables configured
- [ ] ✅ Database migrations applied
- [ ] ✅ Stripe webhooks configured
- [ ] ✅ Domain and SSL working
- [ ] ✅ Auth flows tested
- [ ] ✅ Payment flows tested
- [ ] ✅ Monitoring enabled

### **Launch Day**
- [ ] 🚀 Deploy to production
- [ ] 📊 Monitor error rates
- [ ] 💬 Monitor user feedback
- [ ] 🔄 Be ready for quick fixes

### **Post-Launch (48h)**
- [ ] 📈 Analyze usage metrics
- [ ] 🐛 Fix any critical issues
- [ ] 💡 Gather user feedback
- [ ] 📝 Document lessons learned

**¡La aplicación está lista para producción! 🎉**
