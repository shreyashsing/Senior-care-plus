import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Separator } from '../../components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table'
import {
  Users,
  CreditCard,
  Calendar,
  HandHeart,
  Hospital,
  TrendingUp,
  Menu,
  X,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Plus,
  Building,
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  FileText
} from 'lucide-react'
import { useToast } from '../../hooks/use-toast'
import {
  getDashboardStats,
  getServicesPerPartner,
  getServiceRequests,
  getAppointments,
  getPartners,
  getPatients,
  updateServiceRequest,
  updateAppointment,
  updatePatient,
  getPatientMedicalReports,
  downloadMedicalReport,
  getDateRangeFilter,
  DashboardStats,
  PartnerService,
  ServiceRequest,
  Appointment,
  Partner,
  Patient,
  MedicalReport,
  ServiceRequestFilters,
  AppointmentFilters,
  PatientFilters
} from '../../lib/adminService'

export function AdminDashboard() {
  const { toast } = useToast()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('overview')
  const [loading, setLoading] = useState(true)

  // Data states
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null)
  const [servicesPerPartner, setServicesPerPartner] = useState<PartnerService[]>([])
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [partners, setPartners] = useState<Partner[]>([])
  const [patients, setPatients] = useState<Patient[]>([])

  // Filter states
  const [serviceFilters, setServiceFilters] = useState<ServiceRequestFilters>({})
  const [appointmentFilters, setAppointmentFilters] = useState<AppointmentFilters>({})
  const [patientFilters, setPatientFilters] = useState<PatientFilters>({})

  // Load data on component mount
  useEffect(() => {
    loadAllData()
  }, [])

  const loadAllData = async () => {
    setLoading(true)
    try {
      await Promise.all([
        loadDashboardStats(),
        loadServicesPerPartner(),
        loadServiceRequests(),
        loadAppointments(),
        loadPartners(),
        loadPatients()
      ])
    } catch (error) {
      console.error('Error loading admin data:', error)
      toast({
        title: "Error",
        description: "Failed to load admin dashboard data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const loadDashboardStats = async () => {
    console.log('🔄 Loading dashboard stats...')
    const stats = await getDashboardStats()
    console.log('📈 Received dashboard stats:', stats)
    setDashboardStats(stats)
  }

  const loadServicesPerPartner = async () => {
    const services = await getServicesPerPartner()
    setServicesPerPartner(services)
  }

  const loadServiceRequests = async () => {
    const requests = await getServiceRequests(serviceFilters)
    setServiceRequests(requests)
  }

  const loadAppointments = async () => {
    const appointmentData = await getAppointments(appointmentFilters)
    setAppointments(appointmentData)
  }

  const loadPartners = async () => {
    const partnerData = await getPartners()
    setPartners(partnerData)
  }

  const loadPatients = async () => {
    const patientData = await getPatients(patientFilters)
    setPatients(patientData)
  }

  // Filter handlers
  const handleServiceFiltersChange = async (newFilters: ServiceRequestFilters) => {
    setServiceFilters(newFilters)
    const requests = await getServiceRequests(newFilters)
    setServiceRequests(requests)
  }

  const handleAppointmentFiltersChange = async (newFilters: AppointmentFilters) => {
    setAppointmentFilters(newFilters)
    const appointmentData = await getAppointments(newFilters)
    setAppointments(appointmentData)
  }

  const handlePatientFiltersChange = async (newFilters: PatientFilters) => {
    setPatientFilters(newFilters)
    const patientData = await getPatients(newFilters)
    setPatients(patientData)
  }

  const navigationItems = [
    {
      id: 'overview',
      label: 'Dashboard Overview',
      icon: TrendingUp,
      description: 'Key metrics and statistics'
    },
    {
      id: 'patients',
      label: 'Patient Management',
      icon: Users,
      description: 'Manage patient records'
    },
    {
      id: 'services',
      label: 'Service Requests',
      icon: HandHeart,
      description: 'Manage service requests'
    },
    {
      id: 'appointments',
      label: 'Appointments',
      icon: Calendar,
      description: 'Appointment management'
    },
    {
      id: 'partners',
      label: 'Partner Management',
      icon: Hospital,
      description: 'Hospital partners'
    }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-6 bg-blue-600">
          <div className="flex items-center">
            <img src="/logo.svg" alt="Logo" className="h-8 w-auto" />
            <span className="ml-2 text-white font-semibold">Admin Portal</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white hover:text-blue-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Admin Info */}
        <div className="p-6 bg-blue-50 border-b">
          <div className="flex items-center">
            <div className="bg-blue-600 text-white rounded-full p-3">
              <Users className="h-6 w-6" />
            </div>
            <div className="ml-3">
              <h3 className="font-semibold text-gray-900">Admin User</h3>
              <p className="text-sm text-blue-600">System Administrator</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigationItems.map((item) => {
            const IconComponent = item.icon
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'partners') {
                    // Navigate to the dedicated Hospital Partner Management page
                    navigate('/admin/hospital-partners')
                  } else {
                    setActiveSection(item.id)
                  }
                  setSidebarOpen(false)
                }}
                className={`w-full flex items-center px-3 py-3 text-left rounded-lg transition-colors ${
                  activeSection === item.id
                    ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <IconComponent className="h-5 w-5 mr-3" />
                <div>
                  <div className="font-medium">{item.label}</div>
                  <div className="text-xs text-gray-500">{item.description}</div>
                </div>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-500 hover:text-gray-700"
              >
                <Menu className="h-6 w-6" />
              </button>
              <h1 className="ml-4 lg:ml-0 text-2xl font-semibold text-gray-900">
                {navigationItems.find(item => item.id === activeSection)?.label}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                Admin Access
              </Badge>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6">
          {activeSection === 'overview' && (
            <OverviewSection 
              dashboardStats={dashboardStats} 
              servicesPerPartner={servicesPerPartner} 
            />
          )}
          {activeSection === 'patients' && (
            <PatientsSection 
              patients={patients}
              onFiltersChange={handlePatientFiltersChange}
              onPatientUpdate={loadPatients}
            />
          )}
          {activeSection === 'services' && (
            <ServiceRequestsSection 
              serviceRequests={serviceRequests}
              partners={partners}
              onFiltersChange={handleServiceFiltersChange}
              onRequestUpdate={loadServiceRequests}
            />
          )}
          {activeSection === 'appointments' && (
            <AppointmentsSection 
              appointments={appointments}
              partners={partners}
              onFiltersChange={handleAppointmentFiltersChange}
              onAppointmentUpdate={loadAppointments}
            />
          )}
        </main>
      </div>
    </div>
  )
}

// Overview Section Component
function OverviewSection({ dashboardStats, servicesPerPartner }: {
  dashboardStats: DashboardStats | null
  servicesPerPartner: PartnerService[]
}) {
  if (!dashboardStats || 
      dashboardStats.totalPatients === undefined || 
      dashboardStats.paidPatients === undefined || 
      dashboardStats.renewalsDue === undefined || 
      dashboardStats.totalAppointments === undefined || 
      dashboardStats.totalServices === undefined) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading dashboard statistics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(dashboardStats.totalPatients || 0).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Registered patients
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Care Plans</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(dashboardStats.paidPatients || 0).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {(dashboardStats.totalPatients || 0) > 0 ? 
                (((dashboardStats.paidPatients || 0) / (dashboardStats.totalPatients || 1)) * 100).toFixed(1) + '% active rate'
                : 'No data available'
              }
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Renewals Due</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{dashboardStats.renewalsDue || 0}</div>
            <p className="text-xs text-muted-foreground">
              Next 30 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(dashboardStats.totalAppointments || 0).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              All time bookings
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Services Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Services Delivered</CardTitle>
            <CardDescription>Overall service delivery statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-600 mb-4">
              {(dashboardStats.totalServices || 0).toLocaleString()}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Total Completed</span>
                <span className="font-medium">{dashboardStats.totalServices} services</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Active Partners</span>
                <span className="font-medium">{servicesPerPartner.length} hospitals</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* <Card>
          <CardHeader>
            <CardTitle>Services by Partner</CardTitle>
            <CardDescription>Top performing hospital partners</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {servicesPerPartner.length > 0 ? (
                servicesPerPartner.slice(0, 5).map((partner, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <Hospital className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="font-medium">{partner.partner_name}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{partner.services_count}</div>
                      <div className="text-xs text-gray-500">services</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <Hospital className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p>No service data available</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card> */}
      </div>
    </div>
  )
}

// Service Requests Section Component
function ServiceRequestsSection({ 
  serviceRequests, 
  partners, 
  onFiltersChange, 
  onRequestUpdate 
}: {
  serviceRequests: ServiceRequest[]
  partners: Partner[]
  onFiltersChange: (filters: ServiceRequestFilters) => Promise<void>
  onRequestUpdate: () => Promise<void>
}) {
  const { toast } = useToast()
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')
  const [partnerFilter, setPartnerFilter] = useState('all')

  const handleFiltersChange = async () => {
    const filters: ServiceRequestFilters = {
      status: statusFilter !== 'all' ? statusFilter : undefined,
      partnerId: partnerFilter !== 'all' ? partnerFilter : undefined,
      ...getDateRangeFilter(dateFilter)
    }
    await onFiltersChange(filters)
  }

  const handleStatusUpdate = async (requestId: string, newStatus: string) => {
    try {
      await updateServiceRequest(requestId, { status: newStatus as any })
      await onRequestUpdate()
      toast({
        title: "Status Updated",
        description: "Service request status has been updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update service request status",
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case 'scheduled':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Scheduled</Badge>
      case 'in_progress':
        return <Badge variant="secondary" className="bg-purple-100 text-purple-800">In Progress</Badge>
      case 'completed':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Completed</Badge>
      case 'cancelled':
        return <Badge variant="secondary" className="bg-red-100 text-red-800">Cancelled</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <Badge variant="destructive">Urgent</Badge>
      case 'high':
        return <Badge variant="destructive">High</Badge>
      case 'medium':
        return <Badge variant="secondary" className="bg-orange-100 text-orange-800">Medium</Badge>
      case 'low':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Low</Badge>
      default:
        return <Badge variant="secondary">{priority}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Service Request Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full p-2 border rounded-lg"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="scheduled">Scheduled</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Date Range</label>
              <select 
                value={dateFilter} 
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full p-2 border rounded-lg"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Partner</label>
              <select 
                value={partnerFilter} 
                onChange={(e) => setPartnerFilter(e.target.value)}
                className="w-full p-2 border rounded-lg"
              >
                <option value="all">All Partners</option>
                {partners.map((partner) => (
                  <option key={partner.id} value={partner.id}>{partner.name}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <Button className="w-full" onClick={handleFiltersChange}>
                <Filter className="h-4 w-4 mr-2" />
                Apply Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Service Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle>Service Requests ({serviceRequests.length})</CardTitle>
          <CardDescription>Manage and track all service requests</CardDescription>
        </CardHeader>
        <CardContent>
          {serviceRequests.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <HandHeart className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>No service requests found</p>
              <p className="text-sm">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4">Patient</th>
                    <th className="text-left p-4">Service Type</th>
                    <th className="text-left p-4">Status</th>
                    <th className="text-left p-4">Priority</th>
                    <th className="text-left p-4">Partner</th>
                    <th className="text-left p-4">Request Date</th>
                    <th className="text-left p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {serviceRequests.map((request) => (
                    <tr key={request.id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <div>
                          <div className="font-medium">{request.patient_name || 'Unknown Patient'}</div>
                          <div className="text-sm text-gray-500">{request.patient_senior_care_id}</div>
                        </div>
                      </td>
                      <td className="p-4">{request.service_type}</td>
                      <td className="p-4">{getStatusBadge(request.status)}</td>
                      <td className="p-4">{getPriorityBadge(request.priority)}</td>
                      <td className="p-4">{request.partner_name || 'Unassigned'}</td>
                      <td className="p-4">{new Date(request.created_at).toLocaleDateString()}</td>
                      <td className="p-4">
                        <div className="flex space-x-2">
                          <select
                            value={request.status}
                            onChange={(e) => handleStatusUpdate(request.id, e.target.value)}
                            className="text-sm border rounded px-2 py-1"
                          >
                            <option value="pending">Pending</option>
                            <option value="scheduled">Scheduled</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Appointments Section Component
function AppointmentsSection({ 
  appointments, 
  partners, 
  onFiltersChange, 
  onAppointmentUpdate 
}: {
  appointments: Appointment[]
  partners: Partner[]
  onFiltersChange: (filters: AppointmentFilters) => Promise<void>
  onAppointmentUpdate: () => Promise<void>
}) {
  const { toast } = useToast()
  const [hospitalFilter, setHospitalFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const handleFiltersChange = async () => {
    const filters: AppointmentFilters = {
      partnerId: hospitalFilter !== 'all' ? hospitalFilter : undefined,
      status: statusFilter !== 'all' ? statusFilter : undefined,
      ...getDateRangeFilter(dateFilter)
    }
    await onFiltersChange(filters)
  }

  const handleStatusUpdate = async (appointmentId: string, newStatus: string) => {
    try {
      await updateAppointment(appointmentId, { status: newStatus as any })
      await onAppointmentUpdate()
      toast({
        title: "Status Updated",
        description: "Appointment status has been updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update appointment status",
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Confirmed</Badge>
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case 'completed':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Completed</Badge>
      case 'cancelled':
        return <Badge variant="secondary" className="bg-red-100 text-red-800">Cancelled</Badge>
      case 'no_show':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800">No Show</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Appointment Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Appointment Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Hospital Name</label>
              <select 
                value={hospitalFilter}
                onChange={(e) => setHospitalFilter(e.target.value)}
                className="w-full p-2 border rounded-lg"
              >
                <option value="all">All Hospitals</option>
                {partners.map((partner) => (
                  <option key={partner.id} value={partner.id}>{partner.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full p-2 border rounded-lg"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="no_show">No Show</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Date Range</label>
              <select 
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full p-2 border rounded-lg"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button className="w-full" onClick={handleFiltersChange}>
                <Filter className="h-4 w-4 mr-2" />
                Apply Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appointments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Appointment Requests ({appointments.length})</CardTitle>
          <CardDescription>Manage all appointment bookings</CardDescription>
        </CardHeader>
        <CardContent>
          {appointments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>No appointments found</p>
              <p className="text-sm">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4">Patient</th>
                    <th className="text-left p-4">Service Type</th>
                    <th className="text-left p-4">Hospital</th>
                    <th className="text-left p-4">Doctor</th>
                    <th className="text-left p-4">Date & Time</th>
                    <th className="text-left p-4">Status</th>
                    <th className="text-left p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((appointment) => (
                    <tr key={appointment.id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <div>
                          <div className="font-medium">{appointment.patient_name || 'Unknown Patient'}</div>
                          <div className="text-sm text-gray-500">{appointment.patient_senior_care_id}</div>
                        </div>
                      </td>
                      <td className="p-4">{appointment.service_type}</td>
                      <td className="p-4">{appointment.partner_name || 'Unassigned'}</td>
                      <td className="p-4">{appointment.doctor_name || 'TBA'}</td>
                      <td className="p-4">
                        <div>
                          <div className="font-medium">{new Date(appointment.appointment_date).toLocaleDateString()}</div>
                          <div className="text-sm text-gray-500">{appointment.appointment_time}</div>
                        </div>
                      </td>
                      <td className="p-4">{getStatusBadge(appointment.status)}</td>
                      <td className="p-4">
                        <select
                          value={appointment.status}
                          onChange={(e) => handleStatusUpdate(appointment.id, e.target.value)}
                          className="text-sm border rounded px-2 py-1"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                          <option value="no_show">No Show</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Partners Section Component
function PartnersSection({ partners, onPartnerUpdate }: {
  partners: Partner[]
  onPartnerUpdate: () => Promise<void>
}) {
  const { toast } = useToast()

  const handleAddPartner = () => {
    toast({
      title: "Add Partner",
      description: "Partner addition form will be available soon",
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Active</Badge>
      case 'inactive':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Inactive</Badge>
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Add Partner Button */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Hospital Partners ({partners.length})</h2>
          <p className="text-sm text-gray-500">Manage your healthcare partner network</p>
        </div>
        <Button onClick={handleAddPartner}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Partner
        </Button>
      </div>

      {/* Partners Grid */}
      {partners.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <Hospital className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500">No partners found</p>
            <p className="text-sm text-gray-400">Add your first hospital partner to get started</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {partners.map((partner) => (
            <Card key={partner.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      <Hospital className="h-5 w-5 mr-2 text-blue-600" />
                      {partner.name}
                    </CardTitle>
                    <CardDescription>{partner.type}</CardDescription>
                  </div>
                  {getStatusBadge(partner.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{partner.location}</span>
                  </div>
                  {partner.contact_phone && (
                    <div className="flex items-center text-sm">
                      <Phone className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{partner.contact_phone}</span>
                    </div>
                  )}
                  {partner.contact_email && (
                    <div className="flex items-center text-sm">
                      <Mail className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{partner.contact_email}</span>
                    </div>
                  )}
                </div>

                {partner.services && partner.services.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Services Offered</h4>
                    <div className="flex flex-wrap gap-2">
                      {partner.services.map((service, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <Separator />

                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">
                    Joined: {new Date(partner.joined_date).toLocaleDateString()}
                  </span>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

// Patients Section Component
function PatientsSection({ patients, onFiltersChange, onPatientUpdate }: {
  patients: Patient[]
  onFiltersChange: (filters: PatientFilters) => void
  onPatientUpdate: () => void
}) {
  const { toast } = useToast()
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('')

  const handleFiltersChange = () => {
    const filters: PatientFilters = {}
    if (searchTerm) filters.search = searchTerm
    if (selectedStatus) filters.care_plan_status = selectedStatus
    onFiltersChange(filters)
  }

  React.useEffect(() => {
    const debounceTimer = setTimeout(handleFiltersChange, 300)
    return () => clearTimeout(debounceTimer)
  }, [searchTerm, selectedStatus])

  const getStatusBadge = (status?: string) => {
    const statusMap = {
      active: { variant: 'default' as const, label: 'Active', color: 'bg-green-100 text-green-800' },
      inactive: { variant: 'secondary' as const, label: 'Inactive', color: 'bg-gray-100 text-gray-800' },
      pending: { variant: 'outline' as const, label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
      expired: { variant: 'destructive' as const, label: 'Expired', color: 'bg-red-100 text-red-800' }
    }
    const config = statusMap[status as keyof typeof statusMap] || statusMap.inactive
    return <Badge className={config.color}>{config.label}</Badge>
  }

  const getAge = (dateOfBirth?: string) => {
    if (!dateOfBirth) return 'N/A'
    const today = new Date()
    const birth = new Date(dateOfBirth)
    const age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      return age - 1
    }
    return age
  }

  const handlePatientClick = (patientId: string) => {
    navigate(`/admin/patients/${patientId}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Patient Management</h2>
          <p className="text-gray-600">Manage patient records and care plans</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Patient
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Care Plan Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
                <option value="expired">Expired</option>
              </select>
            </div>
            <div className="space-y-2 flex items-end">
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('')
                  setSelectedStatus('')
                }}
                className="w-full"
              >
                <Filter className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Patients List */}
      {patients.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500">No patients found</p>
            <p className="text-sm text-gray-400">Try adjusting your filters or add a new patient</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Patients ({patients.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Name</TableHead>
                    <TableHead>Patient ID</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Medical Conditions</TableHead>
                    <TableHead>Registration Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patients.map((patient) => (
                    <TableRow 
                      key={patient.id} 
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handlePatientClick(patient.id)}
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2 text-blue-600" />
                          {patient.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                          {patient.senior_care_id}
                        </code>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[200px] truncate">
                          {patient.email || 'Not provided'}
                        </div>
                      </TableCell>
                      <TableCell>{patient.phone_number || 'Not provided'}</TableCell>
                      <TableCell>{getAge(patient.date_of_birth)}</TableCell>
                      {/* <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{patient.care_plan_name || 'No plan'}</div>
                          {patient.care_plan_tier && (
                            <div className="text-sm text-gray-500">Tier: {patient.care_plan_tier}</div>
                          )}
                        </div>
                      </TableCell> */}
                      <TableCell>
                        {getStatusBadge(patient.care_plan_status)}
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[200px]">
                          {patient.medical_conditions && patient.medical_conditions.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {patient.medical_conditions.slice(0, 2).map((condition, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {condition}
                                </Badge>
                              ))}
                              {patient.medical_conditions.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{patient.medical_conditions.length - 2} more
                                </Badge>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-500 text-sm">None specified</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {new Date(patient.registration_date || patient.created_at).toLocaleDateString()}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

    </div>
  )
}