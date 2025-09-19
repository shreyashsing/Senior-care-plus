# Admin Portal Database Setup Instructions

## Prerequisites
- Supabase project already set up with existing patient tables
- Database access to run SQL scripts

## Setup Steps

### 1. Execute Database Schema
Run the `admin-database-setup.sql` file in your Supabase SQL editor to create:
- `admin_users` table for admin authentication
- `partners` table for hospital partners
- `service_requests` table for service management
- `appointments` table for appointment booking
- `admin_activity_logs` table for audit trails
- All necessary indexes and RLS policies
- Required functions for authentication and statistics

### 2. Environment Variables
Make sure your `.env` file contains:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Default Admin User
The setup script creates a default admin user:
- **Username**: `admin`
- **Password**: `admin123`
- **Role**: `super_admin`

### 4. Test Data
The script also creates sample hospital partners:
- Apollo Hospital
- Fortis Healthcare  
- Max Healthcare

## Admin Portal Features

### Dashboard Overview
- Total registered customers
- Paid customers with conversion rates
- Renewals due in next 30 days
- Total appointments booked
- Total services delivered
- Services delivered per partner

### Service Requests Management
- View all service requests with filtering
- Filter by status (pending/scheduled/in_progress/completed/cancelled)
- Filter by date range and partner
- Update service request status
- Real-time data loading

### Appointments Management
- View all appointments with filtering
- Filter by hospital, status, and date range
- Update appointment status
- Comprehensive appointment details

### Partner Management
- View all hospital partners
- Partner details including services offered
- Contact information management
- Status tracking (active/inactive/pending)

## Security Features

### Row Level Security (RLS)
- All admin tables protected with RLS policies
- Admin authentication required for data access
- Role-based permissions enforcing

### Authentication
- Secure admin login with hashed passwords
- Session management with localStorage
- Automatic route protection

### Audit Trail
- Admin activity logging
- Resource access tracking
- Change history maintenance

## API Functions

### Authentication
- `authenticateAdmin(username, password)` - Admin login
- Session management with role verification

### Statistics
- `getDashboardStats()` - Overview statistics
- `getServicesPerPartner()` - Partner performance metrics

### Data Management
- `getServiceRequests(filters)` - Filtered service requests
- `getAppointments(filters)` - Filtered appointments
- `getPartners()` - All hospital partners
- Update functions for status changes

## Usage

### Accessing Admin Portal
1. Navigate to your website footer
2. Click "Admin Portal" link
3. Use admin credentials to login
4. Explore dashboard sections

### Managing Data
- Use filters to find specific records
- Update statuses directly from tables
- Export functionality available
- Real-time updates without page refresh

## Database Schema

### Key Tables
- **admin_users**: Admin authentication and roles
- **partners**: Hospital partner information
- **service_requests**: Patient service requests
- **appointments**: Medical appointments
- **admin_activity_logs**: Audit trail

### Key Functions
- **authenticate_admin**: Secure admin login
- **get_admin_dashboard_stats**: Dashboard metrics
- **get_services_per_partner**: Partner performance

## Next Steps
1. Execute the SQL setup script
2. Test admin login functionality
3. Verify data loading in dashboard
4. Customize partner information as needed
5. Add real service requests and appointments for testing

## Support
- All components use TypeScript for type safety
- Error handling implemented throughout
- Toast notifications for user feedback
- Responsive design for mobile/desktop use