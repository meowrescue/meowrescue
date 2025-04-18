
import React, { Suspense } from 'react';
import { Routes, Route, useRoutes } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import { routes } from "./routes";

// Loading component for suspense fallback
const Loading = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-meow-primary"></div>
  </div>
);

// Lazy load components
const Index = React.lazy(() => import("./pages/Index"));
const About = React.lazy(() => import("./pages/About"));
const Cats = React.lazy(() => import("./pages/Cats"));
const CatDetail = React.lazy(() => import("./pages/CatDetail"));
const Adopt = React.lazy(() => import("./pages/Adopt"));
const AdoptionForm = React.lazy(() => import("./pages/AdoptionForm"));
const Blog = React.lazy(() => import("./pages/Blog"));
const BlogPost = React.lazy(() => import("./pages/BlogPost"));
const Events = React.lazy(() => import("./pages/Events"));
const EventDetail = React.lazy(() => import("./pages/EventDetail"));
const Resources = React.lazy(() => import("./pages/Resources"));
const Contact = React.lazy(() => import("./pages/Contact"));
const Donate = React.lazy(() => import("./pages/Donate"));
const Volunteer = React.lazy(() => import("./pages/Volunteer"));
const VolunteerForm = React.lazy(() => import("./pages/VolunteerForm"));
const Foster = React.lazy(() => import("./pages/Foster"));
const FosterForm = React.lazy(() => import("./pages/FosterForm"));
const Login = React.lazy(() => import("./pages/Login"));
const Register = React.lazy(() => import("./pages/Register"));
const ResetPassword = React.lazy(() => import("./pages/ResetPassword"));
const Profile = React.lazy(() => import("./pages/Profile"));
const PrivacyPolicy = React.lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = React.lazy(() => import("./pages/TermsOfService"));
const NotFound = React.lazy(() => import("./pages/NotFound"));
const LostFound = React.lazy(() => import("./pages/LostFound"));
const LostFoundDetail = React.lazy(() => import("./pages/LostFoundDetail"));
const LostFoundForm = React.lazy(() => import("./pages/LostFoundForm"));
const SuccessStories = React.lazy(() => import("./pages/SuccessStories"));
const AdminDashboard = React.lazy(() => import("./pages/AdminDashboard"));
const AdminCats = React.lazy(() => import("./pages/AdminCats"));
const AdminCatForm = React.lazy(() => import("./pages/AdminCatForm"));
const AdminBlog = React.lazy(() => import("./pages/AdminBlog"));
const AdminBlogForm = React.lazy(() => import("./pages/AdminBlogForm"));
const AdminUsers = React.lazy(() => import("./pages/AdminUsers"));
const AdminFinance = React.lazy(() => import("./pages/AdminFinance"));
const AdminPages = React.lazy(() => import("./pages/AdminPages"));
const AdminEvents = React.lazy(() => import("./pages/AdminEvents"));
const AdminLostFound = React.lazy(() => import("./pages/AdminLostFound"));
const AdminMessages = React.lazy(() => import("./pages/AdminMessages"));
const AdminChat = React.lazy(() => import("./pages/AdminChat"));
const AdminSecurity = React.lazy(() => import("./pages/AdminSecurity"));
const AdminApplications = React.lazy(() => import("./pages/AdminApplications"));
const AdminSupplies = React.lazy(() => import("./pages/AdminSupplies"));
const AdminDocuments = React.lazy(() => import("./pages/AdminDocuments"));
const AdminTeam = React.lazy(() => import("./pages/AdminTeam"));
const AdminSuccessStories = React.lazy(() => import("./pages/AdminSuccessStories"));
const AdminBusinessLicenses = React.lazy(() => import("./pages/AdminBusinessLicenses"));
const AdminDirectMessages = React.lazy(() => import("./pages/AdminDirectMessages"));
const AdminOrders = React.lazy(() => import("./pages/AdminOrders"));

const App = () => {
  return (
      <Suspense fallback={<Loading />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Layout><Index /></Layout>} />
          <Route path="/about" element={<Layout><About /></Layout>} />
          <Route path="/cats" element={<Layout><Cats /></Layout>} />
          <Route path="/cats/:id" element={<Layout><CatDetail /></Layout>} />
          <Route path="/adopt" element={<Layout><Adopt /></Layout>} />
          <Route path="/adopt/apply" element={<Layout><AdoptionForm /></Layout>} />
          <Route path="/foster" element={<Layout><Foster /></Layout>} />
          <Route path="/foster/apply" element={<Layout><FosterForm /></Layout>} />
          <Route path="/success-stories" element={<Layout><SuccessStories /></Layout>} />
          <Route path="/blog" element={<Layout><Blog /></Layout>} />
          <Route path="/blog/:slug" element={<Layout><BlogPost /></Layout>} />
          <Route path="/events" element={<Layout><Events /></Layout>} />
          <Route path="/events/:id" element={<Layout><EventDetail /></Layout>} />
          <Route path="/resources" element={<Layout><Resources /></Layout>} />
          <Route path="/contact" element={<Layout><Contact /></Layout>} />
          <Route path="/donate" element={<Layout><Donate /></Layout>} />
          <Route path="/volunteer" element={<Layout><Volunteer /></Layout>} />
          <Route path="/volunteer/apply" element={<Layout><VolunteerForm /></Layout>} />
          <Route path="/login" element={<Layout><Login /></Layout>} />
          <Route path="/register" element={<Layout><Register /></Layout>} />
          <Route path="/reset-password" element={<Layout><ResetPassword /></Layout>} />
          <Route path="/privacy-policy" element={<Layout><PrivacyPolicy /></Layout>} />
          <Route path="/terms-of-service" element={<Layout><TermsOfService /></Layout>} />
          <Route path="/lost-found" element={<Layout><LostFound /></Layout>} />
          <Route path="/lost-found/:id" element={<Layout><LostFoundDetail /></Layout>} />
          
          {/* Protected Routes (requires login) */}
          <Route path="/profile" element={
            <Layout>
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            </Layout>
          } />
          <Route path="/lost-found/new" element={
            <Layout>
              <ProtectedRoute>
                <LostFoundForm />
              </ProtectedRoute>
            </Layout>
          } />
          <Route path="/lost-found/edit/:id" element={
            <Layout>
              <ProtectedRoute>
                <LostFoundForm />
              </ProtectedRoute>
            </Layout>
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
          <Route path="*" element={<Layout><NotFound /></Layout>} />
        </Routes>
      </Suspense>
  );
};

export default App;
