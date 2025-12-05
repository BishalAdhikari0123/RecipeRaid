# 📖 Recipe Raid Co-op - Documentation Index

Welcome to the Recipe Raid Co-op documentation! This guide will help you navigate all available documentation.

## 🚀 Getting Started

**New to the project? Start here:**

1. **[README.md](README.md)** - Project overview and quick start
2. **[QUICKSTART.md](QUICKSTART.md)** - Detailed installation guide
3. **[setup.ps1](setup.ps1)** - Automated Windows installation script

## 📚 Core Documentation

### Project Understanding
- **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - What has been built
- **[FEATURES.md](FEATURES.md)** - Complete feature list (150+)
- **[FILES_CREATED.md](FILES_CREATED.md)** - All files with descriptions

### Technical Documentation
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - System design and architecture
- **[PROJECT_README.md](PROJECT_README.md)** - Complete technical documentation

### Operations
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Production deployment guide
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - How to contribute

### Legal
- **[LICENSE](LICENSE)** - MIT License

## 🎯 Quick Navigation

### I want to...

**...install the project**
→ [QUICKSTART.md](QUICKSTART.md) or run [setup.ps1](setup.ps1)

**...understand the architecture**
→ [ARCHITECTURE.md](ARCHITECTURE.md)

**...see all features**
→ [FEATURES.md](FEATURES.md)

**...deploy to production**
→ [DEPLOYMENT.md](DEPLOYMENT.md)

**...contribute code**
→ [CONTRIBUTING.md](CONTRIBUTING.md)

**...understand what's been built**
→ [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)

