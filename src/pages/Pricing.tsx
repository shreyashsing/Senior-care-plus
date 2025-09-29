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
  const [selectedDuration, setSelectedDuration] = useState<6 | 12>(6)

  // New pricing structure based on the provided image
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
  }

  // Benefits for each plan based on the image
  const planBenefits = {
    basic: [
      { feature: "Eye check up", value: "1" },
      { feature: "Dental check up", value: "1" },
      { feature: "Health check up", value: "35+ parameters" },
      { feature: "Dietician Sessions", value: "0" },
      { feature: "Physiotherapy Sessions", value: "0" },
      { feature: "Yoga (Months)", value: "0" },
      { feature: "Doctor on Call 24x7", value: "yes" },
      { feature: "Wellness Sessions", value: "0" },
      { feature: "Hospital Discounts upto 25%", value: "yes" }
    ],
    advance: [
      { feature: "Eye check up", value: "3" },
      { feature: "Dental check up", value: "3" },
      { feature: "Health check up", value: "50+ parameters" },
      { feature: "Dietician Sessions", value: "1" },
      { feature: "Physiotherapy Sessions", value: "1" },
      { feature: "Yoga (Months)", value: "0" },
      { feature: "Doctor on Call 24x7", value: "yes" },
      { feature: "Wellness Sessions", value: "0" },
      { feature: "Hospital Discounts upto 25%", value: "yes" }
    ],
    premium: [
      { feature: "Eye check up", value: "3" },
      { feature: "Dental check up", value: "3" },
      { feature: "Health check up", value: "70+ parameters" },
      { feature: "Dietician Sessions", value: "6" },
      { feature: "Physiotherapy Sessions", value: "7" },
      { feature: "Yoga (Months)", value: "6" },
      { feature: "Doctor on Call 24x7", value: "yes" },
      { feature: "Wellness Sessions", value: "6" },
      { feature: "Hospital Discounts upto 25%", value: "yes" }
    ]
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
        
        {/* Duration Toggle */}
        <div className="flex justify-center mb-12">
          <div className="bg-gray-100 p-1 rounded-lg flex">
            <button
              onClick={() => setSelectedDuration(6)}
              className={`px-8 py-3 rounded-md font-medium transition-all duration-300 ${
                selectedDuration === 6
                  ? 'bg-white text-emerald-600 shadow-md transform scale-105'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              6 Months
            </button>
            <button
              onClick={() => setSelectedDuration(12)}
              className={`px-8 py-3 rounded-md font-medium transition-all duration-300 ${
                selectedDuration === 12
                  ? 'bg-white text-emerald-600 shadow-md transform scale-105'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              12 Months
            </button>
          </div>
        </div>

        {/* Subtitle */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Primary Member + 2 Co-Member
          </h2>
          <p className="text-gray-600">
            {selectedDuration === 6 ? 'Six month' : 'Year'} (Rs)
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Basic Plan */}
          <Card className="relative transition-all duration-300 hover:shadow-lg">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                Basic
              </CardTitle>
              <div className="text-4xl font-bold text-emerald-600 mb-2">
                ₹{pricingPlans[selectedDuration].basic.price.toLocaleString()}/-
              </div>
              <CardDescription className="text-gray-600">
                Essential healthcare support
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Link to="/register">
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 mb-6">
                  Choose Basic
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Advance Plan */}
          <Card className="relative border-emerald-200 shadow-lg transition-all duration-300 hover:shadow-xl">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-emerald-600 text-white px-4 py-1">
                <Star className="w-4 h-4 mr-1" />
                Popular
              </Badge>
            </div>
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                Advance
              </CardTitle>
              <div className="text-4xl font-bold text-emerald-600 mb-2">
                ₹{pricingPlans[selectedDuration].advance.price.toLocaleString()}/-
              </div>
              <CardDescription className="text-gray-600">
                Enhanced care with additional services
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Link to="/register">
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 mb-6">
                  Choose Advance
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Premium Plan */}
          <Card className="relative transition-all duration-300 hover:shadow-lg">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                Premium
              </CardTitle>
              <div className="text-4xl font-bold text-emerald-600 mb-2">
                ₹{pricingPlans[selectedDuration].premium.price.toLocaleString()}/-
              </div>
              <CardDescription className="text-gray-600">
                Complete comprehensive care
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Link to="/register">
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 mb-6">
                  Choose Premium
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Extra Discount Notice */}
        <div className="text-center mb-12">
          <div className="inline-block bg-yellow-100 border border-yellow-200 rounded-lg px-6 py-3">
            <p className="text-yellow-800 font-medium">
              Extra Discount for Initial 100 members
            </p>
          </div>
        </div>
        {/* Benefits Comparison Table */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Benefits (in {selectedDuration} months)
            </h2>
            <p className="text-lg text-gray-600">
              Compare what's included in each plan
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 uppercase tracking-wider">
                      Features
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-900 uppercase tracking-wider">
                      Basic
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-900 uppercase tracking-wider bg-emerald-50">
                      Advanced
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-900 uppercase tracking-wider">
                      Premium
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {planBenefits.basic.map((benefit, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {benefit.feature}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                        {planBenefits.basic[index].value}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center bg-emerald-50">
                        <span className="font-medium text-emerald-600">
                          {planBenefits.advance[index].value}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                        <span className="font-medium text-purple-600">
                          {planBenefits.premium[index].value}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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