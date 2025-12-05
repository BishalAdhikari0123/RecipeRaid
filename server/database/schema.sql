-- Database Schema for Recipe Raid Co-op

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    display_name VARCHAR(100),
    avatar_url TEXT,
    is_premium BOOLEAN DEFAULT FALSE,
    premium_expires_at TIMESTAMP,
    total_raids_completed INTEGER DEFAULT 0,
    total_score INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Teams (Clans)
CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    leader_id UUID REFERENCES users(id) ON DELETE CASCADE,
    is_premium BOOLEAN DEFAULT FALSE,
    max_members INTEGER DEFAULT 10,
    team_score INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Team Members
CREATE TABLE team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(20) DEFAULT 'member', -- leader, officer, member
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(team_id, user_id)
);

-- Ingredients
CREATE TABLE ingredients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(50), -- protein, vegetable, spice, dairy, etc.
    rarity VARCHAR(20), -- common, uncommon, rare, epic, legendary
    is_premium BOOLEAN DEFAULT FALSE,
    power_up_effect VARCHAR(50), -- time_boost, score_multiplier, difficulty_reducer
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Pantry (Virtual Inventory)
CREATE TABLE user_pantry (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    ingredient_id UUID REFERENCES ingredients(id) ON DELETE CASCADE,
    quantity INTEGER DEFAULT 1,
    acquired_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, ingredient_id)
);

-- Recipe Bosses
CREATE TABLE recipe_bosses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    difficulty VARCHAR(20), -- easy, medium, hard, extreme, legendary
    difficulty_level INTEGER, -- 1-10
    cuisine_type VARCHAR(50),
    prep_time_minutes INTEGER,
    cook_time_minutes INTEGER,
    servings INTEGER,
    base_score INTEGER,
    required_ingredients JSONB, -- [{ingredient_id, quantity}]
    optional_ingredients JSONB,
    instructions JSONB, -- Array of steps
    tips TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Raids (Active or Completed Boss Battles)
CREATE TABLE raids (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    boss_id UUID REFERENCES recipe_bosses(id) ON DELETE CASCADE,
    mode VARCHAR(20) DEFAULT 'solo', -- solo, team
    status VARCHAR(20) DEFAULT 'active', -- active, completed, failed, abandoned
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    total_score INTEGER DEFAULT 0,
    time_taken_minutes INTEGER,
    photo_proof_url TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Raid Participants
CREATE TABLE raid_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    raid_id UUID REFERENCES raids(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    contributed_ingredients JSONB, -- [{ingredient_id, quantity}]
    individual_score INTEGER DEFAULT 0,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(raid_id, user_id)
);

-- Leaderboards
CREATE TABLE leaderboards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    period VARCHAR(20), -- daily, weekly, monthly, all_time
    period_start DATE,
    period_end DATE,
    type VARCHAR(20), -- individual, team
    entity_id UUID, -- user_id or team_id
    score INTEGER DEFAULT 0,
    rank INTEGER,
    raids_completed INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Photo Proofs
CREATE TABLE photo_proofs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    raid_id UUID REFERENCES raids(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    photo_url TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    verified BOOLEAN DEFAULT FALSE
);

-- Power-ups
CREATE TABLE power_ups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    type VARCHAR(50), -- time_boost, score_multiplier, ingredient_discount, etc.
    effect_value DECIMAL(5,2),
    duration_minutes INTEGER,
    is_premium BOOLEAN DEFAULT FALSE,
    cost_coins INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Power-ups Inventory
CREATE TABLE user_power_ups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    power_up_id UUID REFERENCES power_ups(id) ON DELETE CASCADE,
    quantity INTEGER DEFAULT 1,
    acquired_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, power_up_id)
);

-- Grocery Integrations
CREATE TABLE grocery_integrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    provider VARCHAR(50), -- instacart, amazon_fresh, walmart, etc.
    provider_user_id VARCHAR(255),
    access_token TEXT,
    refresh_token TEXT,
    token_expires_at TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Subscriptions
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    plan_type VARCHAR(20), -- premium
    status VARCHAR(20), -- active, cancelled, expired
    price_per_month DECIMAL(10,2),
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    cancelled_at TIMESTAMP,
    payment_provider VARCHAR(50),
    payment_provider_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_team_members_user ON team_members(user_id);
CREATE INDEX idx_team_members_team ON team_members(team_id);
CREATE INDEX idx_raids_team ON raids(team_id);
CREATE INDEX idx_raids_user ON raids(user_id);
CREATE INDEX idx_raids_status ON raids(status);
CREATE INDEX idx_raids_mode ON raids(mode);
CREATE INDEX idx_raid_participants_raid ON raid_participants(raid_id);
CREATE INDEX idx_raid_participants_user ON raid_participants(user_id);
CREATE INDEX idx_leaderboards_period ON leaderboards(period, period_start, period_end);
CREATE INDEX idx_user_pantry_user ON user_pantry(user_id);
CREATE INDEX idx_recipe_bosses_difficulty ON recipe_bosses(difficulty_level);

-- Updated at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON teams
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leaderboards_updated_at BEFORE UPDATE ON leaderboards
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
