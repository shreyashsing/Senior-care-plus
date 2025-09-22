# Admin Authentication Setup Guide

This guide walks you through setting up proper Supabase authentication for admin users, replacing the demo login system.

## 🔧 Database Setup

### 1. Run the Admin Authentication Schema

Execute the `admin-auth-schema.sql` file in your Supabase SQL Editor to create:

- ✅ `admin_profiles` table linked to `auth.users`
- ✅ Proper RLS policies for admin access
- ✅ Triggers for automatic profile creation
- ✅ Helper functions for admin management
- ✅ Updated hospital_partners RLS policies

### 2. Database Schema Features

**Admin Profiles Table:**
- Linked to Supabase `auth.users` via foreign key
- Username, full name, role, permissions
- Active status and login tracking
- Automatic timestamp management

**Row Level Security:**
- Admin-only access to hospital partners
- Proper authentication checks
- Secure data isolation

## 👤 Creating Admin Users

### Method 1: Supabase Dashboard (Recommended)

1. **Go to Supabase Dashboard**
   - Navigate to Authentication > Users
   - Click "Add user"

2. **Fill User Details**
   - Email: `admin@yourdomain.com`
   - Password: `your_secure_password`
   - ✅ Email confirmed: true

3. **Add User Metadata** (Critical!)
   ```json
   {
     "role": "admin",
     "username": "admin_username",
     "full_name": "System Administrator"
   }
   ```

4. **Click "Create user"**
   - The trigger will automatically create the admin profile
   - User can now log in to the admin panel

### Method 2: Using CreateAdminUser Component

1. **Access the component** (for development)
2. **Fill the form** with admin details
3. **Generate instructions** for manual creation
4. **Follow the generated instructions** in Supabase Dashboard

## 🚀 Updated Authentication Flow

### New Login Process

**Frontend Changes:**
- Login form now uses **email** instead of username
- Proper Supabase authentication integration
- Session management through Supabase Auth
- Automatic admin profile validation

**Backend Changes:**
- Real Supabase auth tokens
- Proper RLS policy enforcement
- Session-based authentication
- Admin privilege validation

### Authentication Functions

```typescript
// New authentication functions available:
- authenticateAdmin(email, password)  // Login with email/password
- getCurrentAdmin()                   // Get current logged-in admin
- logoutAdmin()                      // Sign out admin user
- createAdminUser()                  // Create new admin (requires admin API)
```

## 🔐 Security Features

### Row Level Security (RLS)

**Hospital Partners:**
- Only authenticated admins can manage partners
- Proper user isolation
- Real-time permission checking

**Admin Profiles:**
- Admins can only access their own profile or other admin profiles
- Active status checking
- Role-based access control

### Authentication Validation

- ✅ Real Supabase auth sessions
- ✅ JWT token validation
- ✅ Admin role verification
- ✅ Active status checking
- ✅ Permission-based access

## 📋 Migration Steps

### 1. Database Migration

```sql
-- Run this in Supabase SQL Editor
-- (Execute admin-auth-schema.sql)
```

### 2. Create First Admin User

**Option A: Dashboard**
1. Go to Supabase Dashboard > Authentication > Users
2. Create user with proper metadata (see above)

**Option B: SQL Function** (for reference)
```sql
SELECT create_first_admin(
  'admin@yourdomain.com',
  'secure_password',
  'admin',
  'System Administrator'
);
```

### 3. Test Authentication

1. **Navigate to** `/admin/login`
2. **Use email/password** instead of username
3. **Verify** admin dashboard access
4. **Test** hospital partner management

## 🎯 Key Changes Summary

### ✅ Removed
- Demo/localStorage authentication
- Username-based login
- Hardcoded admin credentials
- Anonymous session workarounds

### ✅ Added
- Proper Supabase Auth integration
- Email-based admin login
- Real RLS policies with admin validation
- Admin profile management
- Session-based authentication
- Secure hospital partner access

### ✅ Updated Components
- `AdminAuthContext` - Real Supabase auth
- `AdminLogin` - Email input instead of username
- `adminService.ts` - Proper authentication functions
- Hospital partner RLS policies

## 🔧 Environment Variables

Ensure these are set in your `.env` file:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🧪 Testing Checklist

### ✅ Authentication
- [ ] Create admin user via Supabase Dashboard
- [ ] Login with email/password at `/admin/login`
- [ ] Verify admin dashboard access
- [ ] Test logout functionality

### ✅ Hospital Partners
- [ ] Access hospital partner management
- [ ] Create new hospital partner
- [ ] Edit existing partner
- [ ] Verify RLS policies work

### ✅ Security
- [ ] Verify non-admin users cannot access admin routes
- [ ] Test session persistence across browser refresh
- [ ] Verify proper error handling for invalid credentials

## 🚨 Important Notes

1. **No More Demo Login**: The old username/password demo system is completely removed
2. **Real Authentication**: All admin access now requires proper Supabase authentication
3. **RLS Enforcement**: Database operations are properly secured with RLS policies
4. **Session Management**: Uses Supabase's built-in session management
5. **Production Ready**: This authentication system is suitable for production use

## 🆘 Troubleshooting

### Common Issues

**Login Fails:**
- Verify user exists in Supabase Auth
- Check user metadata includes `"role": "admin"`
- Ensure admin profile was created automatically

**RLS Errors:**
- Verify admin authentication is working
- Check admin profile exists and is active
- Ensure proper Supabase session

**Access Denied:**
- Verify admin role in user metadata
- Check admin profile `is_active` status
- Ensure proper RLS policies are applied

The admin authentication system is now production-ready with proper security! 🎉