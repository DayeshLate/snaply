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

  const handleDevLogin = async () => {
    setDevLoading(true);
    setError('');
    try {
      await devLogin();
      success('Signed in to Demo Preview Mode! All features unlocked.');
      navigate('/dashboard');
    } catch (err) {
      showError(err.message || 'Failed to enter demo mode.');
    } finally {
      setDevLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-[#2563EB] flex items-center justify-center text-white shadow-md">
            <Camera className="w-6 h-6" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-[#0F172A]">Snaply</span>
        </Link>
        <h2 className="mt-4 text-2xl font-bold tracking-tight text-[#0F172A]">
          {activeTab === 'login' ? 'Sign in to your account' : 'Create your Snaply account'}
        </h2>
        <p className="mt-1 text-xs text-[#64748B]">
          Collaborative photo album and group sharing platform
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm rounded-lg border border-[#E2E8F0]">
          {/* Verification Notice */}
          {isVerified && (
            <div className="mb-6 p-3 rounded bg-green-50 border border-green-200 text-xs text-[#16A34A] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Email verified successfully! You can now sign in below.</span>
            </div>
          )}

          {/* Tab Switcher */}
          <div className="flex border-b border-[#E2E8F0] mb-6">
            <button
              type="button"
              onClick={() => {
                setActiveTab('login');
                setError('');
              }}
              className={`flex-1 py-2 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
                activeTab === 'login'
                  ? 'border-[#2563EB] text-[#2563EB]'
                  : 'border-transparent text-[#64748B] hover:text-[#0F172A]'
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
              className={`flex-1 py-2 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
                activeTab === 'register'
                  ? 'border-[#2563EB] text-[#2563EB]'
                  : 'border-transparent text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              Register
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 rounded bg-red-50 border border-red-200 text-xs text-[#DC2626] flex items-center gap-2">
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
            >
              {activeTab === 'login' ? 'Sign In' : 'Create Account'}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E2E8F0]" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-[#64748B]">Or test instantly</span>
            </div>
          </div>

          {/* Dev / Quick Demo Login Button */}
          <Button
            variant="outline"
            className="w-full"
            onClick={handleDevLogin}
            loading={devLoading}
          >
            One-Click Demo Sign In (demo@snaply.com)
          </Button>
        </div>
      </div>
    </div>
  );
}
