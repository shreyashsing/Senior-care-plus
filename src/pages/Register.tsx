import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, FileText, AlertTriangle, Users, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface FormData {
  // Personal Information
  name: string;
  dateOfBirth: string;
  sex: string;
  
  // Address
  houseNo: string;
  buildingName: string;
  landmark: string;
  city: string;
  district: string;
  pinCode: string;
  
  // Contact Details
  selfCellNumber: string;
  emergencyContactNo: string;
  emergencyNameAndRelation: string;
  emailId: string;
  
  // Personal Habits
  dietPreference: string;
  tobaccoType: string;
  tobaccoYears: string;
  alcoholFrequency: string;
  
  // Medical History
  medicineAllergy: string;
  foodAllergy: string;
  otherAllergy: string;
  hospitalAdmission: string;
  surgery: string;
  pastConditions: string[];
  currentCondition: string;
  currentMedication: string;
  dischargeCard: File | null;
  prescription: File | null;
  surgeryDocuments: File | null;
  otherPastCondition: string;
  
  // Treatment Details
  hospitalName: string;
  doctorName: string;
  doctorContact: string;
  preferredHospital: string;
  nearbyHospitals: string;
  
  // KYC Documents
  photo: File | null;
  aadharCard: string;
  
  // Insurance
  hasInsurance: string;
  insuranceCompany: string;
  tpaName: string;
  policyNumber: string;
  amountCovered: string;
  roomEntitled: string;
  
  // Disclaimer
  disclaimerAccepted: boolean;
}

interface FormErrors {
  name?: string;
  dateOfBirth?: string;
  sex?: string;
  selfCellNumber?: string;
  emergencyContactNo?: string;
  disclaimerAccepted?: string;
  otherPastCondition?: string;
}

