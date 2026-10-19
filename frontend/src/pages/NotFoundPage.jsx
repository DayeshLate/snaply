import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, Home, ArrowLeft, Sparkles } from 'lucide-react';
import Button from '../components/common/Button';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1728] flex flex-col justify-center items-center px-4 text-center relative overflow-hidden transition-colors selection:bg-blue-500 selection:text-white">
      <div className="relative z-10 max-w-md w-full p-8 sm:p-10 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none animate-scale-in">
        <div className="w-24 h-24 flex items-center justify-center mx-auto mb-6">
          <img
            src="/snaply-cloud-mark.png"
            alt="Snaply"
            className="w-full h-full object-contain drop-shadow-md"
            loading="eager"
          />
        </div>

        <h1 className="text-7xl font-black tracking-tight text-blue-600 dark:text-blue-400">
          404
        </h1>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-3">
          Page Not Found
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
          The memory or page you are looking for doesn't exist, has been archived, or you need invite access to view it.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/dashboard" className="w-full sm:w-auto">
            <Button className="w-full flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20">
              <Home className="w-4 h-4" />
              <span>Go to Dashboard</span>
            </Button>
          </Link>
          <Link to="/" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full flex items-center justify-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Landing Page</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
