import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Plus, X, Save, Loader2, MapPin, Phone, Mail, User, Building, Percent } from 'lucide-react'
import { 
  HospitalPartnerService, 
  CreateHospitalPartner, 
  UpdateHospitalPartner, 
  ServiceWithDiscount,
  SERVICE_OPTIONS,
  CATEGORY_OPTIONS,
  type HospitalPartner 
} from '@/lib/hospitalPartnerService'

interface HospitalPartnerFormProps {
  partner?: HospitalPartner | null
  onSuccess?: (partner: HospitalPartner) => void
  onCancel?: () => void
  mode?: 'create' | 'edit'
}

interface FormData {
  name: string
  category: string
  services: ServiceWithDiscount[]
  free_services: boolean
  address: string
  city: string
  pincode: string
  pincodes_served: string[]
  contact_person_name: string
  contact_person_phone: string
  contact_person_email: string
  emergency_contact_name: string
  emergency_contact_phone: string
}

const HospitalPartnerForm: React.FC<HospitalPartnerFormProps> = ({
  partner,
  onSuccess,
  onCancel,
  mode = 'create'
}) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    category: '',
    services: [],
    free_services: false,
    address: '',
    city: '',
    pincode: '',
    pincodes_served: [],
    contact_person_name: '',
    contact_person_phone: '',
    contact_person_email: '',
    emergency_contact_name: '',
    emergency_contact_phone: ''
  })

  const [selectedService, setSelectedService] = useState('')
  const [selectedDiscount, setSelectedDiscount] = useState<number>(0)
  const [newPincode, setNewPincode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  // Initialize form data when partner prop changes
  useEffect(() => {
    if (partner && mode === 'edit') {
      setFormData({
        name: partner.name || '',
        category: partner.category || '',
        services: partner.services || [],
        free_services: partner.free_services || false,
        address: partner.address || '',
        city: partner.city || '',
        pincode: partner.pincode || '',
        pincodes_served: partner.pincodes_served || [],
        contact_person_name: partner.contact_person_name || '',
        contact_person_phone: partner.contact_person_phone || '',
        contact_person_email: partner.contact_person_email || '',
        emergency_contact_name: partner.emergency_contact_name || '',
        emergency_contact_phone: partner.emergency_contact_phone || ''
      })
    }
  }, [partner, mode])

  // Handle input changes
  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear field error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  // Add service with discount
  const addService = () => {
    if (!selectedService) return
    
    // Check if service already exists
    const serviceExists = formData.services.some(s => s.service === selectedService)
    if (serviceExists) {
      setError('This service has already been added')
      return
    }

    const newService: ServiceWithDiscount = {
      service: selectedService,
      discount: selectedDiscount
    }

    setFormData(prev => ({
      ...prev,
      services: [...prev.services, newService]
    }))
    
    setSelectedService('')
    setSelectedDiscount(0)
    setError(null)
  }

  // Remove service
  const removeService = (index: number) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index)
    }))
  }

  // Update service discount
  const updateServiceDiscount = (index: number, discount: number) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.map((service, i) => 
        i === index ? { ...service, discount } : service
      )
    }))
  }

  // Add pincode
  const addPincode = () => {
    if (!newPincode.trim()) return
    
    // Validate pincode format (6 digits)
    if (!/^\d{6}$/.test(newPincode.trim())) {
      setError('Pincode must be 6 digits')
      return
    }

    if (formData.pincodes_served.includes(newPincode.trim())) {
      setError('This pincode has already been added')
      return
    }

    setFormData(prev => ({
      ...prev,
      pincodes_served: [...prev.pincodes_served, newPincode.trim()]
    }))
    
    setNewPincode('')
    setError(null)
  }

  // Remove pincode
  const removePincode = (pincode: string) => {
    setFormData(prev => ({
      ...prev,
      pincodes_served: prev.pincodes_served.filter(p => p !== pincode)
    }))
  }

  // Validate form
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    if (!formData.name.trim()) errors.name = 'Partner name is required'
    if (!formData.category) errors.category = 'Category is required'
    if (formData.services.length === 0) errors.services = 'At least one service must be selected'
    if (!formData.address.trim()) errors.address = 'Address is required'
    if (!formData.city.trim()) errors.city = 'City is required'
    if (!formData.pincode.trim()) errors.pincode = 'Pincode is required'
    if (!/^\d{6}$/.test(formData.pincode.trim())) errors.pincode = 'Pincode must be 6 digits'
    if (!formData.contact_person_name.trim()) errors.contact_person_name = 'Contact person name is required'
    if (!formData.contact_person_phone.trim()) errors.contact_person_phone = 'Contact person phone is required'
    if (!formData.contact_person_email.trim()) errors.contact_person_email = 'Contact person email is required'
    if (formData.contact_person_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact_person_email)) {
      errors.contact_person_email = 'Please enter a valid email address'
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      const errorMessage = 'Please fix the validation errors above. Required fields: Partner Name, Category, Services, Address, City, Pincode, Contact Person Name, Contact Phone, and Contact Email.'
      setError(errorMessage)
      setIsLoading(false) // Reset loading state when validation fails
      console.log('Form validation failed:', fieldErrors)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      let result: HospitalPartner

      if (mode === 'create') {
        const createData: CreateHospitalPartner = {
          name: formData.name.trim(),
          category: formData.category,
          services: formData.services,
          free_services: formData.free_services,
          address: formData.address.trim(),
          city: formData.city.trim(),
          pincode: formData.pincode.trim(),
          pincodes_served: formData.pincodes_served,
          contact_person_name: formData.contact_person_name.trim(),
          contact_person_phone: formData.contact_person_phone.trim(),
          contact_person_email: formData.contact_person_email.trim(),
          emergency_contact_name: formData.emergency_contact_name.trim() || undefined,
          emergency_contact_phone: formData.emergency_contact_phone.trim() || undefined
        }
        
        console.log('Creating hospital partner with data:', createData)
        result = await HospitalPartnerService.createHospitalPartner(createData)
        console.log('Hospital partner created successfully:', result)
      } else {
        const updateData: UpdateHospitalPartner = {
          name: formData.name.trim(),
          category: formData.category,
          services: formData.services,
          free_services: formData.free_services,
          address: formData.address.trim(),
          city: formData.city.trim(),
          pincode: formData.pincode.trim(),
          pincodes_served: formData.pincodes_served,
          contact_person_name: formData.contact_person_name.trim(),
          contact_person_phone: formData.contact_person_phone.trim(),
          contact_person_email: formData.contact_person_email.trim(),
          emergency_contact_name: formData.emergency_contact_name.trim() || undefined,
          emergency_contact_phone: formData.emergency_contact_phone.trim() || undefined
        }
        
        result = await HospitalPartnerService.updateHospitalPartner(partner!.id, updateData)
      }

      onSuccess?.(result)
    } catch (err) {
      console.error('Error saving hospital partner:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to save hospital partner'
      setError(errorMessage)
      console.log('Error details:', {
        error: err,
        formData: formData,
        mode: mode
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="w-5 h-5" />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Partner Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter partner name"
                className={fieldErrors.name ? 'border-red-500' : ''}
              />
              {fieldErrors.name && (
                <p className="text-sm text-red-500 mt-1">{fieldErrors.name}</p>
              )}
            </div>

            <div>
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleInputChange('category', value)}
              >
                <SelectTrigger className={fieldErrors.category ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORY_OPTIONS.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldErrors.category && (
                <p className="text-sm text-red-500 mt-1">{fieldErrors.category}</p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="free_services"
              checked={formData.free_services}
              onCheckedChange={(checked) => handleInputChange('free_services', checked)}
            />
            <Label htmlFor="free_services">Offers Free Services</Label>
          </div>
        </CardContent>
      </Card>

      {/* Services & Discounts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Percent className="w-5 h-5" />
            Services & Discounts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add Service */}
          <div className="flex flex-wrap gap-2">
            <Select
              value={selectedService}
              onValueChange={setSelectedService}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select service" />
              </SelectTrigger>
              <SelectContent>
                {SERVICE_OPTIONS.map((service) => (
                  <SelectItem key={service} value={service}>
                    {service}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center gap-1">
              <Input
                type="number"
                min="0"
                max="100"
                value={selectedDiscount}
                onChange={(e) => setSelectedDiscount(Number(e.target.value))}
                placeholder="Discount %"
                className="w-24"
              />
              <span className="text-sm text-gray-500">%</span>
            </div>

            <Button
              type="button"
              onClick={addService}
              disabled={!selectedService}
              size="sm"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          </div>

          {/* Selected Services */}
          <div className="space-y-2">
            {formData.services.map((service, index) => (
              <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                <Badge variant="secondary">{service.service}</Badge>
                <div className="flex items-center gap-1">
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={service.discount}
                    onChange={(e) => updateServiceDiscount(index, Number(e.target.value))}
                    className="w-20 h-8"
                  />
                  <span className="text-sm text-gray-500">%</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeService(index)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>

          {fieldErrors.services && (
            <p className="text-sm text-red-500">{fieldErrors.services}</p>
          )}
        </CardContent>
      </Card>

      {/* Address Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Address Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="address">Address *</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Enter full address"
              className={fieldErrors.address ? 'border-red-500' : ''}
            />
            {fieldErrors.address && (
              <p className="text-sm text-red-500 mt-1">{fieldErrors.address}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                placeholder="Enter city"
                className={fieldErrors.city ? 'border-red-500' : ''}
              />
              {fieldErrors.city && (
                <p className="text-sm text-red-500 mt-1">{fieldErrors.city}</p>
              )}
            </div>

            <div>
              <Label htmlFor="pincode">Pincode *</Label>
              <Input
                id="pincode"
                value={formData.pincode}
                onChange={(e) => handleInputChange('pincode', e.target.value)}
                placeholder="Enter pincode"
                maxLength={6}
                className={fieldErrors.pincode ? 'border-red-500' : ''}
              />
              {fieldErrors.pincode && (
                <p className="text-sm text-red-500 mt-1">{fieldErrors.pincode}</p>
              )}
            </div>
          </div>

          {/* Pincodes Served */}
          <div>
            <Label>Pincodes Served</Label>
            <div className="flex gap-2 mt-1">
              <Input
                value={newPincode}
                onChange={(e) => setNewPincode(e.target.value)}
                placeholder="Enter pincode"
                maxLength={6}
                className="flex-1"
              />
              <Button
                type="button"
                onClick={addPincode}
                disabled={!newPincode.trim()}
                size="sm"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.pincodes_served.map((pincode) => (
                <Badge key={pincode} variant="outline" className="flex items-center gap-1">
                  {pincode}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removePincode(pincode)}
                    className="h-4 w-4 p-0 hover:bg-transparent"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="contact_person_name">Contact Person Name *</Label>
              <Input
                id="contact_person_name"
                value={formData.contact_person_name}
                onChange={(e) => handleInputChange('contact_person_name', e.target.value)}
                placeholder="Enter contact person name"
                className={fieldErrors.contact_person_name ? 'border-red-500' : ''}
              />
              {fieldErrors.contact_person_name && (
                <p className="text-sm text-red-500 mt-1">{fieldErrors.contact_person_name}</p>
              )}
            </div>

            <div>
              <Label htmlFor="contact_person_phone">Contact Phone *</Label>
              <Input
                id="contact_person_phone"
                value={formData.contact_person_phone}
                onChange={(e) => handleInputChange('contact_person_phone', e.target.value)}
                placeholder="Enter phone number"
                className={fieldErrors.contact_person_phone ? 'border-red-500' : ''}
              />
              {fieldErrors.contact_person_phone && (
                <p className="text-sm text-red-500 mt-1">{fieldErrors.contact_person_phone}</p>
              )}
            </div>

            <div>
              <Label htmlFor="contact_person_email">Contact Email *</Label>
              <Input
                id="contact_person_email"
                type="email"
                value={formData.contact_person_email}
                onChange={(e) => handleInputChange('contact_person_email', e.target.value)}
                placeholder="Enter email address"
                className={fieldErrors.contact_person_email ? 'border-red-500' : ''}
              />
              {fieldErrors.contact_person_email && (
                <p className="text-sm text-red-500 mt-1">{fieldErrors.contact_person_email}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="emergency_contact_name">Emergency Contact Name</Label>
              <Input
                id="emergency_contact_name"
                value={formData.emergency_contact_name}
                onChange={(e) => handleInputChange('emergency_contact_name', e.target.value)}
                placeholder="Enter emergency contact name"
              />
            </div>

            <div>
              <Label htmlFor="emergency_contact_phone">Emergency Contact Phone</Label>
              <Input
                id="emergency_contact_phone"
                value={formData.emergency_contact_phone}
                onChange={(e) => handleInputChange('emergency_contact_phone', e.target.value)}
                placeholder="Enter emergency phone number"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex gap-2 justify-end">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          <Save className="w-4 h-4 mr-2" />
          {mode === 'create' ? 'Create Partner' : 'Update Partner'}
        </Button>
      </div>
    </form>
  )
}

export default HospitalPartnerForm