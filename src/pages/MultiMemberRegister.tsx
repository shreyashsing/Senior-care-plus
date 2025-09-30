import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, FileText, AlertTriangle, Users, User, ChevronDown, ArrowRight, ArrowLeft as ArrowLeftIcon, CheckCircle, Star, Plus } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { RazorpayPaymentService } from '../lib/razorpayPaymentService';
import Footer from '@/components/Footer';

// Form data interface for each member
interface MemberFormData {
  // Personal Information
  name: string;
  dateOfBirth: string;
  sex: string;
  
  // Address (shared for family, but each member can override)
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
  hospitalAdmissionDetails: string; // New field for admission details
  surgery: string;
  surgeryDetails: string; // New field for surgery details
  pastConditions: string[];
  currentCondition: string;
  currentMedication: string;
  dischargeCard: File | null;
  prescription: File | null;
  surgeryDocuments: File | null;
  policyCard: File | null;
  otherPastCondition: string;
  
  // Treatment Details
  hospitalName: string;
  doctorName: string;
  doctorContact: string;
  preferredHospital: string;
  nearbyHospitals: string;
  goodHospitalsNearby: string;
  
  // KYC Documents
  photo: File | null;
  
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
  [key: string]: string;
}

const MultiMemberRegister = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get initial plan info from location state
  const initialPlanInfo = location.state?.planInfo;
  
  // State for current plan info
  const [currentPlanInfo, setCurrentPlanInfo] = useState(initialPlanInfo);
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'advance' | 'premium' | ''>(initialPlanInfo?.type || '');
  const [selectedDuration, setSelectedDuration] = useState<6 | 12>(initialPlanInfo?.duration ? (parseInt(initialPlanInfo.duration) as 6 | 12) : 6);
  const [showPlanSelection, setShowPlanSelection] = useState<boolean>(!initialPlanInfo);
  
  // Multi-member registration state
  const [currentMemberIndex, setCurrentMemberIndex] = useState<number>(0);
  const [membersData, setMembersData] = useState<MemberFormData[]>([
    createEmptyMemberData(), // Primary member
    createEmptyMemberData(), // Co-member 1
    createEmptyMemberData()  // Co-member 2
  ]);
  const [membersErrors, setMembersErrors] = useState<FormErrors[]>([{}, {}, {}]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Coupon state
  const [couponCode, setCouponCode] = useState<string>('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [couponError, setCouponError] = useState<string>('');
  
  // Form UI state
  const [expandedSections, setExpandedSections] = useState({
    optional: false
  });
  
  // Available coupons
  const availableCoupons = {
    'TEST999': { discount: 99.9, description: 'Test coupon - 99.9% off' }
  };

  // New pricing structure
  const pricingPlans = {
    6: {
      basic: { price: 3000, title: "Basic" },
      advance: { price: 6000, title: "Advance" },
      premium: { price: 18000, title: "Premium" }
    },
    12: {
      basic: { price: 5000, title: "Basic" },
      advance: { price: 10000, title: "Advance" },
      premium: { price: 30000, title: "Premium" }
    }
  };

  // Past medical conditions options
  const pastConditions = [
    'Diabetes', 'Hypertension', 'Heart Disease', 'Asthma', 'Arthritis', 'Cancer', 'Stroke', 'Kidney Disease', 'Liver Disease', 'Other'
  ];

  // Member labels
  const memberLabels = ['Primary Member', 'Co-Member 1', 'Co-Member 2'];

  // Create empty member data
  function createEmptyMemberData(): MemberFormData {
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
      hospitalAdmissionDetails: '', // Initialize new field
      surgery: '',
      surgeryDetails: '', // Initialize new field
      pastConditions: [],
      currentCondition: '',
      currentMedication: '',
      dischargeCard: null,
      prescription: null,
      surgeryDocuments: null,
      policyCard: null,
      otherPastCondition: '',
      hospitalName: '',
      doctorName: '',
      doctorContact: '',
      preferredHospital: '',
      nearbyHospitals: '',
      goodHospitalsNearby: '',
      photo: null,
      hasInsurance: '',
      insuranceCompany: '',
      tpaName: '',
      policyNumber: '',
      amountCovered: '',
      roomEntitled: '',
      disclaimerAccepted: false
    };
  }

  // Initialize from plan info if available
  useEffect(() => {
    if (initialPlanInfo) {
      setSelectedPlan(initialPlanInfo.type as 'basic' | 'advance' | 'premium');
      setSelectedDuration(parseInt(initialPlanInfo.duration) as 6 | 12);
    }
  }, [initialPlanInfo]);

  // Get current member data
  const getCurrentMemberData = () => membersData[currentMemberIndex];
  const getCurrentMemberErrors = () => membersErrors[currentMemberIndex];

  // Update current member data
  const updateCurrentMemberData = (newData: MemberFormData) => {
    const newMembersData = [...membersData];
    newMembersData[currentMemberIndex] = newData;
    setMembersData(newMembersData);
  };

  const updateCurrentMemberErrors = (newErrors: FormErrors) => {
    const newMembersErrors = [...membersErrors];
    newMembersErrors[currentMemberIndex] = newErrors;
    setMembersErrors(newMembersErrors);
  };

  // Handle input changes
  const handleInputChange = (field: keyof MemberFormData, value: string) => {
    const currentData = getCurrentMemberData();
    const newData = { ...currentData, [field]: value };
    updateCurrentMemberData(newData);
    
    // Clear error when user starts typing
    const currentErrors = getCurrentMemberErrors();
    if (currentErrors[field]) {
      const newErrors = { ...currentErrors, [field]: '' };
      updateCurrentMemberErrors(newErrors);
    }
  };

  const handleFileChange = (field: keyof MemberFormData, file: File | null) => {
    const currentData = getCurrentMemberData();
    const newData = { ...currentData, [field]: file };
    updateCurrentMemberData(newData);
  };

  const handleCheckboxChange = (field: keyof MemberFormData, checked: boolean) => {
    const currentData = getCurrentMemberData();
    const newData = { ...currentData, [field]: checked };
    updateCurrentMemberData(newData);
  };

  const handleArrayChange = (field: keyof Pick<MemberFormData, 'pastConditions'>, value: string, checked: boolean) => {
    const currentData = getCurrentMemberData();
    const currentArray = currentData[field] as string[];
    
    const newData = {
      ...currentData,
      [field]: checked 
        ? [...currentArray, value]
        : currentArray.filter(item => item !== value)
    };
    
    if (field === 'pastConditions' && value === 'Other' && !checked) {
      newData.otherPastCondition = '';
      const currentErrors = getCurrentMemberErrors();
      if (currentErrors.otherPastCondition) {
        const newErrors = { ...currentErrors, otherPastCondition: '' };
        updateCurrentMemberErrors(newErrors);
      }
    }
    
    updateCurrentMemberData(newData);
  };

  // Copy address from primary member to co-members
  const copyAddressFromPrimary = () => {
    if (currentMemberIndex === 0) return; // Can't copy to primary member
    
    const primaryData = membersData[0];
    const currentData = getCurrentMemberData();
    
    const newData = {
      ...currentData,
      houseNo: primaryData.houseNo,
      buildingName: primaryData.buildingName,
      landmark: primaryData.landmark,
      city: primaryData.city,
      district: primaryData.district,
      pinCode: primaryData.pinCode
    };
    
    updateCurrentMemberData(newData);
    
    toast({
      title: "Address Copied",
      description: "Address details copied from primary member",
      variant: "default"
    });
  };

  // Validate member form
  const validateMemberForm = (memberData: MemberFormData): { isValid: boolean; errors: FormErrors } => {
    const errors: FormErrors = {};
    
    // Required fields validation (only essential information fields)
    if (!memberData.name.trim()) errors.name = 'Name is required';
    if (!memberData.dateOfBirth) errors.dateOfBirth = 'Date of birth is required';
    if (!memberData.sex) errors.sex = 'Sex is required';
    if (!memberData.selfCellNumber.trim()) errors.selfCellNumber = 'Mobile number is required';
    if (!memberData.emergencyContactNo.trim()) errors.emergencyContactNo = 'Emergency contact is required';
    if (!memberData.pinCode.trim()) errors.pinCode = 'Pin code is required';
    if (!memberData.disclaimerAccepted) errors.disclaimerAccepted = 'You must accept the disclaimer';
    
    // Phone number validation
    if (memberData.selfCellNumber && !/^\d{10}$/.test(memberData.selfCellNumber)) {
      errors.selfCellNumber = 'Please enter a valid 10-digit mobile number';
    }
    
    // Email validation
    if (memberData.emailId && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(memberData.emailId)) {
      errors.emailId = 'Please enter a valid email address';
    }
    
    // Pin code validation
    if (memberData.pinCode && !/^\d{6}$/.test(memberData.pinCode)) {
      errors.pinCode = 'Please enter a valid 6-digit pin code';
    }
    
    // Other past condition validation
    if (memberData.pastConditions.includes('Other') && !memberData.otherPastCondition.trim()) {
      errors.otherPastCondition = 'Please specify the other past condition';
    }
    
    // Hospital admission details validation
    if (memberData.hospitalAdmission === 'yes' && !memberData.hospitalAdmissionDetails.trim()) {
      errors.hospitalAdmissionDetails = 'Please provide hospital admission details';
    }
    
    // Surgery details validation
    if (memberData.surgery === 'yes' && !memberData.surgeryDetails.trim()) {
      errors.surgeryDetails = 'Please provide surgery details';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };

  // Navigate between members
  const goToNextMember = () => {
    const validation = validateMemberForm(getCurrentMemberData());
    
    if (!validation.isValid) {
      updateCurrentMemberErrors(validation.errors);
      toast({
        title: "Form Incomplete",
        description: "Please fill in all required fields before proceeding.",
        variant: "destructive",
      });
      return;
    }
    
    updateCurrentMemberErrors({});
    
    if (currentMemberIndex < 2) {
      setCurrentMemberIndex(currentMemberIndex + 1);
    }
  };

  const goToPreviousMember = () => {
    if (currentMemberIndex > 0) {
      setCurrentMemberIndex(currentMemberIndex - 1);
    }
  };

  // Calculate final price with coupon
  const calculateFinalPrice = (originalPrice: number): number => {
    if (!appliedCoupon) return originalPrice;
    
    const discount = (originalPrice * appliedCoupon.discount) / 100;
    return Math.max(0, originalPrice - discount);
  };

  // Apply coupon
  const handleApplyCoupon = () => {
    setCouponError('');
    
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }
    
    const coupon = availableCoupons[couponCode.toUpperCase() as keyof typeof availableCoupons];
    
    if (!coupon) {
      setCouponError('Invalid coupon code');
      return;
    }
    
    setAppliedCoupon({
      code: couponCode.toUpperCase(),
      discount: coupon.discount
    });
    
    toast({
      title: "Coupon Applied! 🎉",
      description: `${coupon.discount}% discount applied successfully.`,
      variant: "default",
    });
  };

  // Remove coupon
  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
  };

  // Handle plan selection
  const handlePlanSelect = (planType: 'basic' | 'advance' | 'premium', duration: 6 | 12) => {
    setSelectedPlan(planType);
    setSelectedDuration(duration);
    setShowPlanSelection(false);
    
    const planInfo = {
      type: planType,
      duration: duration.toString(),
      price: pricingPlans[duration][planType].price
    };
    
    setCurrentPlanInfo(planInfo);
    sessionStorage.setItem('selectedPlanInfo', JSON.stringify(planInfo));
    
    // Show toast message
    toast({
      title: "Plan Selected!",
      description: `${pricingPlans[duration][planType].title} plan (${duration} months) - ₹${pricingPlans[duration][planType].price.toLocaleString()} selected successfully.`,
      duration: 3000,
    });
  };

  // Submit all members for registration
  const handleSubmit = async () => {
    // Validate all members
    const allValidations = membersData.map(memberData => validateMemberForm(memberData));
    const hasErrors = allValidations.some(validation => !validation.isValid);
    
    if (hasErrors) {
      // Update errors for all members
      setMembersErrors(allValidations.map(validation => validation.errors));
      
      // Find first member with errors and navigate to them
      const firstErrorIndex = allValidations.findIndex(validation => !validation.isValid);
      setCurrentMemberIndex(firstErrorIndex);
      
      toast({
        title: "Form Incomplete",
        description: "Please complete all member forms before submitting.",
        variant: "destructive",
      });
      return;
    }
    
    if (!selectedPlan) {
      toast({
        title: "No Plan Selected",
        description: "Please select a plan before proceeding.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const finalPlanType = selectedPlan;
      const finalDuration = selectedDuration.toString();
      const originalPrice = pricingPlans[selectedDuration][finalPlanType].price;
      const finalPrice = calculateFinalPrice(originalPrice);
      
      console.log('💰 Registration Summary:');
      console.log('Plan:', finalPlanType);
      console.log('Duration:', finalDuration);
      console.log('Original Price:', originalPrice);
      console.log('Final Price:', finalPrice);
      console.log('Members:', membersData.length);
      
      // Transform member data for payment service
      const patientDataArray = membersData.map((memberData, index) => ({
        ...memberData,
        memberType: index === 0 ? 'primary' : 'co-member',
        memberIndex: index
      }));
      
      // Create payment order
      const paymentOrder = await RazorpayPaymentService.createOrder(
        finalPrice,
        finalPlanType,
        finalDuration,
        patientDataArray
      );
      
      console.log('✅ Payment order created:', paymentOrder);
      
      // Initialize payment with Razorpay
      await RazorpayPaymentService.initializePayment(
        paymentOrder,
        {
          planType: finalPlanType,
          fullName: patientDataArray[0].name,
          email: patientDataArray[0].emailId,
          phone: patientDataArray[0].selfCellNumber,
          patientData: patientDataArray
        },
        // Payment success callback
        (patientData?: any[]) => {
          console.log('🎯 Payment successful! Patient Data:', patientData);
          
          const registrationData = {
            patients: patientData?.map((patient) => ({
              seniorCareId: patient.senior_care_id || patient.id, // Use senior_care_id if available, fallback to id
              name: patient.name,
              dateOfBirth: patient.dateOfBirth,
              sex: patient.sex,
              phoneNumber: patient.phoneNumber,
              memberType: patient.memberType
            })) || [],
            planType: finalPlanType,
            duration: finalDuration,
            price: finalPrice
          };
          
          setIsSubmitting(false);
          sessionStorage.removeItem('selectedPlanInfo');
          
          navigate('/registration-success', {
            state: { registrationData }
          });
          
          toast({
            title: "Registration Successful! 🎉",
            description: "All members registered successfully. E-cards generated.",
            variant: "default",
          });
        },
        // Payment error callback
        (error: any) => {
          console.error('❌ Payment failed:', error);
          setIsSubmitting(false);
          
          toast({
            title: "Payment Failed",
            description: "Payment could not be processed. Please try again.",
            variant: "destructive",
          });
        }
      );
      
    } catch (error) {
      console.error('❌ Registration error:', error);
      setIsSubmitting(false);
      
      toast({
        title: "Registration Error",
        description: "An error occurred during registration. Please try again.",
        variant: "destructive",
      });
    }
  };

  const currentMemberData = getCurrentMemberData();
  const currentMemberErrors = getCurrentMemberErrors();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 py-8">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/pricing')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Pricing
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Multi-Member Registration</h1>
            <p className="text-gray-600">Register 1 Primary Member + 2 Co-Members</p>
          </div>
        </div>
        
        {/* Plan Selection (if needed) */}
        {showPlanSelection && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Select Your Plan</CardTitle>
              <CardDescription>Choose a plan and duration before registration</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Duration Toggle */}
              <div className="flex justify-center mb-6">
                <div className="bg-gray-100 rounded-lg p-1 inline-flex">
                  <button
                    onClick={() => setSelectedDuration(6)}
                    className={`px-4 py-2 rounded-md font-medium transition-all ${
                      selectedDuration === 6
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    6 Months
                  </button>
                  <button
                    onClick={() => setSelectedDuration(12)}
                    className={`px-4 py-2 rounded-md font-medium transition-all ${
                      selectedDuration === 12
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    12 Months
                  </button>
                </div>
              </div>

              {/* Plan Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.entries(pricingPlans[selectedDuration]).map(([planType, planData]) => (
                  <Card 
                    key={planType}
                    className={`cursor-pointer transition-all hover:shadow-lg ${
                      selectedPlan === planType ? 'ring-2 ring-emerald-500' : ''
                    }`}
                    onClick={() => handlePlanSelect(planType as 'basic' | 'advance' | 'premium', selectedDuration)}
                  >
                    <CardHeader className="text-center">
                      <CardTitle className="text-xl">{planData.title}</CardTitle>
                      <div className="text-3xl font-bold text-emerald-600">
                        ₹{planData.price.toLocaleString()}
                      </div>
                      <p className="text-sm text-gray-600">
                        Includes 3 members (1 Primary + 2 Co-members)
                      </p>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Selected Plan Display */}
        {!showPlanSelection && currentPlanInfo && (
          <Card className="mb-6 bg-emerald-50 border-emerald-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-emerald-100 p-3 rounded-lg">
                    <Star className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-emerald-800">
                      {pricingPlans[selectedDuration][selectedPlan as keyof typeof pricingPlans[6]].title} Plan Selected
                    </h3>
                    <p className="text-emerald-600 text-sm">
                      {selectedDuration} months • 3 members (1 Primary + 2 Co-members)
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-emerald-700">
                    ₹{currentPlanInfo.price.toLocaleString()}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPlanSelection(true)}
                    className="mt-2 border-emerald-300 text-emerald-700 hover:bg-emerald-100"
                  >
                    Change Plan
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Registration Progress */}
        {!showPlanSelection && (
          <>
            {/* Progress Indicators */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                {memberLabels.map((label, index) => (
                  <div 
                    key={index}
                    className={`flex items-center gap-2 cursor-pointer ${
                      index === currentMemberIndex ? 'text-emerald-600 font-semibold' : 
                      index < currentMemberIndex ? 'text-green-600' : 'text-gray-400'
                    }`}
                    onClick={() => setCurrentMemberIndex(index)}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                      index === currentMemberIndex ? 'bg-emerald-600 text-white' :
                      index < currentMemberIndex ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {index < currentMemberIndex ? <CheckCircle className="w-4 h-4" /> : index + 1}
                    </div>
                    <span className="hidden sm:inline">{label}</span>
                  </div>
                ))}
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentMemberIndex + 1) / 3) * 100}%` }}
                />
              </div>
            </div>

            {/* Current Member Form */}
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {currentMemberIndex === 0 ? <User className="w-5 h-5" /> : <Users className="w-5 h-5" />}
                      {memberLabels[currentMemberIndex]} Registration
                    </CardTitle>
                    <CardDescription>
                      {currentMemberIndex === 0 
                        ? "Primary member details and family plan information" 
                        : "Co-member details (shares the same plan)"
                      }
                    </CardDescription>
                  </div>
                  
                  {currentMemberIndex > 0 && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={copyAddressFromPrimary}
                      className="flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" />
                      Copy Address
                    </Button>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Essential Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-emerald-700">Essential Information</CardTitle>
                    <CardDescription>
                      Basic details required for registration
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          value={currentMemberData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          placeholder="Full Name"
                          className={currentMemberErrors.name ? 'border-red-500' : ''}
                        />
                        {currentMemberErrors.name && <p className="text-red-500 text-sm mt-1">{currentMemberErrors.name}</p>}
                      </div>
                      
                      <div>
                        <Label htmlFor="pinCode">Pin Code *</Label>
                        <Input
                          id="pinCode"
                          value={currentMemberData.pinCode}
                          onChange={(e) => handleInputChange('pinCode', e.target.value)}
                          placeholder="Pin Code"
                          maxLength={6}
                          className={currentMemberErrors.pinCode ? 'border-red-500' : ''}
                        />
                        {currentMemberErrors.pinCode && <p className="text-red-500 text-sm mt-1">{currentMemberErrors.pinCode}</p>}
                      </div>
                      
                      <div>
                        <Label htmlFor="selfCellNumber">Phone Number *</Label>
                        <Input
                          id="selfCellNumber"
                          value={currentMemberData.selfCellNumber}
                          onChange={(e) => handleInputChange('selfCellNumber', e.target.value)}
                          placeholder="Phone Number"
                          maxLength={10}
                          className={currentMemberErrors.selfCellNumber ? 'border-red-500' : ''}
                        />
                        {currentMemberErrors.selfCellNumber && <p className="text-red-500 text-sm mt-1">{currentMemberErrors.selfCellNumber}</p>}
                      </div>
                      
                      <div>
                        <Label htmlFor="emergencyContactNo">Emergency Contact Number *</Label>
                        <Input
                          id="emergencyContactNo"
                          value={currentMemberData.emergencyContactNo}
                          onChange={(e) => handleInputChange('emergencyContactNo', e.target.value)}
                          placeholder="Emergency Contact Number"
                          className={currentMemberErrors.emergencyContactNo ? 'border-red-500' : ''}
                        />
                        {currentMemberErrors.emergencyContactNo && <p className="text-red-500 text-sm mt-1">{currentMemberErrors.emergencyContactNo}</p>}
                      </div>
                      
                      <div>
                        <Label htmlFor="sex">Gender *</Label>
                        <Select value={currentMemberData.sex} onValueChange={(value) => handleInputChange('sex', value)}>
                          <SelectTrigger className={currentMemberErrors.sex ? 'border-red-500' : ''}>
                            <SelectValue placeholder="Select Gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                          </SelectContent>
                        </Select>
                        {currentMemberErrors.sex && <p className="text-red-500 text-sm mt-1">{currentMemberErrors.sex}</p>}
                      </div>
                      
                      <div>
                        <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                        <Input
                          id="dateOfBirth"
                          type="date"
                          value={currentMemberData.dateOfBirth}
                          onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                          className={currentMemberErrors.dateOfBirth ? 'border-red-500' : ''}
                        />
                        {currentMemberErrors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{currentMemberErrors.dateOfBirth}</p>}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Additional Optional Fields */}
                <Card>
                  <CardHeader 
                    className="cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => setExpandedSections(prev => ({ ...prev, optional: !prev.optional }))}
                  >
                    <CardTitle className="text-emerald-700 flex items-center justify-between">
                      <span>Additional Optional Fields</span>
                      <ChevronDown className={`w-5 h-5 transition-transform ${expandedSections.optional ? 'rotate-180' : ''}`} />
                    </CardTitle>
                    <CardDescription>
                      Optional details to enhance your care experience
                    </CardDescription>
                  </CardHeader>
                  {expandedSections.optional && (
                    <CardContent className="space-y-8">
                      {/* Personal Information */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">Personal Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="houseNo">House No.</Label>
                            <Input
                              id="houseNo"
                              value={currentMemberData.houseNo}
                              onChange={(e) => handleInputChange('houseNo', e.target.value)}
                              placeholder="House/Flat Number"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="buildingName">Building Name</Label>
                            <Input
                              id="buildingName"
                              value={currentMemberData.buildingName}
                              onChange={(e) => handleInputChange('buildingName', e.target.value)}
                              placeholder="Building/Apartment Name"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="landmark">Landmark</Label>
                            <Input
                              id="landmark"
                              value={currentMemberData.landmark}
                              onChange={(e) => handleInputChange('landmark', e.target.value)}
                              placeholder="Nearby Landmark"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="city">City</Label>
                            <Input
                              id="city"
                              value={currentMemberData.city}
                              onChange={(e) => handleInputChange('city', e.target.value)}
                              placeholder="City"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="district">District</Label>
                            <Input
                              id="district"
                              value={currentMemberData.district}
                              onChange={(e) => handleInputChange('district', e.target.value)}
                              placeholder="District"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="emergencyNameAndRelation">Emergency Contact Name & Relation</Label>
                            <Input
                              id="emergencyNameAndRelation"
                              value={currentMemberData.emergencyNameAndRelation}
                              onChange={(e) => handleInputChange('emergencyNameAndRelation', e.target.value)}
                              placeholder="Emergency Contact Name & Relation"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="emailId">Email ID</Label>
                            <Input
                              id="emailId"
                              type="email"
                              value={currentMemberData.emailId}
                              onChange={(e) => handleInputChange('emailId', e.target.value)}
                              placeholder="Email Address"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Personal Habits */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">Personal Habits</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="dietPreference">Diet Preference</Label>
                            <Select value={currentMemberData.dietPreference} onValueChange={(value) => handleInputChange('dietPreference', value)}>
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
                              value={currentMemberData.tobaccoType}
                              onChange={(e) => handleInputChange('tobaccoType', e.target.value)}
                              placeholder="Bidi/Cigarette/Gutkha"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="tobaccoYears">Tobacco Use - Years</Label>
                            <Input
                              id="tobaccoYears"
                              value={currentMemberData.tobaccoYears}
                              onChange={(e) => handleInputChange('tobaccoYears', e.target.value)}
                              placeholder="How many years"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="alcoholFrequency">Alcohol - Frequency & Amount</Label>
                            <Input
                              id="alcoholFrequency"
                              value={currentMemberData.alcoholFrequency}
                              onChange={(e) => handleInputChange('alcoholFrequency', e.target.value)}
                              placeholder="Frequency and amount"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Allergy History */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">Allergy History</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor="medicineAllergy">Medicine Allergy</Label>
                            <Input
                              id="medicineAllergy"
                              value={currentMemberData.medicineAllergy}
                              onChange={(e) => handleInputChange('medicineAllergy', e.target.value)}
                              placeholder="Any medicine allergies"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="foodAllergy">Food Allergy</Label>
                            <Input
                              id="foodAllergy"
                              value={currentMemberData.foodAllergy}
                              onChange={(e) => handleInputChange('foodAllergy', e.target.value)}
                              placeholder="Any food allergies"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="otherAllergy">Other Substance Allergy</Label>
                            <Input
                              id="otherAllergy"
                              value={currentMemberData.otherAllergy}
                              onChange={(e) => handleInputChange('otherAllergy', e.target.value)}
                              placeholder="Other allergies"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Past Medical History */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">Past Medical History</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="hospitalAdmission">Hospital Admission (Last 5 Years)</Label>
                            <Select value={currentMemberData.hospitalAdmission} onValueChange={(value) => handleInputChange('hospitalAdmission', value)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Option" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="yes">Yes</SelectItem>
                                <SelectItem value="no">No</SelectItem>
                              </SelectContent>
                            </Select>
                            {currentMemberData.hospitalAdmission === 'yes' && (
                              <div className="mt-3 space-y-3">
                                <div>
                                  <Label htmlFor="hospitalAdmissionDetails">Hospital Admission Details *</Label>
                                  <Textarea
                                    id="hospitalAdmissionDetails"
                                    value={currentMemberData.hospitalAdmissionDetails}
                                    onChange={(e) => handleInputChange('hospitalAdmissionDetails', e.target.value)}
                                    placeholder="Please provide details about the hospital admission (reason, hospital name, dates, etc.)"
                                    rows={3}
                                    className={`mt-1 ${currentMemberErrors.hospitalAdmissionDetails ? 'border-red-500' : ''}`}
                                  />
                                  {currentMemberErrors.hospitalAdmissionDetails && (
                                    <p className="text-red-500 text-sm mt-1">{currentMemberErrors.hospitalAdmissionDetails}</p>
                                  )}
                                  <p className="text-sm text-gray-600 mt-1">
                                    Required: Please describe the admission details
                                  </p>
                                </div>
                                <div>
                                  <Label htmlFor="dischargeCard">Discharge Card (Optional)</Label>
                                  <Input
                                    id="dischargeCard"
                                    type="file"
                                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                    onChange={(e) => handleFileChange('dischargeCard', e.target.files?.[0] || null)}
                                    className="cursor-pointer"
                                  />
                                  <p className="text-xs text-gray-500 mt-1">
                                    Accepted formats: PDF, JPG, PNG, DOC, DOCX
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                          
                          <div>
                            <Label htmlFor="surgery">Any Surgery Carried Out</Label>
                            <Select value={currentMemberData.surgery} onValueChange={(value) => handleInputChange('surgery', value)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Option" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="yes">Yes</SelectItem>
                                <SelectItem value="no">No</SelectItem>
                              </SelectContent>
                            </Select>
                            {currentMemberData.surgery === 'yes' && (
                              <div className="mt-3 space-y-3">
                                <div>
                                  <Label htmlFor="surgeryDetails">Surgery Details *</Label>
                                  <Textarea
                                    id="surgeryDetails"
                                    value={currentMemberData.surgeryDetails}
                                    onChange={(e) => handleInputChange('surgeryDetails', e.target.value)}
                                    placeholder="Please provide details about the surgery (type of surgery, hospital, date, recovery status, etc.)"
                                    rows={3}
                                    className={`mt-1 ${currentMemberErrors.surgeryDetails ? 'border-red-500' : ''}`}
                                  />
                                  {currentMemberErrors.surgeryDetails && (
                                    <p className="text-red-500 text-sm mt-1">{currentMemberErrors.surgeryDetails}</p>
                                  )}
                                  <p className="text-sm text-gray-600 mt-1">
                                    Required: Please describe the surgery details
                                  </p>
                                </div>
                                <div>
                                  <Label htmlFor="surgeryDocuments">Surgery Documents (Optional)</Label>
                                  <Input
                                    id="surgeryDocuments"
                                    type="file"
                                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                    onChange={(e) => handleFileChange('surgeryDocuments', e.target.files?.[0] || null)}
                                    className="cursor-pointer"
                                  />
                                  <p className="text-xs text-gray-500 mt-1">
                                    Accepted formats: PDF, JPG, PNG, DOC, DOCX
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <Label>Past Medical Conditions</Label>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                            {pastConditions.map((condition) => (
                              <div key={condition} className="flex items-center space-x-2">
                                <Checkbox
                                  id={condition}
                                  checked={currentMemberData.pastConditions.includes(condition)}
                                  onCheckedChange={(checked) => handleArrayChange('pastConditions', condition, checked === true)}
                                />
                                <Label htmlFor={condition} className="text-sm">{condition}</Label>
                              </div>
                            ))}
                          </div>
                          
                          {/* Custom "Other" condition input */}
                          {currentMemberData.pastConditions.includes('Other') && (
                            <div className="mt-4">
                              <Label htmlFor="otherPastCondition">Specify Other Medical Condition</Label>
                              <Input
                                id="otherPastCondition"
                                value={currentMemberData.otherPastCondition}
                                onChange={(e) => handleInputChange('otherPastCondition', e.target.value)}
                                placeholder="Please specify the medical condition"
                                className={`mt-2 ${currentMemberErrors.otherPastCondition ? 'border-red-500' : ''}`}
                              />
                              {currentMemberErrors.otherPastCondition && (
                                <p className="text-red-500 text-sm mt-1">{currentMemberErrors.otherPastCondition}</p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Current Medical History */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">Current Medical History</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="currentCondition">Currently Suffering From</Label>
                            <Textarea
                              id="currentCondition"
                              value={currentMemberData.currentCondition}
                              onChange={(e) => handleInputChange('currentCondition', e.target.value)}
                              placeholder="Describe current health conditions"
                              rows={3}
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="currentMedication">Current Medication</Label>
                            <Textarea
                              id="currentMedication"
                              value={currentMemberData.currentMedication}
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
                                onChange={(e) => handleFileChange('prescription', e.target.files?.[0] || null)}
                                className="cursor-pointer"
                              />
                              <p className="text-xs text-gray-500 mt-1">
                                Accepted formats: PDF, JPG, PNG, DOC, DOCX
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Undergoing Treatment */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">Undergoing Treatment</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="hospitalName">Name of Hospital</Label>
                            <Input
                              id="hospitalName"
                              value={currentMemberData.hospitalName}
                              onChange={(e) => handleInputChange('hospitalName', e.target.value)}
                              placeholder="Hospital Name"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="doctorName">Name of Doctor</Label>
                            <Input
                              id="doctorName"
                              value={currentMemberData.doctorName}
                              onChange={(e) => handleInputChange('doctorName', e.target.value)}
                              placeholder="Doctor's Name"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="doctorContact">Doctor's Contact Number</Label>
                            <Input
                              id="doctorContact"
                              value={currentMemberData.doctorContact}
                              onChange={(e) => handleInputChange('doctorContact', e.target.value)}
                              placeholder="Contact Number"
                            />
                          </div>
                          
                          <div className="md:col-span-2">
                            <Label htmlFor="goodHospitalsNearby">Good Hospitals Nearby</Label>
                            <Textarea
                              id="goodHospitalsNearby"
                              value={currentMemberData.goodHospitalsNearby}
                              onChange={(e) => handleInputChange('goodHospitalsNearby', e.target.value)}
                              placeholder="List good hospitals in your area (name, location, specialties, contact details, etc.)"
                              rows={3}
                            />
                            <p className="text-sm text-gray-600 mt-1">
                              Optional: This helps us coordinate better care and emergency services in your area
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* KYC Documents */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">KYC Documents</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="photo">Recent Photo</Label>
                            <Input
                              id="photo"
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileChange('photo', e.target.files?.[0] || null)}
                              className="cursor-pointer"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Health Insurance */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">Health Insurance</h3>
                        <div>
                          <Label>Do you have health insurance?</Label>
                          <div className="flex gap-4 mt-2">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="insurance-yes"
                                checked={currentMemberData.hasInsurance === 'yes'}
                                onCheckedChange={(checked) => handleInputChange('hasInsurance', checked ? 'yes' : '')}
                              />
                              <Label htmlFor="insurance-yes">Yes</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="insurance-no"
                                checked={currentMemberData.hasInsurance === 'no'}
                                onCheckedChange={(checked) => handleInputChange('hasInsurance', checked ? 'no' : '')}
                              />
                              <Label htmlFor="insurance-no">No</Label>
                            </div>
                          </div>
                        </div>
                        
                        {currentMemberData.hasInsurance === 'yes' && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div>
                              <Label htmlFor="insuranceCompany">Name of Company</Label>
                              <Input
                                id="insuranceCompany"
                                value={currentMemberData.insuranceCompany}
                                onChange={(e) => handleInputChange('insuranceCompany', e.target.value)}
                                placeholder="Insurance Company"
                              />
                            </div>
                            
                            <div>
                              <Label htmlFor="tpaName">Name of TPA</Label>
                              <Input
                                id="tpaName"
                                value={currentMemberData.tpaName}
                                onChange={(e) => handleInputChange('tpaName', e.target.value)}
                                placeholder="TPA Name"
                              />
                            </div>
                            
                            <div>
                              <Label htmlFor="policyNumber">Policy Number</Label>
                              <Input
                                id="policyNumber"
                                value={currentMemberData.policyNumber}
                                onChange={(e) => handleInputChange('policyNumber', e.target.value)}
                                placeholder="Policy Number"
                              />
                            </div>
                            
                            <div>
                              <Label htmlFor="amountCovered">Amount Covered</Label>
                              <Input
                                id="amountCovered"
                                value={currentMemberData.amountCovered}
                                onChange={(e) => handleInputChange('amountCovered', e.target.value)}
                                placeholder="Coverage Amount"
                              />
                            </div>
                            
                            <div>
                              <Label htmlFor="roomEntitled">Room Entitled</Label>
                              <Input
                                id="roomEntitled"
                                value={currentMemberData.roomEntitled}
                                onChange={(e) => handleInputChange('roomEntitled', e.target.value)}
                                placeholder="Room Type"
                              />
                            </div>
                            <div className="md:col-span-2">
                              <Label htmlFor="policyCard">Upload Policy Card</Label>
                              <Input
                                id="policyCard"
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                onChange={(e) => handleFileChange('policyCard', e.target.files?.[0] || null)}
                                className="cursor-pointer"
                              />
                              <p className="text-xs text-gray-500 mt-1">
                                Accepted formats: PDF, JPG, PNG, DOC, DOCX
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  )}
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
                        checked={currentMemberData.disclaimerAccepted}
                        onCheckedChange={(checked) => handleCheckboxChange('disclaimerAccepted', checked === true)}
                        className={currentMemberErrors.disclaimerAccepted ? 'border-red-500' : ''}
                      />
                      <Label htmlFor="disclaimer" className="text-sm font-medium">
                        I have read, understood, and agree to the terms and conditions stated in the disclaimer above *
                      </Label>
                    </div>
                    {currentMemberErrors.disclaimerAccepted && (
                      <p className="text-red-500 text-sm mt-1">{currentMemberErrors.disclaimerAccepted}</p>
                    )}
                  </CardContent>
                </Card>
              </CardContent>
            </Card>

            {/* Navigation and Payment */}
            <div className="flex items-center justify-between">
              {/* Previous Button */}
              <Button
                variant="outline"
                onClick={goToPreviousMember}
                disabled={currentMemberIndex === 0}
                className="flex items-center gap-2"
              >
                <ArrowLeftIcon className="w-4 h-4" />
                Previous
              </Button>

              {/* Next/Submit Button */}
              {currentMemberIndex < 2 ? (
                <Button
                  onClick={goToNextMember}
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700"
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <div className="flex flex-col items-end gap-4">
                  {/* Coupon Section */}
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="w-40"
                    />
                    <Button
                      variant="outline"
                      onClick={handleApplyCoupon}
                      disabled={!!appliedCoupon}
                    >
                      Apply
                    </Button>
                    {appliedCoupon && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleRemoveCoupon}
                        className="text-red-600"
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                  
                  {couponError && <p className="text-red-500 text-sm">{couponError}</p>}
                  
                  {appliedCoupon && (
                    <div className="text-sm text-green-600">
                      Coupon "{appliedCoupon.code}" applied - {appliedCoupon.discount}% off!
                    </div>
                  )}

                  {/* Price Summary */}
                  {selectedPlan && (
                    <div className="text-right">
                      <div className="text-sm text-gray-600">
                        Plan: {pricingPlans[selectedDuration][selectedPlan].title} ({selectedDuration} months)
                      </div>
                      <div className="text-sm text-gray-600">
                        Members: 3 (1 Primary + 2 Co-members)
                      </div>
                      {appliedCoupon && (
                        <div className="text-sm text-gray-500 line-through">
                          ₹{pricingPlans[selectedDuration][selectedPlan].price.toLocaleString()}
                        </div>
                      )}
                      <div className="text-lg font-bold text-emerald-600">
                        ₹{calculateFinalPrice(pricingPlans[selectedDuration][selectedPlan].price).toLocaleString()}
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 px-8"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Complete Registration
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
      
      <Toaster />
      <Footer />
    </div>
  );
};

export default MultiMemberRegister;