import React, { useEffect } from 'react';
import LandingNavbar from '../components/landing/LandingNavbar';
import LandingHero from '../components/landing/LandingHero';
import SocialProofStrip from '../components/landing/SocialProofStrip';
import FeaturesShowcase from '../components/landing/FeaturesShowcase';
import InteractiveGallery from '../components/landing/InteractiveGallery';
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-blue-500 selection:text-white transition-colors duration-200">
      {/* Navigation */}
      <LandingNavbar />

      {/* Hero Section */}
      <LandingHero />

      {/* Social Proof Strip */}
      <SocialProofStrip />

      {/* 4 Distinct Core Features */}
      <FeaturesShowcase />

      {/* Interactive Photo Gallery with Lightbox */}
      <InteractiveGallery />

      {/* 3 Simple Steps Process */}
      <HowItWorksSection />

      {/* Group Collaboration Workspace Mockup */}
      <CollaborationShowcase />

      {/* Privacy & Trust Pillars */}
      <PrivacyTrustSection />

      {/* Final Action Call */}
      <LandingCtaSection />

      {/* Footer */}
      <LandingFooter />
    </div>
  );
}
