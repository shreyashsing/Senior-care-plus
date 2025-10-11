import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Heart, Phone, Download, BookOpen, Users, MapPin, Shield, Clock, 
  Stethoscope, Home, HeartHandshake, UserCheck, Star, Target, 
  Lightbulb, Compass, Award, Zap, Globe, HandHeart, UserPlus,
  CheckCircle, ArrowRight, Mail, MessageCircle, Calendar, TrendingUp, 
  Palette, User
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

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
                src="/final_logo.svg"
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
              {/* <button
                onClick={() => navigate('/partners')}
                className="text-gray-800 hover:text-emerald-600 transition-colors duration-300 font-medium text-shadow-sm shadow-white/80"
              >
                Partners
              </button> */}
              <button
                onClick={() => navigate('/contact')}
                className="text-gray-800 hover:text-emerald-600 transition-colors duration-300 font-medium text-shadow-sm shadow-white/80"
              >
                Contact
              </button>
               <button
                onClick={() => navigate('/services')}
                className="text-gray-800 hover:text-emerald-600 transition-colors duration-300 font-medium text-shadow-sm shadow-white/80"
              >
                Services
              </button>
               <button
                onClick={() => navigate('/pricing')}
                className="text-gray-800 hover:text-emerald-600 transition-colors duration-300 font-medium text-shadow-sm shadow-white/80"
              >
                Pricing
              </button>
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

      {/* Team Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-green-400/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-emerald-300/10 to-green-300/10 rounded-full blur-3xl"></div>
          
          {/* Additional floating elements for more visual interest */}
          <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-emerald-400/8 rounded-full blur-2xl animate-pulse delay-700"></div>
          <div className="absolute bottom-1/4 left-1/4 w-40 h-40 bg-green-400/8 rounded-full blur-2xl animate-pulse delay-1000"></div>
          <div className="absolute top-3/4 right-1/3 w-24 h-24 bg-emerald-400/8 rounded-full blur-2xl animate-pulse delay-500"></div>
          
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 opacity-[0.015]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000' fill-opacity='1'%3E%3Cpath d='M0 0h100v1H0zM0 0v100h1V0z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Enhanced Header Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-6 py-3 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium mb-6 border border-emerald-200 shadow-sm">
              <span className="w-3 h-3 bg-emerald-500 rounded-full mr-3 animate-pulse"></span>
              Our Team
            </div>
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Meet Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700">Leadership</span>
            </h2>
            <p className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-6">
              Healthcare + Technology + Empathy - Our diverse team combines decades of healthcare expertise with cutting-edge technology
            </p>
            
            {/* Decorative elements */}
            <div className="flex justify-center items-center space-x-4 mb-8">
              <div className="w-16 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent rounded-full"></div>
              <div className="w-4 h-4 bg-emerald-500 rounded-full animate-pulse"></div>
              <div className="w-16 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent rounded-full"></div>
            </div>
          </div>
          
          {/* Simple Horizontal Team Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Dr. Raghvendra Gupta",
                role: "Chief Medical Strategist",
                icon: <Stethoscope className="h-12 w-12 text-emerald-600" />,
                description: "Former VP, Corporate Medical Services – Reliance Industries",
                details: [
                  "30+ years in hospital administration and clinical leadership",
                  "Expert in medical strategy & operations",
                  "Dedicated to patient care excellence"
                ],
                image: "/Dr. Raghvendra Gupta.jpg"
              },
              {
                name: "Arpit Maheshwari", 
                role: "Strategy, Sales & Product Lead",
                icon: <TrendingUp className="h-12 w-12 text-green-600" />,
                description: "12 years in global tech companies",
                details: [
                  "Proven experience in scaling operations",
                  "Drives strategic companies direction"
                ],
                image: "/Arpit Maheshwari.jpg"
              },
              {
                name: "Manav Shah",
                role: "Chief Product Designer", 
                icon: <Palette className="h-12 w-12 text-emerald-600" />,
                description: "Passionate about creating intuitive digital health experiences",
                details: [
                  "Focus on user-centric design",
                  "Ensures intuitive product experience",
                  "Innovates product features"
                ],
                image: "/1.jpg"
              }
            ].map((member, index) => (
              <Card 
                key={index} 
                className="h-[500px] overflow-hidden transition-all duration-300 hover:shadow-xl group cursor-pointer"
              >
                {/* Background Image or Placeholder */}
                <div className="relative h-full">
                  {member.image ? (
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-full h-full object-cover transition-all duration-500 group-hover:blur-sm"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-b from-slate-300 via-slate-200 to-slate-100 flex items-center justify-center">
                      <div className="text-center text-slate-500">
                        <div className="w-24 h-24 mx-auto mb-4 bg-slate-200/80 rounded-full flex items-center justify-center backdrop-blur-sm border border-slate-300/60">
                          <User className="w-12 h-12 text-slate-400" />
                        </div>
                        <div className="w-16 h-2 bg-slate-300/70 rounded-full mx-auto mb-3"></div>
                        <div className="w-12 h-2 bg-slate-400/70 rounded-full mx-auto"></div>
                      </div>
                    </div>
                  )}
                  
                  {/* Gradient Overlay for Text Readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  
                  {/* Default Content (Name and Role) */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white transition-all duration-500 group-hover:opacity-0">
                    <h3 className="text-2xl font-bold mb-2">{member.name}</h3>
                    <p className="text-lg text-emerald-200 font-semibold">{member.role}</p>
                  </div>
                  
                  {/* Hover Content (Full Information) */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <div className="text-white">
                      <h3 className="text-2xl font-bold mb-3">{member.name}</h3>
                      <p className="text-lg text-emerald-200 font-semibold mb-4">{member.role}</p>
                      <p className="text-gray-200 mb-4 italic text-sm">{member.description}</p>
                      <ul className="space-y-2">
                        {member.details.map((detail, detailIndex) => (
                          <li key={detailIndex} className="flex items-start">
                            <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                            <span className="text-gray-100 text-sm">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
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

      {/* Modern Footer Section */}
      <Footer />
    </>
  );
};

export default AboutUs;