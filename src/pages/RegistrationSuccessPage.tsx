import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { ECard } from '../components/ECard'
import { CheckCircle, Home, ArrowLeft } from 'lucide-react'

interface RegistrationSuccessData {
  patients: Array<{
    seniorCareId: string
    name: string
    dateOfBirth: string
    sex: string
    phoneNumber: string
  }>
  planType: 'single' | 'couple'
  duration: string
  price: number
}

export function RegistrationSuccessPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const registrationData = location.state?.registrationData as RegistrationSuccessData

  // Debug logging
  console.log('🔍 RegistrationSuccessPage location.state:', location.state);
  console.log('🔍 RegistrationSuccessPage registrationData:', registrationData);

  if (!registrationData) {
    // Redirect to home if no registration data
    navigate('/')
    return null
  }

  const { 
    patients = [], 
    planType = 'single', 
    duration = '12', 
    price = 0 
  } = registrationData

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-50 py-8">
      <div className="max-w-6xl mx-auto p-6">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-emerald-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Registration Successful! 🎉
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            Welcome to SeniorCare Plus Family
          </p>
          <div className="bg-emerald-100 inline-block px-6 py-2 rounded-full">
            <p className="text-emerald-800 font-semibold">
              {planType === 'single' ? 'Single Parent' : 'Both Parents'} Plan - {duration} Month{parseInt(duration || '6') > 1 ? 's' : ''} | ₹{Number(price || 0).toLocaleString()}
            </p>
          </div>
        </div>

        {/* E-Cards Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Your Healthcare E-Card{patients.length > 1 ? 's' : ''}
          </h2>
          
          <div className={`grid gap-8 ${patients.length > 1 ? 'md:grid-cols-2' : 'justify-center'}`}>
            {patients.map((patient, index) => (
              <div key={patient.seniorCareId} className="flex flex-col items-center">
                {patients.length > 1 && (
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">
                    Parent {index + 1}
                  </h3>
                )}
                <ECard patient={patient} />
              </div>
            ))}
          </div>
        </div>

        {/* Important Instructions */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-emerald-100">
          <h3 className="text-xl font-bold text-emerald-700 mb-4 text-center">
            Important Information
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">🔐 Login Credentials</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Use your <strong>Senior Care ID</strong> or <strong>Phone Number</strong></li>
                <li>• Along with your <strong>Date of Birth</strong></li>
                <li>• Keep your E-card safe for easy reference</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">📱 What's Next?</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Download or share your E-card</li>
                <li>• Login to access your dashboard</li>
                <li>• Schedule your first consultation</li>
                <li>• 24/7 emergency support available</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-emerald-50 rounded-xl p-6 mb-8 border border-emerald-200">
          <h3 className="text-lg font-bold text-emerald-800 mb-3 text-center">
            Need Help? We're Here 24/7
          </h3>
          <div className="grid md:grid-cols-3 gap-4 text-center">
            <div>
              <p className="font-semibold text-emerald-700">Emergency Helpline</p>
              <p className="text-emerald-600">1800-XXX-XXXX</p>
            </div>
            <div>
              <p className="font-semibold text-emerald-700">Email Support</p>
              <p className="text-emerald-600">support@seniorcareplus.com</p>
            </div>
            <div>
              <p className="font-semibold text-emerald-700">WhatsApp</p>
              <p className="text-emerald-600">+91-XXXXX-XXXXX</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => navigate('/login')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 text-lg font-semibold rounded-xl"
          >
            Login to Dashboard
          </Button>
          
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            className="border-emerald-300 text-emerald-700 hover:bg-emerald-50 px-8 py-3 text-lg font-semibold rounded-xl"
          >
            <Home className="mr-2 h-5 w-5" />
            Back to Home
          </Button>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Your registration details have been saved securely. You can always access your E-card from your dashboard.
          </p>
        </div>
      </div>
    </div>
  )
}