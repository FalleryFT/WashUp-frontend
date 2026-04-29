// src/pages/Register.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AuthLayout from '../../components/AuthLayout';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '', no_hp: '', alamat: '', password: '', password_confirmation: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async () => {
    if (!form.username || !form.no_hp || !form.alamat || !form.password) {
      setError('Semua field wajib diisi');
      return;
    }
    if (form.password !== form.password_confirmation) {
      setError('Konfirmasi password tidak cocok');
      return;
    }
    setLoading(true);
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      const msgs = err.response?.data?.errors;
      if (msgs) {
        setError(Object.values(msgs).flat().join(', '));
      } else {
        setError(err.response?.data?.message || 'Registrasi gagal');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <h2 className="text-3xl font-bold text-[#1a3d5c] text-center mb-5">Sign Up</h2>

      {error && (
        <div className="mb-3 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl text-center">
          {error}
        </div>
      )}

      <div className="space-y-3">
        <input
          type="text" name="username" placeholder="Username"
          value={form.username} onChange={handleChange}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5bbfe8] shadow-sm transition"
        />
        <input
          type="tel" name="no_hp" placeholder="No HP"
          value={form.no_hp} onChange={handleChange}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5bbfe8] shadow-sm transition"
        />
        <input
          type="text" name="alamat" placeholder="Alamat"
          value={form.alamat} onChange={handleChange}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5bbfe8] shadow-sm transition"
        />
        <input
          type="password" name="password" placeholder="Password"
          value={form.password} onChange={handleChange}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5bbfe8] shadow-sm transition"
        />
        <input
          type="password" name="password_confirmation" placeholder="Confirm Password"
          value={form.password_confirmation} onChange={handleChange}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5bbfe8] shadow-sm transition"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="mt-5 w-full bg-[#5bbfe8] hover:bg-[#3aaad4] text-white font-semibold py-3 rounded-xl transition duration-200 shadow-md disabled:opacity-60"
      >
        {loading ? 'Memproses...' : 'Sign Up'}
      </button>

      <p className="text-sm text-gray-500 text-right mt-3">
        Already have an account?{' '}
        <Link to="/login" className="text-[#5bbfe8] hover:underline">Login</Link>
      </p>
    </AuthLayout>
  );
};

export default Register;
