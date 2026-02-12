import React from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Footer from "./components/Footer";
import AnimatedBackground from "./components/AnimatedBackground";

const LandingPage = () => {
  return (
    <div className="relative min-h-screen bg-[#020617] text-gray-200">
      
      <AnimatedBackground />
      <Header />
      <Hero />
      <Features />
      <Footer />
    </div>
  );
};

export default LandingPage;
