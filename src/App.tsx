
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Index from "./pages/Index";
import About from "./pages/About";
import Cats from "./pages/Cats";
import CatDetail from "./pages/CatDetail";
import Adopt from "./pages/Adopt";
import AdoptionForm from "./pages/AdoptionForm";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import Resources from "./pages/Resources";
import Contact from "./pages/Contact";
import Donate from "./pages/Donate";
import Volunteer from "./pages/Volunteer";
import VolunteerForm from "./pages/VolunteerForm";
import Foster from "./pages/Foster";
import FosterForm from "./pages/FosterForm";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import NotFound from "./pages/NotFound";
import LostFound from "./pages/LostFound";
import LostFoundDetail from "./pages/LostFoundDetail";
import LostFoundForm from "./pages/LostFoundForm";
import AdminDashboard from "./pages/AdminDashboard";
import AdminCats from "./pages/AdminCats";
import AdminCatForm from "./pages/AdminCatForm";
import AdminBlog from "./pages/AdminBlog";
import AdminBlogForm from "./pages/AdminBlogForm";
import AdminUsers from "./pages/AdminUsers";
import AdminFinance from "./pages/AdminFinance";
import AdminPages from "./pages/AdminPages";
import AdminEvents from "./pages/AdminEvents";
import AdminLostFound from "./pages/AdminLostFound";
import AdminMessages from "./pages/AdminMessages";
import AdminChat from "./pages/AdminChat";
import AdminSecurity from "./pages/AdminSecurity";
import AdminApplications from "./pages/AdminApplications";
import SuccessStories from "./pages/SuccessStories";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/cats" element={<Cats />} />
              <Route path="/cats/:id" element={<CatDetail />} />
              <Route path="/adopt" element={<Adopt />} />
              <Route path="/adopt/apply" element={<AdoptionForm />} />
              <Route path="/foster" element={<Foster />} />
              <Route path="/foster/apply" element={<FosterForm />} />
              <Route path="/success-stories" element={<SuccessStories />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/events" element={<Events />} />
              <Route path="/events/:id" element={<EventDetail />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/donate" element={<Donate />} />
              <Route path="/volunteer" element={<Volunteer />} />
              <Route path="/volunteer/apply" element={<VolunteerForm />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/lost-found" element={<LostFound />} />
              <Route path="/lost-found/:id" element={<LostFoundDetail />} />
              
              {/* Protected Routes (requires login) */}
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/lost-found/new" element={
                <ProtectedRoute>
                  <LostFoundForm />
                </ProtectedRoute>
              } />
              <Route path="/lost-found/edit/:id" element={
                <ProtectedRoute>
                  <LostFoundForm />
                </ProtectedRoute>
              } />
              
              {/* Admin Routes (requires admin login) */}
              <Route path="/admin" element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/cats" element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminCats />
                </ProtectedRoute>
              } />
              <Route path="/admin/cats/new" element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminCatForm />
                </ProtectedRoute>
              } />
              <Route path="/admin/cats/edit/:id" element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminCatForm />
                </ProtectedRoute>
              } />
              <Route path="/admin/users" element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminUsers />
                </ProtectedRoute>
              } />
              <Route path="/admin/finance" element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminFinance />
                </ProtectedRoute>
              } />
              <Route path="/admin/pages" element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminPages />
                </ProtectedRoute>
              } />
              <Route path="/admin/blog" element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminBlog />
                </ProtectedRoute>
              } />
              <Route path="/admin/blog/new" element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminBlogForm />
                </ProtectedRoute>
              } />
              <Route path="/admin/blog/edit/:id" element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminBlogForm />
                </ProtectedRoute>
              } />
              <Route path="/admin/events" element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminEvents />
                </ProtectedRoute>
              } />
              <Route path="/admin/lost-found" element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminLostFound />
                </ProtectedRoute>
              } />
              <Route path="/admin/messages" element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminMessages />
                </ProtectedRoute>
              } />
              <Route path="/admin/chat" element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminChat />
                </ProtectedRoute>
              } />
              <Route path="/admin/security" element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminSecurity />
                </ProtectedRoute>
              } />
              <Route path="/admin/applications" element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminApplications />
                </ProtectedRoute>
              } />
              
              {/* Catch-all route for 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
