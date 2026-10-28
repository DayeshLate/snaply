import React, { useEffect } from 'react';
import LandingNavbar from '../components/landing/LandingNavbar';
import LandingHero from '../components/landing/LandingHero';
import SocialProofStrip from '../components/landing/SocialProofStrip';
import FeaturesShowcase from '../components/landing/FeaturesShowcase';
import HowItWorksSection from '../components/landing/HowItWorksSection';
import CollaborationShowcase from '../components/landing/CollaborationShowcase';
import PrivacyTrustSection from '../components/landing/PrivacyTrustSection';
import LandingCtaSection from '../components/landing/LandingCtaSection';
import LandingFooter from '../components/landing/LandingFooter';

export default function LandingPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#090A0F] text-[#F8FAFC] selection:bg-[#5B5BF0] selection:text-white relative font-sans overflow-x-clip">
      {/* 1. Glassmorphic Navbar */}
      <LandingNavbar />

      {/* 2. Hero Section */}
      <LandingHero />

      {/* 3. Social Proof & Trust Bar */}
      <SocialProofStrip />

      {/* 4. Covering Cards Stack with Curved Borders */}
      <div className="relative w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 mt-6 mb-20 space-y-0">
        
        {/* CARD 01: Why Snaply (Features & Full Quality) */}
        <div
          id="features"
          className="sticky w-full scroll-mt-20 z-10"
          style={{ top: '4.5rem', marginBottom: '5vh' }}
        >
          <div className="rounded-[28px] sm:rounded-[36px] md:rounded-[40px] border border-white/[0.14] bg-[#0B0C12] shadow-[0_24px_64px_rgba(0,0,0,0.9),0_-16px_48px_rgba(0,0,0,0.6)]">
            <div className="bg-[#0B0C12] min-h-[75vh] rounded-[28px] sm:rounded-[36px] md:rounded-[40px]">
              <FeaturesShowcase />
            </div>
          </div>
        </div>

        {/* CARD 02: How It Works (Rides over Card 01 with 1 -> 2 -> 3 scroll-driven step change) */}
        <div
          id="workflow"
          className="relative w-full z-20 scroll-mt-20"
          style={{ marginBottom: '5vh' }}
        >
          <div className="rounded-[28px] sm:rounded-[36px] md:rounded-[40px] border border-white/[0.14] bg-[#0B0C12] shadow-[0_24px_64px_rgba(0,0,0,0.9),0_-16px_48px_rgba(0,0,0,0.6)]">
            <div className="bg-[#0B0C12] rounded-[28px] sm:rounded-[36px] md:rounded-[40px]">
              <HowItWorksSection />
            </div>
          </div>
        </div>

        {/* CARD 03: Private Group Management (Rides over Card 02 completely) */}
        <div
          id="vaults"
          className="sticky w-full scroll-mt-20 z-30"
          style={{ top: '4.5rem', marginBottom: '5vh' }}
        >
          <div className="rounded-[28px] sm:rounded-[36px] md:rounded-[40px] border border-white/[0.14] bg-[#0B0C12] shadow-[0_24px_64px_rgba(0,0,0,0.9),0_-16px_48px_rgba(0,0,0,0.6)]">
            <div className="bg-[#0B0C12] min-h-[75vh] rounded-[28px] sm:rounded-[36px] md:rounded-[40px]">
              <CollaborationShowcase />
            </div>
          </div>
        </div>

        {/* CARD 04: Privacy First (Rides over Card 03 completely) */}
        <div
          id="security"
          className="sticky w-full scroll-mt-20 z-40"
          style={{ top: '4.5rem', marginBottom: '5vh' }}
        >
          <div className="rounded-[28px] sm:rounded-[36px] md:rounded-[40px] border border-white/[0.14] bg-[#0B0C12] shadow-[0_24px_64px_rgba(0,0,0,0.9),0_-16px_48px_rgba(0,0,0,0.6)]">
            <div className="bg-[#0B0C12] min-h-[75vh] rounded-[28px] sm:rounded-[36px] md:rounded-[40px]">
              <PrivacyTrustSection />
            </div>
          </div>
        </div>

        {/* CARD 05: Closing CTA (Rides over Card 04 completely) */}
        <div
          id="launch"
          className="sticky w-full scroll-mt-20 z-50"
          style={{ top: '4.5rem', marginBottom: '0' }}
        >
          <div className="rounded-[28px] sm:rounded-[36px] md:rounded-[40px] border border-white/[0.14] bg-[#0B0C12] shadow-[0_24px_64px_rgba(0,0,0,0.9),0_-16px_48px_rgba(0,0,0,0.6)]">
            <div className="bg-[#0B0C12] min-h-[75vh] rounded-[28px] sm:rounded-[36px] md:rounded-[40px]">
              <LandingCtaSection />
            </div>
          </div>
        </div>

      </div>

      {/* 5. Minimalist Sitemap Footer */}
      <LandingFooter />
    </div>
  );
}
