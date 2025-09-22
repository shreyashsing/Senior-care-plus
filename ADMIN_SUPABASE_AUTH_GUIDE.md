# Admin Supabase Authentication Setup Guide

## Overview
The admin authentication has been updated to use proper Supabase Auth instead of custom authentication. This provides better security, session management, and integration with Supabase's built-in authentication features.

## Setup Steps

### 1. Run the Database Schema
Execute the SQL file `admin-supabase-auth-setup.sql` in your Supabase SQL editor:

```bash
# In Supabase Dashboard > SQL Editor
# Copy and paste the content of admin-supabase-auth-setup.sql
```

This will create:
- `admin_profiles` table
- RLS policies for security
- Triggers for automatic admin profile creation
- Helper functions

### 2. Create Your First Admin User

#### Option A: Through Supabase Auth API (Recommended)
```javascript
// In Supabase Dashboard > Authentication > Users
// Click "Invite User" or use the Auth API

// Or programmatically:
const { data, error } = await supabase.auth.admin.createUser({
  email: 'admin@example.com',
  password: 'secure_password_123',
  user_metadata: {
    name: 'Admin User',
    role: 'super_admin',
    permissions: ['manage_users', 'manage_patients', 'manage_partners', 'view_analytics']
  }
})
```

#### Option B: Manual Database Insert
```sql
-- First, create user through Supabase Auth, then get the user_id
-- and insert into admin_profiles table:

INSERT INTO admin_profiles (
  user_id,
  username,
  email,
  name,
  role,
  permissions
) VALUES (
  'your-user-id-from-auth-users',
  'admin',
  'admin@example.com',
  'Admin User',
  'super_admin',
  '{manage_users,manage_patients,manage_partners,view_analytics}'
);
```

### 3. Configure Environment Variables
Make sure your `.env.local` has the correct Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Test the Authentication

1. **Access Admin Login:**
   - Navigate to `http://localhost:5173/admin/login`
   - Use email/password instead of username/password

2. **Login Process:**
   - Enter admin email and password
   - System will authenticate through Supabase Auth
   - Automatically fetch admin profile
   - Redirect to admin dashboard

3. **Session Management:**
   - Sessions are managed by Supabase Auth
   - Automatic token refresh
   - Secure logout functionality

## Key Changes Made

### 1. AdminAuthContext (`src/contexts/AdminAuthContext.tsx`)
- ✅ Uses Supabase Auth `signInWithPassword()`
- ✅ Fetches admin profile from `admin_profiles` table
- ✅ Listens to auth state changes
- ✅ Validates admin permissions
- ✅ Proper session management

### 2. AdminLogin Component (`src/pages/admin/AdminLogin.tsx`)
- ✅ Changed from username to email input
- ✅ Added email validation
- ✅ Uses new login method

### 3. RequireAdminAuth Component (`src/components/admin/RequireAdminAuth.tsx`)
- ✅ Updated to use `adminProfile` instead of `admin`
- ✅ Permission checking with new structure

### 4. Database Schema (`admin-supabase-auth-setup.sql`)
- ✅ `admin_profiles` table with RLS policies
- ✅ Automatic profile creation trigger
- ✅ Role-based access control
- ✅ Secure permission system

## Security Features

### Row Level Security (RLS)
- ✅ Admins can only see their own profile
- ✅ Super admins can manage all profiles
- ✅ Proper access control based on roles

### Authentication
- ✅ Secure password hashing by Supabase
- ✅ JWT token management
- ✅ Automatic session refresh
- ✅ PKCE flow for enhanced security

### Permissions System
- ✅ Role-based permissions (`admin`, `super_admin`, `manager`)
- ✅ Granular permission checking
- ✅ Easy to extend for new features

## Troubleshooting

### Admin Profile Not Found
If you get "User is not an admin" error:
1. Check if admin profile exists in `admin_profiles` table
2. Ensure `user_id` matches the auth user ID
3. Verify email is correct

### Authentication Issues
1. Check Supabase connection in browser devtools
2. Verify environment variables
3. Check RLS policies are correctly applied

### Permission Errors
1. Verify admin role in `admin_profiles`
2. Check permissions array
3. Update required permissions in route protection

## Next Steps

1. **Test the new authentication flow**
2. **Create additional admin users as needed**
3. **Update any remaining references to old authentication**
4. **Consider implementing password reset functionality**
5. **Add admin user management interface**

## Migration Notes

- ✅ No more localStorage for session storage
- ✅ No more custom authentication functions
- ✅ Better security with Supabase Auth
- ✅ Proper session management
- ✅ Easy to extend and maintain