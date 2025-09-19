import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Separator } from '../../components/ui/separator'
import {
  ArrowLeft,
  Users,
  Download,
  Edit,
  FileText,
  Save,
  X
} from 'lucide-react'
import { useToast } from '../../hooks/use-toast'
import {
  getPatients,
  updatePatient,
  getPatientMedicalReports,
  downloadMedicalReport,
  Patient,
  MedicalReport,
  PatientFilters
} from '../../lib/adminService'

export function PatientDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()
  
  const [patient, setPatient] = useState<Patient | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editFormData, setEditFormData] = useState<any>({})
  const [isSaving, setIsSaving] = useState(false)
  const [medicalReports, setMedicalReports] = useState<MedicalReport[]>([])
  const [loadingReports, setLoadingReports] = useState(false)

  useEffect(() => {
    if (id) {
      loadPatientData()
      loadMedicalReports()
    }
  }, [id])

  const loadPatientData = async () => {
    try {
      setLoading(true)
      // Get all patients and find the one with matching ID
      const patients = await getPatients({})
      const foundPatient = patients.find(p => p.id === id)
      
      if (foundPatient) {
        setPatient(foundPatient)
      } else {
        toast({
          title: "Patient not found",
          description: "The requested patient could not be found",
          variant: "destructive",
        })
        navigate('/admin/dashboard')
      }
    } catch (error) {
      console.error('Error loading patient:', error)
      toast({
        title: "Error",
        description: "Failed to load patient data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const loadMedicalReports = async () => {
    if (!id) return
    
    try {
      setLoadingReports(true)
      const reports = await getPatientMedicalReports(id)
      setMedicalReports(reports)
    } catch (error) {
      console.error('Error loading medical reports:', error)
      toast({
        title: "Error",
        description: "Failed to load medical reports",
        variant: "destructive",
      })
    } finally {
      setLoadingReports(false)
    }
  }

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

  const handleEditPatient = () => {
    if (!patient) return
    
    setEditFormData({
      name: patient.name || '',
      phone_number: patient.phone_number || '',
      email: patient.email || '',
      date_of_birth: patient.date_of_birth || '',
      sex: patient.sex || '',
      emergency_contact: patient.emergency_contact || '',
      emergency_name_relation: patient.emergency_name_relation || '',
      // Address fields
      house_no: patient.address?.house_no || '',
      building_name: patient.address?.building_name || '',
      landmark: patient.address?.landmark || '',
      city: patient.address?.city || '',
      district: patient.address?.district || '',
      pin_code: patient.address?.pin_code || '',
      // Medical info fields
      diet_preference: patient.medical_info?.diet_preference || '',
      blood_group: patient.medical_info?.blood_group || '',
      smoking_status: patient.medical_info?.smoking_status || '',
      alcohol_status: patient.medical_info?.alcohol_status || '',
      tobacco_type: patient.medical_info?.tobacco_type || '',
      tobacco_years: patient.medical_info?.tobacco_years || '',
      alcohol_frequency: patient.medical_info?.alcohol_frequency || '',
      medicine_allergy: patient.medical_info?.medicine_allergy || '',
      food_allergy: patient.medical_info?.food_allergy || '',
      other_allergy: patient.medical_info?.other_allergy || '',
      surgery: patient.medical_info?.surgery || '',
      hospital_admission: patient.medical_info?.hospital_admission || '',
      current_medication: patient.medical_info?.current_medication || '',
      hospital_name: patient.medical_info?.hospital_name || '',
      doctor_name: patient.medical_info?.doctor_name || '',
      doctor_contact: patient.medical_info?.doctor_contact || '',
      preferred_hospital: patient.medical_info?.preferred_hospital || '',
      nearby_hospitals: patient.medical_info?.nearby_hospitals || '',
      current_condition: patient.medical_info?.current_condition || '',
      // Insurance info fields
      has_insurance: patient.insurance_info?.has_insurance || '',
      insurance_company: patient.insurance_info?.insurance_company || '',
      tpa_name: patient.insurance_info?.tpa_name || '',
      policy_number: patient.insurance_info?.policy_number || '',
      amount_covered: patient.insurance_info?.amount_covered || '',
      room_entitled: patient.insurance_info?.room_entitled || ''
    })
    setIsEditMode(true)
  }

  const handleCancelEdit = () => {
    setIsEditMode(false)
    setEditFormData({})
  }

  const handleSavePatient = async () => {
    if (!patient || !editFormData.name) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSaving(true)
      
      // Structure the data properly for the backend
      const updateData = {
        name: editFormData.name,
        phone_number: editFormData.phone_number,
        email: editFormData.email,
        date_of_birth: editFormData.date_of_birth,
        sex: editFormData.sex,
        emergency_contact: editFormData.emergency_contact,
        emergency_name_relation: editFormData.emergency_name_relation,
        address: {
          house_no: editFormData.house_no,
          building_name: editFormData.building_name,
          landmark: editFormData.landmark,
          city: editFormData.city,
          district: editFormData.district,
          pin_code: editFormData.pin_code
        },
        medical_info: {
          diet_preference: editFormData.diet_preference,
          blood_group: editFormData.blood_group,
          smoking_status: editFormData.smoking_status,
          alcohol_status: editFormData.alcohol_status,
          tobacco_type: editFormData.tobacco_type,
          tobacco_years: editFormData.tobacco_years,
          alcohol_frequency: editFormData.alcohol_frequency,
          medicine_allergy: editFormData.medicine_allergy,
          food_allergy: editFormData.food_allergy,
          other_allergy: editFormData.other_allergy,
          surgery: editFormData.surgery,
          hospital_admission: editFormData.hospital_admission,
          current_medication: editFormData.current_medication,
          hospital_name: editFormData.hospital_name,
          doctor_name: editFormData.doctor_name,
          doctor_contact: editFormData.doctor_contact,
          preferred_hospital: editFormData.preferred_hospital,
          nearby_hospitals: editFormData.nearby_hospitals,
          current_condition: editFormData.current_condition
        },
        insurance_info: {
          has_insurance: editFormData.has_insurance,
          insurance_company: editFormData.insurance_company,
          tpa_name: editFormData.tpa_name,
          policy_number: editFormData.policy_number,
          amount_covered: editFormData.amount_covered,
          room_entitled: editFormData.room_entitled
        }
      }
      
      await updatePatient(patient.id, updateData)
      
      // Update local patient data
      setPatient(prev => prev ? { ...prev, ...updateData } : null)
      
      toast({
        title: "Success",
        description: "Patient information updated successfully",
      })
      
      setIsEditMode(false)
    } catch (error) {
      console.error('Error updating patient:', error)
      toast({
        title: "Error",
        description: "Failed to update patient information",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDownloadReport = async (filePath: string, fileName: string) => {
    try {
      const downloadUrl = await downloadMedicalReport(filePath)
      
      // Create a temporary link to trigger download
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      toast({
        title: "Download Started",
        description: "Medical report download has started",
      })
    } catch (error) {
      console.error('Error downloading report:', error)
      toast({
        title: "Download Failed",
        description: "Failed to download medical report",
        variant: "destructive",
      })
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setEditFormData((prev: any) => ({
      ...prev,
      [field]: value
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!patient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Patient Not Found</h2>
          <p className="text-gray-600 mb-4">The requested patient could not be found.</p>
          <Button onClick={() => navigate('/admin/dashboard')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/admin/dashboard')}
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">{patient.name}</h1>
                <p className="text-sm text-gray-500">Patient ID: {patient.senior_care_id}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {!isEditMode ? (
                <Button onClick={handleEditPatient}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Patient
                </Button>
              ) : (
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={handleCancelEdit}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button onClick={handleSavePatient} disabled={isSaving}>
                    <Save className="h-4 w-4 mr-2" />
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Basic patient details and contact information</CardDescription>
            </CardHeader>
            <CardContent>
              {!isEditMode ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Full Name</label>
                      <p className="text-sm text-gray-900">{patient.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <p className="text-sm text-gray-900">{patient.email || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Phone</label>
                      <p className="text-sm text-gray-900">{patient.phone_number || 'Not provided'}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Date of Birth</label>
                      <p className="text-sm text-gray-900">
                        {patient.date_of_birth ? new Date(patient.date_of_birth).toLocaleDateString() : 'Not provided'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Age</label>
                      <p className="text-sm text-gray-900">{getAge(patient.date_of_birth)} years old</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Gender</label>
                      <p className="text-sm text-gray-900">{patient.sex || 'Not specified'}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Emergency Contact</label>
                      <p className="text-sm text-gray-900">{patient.emergency_contact || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Emergency Contact Relation</label>
                      <p className="text-sm text-gray-900">{patient.emergency_name_relation || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Registration Date</label>
                      <p className="text-sm text-gray-900">
                        {new Date(patient.registration_date || patient.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Name *</label>
                      <input
                        type="text"
                        value={editFormData.name || ''}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Patient name"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Email</label>
                      <input
                        type="email"
                        value={editFormData.email || ''}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Email address"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Phone</label>
                      <input
                        type="tel"
                        value={editFormData.phone_number || ''}
                        onChange={(e) => handleInputChange('phone_number', e.target.value)}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Phone number"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Date of Birth</label>
                      <input
                        type="date"
                        value={editFormData.date_of_birth || ''}
                        onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Gender</label>
                      <select
                        value={editFormData.sex || ''}
                        onChange={(e) => handleInputChange('sex', e.target.value)}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Emergency Contact</label>
                      <input
                        type="tel"
                        value={editFormData.emergency_contact || ''}
                        onChange={(e) => handleInputChange('emergency_contact', e.target.value)}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Emergency contact number"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Emergency Contact Name & Relation</label>
                      <input
                        type="text"
                        value={editFormData.emergency_name_relation || ''}
                        onChange={(e) => handleInputChange('emergency_name_relation', e.target.value)}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., John Doe (Son)"
                      />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Address Information */}
          <Card>
            <CardHeader>
              <CardTitle>Address Information</CardTitle>
              <CardDescription>Residential address and location details</CardDescription>
            </CardHeader>
            <CardContent>
              {!isEditMode ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">House No.</label>
                      <p className="text-sm text-gray-900">{patient.address?.house_no || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Building Name</label>
                      <p className="text-sm text-gray-900">{patient.address?.building_name || 'Not provided'}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Landmark</label>
                      <p className="text-sm text-gray-900">{patient.address?.landmark || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">City</label>
                      <p className="text-sm text-gray-900">{patient.address?.city || 'Not provided'}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">District</label>
                      <p className="text-sm text-gray-900">{patient.address?.district || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Pin Code</label>
                      <p className="text-sm text-gray-900">{patient.address?.pin_code || 'Not provided'}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">House No.</label>
                      <input
                        type="text"
                        value={editFormData.houseNo || ''}
                        onChange={(e) => handleInputChange('houseNo', e.target.value)}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="House/Flat Number"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Building Name</label>
                      <input
                        type="text"
                        value={editFormData.buildingName || ''}
                        onChange={(e) => handleInputChange('buildingName', e.target.value)}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Building/Apartment Name"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Landmark</label>
                      <input
                        type="text"
                        value={editFormData.landmark || ''}
                        onChange={(e) => handleInputChange('landmark', e.target.value)}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Nearby Landmark"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">City</label>
                      <input
                        type="text"
                        value={editFormData.city || ''}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="City"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">District</label>
                      <input
                        type="text"
                        value={editFormData.district || ''}
                        onChange={(e) => handleInputChange('district', e.target.value)}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="District"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Pin Code</label>
                      <input
                        type="text"
                        value={editFormData.pinCode || ''}
                        onChange={(e) => handleInputChange('pinCode', e.target.value)}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Pin Code"
                      />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Personal Habits & Medical History */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Habits & Medical History</CardTitle>
              <CardDescription>Lifestyle habits and medical background</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Personal Habits</h4>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Diet Preference</label>
                    <p className="text-sm text-gray-900">{patient.medical_info?.diet_preference || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Tobacco Type</label>
                    <p className="text-sm text-gray-900">{patient.medical_info?.tobacco_type || 'None'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Tobacco Usage (Years)</label>
                    <p className="text-sm text-gray-900">{patient.medical_info?.tobacco_years || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Alcohol Frequency</label>
                    <p className="text-sm text-gray-900">{patient.medical_info?.alcohol_frequency || 'Not specified'}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Medical History</h4>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Medicine Allergy</label>
                    <p className="text-sm text-gray-900">{patient.medical_info?.medicine_allergy || 'None reported'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Food Allergy</label>
                    <p className="text-sm text-gray-900">{patient.medical_info?.food_allergy || 'None reported'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Other Allergies</label>
                    <p className="text-sm text-gray-900">{patient.medical_info?.other_allergy || 'None reported'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Previous Surgery</label>
                    <p className="text-sm text-gray-900">{patient.medical_info?.surgery || 'None reported'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Hospital Admissions</label>
                    <p className="text-sm text-gray-900">{patient.medical_info?.hospital_admission || 'None reported'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Current Medication</label>
                    <p className="text-sm text-gray-900">{patient.medical_info?.current_medication || 'None'}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Treatment & Hospital Details */}
          <Card>
            <CardHeader>
              <CardTitle>Treatment & Hospital Details</CardTitle>
              <CardDescription>Healthcare provider and treatment information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Hospital Name</label>
                    <p className="text-sm text-gray-900">{patient.medical_info?.hospital_name || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Doctor Name</label>
                    <p className="text-sm text-gray-900">{patient.medical_info?.doctor_name || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Doctor Contact</label>
                    <p className="text-sm text-gray-900">{patient.medical_info?.doctor_contact || 'Not provided'}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Preferred Hospital</label>
                    <p className="text-sm text-gray-900">{patient.medical_info?.preferred_hospital || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Nearby Hospitals</label>
                    <p className="text-sm text-gray-900">{patient.medical_info?.nearby_hospitals || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Current Condition</label>
                    <p className="text-sm text-gray-900">{patient.medical_info?.current_condition || 'Not specified'}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Insurance Information */}
          <Card>
            <CardHeader>
              <CardTitle>Insurance Information</CardTitle>
              <CardDescription>Health insurance and coverage details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Has Insurance</label>
                    <p className="text-sm text-gray-900">
                      {patient.insurance_info?.has_insurance ? 'Yes' : 'No'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Insurance Company</label>
                    <p className="text-sm text-gray-900">{patient.insurance_info?.insurance_company || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">TPA Name</label>
                    <p className="text-sm text-gray-900">{patient.insurance_info?.tpa_name || 'Not specified'}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Policy Number</label>
                    <p className="text-sm text-gray-900">{patient.insurance_info?.policy_number || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Amount Covered</label>
                    <p className="text-sm text-gray-900">{patient.insurance_info?.amount_covered || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Room Entitled</label>
                    <p className="text-sm text-gray-900">{patient.insurance_info?.room_entitled || 'Not specified'}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Care Plan Information */}
          <Card>
            <CardHeader>
              <CardTitle>Care Plan & Health Information</CardTitle>
              <CardDescription>Current care plan and medical conditions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Care Plan Name</label>
                    <p className="text-sm text-gray-900">{patient.care_plan_name || 'No active plan'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Plan Tier</label>
                    <p className="text-sm text-gray-900">{patient.care_plan_tier || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Status</label>
                    <div className="mt-1">
                      {getStatusBadge(patient.care_plan_status)}
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Medical Conditions</label>
                    <div className="mt-2">
                      {patient.medical_conditions && patient.medical_conditions.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {patient.medical_conditions.map((condition, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {condition}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No medical conditions specified</p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Medical Information</label>
                    <div className="mt-2">
                      {patient.medical_info && typeof patient.medical_info === 'object' ? (
                        <div className="space-y-2">
                          {Object.entries(patient.medical_info).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="text-xs font-medium text-gray-600 capitalize">
                                {key.replace(/_/g, ' ')}:
                              </span>
                              <span className="text-xs text-gray-900">
                                {value ? String(value) : 'Not specified'}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No additional medical information</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Medical Reports */}
          <Card>
            <CardHeader>
              <CardTitle>Medical Reports</CardTitle>
              <CardDescription>Uploaded medical documents and reports</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingReports ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-sm text-gray-500">Loading reports...</p>
                </div>
              ) : medicalReports.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="font-medium">No medical reports</p>
                  <p className="text-sm">No documents have been uploaded for this patient</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {medicalReports.map((report) => (
                    <div key={report.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center mb-2">
                            <FileText className="h-4 w-4 text-blue-600 mr-2 flex-shrink-0" />
                            <h4 className="text-sm font-medium text-gray-900 truncate">
                              {report.file_name}
                            </h4>
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs text-gray-600">
                              <span className="font-medium">Type:</span> {report.report_type}
                            </p>
                            <p className="text-xs text-gray-600">
                              <span className="font-medium">Uploaded:</span> {new Date(report.upload_date || report.created_at).toLocaleDateString()}
                            </p>
                            <p className="text-xs text-gray-600">
                              <span className="font-medium">Size:</span> {(report.file_size / 1024 / 1024).toFixed(2)} MB
                            </p>
                            {report.notes && (
                              <p className="text-xs text-gray-600 mt-2">
                                <span className="font-medium">Notes:</span> {report.notes}
                              </p>
                            )}
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownloadReport(report.file_path, report.file_name)}
                          className="ml-3 flex-shrink-0"
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}