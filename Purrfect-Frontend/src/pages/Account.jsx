import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'https://purrfect-backend-f78x.onrender.com';

const Account = () => {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();

  // Tabs: only used when NOT logged in
  const [activeTab, setActiveTab] = useState('login');

  // Toast notification
  const [toast, setToast] = useState(null);

  // ------ Register form fields ------
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPw, setRegConfirmPw] = useState('');
  const [passwordStrength, setPasswordStrength] = useState({ level: '', label: '' });

  // ------ Verification states ------
  const [verificationStep, setVerificationStep] = useState(false); // show code input
  const [verifyCode, setVerifyCode] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  // ------ Login form fields ------
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // ------ Loading states ------
  const [loading, setLoading] = useState(false);

  // ------ Effects ------
  // Clear toast after 4s
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Auto-login after successful verification
  useEffect(() => {
    if (isVerified && regEmail && regPassword) {
      // Attempt to log in immediately after verification
      const autoLogin = async () => {
        setLoading(true);
        try {
          const res = await fetch(`${API_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: regEmail, password: regPassword }),
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.message);
          login(data.token, data.user);
          showToast(`Hello ${data.user.name}, your account has been created! Welcome to Purrfect! 🎉`);
          navigate('/checkout');
        } catch (err) {
          showToast(err.message, 'error');
        } finally {
          setLoading(false);
        }
      };
      autoLogin();
    }
  }, [isVerified]); // eslint-disable-line

  // ------ Helpers ------
  const showToast = (msg, type = 'success') => {
    setToast({ message: msg, type });
  };

  const calcPasswordStrength = (pw) => {
    if (!pw) return { level: '', label: '' };
    let score = 0;
    if (pw.length >= 6) score++;
    if (pw.length >= 10) score++;
    if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
    if (/[0-9]/.test(pw) || /[^A-Za-z0-9]/.test(pw)) score++;
    const levels = ['weak', 'weak', 'medium', 'medium', 'strong'];
    const labels = ['Too short', 'Weak', 'Fair', 'Good', 'Strong!'];
    const idx = Math.min(score, 4);
    return { level: levels[idx], label: labels[idx] };
  };

  useEffect(() => {
    setPasswordStrength(calcPasswordStrength(regPassword));
  }, [regPassword]);

  // ------ API handlers ------
  const handleRegister = async (e) => {
    e.preventDefault();
    if (regPassword !== regConfirmPw) {
      showToast('Passwords do not match', 'error');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: regName, email: regEmail, password: regPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setVerificationStep(true);
      showToast('Verification code sent to your email!');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!verifyCode || verifyCode.length !== 6) {
      showToast('Please enter the 6-digit code', 'error');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: regEmail, code: verifyCode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setIsVerified(true);
      showToast('Email verified successfully!');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      login(data.token, data.user);
      showToast(`Welcome back, ${data.user.name}! 🐱`);
      navigate('/cart');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    showToast('You have been logged out.', 'success');
  };

  // ------ Render: if user is already logged in, show profile ------
  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#faf8f6] to-[#f0ece8] flex flex-col items-center relative font-sans text-[#0f2a2f]">
        <Link
          to="/"
          className="absolute top-6 left-8 text-[#2a6b6b] font-medium text-sm flex items-center gap-2 hover:text-[#0f2a2f] hover:gap-3 transition-all z-10"
        >
          <i className="fas fa-arrow-left"></i> Back to Shop
        </Link>

        <div className="w-full max-w-md mx-4 mt-24 mb-12 bg-white rounded-3xl shadow-lg border border-[#d4f0f0] overflow-hidden">
          <div className="bg-gradient-to-br from-[#0b2a2f] to-[#1a4045] p-8 text-center text-[#e1f2f0]">
            <i className="fas fa-cat text-5xl text-[#d4f0f0] block mb-3"></i>
            <h2 className="text-2xl font-medium tracking-tight">Welcome to Purrfect</h2>
            <p className="text-sm opacity-80">Your premium cat shop account</p>
          </div>

          <div className="p-8 text-center">
            <div className="relative inline-block">
              <i className="fas fa-user-circle text-7xl text-[#2a6b6b]"></i>
              <i className="fas fa-check-circle text-2xl text-green-600 absolute -bottom-1 -right-1 bg-white rounded-full p-0.5"></i>
            </div>
            <h3 className="text-xl font-semibold mt-4">{user.name}</h3>
            <p className="text-gray-500 text-sm">{user.email}</p>
            <span className="inline-block bg-green-50 text-green-700 text-xs font-semibold px-4 py-1.5 rounded-full mt-3">
              <i className="fas fa-check mr-1"></i> Verified Purrfect Member
            </span>

            <div className="bg-[#faf8f6] rounded-xl p-5 mt-6 text-left text-sm space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Member Since</span>
                <span className="font-medium">{new Date(user.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Account Status</span>
                <span className="text-green-600 font-medium">Active</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Verification</span>
                <span className="text-green-600 font-medium"><i className="fas fa-check-circle mr-1"></i> Verified</span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="mt-6 w-full py-3 px-6 bg-[#2a6b6b] text-white font-semibold rounded-xl hover:bg-[#1b5353] transition-all hover:-translate-y-0.5 shadow-md"
            >
              <i className="fas fa-sign-out-alt mr-2"></i> Sign Out
            </button>
          </div>
        </div>

        {toast && <ToastMessage toast={toast} />}
      </div>
    );
  }

  // ------ Not logged in: show login / register forms ------
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#faf8f6] to-[#f0ece8] flex flex-col items-center relative font-sans text-[#0f2a2f]">
      <Link
        to="/"
        className="absolute top-6 left-8 text-[#2a6b6b] font-medium text-sm flex items-center gap-2 hover:text-[#0f2a2f] hover:gap-3 transition-all z-10"
      >
        <i className="fas fa-arrow-left"></i> Back to Shop
      </Link>

      <div className="w-full max-w-md mx-4 mt-24 mb-12 bg-white rounded-3xl shadow-lg border border-[#d4f0f0] overflow-hidden">
        <div className="bg-gradient-to-br from-[#0b2a2f] to-[#1a4045] p-8 text-center text-[#e1f2f0]">
          <i className="fas fa-cat text-5xl text-[#d4f0f0] block mb-3"></i>
          <h2 className="text-2xl font-medium tracking-tight">Welcome to Purrfect</h2>
          <p className="text-sm opacity-80">Your premium cat shop account</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b-2 border-gray-100">
          <button
            onClick={() => { setActiveTab('login'); setVerificationStep(false); }}
            className={`flex-1 py-4 font-semibold text-sm transition-all border-b-2 ${
              activeTab === 'login' ? 'text-[#2a6b6b] border-[#2a6b6b]' : 'text-gray-400 border-transparent hover:text-[#2a6b6b]'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setActiveTab('register'); setVerificationStep(false); }}
            className={`flex-1 py-4 font-semibold text-sm transition-all border-b-2 ${
              activeTab === 'register' ? 'text-[#2a6b6b] border-[#2a6b6b]' : 'text-gray-400 border-transparent hover:text-[#2a6b6b]'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Login Form */}
        {activeTab === 'login' && (
          <form onSubmit={handleLogin} className="p-8 space-y-5">
            <div>
              <label className="block text-sm font-semibold mb-1.5">Email Address</label>
              <div className="relative">
                <i className="fas fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3 bg-[#faf8f6] border border-gray-200 rounded-xl focus:outline-none focus:border-[#2a6b6b] focus:ring-4 focus:ring-[#2a6b6b]/10"
                  placeholder="your@email.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5">Password</label>
              <div className="relative">
                <i className="fas fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3 bg-[#faf8f6] border border-gray-200 rounded-xl focus:outline-none focus:border-[#2a6b6b] focus:ring-4 focus:ring-[#2a6b6b]/10"
                  placeholder="••••••••"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#2a6b6b] text-white font-semibold rounded-xl hover:bg-[#1b5353] transition-all disabled:opacity-50 flex items-center justify-center"
            >
              {loading ? <i className="fas fa-spinner fa-pulse"></i> : <><i className="fas fa-sign-in-alt mr-2"></i> Sign In</>}
            </button>
            <p className="text-center text-sm text-gray-500 mt-3">
              Don't have an account?{' '}
              <button type="button" onClick={() => setActiveTab('register')} className="text-[#2a6b6b] font-semibold underline hover:text-[#1b5353]">
                Create one
              </button>
            </p>
          </form>
        )}

        {/* Register Form */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegister} className="p-8 space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5">Full Name</label>
              <div className="relative">
                <i className="fas fa-user absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3 bg-[#faf8f6] border border-gray-200 rounded-xl focus:outline-none focus:border-[#2a6b6b] focus:ring-4 focus:ring-[#2a6b6b]/10"
                  placeholder="Jane Doe"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5">Email Address</label>
              <div className="relative">
                <i className="fas fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3 bg-[#faf8f6] border border-gray-200 rounded-xl focus:outline-none focus:border-[#2a6b6b] focus:ring-4 focus:ring-[#2a6b6b]/10"
                  placeholder="your@email.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5">Password</label>
              <div className="relative">
                <i className="fas fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3 bg-[#faf8f6] border border-gray-200 rounded-xl focus:outline-none focus:border-[#2a6b6b] focus:ring-4 focus:ring-[#2a6b6b]/10"
                  placeholder="Min. 6 characters"
                />
              </div>
              <div className="flex gap-1 mt-2">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full ${
                      passwordStrength.level === 'strong' && i <= 3
                        ? 'bg-green-500'
                        : passwordStrength.level === 'medium' && i <= 2
                        ? 'bg-orange-400'
                        : passwordStrength.level === 'weak' && i <= 1
                        ? 'bg-red-400'
                        : 'bg-gray-200'
                    }`}
                  ></div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">{passwordStrength.label}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5">Confirm Password</label>
              <div className="relative">
                <i className="fas fa-shield-alt absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input
                  type="password"
                  value={regConfirmPw}
                  onChange={(e) => setRegConfirmPw(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3 bg-[#faf8f6] border border-gray-200 rounded-xl focus:outline-none focus:border-[#2a6b6b] focus:ring-4 focus:ring-[#2a6b6b]/10"
                  placeholder="Re-enter password"
                />
              </div>
            </div>

            {!verificationStep ? (
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#2a6b6b] text-white font-semibold rounded-xl hover:bg-[#1b5353] transition-all disabled:opacity-50 flex items-center justify-center"
              >
                {loading ? <i className="fas fa-spinner fa-pulse"></i> : <><i className="fas fa-paper-plane mr-2"></i> Send Verification Code</>}
              </button>
            ) : (
              <div className="bg-[#f0faf7] border-2 border-dashed border-[#2a6b6b] rounded-xl p-5 text-center space-y-3 animate-fadeIn">
                <p className="text-sm text-gray-600"><i className="fas fa-envelope-open-text"></i> A code was sent to {regEmail}</p>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={verifyCode}
                    onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="6-digit code"
                    maxLength="6"
                    className="flex-1 py-2 px-4 bg-white border border-gray-200 rounded-xl text-center tracking-[8px] font-semibold focus:outline-none focus:border-[#2a6b6b]"
                  />
                  <button
                    type="button"
                    onClick={handleVerify}
                    disabled={loading}
                    className="px-6 py-2 bg-[#2a6b6b] text-white font-semibold rounded-xl hover:bg-[#1b5353] transition-all disabled:opacity-50"
                  >
                    {loading ? <i className="fas fa-spinner fa-pulse"></i> : 'Verify'}
                  </button>
                </div>
              </div>
            )}

            <p className="text-center text-sm text-gray-500 mt-3">
              Already have an account?{' '}
              <button type="button" onClick={() => setActiveTab('login')} className="text-[#2a6b6b] font-semibold underline hover:text-[#1b5353]">
                Sign in
              </button>
            </p>
          </form>
        )}
      </div>

      {toast && <ToastMessage toast={toast} />}
    </div>
  );
};

// Reusable toast component
const ToastMessage = ({ toast }) => (
  <div className={`fixed top-5 right-5 bg-white rounded-xl px-5 py-3 shadow-lg z-50 flex items-center gap-3 border-l-4 transition-transform duration-300 ${
    toast.type === 'success' ? 'border-l-green-500' : 'border-l-red-500'
  }`}>
    <i className={`fas ${toast.type === 'success' ? 'fa-check-circle text-green-500' : 'fa-exclamation-circle text-red-500'} text-xl`}></i>
    <span className="font-medium text-sm">{toast.message}</span>
  </div>
);

export default Account;