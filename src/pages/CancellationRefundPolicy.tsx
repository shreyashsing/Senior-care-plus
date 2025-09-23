import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, RefreshCw, Clock, AlertCircle, CheckCircle, XCircle, DollarSign, Calendar } from 'lucide-react';
import Navbar from '@/components/Navbar';

const CancellationRefundPolicy = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50 pt-20">
        {/* Header Section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              className="mb-6 flex items-center gap-2 text-emerald-600 border-emerald-300 hover:bg-emerald-50"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            
            <div className="text-center mb-12">
              <div className="inline-flex items-center px-4 py-2 bg-emerald-100 border border-emerald-300 rounded-full text-emerald-800 text-sm font-semibold mb-6">
                <RefreshCw className="w-4 h-4 mr-2" />
                Cancellation & Refunds
              </div>
              
              <h1 className="text-4xl sm:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                  Cancellation & Refund Policy
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Clear guidelines for cancellations, refunds, and service modifications to ensure transparency and fairness.
              </p>
              
              <div className="mt-6 text-sm text-gray-500">
                <p>Last updated: September 23, 2025</p>
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-white shadow-lg border-emerald-100">
              <CardContent className="p-8 sm:p-12">
                <div className="prose prose-gray max-w-none">
                  
                  {/* Overview */}
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">1</span>
                      </div>
                      Policy Overview
                    </h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      At SeniorCare Plus, we understand that circumstances may require service modifications or cancellations. This policy outlines our procedures for cancellations, refunds, and service adjustments while ensuring continuity of care for our members.
                    </p>
                    
                    <div className="mb-4 bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <p className="text-blue-800 font-semibold mb-2">Related Documents:</p>
                      <div className="flex flex-wrap gap-2">
                        <button 
                          onClick={() => navigate('/terms-and-conditions')}
                          className="px-3 py-1 bg-emerald-600 text-white rounded text-sm hover:bg-emerald-700 transition-colors"
                        >
                          Terms & Conditions
                        </button>
                        <button 
                          onClick={() => navigate('/privacy-policy')}
                          className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                        >
                          Privacy Policy
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4 mt-6">
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                          <div>
                            <p className="text-green-800 font-semibold">7-Day Cancellation Period</p>
                            <p className="text-green-700 text-sm">
                              Cancel your order within 7 days by calling your care coordinator
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-start gap-2">
                          <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                          <div>
                            <p className="text-blue-800 font-semibold">Refund Policy</p>
                            <p className="text-blue-700 text-sm">
                              Full refund minus any services consumed during the week
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>


                  {/* Refund Eligibility */}
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-white" />
                      </div>
                      Refund Eligibility
                    </h2>
                    
                    <h3 className="text-lg font-semibold text-emerald-700 mb-3">✅ Eligible for Refund (7-Day Window)</h3>
                    <ul className="space-y-2 text-gray-700 ml-6 list-disc mb-4">
                      <li>Cancellation within 7 days by calling care coordinator</li>
                      <li>Service not rendered due to our inability to provide care</li>
                      <li>Technical issues preventing service access for more than 3 days</li>
                      <li>Duplicate payments or billing errors</li>
                      <li>Medical emergencies requiring immediate care change</li>
                      <li>Permanent relocation outside our service area</li>
                    </ul>

                    <h3 className="text-lg font-semibold text-red-700 mb-3">❌ Refund Calculated Based on Consumption</h3>
                    <ul className="space-y-2 text-gray-700 ml-6 list-disc">
                      <li>Services already consumed during the week will be deducted from refund</li>
                      <li>Care coordinator consultations attended</li>
                      <li>Medical appointments scheduled through our service</li>
                      <li>Emergency support services utilized</li>
                      <li>Administrative setup and onboarding completed</li>
                      <li>Third-party provider fees (hospital, doctor charges) - non-refundable</li>
                    </ul>
                  </div>

                  {/* Refund Process */}
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
                        <RefreshCw className="w-5 h-5 text-white" />
                      </div>
                      Refund Process
                    </h2>
                    
                    <div className="space-y-4">
                      <div className="flex items-start gap-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          1
                        </div>
                        <div>
                          <p className="text-blue-800 font-semibold">Submit Cancellation Request</p>
                          <p className="text-blue-700 text-sm">Call your assigned care coordinator within 7 days to initiate cancellation</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          2
                        </div>
                        <div>
                          <p className="text-blue-800 font-semibold">Service Usage Review</p>
                          <p className="text-blue-700 text-sm">Care coordinator reviews services consumed during the week to calculate refund amount</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          3
                        </div>
                        <div>
                          <p className="text-blue-800 font-semibold">Refund Calculation</p>
                          <p className="text-blue-700 text-sm">You'll receive breakdown of consumed services and final refund amount calculation</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          4
                        </div>
                        <div>
                          <p className="text-blue-800 font-semibold">Refund Processing</p>
                          <p className="text-blue-700 text-sm">Final refund amount processed within 5-7 business days to original payment method</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-green-800 font-semibold mb-2">Refund Timeline:</p>
                      <ul className="text-green-700 text-sm space-y-1">
                        <li>• Credit/Debit Cards: 5-7 business days</li>
                        <li>• Bank Transfer: 3-5 business days</li>
                        <li>• Digital Wallets: 1-3 business days</li>
                        <li>• UPI: 1-2 business days</li>
                      </ul>
                    </div>
                  </div>
                  {/* Contact Information */}
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">8</span>
                      </div>
                      Contact Information
                    </h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      For cancellations, refunds, or plan modifications:
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                        <p className="text-emerald-800 font-semibold">Customer Support</p>
                        <p className="text-emerald-700">Email: support@seniorcareplus.com</p>
                        <p className="text-emerald-700">Phone: +91 9975567202</p>
                        <p className="text-emerald-700 text-sm mt-2">Available: Mon-Fri, 9 AM - 6 PM IST</p>
                      </div>
                      
                    </div>
                  </div>

                  {/* Policy Updates */}
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">9</span>
                      </div>
                      Policy Updates
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                      This policy may be updated periodically. Significant changes will be communicated via email and posted on our website 30 days before taking effect. Continued use of our services after changes indicates acceptance of the updated policy.
                    </p>
                  </div>

                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </>
  );
};

export default CancellationRefundPolicy;