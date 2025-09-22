import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, FileText, AlertTriangle, Users, User, ChevronDown, ArrowRight, ArrowLeft as ArrowLeftIcon, CheckCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { createPatient, createCarePlan } from '../lib/patientService';
import { RazorpayPaymentService } from '../lib/razorpayPaymentService';

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
  policyCard: File | null;
  otherPastCondition: string;
  
  // Treatment Details
  hospitalName: string;
  doctorName: string;
  doctorContact: string;
  preferredHospital: string;
  nearbyHospitals: string;
  
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
  name?: string;
  dateOfBirth?: string;
  sex?: string;
  pinCode?: string;
  selfCellNumber?: string;
  emergencyContactNo?: string;
  disclaimerAccepted?: string;
  otherPastCondition?: string;
}

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get plan info from location state or use defaults
  const initialPlanInfo = location.state?.planInfo || null;
  
  // State for current plan info (can be updated when plan is selected)
  const [currentPlanInfo, setCurrentPlanInfo] = useState(initialPlanInfo);
  
  const [selectedPlan, setSelectedPlan] = useState<string>(initialPlanInfo?.type || '');
  const [selectedDuration, setSelectedDuration] = useState<string>(initialPlanInfo?.duration || '');
  const [showPlanSelection, setShowPlanSelection] = useState<boolean>(!initialPlanInfo);
  const [planJustSelected, setPlanJustSelected] = useState<boolean>(false);
  
  // Initialize selectedPlan and selectedDuration from initialPlanInfo if available
  useEffect(() => {
    if (initialPlanInfo) {
      setSelectedPlan(initialPlanInfo.type);
      setSelectedDuration(initialPlanInfo.duration);
    }
  }, [initialPlanInfo]);
  const [expandedSections, setExpandedSections] = useState({
    optional: false
  });
  
  // For Both Parents: track current parent being filled
  const [currentParentIndex, setCurrentParentIndex] = useState<number>(0);
  const [parent1FormData, setParent1FormData] = useState<FormData>(createEmptyFormData());
  const [parent2FormData, setParent2FormData] = useState<FormData>(createEmptyFormData());
  const [parent1Errors, setParent1Errors] = useState<FormErrors>({});
  const [parent2Errors, setParent2Errors] = useState<FormErrors>({});
  
  // For Single Parent: use the original form data
  const [formData, setFormData] = useState<FormData>(createEmptyFormData());
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false); // Add loading state

  // Check for selected plan in sessionStorage when component mounts
  useEffect(() => {
    const storedPlanInfo = sessionStorage.getItem('selectedPlanInfo');
    
    if (storedPlanInfo && !initialPlanInfo) {
      const parsedPlanInfo = JSON.parse(storedPlanInfo);
      setSelectedPlan(parsedPlanInfo.type);
      setSelectedDuration(parsedPlanInfo.duration);
      setCurrentPlanInfo(parsedPlanInfo);
      setShowPlanSelection(false);
    }
  }, [initialPlanInfo]);

  // Past medical conditions options
  const pastConditions = [
    'Diabetes', 'Hypertension', 'Heart Disease', 'Asthma', 'Arthritis', 'Cancer', 'Stroke', 'Kidney Disease', 'Liver Disease', 'Other'
  ];

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
      policyCard: null,
      otherPastCondition: '',
      hospitalName: '',
      doctorName: '',
      doctorContact: '',
      preferredHospital: '',
      nearbyHospitals: '',
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

  // Get current form data and errors based on plan type and current parent
  const getCurrentFormData = () => {
    if (selectedPlan === 'couple') {
      return currentParentIndex === 0 ? parent1FormData : parent2FormData;
    }
    return formData;
  };

  const getCurrentErrors = () => {
    if (selectedPlan === 'couple') {
      return currentParentIndex === 0 ? parent1Errors : parent2Errors;
    }
    return errors;
  };

  const setCurrentFormData = (data: FormData) => {
    if (selectedPlan === 'couple') {
      if (currentParentIndex === 0) {
        setParent1FormData(data);
      } else {
        setParent2FormData(data);
      }
    } else {
      setFormData(data);
    }
  };

  const setCurrentErrors = (errorData: FormErrors) => {
    if (selectedPlan === 'couple') {
      if (currentParentIndex === 0) {
        setParent1Errors(errorData);
      } else {
        setParent2Errors(errorData);
      }
    } else {
      setErrors(errorData);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    const currentData = getCurrentFormData();
    const newData = {
      ...currentData,
      [field]: value
    };
    setCurrentFormData(newData);
    
    // Clear error when user starts typing
    const currentErrorData = getCurrentErrors();
    if (currentErrorData[field]) {
      const newErrors = {
        ...currentErrorData,
        [field]: ''
      };
      setCurrentErrors(newErrors);
    }
  };

  const handleFileChange = (field: keyof FormData, file: File) => {
    const currentData = getCurrentFormData();
    const newData = {
      ...currentData,
      [field]: file
    };
    setCurrentFormData(newData);
  };

  const handleCheckboxChange = (field: keyof FormData, checked: boolean) => {
    const currentData = getCurrentFormData();
    const newData = {
      ...currentData,
      [field]: checked
    };
    setCurrentFormData(newData);
  };

  const handleArrayChange = (field: keyof Pick<FormData, 'pastConditions'>, value: string, checked: boolean) => {
    const currentData = getCurrentFormData();
    const currentArray = currentData[field] as string[];
    
    const newData = {
      ...currentData,
      [field]: checked 
        ? [...currentArray, value]
        : currentArray.filter(item => item !== value)
    };
    
    // Clear otherPastCondition if "Other" is unchecked
    if (field === 'pastConditions' && value === 'Other' && !checked) {
      newData.otherPastCondition = '';
      
      // Clear the validation error
      const currentErrorData = getCurrentErrors();
      if (currentErrorData.otherPastCondition) {
        const newErrors = {
          ...currentErrorData,
          otherPastCondition: ''
        };
        setCurrentErrors(newErrors);
      }
    }
    
    setCurrentFormData(newData);
  };

  const validateCurrentForm = () => {
    const newErrors: FormErrors = {};
    const currentData = getCurrentFormData();
    
    // Required fields validation
    if (!currentData.name) newErrors.name = 'Name is required';
    if (!currentData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!currentData.sex) newErrors.sex = 'Sex is required';
    if (!currentData.pinCode) newErrors.pinCode = 'Pin code is required';
    if (!currentData.selfCellNumber) newErrors.selfCellNumber = 'Cell number is required';
    if (!currentData.emergencyContactNo) newErrors.emergencyContactNo = 'Emergency contact is required';
    
    // Disclaimer is only required for Parent 2 in Both Parents plan, or for Single Parent
    if ((selectedPlan === 'couple' && currentParentIndex === 1) || selectedPlan === 'single') {
      if (!currentData.disclaimerAccepted) {
        newErrors.disclaimerAccepted = 'You must accept the disclaimer to continue';
      }
    }
    
    // Validate "Other" past condition if selected
    if (currentData.pastConditions.includes('Other') && !currentData.otherPastCondition.trim()) {
      newErrors.otherPastCondition = 'Please specify the other medical condition';
    }
    
    setCurrentErrors(newErrors);
    
    return Object.keys(newErrors).length === 0;
  };

  const handleMoveToSecondParent = () => {
    if (validateCurrentForm()) {
      setCurrentParentIndex(1);
      // Scroll to top of form
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBackToFirstParent = () => {
    setCurrentParentIndex(0);
    // Scroll to top of form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Helper function to validate form data
  const validateFormData = (data: FormData, isParent2: boolean = false): boolean => {
    const errors: FormErrors = {};
    if (!data.name?.trim()) errors.name = 'Name is required';
    if (!data.dateOfBirth) errors.dateOfBirth = 'Date of birth is required';
    if (!data.sex) errors.sex = 'Gender is required';
    if (!data.pinCode?.trim()) errors.pinCode = 'Pin code is required';
    if (!data.selfCellNumber?.trim()) errors.selfCellNumber = 'Phone number is required';
    if (!data.emergencyContactNo?.trim()) errors.emergencyContactNo = 'Emergency contact is required';
    
    // Disclaimer is only required for Parent 2 in Both Parents plan, or for Single Parent
    if (isParent2 && !data.disclaimerAccepted) {
      errors.disclaimerAccepted = 'Please accept the disclaimer';
    }

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return; // Prevent double submission
    
    setIsSubmitting(true);
    
    try {
      // Check for stored plan info first, then fall back to other sources
      const storedPlanInfo = sessionStorage.getItem('selectedPlanInfo');
      let finalPlanType, finalDuration;
      
      if (storedPlanInfo) {
        const parsedPlanInfo = JSON.parse(storedPlanInfo);
        finalPlanType = parsedPlanInfo.type;
        finalDuration = parsedPlanInfo.duration;
      } else if (currentPlanInfo && !showPlanSelection) {
        finalPlanType = currentPlanInfo.type;
        finalDuration = currentPlanInfo.duration;
      } else {
        finalPlanType = selectedPlan;
        finalDuration = selectedDuration;
      }
      
      // Validate that a plan is selected
      if (!finalPlanType || !finalDuration) {
        toast({
          title: "Plan Selection Required",
          description: "Please select a plan and duration before submitting the form.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // For Both Parents, validate both forms
      if (finalPlanType === 'couple') {
        // Validate Parent 1 (disclaimer not required)
        const parent1Valid = validateFormData(parent1FormData, false);
        if (!parent1Valid) {
          setCurrentParentIndex(0);
          toast({
            title: "Parent 1 Form Incomplete",
            description: "Please complete Parent 1's information before submitting.",
            variant: "destructive",
          });
          setIsSubmitting(false);
          return;
        }

        // Validate Parent 2 (disclaimer required)
        const parent2Valid = validateFormData(parent2FormData, true);
        if (!parent2Valid) {
          setCurrentParentIndex(1);
          toast({
            title: "Parent 2 Form Incomplete",
            description: "Please complete Parent 2's information and accept the disclaimer before submitting.",
            variant: "destructive",
          });
          setIsSubmitting(false);
          return;
        }
      } else {
        // For Single Parent, validate the single form (disclaimer required)
        const singleValid = validateFormData(formData, true);
        if (!singleValid) {
          toast({
            title: "Form Incomplete",
            description: "Please fill in all required fields and accept the disclaimer.",
            variant: "destructive",
          });
          setIsSubmitting(false);
          return;
        }
      }

      // Calculate price based on selected plan and duration
      const price = (() => {
        const duration = parseInt(finalDuration);
        if (finalPlanType === 'single') {
          if (duration === 1) return 3000;
          if (duration === 6) return 16500;
          if (duration === 12) return 30000;
          return 3000 * duration;
        } else {
          if (duration === 1) return 5000;
          if (duration === 6) return 28000;
          if (duration === 12) return 54000;
          return 5000 * duration;
        }
      })();

      // Prepare patient data array for payment
      const patientDataArray = finalPlanType === 'couple' 
        ? [parent1FormData, parent2FormData]
        : [formData];

      console.log('🚀 Creating payment order...');

      // Create payment order instead of directly creating patients
      const paymentOrder = await RazorpayPaymentService.createOrder(
        price,
        finalPlanType,
        finalDuration,
        patientDataArray
      );

      console.log('✅ Payment order created:', paymentOrder);
      console.log('🎯 Initializing payment with Razorpay...');

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
        () => {
          console.log('✅ Payment successful');
          setIsSubmitting(false); // Reset loading state
          
          // Clear stored plan info
          sessionStorage.removeItem('selectedPlanInfo');
          
          // Navigate to success page with patient data
          navigate('/registration-success', {
            state: {
              registrationData: patientDataArray
            }
          });
          
          toast({
            title: "Payment Successful! 🎉",
            description: "Your registration is complete. E-card has been generated.",
            variant: "default",
          });
        },
        // Payment failure callback
        (error) => {
          console.error('❌ Payment failed:', error);
          setIsSubmitting(false);
          
          toast({
            title: "Payment Failed",
            description: error.message || "Payment was cancelled or failed. Please try again.",
            variant: "destructive",
          });
        }
      );

      console.log('🎯 Payment initialization complete');

    } catch (error) {
      console.error('Registration error:', error);
      setIsSubmitting(false);
      
      toast({
        title: "Registration Failed",
        description: error instanceof Error ? error.message : "There was an error processing your registration. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Get member title and description
  const getMemberTitle = () => {
    if (selectedPlan === 'couple') {
      return `Parent ${currentParentIndex + 1} Registration`;
    }
    return 'Member Registration';
  };

  const getMemberDescription = () => {
    if (selectedPlan === 'couple') {
      return `Complete Parent ${currentParentIndex + 1}'s information below. ${currentParentIndex === 0 ? 'After filling this form, you will proceed to Parent 2 where you will need to accept the disclaimer.' : 'Review both parents\' information and accept the disclaimer to submit.'}`;
    }
    return 'Complete the form below to get started with our comprehensive senior care services.';
  };

  // Get current form data and errors for rendering
  const currentFormData = getCurrentFormData();
  const currentErrors = getCurrentErrors();



  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-8">
      <div className="max-w-4xl mx-auto p-6">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-emerald-700 hover:text-emerald-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            {getMemberTitle()}
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            {getMemberDescription()}
          </p>
          
          {/* Plan Selection Interface */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-emerald-100">
            {currentPlanInfo && !showPlanSelection ? (
              // Show selected plan when coming from home page
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="h-6 w-6 text-emerald-600" />
                  <h2 className="text-xl font-semibold text-emerald-700">Selected Plan</h2>
                </div>
                <div className={`bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl p-6 border-2 border-emerald-200 relative overflow-hidden transition-all duration-500 ${
                  planJustSelected ? 'ring-4 ring-emerald-300 ring-opacity-75 animate-pulse' : ''
                }`}>
                  {/* Success indicator */}
                  <div className="absolute top-3 right-3">
                    <div className="bg-emerald-600 text-white p-2 rounded-full">
                      <CheckCircle className="h-4 w-4" />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pr-12">
                    <div>
                      <h3 className="font-bold text-emerald-800 text-lg">
                        {currentPlanInfo.type === 'single' ? 'Single Parent' : 'Both Parents'} - {currentPlanInfo.duration} Month{parseInt(currentPlanInfo.duration) > 1 ? 's' : ''}
                      </h3>
                      <p className="text-emerald-700 font-semibold text-xl">
                        INR {currentPlanInfo.price?.toLocaleString() || (() => {
                          const duration = parseInt(currentPlanInfo.duration);
                          if (currentPlanInfo.type === 'single') {
                            if (duration === 1) return '3,000';
                            if (duration === 6) return '16,500';
                            if (duration === 12) return '30,000';
                            return (3000 * duration).toLocaleString();
                          } else {
                            if (duration === 1) return '5,000';
                            if (duration === 6) return '28,000';
                            if (duration === 12) return '54,000';
                            return (5000 * duration).toLocaleString();
                          }
                        })()}
                      </p>
                    </div>
                    <div className="text-right">
                      {parseInt(currentPlanInfo.duration) > 1 && (
                        <div className="inline-block bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold mb-2">
                          Save ₹{(() => {
                            const duration = parseInt(currentPlanInfo.duration);
                            if (currentPlanInfo.type === 'single') {
                              if (duration === 6) return '1,500';
                              if (duration === 12) return '6,000';
                              return '0';
                            } else {
                              if (duration === 6) return '2,000';
                              if (duration === 12) return '6,000';
                              return '0';
                            }
                          })()}
                        </div>
                      )}
                      <p className="text-xs text-emerald-600">
                        {parseInt(currentPlanInfo.duration) === 1 ? 'No discount' : 'Discounted price'}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowPlanSelection(true);
                      setSelectedPlan('');
                      setSelectedDuration('');
                    }}
                    className="text-emerald-600 hover:text-emerald-700 border-emerald-300 hover:border-emerald-400"
                  >
                    Change Plan
                  </Button>
                </div>
              </div>
            ) : (
              // Show plan selection interface when accessing directly or when changing plan
              <>
                <h2 className="text-xl font-semibold text-emerald-700 mb-4">Choose Your Plan</h2>
                <p className="text-gray-600 mb-6">Select the plan that best fits your needs</p>
                
                {/* Plan Type Selection */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <button
                    onClick={() => setSelectedPlan('single')}
                    className={`flex-1 px-6 py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
                      selectedPlan === 'single'
                        ? 'bg-emerald-600 text-white shadow-lg transform scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-emerald-50 hover:border-emerald-300 border-2 border-transparent'
                    }`}
                  >
                    <span className="relative z-10">Single Parent</span>
                  </button>
                  <button
                    onClick={() => setSelectedPlan('couple')}
                    className={`flex-1 px-6 py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
                      selectedPlan === 'couple'
                        ? 'bg-emerald-600 text-white shadow-lg transform scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-emerald-50 hover:border-emerald-300 border-2 border-transparent'
                    }`}
                  >
                    <span className="relative z-10">Both Parents</span>
                  </button>
                </div>

                {/* Duration Selection */}
                {selectedPlan && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">Select Duration</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { value: '1', label: '1 Month' },
                        { value: '6', label: '6 Months' },
                        { value: '12', label: '12 Months' }
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setSelectedDuration(option.value)}
                          className={`px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                            selectedDuration === option.value
                              ? 'bg-emerald-600 text-white shadow-md'
                              : 'bg-gray-100 text-gray-700 hover:bg-emerald-50 hover:border-emerald-300 border-2 border-transparent'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Plan Summary */}
                {selectedPlan && selectedDuration && (
                  <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-emerald-800">
                          {selectedPlan === 'single' ? 'Single Parent' : 'Both Parents'} - {selectedDuration} Month{parseInt(selectedDuration) > 1 ? 's' : ''}
                        </h3>
                        <p className="text-emerald-600 font-medium">
                          INR {(() => {
                            const duration = parseInt(selectedDuration);
                            if (selectedPlan === 'single') {
                              if (duration === 1) return '3,000';
                              if (duration === 6) return '16,500';
                              if (duration === 12) return '30,000';
                              return (3000 * duration).toLocaleString();
                            } else {
                              if (duration === 1) return '5,000';
                              if (duration === 6) return '28,000';
                              if (duration === 12) return '54,000';
                              return (5000 * duration).toLocaleString();
                            }
                          })()}
                        </p>
                      </div>
                      <div className="text-right">
                        {parseInt(selectedDuration) > 1 && (
                          <div className="inline-block bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold mb-2">
                            Save ₹{(() => {
                              const duration = parseInt(selectedDuration);
                              if (selectedPlan === 'single') {
                                if (duration === 6) return '1,500';
                                if (duration === 12) return '6,000';
                                return '0';
                              } else {
                                if (duration === 6) return '2,000';
                                if (duration === 12) return '6,000';
                                return '0';
                              }
                            })()}
                          </div>
                        )}
                        <p className="text-xs text-gray-500">
                          {parseInt(selectedDuration) === 1 ? 'No discount' : 'Discounted price'}
                        </p>
                      </div>
                    </div>
                    
                    {/* Select This Plan Button */}
                    <div className="mt-4 text-center">
                      <Button
                        onClick={() => {
                          setShowPlanSelection(false);
                          // Update the planInfo to reflect the selected plan
                          const updatedPlanInfo = {
                            type: selectedPlan as 'single' | 'couple',
                            duration: selectedDuration,
                            price: (() => {
                              const duration = parseInt(selectedDuration);
                              if (selectedPlan === 'single') {
                                if (duration === 1) return 3000;
                                if (duration === 6) return 16500;
                                if (duration === 12) return 30000;
                                return 3000 * duration;
                              } else {
                                if (duration === 1) return 5000;
                                if (duration === 6) return 28000;
                                if (duration === 12) return 54000;
                                return 5000 * duration;
                              }
                            })()
                          };
                          // Store the selected plan in sessionStorage for persistence
                          sessionStorage.setItem('selectedPlanInfo', JSON.stringify(updatedPlanInfo));
                          
                          // Update the current plan info state
                          setCurrentPlanInfo(updatedPlanInfo);
                          
                          // Set the plan just selected state for visual feedback
                          setPlanJustSelected(true);
                          
                          // Show success toast
                          toast({
                            title: "Plan Selected! ✅",
                            description: `${selectedPlan === 'single' ? 'Single Parent' : 'Both Parents'} plan for ${selectedDuration} month${parseInt(selectedDuration) > 1 ? 's' : ''} has been selected.`,
                            duration: 3000,
                          });
                          
                          // Reset the success state after 3 seconds
                          setTimeout(() => {
                            setPlanJustSelected(false);
                          }, 3000);
                        }}
                        className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105"
                      >
                        Select This Plan
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Parent Navigation for Both Parents */}
        {selectedPlan === 'couple' && !showPlanSelection && (
          <div className="mb-6">
            <Card className="bg-emerald-50 border-emerald-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${currentParentIndex === 0 ? 'bg-emerald-600 text-white' : 'bg-white text-emerald-600 border border-emerald-300'}`}>
                      <User className="w-4 h-4" />
                      <span className="font-medium">Parent 1</span>
                    </div>
                    <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${currentParentIndex === 1 ? 'bg-emerald-600 text-white' : 'bg-white text-emerald-600 border border-emerald-300'}`}>
                      <User className="w-4 h-4" />
                      <span className="font-medium">Parent 2</span>
                    </div>
                  </div>
                  <div className="text-sm text-emerald-700">
                    {currentParentIndex === 0 ? 'Filling Parent 1' : 'Filling Parent 2'}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Essential Information - Mandatory Fields */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-emerald-700">
                <FileText className="w-5 h-5" />
                Essential Information *
              </CardTitle>
              <CardDescription>
                {selectedPlan === 'couple' && currentParentIndex === 0 
                  ? 'Required fields for Parent 1. Disclaimer will appear in Parent 2\'s section.'
                  : 'Required fields to complete your registration'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <Label htmlFor="pinCode">Pin Code *</Label>
                  <Input
                    id="pinCode"
                    value={currentFormData.pinCode}
                    onChange={(e) => handleInputChange('pinCode', e.target.value)}
                    placeholder="PIN Code"
                    className={currentErrors.pinCode ? 'border-red-500' : ''}
                  />
                  {currentErrors.pinCode && <p className="text-red-500 text-sm mt-1">{currentErrors.pinCode}</p>}
                </div>
                
                <div>
                  <Label htmlFor="selfCellNumber">Phone Number *</Label>
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
                  <Label htmlFor="emergencyContactNo">Emergency Contact Number *</Label>
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
                  <Label htmlFor="sex">Gender *</Label>
                  <Select value={currentFormData.sex} onValueChange={(value) => handleInputChange('sex', value)}>
                    <SelectTrigger className={currentErrors.sex ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                  {currentErrors.sex && <p className="text-red-500 text-sm mt-1">{currentErrors.sex}</p>}
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
              </div>
            </CardContent>
          </Card>

          {/* Additional Optional Fields - Single Collapsible Section */}
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
                      <Label htmlFor="emergencyNameAndRelation">Emergency Contact Name & Relation</Label>
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
                </div>

                {/* Personal Habits */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">Personal Habits</h3>
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
                </div>

                {/* Allergy History */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">Allergy History</h3>
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
                </div>

                {/* Past Medical History */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">Past Medical History</h3>
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
                  
                  <div className="mt-4">
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
                </div>

                {/* Current Medical History */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">Current Medical History</h3>
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
                </div>

                {/* Undergoing Treatment */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">Undergoing Treatment</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                </div>

                {/* Hospital Preferences - removed as per requirements */}

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
                        onChange={(e) => handleFileChange('photo', e.target.files[0])}
                        className="cursor-pointer"
                      />
                    </div>
                    {/* Aadhar Card number field removed as per requirements */}
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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
                      <div className="md:col-span-2">
                        <Label htmlFor="policyCard">Upload Policy Card</Label>
                        <Input
                          id="policyCard"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                          onChange={(e) => handleFileChange('policyCard', e.target.files[0])}
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

          {/* Disclaimer - Only show for Both Parents on Parent 2, or for Single Parent */}
          {(selectedPlan !== 'couple' || currentParentIndex === 1) && (
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
          )}

          {/* Form Submission Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {selectedPlan === 'couple' ? (
              // Both Parents: Show navigation buttons
              <>
                {currentParentIndex === 0 ? (
                  // Parent 1: Show "Move to Second Parent" button
                  <Button
                    type="button"
                    onClick={handleMoveToSecondParent}
                    className="px-8 py-4 text-lg font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                  >
                    Move to Second Parent
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                ) : (
                  // Parent 2: Show "Back to First Parent" and "Submit Both Parents" buttons
                  <>
                    <Button
                      type="button"
                      onClick={handleBackToFirstParent}
                      variant="outline"
                      className="px-8 py-4 text-lg font-semibold rounded-xl border-emerald-600 text-emerald-600 hover:bg-emerald-50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                    >
                      <ArrowLeftIcon className="w-5 h-5" />
                      Back to First Parent
                    </Button>
                    <Button
                      type="submit"
                      disabled={!parent2FormData.disclaimerAccepted || isSubmitting}
                      className={`px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 ${
                        parent2FormData.disclaimerAccepted && !isSubmitting
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:shadow-xl'
                          : 'bg-gray-400 text-gray-200 cursor-not-allowed shadow-lg'
                      }`}
                    >
                      {isSubmitting ? 'Processing Payment...' : 'Submit Both Parents'}
                    </Button>
                    {!parent2FormData.disclaimerAccepted && (
                      <p className="text-amber-600 text-sm mt-2 text-center">
                        Please accept the disclaimer above to submit both parents' information
                      </p>
                    )}
                  </>
                )}
              </>
            ) : (
              // Single Parent: Show regular submit button
              <>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="flex-shrink-0">
                      <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-blue-800 font-semibold">Payment Required</h4>
                      <p className="text-blue-700 text-sm">Your registration will be completed after successful payment. Your e-card will be generated once payment is confirmed.</p>
                    </div>
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={!formData.disclaimerAccepted}
                  className={`px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 ${
                    formData.disclaimerAccepted
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:shadow-xl'
                      : 'bg-gray-400 text-gray-200 cursor-not-allowed shadow-lg'
                  }`}
                >
                  Make Payment
                </Button>
                {!formData.disclaimerAccepted && (
                  <p className="text-amber-600 text-sm mt-2 text-center">
                    Please accept the disclaimer above to proceed with payment
                  </p>
                )}
              </>
            )}
          </div>
        </form>
      </div>
      <Toaster />
    </div>
  );
};

export default Register;
