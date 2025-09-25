import { Link } from 'react-router-dom'
import { ShieldAlert } from 'lucide-react'
import { Button } from '../components/ui/button'
import Footer from '@/components/Footer'

export function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-red-50 to-white p-4">
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <ShieldAlert className="h-24 w-24 text-red-500" />
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Access Denied
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
            You don't have permission to access this page. Please contact your administrator if you believe this is an error.
          </p>
          
          <div className="space-x-4">
            <Button asChild>
              <Link to="/dashboard">
                Go to Dashboard
              </Link>
            </Button>
            
            <Button variant="outline" asChild>
              <Link to="/">
                Go Home
              </Link>
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}