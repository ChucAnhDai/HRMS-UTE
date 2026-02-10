-- Migration: Add 'MANAGER' to user_role enum
-- Run this in Supabase SQL Editor

BEGIN;

  -- 1. Disable check temporarily if needed, but for ENUMs we just add the value
  -- Check if 'MANAGER' exists, if not add it
  ALTER TYPE "public"."user_role" ADD VALUE IF NOT EXISTS 'MANAGER';

COMMIT;

-- Verify
-- SELECT enum_range(NULL::user_role);