interface PlanInfo {
  type: 'single' | 'couple';
  duration: string;
  price: number;
}

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get plan information from navigation state or URL params
  const [planInfo, setPlanInfo] = useState<PlanInfo>(() => {
    // Try to get from navigation state first
    const state = location.state as { planInfo?: PlanInfo };
    if (state?.planInfo) {
      return state.planInfo;
    }
    
    // Fallback to URL params
    const params = new URLSearchParams(location.search);
    const type = params.get('type') as 'single' | 'couple' || 'single';
    const duration = params.get('duration') || '1';
    const price = (() => {
      const dur = parseInt(duration);
      if (type === 'single') {
        if (dur === 1) return 3000;
        if (dur === 6) return 16500;
        if (dur === 12) return 30000;
        return 3000 * dur;
      } else {
        if (dur === 1) return 5000;
        if (dur === 6) return 28000;
        if (dur === 12) return 54000;
        return 5000 * dur;
      }
    })();
    
    return { type, duration, price };
  });

  const [currentMemberIndex, setCurrentMemberIndex] = useState(0);
  const [formData, setFormData] = useState<FormData[]>([
    // Initialize with empty form data for each member
    createEmptyFormData(),
    createEmptyFormData()
  ]);

  const [errors, setErrors] = useState<FormErrors[]>([
    {},
    {}
  ]);

  // Create empty form data
  function createEmptyFormData(): FormData {
    return {
      name: '',
      dateOfBirth: '',
      sex: '',
      houseNo: '',
      buildingName: '',
      landmark: '',
      city: '',
      district: '',
      pinCode: '',
      selfCellNumber: '',
      emergencyContactNo: '',
      emergencyNameAndRelation: '',
      emailId: '',
      dietPreference: '',
      tobaccoType: '',
      tobaccoYears: '',
      alcoholFrequency: '',
      medicineAllergy: '',
      foodAllergy: '',
      otherAllergy: '',
      hospitalAdmission: '',
      surgery: '',
      pastConditions: [],
      currentCondition: '',
      currentMedication: '',
      dischargeCard: null,
      prescription: null,
      surgeryDocuments: null,
      otherPastCondition: '',
      hospitalName: '',
      doctorName: '',
      doctorContact: '',
      preferredHospital: '',
      nearbyHospitals: '',
      photo: null,
      aadharCard: '',
      hasInsurance: '',
      insuranceCompany: '',
      tpaName: '',
      policyNumber: '',
      amountCovered: '',
      roomEntitled: '',
      disclaimerAccepted: false
    };
  }

  // Get current member's form data
  const currentFormData = formData[currentMemberIndex];
  const currentErrors = errors[currentMemberIndex];

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => {
      const newData = [...prev];
      newData[currentMemberIndex] = {
        ...newData[currentMemberIndex],
        [field]: value
      };
      return newData;
    });
    
    // Clear error when user starts typing
    if (currentErrors[field]) {
      setErrors(prev => {
        const newErrors = [...prev];
        newErrors[currentMemberIndex] = {
          ...newErrors[currentMemberIndex],
          [field]: ''
        };
        return newErrors;
      });
    }
  };

  const handleFileChange = (field: keyof FormData, file: File) => {
    setFormData(prev => {
      const newData = [...prev];
      newData[currentMemberIndex] = {
        ...newData[currentMemberIndex],
        [field]: file
      };
      return newData;
    });
  };

  const handleCheckboxChange = (field: keyof FormData, checked: boolean) => {
    setFormData(prev => {
      const newData = [...prev];
      newData[currentMemberIndex] = {
        ...newData[currentMemberIndex],
        [field]: checked
      };
      return newData;
    });
  };

  const handleArrayChange = (field: keyof Pick<FormData, 'pastConditions'>, value: string, checked: boolean) => {
    setFormData(prev => {
      const newData = [...prev];
      const currentData = newData[currentMemberIndex];
      
      newData[currentMemberIndex] = {
        ...currentData,
        [field]: checked 
          ? [...(currentData[field] as string[]), value]
          : (currentData[field] as string[]).filter(item => item !== value)
      };
      
      // Clear otherPastCondition if "Other" is unchecked
      if (field === 'pastConditions' && value === 'Other' && !checked) {
        newData[currentMemberIndex].otherPastCondition = '';
        
        // Clear the validation error
        if (errors[currentMemberIndex]?.otherPastCondition) {
          setErrors(prev => {
            const newErrors = [...prev];
            newErrors[currentMemberIndex] = {
              ...newErrors[currentMemberIndex],
              otherPastCondition: ''
            };
            return newErrors;
          });
        }
      }
      
      return newData;
    });
  };

  const validateCurrentForm = () => {
    const newErrors: FormErrors = {};
    const currentData = formData[currentMemberIndex];
    
    // Required fields validation
    if (!currentData.name) newErrors.name = 'Name is required';
    if (!currentData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!currentData.sex) newErrors.sex = 'Sex is required';
    if (!currentData.selfCellNumber) newErrors.selfCellNumber = 'Cell number is required';
    if (!currentData.emergencyContactNo) newErrors.emergencyContactNo = 'Emergency contact is required';
    if (!currentData.disclaimerAccepted) newErrors.disclaimerAccepted = 'You must accept the disclaimer to continue';
    
    // Validate "Other" past condition if selected
    if (currentData.pastConditions.includes('Other') && !currentData.otherPastCondition.trim()) {
      newErrors.otherPastCondition = 'Please specify the other medical condition';
    }
    
    setErrors(prev => {
      const newErrorsArray = [...prev];
      newErrorsArray[currentMemberIndex] = newErrors;
      return newErrorsArray;
    });
    
    return Object.keys(newErrors).length === 0;
  };

  const handleNextMember = () => {
    if (validateCurrentForm()) {
      if (planInfo.type === 'couple' && currentMemberIndex < 1) {
        setCurrentMemberIndex(prev => prev + 1);
      }
    }
  };

  const handlePreviousMember = () => {
    if (currentMemberIndex > 0) {
      setCurrentMemberIndex(prev => prev - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateCurrentForm()) {
      // For single member, submit directly
      if (planInfo.type === 'single') {
        console.log('Single member form submitted:', formData[0]);
        alert('Registration form submitted successfully!');
        navigate('/');
        return;
      }
      
      // For couple, check if we're on the last member
      if (currentMemberIndex === 0) {
        // Move to next member
        handleNextMember();
      } else {
        // Submit both forms
        console.log('Couple registration submitted:', formData);
        alert('Couple registration completed successfully!');
        navigate('/');
      }
    }
  };

  const pastConditions = [
    'Diabetes', 'Hypertension', 'Heart Disease', 'Tuberculosis', 
    'Convulsion', 'Asthma', 'Other'
  ];

  const getMemberTitle = (index: number) => {
    if (planInfo.type === 'single') return 'Member Registration';
    return index === 0 ? 'Primary Member' : 'Secondary Member';
  };

  const getMemberDescription = (index: number) => {
    if (planInfo.type === 'single') return 'Complete the form below to get started with our comprehensive senior care services';
    return index === 0 
      ? 'Please fill in the details for the primary member'
      : 'Please fill in the details for the secondary member';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4 text-emerald-700 hover:text-emerald-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              {getMemberTitle(currentMemberIndex)}
            </h1>
            <p className="text-gray-600 text-lg">
              {getMemberDescription(currentMemberIndex)}
            </p>
            
            {/* Plan Information */}
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-semibold">
              {planInfo.type === 'couple' ? (
                <Users className="w-4 h-4" />
              ) : (
                <User className="w-4 h-4" />
              )}
              <span>
                {planInfo.type === 'couple' ? 'Both Parents Plan' : 'Single Parent Plan'} - {planInfo.duration} Month{parseInt(planInfo.duration) > 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>

        {/* Member Navigation (for both parents plans) */}
        {planInfo.type === 'couple' && (
          <div className="mb-8">
            <div className="flex justify-center">
              <div className="bg-white rounded-2xl p-2 shadow-lg border border-emerald-200">
                <div className="flex gap-2">
                  {[0, 1].map((index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentMemberIndex(index)}
                      className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                        currentMemberIndex === index
                          ? 'bg-emerald-600 text-white shadow-lg'
                          : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
                      }`}
                    >
                      {index === 0 ? 'Primary Member' : 'Secondary Member'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-emerald-700">
                <FileText className="w-5 h-5" />
                Personal Information
              </CardTitle>
              <CardDescription>
                Basic details about the person registering for care services
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={currentFormData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Full Name"
                    className={currentErrors.name ? 'border-red-500' : ''}
                  />
                  {currentErrors.name && <p className="text-red-500 text-sm mt-1">{currentErrors.name}</p>}
                </div>
                
                <div>
                  <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={currentFormData.dateOfBirth}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    className={currentErrors.dateOfBirth ? 'border-red-500' : ''}
                  />
                  {currentErrors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{currentErrors.dateOfBirth}</p>}
                </div>
                
                <div>
                  <Label htmlFor="sex">Sex *</Label>
                  <Select value={currentFormData.sex} onValueChange={(value) => handleInputChange('sex', value)}>
                    <SelectTrigger className={currentErrors.sex ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select Sex" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                  {currentErrors.sex && <p className="text-red-500 text-sm mt-1">{currentErrors.sex}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Address */}
          <Card>
            <CardHeader>
              <CardTitle className="text-emerald-700">Address</CardTitle>
              <CardDescription>
                Complete address information for service delivery
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="houseNo">House No.</Label>
                  <Input
                    id="houseNo"
                    value={currentFormData.houseNo}
                    onChange={(e) => handleInputChange('houseNo', e.target.value)}
                    placeholder="House/Flat Number"
                  />
                </div>
                
                <div>
                  <Label htmlFor="buildingName">Building Name</Label>
                  <Input
                    id="buildingName"
                    value={currentFormData.buildingName}
                    onChange={(e) => handleInputChange('buildingName', e.target.value)}
                    placeholder="Building/Apartment Name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="landmark">Landmark</Label>
                  <Input
                    id="landmark"
                    value={currentFormData.landmark}
                    onChange={(e) => handleInputChange('landmark', e.target.value)}
                    placeholder="Nearby Landmark"
                  />
                </div>
                
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={currentFormData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="City"
                  />
                </div>
                
                <div>
                  <Label htmlFor="district">District</Label>
                  <Input
                    id="district"
                    value={currentFormData.district}
                    onChange={(e) => handleInputChange('district', e.target.value)}
                    placeholder="District"
                  />
                </div>
                
                <div>
                  <Label htmlFor="pinCode">Pin Code</Label>
                  <Input
                    id="pinCode"
                    value={currentFormData.pinCode}
                    onChange={(e) => handleInputChange('pinCode', e.target.value)}
                    placeholder="PIN Code"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-emerald-700">Contact Details</CardTitle>
              <CardDescription>
                Primary and emergency contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="selfCellNumber">Self Cell Number *</Label>
                  <Input
                    id="selfCellNumber"
                    value={currentFormData.selfCellNumber}
                    onChange={(e) => handleInputChange('selfCellNumber', e.target.value)}
                    placeholder="Your Mobile Number"
                    className={currentErrors.selfCellNumber ? 'border-red-500' : ''}
                  />
                  {currentErrors.selfCellNumber && <p className="text-red-500 text-sm mt-1">{currentErrors.selfCellNumber}</p>}
                </div>
                
                <div>
                  <Label htmlFor="emergencyContactNo">Emergency Contact No. *</Label>
                  <Input
                    id="emergencyContactNo"
                    value={currentFormData.emergencyContactNo}
                    onChange={(e) => handleInputChange('emergencyContactNo', e.target.value)}
                    placeholder="Emergency Contact Number"
                    className={currentErrors.emergencyContactNo ? 'border-red-500' : ''}
                  />
                  {currentErrors.emergencyContactNo && <p className="text-red-500 text-sm mt-1">{currentErrors.emergencyContactNo}</p>}
                </div>
                
                <div>
                  <Label htmlFor="emergencyNameAndRelation">Name and Relation</Label>
                  <Input
                    id="emergencyNameAndRelation"
                    value={currentFormData.emergencyNameAndRelation}
                    onChange={(e) => handleInputChange('emergencyNameAndRelation', e.target.value)}
                    placeholder="Emergency Contact Name & Relation"
                  />
                </div>
                
                <div>
                  <Label htmlFor="emailId">Email ID</Label>
                  <Input
                    id="emailId"
                    type="email"
                    value={currentFormData.emailId}
                    onChange={(e) => handleInputChange('emailId', e.target.value)}
                    placeholder="Email Address"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personal Habits */}
          <Card>
            <CardHeader>
              <CardTitle className="text-emerald-700">Personal Habits</CardTitle>
              <CardDescription>
                Information about lifestyle and habits for better care planning
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dietPreference">Diet Preference</Label>
                  <Select value={currentFormData.dietPreference} onValueChange={(value) => handleInputChange('dietPreference', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Diet Preference" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="veg">Vegetarian</SelectItem>
                      <SelectItem value="nonveg">Non-Vegetarian</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="tobaccoType">Tobacco Use - Type</Label>
                  <Input
                    id="tobaccoType"
                    value={currentFormData.tobaccoType}
                    onChange={(e) => handleInputChange('tobaccoType', e.target.value)}
                    placeholder="Bidi/Cigarette/Gutkha"
                  />
                </div>
                
                <div>
                  <Label htmlFor="tobaccoYears">Tobacco Use - Years</Label>
                  <Input
                    id="tobaccoYears"
                    value={currentFormData.tobaccoYears}
                    onChange={(e) => handleInputChange('tobaccoYears', e.target.value)}
                    placeholder="How many years"
                  />
                </div>
                
                <div>
                  <Label htmlFor="alcoholFrequency">Alcohol - Frequency & Amount</Label>
                  <Input
                    id="alcoholFrequency"
                    value={currentFormData.alcoholFrequency}
                    onChange={(e) => handleInputChange('alcoholFrequency', e.target.value)}
                    placeholder="Frequency and amount"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Allergy History */}
          <Card>
            <CardHeader>
              <CardTitle className="text-emerald-700">Allergy History</CardTitle>
              <CardDescription>
                Known allergies for safe care delivery
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="medicineAllergy">Medicine Allergy</Label>
                  <Input
                    id="medicineAllergy"
                    value={currentFormData.medicineAllergy}
                    onChange={(e) => handleInputChange('medicineAllergy', e.target.value)}
                    placeholder="Any medicine allergies"
                  />
                </div>
                
                <div>
                  <Label htmlFor="foodAllergy">Food Allergy</Label>
                  <Input
                    id="foodAllergy"
                    value={currentFormData.foodAllergy}
                    onChange={(e) => handleInputChange('foodAllergy', e.target.value)}
                    placeholder="Any food allergies"
                  />
                </div>
                
                <div>
                  <Label htmlFor="otherAllergy">Other Substance Allergy</Label>
                  <Input
                    id="otherAllergy"
                    value={currentFormData.otherAllergy}
                    onChange={(e) => handleInputChange('otherAllergy', e.target.value)}
                    placeholder="Other allergies"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Past Medical History */}
          <Card>
            <CardHeader>
              <CardTitle className="text-emerald-700">Past Medical History</CardTitle>
              <CardDescription>
                Previous medical conditions and hospitalizations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="hospitalAdmission">Hospital Admission (Last 5 Years)</Label>
                  <Select value={currentFormData.hospitalAdmission} onValueChange={(value) => handleInputChange('hospitalAdmission', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                  {currentFormData.hospitalAdmission === 'yes' && (
                    <p className="text-sm text-amber-600 mt-1">
                      Please submit discharge card if available
                    </p>
                  )}
                  {currentFormData.hospitalAdmission === 'yes' && (
                    <div className="mt-3">
                      <Label htmlFor="dischargeCard">Discharge Card</Label>
                      <Input
                        id="dischargeCard"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                        onChange={(e) => handleFileChange('dischargeCard', e.target.files[0])}
                        className="cursor-pointer"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Accepted formats: PDF, JPG, PNG, DOC, DOCX
                      </p>
                    </div>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="surgery">Any Surgery Carried Out</Label>
                  <Select value={currentFormData.surgery} onValueChange={(value) => handleInputChange('surgery', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                  {currentFormData.surgery === 'yes' && (
                    <div className="mt-3">
                      <Label htmlFor="surgeryDocuments">Surgery Documents</Label>
                      <Input
                        id="surgeryDocuments"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                        onChange={(e) => handleFileChange('surgeryDocuments', e.target.files[0])}
                        className="cursor-pointer"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Accepted formats: PDF, JPG, PNG, DOC, DOCX
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <Label>Past Medical Conditions</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                  {pastConditions.map((condition) => (
                    <div key={condition} className="flex items-center space-x-2">
                      <Checkbox
                        id={condition}
                        checked={currentFormData.pastConditions.includes(condition)}
                        onCheckedChange={(checked) => handleArrayChange('pastConditions', condition, checked === true)}
                      />
                      <Label htmlFor={condition} className="text-sm">{condition}</Label>
                    </div>
                  ))}
                </div>
                
                {/* Custom "Other" condition input */}
                {currentFormData.pastConditions.includes('Other') && (
                  <div className="mt-4">
                    <Label htmlFor="otherPastCondition">Specify Other Medical Condition</Label>
                    <Input
                      id="otherPastCondition"
                      value={currentFormData.otherPastCondition}
                      onChange={(e) => handleInputChange('otherPastCondition', e.target.value)}
                      placeholder="Please specify the medical condition"
                      className={`mt-2 ${currentErrors.otherPastCondition ? 'border-red-500' : ''}`}
                    />
                    {currentErrors.otherPastCondition && (
                      <p className="text-red-500 text-sm mt-1">{currentErrors.otherPastCondition}</p>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Current Medical History */}
          <Card>
            <CardHeader>
              <CardTitle className="text-emerald-700">Current Medical History</CardTitle>
              <CardDescription>
                Present health conditions and medications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="currentCondition">Currently Suffering From</Label>
                  <Textarea
                    id="currentCondition"
                    value={currentFormData.currentCondition}
                    onChange={(e) => handleInputChange('currentCondition', e.target.value)}
                    placeholder="Describe current health conditions"
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="currentMedication">Current Medication</Label>
                  <Textarea
                    id="currentMedication"
                    value={currentFormData.currentMedication}
                    onChange={(e) => handleInputChange('currentMedication', e.target.value)}
                    placeholder="List current medications"
                    rows={3}
                  />
                  <p className="text-sm text-amber-600 mt-1">
                    Please submit doctor prescription
                  </p>
                  <div className="mt-3">
                    <Label htmlFor="prescription">Doctor Prescription</Label>
                    <Input
                      id="prescription"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      onChange={(e) => handleFileChange('prescription', e.target.files[0])}
                      className="cursor-pointer"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Accepted formats: PDF, JPG, PNG, DOC, DOCX
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Undergoing Treatment */}
          <Card>
            <CardHeader>
              <CardTitle className="text-emerald-700">Undergoing Treatment</CardTitle>
              <CardDescription>
                Current treatment details and healthcare providers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="hospitalName">Name of Hospital</Label>
                  <Input
                    id="hospitalName"
                    value={currentFormData.hospitalName}
                    onChange={(e) => handleInputChange('hospitalName', e.target.value)}
                    placeholder="Hospital Name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="doctorName">Name of Doctor</Label>
                  <Input
                    id="doctorName"
                    value={currentFormData.doctorName}
                    onChange={(e) => handleInputChange('doctorName', e.target.value)}
                    placeholder="Doctor's Name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="doctorContact">Doctor's Contact Number</Label>
                  <Input
                    id="doctorContact"
                    value={currentFormData.doctorContact}
                    onChange={(e) => handleInputChange('doctorContact', e.target.value)}
                    placeholder="Contact Number"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Hospital Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="text-emerald-700">Hospital Preferences</CardTitle>
              <CardDescription>
                Preferred hospitals and nearby healthcare facilities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="preferredHospital">Preferred Hospital</Label>
                  <Input
                    id="preferredHospital"
                    value={currentFormData.preferredHospital}
                    onChange={(e) => handleInputChange('preferredHospital', e.target.value)}
                    placeholder="Your preferred hospital"
                  />
                </div>
                
                <div>
                  <Label htmlFor="nearbyHospitals">Good Hospitals Near Your House</Label>
                  <Input
                    id="nearbyHospitals"
                    value={currentFormData.nearbyHospitals}
                    onChange={(e) => handleInputChange('nearbyHospitals', e.target.value)}
                    placeholder="Nearby hospitals"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* KYC Documents */}
          <Card>
            <CardHeader>
              <CardTitle className="text-emerald-700">KYC Documents</CardTitle>
              <CardDescription>
                Required identification and verification documents
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="photo">Recent Photo</Label>
                  <Input
                    id="photo"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange('photo', e.target.files[0])}
                    className="cursor-pointer"
                  />
                </div>
                
                <div>
                  <Label htmlFor="aadharCard">Aadhar Card</Label>
                  <Input
                    id="aadharCard"
                    value={currentFormData.aadharCard}
                    onChange={(e) => handleInputChange('aadharCard', e.target.value)}
                    placeholder="Aadhar Card Number"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Health Insurance */}
          <Card>
            <CardHeader>
              <CardTitle className="text-emerald-700">Health Insurance</CardTitle>
              <CardDescription>
                Insurance coverage details if applicable
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Do you have health insurance?</Label>
                <div className="flex gap-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="insurance-yes"
                      checked={currentFormData.hasInsurance === 'yes'}
                      onCheckedChange={(checked) => handleInputChange('hasInsurance', checked ? 'yes' : '')}
                    />
                    <Label htmlFor="insurance-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="insurance-no"
                      checked={currentFormData.hasInsurance === 'no'}
                      onCheckedChange={(checked) => handleInputChange('hasInsurance', checked ? 'no' : '')}
                    />
                    <Label htmlFor="insurance-no">No</Label>
                  </div>
                </div>
              </div>
              
              {currentFormData.hasInsurance === 'yes' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="insuranceCompany">Name of Company</Label>
                    <Input
                      id="insuranceCompany"
                      value={currentFormData.insuranceCompany}
                      onChange={(e) => handleInputChange('insuranceCompany', e.target.value)}
                      placeholder="Insurance Company"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="tpaName">Name of TPA</Label>
                    <Input
                      id="tpaName"
                      value={currentFormData.tpaName}
                      onChange={(e) => handleInputChange('tpaName', e.target.value)}
                      placeholder="TPA Name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="policyNumber">Policy Number</Label>
                    <Input
                      id="policyNumber"
                      value={currentFormData.policyNumber}
                      onChange={(e) => handleInputChange('policyNumber', e.target.value)}
                      placeholder="Policy Number"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="amountCovered">Amount Covered</Label>
                    <Input
                      id="amountCovered"
                      value={currentFormData.amountCovered}
                      onChange={(e) => handleInputChange('amountCovered', e.target.value)}
                      placeholder="Coverage Amount"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="roomEntitled">Room Entitled</Label>
                    <Input
                      id="roomEntitled"
                      value={currentFormData.roomEntitled}
                      onChange={(e) => handleInputChange('roomEntitled', e.target.value)}
                      placeholder="Room Type"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Disclaimer */}
          <Card className="border-amber-200 bg-amber-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-800">
                <AlertTriangle className="w-5 h-5" />
                Disclaimer – Senior Care Plus
              </CardTitle>
              <CardDescription className="text-amber-700">
                Please read and acknowledge the following terms and conditions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-white p-4 rounded-lg border border-amber-200 mb-4 max-h-64 overflow-y-auto">
                <div className="space-y-3 text-sm text-gray-700">
                  <p>
                    Senior Care Plus provides wellness, home care, hospital support, and emergency coordination services with the goal of improving accessibility and convenience for seniors. Please note the following:
                  </p>
                  
                  <div className="space-y-2">
                    <p className="font-semibold">1. Not a Substitute for Emergency Care</p>
                    <p className="pl-4">
                      In case of a life-threatening emergency, please call your local emergency number immediately. While we provide 24/7 emergency support, response times may vary depending on location and circumstances.
                    </p>
                    
                    <p className="font-semibold">2. Scope of Services</p>
                    <p className="pl-4">
                      Our online wellness sessions (yoga, physiotherapy, diet, and mindfulness) are intended for general health and lifestyle support. They do not replace in-person consultations, clinical examinations, or specialized medical advice from your treating physician.
                    </p>
                    
                    <p className="font-semibold">3. Limitations of Online Consultations</p>
                    <p className="pl-4">
                      Recommendations are based on the information shared by the participant. The absence of a physical examination may limit the accuracy of assessments.
                    </p>
                    
                    <p className="font-semibold">4. Hospital & Home Care Services</p>
                    <p className="pl-4">
                      Hospital admission support, doctor visits, ICU/home setups, and ambulance services are provided in coordination with partner hospitals, healthcare professionals, and service providers. Senior Care Plus is not directly responsible for the medical outcomes or quality of care provided by these partners.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="disclaimer"
                  checked={currentFormData.disclaimerAccepted}
                  onCheckedChange={(checked) => handleCheckboxChange('disclaimerAccepted', checked === true)}
                  className={currentErrors.disclaimerAccepted ? 'border-red-500' : ''}
                />
                <Label htmlFor="disclaimer" className="text-sm font-medium">
                  I have read, understood, and agree to the terms and conditions stated in the disclaimer above *
                </Label>
              </div>
              {currentErrors.disclaimerAccepted && (
                <p className="text-red-500 text-sm mt-1">{currentErrors.disclaimerAccepted}</p>
              )}
            </CardContent>
          </Card>

          {/* Navigation and Submit Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* Previous Button (for both parents plans) */}
            {planInfo.type === 'couple' && currentMemberIndex > 0 && (
              <Button
                type="button"
                variant="outline"
                onClick={handlePreviousMember}
                className="px-8 py-4 text-lg font-semibold rounded-xl border-2 border-emerald-300 text-emerald-700 hover:bg-emerald-50"
              >
                Previous Member
              </Button>
            )}
            
            {/* Next/Submit Button */}
            <Button
              type="submit"
              size="lg"
              disabled={!currentFormData.disclaimerAccepted}
              className={`px-12 py-4 text-lg font-semibold rounded-xl shadow-lg transition-all duration-300 ${
                currentFormData.disclaimerAccepted
                  ? 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white hover:shadow-xl transform hover:-translate-y-1'
                  : 'bg-gray-400 text-gray-200 cursor-not-allowed'
              }`}
            >
              {planInfo.type === 'couple' && currentMemberIndex === 0 ? 'Next Member' : 'Submit Registration'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
