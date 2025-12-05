-- Migration: Add solo mode support to raids table
-- Run this to update your existing database

-- Add user_id column (required)
ALTER TABLE raids ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id) ON DELETE CASCADE;

-- Add mode column with default 'solo'
ALTER TABLE raids ADD COLUMN IF NOT EXISTS mode VARCHAR(20) DEFAULT 'solo';

-- Make team_id optional (if it was NOT NULL before)
ALTER TABLE raids ALTER COLUMN team_id DROP NOT NULL;

-- Update existing raids to set user_id from team leader or first participant
UPDATE raids r
SET user_id = COALESCE(
  (SELECT leader_id FROM teams WHERE id = r.team_id),
  (SELECT user_id FROM raid_participants WHERE raid_id = r.id LIMIT 1)
)
WHERE user_id IS NULL;

-- Now make user_id NOT NULL after data migration
ALTER TABLE raids ALTER COLUMN user_id SET NOT NULL;

-- Update existing raids to set mode based on team_id
UPDATE raids
SET mode = CASE 
  WHEN team_id IS NULL THEN 'solo'
  ELSE 'team'
END
WHERE mode IS NULL OR mode = 'solo';

-- Create indexes for new columns
CREATE INDEX IF NOT EXISTS idx_raids_user ON raids(user_id);
CREATE INDEX IF NOT EXISTS idx_raids_mode ON raids(mode);

-- Verify changes
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'raids' 
ORDER BY ordinal_position;
