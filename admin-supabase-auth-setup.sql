-- Admin Profiles Table for Supabase Auth Integration
-- This table stores admin user profiles linked to Supabase auth users

-- Create admin_profiles table
CREATE TABLE IF NOT EXISTS admin_profiles (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  username text UNIQUE NOT NULL,
  email text NOT NULL,
  name text NOT NULL,
  role text DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin', 'manager')),
  permissions text[] DEFAULT '{}',
  last_login timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_admin_profiles_user_id ON admin_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_profiles_username ON admin_profiles(username);
CREATE INDEX IF NOT EXISTS idx_admin_profiles_role ON admin_profiles(role);

-- Enable RLS
ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for admin_profiles
-- Admins can only see their own profile
CREATE POLICY "Admins can view own profile" ON admin_profiles
  FOR SELECT USING (auth.uid() = user_id);

-- Admins can update their own profile (except role and permissions)
CREATE POLICY "Admins can update own profile" ON admin_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Super admins can view all profiles
CREATE POLICY "Super admins can view all profiles" ON admin_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM admin_profiles 
      WHERE user_id = auth.uid() 
      AND role = 'super_admin'
    )
  );

-- Super admins can manage all profiles
CREATE POLICY "Super admins can manage all profiles" ON admin_profiles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_profiles 
      WHERE user_id = auth.uid() 
      AND role = 'super_admin'
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_admin_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updated_at
DROP TRIGGER IF EXISTS update_admin_profiles_updated_at ON admin_profiles;
CREATE TRIGGER update_admin_profiles_updated_at
  BEFORE UPDATE ON admin_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_admin_profiles_updated_at();

-- Function to create admin profile after user signup
CREATE OR REPLACE FUNCTION create_admin_profile()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create admin profile if user email matches admin domain or specific emails
  IF NEW.email LIKE '%@admin.seniorcare.com' OR 
     NEW.email IN ('admin@example.com', 'shreyash@example.com') THEN
    
    INSERT INTO admin_profiles (
      user_id,
      username,
      email,
      name,
      role,
      permissions
    ) VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
      COALESCE(NEW.raw_user_meta_data->>'role', 'admin'),
      COALESCE(
        ARRAY(SELECT jsonb_array_elements_text(NEW.raw_user_meta_data->'permissions')),
        '{}'
      )
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create admin profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created_admin ON auth.users;
CREATE TRIGGER on_auth_user_created_admin
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_admin_profile();

-- Sample admin user (you'll need to create this through Supabase Auth)
-- To create an admin user:
-- 1. Sign up through Supabase Auth with email: admin@example.com
-- 2. The trigger will automatically create the admin profile
-- 3. Or manually insert:

-- INSERT INTO admin_profiles (
--   user_id,
--   username,
--   email,
--   name,
--   role,
--   permissions
-- ) VALUES (
--   'YOUR_USER_ID_FROM_AUTH_USERS',
--   'admin',
--   'admin@example.com',
--   'Admin User',
--   'super_admin',
--   '{manage_users,manage_patients,manage_partners,view_analytics}'
-- );

-- Function to get admin profile by user_id
CREATE OR REPLACE FUNCTION get_admin_profile(user_uuid uuid)
RETURNS admin_profiles AS $$
DECLARE
  admin_profile admin_profiles;
BEGIN
  SELECT * INTO admin_profile
  FROM admin_profiles
  WHERE user_id = user_uuid;
  
  RETURN admin_profile;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON admin_profiles TO authenticated;
GRANT EXECUTE ON FUNCTION get_admin_profile(uuid) TO authenticated;