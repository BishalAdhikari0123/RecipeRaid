# Recipe Raid Co-op - Deployment Guide 🚀

## Overview

This guide covers deploying Recipe Raid Co-op to production using recommended hosting providers.

## Architecture

- **Frontend (Next.js)**: Vercel
- **Backend (Express)**: Railway or Render
- **Database (PostgreSQL)**: Railway, Supabase, or Neon
- **Storage (Photos)**: Supabase Storage

---

## 🎨 Frontend Deployment (Vercel)

### Prerequisites
- GitHub account
- Vercel account (free tier available)

### Steps

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/recipe-raid.git
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to https://vercel.com
   - Click "Import Project"
   - Select your GitHub repository
   - Framework: Next.js (auto-detected)
   - Root Directory: `client`

3. **Environment Variables**
   Add in Vercel dashboard:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app/api
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live at `https://your-app.vercel.app`

### Automatic Deployments
- Every push to `main` branch triggers deployment
- Pull requests get preview deployments

---

## 🔧 Backend Deployment (Railway)

### Prerequisites
- Railway account (free tier: $5 credit/month)
- GitHub repository

### Steps

1. **Create Railway Project**
   - Go to https://railway.app
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

2. **Add PostgreSQL**
   - In your project, click "New"
   - Select "Database" → "PostgreSQL"
   - Note the connection credentials

3. **Configure Backend Service**
   - Click "New" → "GitHub Repo"
   - Select `server` directory as root
   - Railway auto-detects Node.js

4. **Environment Variables**
   Add in Railway dashboard:
   ```
   NODE_ENV=production
   PORT=5000
   
   # From Railway PostgreSQL plugin
   DB_HOST=${{Postgres.PGHOST}}
   DB_PORT=${{Postgres.PGPORT}}
   DB_NAME=${{Postgres.PGDATABASE}}
   DB_USER=${{Postgres.PGUSER}}
   DB_PASSWORD=${{Postgres.PGPASSWORD}}
   
   # Generate strong secret
   JWT_SECRET=your_super_secure_random_jwt_secret_min_32_chars
   JWT_EXPIRE=7d
   
   # From Supabase
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_KEY=your_supabase_service_role_key
   
   # Your Vercel URL
   CLIENT_URL=https://your-app.vercel.app
   ```

5. **Run Database Migrations**
   - Use Railway CLI or pgAdmin
   - Connect to PostgreSQL
   - Run: `server/database/schema.sql`
   - Run: `server/database/seed.sql` (optional)

6. **Deploy**
   - Railway automatically builds and deploys
   - Note your backend URL: `https://your-app.railway.app`

---

## 🔄 Alternative: Backend on Render

### Steps

1. **Create Render Account**
   - Go to https://render.com
   - Connect GitHub

2. **Create Web Service**
   - Click "New +" → "Web Service"
   - Connect repository
   - Root Directory: `server`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`

3. **Add PostgreSQL**
   - "New +" → "PostgreSQL"
   - Note connection string

4. **Environment Variables**
   Same as Railway (see above)

5. **Database Migration**
   - Use Render Shell or external tool
   - Run SQL files

---

## 🗄️ Database Options

### Option 1: Railway PostgreSQL
- ✅ Integrated with backend
- ✅ Automatic backups
- ✅ Free tier: 512MB
- Connection string provided automatically

### Option 2: Supabase PostgreSQL
- ✅ Same service as storage
- ✅ Free tier: 500MB
- ✅ Web interface
- ✅ Built-in auth (if needed later)

**Setup:**
1. Create Supabase project
2. Go to Settings → Database
3. Copy connection string
4. Run migrations via SQL Editor

### Option 3: Neon
- ✅ Serverless PostgreSQL
- ✅ Free tier: 3GB
- ✅ Excellent performance

**Setup:**
1. Create account at https://neon.tech
2. Create project
3. Copy connection string
4. Use client to run migrations

---

## 📦 Supabase Storage Setup

### Prerequisites
- Supabase account

### Steps

1. **Create Project**
   - Go to https://supabase.com
   - Create new project
   - Wait for setup (2-3 minutes)

2. **Create Storage Bucket**
   - Navigate to Storage
   - Click "New bucket"
   - Name: `recipe-raid`
   - Make it **public**

3. **Configure CORS** (if needed)
   ```sql
   -- In SQL Editor
   INSERT INTO storage.buckets (id, name, public)
   VALUES ('recipe-raid', 'recipe-raid', true);
   ```

4. **Set Policies**
   - Allow authenticated uploads
   - Allow public reads

5. **Get Credentials**
   - Settings → API
   - Copy Project URL
   - Copy anon/public key
   - Copy service role key (for backend)

---

## 🔐 Security Checklist

Before going live:

- [ ] Change all default passwords
- [ ] Use strong JWT secret (min 32 chars)
- [ ] Enable HTTPS only
- [ ] Set proper CORS origins
- [ ] Enable rate limiting
- [ ] Review database permissions
- [ ] Secure environment variables
- [ ] Enable Supabase RLS policies
- [ ] Set up monitoring
- [ ] Configure error logging

---

## 📊 Post-Deployment

### Testing

1. **Smoke Tests**
   ```bash
   # Test backend health
   curl https://your-backend.railway.app/health
   
   # Test frontend
   curl https://your-app.vercel.app
   ```

2. **User Flow Tests**
   - Register new account
   - Login
   - Create team
   - Start raid
   - Upload photo
   - Check leaderboard

### Monitoring

**Vercel:**
- Analytics tab (free)
- Build logs
- Function logs

**Railway/Render:**
- Deployment logs
- Metrics dashboard
- Alerts

**Supabase:**
- Storage usage
- Database size
- API requests

### Performance

1. **Database Indexes**
   - Verify all indexes created
   - Monitor slow queries

2. **CDN**
   - Vercel provides automatic CDN
   - Supabase provides CDN for storage

3. **Caching**
   - Next.js automatic caching
   - Consider Redis for API caching (future)

---

## 🔄 CI/CD Pipeline

### Automatic Deployments

**Frontend (Vercel):**
- Push to `main` → Production deploy
- Push to other branches → Preview deploy
- Pull request → Preview URL in comment

**Backend (Railway/Render):**
- Push to `main` → Production deploy
- Manual deploys available
- Rollback capability

### GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run tests
        run: |
          cd server && npm test
          cd ../client && npm test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to production
        run: echo "Deploying..."
```

