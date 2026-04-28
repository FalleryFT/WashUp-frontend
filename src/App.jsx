// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import NewPassword from './pages/NewPassword';

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen bg-[#dff0f7] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-[#5bbfe8] border-t-transparent rounded-full animate-spin" />
    </div>
  );
  return user ? children : <Navigate to="/login" replace />;
};

// Simple dashboard placeholder
const Dashboard = () => {
  const { user, logout } = useAuth();
  return (
    <div className="min-h-screen bg-[#dff0f7] flex items-center justify-center">
      <div className="bg-white rounded-3xl shadow-xl p-10 text-center">
        <h1 className="text-2xl font-bold text-[#1a3d5c] mb-2">Selamat Datang! 👋</h1>
        <p className="text-gray-500 mb-6">Anda login sebagai <strong>{user?.name}</strong></p>
        <button
          onClick={logout}
          className="bg-[#5bbfe8] hover:bg-[#3aaad4] text-white font-semibold px-8 py-3 rounded-xl transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/new-password" element={<NewPassword />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
