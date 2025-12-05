# Recipe Raid Co-op 🍳⚔️

A gamified cooking application where users form teams to battle recipe bosses, track progress, and compete on leaderboards. Built with Next.js, Express, and PostgreSQL.

## 🎮 Features

- **Recipe Boss Raids**: Battle escalating recipe challenges from easy to legendary difficulty
- **Team System**: Create clans, invite members, and coordinate cooking raids
- **Virtual Pantry**: Collect and manage ingredients with different rarities
- **Leaderboards**: Compete globally with photo proof uploads via Supabase
- **PWA Support**: Offline access to prep lists and raid information
- **Premium Features**: Unlock exclusive ingredients, clan halls, and power-ups ($6/month)
- **Power-ups**: Time boosts, score multipliers, and difficulty reducers
- **Grocery Integrations**: Connect with Instacart, Amazon Fresh, etc. (future feature)

## 🛠️ Tech Stack

### Frontend (Client)
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Axios** - API requests
- **Zustand** - State management
- **Supabase** - Photo storage and authentication
- **next-pwa** - Progressive Web App functionality
- **react-hot-toast** - Notifications

### Backend (Server)
- **Express.js** - Node.js web framework
- **TypeScript** - Type safety
- **PostgreSQL** - Database
- **Joi** - Request validation
- **bcrypt** - Password hashing
- **jsonwebtoken** - JWT authentication
- **Supabase SDK** - File uploads

## 📋 Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+
- Supabase account (for photo storage)

## 🚀 Getting Started

### 1. Clone and Install

```bash
cd RecipeRaid

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Database Setup

Create a PostgreSQL database:

```bash
createdb recipe_raid
```

Run the schema:

```bash
psql -d recipe_raid -f server/database/schema.sql
```

Seed with sample data (optional):

```bash
psql -d recipe_raid -f server/database/seed.sql
```

### 3. Environment Configuration

**Server** (`server/.env`):
```env
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=recipe_raid
DB_USER=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=7d

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key

# Client URL
CLIENT_URL=http://localhost:3000
```

**Client** (`client/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Supabase Setup

1. Create a Supabase project at https://supabase.com
2. Create a storage bucket named `recipe-raid`
3. Set bucket to public
4. Copy your project URL and anon key to `.env` files

### 5. Run the Application

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

Access the app at http://localhost:3000

## 📁 Project Structure

```
RecipeRaid/
├── client/                    # Next.js frontend
│   ├── app/                   # App router pages
│   │   ├── auth/             # Authentication pages
│   │   ├── dashboard/        # User dashboard
│   │   ├── raids/            # Raid management
│   │   ├── teams/            # Team management
│   │   ├── leaderboard/      # Rankings
│   │   └── pantry/           # Ingredient inventory
│   ├── components/           # React components
│   ├── lib/                  # Utilities
│   │   ├── api.ts           # API client
│   │   ├── supabase.ts      # Supabase client
│   │   └── store.ts         # Zustand store
│   └── public/              # Static assets
│       └── manifest.json    # PWA manifest
│
└── server/                   # Express backend
    ├── src/
    │   ├── controllers/     # Route handlers
    │   ├── middleware/      # Auth, validation, errors
    │   ├── routes/          # API routes
    │   ├── validations/     # Joi schemas
    │   ├── config/          # Database config
    │   └── index.ts         # Server entry
    └── database/
        ├── schema.sql       # Database schema
        └── seed.sql         # Sample data
```

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile

### Teams
- `POST /api/teams` - Create team
- `GET /api/teams/:teamId` - Get team details
- `PUT /api/teams/:teamId` - Update team
- `DELETE /api/teams/:teamId` - Delete team
- `POST /api/teams/:teamId/invite` - Invite member
- `GET /api/teams/:teamId/members` - Get team members

### Raids
- `POST /api/raids/start` - Start a raid
- `PUT /api/raids/:raidId/complete` - Complete raid
- `GET /api/raids/:raidId` - Get raid details
- `GET /api/raids/team/:teamId` - Get team raids
- `POST /api/raids/:raidId/photo` - Upload photo proof

### Leaderboard
- `GET /api/leaderboard/:period/:type` - Get leaderboard
- `GET /api/leaderboard/rank/:userId` - Get user rank

### Ingredients
- `GET /api/ingredients` - Get all ingredients
- `GET /api/ingredients/pantry` - Get user pantry
- `POST /api/ingredients/pantry` - Add to pantry

## 🎮 How to Play

1. **Register** - Create your account
2. **Create/Join Team** - Form a clan with friends
3. **Build Pantry** - Collect ingredients (common to legendary)
4. **Start Raid** - Choose a recipe boss to battle
5. **Cook Together** - Follow the recipe with your team
6. **Upload Proof** - Take a photo of your creation
7. **Earn Score** - Get points and climb leaderboards
8. **Use Power-ups** - Boost your performance

## 🌟 Premium Features

For $6/month, unlock:
- Exclusive legendary ingredients
- Private clan halls
- Advanced power-ups
- Priority support
- Exclusive recipe bosses

## 🔒 Security Features

- JWT authentication with HTTP-only cookies
- Bcrypt password hashing
- Rate limiting on API endpoints
- Helmet.js security headers
- CORS protection
- Joi input validation

## 📱 PWA Features

- Offline access to prep lists
- Add to home screen
- Background sync
- Push notifications (future)

## 🚧 Future Enhancements

- [ ] Voice chat integration for multiplayer coordination
- [ ] Grocery store API integrations (Instacart, Amazon Fresh)
- [ ] AI recipe boss generator
- [ ] Video replay of cooking sessions
- [ ] Seasonal events and limited-time bosses
- [ ] Mobile app (React Native)
- [ ] Social sharing features
- [ ] Achievement system

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🐛 Known Issues

- TypeScript compilation errors in server (install dependencies to resolve)
- PWA service worker needs manual registration
- Photo upload size limit is 5MB

## 📞 Support

For issues and questions, please create a GitHub issue.

---

**Happy Raiding! 🍳⚔️**
