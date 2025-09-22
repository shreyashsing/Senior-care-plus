import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Button } from '../ui/button'
import { 
  LayoutDashboard, 
  Hospital, 
  MessageSquare,
  Users, 
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react'
import { useAdminAuth } from '../../contexts/AdminAuthContext'

export const AdminNav: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { logout } = useAdminAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navigation = [
    {
      name: 'Dashboard',
      href: '/admin/dashboard',
      icon: LayoutDashboard,
      description: 'Overview and analytics'
    },
    {
      name: 'Hospital Partners',
      href: '/admin/hospital-partners',
      icon: Hospital,
      description: 'Manage partner hospitals'
    },
    {
      name: 'Contact Messages',
      href: '/admin/contacts',
      icon: MessageSquare,
      description: 'Customer inquiries'
    }
  ]

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/admin/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const isActivePage = (href: string) => {
    return location.pathname === href
  }

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:block fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-200 z-40">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 py-6 border-b border-gray-200">
            <img
              src="/logo.svg"
              alt="Senior Care Logo"
              className="w-10 h-10"
            />
            <div>
              <h1 className="text-lg font-bold text-gray-900">Senior Care</h1>
              <p className="text-sm text-gray-500">Admin Portal</p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 px-4 py-6">
            <nav className="space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = isActivePage(item.href)
                
                return (
                  <button
                    key={item.name}
                    onClick={() => navigate(item.href)}
                    className={`w-full flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-600' : 'text-gray-400'}`} />
                    <div className="text-left">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs text-gray-500">{item.description}</div>
                    </div>
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Logout */}
          <div className="px-4 py-6 border-t border-gray-200">
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="w-full justify-start text-gray-700 hover:text-red-600 hover:bg-red-50"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="lg:hidden">
        {/* Mobile Header */}
        <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
          <div className="flex items-center justify-between px-4 py-4">
            <div className="flex items-center gap-3">
              <img
                src="/logo.svg"
                alt="Senior Care Logo"
                className="w-8 h-8"
              />
              <div>
                <h1 className="text-lg font-bold text-gray-900">Senior Care</h1>
                <p className="text-xs text-gray-500">Admin Portal</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>
          </div>
        </header>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setMobileMenuOpen(false)} />
        )}

        {/* Mobile Menu */}
        <div className={`fixed top-0 right-0 bottom-0 w-80 bg-white z-50 transform transition-transform duration-300 ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <div className="flex flex-col h-full">
            {/* Mobile Menu Header */}
            <div className="flex items-center justify-between px-6 py-6 border-b border-gray-200">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
                <p className="text-sm text-gray-500">Navigate admin portal</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="w-6 h-6" />
              </Button>
            </div>

            {/* Mobile Navigation Links */}
            <div className="flex-1 px-4 py-6">
              <nav className="space-y-2">
                {navigation.map((item) => {
                  const Icon = item.icon
                  const isActive = isActivePage(item.href)
                  
                  return (
                    <button
                      key={item.name}
                      onClick={() => {
                        navigate(item.href)
                        setMobileMenuOpen(false)
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-lg transition-colors ${
                        isActive
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-600' : 'text-gray-400'}`} />
                      <div className="text-left">
                        <div className="font-medium">{item.name}</div>
                        <div className="text-xs text-gray-500">{item.description}</div>
                      </div>
                    </button>
                  )
                })}
              </nav>
            </div>

            {/* Mobile Logout */}
            <div className="px-4 py-6 border-t border-gray-200">
              <Button
                onClick={() => {
                  handleLogout()
                  setMobileMenuOpen(false)
                }}
                variant="ghost"
                className="w-full justify-start text-gray-700 hover:text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer for content (desktop only) */}
      <div className="hidden lg:block w-64" />
      
      {/* Spacer for mobile header */}
      <div className="lg:hidden h-20" />
    </>
  )
}