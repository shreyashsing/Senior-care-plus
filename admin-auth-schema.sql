-- Admin Authentication System Schema
-- This creates proper admin users with Supabase authentication

-- Create admin_profiles table (linked to auth.users)
CREATE TABLE IF NOT EXISTS admin_profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin', 'manager')),
    permissions TEXT[] DEFAULT ARRAY[]::TEXT[],
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on admin_profiles
ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;

-- Admin profiles can only be accessed by the user themselves or users with admin role in metadata
CREATE POLICY "Admin profiles access" ON admin_profiles
    FOR ALL USING (
        auth.uid() = id OR 
        auth.jwt() ->> 'user_metadata' ->> 'role' = 'admin' OR
        (auth.jwt() ->> 'raw_user_meta_data')::jsonb ->> 'role' = 'admin'
    );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_admin_profiles_username ON admin_profiles(username);
CREATE INDEX IF NOT EXISTS idx_admin_profiles_role ON admin_profiles(role);
CREATE INDEX IF NOT EXISTS idx_admin_profiles_active ON admin_profiles(is_active);

-- Function to handle admin profile creation
CREATE OR REPLACE FUNCTION create_admin_profile()
RETURNS TRIGGER AS $$
BEGIN
    -- Only create admin profile if user metadata indicates admin role
    IF NEW.raw_user_meta_data->>'role' = 'admin' THEN
        INSERT INTO admin_profiles (
            id, 
            username, 
            full_name, 
            role,
            permissions
        ) VALUES (
            NEW.id,
            COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
            COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
            COALESCE(NEW.raw_user_meta_data->>'role', 'admin'),
            ARRAY['hospital_partners:read', 'hospital_partners:write', 'patients:read', 'dashboard:read']::TEXT[]
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create admin profile when auth user is created
CREATE OR REPLACE TRIGGER create_admin_profile_trigger
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION create_admin_profile();

-- Function to update last_login
CREATE OR REPLACE FUNCTION update_admin_last_login(admin_user_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE admin_profiles 
    SET last_login = NOW(), updated_at = NOW()
    WHERE id = admin_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM admin_profiles 
        WHERE id = user_id AND is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update hospital_partners RLS policies to use proper admin auth
DROP POLICY IF EXISTS "Admin can manage hospital partners" ON hospital_partners;
DROP POLICY IF EXISTS "Authenticated users can view active partners" ON hospital_partners;

-- Enable RLS on hospital_partners
ALTER TABLE hospital_partners ENABLE ROW LEVEL SECURITY;

-- Admin users can manage all hospital partners
CREATE POLICY "Admin can manage hospital partners" ON hospital_partners
    FOR ALL USING (
        auth.jwt() ->> 'user_metadata' ->> 'role' = 'admin' OR
        (auth.jwt() ->> 'raw_user_meta_data')::jsonb ->> 'role' = 'admin'
    );

-- Authenticated users can view active partners (for appointment booking)
CREATE POLICY "Users can view active partners" ON hospital_partners
    FOR SELECT USING (
        status = 'active' AND auth.role() = 'authenticated'
    );

-- Function to get email by username for login
CREATE OR REPLACE FUNCTION get_email_by_username(admin_username TEXT)
RETURNS TEXT AS $$
DECLARE
    user_email TEXT;
BEGIN
    SELECT au.email INTO user_email
    FROM admin_profiles ap
    JOIN auth.users au ON ap.id = au.id
    WHERE ap.username = admin_username AND ap.is_active = true;
    
    RETURN user_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create first admin user (run manually after schema setup)
CREATE OR REPLACE FUNCTION create_first_admin(
    admin_email TEXT,
    admin_password TEXT,
    admin_username TEXT DEFAULT NULL,
    admin_full_name TEXT DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
    new_admin_id UUID;
    result JSON;
BEGIN
    -- This function should be called manually to create the first admin
    -- Example: SELECT create_first_admin('admin@yourdomain.com', 'secure_password', 'admin', 'System Administrator');
    
    RAISE NOTICE 'This function should be used manually to create admin users through Supabase Auth UI or dashboard';
    RAISE NOTICE 'Email: %, Username: %, Full Name: %', admin_email, COALESCE(admin_username, split_part(admin_email, '@', 1)), COALESCE(admin_full_name, admin_email);
    
    result := json_build_object(
        'message', 'Please create admin users through Supabase Auth dashboard with role metadata',
        'email', admin_email,
        'metadata_required', json_build_object(
            'role', 'admin',
            'username', COALESCE(admin_username, split_part(admin_email, '@', 1)),
            'full_name', COALESCE(admin_full_name, admin_email)
        )
    );
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Instructions for creating admin users
/*
To create admin users:

1. Go to Supabase Dashboard > Authentication > Users
2. Click "Add user" 
3. Enter email and password
4. In "User Metadata" section, add:
   {
     "role": "admin",
     "username": "admin_username",
     "full_name": "Full Name"
   }
5. Click "Create user"

The trigger will automatically create the admin profile.

Alternatively, use the Auth API to create users programmatically with the proper metadata.
*/