**...see the API endpoints**
→ [PROJECT_README.md](PROJECT_README.md#-api-endpoints)

**...troubleshoot issues**
→ [QUICKSTART.md](QUICKSTART.md#troubleshooting)

**...know the file structure**
→ [FILES_CREATED.md](FILES_CREATED.md)

## 📂 Code Documentation

### Backend (server/)

**Entry Point:** `server/src/index.ts`

**Key Directories:**
- `src/controllers/` - Business logic
- `src/routes/` - API endpoints
- `src/middleware/` - Auth, validation, errors
- `src/validations/` - Joi schemas
- `database/` - SQL schema and seeds

**Controllers:**
- `auth.controller.ts` - Authentication (register, login, profile)
- `raid.controller.ts` - Raid management (start, complete, abandon)
- `team.controller.ts` - Team operations (CRUD, members, invites)
- `leaderboard.controller.ts` - Rankings and stats
- `ingredient.controller.ts` - Pantry management
- `user.controller.ts` - User statistics

### Frontend (client/)

**Entry Point:** `client/app/page.tsx`

**Key Directories:**
- `app/` - Next.js pages (App Router)
- `components/` - React components
- `lib/` - Utilities and API client

**Pages:**
- `app/page.tsx` - Landing page
- `app/auth/login/page.tsx` - Login
- `app/auth/register/page.tsx` - Registration
- `app/dashboard/page.tsx` - User dashboard

**Utilities:**
- `lib/api.ts` - Axios client with all API functions
- `lib/store.ts` - Zustand state management
- `lib/supabase.ts` - Photo upload utilities

## 🔍 Search by Topic

### Authentication
- Implementation: `server/src/controllers/auth.controller.ts`
- Middleware: `server/src/middleware/auth.middleware.ts`
- Validation: `server/src/validations/auth.validation.ts`
- Routes: `server/src/routes/auth.routes.ts`
- Frontend: `client/app/auth/`

### Teams
- Implementation: `server/src/controllers/team.controller.ts`
- Validation: `server/src/validations/team.validation.ts`
- Routes: `server/src/routes/team.routes.ts`
- Database: See `teams` and `team_members` tables in `server/database/schema.sql`

### Raids
- Implementation: `server/src/controllers/raid.controller.ts`
- Validation: `server/src/validations/raid.validation.ts`
- Routes: `server/src/routes/raid.routes.ts`
- Database: See `raids` and `raid_participants` tables

### Ingredients
- Implementation: `server/src/controllers/ingredient.controller.ts`
- Routes: `server/src/routes/ingredient.routes.ts`
- Database: See `ingredients` and `user_pantry` tables

### Leaderboards
- Implementation: `server/src/controllers/leaderboard.controller.ts`
- Routes: `server/src/routes/leaderboard.routes.ts`
- Database: See `leaderboards` table

### Database
- Schema: `server/database/schema.sql` (16 tables)
- Seed Data: `server/database/seed.sql`
- Connection: `server/src/config/database.ts`

### Security
- Authentication: `server/src/middleware/auth.middleware.ts`
- Validation: `server/src/middleware/validation.middleware.ts`
- Error Handling: `server/src/middleware/error.middleware.ts`
- Details: See [ARCHITECTURE.md](ARCHITECTURE.md#security-measures)

### Deployment
- Guide: [DEPLOYMENT.md](DEPLOYMENT.md)
- Frontend (Vercel): [DEPLOYMENT.md](DEPLOYMENT.md#-frontend-deployment-vercel)
- Backend (Railway): [DEPLOYMENT.md](DEPLOYMENT.md#-backend-deployment-railway)
- Database Options: [DEPLOYMENT.md](DEPLOYMENT.md#-database-options)

## 📊 Project Statistics

- **Total Files:** 60+
- **Lines of Code:** 7,700+
- **Features:** 150+
- **API Endpoints:** 30+
- **Database Tables:** 16
- **Documentation Pages:** 10+

## 🎯 Learning Path

**For New Developers:**
1. Read [README.md](README.md) - Overview
2. Follow [QUICKSTART.md](QUICKSTART.md) - Get it running
3. Read [ARCHITECTURE.md](ARCHITECTURE.md) - Understand the design
4. Explore [FEATURES.md](FEATURES.md) - See what's possible
5. Check [FILES_CREATED.md](FILES_CREATED.md) - Know the codebase
6. Review [CONTRIBUTING.md](CONTRIBUTING.md) - Start contributing

**For Deployers:**
1. Read [README.md](README.md) - Overview
2. Follow [QUICKSTART.md](QUICKSTART.md) - Test locally
3. Read [DEPLOYMENT.md](DEPLOYMENT.md) - Deploy to production
4. Review security checklist in [DEPLOYMENT.md](DEPLOYMENT.md#-security-checklist)

**For Contributors:**
1. Read [CONTRIBUTING.md](CONTRIBUTING.md) - Guidelines
2. Review [ARCHITECTURE.md](ARCHITECTURE.md) - Design patterns
3. Check [FEATURES.md](FEATURES.md) - What's implemented
4. Follow code style in [CONTRIBUTING.md](CONTRIBUTING.md#code-style)

## 💡 Pro Tips

- **Search Tip:** Use Ctrl+F to search within documents
- **Code Navigation:** Files are organized by feature
- **API Testing:** Use the health endpoint: `GET /health`
- **Quick Install:** Run `setup.ps1` for automated setup (Windows)
- **Documentation:** All docs use Markdown for easy reading

## 🆘 Need Help?

**Quick Troubleshooting:**
- Installation issues → [QUICKSTART.md](QUICKSTART.md#troubleshooting)
- Deployment problems → [DEPLOYMENT.md](DEPLOYMENT.md#-troubleshooting)
- Feature questions → [FEATURES.md](FEATURES.md)
- Architecture questions → [ARCHITECTURE.md](ARCHITECTURE.md)

**Still stuck?**
- Check GitHub Issues
- Create a new issue
- Review [CONTRIBUTING.md](CONTRIBUTING.md) for help channels

## 🎉 Ready to Start?

Pick your path:
- **Developer:** → [QUICKSTART.md](QUICKSTART.md)
- **Deployer:** → [DEPLOYMENT.md](DEPLOYMENT.md)
- **Contributor:** → [CONTRIBUTING.md](CONTRIBUTING.md)
- **Learner:** → [ARCHITECTURE.md](ARCHITECTURE.md)

---

**Happy Raiding! 🍳⚔️**

*Last Updated: December 2025*
