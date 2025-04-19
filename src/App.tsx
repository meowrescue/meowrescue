
import React from 'react';
import { Toaster } from "@/components/ui/toaster.js";
import { Toaster as Sonner } from "@/components/ui/sonner.js";
import { TooltipProvider } from "@/components/ui/tooltip.js";
import { Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from "./contexts/AuthContext.js";
import ProtectedRoute from "./components/ProtectedRoute.js";

// Import all the pages
import Index from "./pages/Index.js";
import About from "./pages/About.js";
import Cats from "./pages/Cats.js";
import CatDetail from "./pages/CatDetail.js";
import Adopt from "./pages/Adopt.js";
import AdoptionForm from "./pages/AdoptionForm.js";
import Blog from "./pages/Blog.js";
import BlogPost from "./pages/BlogPost.js";
import Events from "./pages/Events.js";
import EventDetail from "./pages/EventDetail.js";
import Resources from "./pages/Resources.js";
import Contact from "./pages/Contact.js";
import Donate from "./pages/Donate.js";
import Volunteer from "./pages/Volunteer.js";
import VolunteerForm from "./pages/VolunteerForm.js";
import Foster from "./pages/Foster.js";
import FosterForm from "./pages/FosterForm.js";
import Login from "./pages/Login.js";
import Register from "./pages/Register.js";
import ResetPassword from "./pages/ResetPassword.js";
import Profile from "./pages/Profile.js";
import PrivacyPolicy from "./pages/PrivacyPolicy.js";
import TermsOfService from "./pages/TermsOfService.js";
import NotFound from "./pages/NotFound.js";
import LostFound from "./pages/LostFound.js";
import LostFoundDetail from "./pages/LostFoundDetail.js";
import LostFoundForm from "./pages/LostFoundForm.js";
import AdminDashboard from "./pages/AdminDashboard.js";
import AdminCats from "./pages/AdminCats.js";
import AdminCatForm from "./pages/AdminCatForm.js";
import AdminBlog from "./pages/AdminBlog.js";
import AdminBlogForm from "./pages/AdminBlogForm.js";
import AdminUsers from "./pages/AdminUsers.js";
import AdminFinance from "./pages/AdminFinance.js";
import AdminPages from "./pages/AdminPages.js";
import AdminEvents from "./pages/AdminEvents.js";
import AdminLostFound from "./pages/AdminLostFound.js";
import AdminMessages from "./pages/AdminMessages.js";
import AdminChat from "./pages/AdminChat.js";
import AdminSecurity from "./pages/AdminSecurity.js";
import AdminApplications from "./pages/AdminApplications.js";
import SuccessStories from "./pages/SuccessStories.js";
import AdminSupplies from "./pages/AdminSupplies.js";
import AdminDocuments from "./pages/AdminDocuments.js";
import AdminTeam from "./pages/AdminTeam.js";
import AdminSuccessStories from "./pages/AdminSuccessStories.js";
import AdminBusinessLicenses from "./pages/AdminBusinessLicenses.js";
import AdminDirectMessages from "./pages/AdminDirectMessages.js";
import AdminOrders from "./pages/AdminOrders.js";

const App = () => (
  <>
    <TooltipProvider>
      <Toaster />
      <Sonner />
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
          <Route path="/admin/finance/donations" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminFinance />
            </ProtectedRoute>
          } />
          <Route path="/admin/finance/income" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminFinance />
            </ProtectedRoute>
          } />
          <Route path="/admin/finance/expenses" element={
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
          <Route path="/admin/supplies" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminSupplies />
            </ProtectedRoute>
          } />
          <Route path="/admin/documents" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminDocuments />
            </ProtectedRoute>
          } />
          <Route path="/admin/team" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminTeam />
            </ProtectedRoute>
          } />
          <Route path="/admin/success-stories" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminSuccessStories />
            </ProtectedRoute>
          } />
          <Route path="/admin/business-licenses" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminBusinessLicenses />
            </ProtectedRoute>
          } />
          <Route path="/admin/direct-messages" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminDirectMessages />
            </ProtectedRoute>
          } />
          <Route path="/admin/orders" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminOrders />
            </ProtectedRoute>
          } />
          <Route path="/admin/help" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          
          {/* Catch-all route for 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </TooltipProvider>
  </>
);

export default App;
