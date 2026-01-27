-- Add assigned_to column to assets table for tracking which employee is using the asset
ALTER TABLE assets 
ADD COLUMN IF NOT EXISTS assigned_to INTEGER REFERENCES employees(id) ON DELETE SET NULL;

-- Add assigned_date to track when the asset was assigned
ALTER TABLE assets 
ADD COLUMN IF NOT EXISTS assigned_date DATE;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_assets_assigned_to ON assets(assigned_to);

-- Update status enum if needed (optional, depends on your current setup)
COMMENT ON COLUMN assets.assigned_to IS 'ID of employee currently using this asset';
COMMENT ON COLUMN assets.assigned_date IS 'Date when asset was assigned to current employee';
