import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'

export function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-white p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <img 
              src="/final_logo.svg" 
              alt="Peace of Mind Concierge" 
              className="h-12 w-auto"
            />
          </div>
          <CardTitle className="text-2xl text-center">Need Help with Login?</CardTitle>
          <CardDescription className="text-center">
            Contact our support team for assistance with your SeniorCare Plus account
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
            <h3 className="font-semibold text-emerald-800 mb-2">To access your account, you need:</h3>
            <ul className="text-sm text-emerald-700 space-y-1">
              <li>• Your Senior Care ID (found on your E-card)</li>
              <li>• Or your registered phone number</li>
              <li>• Your date of birth</li>
            </ul>
          </div>

          <div className="text-center space-y-4">
            <p className="text-sm text-gray-600">
              Can't find your Senior Care ID or need help logging in?
            </p>
            
            <div className="space-y-2">
              <Button className="w-full" asChild>
                <Link to="/contact">Contact Support</Link>
              </Button>
              
              <Button variant="outline" className="w-full" asChild>
                <Link to="/login">Back to Login</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}