
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import Cats from "./pages/Cats";
import Adopt from "./pages/Adopt";
import Events from "./pages/Events";
import Resources from "./pages/Resources";
import Contact from "./pages/Contact";
import Donate from "./pages/Donate";
import Volunteer from "./pages/Volunteer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/cats" element={<Cats />} />
          <Route path="/adopt" element={<Adopt />} />
          <Route path="/events" element={<Events />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/volunteer" element={<Volunteer />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
