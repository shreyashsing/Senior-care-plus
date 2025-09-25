import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, FileText, Shield, Clock, Users, AlertTriangle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const TermsAndConditions = () => {
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
                <FileText className="w-4 h-4 mr-2" />
                Legal Documents
              </div>
              
              <h1 className="text-4xl sm:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                  Terms and Conditions
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Please read these terms and conditions carefully before using SeniorCare Plus services.
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
                  
                  {/* Introduction */}
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">1</span>
                      </div>
                      Introduction
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                      Welcome to SeniorCare Plus ("we," "our," or "us"). These Terms and Conditions ("Terms") govern your use of our healthcare concierge services, website, and mobile application (collectively, the "Services"). By accessing or using our Services, you agree to be bound by these Terms.
                    </p>
                  </div>

                  {/* Definitions */}
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">2</span>
                      </div>
                      Definitions
                    </h2>
                    <ul className="space-y-2 text-gray-700">
                      <li><strong>"Services"</strong> means healthcare coordination, hospital liaison, medical concierge, and related healthcare support services provided by SeniorCare Plus.</li>
                      <li><strong>"User" or "You"</strong> means any individual who accesses or uses our Services.</li>
                      <li><strong>"Patient"</strong> means the individual receiving healthcare services coordinated through our platform.</li>
                      <li><strong>"Healthcare Providers"</strong> means licensed medical professionals, hospitals, and medical facilities in our network.</li>
                      <li><strong>"Care Plan"</strong> means the customized healthcare coordination package selected by the User.</li>
                    </ul>
                  </div>

                  {/* Service Description */}
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">3</span>
                      </div>
                      Service Description
                    </h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      SeniorCare Plus provides healthcare coordination and concierge services including but not limited to:
                    </p>
                    <ul className="space-y-2 text-gray-700 ml-6 list-disc">
                      <li>Doctor appointment scheduling and coordination</li>
                      <li>Hospital admission support and liaison services</li>
                      <li>Medical record management and coordination</li>
                      <li>Emergency healthcare support</li>
                      <li>Medication management assistance</li>
                      <li>Health monitoring and follow-up coordination</li>
                      <li>Family communication and updates</li>
                    </ul>
                    <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                        <div>
                          <p className="text-amber-800 font-semibold">Important Notice</p>
                          <p className="text-amber-700 text-sm">
                            We are NOT healthcare providers. We coordinate and facilitate access to healthcare services but do not provide medical diagnosis, treatment, or medical advice.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* User Responsibilities */}
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">4</span>
                      </div>
                      User Responsibilities
                    </h2>
                    <p className="text-gray-700 leading-relaxed mb-4">By using our Services, you agree to:</p>
                    <ul className="space-y-2 text-gray-700 ml-6 list-disc">
                      <li>Provide accurate, complete, and current information about yourself and the Patient</li>
                      <li>Maintain the confidentiality of your account credentials</li>
                      <li>Notify us immediately of any unauthorized use of your account</li>
                      <li>Comply with all applicable laws and regulations</li>
                      <li>Pay all fees associated with your chosen Care Plan</li>
                      <li>Cooperate with our staff and Healthcare Providers</li>
                      <li>Follow all medical advice provided by qualified Healthcare Providers</li>
                    </ul>
                  </div>

                  {/* Payment Terms */}
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">5</span>
                      </div>
                      Payment Terms
                    </h2>
                    <ul className="space-y-2 text-gray-700 ml-6 list-disc">
                      <li>All fees are due in advance and are non-refundable except as stated in our Cancellation/Refund Policy</li>
                      <li>Subscription fees are charged at the beginning of each billing cycle</li>
                      <li>Additional services may incur extra charges, which will be communicated in advance</li>
                      <li>We reserve the right to modify our pricing with 30 days notice</li>
                      <li>Late payments may result in suspension of services</li>
                    </ul>
                  </div>

                  {/* Privacy and Data Protection */}
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
                        <Shield className="w-5 h-5 text-white" />
                      </div>
                      Privacy and Data Protection
                    </h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      We are committed to protecting your privacy and personal health information. Our collection, use, and disclosure of your information is governed by our Privacy Policy, which is incorporated into these Terms by reference. We comply with applicable healthcare privacy laws.
                    </p>
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <p className="text-blue-800 font-semibold mb-2">Related Documents:</p>
                      <div className="flex flex-wrap gap-2">
                        <button 
                          onClick={() => navigate('/privacy-policy')}
                          className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                        >
                          Privacy Policy
                        </button>
                        <button 
                          onClick={() => navigate('/cancellation-refund-policy')}
                          className="px-3 py-1 bg-emerald-600 text-white rounded text-sm hover:bg-emerald-700 transition-colors"
                        >
                          Cancellation & Refund Policy
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Limitations of Service */}
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">6</span>
                      </div>
                      Limitations of Service
                    </h2>
                    <ul className="space-y-2 text-gray-700 ml-6 list-disc">
                      <li>Services are subject to availability of Healthcare Providers</li>
                      <li>Emergency services are limited to coordination and may not be available 24/7</li>
                      <li>We cannot guarantee specific medical outcomes</li>
                      <li>Geographic limitations may apply to certain services</li>
                      <li>Services may be modified or discontinued with reasonable notice</li>
                    </ul>
                  </div>

                  {/* Liability and Disclaimers */}
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">7</span>
                      </div>
                      Liability and Disclaimers
                    </h2>
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
                      <p className="text-red-800 font-semibold mb-2">LIMITATION OF LIABILITY</p>
                      <p className="text-red-700 text-sm">
                        TO THE MAXIMUM EXTENT PERMITTED BY LAW, SENIORCARE PLUS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES.
                      </p>
                    </div>
                    <ul className="space-y-2 text-gray-700 ml-6 list-disc">
                      <li>We are not responsible for the quality of care provided by Healthcare Providers</li>
                      <li>We are not liable for medical malpractice or negligence by third parties</li>
                      <li>Our total liability is limited to the amount paid for Services in the preceding 12 months</li>
                      <li>Services are provided "as is" without warranties of any kind</li>
                    </ul>
                  </div>

                  {/* Termination */}
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">8</span>
                      </div>
                      Termination
                    </h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      Either party may terminate this agreement:
                    </p>
                    <ul className="space-y-2 text-gray-700 ml-6 list-disc">
                      <li>You may cancel your subscription at any time through your account settings</li>
                      <li>We may terminate services for breach of these Terms</li>
                      <li>We may terminate services with 30 days notice for business reasons</li>
                      <li>Upon termination, you remain responsible for all accrued charges</li>
                    </ul>
                  </div>

                  {/* Governing Law */}
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">9</span>
                      </div>
                      Governing Law and Dispute Resolution
                    </h2>
                    <ul className="space-y-2 text-gray-700 ml-6 list-disc">
                      <li>These Terms are governed by the laws of India</li>
                      <li>Any disputes shall be resolved through binding arbitration</li>
                      <li>Arbitration shall be conducted in accordance with Indian Arbitration and Conciliation Act</li>
                      <li>The seat of arbitration shall be Mumbai, India</li>
                    </ul>
                  </div>

                  {/* Changes to Terms */}
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">10</span>
                      </div>
                      Changes to Terms
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                      We reserve the right to modify these Terms at any time. We will notify users of significant changes via email or through our platform. Continued use of our Services after changes constitutes acceptance of the modified Terms.
                    </p>
                  </div>

                  

                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
      
      <Footer />
    </>
  );
};

export default TermsAndConditions;