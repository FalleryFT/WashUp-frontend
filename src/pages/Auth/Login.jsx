// src/pages/Login.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AuthLayout from '../../components/AuthLayout';

export default function Login() {
  const { login, getDashboardPath } = useAuth();
  const navigate = useNavigate();
  const [form, setForm]     = useState({ username: '', password: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async () => {
    if (!form.username || !form.password) {
      setError('Username dan password wajib diisi');
      return;
    }
    setLoading(true);
    try {
      const data = await login(form.username, form.password);
      // Redirect berdasarkan role
      navigate(getDashboardPath(data.user));
    } catch (err) {
      setError(err.response?.data?.message || 'Login gagal. Periksa kembali data Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <h2 className="text-3xl font-bold text-[#1a3d5c] text-center mb-7">Login</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl text-center">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <input type="text" name="username" placeholder="Username"
          value={form.username} onChange={handleChange}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5bbfe8] focus:border-transparent shadow-sm transition"
        />
        <input type="password" name="password" placeholder="Password"
          value={form.password} onChange={handleChange}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5bbfe8] focus:border-transparent shadow-sm transition"
        />
      </div>

      <button onClick={handleSubmit} disabled={loading}
        className="mt-5 w-full bg-[#5bbfe8] hover:bg-[#3aaad4] text-white font-semibold py-3 rounded-xl transition duration-200 shadow-md disabled:opacity-60">
        {loading ? 'Memproses...' : 'Login'}
      </button>

      <div className="flex justify-between mt-4 text-sm text-gray-500">
        <Link to="/register" className="hover:text-[#5bbfe8] transition">Create an account</Link>
        <Link to="/forgot-password" className="hover:text-[#5bbfe8] transition">Forgot password?</Link>
      </div>
    </AuthLayout>
  );
}