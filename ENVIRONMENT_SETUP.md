# Environment Setup for Hospital Partner Management

## Required Environment Variables

Add these to your `.env.local` file:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## Getting the Service Role Key

1. Go to your Supabase project dashboard
2. Navigate to Settings > API
3. Copy the `service_role` key (NOT the anon key)
4. Add it to your `.env.local` file

## Alternative: Simple RLS Fix

If you don't want to use the service role key, run this SQL in your Supabase SQL Editor:

```sql
-- Simple RLS fix that allows authenticated admin operations
DROP POLICY IF EXISTS "Admin can manage hospital partners" ON hospital_partners;
DROP POLICY IF EXISTS "Authenticated users can view active partners" ON hospital_partners;

ALTER TABLE hospital_partners ENABLE ROW LEVEL SECURITY;

-- Allow all operations for authenticated users (since admin uses custom auth)
CREATE POLICY "Allow authenticated operations" ON hospital_partners
    FOR ALL USING (
        auth.role() = 'authenticated' 
        OR auth.uid() IS NULL  -- Allow service role operations
    );

-- Grant permissions
GRANT ALL ON hospital_partners TO authenticated;
GRANT ALL ON hospital_partners TO service_role;
```

## Testing

After setting up the environment:

1. Restart your development server
2. Try creating a hospital partner
3. The RLS error should be resolved

## Troubleshooting

If you still get RLS errors:

1. Check if the service role key is correctly set
2. Verify the `.env.local` file is in the root directory
3. Restart the development server
4. Check browser console for environment variable errors