---

## 💰 Cost Estimates

### Free Tier Setup
- **Vercel**: Free (hobby plan)
- **Railway**: $5 credit/month (renews)
- **Supabase**: Free (2GB storage, 500MB DB)
- **Total**: $0-5/month for MVP

### Paid Tier (Growing)
- **Vercel Pro**: $20/month
- **Railway**: ~$10-30/month (usage-based)
- **Supabase Pro**: $25/month
- **Total**: $55-75/month

### Enterprise Scale
- Custom pricing for all services
- Dedicated database
- Premium support

---

## 🐛 Troubleshooting

### "Cannot connect to database"
- Check connection string
- Verify firewall rules
- Check IP whitelist (if applicable)
- Test with direct connection tool

### "CORS error"
- Add frontend URL to backend CORS
- Check protocol (http vs https)
- Verify environment variables

### "JWT token invalid"
- Ensure JWT_SECRET matches
- Check token expiration
- Verify header format

### "File upload fails"
- Check Supabase bucket public setting
- Verify storage policies
- Check file size limits
- Ensure correct API keys

### "Build fails"
- Check Node.js version compatibility
- Verify all dependencies installed
- Review build logs
- Check environment variables

---

## 📝 Maintenance

### Regular Tasks

**Daily:**
- Monitor error logs
- Check uptime

**Weekly:**
- Review analytics
- Check storage usage
- Database backup verification

**Monthly:**
- Security updates (`npm audit`)
- Performance review
- Cost analysis
- User feedback review

### Backups

**Database:**
- Railway/Render: Automatic daily backups
- Manual exports recommended weekly

**Code:**
- GitHub version control
- Tag releases

**Environment Variables:**
- Document separately
- Secure storage (1Password, etc.)

---

## 🚀 Scaling Strategy

### Phase 1: MVP (Current)
- Single region deployment
- Shared database
- Basic monitoring

### Phase 2: Growth
- Add Redis caching
- Database read replicas
- CDN optimization
- Advanced monitoring (Sentry)

### Phase 3: Scale
- Multi-region deployment
- Microservices architecture
- Dedicated database cluster
- Load balancing
- Kubernetes/Docker

---

## 📞 Support Resources

- **Vercel**: https://vercel.com/docs
- **Railway**: https://docs.railway.app
- **Render**: https://render.com/docs
- **Supabase**: https://supabase.com/docs
- **Next.js**: https://nextjs.org/docs
- **Express**: https://expressjs.com/

---

## ✅ Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Frontend deployed to Vercel
- [ ] Backend deployed to Railway/Render
- [ ] PostgreSQL database created
- [ ] Database schema migrated
- [ ] Seed data loaded (optional)
- [ ] Supabase storage configured
- [ ] All environment variables set
- [ ] CORS configured correctly
- [ ] SSL/HTTPS enabled
- [ ] Custom domain configured (optional)
- [ ] Monitoring set up
- [ ] Error tracking enabled
- [ ] Backup strategy in place
- [ ] Security review completed
- [ ] Performance tested
- [ ] User acceptance testing done

---

## 🎉 You're Live!

Once deployed, your Recipe Raid Co-op app is ready to serve users globally!

**Share your creation:**
- Tweet about it
- Post on Reddit/Product Hunt
- Share with friends
- Gather feedback

**Happy Raiding! 🍳⚔️**
