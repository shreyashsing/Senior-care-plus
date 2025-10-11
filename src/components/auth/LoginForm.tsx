import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Calendar, Mail, Phone } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { Alert, AlertDescription } from '../ui/alert'
import { authenticatePatient, setPatientSession, getPatientProfile } from '../../lib/patientAuth'
import { usePatientAuth } from '../../contexts/PatientAuthContext'
import { useToast } from '../../hooks/use-toast'

const loginSchema = z.object({
  identifier: z.string().min(1, 'Please enter your Senior Care ID or Phone Number'),
  dateOfBirth: z.string().min(1, 'Date of birth is required')
})

type LoginFormData = z.infer<typeof loginSchema>

export function LoginForm() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { login } = usePatientAuth()
  const [isLoading, setIsLoading] = React.useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true)
      
      const authData = await authenticatePatient({
        identifier: data.identifier,
        dateOfBirth: data.dateOfBirth
      })

      // Store auth data for session management
      setPatientSession(authData)

      // Pass auth data to context (it will handle the conversion)
      login(authData)
      
      toast({
        title: "Login Successful! 🎉",
        description: `Welcome back, ${authData.name}!`,
      })

      // Navigate to dashboard
      navigate('/dashboard')
      
    } catch (error) {
      toast({
        title: "Login Failed",
        description: error instanceof Error ? error.message : "Invalid credentials",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

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
          <CardTitle className="text-2xl text-center">Welcome back</CardTitle>
          <CardDescription className="text-center">
            Sign in to your SeniorCare Plus account
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="identifier">Senior Care ID or Phone Number</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="identifier"
                  type="text"
                  placeholder="SC2025123456 or 9876543210"
                  className="pl-10"
                  {...register('identifier')}
                  disabled={isLoading || isSubmitting}
                />
              </div>
              {errors.identifier && (
                <p className="text-sm text-red-600">{errors.identifier.message}</p>
              )}
              <p className="text-xs text-gray-500">
                Use your Senior Care ID (e.g., SC2025123456) or registered phone number
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="dateOfBirth"
                  type="date"
                  className="pl-10"
                  {...register('dateOfBirth')}
                  disabled={isLoading || isSubmitting}
                />
              </div>
              {errors.dateOfBirth && (
                <p className="text-sm text-red-600">{errors.dateOfBirth.message}</p>
              )}
            </div>

            <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200">
              <p className="text-sm text-emerald-800">
                <strong>Need help finding your credentials?</strong><br />
                Your Senior Care ID is on your E-card. You can also use your registered phone number.
              </p>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || isSubmitting}
            >
              {isLoading || isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </Button>
            
            <div className="text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-emerald-600 hover:text-emerald-800 hover:underline font-medium"
              >
                Register here
              </Link>
            </div>

            <div className="text-center">
              <Link
                to="/contact"
                className="text-sm text-emerald-600 hover:text-emerald-800 hover:underline"
              >
                Need help? Contact Support
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}