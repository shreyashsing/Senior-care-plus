import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'

interface NavbarProps {
  isHomePage?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ isHomePage = false }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  const scrollToSection = (sectionId: string) => {
    if (location.pathname === '/') {
      // If already on home page, just scroll
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      // If on different page, navigate to home first then scroll
      navigate('/');
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
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
            {isHomePage ? (
              <a
                href="#home"
                className="text-gray-800 hover:text-emerald-600 transition-colors duration-300 font-medium text-shadow-sm shadow-white/80"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('home');
                }}
              >
                Home
              </a>
            ) : (
              <button
                onClick={() => navigate('/')}
                className="text-gray-800 hover:text-emerald-600 transition-colors duration-300 font-medium text-shadow-sm shadow-white/80"
              >
                Home
              </button>
            )}
            
            <button
              onClick={() => navigate('/about')}
              className="text-gray-800 hover:text-emerald-600 transition-colors duration-300 font-medium text-shadow-sm shadow-white/80"
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
            
            <button
              onClick={() => navigate('/contact')}
              className="text-gray-800 hover:text-emerald-600 transition-colors duration-300 font-medium text-shadow-sm shadow-white/80"
            >
              Contact
            </button>

            {/* Home page specific navigation items */}
          
            
            <Button
              onClick={() => navigate('/login')}
              className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-6 py-2 rounded-full font-semibold transition-all duration-300 hover:scale-105"
            >
              Login
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="text-white hover:text-emerald-400 transition-colors duration-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden bg-white/90 backdrop-blur-md rounded-lg mt-2 p-4 border border-gray-200/60 shadow-lg">
            <div className="flex flex-col space-y-4">
              {isHomePage ? (
                <a
                  href="#home"
                  className="text-gray-800 hover:text-emerald-600 transition-colors duration-300 font-medium"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowMobileMenu(false);
                    scrollToSection('home');
                  }}
                >
                  Home
                </a>
              ) : (
                <button
                  onClick={() => {
                    setShowMobileMenu(false);
                    navigate('/');
                  }}
                  className="text-left text-gray-800 hover:text-emerald-600 transition-colors duration-300 font-medium"
                >
                  Home
                </button>
              )}
              
              <button
                onClick={() => {
                  setShowMobileMenu(false);
                  navigate('/about');
                }}
                className="text-left text-gray-800 hover:text-emerald-600 transition-colors duration-300 font-medium"
              >
                About Us
              </button>
              
              <button
                onClick={() => {
                  setShowMobileMenu(false);
                  navigate('/partners');
                }}
                className="text-left text-gray-800 hover:text-emerald-600 transition-colors duration-300 font-medium"
              >
                Partners
              </button>
              
              <button
                onClick={() => {
                  setShowMobileMenu(false);
                  navigate('/services');
                }}
                className="text-left text-gray-800 hover:text-emerald-600 transition-colors duration-300 font-medium"
              >
                Services
              </button>
              
              <button
                onClick={() => {
                  setShowMobileMenu(false);
                  navigate('/pricing');
                }}
                className="text-left text-gray-800 hover:text-emerald-600 transition-colors duration-300 font-medium"
              >
                Pricing
              </button>
              
              <button
                onClick={() => {
                  setShowMobileMenu(false);
                  navigate('/contact');
                }}
                className="text-left text-gray-800 hover:text-emerald-600 transition-colors duration-300 font-medium"
              >
                Contact
              </button>

              {/* Home page specific navigation items */}
             
              
              <Button
                onClick={() => {
                  setShowMobileMenu(false);
                  navigate('/login');
                }}
                className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-6 py-2 rounded-full font-semibold transition-all duration-300 hover:scale-105 w-full"
              >
                Login
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar