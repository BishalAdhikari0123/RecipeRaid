# Recipe Raid Co-op 🍳⚔️

**Gamify cooking as co-op raids. Battle recipe bosses, build teams, and conquer the kitchen!**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15.0-black)](https://nextjs.org/)
[![Express](https://img.shields.io/badge/Express-4.18-green)](https://expressjs.com/)

## 🎮 What is Recipe Raid?

Recipe Raid Co-op transforms cooking into an epic multiplayer adventure. Form teams, collect ingredients, and battle increasingly difficult recipe bosses. Upload photo proof of your creations and climb the leaderboards!

### Key Features

- 🎯 **Recipe Boss Raids** - Battle escalating cooking challenges
- 👥 **Team System** - Create clans and coordinate with friends  
- 🥘 **Virtual Pantry** - Collect ingredients from common to legendary
- 🏆 **Leaderboards** - Compete globally with photo proof
- 📱 **PWA Support** - Offline access to prep lists
- 💎 **Premium Features** - Exclusive ingredients and clan halls ($6/month)
- ⚡ **Power-ups** - Time boosts, score multipliers, difficulty reducers

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+
- Supabase account (for photo storage)

### Installation

```bash
# 1. Install dependencies
cd server && npm install
cd ../client && npm install

# 2. Set up database
createdb recipe_raid
psql -d recipe_raid -f server/database/schema.sql
psql -d recipe_raid -f server/database/seed.sql  # Optional

# 3. Configure environment
cp server/.env.example server/.env
cp client/.env.local.example client/.env.local
# Edit files with your credentials

# 4. Run servers
# Terminal 1:
cd server && npm run dev

# Terminal 2:
cd client && npm run dev
```

Visit http://localhost:3000

📖 **Detailed setup:** See [QUICKSTART.md](QUICKSTART.md)

## 🛠️ Tech Stack

### Frontend
- Next.js 15 with TypeScript
- Tailwind CSS
- Zustand state management
- Axios for API calls
- Supabase for storage
- PWA with next-pwa

### Backend
- Express.js with TypeScript
- PostgreSQL database
- Joi validation
- JWT authentication
- bcrypt password hashing
- Helmet + CORS security

## 📚 Documentation

- **[QUICKSTART.md](QUICKSTART.md)** - Installation and first steps
- **[PROJECT_README.md](PROJECT_README.md)** - Complete documentation
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - System design and architecture
- **[FEATURES.md](FEATURES.md)** - Complete feature list (150+)
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Production deployment guide
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - How to contribute
- **[FILES_CREATED.md](FILES_CREATED.md)** - Complete file inventory

## 📁 Project Structure

```
RecipeRaid/
├── client/           # Next.js frontend
│   ├── app/         # Pages and layouts
│   ├── components/  # React components
│   └── lib/         # Utilities and API client
└── server/          # Express backend
    ├── src/
    │   ├── controllers/   # Route handlers
    │   ├── middleware/    # Auth & validation
    │   ├── routes/        # API endpoints
    │   └── validations/   # Joi schemas
    └── database/          # SQL schema & seeds
```

## 🎯 API Endpoints

**30+ REST endpoints across 6 route groups:**

- `/api/auth` - Authentication (4 endpoints)
- `/api/teams` - Team management (8 endpoints)
- `/api/raids` - Raid system (6 endpoints)
- `/api/leaderboard` - Rankings (2 endpoints)
- `/api/ingredients` - Pantry (3 endpoints)
- `/api/users` - User stats (1 endpoint)

Full API docs in [PROJECT_README.md](PROJECT_README.md#-api-endpoints)

## 🎮 How to Play

1. **Register** - Create your account
2. **Create/Join Team** - Form a clan with friends
3. **Build Pantry** - Collect ingredients (common to legendary)
4. **Start Raid** - Choose a recipe boss to battle
5. **Cook Together** - Follow the recipe with your team
6. **Upload Proof** - Take a photo of your creation
7. **Earn Score** - Get points and climb leaderboards
8. **Use Power-ups** - Boost your performance

## 💎 Premium Features

**$6/month unlocks:**
- Exclusive legendary ingredients
- Private clan halls
- Advanced power-ups
- Priority support
- Exclusive recipe bosses

## 🔒 Security

- JWT authentication
- Bcrypt password hashing (10 rounds)
- Rate limiting (100 req/15min)
- Helmet security headers
- CORS protection
- Joi input validation
- SQL injection prevention

## 🚀 Deployment

Recommended hosting:
- **Frontend:** Vercel (Next.js optimized)
- **Backend:** Railway or Render
- **Database:** Railway, Supabase, or Neon
- **Storage:** Supabase Storage

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for:
- Code style guidelines
- Commit message conventions
- Pull request process
- Development workflow

## 📊 Project Stats

- **Files Created:** 60+
- **Lines of Code:** 7,700+
- **Features Implemented:** 150+
- **API Endpoints:** 30+
- **Database Tables:** 16
- **Status:** ✅ Production Ready (MVP)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Supabase for easy storage integration
- All contributors and testers

## 📞 Support

- **Issues:** [GitHub Issues](https://github.com/yourusername/recipe-raid/issues)
- **Discussions:** [GitHub Discussions](https://github.com/yourusername/recipe-raid/discussions)
- **Documentation:** See docs linked above

---

**Built with ❤️ by the Recipe Raid team**

**Happy Raiding! 🍳⚔️**
