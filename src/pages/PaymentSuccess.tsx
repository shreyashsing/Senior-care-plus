import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Download, Home, Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Toaster } from '@/components/ui/toaster';

const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(true);
  const [registrationData, setRegistrationData] = useState<any>(null);

  useEffect(() => {
    const processPaymentSuccess = async () => {
      try {
        // Get payment details from URL parameters
        const paymentId = searchParams.get('razorpay_payment_id');
        const orderId = searchParams.get('razorpay_order_id');
        const signature = searchParams.get('razorpay_signature');

        if (!paymentId || !orderId || !signature) {
          throw new Error('Missing payment details');
        }

        // In a real application, you would verify the payment with your backend
        // For now, we'll simulate a successful registration
        
        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Mock registration data
        const mockData = {
          patients: [
            {
              seniorCareId: `SC${Date.now()}`,
              name: 'John Doe',
              dateOfBirth: '1950-01-01',
              sex: 'Male',
              phoneNumber: '+91 9876543210'
            }
          ],
          planType: 'single',
          duration: '12',
          price: 30000,
          paymentId,
          orderId
        };

        setRegistrationData(mockData);
        setIsProcessing(false);

        toast({
          title: "Registration Complete! 🎉",
          description: "Your payment was successful and your E-card has been generated.",
          variant: "default",
        });

      } catch (error) {
        console.error('Payment processing error:', error);
        setIsProcessing(false);
        toast({
          title: "Payment Processing Error",
          description: "There was an issue processing your payment. Please contact support.",
          variant: "destructive",
        });
      }
    };

    processPaymentSuccess();
  }, [searchParams]);

  const handleDownloadCard = () => {
    // Navigate to registration success page for card download
    navigate('/registration-success', {
      state: { registrationData }
    });
  };

  const handleGoHome = () => {
    navigate('/');
  };

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-emerald-600" />
              <h2 className="text-xl font-semibold text-gray-900">Processing Payment</h2>
              <p className="text-gray-600 text-center">
                Please wait while we process your payment and create your account...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-8">
      <div className="max-w-2xl mx-auto p-6">
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-emerald-100 p-3">
                <CheckCircle className="h-12 w-12 text-emerald-600" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-emerald-800">
              Payment Successful!
            </CardTitle>
            <CardDescription className="text-lg text-gray-600">
              Welcome to Senior Care Plus! Your registration is complete.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {registrationData && (
              <>
                {/* Payment Details */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Payment Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600">Plan Type:</span>
                      <span className="ml-2 font-medium capitalize">{registrationData.planType}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Duration:</span>
                      <span className="ml-2 font-medium">{registrationData.duration} months</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Amount Paid:</span>
                      <span className="ml-2 font-medium">₹{registrationData.price.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Payment ID:</span>
                      <span className="ml-2 font-medium text-xs">{registrationData.paymentId}</span>
                    </div>
                  </div>
                </div>

                {/* Patient Details */}
                <div className="bg-emerald-50 rounded-lg p-4">
                  <h3 className="font-semibold text-emerald-800 mb-3">Registered Members</h3>
                  {registrationData.patients.map((patient: any, index: number) => (
                    <div key={index} className="mb-3 last:mb-0">
                      <div className="text-sm space-y-1">
                        <div>
                          <span className="text-emerald-700">Name:</span>
                          <span className="ml-2 font-medium">{patient.name}</span>
                        </div>
                        <div>
                          <span className="text-emerald-700">Senior Care ID:</span>
                          <span className="ml-2 font-medium">{patient.seniorCareId}</span>
                        </div>
                        <div>
                          <span className="text-emerald-700">Phone:</span>
                          <span className="ml-2 font-medium">{patient.phoneNumber}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button
                    onClick={handleDownloadCard}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download E-Card
                  </Button>
                  <Button
                    onClick={handleGoHome}
                    variant="outline"
                    className="flex-1 border-emerald-600 text-emerald-600 hover:bg-emerald-50 py-3"
                  >
                    <Home className="w-4 h-4 mr-2" />
                    Go to Home
                  </Button>
                </div>
              </>
            )}

            {!registrationData && (
              <div className="text-center py-8">
                <p className="text-gray-600">Unable to load registration details.</p>
                <Button
                  onClick={handleGoHome}
                  variant="outline"
                  className="mt-4"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Go to Home
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <Toaster />
    </div>
  );
};

export default PaymentSuccess;