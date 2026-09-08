import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import ScrollProgress from './components/ScrollProgress';

// Pages
import Home from './pages/Home';
import ProductsPage from './pages/ProductsPage';
import ProductDetail from './pages/ProductDetail';
import CategoryPage from './pages/CategoryPage';
import SearchPage from './pages/SearchPage';
import AboutPage from './pages/AboutPage';
import WhyChooseUsPage from './pages/WhyChooseUsPage';
import ServicesPage from './pages/ServicesPage';
import PortfolioPage from './pages/PortfolioPage';
import BlogPage from './pages/BlogPage';
import BlogDetailPage from './pages/BlogDetailPage';
import FaqPage from './pages/FaqPage';
import ContactPage from './pages/ContactPage';
import CartPage from './pages/CartPage';
import NotFoundPage from './pages/NotFoundPage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminCategories from './pages/AdminCategories';
import AdminProducts from './pages/AdminProducts';
import AdminSettings from './pages/AdminSettings';

// Scroll to Top on Navigation
function ScrollToTop() {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'instant'
    });
  }, [pathname]);

  return null;
}

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/admin/login" replace />;
};

// Layout for visitor pages
const VisitorLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <ScrollProgress />
      <Navbar />
      <main className="flex-1 bg-slate-50/50">{children}</main>
      <CartDrawer />
      <Footer />
    </div>
  );
};

export default function App() {
  React.useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(settings => {
        // 1. Dynamic SEO Title
        if (settings.seoTitle) {
          document.title = settings.seoTitle;
        }

        // 2. Dynamic SEO Meta Description
        if (settings.seoDescription) {
          let descMeta = document.querySelector('meta[name="description"]');
          if (!descMeta) {
            descMeta = document.createElement('meta');
            descMeta.name = 'description';
            document.head.appendChild(descMeta);
          }
          descMeta.content = settings.seoDescription;
        }

        // 3. Dynamic SEO Meta Keywords
        if (settings.seoKeywords) {
          let keyMeta = document.querySelector('meta[name="keywords"]');
          if (!keyMeta) {
            keyMeta = document.createElement('meta');
            keyMeta.name = 'keywords';
            document.head.appendChild(keyMeta);
          }
          keyMeta.content = settings.seoKeywords;
        }

        // 4. Custom Scripts Injection (Livechat/Analytics widgets)
        if (settings.customScript) {
          // Remove previously injected dynamic scripts to prevent duplicates
          const oldScripts = document.querySelectorAll('script[data-dynamic="true"]');
          oldScripts.forEach(el => el.remove());

          // Parse and inject script tags into body
          const parser = new DOMParser();
          const doc = parser.parseFromString(settings.customScript, 'text/html');
          const scripts = doc.querySelectorAll('script');
          scripts.forEach(script => {
            const newScript = document.createElement('script');
            newScript.setAttribute('data-dynamic', 'true');
            if (script.src) {
              newScript.src = script.src;
            } else {
              newScript.textContent = script.textContent;
            }
            document.body.appendChild(newScript);
          });
        }
      })
      .catch(err => console.error('Failed to load dynamic store configurations:', err));
  }, []);

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <ScrollToTop />
          <Routes>
            {/* Visitor Routes */}
            <Route
              path="/"
              element={
                <VisitorLayout>
                  <Home />
                </VisitorLayout>
              }
            />
            <Route
              path="/products"
              element={
                <VisitorLayout>
                  <ProductsPage />
                </VisitorLayout>
              }
            />
            <Route
              path="/products/:slug"
              element={
                <VisitorLayout>
                  <ProductDetail />
                </VisitorLayout>
              }
            />
            <Route
              path="/produk/:slug"
              element={
                <VisitorLayout>
                  <ProductDetail />
                </VisitorLayout>
              }
            />
            <Route
              path="/about"
              element={
                <VisitorLayout>
                  <AboutPage />
                </VisitorLayout>
              }
            />
            <Route
              path="/why-choose-us"
              element={
                <VisitorLayout>
                  <WhyChooseUsPage />
                </VisitorLayout>
              }
            />
            <Route
              path="/services"
              element={
                <VisitorLayout>
                  <ServicesPage />
                </VisitorLayout>
              }
            />
            <Route
              path="/portfolio"
              element={
                <VisitorLayout>
                  <PortfolioPage />
                </VisitorLayout>
              }
            />
            <Route
              path="/blog"
              element={
                <VisitorLayout>
                  <BlogPage />
                </VisitorLayout>
              }
            />
            <Route
              path="/blog/:slug"
              element={
                <VisitorLayout>
                  <BlogDetailPage />
                </VisitorLayout>
              }
            />
            <Route
              path="/faq"
              element={
                <VisitorLayout>
                  <FaqPage />
                </VisitorLayout>
              }
            />
            <Route
              path="/contact"
              element={
                <VisitorLayout>
                  <ContactPage />
                </VisitorLayout>
              }
            />
            <Route
              path="/cart"
              element={
                <VisitorLayout>
                  <CartPage />
                </VisitorLayout>
              }
            />
            <Route
              path="/kategori/:slug"
              element={
                <VisitorLayout>
                  <CategoryPage />
                </VisitorLayout>
              }
            />
            <Route
              path="/cari"
              element={
                <VisitorLayout>
                  <SearchPage />
                </VisitorLayout>
              }
            />

            {/* Admin Login */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Admin Protected Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/kategori"
              element={
                <ProtectedRoute>
                  <AdminCategories />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/produk"
              element={
                <ProtectedRoute>
                  <AdminProducts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/pengaturan"
              element={
                <ProtectedRoute>
                  <AdminSettings />
                </ProtectedRoute>
              }
            />

            {/* 404 Catch-all */}
            <Route
              path="*"
              element={
                <VisitorLayout>
                  <NotFoundPage />
                </VisitorLayout>
              }
            />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}
