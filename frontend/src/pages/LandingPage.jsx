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
      {/* 1. Sticky Glassmorphic Navbar */}
      <LandingNavbar />

      {/* 2. Above-the-Fold Hero Section with Interactive Floating Preview */}
      <LandingHero />

      {/* 3. Social Proof & High-Signal Metric Trust Bar */}
      <SocialProofStrip />

      {/* 4. 3-Column Asymmetrical Bento Grid Feature Showcase */}
      <FeaturesShowcase />

      {/* 5. Interactive 3-Step Workflow Section */}
      <HowItWorksSection />

      {/* 6. Vault Architecture & Role Governance */}
      <CollaborationShowcase />

      {/* 7. Security & Sovereignty Pillars */}
      <PrivacyTrustSection />

      {/* 8. Frictionless Closing Conversion Card */}
      <LandingCtaSection />

      {/* 9. Minimalist Sitemap Footer */}
      <LandingFooter />
    </div>
  );
}
