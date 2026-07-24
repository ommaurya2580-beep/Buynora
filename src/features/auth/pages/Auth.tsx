import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  Mail, Lock, User, Phone
} from 'lucide-react';
import { useAppDispatch } from '../../../redux/store';
import { loginUser } from '../../../redux/authSlice';
import { useToast } from '../../../hooks/useToast';
import { environment } from '../../../config/environment';

export const Auth: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { showToast } = useToast();

  const isRegister = location.pathname.includes('/register');
  const isForgot = location.pathname.includes('/forgot');
  const isVerify = location.pathname.includes('/verify');
  const isReset = location.pathname.includes('/reset');

  // Form States
  const [selectedRole, setSelectedRole] = useState<'CUSTOMER' | 'SELLER' | 'ADMIN'>('CUSTOMER');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');

  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast("Please enter email and password", "error");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${environment.authUrl}/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        const token = await response.text();
        const role = selectedRole;
        dispatch(loginUser({
          name: email.split('@')[0],
          email: email,
          phone: "+1 (555) 019-2834",
          avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100",
          referralCode: 'NORA-USER',
          points: 100,
          role
        }));
        showToast("Logged in successfully!", "success");
        if (role === 'ADMIN') navigate('/admin');
        else if (role === 'SELLER') navigate('/seller');
        else navigate('/dashboard');
      } else {
        showToast("Invalid credentials or server error", "error");
      }
    } catch (err) {
      showToast("Network error connecting to auth service", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      showToast("Please fill in all registration fields", "error");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${environment.authUrl}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      if (response.ok) {
        showToast("Registration successful! Account created.", "success");
        navigate('/auth/login');
      } else {
        const errText = await response.text();
        showToast(errText || "Registration failed on server", "error");
      }
    } catch (err) {
      showToast("Network error connecting to auth service", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    showToast("Reset password token sent to email!", "success");
    navigate('/auth/reset');
  };

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 4) {
      showToast("Please enter 4 digit code", "error");
      return;
    }
    dispatch(loginUser({
      name,
      email,
      phone,
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100",
      referralCode: `NORA-${name.slice(0, 2).toUpperCase()}${Math.floor(10 + Math.random() * 90)}`,
      points: 100,
      role: 'CUSTOMER'
    }));
    showToast("OTP Verified! Welcome to Buynora.", "success");
    navigate('/');
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    showToast("Password updated! Please sign in.", "success");
    navigate('/auth/login');
  };

  return (
    <div className="glass rounded-3xl p-6 md:p-8 border border-white/10 dark:border-white/5 bg-slate-950/80 shadow-2xl relative w-full">
      
      {/* Login Screen */}
      {!isRegister && !isForgot && !isVerify && !isReset && (
        <form onSubmit={handleLoginSubmit} className="space-y-6 text-left">
          
          {/* Role Selection Tabs */}
          <div className="flex bg-slate-900 rounded-lg p-1 gap-1 border border-slate-800">
            {(['CUSTOMER', 'SELLER', 'ADMIN'] as const).map(role => (
              <button
                key={role}
                type="button"
                onClick={() => {
                  setSelectedRole(role);
                  if (role === 'CUSTOMER') setEmail('user@buynora.com');
                  if (role === 'SELLER') setEmail('seller@buynora.com');
                  if (role === 'ADMIN') setEmail('admin@buynora.com');
                  setPassword('password123');
                }}
                className={`flex-1 py-2 text-[11px] font-bold rounded-md transition-colors cursor-pointer ${
                  selectedRole === role 
                    ? 'bg-indigo-600 text-white shadow' 
                    : 'text-gray-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {role.charAt(0) + role.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-black text-text-inverted">
              {selectedRole === 'ADMIN' ? 'Admin Login' : selectedRole === 'SELLER' ? 'Seller Login' : 'Customer Login'}
            </h2>
            <p className="text-[11px] text-gray-400">Unlock custom AI suggestions and coupon offers</p>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
              <input
                type="email"
                required
                placeholder="Email Address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-slate-900 text-xs pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 focus:border-indigo-500 outline-none text-text-inverted"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
              <input
                type="password"
                required
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-slate-900 text-xs pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 focus:border-indigo-500 outline-none text-text-inverted"
              />
            </div>
          </div>

          <div className="flex justify-between items-center text-[10px]">
            <label className="flex items-center gap-1.5 cursor-pointer text-gray-400">
              <input type="checkbox" className="w-3.5 h-3.5 rounded bg-slate-900 border-slate-850" />
              Remember me
            </label>
            <Link to="/auth/forgot" className="text-indigo-400 hover:underline">
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-text-inverted font-bold text-xs py-3 rounded-xl cursor-pointer shadow transition-all hover:scale-[1.02] active:scale-95"
          >
            Access Account
          </button>

          <p className="text-[10px] text-gray-400 text-center">
            New to Buynora? <Link to="/auth/register" className="text-indigo-400 font-bold hover:underline">Register here</Link>
          </p>
        </form>
      )}

      {/* Register Screen */}
      {isRegister && (
        <form onSubmit={handleRegisterSubmit} className="space-y-6 text-left">
          <div className="space-y-1">
            <h2 className="text-xl font-black text-text-inverted">Create Account</h2>
            <p className="text-[11px] text-gray-400">Join our rewards circle and claim welcome points</p>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <User className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
              <input
                type="text"
                required
                placeholder="Full Name"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-slate-900 text-xs pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 focus:border-indigo-500 outline-none text-text-inverted"
              />
            </div>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
              <input
                type="email"
                required
                placeholder="Email Address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-slate-900 text-xs pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 focus:border-indigo-500 outline-none text-text-inverted"
              />
            </div>
            <div className="relative">
              <Phone className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
              <input
                type="text"
                required
                placeholder="Phone Number"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full bg-slate-900 text-xs pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 focus:border-indigo-500 outline-none text-text-inverted"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
              <input
                type="password"
                required
                placeholder="Choose Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-slate-900 text-xs pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 focus:border-indigo-500 outline-none text-text-inverted"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-text-inverted font-bold text-xs py-3 rounded-xl cursor-pointer shadow transition-all hover:scale-[1.02] active:scale-95"
          >
            Send Verification Code
          </button>

          <p className="text-[10px] text-gray-400 text-center">
            Already have an account? <Link to="/auth/login" className="text-indigo-400 font-bold hover:underline">Sign in</Link>
          </p>
        </form>
      )}

      {/* Forgot Password Screen */}
      {isForgot && (
        <form onSubmit={handleForgotSubmit} className="space-y-6 text-left">
          <div className="space-y-1">
            <h2 className="text-xl font-black text-text-inverted">Reset Coordinates</h2>
            <p className="text-[11px] text-gray-400">Enter your email and we'll send a recovery link</p>
          </div>

          <div className="relative">
            <Mail className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
            <input
              type="email"
              required
              placeholder="Email Address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-slate-900 text-xs pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 focus:border-indigo-500 outline-none text-text-inverted"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-text-inverted font-bold text-xs py-3 rounded-xl cursor-pointer shadow"
          >
            Send Recovery Email
          </button>

          <Link to="/auth/login" className="block text-center text-[10px] text-gray-400 hover:text-text-inverted">
            Return to Login
          </Link>
        </form>
      )}

      {/* OTP Verification Screen */}
      {isVerify && (
        <form onSubmit={handleVerifySubmit} className="space-y-6 text-left">
          <div className="space-y-1">
            <h2 className="text-xl font-black text-text-inverted">Verify Phone</h2>
            <p className="text-[11px] text-gray-400">Enter 4-digit code sent to phone number</p>
          </div>

          <div className="flex justify-center gap-3">
            <input
              type="text"
              maxLength={4}
              required
              placeholder="0 0 0 0"
              value={otp}
              onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
              className="bg-slate-900 text-center font-mono font-black text-xl tracking-[12px] pl-3 py-3 rounded-xl border border-slate-850 focus:border-indigo-500 outline-none w-48 text-text-inverted"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-text-inverted font-bold text-xs py-3 rounded-xl cursor-pointer shadow"
          >
            Verify & Create Account
          </button>
        </form>
      )}

      {/* Reset Password Screen */}
      {isReset && (
        <form onSubmit={handleResetSubmit} className="space-y-6 text-left">
          <div className="space-y-1">
            <h2 className="text-xl font-black text-text-inverted">Create New Password</h2>
            <p className="text-[11px] text-gray-400">Enter your new secure password</p>
          </div>

          <div className="relative">
            <Lock className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
            <input
              type="password"
              required
              placeholder="New Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-slate-900 text-xs pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 focus:border-indigo-500 outline-none text-text-inverted"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-text-inverted font-bold text-xs py-3 rounded-xl cursor-pointer shadow"
          >
            Update Password
          </button>
        </form>
      )}

    </div>
  );
};
