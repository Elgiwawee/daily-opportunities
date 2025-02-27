
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import OpportunityDetails from "./pages/OpportunityDetails";

const queryClient = new QueryClient();

// Create App component as a function component to properly use hooks
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/opportunity/:id" element={<OpportunityDetails />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
