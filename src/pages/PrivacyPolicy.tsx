import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Shield, Lock, Eye, Users, Database, AlertTriangle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 pt-20">
        {/* Header Section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              className="mb-6 flex items-center gap-2 text-blue-600 border-blue-300 hover:bg-blue-50"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            
            <div className="text-center mb-12">
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 border border-blue-300 rounded-full text-blue-800 text-sm font-semibold mb-6">
                <Shield className="w-4 h-4 mr-2" />
                Privacy & Security
              </div>
              
              <h1 className="text-4xl sm:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Privacy Policy
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Your privacy is fundamental to our mission. Learn how we protect your personal and health information.
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
            <Card className="bg-white shadow-lg border-blue-100">
              <CardContent className="p-8 sm:p-12">
                <div className="prose prose-gray max-w-none">
                  
                  {/* Introduction */}
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">1</span>
                      </div>
                      Introduction
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                      SeniorCare Plus ("we," "our," or "us") is committed to protecting your privacy and the confidentiality of your personal health information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our healthcare coordination services.
                    </p>
                    
                    <div className="mt-4 bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                      <p className="text-emerald-800 font-semibold mb-2">Related Documents:</p>
                      <div className="flex flex-wrap gap-2">
                        <button 
                          onClick={() => navigate('/terms-and-conditions')}
                          className="px-3 py-1 bg-emerald-600 text-white rounded text-sm hover:bg-emerald-700 transition-colors"
                        >
                          Terms & Conditions
                        </button>
                        <button 
                          onClick={() => navigate('/cancellation-refund-policy')}
                          className="px-3 py-1 bg-orange-600 text-white rounded text-sm hover:bg-orange-700 transition-colors"
                        >
                          Cancellation & Refund Policy
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Information We Collect */}
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <Database className="w-5 h-5 text-white" />
                      </div>
                      Information We Collect
                    </h2>
                    
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Personal Information</h3>
                    <ul className="space-y-2 text-gray-700 ml-6 list-disc mb-4">
                      <li>Name, date of birth, gender, and contact information</li>
                      <li>Address, emergency contacts, and family member details</li>
                      <li>Government-issued identification numbers</li>
                      <li>Payment and billing information</li>
                      <li>Communication preferences</li>
                    </ul>

                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Health Information</h3>
                    <ul className="space-y-2 text-gray-700 ml-6 list-disc mb-4">
                      <li>Medical history, current conditions, and symptoms</li>
                      <li>Medications, allergies, and dietary restrictions</li>
                      <li>Healthcare provider information and medical records</li>
                      <li>Insurance information and coverage details</li>
                      <li>Emergency medical information</li>
                    </ul>

                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Usage Information</h3>
                    <ul className="space-y-2 text-gray-700 ml-6 list-disc">
                      <li>Service usage patterns and preferences</li>
                      <li>Communication logs and interaction history</li>
                      <li>Device information and IP addresses</li>
                      <li>Website and app analytics data</li>
                    </ul>
                  </div>

                  {/* How We Use Your Information */}
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">3</span>
                      </div>
                      How We Use Your Information
                    </h2>
                    
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Healthcare Coordination</h3>
                    <ul className="space-y-2 text-gray-700 ml-6 list-disc mb-4">
                      <li>Coordinating appointments with healthcare providers</li>
                      <li>Facilitating hospital admissions and medical procedures</li>
                      <li>Managing medical records and documentation</li>
                      <li>Providing emergency healthcare support</li>
                      <li>Coordinating follow-up care and medication management</li>
                    </ul>

                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Service Delivery</h3>
                    <ul className="space-y-2 text-gray-700 ml-6 list-disc mb-4">
                      <li>Creating and managing your care plan</li>
                      <li>Communicating with you and your family members</li>
                      <li>Processing payments and managing billing</li>
                      <li>Providing customer support and assistance</li>
                      <li>Improving our services and developing new features</li>
                    </ul>

                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Legal and Compliance</h3>
                    <ul className="space-y-2 text-gray-700 ml-6 list-disc">
                      <li>Complying with healthcare regulations and laws</li>
                      <li>Responding to legal requests and court orders</li>
                      <li>Protecting against fraud and security threats</li>
                      <li>Conducting internal audits and quality assurance</li>
                    </ul>
                  </div>

                  {/* Information Sharing */}
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      Information Sharing and Disclosure
                    </h2>
                    
                    <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-start gap-2">
                        <Shield className="w-5 h-5 text-green-600 mt-0.5" />
                        <div>
                          <p className="text-green-800 font-semibold">Our Commitment</p>
                          <p className="text-green-700 text-sm">
                            We do not sell, rent, or trade your personal information to third parties for marketing purposes.
                          </p>
                        </div>
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Authorized Sharing</h3>
                    <ul className="space-y-2 text-gray-700 ml-6 list-disc mb-4">
                      <li><strong>Healthcare Providers:</strong> Doctors, hospitals, and medical facilities involved in your care</li>
                      <li><strong>Insurance Companies:</strong> For claims processing and coverage verification</li>
                      <li><strong>Family Members:</strong> Designated emergency contacts and authorized family members</li>
                      <li><strong>Service Partners:</strong> Trusted third parties who assist in service delivery</li>
                      <li><strong>Legal Requirements:</strong> When required by law, court order, or regulatory authority</li>
                    </ul>

                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Business Transfers</h3>
                    <p className="text-gray-700 leading-relaxed">
                      In the event of a merger, acquisition, or sale of assets, your information may be transferred to the new entity, subject to the same privacy protections.
                    </p>
                  </div>

                  {/* Data Security */}
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <Lock className="w-5 h-5 text-white" />
                      </div>
                      Data Security
                    </h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      We implement comprehensive security measures to protect your information:
                    </p>
                    <ul className="space-y-2 text-gray-700 ml-6 list-disc">
                      <li><strong>Encryption:</strong> All data is encrypted in transit and at rest using industry-standard protocols</li>
                      <li><strong>Access Controls:</strong> Strict access controls and authentication requirements for all personnel</li>
                      <li><strong>Monitoring:</strong> Continuous monitoring and logging of all system access and activities</li>
                      <li><strong>Regular Audits:</strong> Regular security audits and penetration testing</li>
                      <li><strong>Incident Response:</strong> Comprehensive incident response procedures and breach notification protocols</li>
                      <li><strong>Data Minimization:</strong> We collect and retain only the minimum necessary information</li>
                    </ul>
                  </div>

                  {/* Your Rights */}
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <Eye className="w-5 h-5 text-white" />
                      </div>
                      Your Privacy Rights
                    </h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      You have the following rights regarding your personal information:
                    </p>
                    <ul className="space-y-2 text-gray-700 ml-6 list-disc">
                      <li><strong>Access:</strong> Request access to your personal information we maintain</li>
                      <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                      <li><strong>Deletion:</strong> Request deletion of your personal information (subject to legal requirements)</li>
                      <li><strong>Portability:</strong> Request a copy of your information in a portable format</li>
                      <li><strong>Restriction:</strong> Request restriction of processing in certain circumstances</li>
                      <li><strong>Objection:</strong> Object to certain types of processing</li>
                      <li><strong>Opt-out:</strong> Opt-out of marketing communications at any time</li>
                    </ul>
                    
                    <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                        <div>
                          <p className="text-amber-800 font-semibold">Healthcare Records</p>
                          <p className="text-amber-700 text-sm">
                            Some health information may be retained as required by healthcare regulations and professional standards, even after account deletion.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Data Retention */}
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">6</span>
                      </div>
                      Data Retention
                    </h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      We retain your information for different periods depending on the type of data and legal requirements:
                    </p>
                    <ul className="space-y-2 text-gray-700 ml-6 list-disc">
                      <li><strong>Active Accounts:</strong> Information is retained while your account is active</li>
                      <li><strong>Health Records:</strong> Retained for 7 years after last service date (as required by law)</li>
                      <li><strong>Financial Records:</strong> Retained for 7 years for audit and tax purposes</li>
                      <li><strong>Communication Logs:</strong> Retained for 2 years for quality assurance</li>
                      <li><strong>Marketing Data:</strong> Deleted within 30 days of opt-out request</li>
                    </ul>
                  </div>

                  {/* International Transfers */}
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">7</span>
                      </div>
                      International Data Transfers
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                      Your information is primarily stored and processed within India. If we transfer data internationally, we ensure appropriate safeguards are in place, including adequate data protection laws or contractual protections.
                    </p>
                  </div>

                  {/* Children's Privacy */}
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">8</span>
                      </div>
                      Children's Privacy
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                      Our services are designed for adults (18+) managing their own or their parents' healthcare. We do not knowingly collect personal information from children under 18 without parental consent. If we become aware of such collection, we will delete the information promptly.
                    </p>
                  </div>

                  {/* Changes to Policy */}
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">9</span>
                      </div>
                      Changes to This Policy
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                      We may update this Privacy Policy periodically to reflect changes in our practices or legal requirements. We will notify you of significant changes via email or through our platform. The "Last Updated" date at the top indicates when the policy was last revised.
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

export default PrivacyPolicy;