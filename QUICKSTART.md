# Recipe Raid Co-op - Quick Start Guide 🚀

## Installation Steps

### 1. Install Dependencies

```powershell
# Server
cd server
npm install

# Client  
cd ..\client
npm install
```

### 2. Set Up PostgreSQL Database

```powershell
# Create database (if psql is in PATH)
createdb recipe_raid

# Or use pgAdmin to create a database named 'recipe_raid'

# Run schema
psql -d recipe_raid -f ..\server\database\schema.sql

# (Optional) Add sample data
psql -d recipe_raid -f ..\server\database\seed.sql
```

### 3. Configure Environment Variables

**Server:** Copy `server\.env.example` to `server\.env` and update:
```env
DB_PASSWORD=your_postgres_password
JWT_SECRET=your_random_secret_key_here
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
```

**Client:** Copy `client\.env.local.example` to `client\.env.local` and update:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Set Up Supabase (for photo uploads)

1. Go to https://supabase.com and create a project
2. Navigate to Storage
3. Create a new bucket named `recipe-raid`
4. Make the bucket **public**
5. Copy your project URL and anon key to `.env` files

### 5. Run the Application

**Terminal 1 - Backend:**
```powershell
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```powershell
cd client
npm run dev
```

### 6. Access the App

Open your browser to: http://localhost:3000

## First Steps

1. **Register** a new account at `/auth/register`
2. **Login** at `/auth/login`
3. **Create a Team** from the dashboard
4. **View Sample Bosses** - if you ran seed.sql
5. **Start Your First Raid!**

## Troubleshooting

### Can't connect to database?
- Ensure PostgreSQL is running
- Check DB credentials in `server/.env`
- Verify database `recipe_raid` exists

### Server won't start?
```powershell
cd server
npm install
```

### Client won't start?
```powershell
cd client
npm install
```

### TypeScript errors?
These are expected before `npm install`. Run install commands first.

### Photo uploads not working?
- Check Supabase configuration
- Ensure bucket `recipe-raid` exists and is public
- Verify environment variables are correct

## Default Ports

- **Backend API:** http://localhost:5000
- **Frontend:** http://localhost:3000
- **Database:** localhost:5432

## Need Help?

Check `PROJECT_README.md` for full documentation!

---

Happy Cooking! 🍳⚔️
