-- Add resume_path column to candidates table if it doesn't exist
ALTER TABLE candidates 
ADD COLUMN IF NOTXsISTS resume_path text;
