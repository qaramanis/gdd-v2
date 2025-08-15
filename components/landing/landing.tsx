import React from "react";
import CTASection from "./sections/cta-section";
import FAQSection from "./sections/faq-section";
import FeaturesSection from "./sections/features-section";
import HeroSection from "./sections/hero-section";
import ReviewsSection from "./sections/reviews-section";
import WhySection from "./sections/why-section";
import Navigation from "./navigation";
import Footer from "./footer";

export default function Landing() {
  return (
    <div className="relative justify-center">
      {/* <MainNav /> */}
      <div className="min-h-screen bg-black">
        <Navigation />
        <HeroSection />
        <FeaturesSection />
        <WhySection />
        <ReviewsSection />
        <FAQSection />
        <CTASection />
        <Footer />
      </div>
    </div>
  );
}
