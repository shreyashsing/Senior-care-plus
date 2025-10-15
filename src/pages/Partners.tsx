import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Search, 
  Building2, 
  Stethoscope, 
  Filter,
  Loader2,
  Heart
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { HospitalPartnerService } from '@/lib/hospitalPartnerService'
import Navbar from '@/components/Navbar'

// Simplified partner interface for public display
interface PublicPartner {
  id: string;
  name: string;
  category: string;
  services: Array<{
    service: string;
    discount: number;
  }>;
}

const Partners: React.FC = () => {
  const navigate = useNavigate()
  const [partners, setPartners] = useState<PublicPartner[]>([])
  const [filteredPartners, setFilteredPartners] = useState<PublicPartner[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCity, setSelectedCity] = useState<string>('')
  const [uniqueCities, setUniqueCities] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load partners on component mount
  useEffect(() => {
    loadPartners()
    loadCities()
  }, [])

  // Apply filters whenever partners, search term, or city changes
  useEffect(() => {
    applyFilters()
  }, [partners, searchTerm, selectedCity])

  const loadPartners = async () => {
    try {
      setIsLoading(true)
      console.log('Starting to load partners...')
      
      // Use the simplified public method
      const data = await HospitalPartnerService.getPublicHospitalPartners()
      
      console.log('Partners data received:', data)
      console.log('Number of partners:', data?.length || 0)
      setPartners(data)
    } catch (err) {
      console.error('Error loading partners:', err)
      setError('Failed to load partners. Please try again later.')
    } finally {
      console.log('Setting loading to false')
      setIsLoading(false)
    }
  }

  const loadCities = async () => {
    try {
      // Extract cities from loaded partners
      const cities = [...new Set(partners.map(partner => partner.name.split(' ')[0]))] // Temporary fix
      setUniqueCities(['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Pune']) // Mock cities for now
    } catch (err) {
      console.error('Error loading cities:', err)
    }
  }

  const applyFilters = () => {
    let filtered = [...partners]

    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase()
      filtered = filtered.filter(partner =>
        partner.name.toLowerCase().includes(search) ||
        partner.category.toLowerCase().includes(search)
      )
    }

    // Apply city filter (mock implementation)
    if (selectedCity && selectedCity !== 'all') {
      // For now, just keep all partners since we don't have city data
      // In real implementation, you'd filter by partner.city === selectedCity
    }

    setFilteredPartners(filtered)
  }

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 pt-16 md:pt-20">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-center h-64">
              <div className="flex items-center gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                <span className="text-gray-600">Loading our partners...</span>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 pt-16 md:pt-20">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Unable to Load Partners</h2>
              <p className="text-gray-600">{error}</p>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 pt-16 md:pt-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-800 to-green-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <Heart className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Healthcare Partners</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Discover our network of trusted hospitals and clinics providing quality healthcare services 
              with exclusive discounts for our members.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filter Section */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search hospitals, clinics, or categories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              {/* City Filter */}
              {/* <div className="w-full md:w-64">
                <Select value={selectedCity} onValueChange={setSelectedCity}>
                  <SelectTrigger>
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Filter by City" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Cities</SelectItem>
                    {uniqueCities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div> */}
            </div>
          </CardContent>
        </Card>

        {/* Partners Table */}
        {filteredPartners.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Partners Found</h3>
              <p className="text-gray-600">
                {searchTerm ? 
                  'No partners match your current search criteria. Try adjusting your search.' :
                  'No partners are currently available.'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-3 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200 font-semibold text-gray-700">
              <div>Name</div>
              <div>Category</div>
              <div>Services</div>
            </div>
            
            {/* Table Rows */}
            <div className="divide-y divide-gray-200">
              {filteredPartners.map((partner) => {
                return (
                  <div key={partner.id} className="grid grid-cols-3 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors items-start">
                    {/* Name Column */}
                    <div>
                      <h4 className="text-gray-900 font-medium">
                        {partner.name}
                      </h4>
                    </div>

                    {/* Category Column */}
                    <div>
                      <Badge variant="outline" className="text-blue-600 border-blue-600">
                        <Stethoscope className="w-3 h-3 mr-1" />
                        {partner.category}
                      </Badge>
                    </div>

                    {/* Services Column */}
                    <div>
                      <div className="flex flex-wrap gap-2">
                        {partner.services.map((service, index) => (
                          <div key={index} className="flex items-center gap-1">
                            <span className={`text-sm font-medium px-3 py-1 border rounded-full transition-colors ${
                              service.discount > 0 
                                ? 'text-green-700 border-green-300 bg-green-50 hover:bg-green-100' 
                                : 'text-gray-700 border-gray-300 bg-white hover:bg-gray-50'
                            }`}>
                              {service.service}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
      </div>

      {/* Modern Footer Section */}
      <footer className="relative bg-gradient-to-br from-gray-900 via-emerald-900 to-gray-900 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="relative z-10">
          {/* Main Footer Content */}
          <div className="w-[96%] md:w-[92%] lg:w-[88%] xl:w-[84%] mx-auto py-16 md:py-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              {/* Company Info */}
              <div>
                <div className="mb-6">
                  <img 
                    src="/final_logo.svg" 
                    alt="Senior Care Logo" 
                    className="w-16 h-16 md:w-20 md:h-20"
                  />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white">
                  SeniorCare+
                </h3>
                <p className="text-gray-300 text-lg leading-relaxed mb-6 max-w-md">
                  Providing trusted senior care services that bring peace of mind to families, 
                  ensuring your loved ones receive the care they deserve.
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center hover:bg-emerald-500 transition-colors duration-300">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                    </svg>
                  </div>
                  <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center hover:bg-emerald-500 transition-colors duration-300">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                    </svg>
                  </div>
                  <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center hover:bg-emerald-500 transition-colors duration-300">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Services */}
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

            {/* Divider */}
            <div className="border-t border-gray-700 mt-12 pt-8">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                {/* Copyright */}
                <div className="text-gray-400 text-sm">
                  © 2025 SeniorCare+. All rights reserved.
                </div>
                
                {/* Additional Links */}
                <div className="flex items-center gap-6 text-sm">
                  <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors duration-300">
                    Privacy Policy
                  </a>
                  <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors duration-300">
                    Terms of Service
                  </a>
                  <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors duration-300">
                    Cookie Policy
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

export default Partners