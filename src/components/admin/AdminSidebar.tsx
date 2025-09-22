import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Users,
  CreditCard,
  Calendar,
  HandHeart,
  Hospital,
  X,
  LogOut
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAdminAuth } from '@/contexts/AdminAuthContext'

interface AdminSidebarProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  activeSection?: string
  setActiveSection?: (section: string) => void
}

const navigationItems = [
  {
    id: 'overview',
    label: 'Dashboard Overview',
    description: 'System statistics and summary',
    icon: Users,
    path: '/admin/dashboard',
    section: 'overview'
  },
  {
    id: 'patients',
    label: 'Patient Management',
    description: 'View and manage patients',
    icon: Users,
    path: '/admin/dashboard',
    section: 'patients'
  },
  {
    id: 'appointments',
    label: 'Appointments',
    description: 'Manage appointments',
    icon: Calendar,
    path: '/admin/dashboard',
    section: 'appointments'
  },
  {
    id: 'services',
    label: 'Service Requests',
    description: 'Handle service requests',
    icon: HandHeart,
    path: '/admin/dashboard',
    section: 'services'
  },
  {
    id: 'hospital-partners',
    label: 'Hospital Partners',
    description: 'Manage hospital partnerships',
    icon: Hospital,
    path: '/admin/hospital-partners',
    section: 'hospital-partners'
  }
]

const AdminSidebar: React.FC<AdminSidebarProps> = ({ 
  sidebarOpen, 
  setSidebarOpen, 
  activeSection = 'overview',
  setActiveSection 
}) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { logout } = useAdminAuth()

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/admin/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const getCurrentActiveSection = () => {
    if (location.pathname === '/admin/hospital-partners') {
      return 'hospital-partners'
    }
    return activeSection
  }

  const handleNavigation = (item: typeof navigationItems[0]) => {
    if (item.path === '/admin/hospital-partners') {
      navigate(item.path)
    } else {
      navigate('/admin/dashboard')
      if (setActiveSection) {
        setActiveSection(item.section)
      }
    }
    setSidebarOpen(false)
  }

  const currentActiveSection = getCurrentActiveSection()

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-6 bg-blue-600">
          <div className="flex items-center">
            <img src="/logo.svg" alt="Logo" className="h-8 w-auto" />
            <span className="ml-2 text-white font-semibold">Admin Portal</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white hover:text-blue-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Admin Info */}
        <div className="p-6 bg-blue-50 border-b">
          <div className="flex items-center">
            <div className="bg-blue-600 text-white rounded-full p-3">
              <Users className="h-6 w-6" />
            </div>
            <div className="ml-3">
              <h3 className="font-semibold text-gray-900">Admin User</h3>
              <p className="text-sm text-blue-600">System Administrator</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigationItems.map((item) => {
            const IconComponent = item.icon
            const isActive = currentActiveSection === item.section
            
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item)}
                className={`w-full flex items-center px-3 py-3 text-left rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <IconComponent className="h-5 w-5 mr-3" />
                <div>
                  <div className="font-medium">{item.label}</div>
                  <div className="text-xs text-gray-500">{item.description}</div>
                </div>
              </button>
            )
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t">
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full justify-start text-gray-600 hover:text-gray-900"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </>
  )
}

export default AdminSidebar