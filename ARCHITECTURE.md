# Recipe Raid Co-op - Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │            Next.js 15 PWA Application                │  │
│  │  • React Components (App Router)                     │  │
│  │  • Tailwind CSS Styling                              │  │
│  │  • Zustand State Management                          │  │
│  │  • Service Workers (Offline Support)                 │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              ↕ Axios HTTP Requests
┌─────────────────────────────────────────────────────────────┐
│                         API Layer                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Express.js REST API                     │  │
│  │  • JWT Authentication Middleware                     │  │
│  │  • Joi Validation Middleware                         │  │
│  │  • Rate Limiting & Security (Helmet)                 │  │
│  │  • CORS Protection                                   │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              ↕ SQL Queries
┌─────────────────────────────────────────────────────────────┐
│                      Database Layer                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              PostgreSQL Database                     │  │
│  │  • Users & Authentication                            │  │
│  │  • Teams & Memberships                               │  │
│  │  • Recipe Bosses & Raids                             │  │
│  │  • Ingredients & Pantry                              │  │
│  │  • Leaderboards & Rankings                           │  │
│  │  • Photo Proofs & Subscriptions                      │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              
┌─────────────────────────────────────────────────────────────┐
│                      External Services                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           Supabase Storage (Photos)                  │  │
│  │  • Photo Proof Uploads                               │  │
│  │  • Public URL Generation                             │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Key Components

### Frontend (Client)

**Pages:**
- `/` - Landing page
- `/auth/login` - User login
- `/auth/register` - User registration
- `/dashboard` - User dashboard with stats
- `/raids/[team]/[boss]` - Active raid interface
- `/teams` - Team management
- `/leaderboard` - Global rankings
- `/pantry` - Ingredient inventory
- `/premium` - Subscription page

**State Management:**
- Zustand store for user auth
- Local storage persistence
- JWT token management

**API Integration:**
- Axios client with interceptors
- Automatic token injection
- Error handling & redirects

### Backend (Server)

**API Routes:**

```
/api/auth
├── POST /register          # User registration
├── POST /login             # User login
├── GET /profile            # Get user profile
└── PUT /profile            # Update profile

/api/teams
├── POST /                  # Create team
├── GET /:teamId            # Get team details
├── PUT /:teamId            # Update team
├── DELETE /:teamId         # Delete team
├── POST /:teamId/invite    # Invite member
└── GET /:teamId/members    # Get members

/api/raids
├── POST /start             # Start raid
├── PUT /:raidId/complete   # Complete raid
├── GET /:raidId            # Get raid details
├── GET /team/:teamId       # Get team raids
├── POST /:raidId/photo     # Upload photo proof
└── PUT /:raidId/abandon    # Abandon raid

/api/leaderboard
├── GET /:period/:type      # Get leaderboard
└── GET /rank/:userId       # Get user rank

/api/ingredients
├── GET /                   # Get all ingredients
├── GET /pantry             # Get user pantry
└── POST /pantry            # Add to pantry

/api/users
└── GET /stats              # Get user statistics
```

**Middleware Stack:**
1. Helmet (Security headers)
2. CORS (Cross-origin protection)
3. Rate Limiting (DDoS protection)
4. Body Parser (JSON/URL-encoded)
5. JWT Authentication
6. Joi Validation
7. Error Handler

### Database Schema

**Core Tables:**
- `users` - User accounts & profiles
- `teams` - Clan/team information
- `team_members` - Team memberships & roles
- `ingredients` - Available ingredients with rarities
- `user_pantry` - User's ingredient inventory
- `recipe_bosses` - Recipe challenges
- `raids` - Active/completed raids
- `raid_participants` - Raid team members
- `leaderboards` - Rankings & scores
- `photo_proofs` - Uploaded photos
- `power_ups` - Available power-ups
- `user_power_ups` - User's power-up inventory
- `subscriptions` - Premium subscriptions
- `grocery_integrations` - External API connections

**Relationships:**
- User → Teams (many-to-many through team_members)
- Team → Raids (one-to-many)
- Raid → Boss (many-to-one)
- Raid → Participants (many-to-many through raid_participants)
- User → Pantry (one-to-many)

## Data Flow Examples

### Starting a Raid

```
1. Client sends POST /api/raids/start { teamId, bossId }
2. Server validates request (Joi)
3. Check user is team member (Auth middleware)
4. Verify boss exists (Database query)
5. Create raid record (Transaction)
6. Add user as participant
7. Return raid + boss details
8. Client navigates to /raids/[team]/[boss]
```

### Uploading Photo Proof

```
1. Client captures/selects photo
2. Upload to Supabase Storage
3. Get public URL & storage path
4. Send POST /api/raids/:raidId/photo
5. Server validates participant
6. Save photo_proof record
7. Update raid.photo_proof_url
8. Update leaderboard rankings
```

### Authentication Flow

```
1. User submits credentials
2. Server validates with Joi
3. Bcrypt compares password hash
4. Generate JWT with user claims
5. Return token + user data
6. Client stores in Zustand + localStorage
7. Axios adds token to all requests
8. Server middleware validates JWT
```

## Security Measures

1. **Password Security**: Bcrypt hashing (10 rounds)
2. **Authentication**: JWT with 7-day expiry
3. **Authorization**: Role-based access control
4. **Input Validation**: Joi schemas on all inputs
5. **SQL Injection**: Parameterized queries
6. **XSS Protection**: React auto-escaping + Helmet
7. **CSRF**: Same-origin CORS policy
8. **Rate Limiting**: 100 requests per 15 minutes
9. **HTTPS**: Production deployment requirement

## Performance Optimizations

1. **Database Indexes**: On frequently queried columns
2. **Connection Pooling**: PostgreSQL pool (max 20)
3. **API Caching**: Client-side with Zustand
4. **Image Optimization**: Next.js Image component
5. **Code Splitting**: Next.js automatic splitting
6. **PWA Caching**: Service worker for static assets
7. **Lazy Loading**: Dynamic imports for routes

## Scalability Considerations

**Current Architecture:**
- Monolithic Express server
- Single PostgreSQL instance
- Direct Supabase integration

**Future Scaling:**
- Microservices (Auth, Raids, Teams)
- Read replicas for database
- Redis caching layer
- CDN for static assets
- Load balancer for API servers
- Message queue for async tasks

## Technology Choices

**Why Next.js?**
- Built-in PWA support
- Server-side rendering
- API routes option
- Excellent developer experience

**Why Express?**
- Flexible and lightweight
- Large ecosystem
- Easy middleware integration
- TypeScript support

**Why PostgreSQL?**
- ACID compliance
- Complex queries support
- JSON support (JSONB)
- Mature and reliable

**Why Joi?**
- Powerful validation
- Clear error messages
- Schema reusability

**Why Supabase?**
- Easy setup
- Free tier
- Built-in CDN
- PostgreSQL-based

## Deployment Strategy

**Recommended Setup:**

**Frontend:**
- Vercel (optimal for Next.js)
- Environment variables configured
- Automatic HTTPS

**Backend:**
- Railway, Render, or Heroku
- Environment variables configured
- PostgreSQL add-on

**Database:**
- Managed PostgreSQL (Railway, Supabase, etc.)
- Automated backups
- Connection pooling

**Storage:**
- Supabase Storage
- Public bucket for photos
- 5MB file limit

---

This architecture provides a solid foundation for Recipe Raid Co-op with room for growth as the user base expands! 🚀
