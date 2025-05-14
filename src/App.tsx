
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import AdminNews from "./pages/AdminNews";
import NotFound from "./pages/NotFound";
import OpportunityDetails from "./pages/OpportunityDetails";
import Scholarships from "./pages/Scholarships";
import ScholarshipsByCountry from "./pages/ScholarshipsByCountry";
import ScholarshipsByLevel from "./pages/ScholarshipsByLevel";
import JobListings from "./pages/JobListings";
import News from "./pages/News";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";
import Explainer from "./pages/Explainer";
import Disclaimer from "./pages/Disclaimer";
import CookieConsent from "./components/CookieConsent";

const queryClient = new QueryClient();

// Create App component as a function component to properly use hooks
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toaster />
        <Sonner />
        <CookieConsent />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/news" element={<AdminNews />} />
          <Route path="/opportunity/:id" element={<OpportunityDetails />} />
          <Route path="/scholarships" element={<Scholarships />} />
          <Route path="/scholarships/country/:country" element={<ScholarshipsByCountry />} />
          <Route path="/scholarships/level/:level" element={<ScholarshipsByLevel />} />
          <Route path="/jobs" element={<JobListings />} />
          <Route path="/news" element={<News />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route path="/explainer" element={<Explainer />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
