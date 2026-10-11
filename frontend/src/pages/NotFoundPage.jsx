import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, Home, ArrowLeft } from 'lucide-react';
import Button from '../components/common/Button';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center items-center px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-[#DBEAFE] text-[#2563EB] flex items-center justify-center mb-6 shadow-xs">
        <Camera className="w-8 h-8" />
      </div>

      <h1 className="text-6xl font-extrabold text-[#0F172A] tracking-tight">404</h1>
      <h2 className="text-xl font-bold text-[#0F172A] mt-2">Page Not Found</h2>
      <p className="text-sm text-[#64748B] mt-2 max-w-sm">
        The page you are looking for doesn't exist, has been removed, or you don't have permission to view it.
      </p>

      <div className="mt-6 flex items-center gap-3">
        <Link to="/dashboard">
          <Button className="flex items-center gap-2">
            <Home className="w-4 h-4" />
            <span>Go to Dashboard</span>
          </Button>
        </Link>
        <Link to="/">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Home Page</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
