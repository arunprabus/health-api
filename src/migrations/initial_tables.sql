-- Create extension for UUID generation if not exists
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create profiles table with reference to users
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  blood_group VARCHAR(5),
  insurance_provider VARCHAR(100),
  insurance_number VARCHAR(100),
  pdf_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE
);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_id ON profiles(id);
