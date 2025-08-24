import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Plus, Check, Monitor, Home, Building2, Phone, Car, Plane, Droplets, Pill, Calendar, RefreshCw, Clock, Heart, Brain, Dumbbell, UtensilsCrossed, UserCheck, Stethoscope, Ambulance, TestTube, Truck, Shield, Users, MapPin, ChevronDown, ChevronUp } from 'lucide-react';
import Lottie from 'lottie-react';
import medicalAnimationData from '../../public/Medical Healthcare.json';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [coupleImageProgress, setCoupleImageProgress] = useState(0);
  const [cardsProgress, setCardsProgress] = useState(0);
  const [expandedCards, setExpandedCards] = useState({
    online: false,
    agency: false,
    hospital: false
  });
  const [selectedPlan, setSelectedPlan] = useState('single');
  const [selectedDuration, setSelectedDuration] = useState('');
  const [showPricing, setShowPricing] = useState(false);
  const [showCTA, setShowCTA] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          const windowHeight = window.innerHeight;
          
          // Get the caring section element
          const caringSection = document.getElementById('caring-section');
          if (!caringSection) return;
          
          const rect = caringSection.getBoundingClientRect();
          const sectionTop = rect.top;
          const sectionHeight = rect.height;
          
          // Calculate progress for the entire section (0 to 1)
          const sectionStart = windowHeight * 0.8; // Start animation when section is 80% in view
          const sectionEnd = -sectionHeight * 0.2; // End animation when section is 20% out of view
          const sectionProgress = Math.max(0, Math.min(1, 
            (sectionStart - sectionTop) / (sectionStart - sectionEnd)
          ));
          
          setScrollProgress(sectionProgress);
          
          // Calculate couple image rotation progress (0 to 0.6 of section progress)
          const imageProgress = Math.max(0, Math.min(1, sectionProgress / 0.6));
          setCoupleImageProgress(imageProgress);
          
          // Calculate cards animation progress (0.4 to 1 of section progress)
          const cardsStart = Math.max(0, (sectionProgress - 0.4) / 0.6);
          setCardsProgress(cardsStart);
          
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showDropdown && !(event.target as Element).closest('.dropdown-container')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDropdown]);

  return (
    <>
        <section className="relative overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50">
          {/* Decorative Wave Effect - Diagonal (Middle Position) */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <div className="absolute inset-0 w-full h-full">
              <svg className="w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.15"/>
                    <stop offset="50%" stopColor="#059669" stopOpacity="0.12"/>
                    <stop offset="100%" stopColor="#047857" stopOpacity="0.18"/>
                  </linearGradient>
                </defs>
                <path 
                  d="M0,700 Q300,500 600,400 Q900,300 1200,100" 
                  stroke="url(#waveGradient)"
                  strokeWidth="8"
                  fill="none"
                  className="animate-pulse"
                  style={{animationDuration: '6s'}}
                />
                <path 
                  d="M0,650 Q350,450 700,350 Q1050,250 1200,50" 
                  stroke="url(#waveGradient)"
                  strokeWidth="6"
                  fill="none"
                  opacity="0.6"
                  className="animate-pulse"
                  style={{animationDuration: '8s', animationDelay: '1s'}}
                />
                <path 
                  d="M0,600 Q400,400 800,300 Q1200,200 1200,0" 
                  stroke="url(#waveGradient)"
                  strokeWidth="4"
                  fill="none"
                  opacity="0.4"
                  className="animate-pulse"
                  style={{animationDuration: '10s', animationDelay: '2s'}}
                />
              </svg>
            </div>
          </div>

          {/* Senior Logo - Top Right Corner of Hero Section */}
          <div className="absolute top-6 right-6 md:top-8 md:right-8 lg:top-10 lg:right-10 z-30">
            <img
              src="/logo.svg"
              alt="Senior Care Logo"
              className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 transition-all duration-300 ease-out hover:scale-110"
              style={{
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))',
              }}
            />
          </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center py-12 md:py-16">
          {/* Left copy */}
          <div className="max-w-2xl">
            <div className="space-y-2 mb-4">
              <div className="inline-flex items-center px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm font-semibold mb-3">
                <span className="w-2 h-2 bg-teal-500 rounded-full mr-2"></span>
                Trusted Senior Care Services
              </div>
              
              <h1 className="leading-none font-black tracking-tight text-gray-900">
                <span className="block text-3xl sm:text-4xl lg:text-5xl xl:text-6xl bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">SENIOR</span>
                <span className="block text-3xl sm:text-4xl lg:text-5xl xl:text-6xl bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                  CARE <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-600">+</span>
                </span>
            </h1>
              
              <p className="text-sm sm:text-base text-gray-600 max-w-lg leading-relaxed">
                Professional healthcare services designed specifically for seniors, ensuring comfort, dignity, and peace of mind.
              </p>
            </div>

            <ul className="mt-4 space-y-2 text-sm text-gray-700">
              {[
                'Serving Surat & Navi Mumbai areas',
                'Medical + Lifestyle Care',
                '24×7 Helpline',
              ].map((text, idx) => (
                <li key={idx} className="flex items-center gap-2 group">
                  <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <Play className="h-3 w-3 text-white" />
                  </div>
                  <span className="font-medium">{text}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 space-y-6">
              {/* Modern CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={() => navigate('/register', { 
                    state: { 
                      planInfo: { 
                        type: 'single', 
                        duration: '1', 
                        price: 3000 
                      } 
                    } 
                  })}
                  className="group relative bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 hover:from-emerald-700 hover:via-green-700 hover:to-emerald-800 text-white px-8 py-4 text-lg font-bold rounded-2xl shadow-2xl hover:shadow-emerald-500/25 transform hover:-translate-y-1 transition-all duration-300 ease-out overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <span>REGISTER NOW</span>
                    <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                </Button>
                

            </div>

              {/* Modern Tagline Card */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-green-500/5 to-emerald-500/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-white/30 shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-gray-800 tracking-wide leading-relaxed">
                        "BECAUSE YOUR PARENTS DESERVE TRUSTED CARE, EVEN WHEN YOU'RE FAR AWAY."
                      </p>
                      <div className="mt-2 flex items-center gap-2 text-xs text-emerald-600 font-medium">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                        <span>Where compassion meets professional care</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Medical Healthcare Animation */}
                      <div className="flex items-center justify-start -ml-16">
              <div className="relative w-full">
                <Lottie
                animationData={medicalAnimationData}
                loop={true}
                autoplay={true}
                className="transition-all duration-1000 ease-out w-full max-w-[900px] h-auto max-h-[700px] sm:w-[600px] sm:h-[500px] md:w-[700px] md:h-[550px] lg:w-[800px] lg:h-[600px] xl:w-[900px] xl:h-[700px]"
                style={{
                  transform: `translateY(${scrollProgress * -15}px) scale(${0.9 + (scrollProgress * 0.1)})`,
                }}
              />
              

              

            </div>
            </div>
          </div>
        </div>
      </section>

    {/* Caring Section with Overlapping Cards */}
    <section id="caring-section" className="relative bg-gradient-to-br from-green-50 to-emerald-50 pt-12 md:pt-16 pb-20 md:pb-28">

      
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-semibold mb-6">
            <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
            Comprehensive Care Solutions
          </div>
          
          <h2 className="font-black tracking-tight text-gray-900 leading-tight text-4xl sm:text-5xl lg:text-6xl mb-6">
            CARING FOR YOUR LOVED ONES
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-600">—WHEREVER YOU ARE</span>
          </h2>
          
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
            Stay connected to your parents' health with round the clock support, expert medical care, and reliable emergency assistance –
            all in one simple membership.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => navigate('/register', { 
                state: { 
                  planInfo: { 
                    type: 'single', 
                    duration: '1', 
                    price: 3000 
                  } 
                } 
              })}
              className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
            >
              GET STARTED
            </Button>
            <Button variant="outline" className="border-2 border-emerald-300 text-emerald-700 hover:bg-emerald-50 px-8 py-4 text-lg font-semibold rounded-xl">
              View Services
            </Button>
          </div>
        </div>

        <div className="relative mt-8">
          {/* Main couples image */}
          <div 
            className="rounded-2xl overflow-hidden transition-all duration-1000 ease-out"
            style={{
              transform: `perspective(1000px) rotateX(${90 - (coupleImageProgress * 90)}deg)`,
              transformOrigin: 'center bottom',
              filter: `drop-shadow(0 ${20 - (coupleImageProgress * 20)}px ${40 - (coupleImageProgress * 30)}px rgba(0,0,0,0.3))`,
              willChange: 'transform, filter',
            }}
          >
            <img
              src="/couple-2.jpg"
              alt="Retired couple using laptop on a sofa"
              className="w-full h-[340px] sm:h-[380px] md:h-[440px] object-cover transition-all duration-1000 ease-out"
              style={{
                maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 20%)',
                WebkitMaskImage:
                  'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 20%)',
                transform: `scale(${0.8 + (coupleImageProgress * 0.2)})`,
              }}
            />
          </div>

          {/* Three Cards positioned over the image */}
          <div 
            className="absolute -bottom-76 md:-bottom-80 left-1/2 -translate-x-1/2 transform w-[100%] md:w-[94%] lg:w-[90%] z-10 transition-all duration-1000 ease-out"
            style={{
              transform: `translate(-50%, ${100 - (cardsProgress * 100)}px) scale(${0.8 + (cardsProgress * 0.2)})`,
              opacity: cardsProgress,
              willChange: 'transform, opacity',
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {/* Card 1 */}
              <div 
                className="group relative rounded-3xl bg-white shadow-[0_20px_40px_rgba(0,0,0,0.4)] transition-all duration-700 ease-out overflow-hidden hover:shadow-[0_25px_50px_rgba(0,0,0,0.5)] hover:-translate-y-1 border border-gray-200/60"
                style={{
                  transform: `translateY(${50 - (cardsProgress * 50)}px)`,
                }}
              >
                {/* Blended Outline Design Above Card */}
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-[95%] h-2 bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent rounded-full blur-sm"></div>
                <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-[98%] h-1 bg-gradient-to-r from-transparent via-emerald-300/40 to-transparent rounded-full"></div>
                {/* Image Container */}
                <div className="relative h-[12rem] md:h-[22rem] overflow-hidden">
                  <img
                    src="/side-view-old-man-sitting-bench.jpg"
                    alt="Elderly man sitting on park bench"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Greenish Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-600/50 via-emerald-500/20 to-transparent"></div>
                  
                  {/* Top Badge */}
                  <div className="absolute top-4 left-4">
                    <div className="bg-emerald-600 text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
                      Care Support
                </div>
                </div>
                  
                  {/* Text Content Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                    <h3 className="text-white font-bold text-lg md:text-xl leading-tight mb-3">
                      Independent Living Support
                    </h3>
                    <p className="text-white/90 text-sm md:text-base leading-relaxed">
                      Many seniors live independently but still value extra care and assistance for peace of mind.
                  </p>
                </div>
                </div>
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Card 2 */}
              <div 
                className="group relative rounded-3xl bg-white shadow-[0_20px_40px_rgba(0,0,0,0.4)] transition-all duration-700 ease-out overflow-hidden hover:shadow-[0_25px_50px_rgba(0,0,0,0.5)] hover:-translate-y-1 border border-gray-200/60"
                style={{
                  transform: `translateY(${50 - (cardsProgress * 50)}px)`,
                }}
              >
                {/* Blended Outline Design Above Card */}
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-[95%] h-2 bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent rounded-full blur-sm"></div>
                <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-[98%] h-1 bg-gradient-to-r from-transparent via-emerald-300/40 to-transparent rounded-full"></div>
                {/* Image Container */}
                <div className="relative h-[12rem] md:h-[22rem] overflow-hidden">
                  <img
                    src="/16970.jpg"
                    alt="Elderly man sitting on park bench"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Greenish Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-600/50 via-emerald-500/20 to-transparent"></div>
                  
                  {/* Top Badge */}
                  <div className="absolute top-4 left-4">
                    <div className="bg-emerald-600 text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
                      Health Care
                </div>
                </div>
                  
                  {/* Text Content Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                    <h3 className="text-white font-bold text-lg md:text-xl leading-tight mb-3">
                      Remote Health Management
                    </h3>
                    <p className="text-white/90 text-sm md:text-base leading-relaxed">
                      Managing health and emergencies from afar can be challenging without proper support systems.
                  </p>
                </div>
                </div>
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Card 3 */}
              <div 
                className="group relative rounded-3xl bg-white shadow-[0_20px_40px_rgba(0,0,0,0.4)] transition-all duration-700 ease-out overflow-hidden hover:shadow-[0_25px_50px_rgba(0,0,0,0.5)] hover:-translate-y-1 border border-gray-200/60"
                style={{
                  transform: `translateY(${50 - (cardsProgress * 50)}px)`,
                }}
              >
                {/* Blended Outline Design Above Card */}
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-[95%] h-2 bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent rounded-full blur-sm"></div>
                <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-[98%] h-1 bg-gradient-to-r from-transparent via-emerald-300/40 to-transparent rounded-full"></div>
                {/* Image Container */}
                <div className="relative h-[12rem] md:h-[22rem] overflow-hidden">
                  <img
                    src="/nurse.jpg"
                    alt="Elderly man sitting on park bench"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Greenish Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-600/50 via-emerald-500/20 to-transparent"></div>
                  
                  {/* Top Badge */}
                  <div className="absolute top-4 left-4">
                    <div className="bg-emerald-600 text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
                      Family Care
                </div>
                </div>
                  
                  {/* Text Content Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                    <h3 className="text-white font-bold text-lg md:text-xl leading-tight mb-3">
                      Family Connection
                    </h3>
                    <p className="text-white/90 text-sm md:text-base leading-relaxed">
                      We help you stay involved in your family's care, no matter the distance between you.
                  </p>
                </div>
                </div>
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
          </div>
          </div>
        </div>
      </section>

      {/* Features: 6 Cards */}
      <section className="relative bg-gradient-to-br from-green-50 to-emerald-50 pt-[45rem] md:pt-72 pb-20">
        <div className="w-[96%] md:w-[92%] lg:w-[88%] xl:w-[84%] mx-auto">
          <div className="w-[100%] md:w-[94%] lg:w-[90%] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-8">
              {[
				{
                  title: 'ONLINE WELLNESS ACTIVITIES',
                  subtitle: 'Yoga, meditation, health webinars',
                  icon: '/yoga.svg', // Add your wellness activities icon
                  alt: 'Wellness activities icon'
                },
                {
                  title: '24 X 7 MEDICAL SUPPORT',
                  subtitle: 'Instant access to doctors, anytime',
                  icon: '/24x7.svg', // Add your medical support icon
                  alt: 'Medical support icon'
                },
                {
                  title: 'HOSPITAL COORDINATION',
                  subtitle: 'Smooth appointments and admissions',
                  icon: '/hospital.svg', // Add your hospital coordination icon
                  alt: 'Hospital coordination icon'
                },
                {
                  title: 'EMERGENCY ASSISTANCE',
                  subtitle: 'On-call help for urgent situations',
                  icon: '/emergency.svg', // Add your emergency assistance icon
                  alt: 'Emergency assistance icon'
                },
                {
                  title: 'Home Services',
                  subtitle: 'Diagnostic test, medicine delivery, care & ICU at Home',
                  icon: '/medicine.svg', // Add your wellness consultation icon
                  alt: 'Wellness consultation icon'
                },
				{
					title: '2ND OPINION WITH SENIOR DOCTORS',
					subtitle: 'Expert medical consultation and second opinions',
					icon: '/brain.svg', // Add your second opinion icon
					alt: 'Second opinion icon'
				}  
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl bg-emerald-600 text-white shadow-[0_12px_30px_rgba(0,0,0,0.15)] ring-1 ring-black/10 px-5 md:px-6 py-5 md:py-6 flex items-center gap-5"
                >
                  <div className="shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-full bg-white flex items-center justify-center shadow-md overflow-hidden">
                    <img src={item.icon} alt={item.alt} className="w-12 h-12 md:w-16 md:h-16 object-cover" style={{ objectPosition: 'center 30%' }} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base md:text-lg font-extrabold leading-tight tracking-wide">
                      {item.title}
                    </h3>
                    <p className="text-xs md:text-sm text-emerald-50/90 mt-1 truncate md:whitespace-normal">
                      {item.subtitle}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

		{/* How It Works Section */}
		<section className="relative bg-gradient-to-br from-green-50 to-emerald-50 pt-20 md:pt-28 pb-32">
			<div className="w-[96%] md:w-[92%] lg:w-[88%] xl:w-[84%] mx-auto">
				{/* Enhanced Section Header */}
				<div className="text-center mb-16 md:mb-20">
					<div className="inline-flex items-center px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-semibold mb-6">
						<span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
						Simple Process
          </div>
					
					<h2 className="font-black tracking-tight text-gray-900 leading-tight text-4xl sm:text-5xl lg:text-6xl mb-6">
						HOW IT WORKS
						<br />
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-600">SIMPLE & STRESS-FREE</span>
					</h2>
					
					<p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
						Get started with professional senior care in just three easy steps. We handle the complexity so you can focus on what matters most.
					</p>
              </div>
              
				{/* Enhanced Process Cards */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
					{/* Step 1: Share Details */}
					<div className="group relative">
						<div className="relative bg-gradient-to-br from-emerald-100 via-green-50 to-teal-100 rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:shadow-[0_25px_50px_rgba(0,0,0,0.12)] transition-all duration-500 hover:-translate-y-2 overflow-hidden border border-emerald-200/40 min-h-[380px] md:min-h-[420px]">
							{/* Step Number Badge */}
							<div className="absolute top-6 right-6 z-10">
								<div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-lg">
									Step 01
                    </div>
              </div>
              
							{/* Enhanced Icon Container */}
							<div className="relative mx-auto w-28 h-28 md:w-32 md:h-32 rounded-full bg-white/90 backdrop-blur-sm shadow-[0_8px_32px_rgba(0,0,0,0.08)] flex items-center justify-center mb-8 mt-8 group-hover:scale-110 transition-transform duration-500">
								<div className="w-16 h-16 md:w-18 md:h-18 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
									<svg className="w-8 h-8 md:w-9 md:h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
									</svg>
                  </div>
              </div>

							{/* Content */}
							<div className="px-8 pb-8 text-center">
								<h3 className="text-2xl md:text-3xl font-black uppercase tracking-wide text-gray-800 mb-4">
									Share Details
								</h3>
								<p className="text-gray-600 text-base md:text-lg leading-relaxed">
									Provide your parent's health information, emergency contacts & preferences through our secure platform.
								</p>
								
								{/* Feature List */}
								<div className="mt-6 space-y-2">
									{['Health Records', 'Emergency Contacts', 'Care Preferences'].map((item, idx) => (
										<div key={idx} className="flex items-center justify-center gap-2 text-emerald-700 text-sm font-medium">
											<div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
											<span>{item}</span>
            </div>
									))}
								</div>
							</div>
							
							{/* Bottom Border Animation */}
							<div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400/0 via-emerald-500 to-teal-500/0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out origin-center"></div>
						</div>
					</div>

					{/* Step 2: Meet Care Manager */}
					<div className="group relative">
						<div className="relative bg-gradient-to-br from-emerald-100 via-green-50 to-teal-100 rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:shadow-[0_25px_50px_rgba(0,0,0,0.12)] transition-all duration-500 hover:-translate-y-2 overflow-hidden border border-emerald-200/40 min-h-[380px] md:min-h-[420px]">
							{/* Step Number Badge */}
							<div className="absolute top-6 right-6 z-10">
								<div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-lg">
									Step 02
								</div>
							</div>
							
							{/* Enhanced Icon Container */}
							<div className="relative mx-auto w-28 h-28 md:w-32 md:h-32 rounded-full bg-white/90 backdrop-blur-sm shadow-[0_8px_32px_rgba(0,0,0,0.08)] flex items-center justify-center mb-8 mt-8 group-hover:scale-110 transition-transform duration-500">
								<div className="w-16 h-16 md:w-18 md:h-18 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
									<svg className="w-8 h-8 md:w-9 md:h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
									</svg>
								</div>
							</div>
							
							{/* Content */}
							<div className="px-8 pb-8 text-center">
								<h3 className="text-2xl md:text-3xl font-black uppercase tracking-wide text-gray-800 mb-4">
									Meet Your Care Manager
								</h3>
								<p className="text-gray-600 text-base md:text-lg leading-relaxed">
									Connect with your dedicated care manager who becomes your single point of contact for all health needs.
								</p>
								
								{/* Feature List */}
								<div className="mt-6 space-y-2">
									{['Personal Care Plan', '24/7 Support', 'Family Updates'].map((item, idx) => (
										<div key={idx} className="flex items-center justify-center gap-2 text-emerald-700 text-sm font-medium">
											<div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
											<span>{item}</span>
										</div>
									))}
								</div>
							</div>
							
							{/* Bottom Border Animation */}
							<div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400/0 via-emerald-500 to-teal-500/0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out origin-center"></div>
						</div>
					</div>

					{/* Step 3: Stay Connected */}
					<div className="group relative">
						<div className="relative bg-gradient-to-br from-emerald-100 via-green-50 to-teal-100 rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:shadow-[0_25px_50px_rgba(0,0,0,0.12)] transition-all duration-500 hover:-translate-y-2 overflow-hidden border border-emerald-200/40 min-h-[380px] md:min-h-[420px]">
							{/* Step Number Badge */}
							<div className="absolute top-6 right-6 z-10">
								<div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-lg">
									Step 03
								</div>
							</div>
							
							{/* Enhanced Icon Container */}
							<div className="relative mx-auto w-28 h-28 md:w-32 md:h-32 rounded-full bg-white/90 backdrop-blur-sm shadow-[0_8px_32px_rgba(0,0,0,0.08)] flex items-center justify-center mb-8 mt-8 group-hover:scale-110 transition-transform duration-500">
								<div className="w-16 h-16 md:w-18 md:h-18 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
									<svg className="w-8 h-8 md:w-9 md:h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
									</svg>
								</div>
							</div>
							
							{/* Content */}
							<div className="px-8 pb-8 text-center">
								<h3 className="text-2xl md:text-3xl font-black uppercase tracking-wide text-gray-800 mb-4">
									Stay Connected
								</h3>
								<p className="text-gray-600 text-base md:text-lg leading-relaxed">
									Receive regular updates, hospital visit reports, and emergency assistance whenever you need it.
								</p>
								
								{/* Feature List */}
								<div className="mt-6 space-y-2">
									{['Health Updates', 'Hospital Reports', 'Emergency Help'].map((item, idx) => (
										<div key={idx} className="flex items-center justify-center gap-2 text-emerald-700 text-sm font-medium">
											<div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
											<span>{item}</span>
										</div>
									))}
								</div>
							</div>
							
							{/* Bottom Border Animation */}
							<div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400/0 via-emerald-500 to-teal-500/0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out origin-center"></div>
						</div>
					</div>
				</div>

				{/* Bottom CTA */}
				<div className="text-center mt-16">
					<div className="inline-flex items-center gap-3 bg-white px-8 py-4 rounded-2xl shadow-lg border border-emerald-200/50">
						<span className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></span>
						<p className="text-emerald-700 font-semibold">Ready to get started? Contact us today!</p>
            </div>
          </div>
        </div>
      </section>

		{/* Critical Moments Section */}
		    <section className="relative bg-gradient-to-br from-green-50 to-emerald-50 pt-12 md:pt-16 pb-24">
			<div className="w-[96%] md:w-[92%] lg:w-[88%] xl:w-[84%] mx-auto">
                <h3 className="text-center text-3xl md:text-5xl font-extrabold tracking-wide text-gray-800 mb-20 md:mb-28">
					ALWAYS HERE IN CRITICAL MOMENTS
				</h3>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-stretch">
					{/* Left image */}
					<div className="h-[260px] md:h-[520px]">
						<div className="h-full rounded-3xl overflow-hidden shadow-[0_12px_30px_rgba(0,0,0,0.15)] ring-1 ring-black/10">
							<img
								src="/small-hand-giving-handshake-large-hand.jpg"
								alt="Helping hands"
								className="w-full h-full object-cover"
							/>
                  </div>
                </div>

					{/* Right cards */}
					<div className="space-y-5 md:space-y-6">
						{[
							'Ambulance arrangement & home doctor visits',
							'Seamless hospital admission',
							'Daily health updates',
							'Recovering care after discharge for 1 week',
						].map((text, idx) => (
							<div key={idx} className="group relative rounded-2xl bg-emerald-600 text-white shadow-[0_12px_30px_rgba(0,0,0,0.15)] ring-1 ring-black/10 px-5 md:px-6 py-5 md:py-6 flex items-center gap-5">
								<div className="relative shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white flex items-center justify-center">
									<Plus className="absolute w-7 h-7 md:w-8 md:h-8 text-emerald-600 transition-all duration-300 ease-out opacity-100 scale-100 group-hover:opacity-0 group-hover:scale-50" />
									<Check className="absolute w-7 h-7 md:w-8 md:h-8 text-emerald-600 transition-all duration-300 ease-out opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100" />
                  </div>
								<p className="font-extrabold tracking-wide text-sm md:text-lg leading-snug">
									{text}
								</p>
                  </div>
						))}
            </div>
          </div>
        </div>
      </section>

		{/* Value Added Services Section */}
		<section className="relative bg-gradient-to-br from-green-50 to-emerald-50 py-16 md:py-24">
			<div className="w-[96%] md:w-[92%] lg:w-[88%] xl:w-[84%] mx-auto">
				{/* Section Header */}
				<div className="text-center mb-8">
				<div className="inline-flex items-center px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-semibold mb-6">
						<span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
						Services
					</div>
					<h2 className="font-black tracking-tight text-gray-900 leading-tight text-4xl sm:text-5xl lg:text-6xl mb-6">
						VALUE ADDED <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-600">SERVICES</span>
					</h2>
				</div>

								{/* Image */}
				<div className="flex justify-center">
					<div className="w-full max-w-7xl">
						<img
							src="/curve value added service.png"
							alt="Value Added Services"
							className="w-full h-auto rounded-3xl"
						/>
					</div>
				</div>
        </div>
      </section>

		{/* Pricing Section */}
		    <section className="relative bg-gradient-to-br from-green-50 to-emerald-50 py-14 md:py-20">
			<div className="w-[96%] md:w-[92%] lg:w-[88%] xl:w-[84%] mx-auto">
				{/* Top mini features */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-10 md:mb-14">
					{[
						{ icon: '/noun-care-7623607.svg', title: 'PROACTIVE CARE', desc: 'Daily updates and hospital visits.' },
						{ icon: '/noun-contact-100859.svg', title: 'ONE POINT CONTACT', desc: 'Always reachable for any need.' },
						{ icon: '/contact.svg', title: 'EMERGENCY READY', desc: 'Ambulance for emergency visits or immediate support.' },
					].map((item, idx) => (
						<div key={idx} className="flex items-center gap-10">
							<div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-emerald-800 shadow ring-1 ring-black/10 shrink-0 overflow-hidden">
								<img 
									src={item.icon} 
									alt="feature icon" 
									className="w-full h-full object-cover p-3 invert" 
									style={{ 
										objectPosition: idx === 1 ? 'center 2%' : 'center 22%' 
									}} 
								/>
							</div>
							<div>
								<p className="text-lg md:text-xl font-extrabold tracking-wide text-gray-800">{item.title}</p>
								<p className="text-xs md:text-sm text-gray-700/80 leading-relaxed max-w-sm">{item.desc}</p>
							</div>
						</div>
                  ))}
                </div>

				<h3 className="text-center text-3xl md:text-5xl font-extrabold tracking-wide text-gray-800 mb-10 md:mb-14">CHOOSE A PLAN</h3>

				{/* Progressive Pricing Card */}
				<div className="flex justify-center">
					<div className="w-full max-w-lg">
						<div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-gray-50 to-emerald-50/30 p-6 md:p-8 shadow-[0_25px_50px_rgba(0,0,0,0.08)] border border-gray-100/50 transition-all duration-500 will-change-transform hover:-translate-y-2 hover:shadow-[0_35px_70px_rgba(0,0,0,0.12)] min-h-[620px]">
							{/* Background Decorative Elements */}
							<div className="absolute inset-0 opacity-30">
								<div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400 rounded-full blur-3xl"></div>
								<div className="absolute bottom-0 left-0 w-24 h-24 bg-green-300 rounded-full blur-2xl"></div>
							</div>
							{/* Step 1: Plan Selection */}
							<div className="relative text-center mb-8">
								<div className="inline-flex bg-gradient-to-r from-gray-100 to-emerald-100 rounded-3xl p-2 shadow-inner">
									<button
										onClick={() => {
											setSelectedPlan('single');
											// Keep the selected duration when switching plans
											// setSelectedDuration('');
											// setShowPricing(false);
											// setShowCTA(false);
										}}
										className={`relative px-8 py-4 rounded-2xl font-bold transition-all duration-500 transform hover:scale-105 ${
											selectedPlan === 'single' 
												? 'bg-white text-emerald-700 shadow-lg shadow-emerald-500/20' 
												: 'text-gray-600 hover:text-emerald-600 hover:bg-white/50'
										}`}
									>
										{selectedPlan === 'single' && (
											<div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-green-500/10 rounded-2xl blur-xl"></div>
										)}
										<span className="relative z-10">Single Parent</span>
									</button>
									<button
										onClick={() => {
											setSelectedPlan('couple');
											// Keep the selected duration when switching plans
											// setSelectedDuration('');
											// setShowPricing(false);
											// setShowCTA(false);
										}}
										className={`relative px-8 py-4 rounded-2xl font-bold transition-all duration-500 transform hover:scale-105 ${
											selectedPlan === 'couple' 
												? 'bg-white text-emerald-700 shadow-lg shadow-emerald-500/20' 
												: 'text-gray-600 hover:text-emerald-600 hover:bg-white/50'
										}`}
									>
										{selectedPlan === 'couple' && (
											<div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-green-500/10 rounded-2xl blur-xl"></div>
										)}
										<span className="relative z-10">Both Parents</span>
									</button>
								</div>
							</div>

							{/* Step 2: Duration Selection */}
							{selectedPlan && (
								<div className="relative text-center mb-8 animate-in slide-in-from-top-4 duration-500">
									<p className="text-xl font-bold text-gray-800 mb-6">Select Plan Duration</p>
									<div className="relative inline-block dropdown-container">
										<button
											onClick={() => setShowDropdown(!showDropdown)}
											className="relative w-80 px-8 py-5 bg-white border-2 border-gray-200 rounded-2xl text-gray-800 font-bold text-lg text-center focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all duration-300 hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-500/25 cursor-pointer shadow-sm flex items-center justify-between"
										>
											<span className={selectedDuration ? 'text-gray-800' : 'text-gray-400'}>
												{selectedDuration ? `${selectedDuration} Month${parseInt(selectedDuration) > 1 ? 's' : ''}` : 'Choose duration...'}
											</span>
											<div className={`transition-transform duration-300 ${showDropdown ? 'rotate-180' : ''}`}>
												<svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
												</svg>
											</div>
										</button>
										
										{/* Custom Dropdown Menu */}
										{showDropdown && (
											<div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-emerald-200 rounded-2xl shadow-2xl overflow-hidden z-10 animate-in slide-in-from-top-2 duration-300">
												{[
													{ value: '', label: 'Choose duration...' },
													{ value: '1', label: '1 Month' },
													{ value: '6', label: '6 Months' },
													{ value: '12', label: '12 Months' }
												].map((option, index) => (
													<button
														key={index}
														onClick={() => {
															setSelectedDuration(option.value);
															setShowDropdown(false);
															setShowPricing(true);
															setShowCTA(false);
														}}
														className={`w-full px-6 py-4 text-left transition-all duration-200 hover:bg-emerald-50 ${
															selectedDuration === option.value 
																? 'bg-emerald-100 text-emerald-700 font-semibold' 
																: 'text-gray-700 hover:text-emerald-600'
														} ${
															index === 0 ? 'border-b border-gray-100' : ''
														}`}
													>
														{option.label}
													</button>
												))}
											</div>
										)}
									</div>
								</div>
							)}

							{/* Step 3: Pricing Display */}
							{showPricing && selectedDuration && (
								<div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 pb-8">
									{/* Plan Pricing with Discount */}
									<div className="relative bg-gradient-to-r from-white to-emerald-50/50 rounded-2xl p-6 ring-1 ring-emerald-200/30 shadow-lg">
										<div className="absolute top-3 right-3">
											<div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
										</div>
										<div className="text-center">
											<p className="text-xs font-semibold text-emerald-600 mb-2 uppercase tracking-wider">
												{parseInt(selectedDuration) === 1 ? 'Offer' : 'Special Offer'}
											</p>
											{selectedPlan === 'single' ? (
												<div>
													{/* Price Display */}
													<p className="text-2xl md:text-3xl font-black bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
														INR {(() => {
															const duration = parseInt(selectedDuration);
															if (duration === 1) return '3,000';
															if (duration === 6) return '16,500';
															if (duration === 12) return '30,000';
															return (3000 * duration).toLocaleString();
														})()}
													</p>
													{/* Original Price - Crossed Out - Only show for discounted plans */}
													{parseInt(selectedDuration) > 1 && (
														<p className="text-lg text-gray-500 line-through mt-1">
															INR {(() => {
																const duration = parseInt(selectedDuration);
																if (duration === 6) return '18,000';
																if (duration === 12) return '36,000';
																return (3000 * duration).toLocaleString();
															})()}
														</p>
													)}
													{/* Savings Badge - Only show when there are savings */}
													{(() => {
														const duration = parseInt(selectedDuration);
														const savings = duration === 6 ? 1500 : duration === 12 ? 6000 : 0;
														return savings > 0 ? (
															<div className="inline-block bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold mt-2">
																Save ₹{savings.toLocaleString()}
															</div>
														) : null;
													})()}
													{parseInt(selectedDuration) >= 6 && (
														<p className="text-xs font-medium text-emerald-600 mt-2">
															{parseInt(selectedDuration) === 12 ? '+30 days free' : '+15 days free'}
														</p>
													)}
												</div>
											) : (
												<div>
													{/* Price Display */}
													<p className="text-2xl md:text-3xl font-black bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
														INR {(() => {
															const duration = parseInt(selectedDuration);
															if (duration === 1) return '5,000';
															if (duration === 6) return '28,000';
															if (duration === 12) return '54,000';
															return (5000 * duration).toLocaleString();
														})()}
													</p>
													{/* Original Price - Crossed Out - Only show for discounted plans */}
													{parseInt(selectedDuration) > 1 && (
														<p className="text-lg text-gray-500 line-through mt-1">
															INR {(() => {
																const duration = parseInt(selectedDuration);
																if (duration === 6) return '30,000';
																if (duration === 12) return '60,000';
																return (5000 * duration).toLocaleString();
															})()}
														</p>
													)}
													{/* Savings Badge - Only show when there are savings */}
													{(() => {
														const duration = parseInt(selectedDuration);
														const savings = duration === 6 ? 2000 : duration === 12 ? 6000 : 0;
														return savings > 0 ? (
															<div className="inline-block bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold mt-2">
																Save ₹{savings.toLocaleString()}
															</div>
														) : null;
													})()}
													{parseInt(selectedDuration) >= 6 && (
														<p className="text-xs font-medium text-emerald-600 mt-2">
															{parseInt(selectedDuration) === 12 ? '+30 days free' : '+15 days free'}
														</p>
													)}
												</div>
											)}
										</div>
									</div>






									{/* Final CTA Button */}
									{showPricing && selectedDuration && (
										<div className="mt-8">
											<Button 
												onClick={() => navigate('/register', { 
													state: { 
														planInfo: { 
															type: selectedPlan, 
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
														} 
													} 
												})}
												className="relative w-full bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 hover:from-emerald-700 hover:via-green-700 hover:to-emerald-800 text-white rounded-2xl py-6 text-xl font-black shadow-2xl hover:shadow-emerald-500/25 transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 overflow-hidden group"
											>
												<div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
												<span className="relative z-10">CHOOSE THIS PLAN</span>
											</Button>
										</div>
									)}
								</div>
							)}

							{/* Initial Instructions */}
							{!selectedPlan && (
								<div className="text-center text-gray-500 animate-pulse">
									<p className="text-lg">Please select your plan type to continue</p>
								</div>
							)}

							{selectedPlan && !selectedDuration && (
								<div className="text-center text-gray-500 animate-pulse">
									<p className="text-lg">Please select your plan duration to see pricing</p>
								</div>
							)}
						</div>
					</div>
				</div>

				<p className="mt-8 text-center text-xs text-gray-700">* EMI / Package options available inside plans. Visit your required plan for more info.</p>
				<div className="mt-3 flex justify-center">
					<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow ring-1 ring-black/10">
						<Check className="w-4 h-4 text-emerald-600" />
						<span className="text-sm font-semibold text-gray-800">No Hidden Costs</span>
          </div>
          </div>
        </div>
		</section>

				

			{/* Optional Add-on Devices Section */}
			<section className="relative bg-gradient-to-b from-gray-50 to-white py-16 md:py-24">
				<div className="container mx-auto px-4">
					{/* Banner */}
					<div className="text-center mb-16">
						<div className="inline-block bg-emerald-50 px-6 py-2 rounded-full mb-4">
							<span className="text-emerald-700 text-sm font-medium">Medical Equipment</span>
						</div>
						<h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
							Optional Add-on Devices
						</h2>
						<p className="text-lg text-gray-600 max-w-2xl mx-auto">
							Subsidized medical equipment to support your care needs
						</p>
					</div>

					{/* Device Cards */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 max-w-7xl mx-auto">
						{[
							{
								image: '/61A4kG7ajUL.jpg',
								name: 'OXYGEN CONCENTRATOR'
							},
							{
								image: '/71lvXvLg2WL.jpg',
								name: 'NEBULIZER'
							},
							{
								image: '/71s886S0AaL.jpg',
								name: 'BP MACHINE'
							},
							{
								image: '/finger-pulsoximeter-mit-oled-anzeige-spo2-puls-monitor-4.jpg',
								name: 'SPO2 FINGER MONITOR'
							},
							{
								image: '/611o3qCtwbL.jpg',
								name: 'WEIGHING MACHINE'
							}
						].map((device, idx) => (
							<div key={idx} className="group relative">
								<div className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden">
									{/* Hover Animation Overlay */}
									<div className="absolute inset-0 bg-gradient-to-t from-emerald-500/20 via-emerald-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out"></div>
									
									{/* Card Content */}
									<div className="relative p-6 h-56 flex flex-col">
										{/* Image Container */}
										<div className="flex-1 flex items-center justify-center mb-4 relative overflow-hidden rounded-xl">
											<div className="absolute inset-0 bg-gradient-to-t from-emerald-100/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out"></div>
											<img 
												src={device.image} 
												alt={device.name}
												className="max-w-full max-h-32 object-contain relative z-10 group-hover:scale-110 transition-transform duration-500"
											/>
										</div>
										
										{/* Device Name */}
										<div className="text-center">
											<h3 className="font-bold text-gray-800 text-sm group-hover:text-emerald-700 transition-colors duration-300">
												{device.name}
											</h3>
										</div>
									</div>
									
									{/* Bottom Border Animation */}
									<div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-emerald-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out origin-left"></div>
								</div>
							</div>
						))}
					</div>
    </div>
			</section>

		{/* Testimonials Section */}
		<section className="relative bg-gradient-to-br from-green-50 to-emerald-50 py-16 md:py-24">
			<div className="w-[96%] md:w-[92%] lg:w-[88%] xl:w-[84%] mx-auto">
				{/* Section Header */}
				<div className="text-center mb-16">
					<div className="inline-flex items-center px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-semibold mb-6">
						<span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
						Customer Stories
					</div>
					
					<h2 className="font-black tracking-tight text-gray-900 leading-tight text-4xl sm:text-5xl lg:text-6xl mb-6">
						WHAT OUR
						<br />
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-600">FAMILIES SAY</span>
					</h2>
					
					<p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
						Real experiences from families who trust us with their loved ones' care
					</p>
				</div>

				{/* Coming Soon Content */}
				<div className="text-center">
					<div className="max-w-2xl mx-auto">
						{/* Coming Soon Icon */}
						<div className="w-24 h-24 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
							<svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
						</div>
						
						{/* Coming Soon Text */}
						<div className="bg-white rounded-3xl p-8 md:p-12 shadow-[0_20px_40px_rgba(0,0,0,0.1)] border border-emerald-100/50">
							<h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
								Testimonials Coming Soon
							</h3>
							<p className="text-lg text-gray-600 mb-6 leading-relaxed">
								We're collecting authentic stories from families who trust us with their loved ones' care.
							</p>
							
							{/* Progress Indicator */}
							<div className="flex items-center justify-center gap-2 mb-6">
								<div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
								<div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
								<div className="w-3 h-3 bg-emerald-300 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
							</div>
						</div>
						
						{/* Bottom Message */}
						<div className="mt-8">
							<p className="text-emerald-600 font-medium">
								Building trust through real experiences
							</p>
						</div>
					</div>
				</div>
			</div>
		</section>

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
								© 2024 Senior Care Plus. All rights reserved.
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
							</div>
						</div>
					</div>
				</div>
			</div>
		</footer>
    </>
  );
};

export default Index;


