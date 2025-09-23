import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  Send,
  CheckCircle,
  Heart,
  MessageSquare,
  Users,
  Shield,
  Loader2
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { ContactService, type CreateContact } from '@/lib/contactServiceNew'
import Navbar from '@/components/Navbar'

const Contact: React.FC = () => {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState<CreateContact>({
    name: '',
    email: '',
    phone: '',
    message: ''
  })

  const [formErrors, setFormErrors] = useState<Partial<CreateContact>>({})

  const validateForm = (): boolean => {
    const errors: Partial<CreateContact> = {}

    if (!formData.name.trim()) {
      errors.name = 'Name is required'
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email'
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required'
    } else if (!/^\+?[\d\s\-\(\)]{10,}$/.test(formData.phone)) {
      errors.phone = 'Please enter a valid phone number'
    }

    if (!formData.message.trim()) {
      errors.message = 'Message is required'
    } else if (formData.message.trim().length < 10) {
      errors.message = 'Message must be at least 10 characters'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleInputChange = (field: keyof CreateContact, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      console.log('🚀 Starting form submission...')
      console.log('📝 Form data:', formData)
      
      // Test connection first
      console.log('🔌 Testing Supabase connection...')
      const connectionTest = await ContactService.testConnection()
      console.log('🔌 Connection test result:', connectionTest)
      
      if (!connectionTest) {
        throw new Error('Database connection failed')
      }

      // Skip permission test for now and try direct insert
      console.log('⚠️ Skipping permission test, trying direct insert...')
      
      console.log('💾 Creating contact...')
      const result = await ContactService.createContact(formData)
      console.log('✅ Contact created successfully:', result)
      
      setIsSubmitted(true)
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: ''
      })
    } catch (err) {
      console.error('❌ Error submitting contact form:', err)
      
      // More detailed error handling
      if (err instanceof Error) {
        if (err.message.includes('new row violates row-level security')) {
          setError('Database security error. Please try again or contact support.')
        } else if (err.message.includes('Failed to create contact')) {
          setError('Failed to submit your message. Please check your internet connection and try again.')
        } else {
          setError(`Submission failed: ${err.message}`)
        }
      } else {
        setError('An unexpected error occurred. Please try again later.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <>
        {/* Navbar */}
        <Navbar />

        <div className="min-h-screen bg-gray-50 pt-16 md:pt-20">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-2xl mx-auto text-center">
              <div className="mb-8">
                <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-6" />
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  Thank You!
                </h1>
                <p className="text-xl text-gray-600 mb-6">
                  Your message has been sent successfully. Our team will reach out to you within 24 hours.
                </p>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
                <div className="flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-green-600 mr-2" />
                  <span className="text-green-800 font-medium">Expected Response Time</span>
                </div>
                <p className="text-green-700">
                  Our support team will contact you within 24 hours during business days.
                  For urgent matters, please call us directly.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => setIsSubmitted(false)}
                  variant="outline"
                  className="px-6 py-2"
                >
                  Send Another Message
                </Button>
                <Button
                  onClick={() => navigate('/')}
                  className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-6 py-2"
                >
                  Return to Home
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="relative bg-gradient-to-br from-gray-900 via-emerald-900 to-gray-900 text-white overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}></div>
          </div>

          <div className="relative z-10">
            <div className="w-[96%] md:w-[92%] lg:w-[88%] xl:w-[84%] mx-auto py-16 md:py-20">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                <div>
                  <div className="mb-6">
                    <img 
                      src="/logo.svg" 
                      alt="Senior Care Logo" 
                      className="w-16 h-16 md:w-20 md:h-20"
                    />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white">
                    Senior Care Plus
                  </h3>
                  <p className="text-gray-300 text-lg leading-relaxed mb-6 max-w-md">
                    Providing trusted senior care services that bring peace of mind to families, 
                    ensuring your loved ones receive the care they deserve.
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-semibold mb-6 text-white">Our Services</h4>
                  <ul className="space-y-3">
                    {[
                      'Online Consultations',
                      'Home Care Services',
                      'Hospital Coordination',
                      'Emergency Support',
                      'Medical Equipment'
                    ].map((service, idx) => (
                      <li key={idx}>
                        <span className="text-gray-300 hover:text-emerald-400 transition-colors duration-300 flex items-center gap-2 group cursor-pointer">
                          <span className="w-1 h-1 bg-emerald-400 rounded-full group-hover:scale-150 transition-transform duration-300"></span>
                          {service}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="border-t border-gray-700 mt-12 pt-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="text-gray-400 text-sm">
                    © 2025 Senior Care Plus. All rights reserved.
                  </div>
                  
                  <div className="flex items-center gap-6 text-sm">
                    <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors duration-300">
                      Privacy Policy
                    </a>
                    <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors duration-300">
                      Terms of Service
                    </a>
                    <button 
                      onClick={() => navigate('/admin/login')}
                      className="text-gray-400 hover:text-emerald-400 transition-colors duration-300"
                    >
                      Admin Portal
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </>
    )
  }

  return (
    <>
      {/* Navbar */}
      <Navbar />

      <div className="min-h-screen bg-gray-50 pt-16 md:pt-20">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-emerald-600 to-green-600 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <MessageSquare className="w-16 h-16 mx-auto mb-4" />
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
              <p className="text-xl text-emerald-100 max-w-3xl mx-auto">
                Get in touch with our team. We're here to help and answer any questions you might have.
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Information */}
            <div className="lg:col-span-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>
              <p className="text-gray-600 mb-8">
                We're always ready to help. Reach out to us through any of the following methods.
              </p>

              <div className="space-y-6">
                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                    <p className="text-gray-600">contact@seniorcareplus.in</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
                    <p className="text-gray-600">+91 9975567202</p>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Office</h3>
                    <p className="text-gray-600">
                      414 Atlanta Shoppers<br />
                      Beside Reliance Market Vesu<br />
                      Surat 395007
                    </p>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Business Hours</h3>
                    <p className="text-gray-600">
                      Mon-Fri, 9 AM - 6 PM IST
                    </p>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="mt-12 p-6 bg-gradient-to-br from-emerald-50 to-green-50 rounded-lg border border-emerald-200">
                <h3 className="font-semibold text-gray-900 mb-4">Why Choose Us?</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-emerald-600" />
                    <span className="text-sm text-gray-700">Expert care team</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-emerald-600" />
                    <span className="text-sm text-gray-700">24/7 support available</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Heart className="w-5 h-5 text-emerald-600" />
                    <span className="text-sm text-gray-700">Compassionate service</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Send us a Message</CardTitle>
                  <p className="text-gray-600">Fill out the form below and we'll get back to you within 24 hours.</p>
                </CardHeader>
                <CardContent>
                  {error && (
                    <Alert className="mb-6 border-red-200 bg-red-50">
                      <AlertDescription className="text-red-800">
                        {error}
                      </AlertDescription>
                    </Alert>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Name */}
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <Input
                          id="name"
                          type="text"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          placeholder="Enter your full name"
                          className={formErrors.name ? 'border-red-500' : ''}
                        />
                        {formErrors.name && (
                          <p className="text-sm text-red-600 mt-1">{formErrors.name}</p>
                        )}
                      </div>

                      {/* Email */}
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="Enter your email"
                          className={formErrors.email ? 'border-red-500' : ''}
                        />
                        {formErrors.email && (
                          <p className="text-sm text-red-600 mt-1">{formErrors.email}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Phone */}
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number *
                        </label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          placeholder="Enter your phone number"
                          className={formErrors.phone ? 'border-red-500' : ''}
                        />
                        {formErrors.phone && (
                          <p className="text-sm text-red-600 mt-1">{formErrors.phone}</p>
                        )}
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                        Message *
                      </label>
                      <Textarea
                        id="message"
                        rows={6}
                        value={formData.message}
                        onChange={(e) => handleInputChange('message', e.target.value)}
                        placeholder="Tell us how we can help you..."
                        className={formErrors.message ? 'border-red-500' : ''}
                      />
                      {formErrors.message && (
                        <p className="text-sm text-red-600 mt-1">{formErrors.message}</p>
                      )}
                      <p className="text-sm text-gray-500 mt-1">
                        Minimum 10 characters ({formData.message.length}/10)
                      </p>
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white py-3"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Sending Message...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>

                  {/* Response Time Notice */}
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-5 h-5 text-blue-600" />
                      <span className="font-medium text-blue-800">Response Time</span>
                    </div>
                    <p className="text-blue-700 text-sm">
                      We typically respond to all inquiries within 24 hours during business days. 
                      For urgent matters, please call us directly.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative bg-gradient-to-br from-gray-900 via-emerald-900 to-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="relative z-10">
          <div className="w-[96%] md:w-[92%] lg:w-[88%] xl:w-[84%] mx-auto py-16 md:py-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              <div>
                <div className="mb-6">
                  <img 
                    src="/logo.svg" 
                    alt="Senior Care Logo" 
                    className="w-16 h-16 md:w-20 md:h-20"
                  />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white">
                  Senior Care Plus
                </h3>
                <p className="text-gray-300 text-lg leading-relaxed mb-6 max-w-md">
                  Providing trusted senior care services that bring peace of mind to families, 
                  ensuring your loved ones receive the care they deserve.
                </p>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-6 text-white">Our Services</h4>
                <ul className="space-y-3">
                  {[
                    'Online Consultations',
                    'Home Care Services',
                    'Hospital Coordination',
                    'Emergency Support',
                    'Medical Equipment'
                  ].map((service, idx) => (
                    <li key={idx}>
                      <span className="text-gray-300 hover:text-emerald-400 transition-colors duration-300 flex items-center gap-2 group cursor-pointer">
                        <span className="w-1 h-1 bg-emerald-400 rounded-full group-hover:scale-150 transition-transform duration-300"></span>
                        {service}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-700 mt-12 pt-8">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-gray-400 text-sm">
                  © 2025 Senior Care Plus. All rights reserved.
                </div>
                
                <div className="flex items-center gap-6 text-sm">
                  <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors duration-300">
                    Privacy Policy
                  </a>
                  <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors duration-300">
                    Terms of Service
                  </a>
                  <button 
                    onClick={() => navigate('/admin/login')}
                    className="text-gray-400 hover:text-emerald-400 transition-colors duration-300"
                  >
                    Admin Portal
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}

export default Contact