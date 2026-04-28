// src/pages/NewPassword.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import api from '../api/axios';

const NewPassword = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ password: '', password_confirmation: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async () => {
    if (!form.password || !form.password_confirmation) {
      setError('Semua field wajib diisi'); return;
    }
    if (form.password !== form.password_confirmation) {
      setError('Password tidak cocok'); return;
    }
    if (form.password.length < 6) {
      setError('Password minimal 6 karakter'); return;
    }

    const noHp = sessionStorage.getItem('reset_no_hp');
    if (!noHp) {
      setError('Sesi expired, ulangi proses dari awal');
      navigate('/forgot-password');
      return;
    }

    setLoading(true);
    try {
      await api.post('/reset-password', {
        no_hp: noHp,
        password: form.password,
        password_confirmation: form.password_confirmation,
      });
      sessionStorage.removeItem('reset_no_hp');
      navigate('/login', { state: { message: 'Password berhasil diperbarui! Silakan login.' } });
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memperbarui password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <h2 className="text-3xl font-bold text-[#1a3d5c] mb-7">Create New Password</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <input
          type="password" name="password"
          placeholder="Enter Your New Password"
          value={form.password} onChange={handleChange}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5bbfe8] shadow-sm transition"
        />
        <input
          type="password" name="password_confirmation"
          placeholder="Confirm Password"
          value={form.password_confirmation} onChange={handleChange}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5bbfe8] shadow-sm transition"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="mt-5 w-full bg-[#5bbfe8] hover:bg-[#3aaad4] text-white font-semibold py-3 rounded-xl transition duration-200 shadow-md disabled:opacity-60"
      >
        {loading ? 'Memperbarui...' : 'Update Password'}
      </button>
    </AuthLayout>
  );
};

export default NewPassword;
