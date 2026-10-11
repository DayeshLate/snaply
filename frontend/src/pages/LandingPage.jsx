import React from 'react';
import { Link } from 'react-router-dom';
import {
  Camera,
  Users,
  HardDrive,
  MessageSquare,
  ShieldCheck,
  FolderLock,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import Button from '../components/common/Button';

export default function LandingPage() {
  const features = [
    {
      icon: Users,
      title: 'Private Shared Groups',
      description: 'Create invite-only spaces for trips, weddings, families, or projects. Only approved members can view and contribute.',
    },
    {
      icon: FolderLock,
      title: 'Organized Photo Albums',
      description: 'Structure your memories with dedicated sub-folders. No more messy chat camera rolls or lost photo dumps.',
    },
    {
      icon: HardDrive,
      title: 'Direct Google Drive Storage',
      description: 'Connect your own Google Drive. Photos are stored securely in your personal cloud without extra storage fees.',
    },
    {
      icon: MessageSquare,
      title: 'In-Group Conversations',
      description: 'Chat with group members right alongside your albums. Share comments and tag photos in real-time.',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Link Your Google Drive',
      description: 'Connect with a single click. Snaply automatically creates a dedicated root folder to store group uploads.',
    },
    {
      number: '02',
      title: 'Create a Group & Share Invites',
      description: 'Generate private invite codes to bring friends and family into your shared space.',
    },
    {
      number: '03',
      title: 'Upload, Browse & Relive',
      description: 'Drop full-resolution photos, organize them into albums, and enjoy your collective memories together.',
    },
  ];

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="pt-20 px-4 md:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-[#2563EB] mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Collaborative Photo Sharing & Cloud Storage</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#0F172A] max-w-4xl mx-auto leading-tight">
          Your Memories. <span className="text-[#2563EB]">Your People.</span> One Place.
        </h1>

        <p className="mt-6 text-base sm:text-lg text-[#64748B] max-w-2xl mx-auto leading-relaxed">
          Snaply lets you build private group albums, sync full-resolution photos directly to Google Drive, and chat seamlessly with the people who matter most.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/login?tab=register">
            <Button size="lg" icon={ArrowRight}>
              Get Started for Free
            </Button>
          </Link>
          <a href="#features">
            <Button variant="outline" size="lg">
              Explore Features
            </Button>
          </a>
        </div>

        {/* Visual Product Preview Card */}
        <div className="mt-16 max-w-5xl mx-auto rounded-xl border border-[#E2E8F0] shadow-2xl bg-white overflow-hidden text-left">
          <div className="h-10 bg-slate-100 border-b border-[#E2E8F0] px-4 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-amber-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
            <span className="text-xs text-[#64748B] font-mono ml-2">snaply.app / dashboard</span>
          </div>
          <div className="p-6 md:p-8 bg-slate-50 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-lg border border-[#E2E8F0] shadow-2xs">
              <span className="text-xs font-bold text-[#2563EB] uppercase tracking-wider">Group</span>
              <h3 className="text-lg font-bold text-[#0F172A] mt-1">Alps Vacation 2026</h3>
              <p className="text-xs text-[#64748B] mt-1">12 Members • 4 Albums • 142 Photos</p>
              <div className="mt-4 grid grid-cols-3 gap-1.5 rounded overflow-hidden">
                <div className="h-14 bg-blue-100 rounded flex items-center justify-center text-blue-500 font-bold text-xs">Peak</div>
                <div className="h-14 bg-indigo-100 rounded flex items-center justify-center text-indigo-500 font-bold text-xs">Cabin</div>
                <div className="h-14 bg-sky-100 rounded flex items-center justify-center text-sky-500 font-bold text-xs">Hike</div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-lg border border-[#E2E8F0] shadow-2xs">
              <span className="text-xs font-bold text-[#16A34A] uppercase tracking-wider">Storage Status</span>
              <h3 className="text-lg font-bold text-[#0F172A] mt-1">Google Drive Connected</h3>
              <p className="text-xs text-[#64748B] mt-1">Synced to /Snaply/Alps Vacation 2026</p>
              <div className="mt-5 flex items-center gap-2 text-xs text-[#16A34A] font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Zero storage compression applied</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-lg border border-[#E2E8F0] shadow-2xs">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Group Chat</span>
              <h3 className="text-lg font-bold text-[#0F172A] mt-1">Recent Discussion</h3>
              <div className="mt-3 space-y-2 text-xs">
                <div className="bg-slate-100 p-2 rounded text-[#0F172A]">
                  <span className="font-bold text-[#2563EB]">Alex:</span> Just uploaded 40 photos from the summit!
                </div>
                <div className="bg-blue-50 p-2 rounded text-[#1E3A8A]">
                  <span className="font-bold">You:</span> Awesome, creating the "Day 3" album now.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-4 md:px-8 max-w-7xl mx-auto scroll-mt-24">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-[#0F172A]">Built for Real Group Collaboration</h2>
          <p className="text-sm text-[#64748B] mt-3">
            Every feature in Snaply is designed to make collecting and reliving shared experiences effortless.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="bg-white p-6 rounded-lg border border-[#E2E8F0] hover:border-[#2563EB]/40 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded bg-blue-50 text-[#2563EB] flex items-center justify-center mb-5">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-[#0F172A] mb-2">{feat.title}</h3>
                  <p className="text-xs text-[#64748B] leading-relaxed">{feat.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="px-4 md:px-8 max-w-7xl mx-auto bg-slate-50 py-16 rounded-2xl border border-[#E2E8F0]">
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-[#0F172A]">How Snaply Works</h2>
          <p className="text-sm text-[#64748B] mt-2">Get up and running in less than two minutes.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((st) => (
            <div key={st.number} className="bg-white p-6 rounded-lg border border-[#E2E8F0] shadow-2xs">
              <span className="text-2xl font-black text-[#2563EB] font-mono">{st.number}</span>
              <h3 className="text-base font-bold text-[#0F172A] mt-3 mb-2">{st.title}</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">{st.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Privacy and Group Sharing */}
      <section id="privacy" className="px-4 md:px-8 max-w-5xl mx-auto text-center">
        <div className="w-12 h-12 rounded-full bg-blue-50 text-[#2563EB] flex items-center justify-center mx-auto mb-4">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h2 className="text-3xl font-bold text-[#0F172A]">Your Privacy Stays Intact</h2>
        <p className="text-sm text-[#64748B] max-w-2xl mx-auto mt-3 leading-relaxed">
          Snaply doesn't sell your memories or train AI models on your photos. All media is strictly scoped to your private group memberships with role-based permissions and stored in your own Google Drive.
        </p>
      </section>

      {/* Final Call to Action */}
      <section className="px-4 md:px-8 max-w-4xl mx-auto text-center bg-linear-to-r from-blue-600 to-indigo-700 text-white p-12 rounded-2xl shadow-xl">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Ready to Organize Your Memories?</h2>
        <p className="text-sm sm:text-base text-blue-100 max-w-xl mx-auto mt-3 leading-relaxed">
          Join Snaply today. Invite your circle and keep all your photos together.
        </p>
        <div className="mt-8">
          <Link to="/login?tab=register">
            <button className="bg-white text-[#1E3A8A] hover:bg-blue-50 font-bold px-6 py-3 rounded text-sm transition-colors cursor-pointer shadow-md">
              Create Your First Album
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
