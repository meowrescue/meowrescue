
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './App.css';
import CustomNavbar from './components/CustomNavbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Cats from './pages/Cats';
import Contact from './pages/Contact';
import Donate from './pages/Donate';
import Events from './pages/Events';
import Resources from './pages/Resources';
import Volunteer from './pages/Volunteer';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import AdminUsers from './pages/AdminUsers';
import AdminCats from './pages/AdminCats';
import AdminApplications from './pages/AdminApplications';
import AdminEvents from './pages/AdminEvents';
import AdminBlog from './pages/AdminBlog';
import AdminLostFound from './pages/AdminLostFound';
import AdminFinance from './pages/AdminFinance';
import AdminChat from './pages/AdminChat';
import AdminMessages from './pages/AdminMessages';
import AdminSecurity from './pages/AdminSecurity';
import LostFound from './pages/LostFound';
import LostFoundDetail from './pages/LostFoundDetail';
import LostFoundNew from './pages/LostFoundNew';
import LostFoundEdit from './pages/LostFoundEdit';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import ApplicationView from '@/components/admin/ApplicationView';
import Adopt from './pages/Adopt';
import SuccessStories from './pages/SuccessStories';

// Import our new Cat Feeding component
import AdminCatFeeding from '@/pages/AdminCatFeeding';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="App">
          <CustomNavbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/cats" element={<Cats />} />
              <Route path="/adopt" element={<Adopt />} />
              <Route path="/success-stories" element={<SuccessStories />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/donate" element={<Donate />} />
              <Route path="/events" element={<Events />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/volunteer" element={<Volunteer />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedRoute roles={['admin']}><Admin /></ProtectedRoute>} />
              <Route path="/admin/users" element={<ProtectedRoute roles={['admin']}><AdminUsers /></ProtectedRoute>} />
              <Route path="/admin/cats" element={<ProtectedRoute roles={['admin']}><AdminCats /></ProtectedRoute>} />
              <Route path="/admin/applications" element={<ProtectedRoute roles={['admin']}><AdminApplications /></ProtectedRoute>} />
              <Route path="/admin/events" element={<ProtectedRoute roles={['admin']}><AdminEvents /></ProtectedRoute>} />
              <Route path="/admin/blog" element={<ProtectedRoute roles={['admin']}><AdminBlog /></ProtectedRoute>} />
              <Route path="/admin/lost-found" element={<ProtectedRoute roles={['admin']}><AdminLostFound /></ProtectedRoute>} />
              <Route path="/admin/finance" element={<ProtectedRoute roles={['admin']}><AdminFinance /></ProtectedRoute>} />
              <Route path="/admin/chat" element={<ProtectedRoute roles={['admin']}><AdminChat /></ProtectedRoute>} />
              <Route path="/admin/messages" element={<ProtectedRoute roles={['admin']}><AdminMessages /></ProtectedRoute>} />
              <Route path="/admin/security" element={<ProtectedRoute roles={['admin']}><AdminSecurity /></ProtectedRoute>} />
              <Route path="/lost-found" element={<LostFound />} />
              <Route path="/lost-found/:id" element={<LostFoundDetail />} />
              <Route path="/lost-found/new" element={<ProtectedRoute><LostFoundNew /></ProtectedRoute>} />
              <Route path="/lost-found/edit/:id" element={<ProtectedRoute><LostFoundEdit /></ProtectedRoute>} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:id" element={<BlogDetail />} />
              <Route path="/admin/cat-feeding" element={<ProtectedRoute roles={['admin', 'foster']}><AdminCatFeeding /></ProtectedRoute>} />
            </Routes>
          </main>
          <Footer />
          <Toaster />
        </div>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
