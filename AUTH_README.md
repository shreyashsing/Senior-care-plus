# Authentication System

This project implements a production-ready authentication system using Supabase as the backend. The system is built with security and performance in mind, ready for future payment integrations.

## Features

- ✅ User Registration with email verification
- ✅ Secure login with PKCE flow
- ✅ Password reset functionality
- ✅ Protected routes with role-based access
- ✅ Persistent sessions with auto-refresh
- ✅ TypeScript integration
- ✅ Form validation with Zod
- ✅ Clean error handling
- ✅ Responsive UI with Tailwind CSS

## Setup

1. **Environment Variables**
   
   Copy `.env.example` to `.env.local` and fill in your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

2. **Supabase Setup**
   
   Create the following tables in your Supabase database:

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

   -- Create care_plans table
   CREATE TABLE care_plans (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
     name TEXT NOT NULL,
     description TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
   );

   -- Create care_sessions table
   CREATE TABLE care_sessions (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     care_plan_id UUID REFERENCES care_plans(id) ON DELETE CASCADE,
     scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
     completed_at TIMESTAMP WITH TIME ZONE,
     notes TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
   );

   -- Enable Row Level Security
   ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
   ALTER TABLE care_plans ENABLE ROW LEVEL SECURITY;
   ALTER TABLE care_sessions ENABLE ROW LEVEL SECURITY;

   -- Create policies
   CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
   CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
   CREATE POLICY "Users can view own care plans" ON care_plans FOR SELECT USING (auth.uid() = user_id);
   CREATE POLICY "Users can view own care sessions" ON care_sessions FOR SELECT USING (
     EXISTS (SELECT 1 FROM care_plans WHERE care_plans.id = care_sessions.care_plan_id AND care_plans.user_id = auth.uid())
   );

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

3. **Authentication Flow**
   
   Enable email confirmation in Supabase Auth settings and configure email templates.

## Usage

### Pages Available

- `/` - Landing page
- `/login` - User login
- `/signup` - User registration
- `/forgot-password` - Password reset
- `/dashboard` - Protected dashboard (requires authentication)
- `/unauthorized` - Access denied page

### Authentication Hooks

The system provides several custom hooks for auth operations:

```typescript
import { useLogin, useSignup, useLogout, usePasswordReset } from '../hooks/useAuth'

// Login
const { login, loading, error } = useLogin()
await login({ email, password, rememberMe })

// Signup
const { signup, loading, error } = useSignup()
await signup({ email, password, confirmPassword, fullName, phone, terms })

// Logout
const { logout } = useLogout()
await logout()

// Password Reset
const { requestReset, loading, error, success } = usePasswordReset()
await requestReset({ email })
```

### Protected Routes

Use the route protection components:

```typescript
import { RequireAuth, RequireAdmin, GuestOnly } from '../components/auth'

// Require authentication
<RequireAuth>
  <YourComponent />
</RequireAuth>

// Require admin role
<RequireAdmin>
  <AdminComponent />
</RequireAdmin>

// Guest only (redirects if authenticated)
<GuestOnly>
  <LoginForm />
</GuestOnly>
```

## Security Features

- **PKCE Flow**: Enhanced security for authentication
- **Row Level Security**: Database-level access control
- **Role-based Access**: User, admin, and care manager roles
- **Password Validation**: Strong password requirements
- **Session Management**: Automatic token refresh
- **CSRF Protection**: Built into Supabase

## Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Production Considerations

- Configure proper CORS settings in Supabase
- Set up email authentication templates
- Configure custom domains for auth emails
- Enable MFA for admin accounts
- Set up monitoring and logging
- Configure rate limiting for auth endpoints

## Next Steps

- Add social authentication (Google, GitHub, etc.)
- Implement user profile management
- Add email verification UI
- Set up admin dashboard
- Add audit logging
- Implement 2FA
- Add password strength meter
- Set up automated testing