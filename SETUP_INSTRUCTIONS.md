# 🚨 Supabase Setup Required

## The Issue
Your application is showing a white screen because the Supabase credentials in your `.env.local` file are still set to placeholder values.

## Quick Fix Steps

### 1. Get Your Supabase Credentials

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Create a new project or select an existing one
3. Go to **Settings > API** in your project dashboard
4. Copy the following values:
   - **Project URL** (should look like: `https://your-project-id.supabase.co`)
   - **anon public key** (a long string starting with `eyJ...`)

### 2. Update Your .env.local File

Replace the placeholder values in your `.env.local` file:

```bash
# Replace these placeholder values with your actual Supabase credentials
VITE_SUPABASE_URL=https://your-actual-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-actual-anon-key-here

# Keep these as they are
VITE_NODE_ENV=development
VITE_APP_NAME=Senior Care Plus
VITE_APP_URL=http://localhost:5173
```

### 3. Restart Your Development Server

After updating the `.env.local` file:

```bash
# Stop the current server (Ctrl+C)
# Then restart it
npm run dev
```

### 4. Set Up Database Tables

Once your app is running, you'll need to create the required database tables. Run this SQL in your Supabase SQL Editor:

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'care_manager')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  PRIMARY KEY (id)
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'phone');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

## What Happens Next

After completing these steps:
1. Your app will load properly with the authentication system
2. You can test the `/login` and `/signup` pages
3. The dashboard will be accessible after login
4. All authentication features will work

## Need Help?

If you're still seeing errors:
1. Check the browser console for specific error messages
2. Verify your Supabase URL format matches: `https://project-id.supabase.co`
3. Make sure your anon key is the public key, not the secret key
4. Ensure your `.env.local` file is in the project root directory

The debug logging I added will show you exactly what values are being read from your environment variables.