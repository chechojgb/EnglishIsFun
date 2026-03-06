"use client";
import { useEffect } from 'react';
import { animate, stagger } from 'animejs';
import Navbar from '@/components/landing/Navbar';
import HeroSection from '@/components/landing/HeroSection';
import TopicsSection from '@/components/landing/TopicsSection';
import CtaSection from '@/components/landing/CtaSection';

export default function LandingPage() {
  useEffect(() => {
    animate('.reveal', {
      opacity: [0, 1],
      translateY: [40, 0],
      scale: [0.97, 1],
      delay: stagger(120),
      easing: 'easeOutElastic(1, .8)',
      duration: 1100
    });
  }, []);

  return (
    <main className="min-h-screen bg-[#FFF9F9] text-[#2D2D2D] font-sans overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <TopicsSection />
      <CtaSection />
    </main>
  );
}