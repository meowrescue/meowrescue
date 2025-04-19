import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext.js";
import ProtectedRoute from "./components/ProtectedRoute.js";

/* Public pages */
import Index from "./pages/Index.js";
import About from "./pages/About.js";
import Cats from "./pages/Cats.js";
import Adopt from "./pages/Adopt.js";
import AdoptionForm from "./pages/AdoptionForm.js";
import Blog from "./pages/Blog.js";
import Events from "./pages/Events.js";
import Resources from "./pages/Resources.js";
import Contact from "./pages/Contact.js";

/* Admin pages */
import AdminDashboard from "./pages/AdminDashboard.js";
import AdminSettings from "./pages/AdminSettings.js";
import AdminSecurity from "./pages/AdminSecurity.js";

/* UI providers / feedback */
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <TooltipProvider>
        {/* Toast stacks */}
        <Toaster />
        <Sonner />

        <Routes>
          {/* public routes */}
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/cats" element={<Cats />} />
          <Route path="/adopt" element={<Adopt />} />
          <Route path="/adopt/apply" element={<AdoptionForm />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/events" element={<Events />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/contact" element={<Contact />} />

          {/* admin routes (protected) */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <Routes>
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="settings" element={<AdminSettings />} />
                  <Route path="security" element={<AdminSecurity />} />
                </Routes>
              </ProtectedRoute>
            }
          />
        </Routes>
      </TooltipProvider>
    </BrowserRouter>
  </AuthProvider>
);

export default App;
