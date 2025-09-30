import React, { useState, useEffect } from 'react'
import { RequireAuth } from '../components/auth'
import { usePatientAuth } from '../contexts/PatientAuthContext'
import { getPatientProfile } from '../lib/patientAuth'
import { 
  uploadMedicalReport, 
  getMedicalReports, 
  deleteMedicalReport,
  bookAppointment,
  getUpcomingAppointments,
  cancelAppointment,
  updatePatientPersonalDetails,
  updatePatientContactDetails,
  updatePatientAddress
} from '../lib/patientService'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Separator } from '../components/ui/separator'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Textarea } from '../components/ui/textarea'
import { 
  User, 
  CreditCard, 
  FileText, 
  HandHeart, 
  Calendar,
  Download,
  Upload,
  Phone,
  Mail,
  MapPin,
  Edit,
  LogOut,
  Menu,
  X,
  Trash2,
  Clock
} from 'lucide-react'
import { ECard } from '../components/ECard'
import { useToast } from '../hooks/use-toast'

export function DashboardPage() {
  const { patient, logout } = usePatientAuth()
  const { toast } = useToast()
  const [patientProfile, setPatientProfile] = useState<any>(null)
  const [activeSection, setActiveSection] = useState('profile')
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [editPersonalOpen, setEditPersonalOpen] = useState(false)
  const [editContactOpen, setEditContactOpen] = useState(false)
  const [editAddressOpen, setEditAddressOpen] = useState(false)

  // Load patient profile
  useEffect(() => {
    const loadProfile = async () => {
      if (patient?.id) {
        try {
          const profile = await getPatientProfile(patient.id)
          setPatientProfile(profile)
        } catch (error) {
          console.error('Error loading profile:', error)
          toast({
            title: "Error",
            description: "Failed to load patient profile",
            variant: "destructive",
          })
        } finally {
          setLoading(false)
        }
      }
    }

    loadProfile()
  }, [patient?.id, toast])

  const handleLogout = () => {
    logout()
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    })
  }

  const navigationItems = [
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
      description: 'Personal & Contact Details'
    },
    {
      id: 'ecard',
      label: 'E-Card',
      icon: CreditCard,
      description: 'View & Download'
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: FileText,
      description: 'Upload Medical Reports'
    },
    {
      id: 'services',
      label: 'Request Service',
      icon: HandHeart,
      description: 'Request Healthcare Services'
    },
    {
      id: 'appointments',
      label: 'Book Appointment',
      icon: Calendar,
      description: 'Schedule Appointments'
    },
    {
      id: 'family',
      label: 'Family Members',
      icon: User,
      description: 'View Co-Members'
    }
  ]

  if (loading) {
    return (
      <RequireAuth>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600"></div>
        </div>
      </RequireAuth>
    )
  }

  return (
    <RequireAuth>
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
          <div className="flex items-center justify-between h-16 px-6 bg-emerald-600">
            <div className="flex items-center">
              <img src="/logo.svg" alt="Logo" className="h-8 w-auto" />
              <span className="ml-2 text-white font-semibold">SeniorCare Plus</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-white hover:text-emerald-200"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Patient Info */}
          <div className="p-6 bg-emerald-50 border-b">
            <div className="flex items-center">
              <div className="bg-emerald-600 text-white rounded-full p-3">
                <User className="h-6 w-6" />
              </div>
              <div className="ml-3">
                <h3 className="font-semibold text-gray-900">{patient?.name}</h3>
                <p className="text-sm text-emerald-600">{patient?.seniorCareId}</p>
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
                    setActiveSection(item.id)
                    setSidebarOpen(false)
                  }}
                  className={`w-full flex items-center px-3 py-3 text-left rounded-lg transition-colors ${
                    activeSection === item.id
                      ? 'bg-emerald-100 text-emerald-700 border-l-4 border-emerald-600'
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

          {/* Logout */}
          <div className="p-4 border-t">
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full text-red-600 border-red-200 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
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
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                {patientProfile?.care_plans?.[0]?.plan_type || 'Standard'} Plan
              </Badge>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 p-6">
            {activeSection === 'profile' && (
              <ProfileSection 
                patient={patient} 
                patientProfile={patientProfile} 
                toast={toast}
                editPersonalOpen={editPersonalOpen}
                setEditPersonalOpen={setEditPersonalOpen}
                editContactOpen={editContactOpen}
                setEditContactOpen={setEditContactOpen}
                editAddressOpen={editAddressOpen}
                setEditAddressOpen={setEditAddressOpen}
                setPatientProfile={setPatientProfile}
              />
            )}
            {activeSection === 'ecard' && <ECardSection patient={patient} patientProfile={patientProfile} />}
            {activeSection === 'reports' && <ReportsSection />}
            {activeSection === 'services' && <ServicesSection />}
            {activeSection === 'appointments' && <AppointmentsSection />}
            {activeSection === 'family' && <FamilyMembersSection patient={patient} patientProfile={patientProfile} />}
          </main>
        </div>
      </div>
    </RequireAuth>
  )
}

// Profile Section Component
function ProfileSection({ 
  patient, 
  patientProfile, 
  toast,
  editPersonalOpen,
  setEditPersonalOpen,
  editContactOpen,
  setEditContactOpen,
  editAddressOpen,
  setEditAddressOpen,
  setPatientProfile
}: any) {
  // Form state for personal details
  const [personalForm, setPersonalForm] = useState({
    name: patient?.name || '',
    age: patientProfile?.age || '',
    gender: patientProfile?.gender || '',
    blood_group: patientProfile?.blood_group || ''
  })

  // Form state for contact details
  const [contactForm, setContactForm] = useState({
    email: patient?.email || '',
    phone: patientProfile?.phone || '',
    emergency_contact: patientProfile?.emergency_contact || ''
  })

  // Form state for address
  const [addressForm, setAddressForm] = useState({
    house_no: patientProfile?.address?.house_no || '',
    building_name: patientProfile?.address?.building_name || '',
    city: patientProfile?.address?.city || '',
    district: patientProfile?.address?.district || '',
    pin_code: patientProfile?.address?.pin_code || ''
  })

  // Update form states when props change
  useEffect(() => {
    setPersonalForm({
      name: patient?.name || '',
      age: patientProfile?.age || '',
      gender: patientProfile?.gender || '',
      blood_group: patientProfile?.blood_group || ''
    })
    setContactForm({
      email: patient?.email || '',
      phone: patientProfile?.phone || '',
      emergency_contact: patientProfile?.emergency_contact || ''
    })
    setAddressForm({
      house_no: patientProfile?.address?.house_no || '',
      building_name: patientProfile?.address?.building_name || '',
      city: patientProfile?.address?.city || '',
      district: patientProfile?.address?.district || '',
      pin_code: patientProfile?.address?.pin_code || ''
    })
  }, [patient, patientProfile])

  // Save handlers
  const handleSavePersonal = async () => {
    try {
      await updatePatientPersonalDetails(patient.id, {
        name: personalForm.name,
        age: personalForm.age ? parseInt(personalForm.age) : undefined,
        gender: personalForm.gender,
        blood_group: personalForm.blood_group
      })
      
      toast({
        title: "Success",
        description: "Personal details updated successfully.",
      })
      
      // Refresh patient profile
      setPatientProfile(await getPatientProfile(patient.id))
      setEditPersonalOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update personal details.",
        variant: "destructive"
      })
    }
  }

  const handleSaveContact = async () => {
    try {
      await updatePatientContactDetails(patient.id, contactForm)
      
      toast({
        title: "Success",
        description: "Contact details updated successfully.",
      })
      
      // Refresh patient profile
      setPatientProfile(await getPatientProfile(patient.id))
      setEditContactOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update contact details.",
        variant: "destructive"
      })
    }
  }

  const handleSaveAddress = async () => {
    try {
      await updatePatientAddress(patient.id, addressForm)
      
      toast({
        title: "Success",
        description: "Address updated successfully.",
      })
      
      // Refresh patient profile
      setPatientProfile(await getPatientProfile(patient.id))
      setEditAddressOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update address.",
        variant: "destructive"
      })
    }
  }
  return (
    <>
      <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              Personal Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Full Name</label>
              <p className="text-gray-900">{patient?.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Senior Care ID</label>
              <p className="text-emerald-600 font-mono">{patient?.seniorCareId}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Date of Birth</label>
              <p className="text-gray-900">{patientProfile?.date_of_birth}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Gender</label>
              <p className="text-gray-900 capitalize">{patientProfile?.sex}</p>
            </div>

          </CardContent>
        </Card>

        {/* Contact Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Phone className="h-5 w-5 mr-2" />
              Contact Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Phone Number</label>
              <p className="text-gray-900">{patient?.phone}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Email Address</label>
              <p className="text-gray-900">{patientProfile?.email || 'Not provided'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Emergency Contact</label>
              <p className="text-gray-900">{patientProfile?.emergency_contact}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Emergency Contact Relation</label>
              <p className="text-gray-900">{patientProfile?.emergency_name_relation}</p>
            </div>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setEditContactOpen(true)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Contact Details
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Address */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="h-5 w-5 mr-2" />
            Address Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          {patientProfile?.address ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">House/Building</label>
                <p className="text-gray-900">{patientProfile.address.house_no} {patientProfile.address.building_name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">City</label>
                <p className="text-gray-900">{patientProfile.address.city}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">District</label>
                <p className="text-gray-900">{patientProfile.address.district}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">PIN Code</label>
                <p className="text-gray-900">{patientProfile.address.pin_code}</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">Address information not available</p>
          )}
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => setEditAddressOpen(true)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Address
          </Button>
        </CardContent>
      </Card>
    </div>

    {/* Edit Personal Details Modal */}
    <Dialog open={editPersonalOpen} onOpenChange={setEditPersonalOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Personal Details</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={personalForm.name}
              onChange={(e) => setPersonalForm({...personalForm, name: e.target.value})}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="age" className="text-right">
              Age
            </Label>
            <Input
              id="age"
              value={personalForm.age}
              onChange={(e) => setPersonalForm({...personalForm, age: e.target.value})}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="gender" className="text-right">
              Gender
            </Label>
            <Input
              id="gender"
              value={personalForm.gender}
              onChange={(e) => setPersonalForm({...personalForm, gender: e.target.value})}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="blood_group" className="text-right">
              Blood Group
            </Label>
            <Input
              id="blood_group"
              value={personalForm.blood_group}
              onChange={(e) => setPersonalForm({...personalForm, blood_group: e.target.value})}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSavePersonal}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    {/* Edit Contact Details Modal */}
    <Dialog open={editContactOpen} onOpenChange={setEditContactOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Contact Details</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={contactForm.email}
              onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right">
              Phone
            </Label>
            <Input
              id="phone"
              value={contactForm.phone}
              onChange={(e) => setContactForm({...contactForm, phone: e.target.value})}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="emergency_contact" className="text-right">
              Emergency Contact
            </Label>
            <Input
              id="emergency_contact"
              value={contactForm.emergency_contact}
              onChange={(e) => setContactForm({...contactForm, emergency_contact: e.target.value})}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSaveContact}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    {/* Edit Address Modal */}
    <Dialog open={editAddressOpen} onOpenChange={setEditAddressOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Address</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="house_no" className="text-right">
              House No.
            </Label>
            <Input
              id="house_no"
              value={addressForm.house_no}
              onChange={(e) => setAddressForm({...addressForm, house_no: e.target.value})}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="building_name" className="text-right">
              Building Name
            </Label>
            <Input
              id="building_name"
              value={addressForm.building_name}
              onChange={(e) => setAddressForm({...addressForm, building_name: e.target.value})}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="city" className="text-right">
              City
            </Label>
            <Input
              id="city"
              value={addressForm.city}
              onChange={(e) => setAddressForm({...addressForm, city: e.target.value})}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="district" className="text-right">
              District
            </Label>
            <Input
              id="district"
              value={addressForm.district}
              onChange={(e) => setAddressForm({...addressForm, district: e.target.value})}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="pin_code" className="text-right">
              PIN Code
            </Label>
            <Input
              id="pin_code"
              value={addressForm.pin_code}
              onChange={(e) => setAddressForm({...addressForm, pin_code: e.target.value})}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSaveAddress}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  )
}

// E-Card Section Component
function ECardSection({ patient, patientProfile }: any) {
  const { toast } = useToast()

  const handleDownload = () => {
    toast({
      title: "Download Started",
      description: "Your E-card is being downloaded",
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Your Digital Healthcare Card</CardTitle>
          <CardDescription>
            Your official SeniorCare Plus E-card with all essential information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center mb-6">
            <ECard
              patient={{
                seniorCareId: patient?.seniorCareId || '',
                name: patient?.name || '',
                dateOfBirth: patientProfile?.date_of_birth || '',
                sex: patientProfile?.sex || '',
                phoneNumber: patient?.phone || ''
              }}
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={handleDownload} className="flex items-center">
              <Download className="h-4 w-4 mr-2" />
              Download E-Card
            </Button>
            <Button variant="outline" className="flex items-center">
              <Mail className="h-4 w-4 mr-2" />
              Share via Email
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>How to Use Your E-Card</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <p>• Show this E-card to healthcare providers for immediate identification</p>
            <p>• Use your Senior Care ID for all service requests and appointments</p>
            <p>• Keep a digital copy on your phone for easy access</p>
            <p>• Share with family members for emergency situations</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Reports Section Component
function ReportsSection() {
  const { toast } = useToast()
  const { patient } = usePatientAuth()
  const [reports, setReports] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  // Load reports on component mount
  useEffect(() => {
    if (patient?.id) {
      loadReports()
    }
  }, [patient?.id])

  const loadReports = async () => {
    try {
      setLoading(true)
      const reportsData = await getMedicalReports(patient.id)
      setReports(reportsData)
    } catch (error) {
      console.error('Error loading reports:', error)
      toast({
        title: "Error",
        description: "Failed to load medical reports",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    const file = files[0]
    
    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please select a file smaller than 10MB",
        variant: "destructive",
      })
      return
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg']
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid File Type",
        description: "Please upload PDF, JPEG, or PNG files only",
        variant: "destructive",
      })
      return
    }

    try {
      setUploading(true)
      await uploadMedicalReport(file, patient.id, 'general', '')
      
      toast({
        title: "Upload Successful",
        description: "Medical report uploaded successfully",
      })
      
      // Reload reports
      await loadReports()
    } catch (error) {
      console.error('Error uploading file:', error)
      toast({
        title: "Upload Failed",
        description: "Failed to upload medical report. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
      // Reset file input
      event.target.value = ''
    }
  }

  const handleDeleteReport = async (reportId: string) => {
    try {
      await deleteMedicalReport(reportId)
      toast({
        title: "Report Deleted",
        description: "Medical report deleted successfully",
      })
      await loadReports()
    } catch (error) {
      console.error('Error deleting report:', error)
      toast({
        title: "Delete Failed",
        description: "Failed to delete medical report",
        variant: "destructive",
      })
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload Medical Reports</CardTitle>
          <CardDescription>
            Upload your medical reports, test results, and prescriptions for easy access
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Reports</h3>
            <p className="text-gray-500 mb-4">Drag and drop files here, or click to select</p>
            <input
              type="file"
              id="file-upload"
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileUpload}
              disabled={uploading}
            />
            <Button 
              onClick={() => document.getElementById('file-upload')?.click()}
              disabled={uploading}
            >
              <Upload className="h-4 w-4 mr-2" />
              {uploading ? 'Uploading...' : 'Choose Files'}
            </Button>
            <p className="text-xs text-gray-400 mt-2">
              Supported formats: PDF, JPEG, PNG (Max 10MB)
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-gray-500">
              <div className="animate-spin h-8 w-8 border-b-2 border-green-600 rounded-full mx-auto mb-4"></div>
              <p>Loading reports...</p>
            </div>
          ) : reports.length > 0 ? (
            <div className="space-y-3">
              {reports.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-8 w-8 text-blue-500" />
                    <div>
                      <p className="font-medium">{report.file_name}</p>
                      <p className="text-sm text-gray-500">
                        {formatDate(report.upload_date)} • {formatFileSize(report.file_size)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open(report.file_path, '_blank')}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDeleteReport(report.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>No reports uploaded yet</p>
              <p className="text-sm">Upload your first report to get started</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Services Section Component
function ServicesSection() {
  const { toast } = useToast()

  const services = [
    {
      title: "Home Healthcare",
      description: "Nursing care, physiotherapy, and medical assistance at home",
      icon: HandHeart
    },
    {
      title: "Emergency Support",
      description: "24/7 emergency response and ambulance services",
      icon: Phone
    },
    {
      title: "Medication Management",
      description: "Medicine delivery and dosage reminders",
      icon: FileText
    },
    {
      title: "Wellness Programs",
      description: "Exercise routines, diet planning, and health monitoring",
      icon: User
    }
  ]

  const handleServiceRequest = (serviceName: string) => {
    toast({
      title: "Service Request",
      description: `Request for ${serviceName} has been submitted`,
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Available Services</CardTitle>
          <CardDescription>
            Request healthcare services tailored to your needs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map((service, index) => {
              const IconComponent = service.icon
              return (
                <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start space-x-3">
                    <div className="bg-emerald-100 p-2 rounded-lg">
                      <IconComponent className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{service.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{service.description}</p>
                      <Button 
                        size="sm" 
                        className="mt-3"
                        onClick={() => handleServiceRequest(service.title)}
                      >
                        Request Service
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Appointments Section Component
function AppointmentsSection() {
  const { toast } = useToast()
  const { patient } = usePatientAuth()
  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [booking, setBooking] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    serviceType: 'general_consultation',
    appointmentDate: '',
    appointmentTime: 'morning',
    patientNotes: ''
  })

  // Load appointments on component mount
  useEffect(() => {
    if (patient?.id) {
      loadAppointments()
    }
  }, [patient?.id])

  const loadAppointments = async () => {
    try {
      setLoading(true)
      const appointmentsData = await getUpcomingAppointments(patient.id)
      setAppointments(appointmentsData)
    } catch (error) {
      console.error('Error loading appointments:', error)
      toast({
        title: "Error",
        description: "Failed to load appointments",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleBookAppointment = async () => {
    if (!formData.appointmentDate) {
      toast({
        title: "Missing Information",
        description: "Please select a preferred date",
        variant: "destructive",
      })
      return
    }

    // Convert time slot to actual time
    const timeMap: { [key: string]: string } = {
      'morning': '09:00',
      'afternoon': '14:00',
      'evening': '17:00'
    }

    try {
      setBooking(true)
      await bookAppointment({
        patientId: patient.id,
        serviceType: formData.serviceType,
        appointmentDate: formData.appointmentDate,
        appointmentTime: timeMap[formData.appointmentTime],
        notes: formData.patientNotes
      })

      toast({
        title: "Appointment Booked",
        description: "Your appointment has been scheduled successfully",
      })

      // Reset form
      setFormData({
        serviceType: 'general_consultation',
        appointmentDate: '',
        appointmentTime: 'morning',
        patientNotes: ''
      })

      // Reload appointments
      await loadAppointments()
    } catch (error) {
      console.error('Error booking appointment:', error)
      toast({
        title: "Booking Failed",
        description: "Failed to book appointment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setBooking(false)
    }
  }

  const handleCancelAppointment = async (appointmentId: string) => {
    try {
      await cancelAppointment(appointmentId)
      toast({
        title: "Appointment Cancelled",
        description: "Your appointment has been cancelled",
      })
      await loadAppointments()
    } catch (error) {
      console.error('Error cancelling appointment:', error)
      toast({
        title: "Cancellation Failed",
        description: "Failed to cancel appointment",
        variant: "destructive",
      })
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (timeString: string) => {
    return new Date(`1970-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const getServiceTypeLabel = (serviceType: string) => {
    const labels: { [key: string]: string } = {
      'general_consultation': 'General Consultation',
      'home_visit': 'Home Visit',
      'physiotherapy': 'Physiotherapy',
      'nursing_care': 'Nursing Care'
    }
    return labels[serviceType] || serviceType
  }

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'scheduled': 'bg-blue-100 text-blue-800',
      'confirmed': 'bg-green-100 text-green-800',
      'completed': 'bg-gray-100 text-gray-800',
      'cancelled': 'bg-red-100 text-red-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Book Appointment</CardTitle>
          <CardDescription>
            Schedule appointments with healthcare professionals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Select Service Type</label>
                <select 
                  className="w-full p-2 border rounded-lg"
                  value={formData.serviceType}
                  onChange={(e) => handleInputChange('serviceType', e.target.value)}
                >
                  <option value="general_consultation">General Consultation</option>
                  <option value="home_visit">Home Visit</option>
                  <option value="physiotherapy">Physiotherapy</option>
                  <option value="nursing_care">Nursing Care</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Preferred Date</label>
                <input 
                  type="date" 
                  className="w-full p-2 border rounded-lg"
                  value={formData.appointmentDate}
                  onChange={(e) => handleInputChange('appointmentDate', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Preferred Time</label>
                <select 
                  className="w-full p-2 border rounded-lg"
                  value={formData.appointmentTime}
                  onChange={(e) => handleInputChange('appointmentTime', e.target.value)}
                >
                  <option value="morning">Morning (9 AM - 12 PM)</option>
                  <option value="afternoon">Afternoon (12 PM - 4 PM)</option>
                  <option value="evening">Evening (4 PM - 7 PM)</option>
                </select>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Additional Notes</label>
                <textarea 
                  className="w-full p-2 border rounded-lg h-32" 
                  placeholder="Describe your symptoms or requirements..."
                  value={formData.patientNotes}
                  onChange={(e) => handleInputChange('patientNotes', e.target.value)}
                />
              </div>
              <Button 
                onClick={handleBookAppointment} 
                className="w-full"
                disabled={booking}
              >
                <Calendar className="h-4 w-4 mr-2" />
                {booking ? 'Booking...' : 'Book Appointment'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-gray-500">
              <div className="animate-spin h-8 w-8 border-b-2 border-green-600 rounded-full mx-auto mb-4"></div>
              <p>Loading appointments...</p>
            </div>
          ) : appointments.length > 0 ? (
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <div key={appointment.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="font-medium">{getServiceTypeLabel(appointment.service_type)}</p>
                        <p className="text-sm text-gray-500">
                          {formatDate(appointment.appointment_date)} at {formatTime(appointment.appointment_time)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(appointment.status)}>
                        {appointment.status}
                      </Badge>
                      {(appointment.status === 'pending' || appointment.status === 'scheduled') && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleCancelAppointment(appointment.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                  {appointment.notes && (
                    <p className="text-sm text-gray-600 mt-2">
                      <strong>Notes:</strong> {appointment.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>No upcoming appointments</p>
              <p className="text-sm">Book your first appointment to get started</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Family Members Section Component
function FamilyMembersSection({ patient, patientProfile }: any) {
  const { toast } = useToast()

  if (!patientProfile?.family_members || patientProfile.family_members.length === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12 text-gray-500">
          <User className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Family Members</h3>
          <p>This account is registered as an individual plan.</p>
          <p className="text-sm mt-2">Family plans include primary member + co-members.</p>
        </div>
      </div>
    )
  }

  const getMemberTypeLabel = (memberType: string) => {
    switch (memberType) {
      case 'primary': return 'Primary Member'
      case 'co-member': return 'Co-Member'
      default: return 'Family Member'
    }
  }

  const getMemberTypeBadge = (memberType: string) => {
    switch (memberType) {
      case 'primary': return 'bg-emerald-100 text-emerald-800'
      case 'co-member': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Family Members</h2>
          <p className="text-gray-600">View all members in your family plan</p>
        </div>
        <Badge variant="outline" className="text-sm">
          {patientProfile.family_members.length + 1} Total Members
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Current Patient Card */}
        <Card className="border-emerald-200 bg-emerald-50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{patient.name || patientProfile?.name}</CardTitle>
              <Badge className="bg-emerald-600 text-white text-xs">
                You
              </Badge>
            </div>
            <Badge className={`w-fit text-xs ${getMemberTypeBadge(patientProfile?.member_type || 'primary')}`}>
              {getMemberTypeLabel(patientProfile?.member_type || 'primary')}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center text-gray-600">
              <CreditCard className="h-4 w-4 mr-2" />
              <span className="font-mono">{patient.seniorCareId}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Calendar className="h-4 w-4 mr-2" />
              <span>{patientProfile?.date_of_birth}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Phone className="h-4 w-4 mr-2" />
              <span>{patient.phone}</span>
            </div>
          </CardContent>
        </Card>

        {/* Family Members Cards */}
        {patientProfile.family_members.map((member: any) => (
          <Card key={member.id} className="border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{member.name}</CardTitle>
              <Badge className={`w-fit text-xs ${getMemberTypeBadge(member.member_type)}`}>
                {getMemberTypeLabel(member.member_type)}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-center text-gray-600">
                <CreditCard className="h-4 w-4 mr-2" />
                <span className="font-mono">{member.senior_care_id}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Calendar className="h-4 w-4 mr-2" />
                <span>{member.date_of_birth}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Phone className="h-4 w-4 mr-2" />
                <span>{member.phone_number}</span>
              </div>
              {member.email && (
                <div className="flex items-center text-gray-600">
                  <Mail className="h-4 w-4 mr-2" />
                  <span className="truncate">{member.email}</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <HandHeart className="h-5 w-5 mr-2 text-emerald-600" />
            Family Plan Benefits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">✅ Shared Benefits</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• All members covered under one plan</li>
                <li>• Shared care coordination</li>
                <li>• Family emergency contacts</li>
                <li>• Consolidated billing</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">📱 Individual Access</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Each member has unique Senior Care ID</li>
                <li>• Individual login credentials</li>
                <li>• Personal medical records</li>
                <li>• Private consultation access</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}