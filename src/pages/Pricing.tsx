import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { 
  Check, 
  Star, 
  Phone, 
  Heart, 
  Shield, 
  Clock, 
  Users, 
  Stethoscope,
  Building2,
  Ambulance,
  HeartHandshake,
  Calendar,
  User
} from 'lucide-react'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'

export function Pricing() {
  const [selectedPlan, setSelectedPlan] = useState<'single' | 'couple'>('single')
  const [selectedDuration, setSelectedDuration] = useState<6 | 12>(6)

  const planFeatures = {
    single: {
      title: "1 senior citizen",
      subtitle: "Comprehensive healthcare coordination for one parent",
      icon: User,
      baseFeatures: [
        "24/7 Emergency Support",
        "Dedicated Care Coordinator",
        "Hospital Selection Assistance",
        "Pre-Admission Paperwork Support",
        "Insurance Verification",
        "Appointment Scheduling",
        "Medical Record Management",
        "Discharge Planning",
        "Follow-up Care Coordination",
        "Medication Management Support"
      ],
      premiumFeatures: [
        "Priority Emergency Response",
        "Specialist Doctor Referrals",
        "Second Opinion Coordination",
        "Home Healthcare Arrangements",
        "Ambulance Support (Free pickup)",
        "Family Communication Updates"
      ]
    },
    couple: {
      title: "2 senior citizens",
      subtitle: "Complete healthcare coordination for both parents",
      icon: Users,
      baseFeatures: [
        "24/7 Emergency Support for Both",
        "Dual Care Coordinators",
        "Hospital Selection for Multiple Conditions",
        "Coordinated Pre-Admission for Both",
        "Insurance Verification & Claims",
        "Synchronized Appointment Scheduling",
        "Comprehensive Medical Records",
        "Joint Discharge Planning",
        "Coordinated Follow-up Care",
        "Dual Medication Management"
      ],
      premiumFeatures: [
        "Priority Emergency for Both Parents",
        "Multiple Specialist Coordination",
        "Coordinated Second Opinions",
        "Home Healthcare for Both",
        "Dual Ambulance Support",
        "Family Meeting Coordination",
        "Caregiver Training & Support",
        "Health Monitoring for Both"
      ]
    }
  }

  const getPricing = (plan: 'single' | 'couple', duration: 6 | 12) => {
    const prices = {
      single: { 6: 18000, 12: 30000 },
      couple: { 6: 30000, 12: 54000 }
    }
    return prices[plan][duration]
  }

  const getOriginalPrice = (plan: 'single' | 'couple', duration: 6 | 12) => {
    // Show higher "original" prices to demonstrate value
    const originalPrices = {
      single: { 6: 40000, 12: 75000 },
      couple: { 6: 80000, 12: 150000 }
    }
    return originalPrices[plan][duration]
  }

  const getSavings = (plan: 'single' | 'couple') => {
    const originalYearlyPrice = getOriginalPrice(plan, 12)
    const actualYearlyPrice = getPricing(plan, 12)
    return originalYearlyPrice - actualYearlyPrice
  }

  const services = [
    {
      icon: Heart,
      title: "Pre-Hospitalization",
      features: ["Doctor Consultations", "Hospitalization Advice", "Hospital Selection", "Insurance Planning"]
    },
    {
      icon: Building2,
      title: "During Hospitalization",
      features: ["Smooth Admission", "In-Hospital Support", "Family Communication", "Insurance Assistance"]
    },
    {
      icon: HeartHandshake,
      title: "Post-Hospitalization",
      features: ["Discharge Planning", "Home Care Setup", "Follow-up Coordination", "Recovery Monitoring"]
    },
    {
      icon: Phone,
      title: "24/7 Emergency",
      features: ["Emergency Hotline", "Immediate Response", "Ambulance Coordination", "Crisis Management"]
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Header */}
      <div className="bg-white shadow-sm pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Choose Your Care Plan
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive healthcare coordination and concierge services designed specifically for senior care needs
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Plan Type Selector */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-100 p-1 rounded-lg flex">
            <button
              onClick={() => setSelectedPlan('single')}
              className={`px-6 py-3 rounded-md font-medium transition-all ${
                selectedPlan === 'single'
                  ? 'bg-white text-emerald-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Single Parent
            </button>
            <button
              onClick={() => setSelectedPlan('couple')}
              className={`px-6 py-3 rounded-md font-medium transition-all ${
                selectedPlan === 'couple'
                  ? 'bg-white text-emerald-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Both Parents
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* 6 Month Plan */}
          <Card className="relative">
            <CardHeader className="text-center pb-6">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                {React.createElement(planFeatures[selectedPlan].icon, { 
                  className: "w-6 h-6 text-emerald-600" 
                })}
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                6 Months
              </CardTitle>
              <CardDescription className="text-lg text-gray-600">
                {selectedPlan === 'single' ? '+2 family members (below 60 years)*' : '+4 family members (below 60 years)*'}
              </CardDescription>
              <div className="mt-4">
                <div className="mb-2">
                  <span className="text-2xl font-bold text-gray-400 line-through">
                    ₹{getOriginalPrice(selectedPlan, 6).toLocaleString()}
                  </span>
                </div>
                <div className="text-4xl font-bold text-gray-900">
                  ₹{getPricing(selectedPlan, 6).toLocaleString()}
                </div>
                <div className="text-sm text-emerald-600 font-medium mt-1">
                  Save ₹{(getOriginalPrice(selectedPlan, 6) - getPricing(selectedPlan, 6)).toLocaleString()}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <Button 
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                onClick={() => setSelectedDuration(6)}
              >
                <Link to="/register" className="w-full">
                  Get Started - 6 Months
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* 12 Month Plan */}
          <Card className="relative border-emerald-200 shadow-lg">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-emerald-600 text-white px-4 py-1">
                <Star className="w-4 h-4 mr-1" />
                Most Popular
              </Badge>
            </div>
            <CardHeader className="text-center pb-6">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                {React.createElement(planFeatures[selectedPlan].icon, { 
                  className: "w-6 h-6 text-emerald-600" 
                })}
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                12 Months
              </CardTitle>
              <CardDescription className="text-lg text-gray-600">
                {selectedPlan === 'single' ? '+2 family members (below 60 years)*' : '+4 family members (below 60 years)*'}
              </CardDescription>
              <div className="mt-4">
                <div className="mb-2">
                  <span className="text-2xl font-bold text-gray-400 line-through">
                    ₹{getOriginalPrice(selectedPlan, 12).toLocaleString()}
                  </span>
                </div>
                <div className="text-4xl font-bold text-gray-900">
                  ₹{getPricing(selectedPlan, 12).toLocaleString()}
                </div>
                <div className="text-sm text-emerald-600 font-medium mt-1">
                  Save ₹{getSavings(selectedPlan).toLocaleString()} annually
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <Button 
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                onClick={() => setSelectedDuration(12)}
              >
                <Link to="/register" className="w-full">
                  Get Started - 12 Months
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Services Overview */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Complete Healthcare Journey Support
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive care coordination covers every stage of your healthcare journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <service.icon className="w-6 h-6 text-emerald-600" />
                  </div>
                  <CardTitle className="text-lg">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {service.features.map((feature, fIndex) => (
                      <li key={fIndex} className="text-sm text-gray-600">
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Comparison Table */}
        {/* <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Plan Comparison
            </h2>
            <p className="text-lg text-gray-600">
              Choose the plan that best fits your family's needs
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Features</th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-900">Single Parent</th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-900">Couple Care</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">24/7 Emergency Support</td>
                    <td className="px-6 py-4 text-center">
                      <Check className="w-5 h-5 text-emerald-600 mx-auto" />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Check className="w-5 h-5 text-emerald-600 mx-auto" />
                    </td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">Dedicated Care Coordinators</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">1 Coordinator</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">2 Coordinators</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">Hospital Selection & Admission</td>
                    <td className="px-6 py-4 text-center">
                      <Check className="w-5 h-5 text-emerald-600 mx-auto" />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Check className="w-5 h-5 text-emerald-600 mx-auto" />
                    </td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">Insurance Verification & Claims</td>
                    <td className="px-6 py-4 text-center">
                      <Check className="w-5 h-5 text-emerald-600 mx-auto" />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Check className="w-5 h-5 text-emerald-600 mx-auto" />
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">Ambulance Support (Free pickup)</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">12-month plan</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">Both plans</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">Family Communication Updates</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">Basic updates</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">Comprehensive updates</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">6-Month Plan Price</td>
                    <td className="px-6 py-4 text-center text-sm font-medium text-gray-900">₹18,000</td>
                    <td className="px-6 py-4 text-center text-sm font-medium text-gray-900">₹30,000</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">12-Month Plan Price</td>
                    <td className="px-6 py-4 text-center text-sm font-medium text-gray-900">₹30,000</td>
                    <td className="px-6 py-4 text-center text-sm font-medium text-gray-900">₹54,000</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div> */}

        {/* Why Choose Us */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose SeniorCare Plus?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Trusted Experience</h3>
              <p className="text-gray-600">
                Years of experience in healthcare coordination with a track record of successful patient outcomes
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">24/7 Availability</h3>
              <p className="text-gray-600">
                Round-the-clock support ensures help is always available when you need it most
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Stethoscope className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Medical Expertise</h3>
              <p className="text-gray-600">
                Our team includes healthcare professionals who understand the medical system inside and out
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-emerald-50 rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of families who trust SeniorCare Plus for their healthcare coordination needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700">
              <Link to="/register">
                Start Your Care Plan
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
              <Link to="/contact">
                Talk to Our Team
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Pricing