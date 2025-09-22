# Contact Form System Setup

This document provides instructions for setting up the complete contact form system with database integration and admin management.

## Overview

The contact form system includes:
- Public contact form page with validation and submission
- Database storage with proper security policies
- Admin interface for managing contact submissions
- Email/phone integration for direct contact
- Status tracking (new, in-progress, resolved, closed)
- 24-hour response time confirmation

## Database Setup

### 1. Create Database Tables

Run the SQL commands in `/database/contact-setup.sql` in your Supabase SQL editor:

```sql
-- This will create:
-- - contacts table with proper structure
-- - RLS (Row Level Security) policies
-- - Indexes for performance
-- - Sample data for testing
```

### 2. Verify Database Setup

After running the SQL, verify the setup:

1. Check that the `contacts` table exists
2. Verify RLS policies are active
3. Test that public users can insert records
4. Confirm admin users can read/update/delete

## Features

### Public Contact Form (`/contact`)

**Features:**
- ✅ Complete contact form with validation
- ✅ Subject selection (General Inquiry, Service Information, etc.)
- ✅ Phone/email validation
- ✅ Message length validation (minimum 10 characters)
- ✅ Success page with 24-hour response confirmation
- ✅ Responsive design with navbar and footer
- ✅ Error handling and user feedback

**Form Fields:**
- Name (required)
- Email (required, validated)
- Phone (required, validated)
- Subject (dropdown selection)
- Message (required, min 10 characters)

### Admin Contact Management (`/admin/contacts`)

**Features:**
- ✅ Dashboard with contact statistics
- ✅ Search and filter functionality
- ✅ Status management (new → in-progress → resolved → closed)
- ✅ Detailed contact view in modal
- ✅ Direct email/phone integration
- ✅ Delete functionality
- ✅ Responsive table design

**Statistics Tracked:**
- Total contacts
- New messages count
- In-progress count
- Today's contacts

**Admin Actions:**
- View full contact details
- Update contact status
- Reply via email (opens mail client)
- Call contact (opens phone app)
- Delete contact (with confirmation)

## Navigation

### Public Navigation
The contact form is accessible via:
- `/contact` - Direct URL
- Navbar "Contact" link (added to all pages)
- Footer links

### Admin Navigation
Contact management is accessible via:
- `/admin/contacts` - Direct URL
- Admin navigation sidebar
- Admin dashboard links

## File Structure

```
src/
├── pages/
│   ├── Contact.tsx                 # Public contact form page
│   └── admin/
│       └── ContactManagement.tsx   # Admin contact interface
├── lib/
│   └── contactService.ts          # Database service layer
├── components/
│   └── admin/
│       └── AdminNav.tsx           # Admin navigation with contact link
└── App.tsx                        # Updated routing

database/
└── contact-setup.sql              # Database setup commands
```

## Security

### Row Level Security (RLS)
- ✅ Public users can only INSERT (submit forms)
- ✅ Admin users can SELECT/UPDATE/DELETE
- ✅ No unauthorized access to contact data

### Data Validation
- ✅ Client-side form validation
- ✅ Server-side data constraints
- ✅ SQL injection protection via Supabase

### Admin Authentication
- ✅ Protected admin routes
- ✅ Role-based access control
- ✅ Secure admin authentication flow

## Testing

### Manual Testing Steps

1. **Public Form Submission:**
   - Navigate to `/contact`
   - Fill out form with valid data
   - Submit and verify success message
   - Check database for new record

2. **Admin Management:**
   - Login as admin
   - Navigate to `/admin/contacts`
   - View contact statistics
   - Test search and filtering
   - Update contact status
   - Test email/phone integration

3. **Security Testing:**
   - Try accessing admin routes without authentication
   - Verify RLS policies prevent unauthorized access
   - Test form validation with invalid data

## Troubleshooting

### Common Issues

1. **Database Connection Errors:**
   - Verify Supabase credentials in environment variables
   - Check database URL and API keys
   - Ensure RLS policies are properly configured

2. **Form Submission Fails:**
   - Check browser console for JavaScript errors
   - Verify network requests in developer tools
   - Check Supabase logs for errors

3. **Admin Access Issues:**
   - Verify admin user has correct role metadata
   - Check authentication state in admin context
   - Ensure admin routes are properly protected

### Debug Steps

1. **Check Database Setup:**
   ```sql
   -- Verify table exists
   SELECT * FROM contacts LIMIT 1;
   
   -- Check RLS policies
   SELECT * FROM pg_policies WHERE tablename = 'contacts';
   ```

2. **Check Console Logs:**
   - Open browser developer tools
   - Look for error messages in console
   - Check network tab for failed requests

3. **Verify Environment:**
   - Check `.env` file has correct Supabase settings
   - Ensure environment variables are loaded
   - Verify API keys have correct permissions

## Next Steps

This contact form system is now complete and ready for production use. Consider these enhancements:

1. **Email Notifications:**
   - Set up Supabase Edge Functions for automatic email notifications
   - Send confirmation emails to users
   - Send notifications to admin team

2. **Analytics:**
   - Track form submission rates
   - Monitor response times
   - Generate monthly reports

3. **Integration:**
   - Connect with CRM systems
   - Add webhook support
   - Integrate with support ticketing systems

## Support

For technical support or questions about this implementation:
1. Check the troubleshooting section above
2. Review the code comments in source files
3. Test with the provided sample data
4. Verify database setup with the SQL verification queries