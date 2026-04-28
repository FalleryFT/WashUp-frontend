// src/pages/ForgotPassword.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import api from '../api/axios';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [noHp, setNoHp] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('input'); // 'input' | 'sent'
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    if (!noHp) { setError('Nomor HP wajib diisi'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/send-otp', { no_hp: noHp });
      setInfo(res.data.message + (res.data.otp ? ` (Dev OTP: ${res.data.otp})` : ''));
      setStep('sent');
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal mengirim OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!otp) { setError('Masukkan kode OTP'); return; }
    setLoading(true);
    setError('');
    try {
      await api.post('/verify-otp', { no_hp: noHp, otp });
      // Simpan no_hp ke sessionStorage untuk halaman reset password
      sessionStorage.setItem('reset_no_hp', noHp);
      navigate('/new-password');
    } catch (err) {
      setError(err.response?.data?.message || 'OTP tidak valid');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <h2 className="text-3xl font-bold text-[#1a3d5c] mb-2">Password Recovery</h2>
      <p className="text-gray-500 text-sm mb-5">Enter your phone number to recovery your password</p>

      {error && (
        <div className="mb-3 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl">
          {error}
        </div>
      )}
      {info && (
        <div className="mb-3 p-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl">
          {info}
        </div>
      )}

      {/* No HP + Send OTP */}
      <div className="flex border border-gray-300 rounded-xl overflow-hidden shadow-sm mb-4">
        <input
          type="tel"
          placeholder="No HP"
          value={noHp}
          onChange={(e) => { setNoHp(e.target.value); setError(''); }}
          className="flex-1 px-4 py-3 text-gray-700 focus:outline-none"
        />
        <button
          onClick={handleSendOtp}
          disabled={loading || step === 'sent'}
          className="px-4 font-semibold text-[#1a3d5c] hover:bg-gray-50 transition disabled:opacity-50"
        >
          {step === 'sent' ? 'Terkirim ✓' : 'Send OTP'}
        </button>
      </div>

      {/* OTP input */}
      <p className="text-gray-500 text-sm mb-2">Enter the OTP sent to your number</p>
      <input
        type="text"
        placeholder="OTP"
        value={otp}
        onChange={(e) => { setOtp(e.target.value); setError(''); }}
        maxLength={6}
        className="w-full border border-[#5bbfe8] rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5bbfe8] shadow-sm mb-4 transition"
      />

      <button
        onClick={handleVerify}
        disabled={loading}
        className="w-full bg-[#5bbfe8] hover:bg-[#3aaad4] text-white font-semibold py-3 rounded-xl transition duration-200 shadow-md disabled:opacity-60"
      >
        {loading ? 'Memverifikasi...' : 'Verify'}
      </button>

      <p className="text-sm text-gray-500 text-right mt-3">
        <Link to="/login" className="hover:text-[#5bbfe8] transition">Login?</Link>
      </p>
    </AuthLayout>
  );
};

export default ForgotPassword;
