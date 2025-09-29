import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Stethoscope, 
  Heart, 
  Building2, 
  Ambulance,
  UserCheck,
  Shield,
  UserPlus,
  Clock,
  CheckCircle,
  Home,
  Users,
  Phone,
  Play,
  Check,
  Star
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
// Professional medical illustrations will be imported here once generated

const Services = () => {
  const navigate = useNavigate();
  const [scrollProgress, setScrollProgress] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      const timelineSection = document.getElementById('services-timeline');
      if (!timelineSection) return;
      
      const rect = timelineSection.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const sectionTop = rect.top;
      const sectionHeight = rect.height;
      
      // Calculate how much of the section is visible
      const visibleTop = Math.max(0, windowHeight - sectionTop);
      const visibleHeight = Math.min(visibleTop, sectionHeight);
      const progress = Math.max(0, Math.min(1, visibleHeight / sectionHeight));
      
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const preHospitalizationServices = [
    {
      icon: Stethoscope,
      title: "Top Doctor Consultations",
      description: "Easily find and book appointments with the most trusted doctors in your city, helping you get the right medical advice and treatment options without long waiting times."
    },
    {
      icon: Heart,
      title: "Hospitalization Advice",
      description: "Our expert advisors guide you in assessing your health condition, helping you determine if hospitalization is required, or if outpatient care can be an effective alternative."
    },
    {
      icon: Building2,
      title: "Hospital Selection",
      description: "Choose the best hospital for your needs based on specialized care, proximity, patient reviews, medical facilities, and cost transparency. Make an informed decision before your visit."
      
    },
    {
      icon: Ambulance,
      title: "Ambulance Support",
      description: "Get ambulance support with professional paramedics as soon as possible. Enjoy the added convenience of free pick-up from your home from partner hospitals."
    }
  ];

  const duringHospitalizationServices = [
    {
      icon: UserCheck,
      title: "Smooth Admission",
      description: "Streamline your hospital admission with personalized assistance."
      
    },
    {
      icon: Shield,
      title: "In-Hospital Support",
      description: "Receive constant care from your assigned case manager who ensures you have everything you need, from coordinating with doctors to arranging tests and keeping your family informed throughout your stay."

    },
    {
      icon: UserPlus,
      title: "Second Medical Opinion",
      description: "Get reassurance with a second opinion from renowned doctors, ensuring the treatment plan or surgery suggested is in your best interest and giving you peace of mind during critical decisions."
      
    },
    {
      icon: Clock,
      title: "Early Discharge",
      description: "Accelerate your recovery by opting for early discharge, supported by fast-tracked follow-ups, home nursing services, and the delivery of necessary medications straight to your door."
      
    },
    {
      icon: CheckCircle,
      title: "Wellness",
      description: "Comprehensive wellness services included in your membership plus additional benefits available at discounted rates.",
      isWellness: true
    }
  ];

  const postHospitalizationServices = [
    {
      icon: Home,
      title: "Post Discharge Follow-up",
      description: "Our post-discharge care ensures that your recovery continues smoothly with regular doctor calls, medication reminders, and professional guidance to prevent complications and aid in your healing process."
    }
  ];

  const WellnessSection = () => {
    const includedServices = [
      "Yoga (Mon-Fri)- Online & Offline",
      "Monthly Dietician & physiotherapy Consultation",
      "Weekly Mindfulness Sessions",
      "24x7 Qualified Doctor Consultation",
      "Doctor's Appointment Coordination",
      "Seamless Hospital Admission Support",
      "Free Ambulance Service (partner hospitals)",
      "Add family members (<55yrs) undersame plan.",
      "Free Anual Health Check-up",
      "Free Eye & Dental Check-up (every 6 month)"
    ];

    const additionalBenefits = [
      "Doctor Visits at Home",
      "Monthly Medicine Refills",
      "Blood Investigations at Home from NABL Accredited Labs",
      "Physiotherapy at Home",
      "Home Nursing/Ward Boy Service",
      "ICU Setup at Home",
      "Patient Care Equipment",
      "OPD Services at Partner Hospitals/Clinics",
      "Short-term Geriatric Care Center Stays"
    ];

    return (
      <div className="relative group">
        <div className="flex items-start gap-6 pb-8">
          {/* Timeline dot and line */}
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 transform group-hover:scale-110">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          </div>
          
          {/* Content */}
          <div className="flex-1 pt-2">
            <div className="flex items-center gap-3 mb-2">
              <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-xs px-3 py-1 font-medium">
                During Hospitalization
              </Badge>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-emerald-700 transition-colors duration-300">
              Wellness
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Comprehensive wellness services included in your membership plus additional benefits available at discounted rates.
            </p>
            
            {/* Wellness Benefits Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Included in Membership */}
              <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 border-2 border-emerald-200 hover:border-emerald-300 transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900">INCLUDED IN MEMBERSHIP</h4>
                </div>
                <ul className="space-y-3">
                  {includedServices.map((service, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm text-gray-700">
                      <div className="w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                        <Check className="w-2.5 h-2.5 text-white" />
                      </div>
                      <span className="leading-relaxed">{service}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Additional Benefits */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-200 hover:border-blue-300 transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <Star className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">ADDITIONAL BENEFITS</h4>
                    <p className="text-xs text-gray-600 font-medium">PAID (discounted rates)</p>
                  </div>
                </div>
                <ul className="space-y-3">
                  {additionalBenefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm text-gray-700">
                      <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                        <Star className="w-2.5 h-2.5 text-white" />
                      </div>
                      <span className="leading-relaxed">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ServiceItem = ({ service, phase, isLast, serviceIndex, totalServices }: { service: any, phase: string, isLast?: boolean, serviceIndex?: number, totalServices?: number }) => {
    // Handle wellness service differently
    if (service.isWellness) {
      return <WellnessSection />;
    }
    
    // Calculate if this service should be "activated" based on scroll progress
    const isActivated = serviceIndex !== undefined && totalServices !== undefined 
      ? scrollProgress >= (serviceIndex / totalServices) 
      : false;
    
    return (
      <div className="relative group">
        <div className="flex items-start gap-6 pb-8">
          {/* Timeline dot and line */}
          <div className="flex flex-col items-center">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-500 transform group-hover:scale-110 ${
              isActivated 
                ? 'bg-gradient-to-r from-emerald-500 to-green-600 hover:shadow-emerald-500/25 scale-110' 
                : 'bg-gray-300 hover:shadow-gray-400/25'
            }`}>
              <service.icon className={`w-6 h-6 transition-colors duration-500 ${
                isActivated ? 'text-white' : 'text-gray-500'
              }`} />
            </div>
          </div>
          
          {/* Content */}
          <div className="flex-1 pt-2">
            <div className="flex items-center gap-3 mb-2">
              <Badge className={`border-emerald-200 text-xs px-3 py-1 font-medium transition-all duration-500 ${
                isActivated 
                  ? 'bg-emerald-100 text-emerald-800' 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {phase}
              </Badge>
            </div>
            <h3 className={`text-xl font-bold mb-3 transition-all duration-500 ${
              isActivated 
                ? 'text-gray-900 group-hover:text-emerald-700' 
                : 'text-gray-500'
            }`}>
              {service.title}
            </h3>
            <p className={`mb-3 leading-relaxed transition-all duration-500 ${
              isActivated ? 'text-gray-600' : 'text-gray-400'
            }`}>
              {service.description}
            </p>
            {service.details && (
              <p className={`text-sm leading-relaxed transition-all duration-500 ${
                isActivated ? 'text-gray-500' : 'text-gray-400'
              }`}>
                {service.details}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Navbar />
      
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-28 pb-16 px-4">
          {/* Background gradients for depth */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-green-600 to-emerald-700"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-900/20 via-transparent to-green-900/10"></div>
          
          <div className="relative z-10 max-w-6xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm text-white border border-white/30 rounded-full text-sm font-semibold mb-6">
              <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></span>
              Our Services
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
              Comprehensive Medical Care
            </h1>
            <p className="text-xl text-emerald-100 max-w-3xl mx-auto leading-relaxed mb-8">
              From consultation to recovery, we provide seamless healthcare support at every step of your medical journey.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => navigate('/register')}
                className="group relative bg-white text-emerald-700 hover:bg-emerald-50 px-8 py-4 text-lg font-bold rounded-2xl shadow-2xl hover:shadow-white/25 transform hover:-translate-y-1 transition-all duration-300 ease-out overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <span>GET STARTED</span>
                  <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Button>
            </div>
          </div>
        </section>

        {/* All Medical Services in One Timeline */}
        <section id="services-timeline" className="py-20 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-semibold mb-6">
                <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
                Complete Medical Journey
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
                Your Healthcare Journey
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                From initial consultation to complete recovery, we guide you through every step with professional care and support.
              </p>
            </div>
            
            <div className="relative">
              {/* Background decoration - static line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-emerald-200 to-transparent opacity-30"></div>
              
              {/* Animated progress line with gradient fading */}
              <div 
                className="absolute left-6 top-0 w-1 transition-all duration-300 ease-out"
                style={{
                  height: `${scrollProgress * 100}%`,
                  background: `linear-gradient(to bottom, 
                    transparent 0%, 
                    rgba(16, 185, 129, 0.8) 5%, 
                    rgba(34, 197, 94, 1) 50%, 
                    rgba(16, 185, 129, 0.8) 95%, 
                    transparent 100%)`,
                  boxShadow: '0 0 15px rgba(16, 185, 129, 0.5)',
                  borderRadius: '2px'
                }}
              ></div>
              
              <div className="space-y-4">
                {/* Pre-Hospitalization Services */}
                {preHospitalizationServices.map((service, index) => {
                  const totalServices = preHospitalizationServices.length + duringHospitalizationServices.length + postHospitalizationServices.length;
                  return (
                    <ServiceItem 
                      key={`pre-${index}`}
                      service={service} 
                      phase="Pre-Hospitalization"
                      isLast={false}
                      serviceIndex={index}
                      totalServices={totalServices}
                    />
                  );
                })}
                
                {/* During Hospitalization Services */}
                {duringHospitalizationServices.map((service, index) => {
                  const totalServices = preHospitalizationServices.length + duringHospitalizationServices.length + postHospitalizationServices.length;
                  const serviceIndex = preHospitalizationServices.length + index;
                  return (
                    <ServiceItem 
                      key={`during-${index}`}
                      service={service} 
                      phase="During Hospitalization"
                      isLast={false}
                      serviceIndex={serviceIndex}
                      totalServices={totalServices}
                    />
                  );
                })}
                
                {/* Post-Hospitalization Services */}
                {postHospitalizationServices.map((service, index) => {
                  const totalServices = preHospitalizationServices.length + duringHospitalizationServices.length + postHospitalizationServices.length;
                  const serviceIndex = preHospitalizationServices.length + duringHospitalizationServices.length + index;
                  return (
                    <ServiceItem 
                      key={`post-${index}`}
                      service={service} 
                      phase="Post-Hospitalization"
                      isLast={index === postHospitalizationServices.length - 1}
                      serviceIndex={serviceIndex}
                      totalServices={totalServices}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <Footer />
      
      </div>
    </>
  );
};

export default Services;