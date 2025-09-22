import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  MoreVertical, 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Users, 
  Activity,
  CheckCircle,
  XCircle,
  Clock,
  Loader2
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { 
  HospitalPartnerService, 
  type HospitalPartner, 
  type HospitalPartnerFilters,
  CATEGORY_OPTIONS 
} from '@/lib/hospitalPartnerService'
import HospitalPartnerForm from '@/components/admin/HospitalPartnerForm'
import AdminLayout from '@/components/admin/AdminLayout'

const HospitalPartnerManagement: React.FC = () => {
  const [partners, setPartners] = useState<HospitalPartner[]>([])
  const [filteredPartners, setFilteredPartners] = useState<HospitalPartner[]>([])
  const [filters, setFilters] = useState<HospitalPartnerFilters>({})
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPartner, setSelectedPartner] = useState<HospitalPartner | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statistics, setStatistics] = useState<any>(null)
  const [uniqueCities, setUniqueCities] = useState<string[]>([])

  // Load initial data
  useEffect(() => {
    loadPartners()
    loadStatistics()
    loadUniqueCities()
  }, [])

  // Apply filters whenever partners or filters change
  useEffect(() => {
    applyFilters()
  }, [partners, filters, searchTerm])

  const loadPartners = async () => {
    try {
      setIsLoading(true)
      const data = await HospitalPartnerService.getHospitalPartners()
      setPartners(data)
    } catch (err) {
      console.error('Error loading partners:', err)
      setError(err instanceof Error ? err.message : 'Failed to load partners')
    } finally {
      setIsLoading(false)
    }
  }

  const loadStatistics = async () => {
    try {
      const stats = await HospitalPartnerService.getPartnersStatistics()
      setStatistics(stats)
    } catch (err) {
      console.error('Error loading statistics:', err)
    }
  }

  const loadUniqueCities = async () => {
    try {
      const cities = await HospitalPartnerService.getUniqueCities()
      setUniqueCities(cities)
    } catch (err) {
      console.error('Error loading cities:', err)
    }
  }

  const applyFilters = () => {
    let filtered = [...partners]

    // Apply search
    if (searchTerm) {
      const search = searchTerm.toLowerCase()
      filtered = filtered.filter(partner =>
        partner.name.toLowerCase().includes(search) ||
        partner.category.toLowerCase().includes(search) ||
        partner.city.toLowerCase().includes(search) ||
        partner.contact_person_name.toLowerCase().includes(search)
      )
    }

    // Apply category filter
    if (filters.category) {
      filtered = filtered.filter(partner => partner.category === filters.category)
    }

    // Apply city filter
    if (filters.city) {
      filtered = filtered.filter(partner => partner.city === filters.city)
    }

    // Apply status filter
    if (filters.status) {
      filtered = filtered.filter(partner => partner.status === filters.status)
    }

    setFilteredPartners(filtered)
  }

  const handleCreatePartner = () => {
    setSelectedPartner(null)
    setFormMode('create')
    setShowForm(true)
  }

  const handleEditPartner = (partner: HospitalPartner) => {
    setSelectedPartner(partner)
    setFormMode('edit')
    setShowForm(true)
  }

  const handleViewPartner = (partner: HospitalPartner) => {
    setSelectedPartner(partner)
    setShowDetails(true)
  }

  const handleDeletePartner = async (partner: HospitalPartner) => {
    if (!confirm(`Are you sure you want to delete ${partner.name}?`)) {
      return
    }

    try {
      await HospitalPartnerService.deleteHospitalPartner(partner.id)
      await loadPartners()
      await loadStatistics()
    } catch (err) {
      console.error('Error deleting partner:', err)
      setError(err instanceof Error ? err.message : 'Failed to delete partner')
    }
  }

  const handleToggleStatus = async (partner: HospitalPartner) => {
    try {
      await HospitalPartnerService.togglePartnerStatus(partner.id)
      await loadPartners()
      await loadStatistics()
    } catch (err) {
      console.error('Error toggling partner status:', err)
      setError(err instanceof Error ? err.message : 'Failed to update partner status')
    }
  }

  const handleFormSuccess = async (partner: HospitalPartner) => {
    setShowForm(false)
    setSelectedPartner(null)
    await loadPartners()
    await loadStatistics()
    if (formMode === 'create') {
      await loadUniqueCities()
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'inactive':
        return <XCircle className="w-4 h-4 text-red-500" />
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />
      default:
        return null
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'default'
      case 'inactive':
        return 'destructive'
      case 'pending':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  if (isLoading) {
    return (
      <AdminLayout title="Hospital Partner Management">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Loading hospital partners...</span>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Hospital Partner Management">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Hospital Partner Management</h1>
            <p className="text-gray-600">Manage hospital partners and their services</p>
          </div>
          <Button onClick={handleCreatePartner}>
            <Plus className="w-4 h-4 mr-2" />
            Add New Partner
          </Button>
        </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Statistics */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600">Total Partners</p>
                  <p className="text-2xl font-bold">{statistics.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-sm text-gray-600">Active</p>
                  <p className="text-2xl font-bold">{statistics.active}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-500" />
                <div>
                  <p className="text-sm text-gray-600">Inactive</p>
                  <p className="text-2xl font-bold">{statistics.inactive}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-yellow-500" />
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-2xl font-bold">{statistics.pending}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search partners..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select
              value={filters.category || 'all_categories'}
              onValueChange={(value) => setFilters(prev => ({ ...prev, category: value === 'all_categories' ? undefined : value }))}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all_categories">All Categories</SelectItem>
                {CATEGORY_OPTIONS.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.city || 'all_cities'}
              onValueChange={(value) => setFilters(prev => ({ ...prev, city: value === 'all_cities' ? undefined : value }))}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Cities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all_cities">All Cities</SelectItem>
                {uniqueCities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.status || 'all_status'}
              onValueChange={(value) => setFilters(prev => ({ ...prev, status: value === 'all_status' ? undefined : value }))}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all_status">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Partners List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredPartners.map((partner) => (
          <Card key={partner.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg line-clamp-1">{partner.name}</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline">{partner.category}</Badge>
                    <Badge variant={getStatusBadgeVariant(partner.status)}>
                      {getStatusIcon(partner.status)}
                      <span className="ml-1 capitalize">{partner.status}</span>
                    </Badge>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleViewPartner(partner)}>
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleEditPartner(partner)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleToggleStatus(partner)}>
                      <Activity className="w-4 h-4 mr-2" />
                      {partner.status === 'active' ? 'Deactivate' : 'Activate'}
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleDeletePartner(partner)}
                      className="text-red-600"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span className="line-clamp-1">{partner.address}, {partner.city}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="w-4 h-4" />
                <span>{partner.contact_person_phone}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="w-4 h-4" />
                <span className="line-clamp-1">{partner.contact_person_email}</span>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Services ({Array.isArray(partner.services) ? partner.services.length : 0})
                </p>
                <div className="flex flex-wrap gap-1">
                  {Array.isArray(partner.services) && partner.services.length > 0 && 
                   Array.isArray(partner.services.slice(0, 3)) && 
                   partner.services.slice(0, 3).map((service, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {typeof service === 'object' && service !== null ? 
                        `${service.service} ${service.discount}%` : 
                        String(service)
                      }
                    </Badge>
                  ))}
                  {Array.isArray(partner.services) && partner.services.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{partner.services.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
              
              {partner.free_services && (
                <Badge variant="outline" className="text-green-600 border-green-600">
                  Free Services Available
                </Badge>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPartners.length === 0 && !isLoading && (
        <Card>
          <CardContent className="p-8 text-center">
            <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No partners found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || Object.keys(filters).length > 0
                ? 'No partners match your current filters.'
                : 'Get started by adding your first hospital partner.'}
            </p>
            {(!searchTerm && Object.keys(filters).length === 0) && (
              <Button onClick={handleCreatePartner}>
                <Plus className="w-4 h-4 mr-2" />
                Add First Partner
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {formMode === 'create' ? 'Add New Hospital Partner' : 'Edit Hospital Partner'}
            </DialogTitle>
          </DialogHeader>
          <HospitalPartnerForm
            partner={selectedPartner}
            mode={formMode}
            onSuccess={handleFormSuccess}
            onCancel={() => setShowForm(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Partner Details</DialogTitle>
          </DialogHeader>
          {selectedPartner && (
            <div className="space-y-6">
              {/* Basic Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Name</label>
                      <p className="text-sm text-gray-900">{selectedPartner.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Category</label>
                      <p className="text-sm text-gray-900">{selectedPartner.category}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Status</label>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(selectedPartner.status)}
                        <span className="text-sm text-gray-900 capitalize">{selectedPartner.status}</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Free Services</label>
                      <p className="text-sm text-gray-900">{selectedPartner.free_services ? 'Yes' : 'No'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Services */}
              <Card>
                <CardHeader>
                  <CardTitle>Services & Discounts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {Array.isArray(selectedPartner.services) && selectedPartner.services.map((service, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium">
                          {typeof service === 'object' && service !== null ? service.service : String(service)}
                        </span>
                        <Badge variant="secondary">
                          {typeof service === 'object' && service !== null ? `${service.discount}% off` : '0% off'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Address & Contact */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      Address
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Address</label>
                      <p className="text-sm text-gray-900">{selectedPartner.address}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">City</label>
                        <p className="text-sm text-gray-900">{selectedPartner.city}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Pincode</label>
                        <p className="text-sm text-gray-900">{selectedPartner.pincode}</p>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Areas Served</label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedPartner.pincodes_served.map((pincode) => (
                          <Badge key={pincode} variant="outline" className="text-xs">
                            {pincode}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Contact Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Contact Person</label>
                      <p className="text-sm text-gray-900">{selectedPartner.contact_person_name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Phone</label>
                      <p className="text-sm text-gray-900">{selectedPartner.contact_person_phone}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <p className="text-sm text-gray-900">{selectedPartner.contact_person_email}</p>
                    </div>
                    {selectedPartner.emergency_contact_name && (
                      <>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Emergency Contact</label>
                          <p className="text-sm text-gray-900">{selectedPartner.emergency_contact_name}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Emergency Phone</label>
                          <p className="text-sm text-gray-900">{selectedPartner.emergency_contact_phone}</p>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      </div>
    </AdminLayout>
  )
}

export default HospitalPartnerManagement