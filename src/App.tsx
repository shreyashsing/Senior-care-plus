import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PatientAuthProvider } from "./contexts/PatientAuthContext";
import { AdminAuthProvider } from "./contexts/AdminAuthContext";
import ScrollToTop from "./components/ScrollToTop";
import Index from "./pages/Index";
import MultiMemberRegister from "./pages/MultiMemberRegister";
import AboutUs from "./pages/AboutUs";
//import Partners from "./pages/Partners";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import Pricing from "./pages/Pricing";
import NotFound from "./pages/NotFound";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { DashboardPage } from "./pages/DashboardPage";
import { UnauthorizedPage } from "./pages/UnauthorizedPage";
import { RegistrationSuccessPage } from "./pages/RegistrationSuccessPage";
import { AdminLogin } from "./pages/admin/AdminLogin";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { PatientDetailPage } from "./pages/admin/PatientDetailPage";
import HospitalPartnerManagement from "./pages/admin/HospitalPartnerManagement";
import ContactManagement from "./pages/admin/ContactManagement";
import { RequireAdminAuth } from "./components/admin/RequireAdminAuth";
import TermsAndConditions from "./pages/TermsAndConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Blog from "./pages/Blog";
import CancellationRefundPolicy from "./pages/CancellationRefundPolicy";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <PatientAuthProvider>
          <AdminAuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<AboutUs />} />
              {/* <Route path="/partners" element={<Partners />} /> */}
              <Route path="/services" element={<Services />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/register" element={<MultiMemberRegister />} />
              <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/cancellation-refund-policy" element={<CancellationRefundPolicy />} />
              <Route path="/registration-success" element={<RegistrationSuccessPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/unauthorized" element={<UnauthorizedPage />} />
              
              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route 
                path="/admin/dashboard" 
                element={
                  <RequireAdminAuth>
                    <AdminDashboard />
                  </RequireAdminAuth>
                } 
              />
              <Route 
                path="/admin/hospital-partners" 
                element={
                  <RequireAdminAuth>
                    <HospitalPartnerManagement />
                  </RequireAdminAuth>
                } 
              />
              <Route 
                path="/admin/contacts" 
                element={
                  <RequireAdminAuth>
                    <ContactManagement />
                  </RequireAdminAuth>
                } 
              />
              <Route 
                path="/admin/patients/:id" 
                element={
                  <RequireAdminAuth>
                    <PatientDetailPage />
                  </RequireAdminAuth>
                } 
              />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AdminAuthProvider>
        </PatientAuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
