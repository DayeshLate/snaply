import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Camera, Mail, Lock, User, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') === 'register' ? 'register' : 'login';
  const isVerified = searchParams.get('verified') === 'true';

  const [activeTab, setActiveTab] = useState(initialTab);
  const [name, setName] = useState('');
  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [devLoading, setDevLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, register, devLogin } = useAuth();
  const { success, error: showError } = useToast();
  const navigate = useNavigate();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    try {
      if (activeTab === 'login') {
        await login(email.trim(), password);
        success('Welcome back to Snaply!');
        navigate('/dashboard');
      } else {
        if (!name.trim()) {
          setError('Please provide your name.');
          setLoading(false);
          return;
        }
        await register(name.trim(), email.trim(), password);
        success('Registration successful! Please check your email to verify your account.');
        setActiveTab('login');
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDevLogin = async (emailToUse = 'dayeshlaptop@gmail.com', nameToUse = 'dayesh') => {
    setDevLoading(true);
    setError('');
    try {
      await devLogin(emailToUse, nameToUse);
      success(`Signed in as ${emailToUse}!`);
      navigate('/dashboard');
    } catch (err) {
      showError(err.message || 'Failed to sign in.');
    } finally {
      setDevLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F17] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-colors">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        <Link to="/" className="inline-flex items-center gap-3 group mb-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
            <Camera className="w-6 h-6" />
          </div>
          <span className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Snaply
          </span>
        </Link>
        <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
          {activeTab === 'login' ? 'Sign in to your account' : 'Create your Snaply account'}
        </h2>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
          Collaborative photo album and group sharing platform
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl py-8 px-6 sm:px-10 shadow-2xl rounded-3xl border border-slate-200/80 dark:border-slate-800">
          {/* Verification Notice */}
          {isVerified && (
            <div className="mb-6 p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
              <span>Email verified successfully! You can now sign in below.</span>
            </div>
          )}

          {/* Tab Switcher Pills */}
          <div className="flex p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl mb-6">
            <button
              type="button"
              onClick={() => {
                setActiveTab('login');
                setError('');
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === 'login'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('register');
                setError('');
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === 'register'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Register
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            {activeTab === 'register' && (
              <Input
                label="Full Name"
                placeholder="Jane Doe"
                icon={User}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            )}

            <Input
              label="Email Address"
              type="email"
              placeholder="name@example.com"
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              icon={Lock}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button
              type="submit"
              className="w-full mt-2"
              loading={loading}
              icon={ArrowRight}
              variant="primary"
              size="lg"
            >
              {activeTab === 'login' ? 'Sign In' : 'Create Account'}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-800" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-wider">
              <span className="bg-white dark:bg-slate-900 px-3 text-slate-400">Quick Dev Accounts</span>
            </div>
          </div>

          <div className="space-y-2.5">
            <Button
              variant="outline"
              className="w-full justify-between text-xs py-2.5"
              onClick={() => handleDevLogin('dayeshlaptop@gmail.com', 'dayesh')}
              loading={devLoading}
            >
              <span className="font-bold text-slate-900 dark:text-white">dayeshlaptop@gmail.com</span>
              <span className="text-[10px] bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-cyan-400 border border-blue-200/50 dark:border-blue-800/40 px-2 py-0.5 rounded-full font-bold">4 Groups</span>
            </Button>

            <Button
              variant="outline"
              className="w-full justify-between text-xs py-2.5"
              onClick={() => handleDevLogin('rob857210@gmail.com', 'rob')}
              loading={devLoading}
            >
              <span className="font-bold text-slate-900 dark:text-white">rob857210@gmail.com</span>
              <span className="text-[10px] bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-200/50 dark:border-purple-800/40 px-2 py-0.5 rounded-full font-bold">2 Groups</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
