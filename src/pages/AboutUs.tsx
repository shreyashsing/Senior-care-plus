import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Heart, Phone, Mail, Users, Stethoscope, Home, HeartHandshake, 
  CheckCircle, ArrowRight, UserPlus, Shield, Clock, Star, Target
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
      <Navbar />

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
                SeniorCare+
            </span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-gray-700 mb-12 max-w-4xl mx-auto leading-relaxed">
              Because Parents Deserve Care, and Children Deserve Peace of Mind
          </p>

          {/* Decorative Line */}
          <div className="w-32 h-1 bg-gradient-to-r from-emerald-500 to-green-500 mx-auto mb-16 rounded-full"></div>
        </div>
      </section>

        {/* About Us Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-6xl mx-auto">
            
            <div className="max-w-4xl mx-auto">
              <Card className="p-8 md:p-12 shadow-lg border-0 bg-gradient-to-br from-emerald-50 to-green-50">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  {/* Image Section */}
                  <div className="text-center">
                    <div className="relative inline-block">
                      <img 
                        src="/Dr. Raghvendra Gupta.jpg" 
                        alt="Dr. Raghvendra Gupta"
                        className="w-48 h-48 md:w-56 md:h-56 object-cover rounded-full shadow-lg border-4 border-white"
                      />
                      <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center">
                        <Stethoscope className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Content Section */}
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Dr. Raghvendra Gupta</h3>
                    <p className="text-emerald-700 font-semibold mb-6">Founder & Chief Medical Officer</p>
                    
                    <p className="text-lg text-gray-700 leading-relaxed">
                      Dr. Raghvendra Gupta, with nearly 30 years of rich experience in healthcare—including a decade in corporate medical services in the oil & gas sector—has led emergency medical care on a pan-India scale. Having witnessed first-hand the growing concern of children staying away from their aging parents, he founded SeniorCare+ to provide reliable medical support for senior citizens and ease the constant anxiety of their loved ones.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Why SeniorCare+ Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-emerald-50 to-green-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center mr-4">
                  <HeartHandshake className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                  Why SeniorCare+?
                </h2>
              </div>
            </div>
            
             <div className="max-w-4xl mx-auto">
               <div className="space-y-6 mb-8">
                 <div className="flex items-start space-x-4">
                   <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center mt-1 flex-shrink-0">
                     <Users className="w-4 h-4 text-emerald-600" />
                   </div>
                   <p className="text-gray-700 text-lg">Today, most families have one or two children living in different cities for work.</p>
        </div>
        
                 <div className="flex items-start space-x-4">
                   <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center mt-1 flex-shrink-0">
                     <Home className="w-4 h-4 text-emerald-600" />
                   </div>
                   <p className="text-gray-700 text-lg">Parents often stay alone at their hometowns, without immediate medical support.</p>
            </div>
        
                 <div className="flex items-start space-x-4">
                   <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center mt-1 flex-shrink-0">
                     <Heart className="w-4 h-4 text-emerald-600" />
                   </div>
                   <p className="text-gray-700 text-lg">Children constantly worry: "Who will help my parents in a medical emergency?"</p>
            </div>
          </div>
          
               <div className="text-center">
                 <p className="text-xl text-gray-700 leading-relaxed font-medium">
                   SeniorCare+ is the answer—a trusted companion to keep parents secure and children reassured.
                 </p>
               </div>
             </div>
          </div>
        </section>

         {/* Our Services Section */}
         <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
           {/* Background Elements */}
           <div className="absolute inset-0">
             <div className="absolute top-20 left-20 w-64 h-64 bg-emerald-400/5 rounded-full blur-3xl"></div>
             <div className="absolute bottom-20 right-20 w-80 h-80 bg-green-400/5 rounded-full blur-3xl"></div>
             <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-emerald-300/3 to-green-300/3 rounded-full blur-3xl"></div>
           </div>
           
           <div className="max-w-7xl mx-auto relative">
             <div className="text-center mb-16">
               <div className="inline-flex items-center px-6 py-3 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-6 border border-emerald-200 shadow-sm">
                 <span className="w-3 h-3 bg-emerald-500 rounded-full mr-3 animate-pulse"></span>
                 Our Services
               </div>
               <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                 Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700">Services</span>
               </h2>
               <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                 Comprehensive healthcare solutions designed specifically for senior citizens and their families
               </p>
             </div>
             
             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
               {[
                 {
                   icon: <Heart className="w-8 h-8" />,
                   title: "Wellness Activities",
                   description: "Programs to keep seniors active, healthy, and engaged",
                   gradient: "from-emerald-500 to-green-600",
                   bgGradient: "from-emerald-50 to-green-50"
                 },
                 {
                   icon: <Clock className="w-8 h-8" />,
                   title: "Emergency Medical Support",
                   description: "24/7 assistance in case of sudden illness or accident",
                   gradient: "from-green-500 to-emerald-600",
                   bgGradient: "from-green-50 to-emerald-50"
                 },
                 {
                   icon: <Stethoscope className="w-8 h-8" />,
                   title: "Routine OPD Consultations",
                   description: "Access to doctors at highly subsidized prices",
                   gradient: "from-emerald-600 to-teal-600",
                   bgGradient: "from-emerald-50 to-teal-50"
                 },
                 {
                   icon: <CheckCircle className="w-8 h-8" />,
                   title: "Periodic Health Check-Ups",
                   description: "Preventive screenings and diagnostics",
                   gradient: "from-teal-500 to-emerald-600",
                   bgGradient: "from-teal-50 to-emerald-50"
                 },
                 {
                   icon: <HeartHandshake className="w-8 h-8" />,
                   title: "Care Coordination",
                   description: "Guidance and facilitation for specialist consultations, hospitalization, or follow-up care",
                   gradient: "from-green-600 to-emerald-700",
                   bgGradient: "from-green-50 to-emerald-50"
                 },
                 {
                   icon: <UserPlus className="w-8 h-8" />,
                   title: "Family Inclusion",
                   description: "One senior citizen can enroll two family members (< 60 years) under the same program",
                   gradient: "from-emerald-700 to-green-700",
                   bgGradient: "from-emerald-50 to-green-50"
                 }
               ].map((service, index) => (
                 <Card key={index} className="group relative h-full overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white/80 backdrop-blur-sm">
                   {/* Gradient Top Border */}
                   <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${service.gradient}`}></div>
                   
                   {/* Background Gradient */}
                   <div className={`absolute inset-0 bg-gradient-to-br ${service.bgGradient} opacity-30 group-hover:opacity-50 transition-opacity duration-300`}></div>
                   
                   <div className="relative p-8 h-full flex flex-col">
                     {/* Icon Container */}
                     <div className="mb-6">
                       <div className={`w-16 h-16 bg-gradient-to-br ${service.gradient} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                         <div className="text-white">
                           {service.icon}
                        </div>
                      </div>
                    </div>
                     
                     {/* Content */}
                     <div className="flex-1">
                       <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-emerald-700 transition-colors duration-300">
                         {service.title}
                       </h3>
                       <p className="text-gray-700 leading-relaxed text-sm">
                         {service.description}
                       </p>
                     </div>
                     
                     {/* Bottom Accent */}
                     {/* <div className="mt-6 flex items-center text-emerald-600 font-semibold group-hover:text-emerald-700 transition-colors duration-300">
                       <span className="text-sm">Service #{index + 1}</span>
                       <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                     </div> */}
                  </div>
                  
                   {/* Hover Overlay */}
                   <div className="absolute inset-0 bg-gradient-to-t from-emerald-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                 </Card>
               ))}
             </div>
           </div>
         </section>

        {/* Benefits Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-emerald-50 to-green-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center mr-4">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                  Benefits of SeniorCare+
                </h2>
                    </div>
                  </div>
            
             <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
               {[
                 {
                   text: "Peace of mind for children living away",
                   icon: <Heart className="w-6 h-6 text-white" />
                 },
                 {
                   text: "Medical security for parents at home",
                   icon: <Shield className="w-6 h-6 text-white" />
                 },
                 {
                   text: "Affordable and accessible healthcare services",
                   icon: <CheckCircle className="w-6 h-6 text-white" />
                 },
                 {
                   text: "Holistic approach—covering prevention, care, and emergency response",
                   icon: <Star className="w-6 h-6 text-white" />
                 }
               ].map((benefit, index) => (
                 <Card key={index} className="p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 bg-white">
                   <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                     {benefit.icon}
                </div>
                   <p className="text-gray-700 font-medium">{benefit.text}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

        {/* Who Can Enroll Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center mr-4">
                  <UserPlus className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                  Who Can Enroll?
                </h2>
              </div>
              </div>
              
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="p-8 text-center hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-emerald-50 to-green-50">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Primary Members</h3>
                <p className="text-gray-700 text-lg">Senior Citizens (60+ years)</p>
              </Card>
              
              <Card className="p-8 text-center hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-emerald-50 to-green-50">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <UserPlus className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Additional Members</h3>
                <p className="text-gray-700 text-lg">Up to two family members below 60 years can also be included</p>
              </Card>
                  </div>
                </div>
        </section>

         {/* Mission Section */}
         <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-emerald-50 to-green-50 relative overflow-hidden">
           {/* Background Elements */}
           <div className="absolute inset-0">
             <div className="absolute top-10 left-10 w-32 h-32 bg-emerald-400/10 rounded-full blur-2xl"></div>
             <div className="absolute bottom-10 right-10 w-40 h-40 bg-green-400/10 rounded-full blur-2xl"></div>
             <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-emerald-300/5 to-green-300/5 rounded-full blur-3xl"></div>
                  </div>
           
           <div className="max-w-6xl mx-auto relative">
             <div className="text-center mb-16">
               
               <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                 Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700">Mission</span>
               </h2>
                </div>
             
             <div className="relative">
               <Card className="p-8 md:p-16 text-center shadow-2xl border-0 bg-white/80 backdrop-blur-sm relative overflow-hidden">
                 {/* Decorative Elements */}
                 <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-500"></div>
                 <div className="absolute top-6 right-6 w-8 h-8 bg-emerald-400/20 rounded-full"></div>
                 <div className="absolute bottom-6 left-6 w-6 h-6 bg-green-400/20 rounded-full"></div>
                 
                 <div className="relative z-10">
                   <div className="relative inline-block mb-8">
                     <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                       <Heart className="w-12 h-12 text-white" />
                  </div>
                     <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center">
                       <Target className="w-4 h-4 text-white" />
                </div>
              </div>

                   <div className="max-w-4xl mx-auto">
                     <p className="text-xl md:text-2xl text-gray-700 leading-relaxed font-medium">
                       To ensure that no senior citizen feels vulnerable during a medical emergency, and no child has to live with the constant anxiety of being far away from their parents.
              </p>
            </div>

                   {/* Bottom Decorative Line */}
                   <div className="mt-8 flex justify-center">
                     <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"></div>
              </div>
            </div>
               </Card>
          </div>
        </div>
      </section>

        {/* Contact Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center mr-4">
                  <Phone className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                  Contact Us
              </h2>
            </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="p-8 text-center hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-emerald-50 to-green-50">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Phone className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Phone</h3>
                <p className="text-gray-700 text-lg">+91 9975567202</p>
              </Card>
              
              <Card className="p-8 text-center hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-emerald-50 to-green-50">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Email</h3>
                <p className="text-gray-700 text-lg">contact@seniorcareplus.in</p>
              </Card>
          </div>
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
              Let's talk about how SeniorCare+ can support your parents — and give you the peace of mind you deserve.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                onClick={() => navigate('/register')}
                className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-8 py-4 text-lg font-semibold rounded-full transition-all duration-300 hover:scale-105 flex items-center shadow-lg"
              >
                <ArrowRight className="w-5 h-5 mr-2" />
                Get Started Today
              </Button>
            
            <Button 
                onClick={() => window.open('tel:+919975567202', '_self')}
                className="bg-white border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white px-8 py-4 text-lg font-semibold rounded-full transition-all duration-300 hover:scale-105 flex items-center shadow-lg"
            >
              <Phone className="w-5 h-5 mr-2" />
                Call +91 9975567202
            </Button>
          </div>
        </div>
      </section>
      </div>

      <Footer />
    </>
  );
};

export default AboutUs;