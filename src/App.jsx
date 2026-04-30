// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import LandingPage          from './pages/landingpage';
import Login                from './pages/Auth/Login';
import Register             from './pages/Auth/Register';
import ForgotPassword       from './pages/Auth/ForgotPassword';
import NewPassword          from './pages/Auth/NewPassword';
import AdminDashboard       from './Pages/Admin/dashboard';
import AdminNewTransaction  from './Pages/Admin/New-Transaction';
import OrderList            from './pages/Admin/OrderList';
import CustomerData         from './pages/Admin/CustomerData';
import Notifications        from './pages/Admin/Notifications';
import Chat                 from './pages/Admin/Chat';
import Reports              from './pages/Admin/Reports';
import PriceSetting         from './pages/Admin/Price';
import CustomerDashboard    from './Pages/Customer/dashboard';

// ── Guard: hanya bisa diakses kalau sudah login ────────
const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="min-h-screen bg-[#eaf6fb] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-[#5bbfe8] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!user) return <Navigate to="/login" replace />;

  if (role && user.role !== role) {
    return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/customer/dashboard'} replace />;
  }

  return children;
};

// ── Guard: redirect ke dashboard jika sudah login ─────
const GuestRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="min-h-screen bg-[#eaf6fb] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-[#5bbfe8] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (user) {
    return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/customer/dashboard'} replace />;
  }

  return children;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Landing Page */}
      <Route path="/" element={<LandingPage />} />

      {/* Auth routes */}
      <Route path="/login"    element={<GuestRoute><Login /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/new-password"    element={<NewPassword />} />

      {/* Admin */}
      <Route path="/admin/dashboard" element={
        <ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>
      } />
      <Route path="/admin/New-Transaction" element={
        <ProtectedRoute role="admin"><AdminNewTransaction /></ProtectedRoute>
      } />
      <Route path="/admin/orders" element={
      <ProtectedRoute role="admin"><OrderList /></ProtectedRoute>
      } />
      <Route path="/admin/customers" element={
      <ProtectedRoute role="admin"><CustomerData /></ProtectedRoute>
      } />
      <Route path="/admin/notifications" element={
      <ProtectedRoute role="admin"><Notifications /></ProtectedRoute>
      } />
      <Route path="/admin/chat" element={
      <ProtectedRoute role="admin"><Chat /></ProtectedRoute>
      } />
      <Route path="/admin/reports" element={
      <ProtectedRoute role="admin"><Reports /></ProtectedRoute>
      } />
      <Route path="/admin/price" element={
      <ProtectedRoute role="admin"><PriceSetting /></ProtectedRoute>
      } />

      {/* Customer */}
      <Route path="/customer/dashboard" element={
        <ProtectedRoute role="customer"><CustomerDashboard /></ProtectedRoute>
      } />


      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}