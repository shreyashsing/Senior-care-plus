import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Heart, Phone, Download, BookOpen, Users, MapPin, Shield, Clock, 
  Stethoscope, Home, HeartHandshake, UserCheck, Star, Target, 
  Lightbulb, Compass, Award, Zap, Globe, HandHeart, UserPlus,
  CheckCircle, ArrowRight, Mail, MessageCircle, Calendar
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AboutUs = () => {
  const navigate = useNavigate();
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      setScrollProgress(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Semi-transparent Navbar - same as home page */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-md border-b border-white/20 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <div className="flex items-center">
              <img
                src="/logo.svg"
                alt="Senior Care Logo"
                className="w-10 h-10 md:w-12 md:h-12"
              />
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => navigate('/')}
                className="text-gray-800 hover:text-emerald-600 transition-colors duration-300 font-medium text-shadow-sm shadow-white/80"
              >
                Home
              </button>
              <button
                onClick={() => navigate('/about')}
                className="text-emerald-600 transition-colors duration-300 font-medium text-shadow-sm shadow-white/80"
              >
                About Us
              </button>
              <a
                href="/#services"
                className="text-gray-800 hover:text-emerald-600 transition-colors duration-300 font-medium text-shadow-sm shadow-white/80"
              >
                Services
              </a>
              <a
                href="/#how-it-works"
                className="text-gray-800 hover:text-emerald-600 transition-colors duration-300 font-medium text-shadow-sm shadow-white/80"
              >
                How It Works
              </a>
              <a
                href="/#pricing"
                className="text-gray-800 hover:text-emerald-600 transition-colors duration-300 font-medium text-shadow-sm shadow-white/80"
              >
                Pricing
              </a>
              <Button
                onClick={() => navigate('/login')}
                className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-6 py-2 rounded-full font-semibold transition-all duration-300 hover:scale-105"
              >
                Login
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50">
        {/* Progress Bar */}
        <div className="fixed top-0 left-0 h-1 bg-gradient-to-r from-emerald-500 to-green-500 z-50 transition-all duration-300"
             style={{ width: `${scrollProgress}%` }}></div>

        {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 bg-emerald-100 border border-emerald-300 rounded-full text-emerald-800 text-sm font-semibold mb-6">
            <Heart className="w-4 h-4 mr-2" />
            About Us
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
              SeniorCare Plus
            </span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-gray-700 mb-12 max-w-4xl mx-auto leading-relaxed">
            Because love shouldn't be limited by distance.
          </p>

          {/* Decorative Line */}
          <div className="w-32 h-1 bg-gradient-to-r from-emerald-500 to-green-500 mx-auto mb-16 rounded-full"></div>
        </div>
      </section>

      {/* Promise Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center mr-4">
                  <HandHeart className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                  A Promise Born from Real Life
                </h2>
              </div>
              
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                As young professionals, many of us moved to bigger cities to pursue careers and opportunities — 
                leaving our parents in hometowns with a quiet worry in our hearts:
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mt-1 flex-shrink-0">
                    <Stethoscope className="w-4 h-4 text-red-600" />
                  </div>
                  <p className="text-gray-700">Who will help them in a medical emergency?</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mt-1 flex-shrink-0">
                    <Calendar className="w-4 h-4 text-blue-600" />
                  </div>
                  <p className="text-gray-700">Who will take them for blood investigations and refill their monthly medicines?</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mt-1 flex-shrink-0">
                    <Heart className="w-4 h-4 text-purple-600" />
                  </div>
                  <p className="text-gray-700">Who will offer them the companionship they deserve?</p>
                </div>
              </div>

              <p className="text-lg text-gray-700 leading-relaxed">
                We realized this isn't just our story — it's the story of millions of families across India. 
                Aging parents often feel lonely and vulnerable. Children living away feel helpless and anxious. 
                That gap led to the birth of SeniorCare Plus.
              </p>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-emerald-100 to-green-100 rounded-2xl p-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-200/30 to-green-200/30"></div>
                <img 
                  src="/multigenerational.jpg" 
                  alt="Multigenerational family" 
                  className="w-full h-80 object-cover rounded-xl shadow-lg relative z-10"
                />
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full opacity-20"></div>
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full opacity-20"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What is SeniorCare Plus Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-emerald-50 to-green-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center mr-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                What Is SeniorCare Plus?
              </h2>
            </div>
            
            <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
              SeniorCare Plus is a comprehensive elder support service that bridges medical care, 
              emotional companionship, and family reassurance — so your loved ones are cared for 
              like family, even when you're miles away.
            </p>
          </div>
        </div>
      </section>

      {/* Movement Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center mr-4">
              <Target className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              More Than a Service — A Movement
            </h2>
          </div>
          
          <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed mb-12">
            SeniorCare Plus is redefining eldercare in India. We're building a future where aging is 
            dignified, connected, and safe — and where families can breathe easy knowing they're never alone.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-emerald-500/20 backdrop-blur-sm rounded-full flex items-center justify-center mr-4">
              <HeartHandshake className="w-6 h-6 text-emerald-600" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">
              Ready to Care Differently?
            </h2>
          </div>
          
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-12">
            Let's talk about how SeniorCare Plus can support your parents — and give you the peace of mind you deserve.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={() => navigate('/register')}
              className="bg-emerald-600 text-white hover:bg-emerald-700 px-8 py-3 text-lg font-semibold rounded-full transition-all duration-300 hover:scale-105 flex items-center shadow-lg"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              Book a Free Consultation
            </Button>
            
            <Button 
              onClick={() => {/* Add download brochure functionality */}}
              className="bg-white border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white px-8 py-3 text-lg font-semibold rounded-full transition-all duration-300 hover:scale-105 flex items-center shadow-lg"
            >
              <Download className="w-5 h-5 mr-2" />
              Download Brochure
            </Button>
            
            <Button 
              onClick={() => {/* Add call functionality */}}
              className="bg-white border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white px-8 py-3 text-lg font-semibold rounded-full transition-all duration-300 hover:scale-105 flex items-center shadow-lg"
            >
              <Phone className="w-5 h-5 mr-2" />
              Call +91 98765 43210
            </Button>
          </div>
        </div>
      </section>

      </div> {/* Close main container div */}

      {/* Modern Footer Section - same as home page */}
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
                  © 2025 Senior Care Plus. All rights reserved.
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
  );
};

export default AboutUs;