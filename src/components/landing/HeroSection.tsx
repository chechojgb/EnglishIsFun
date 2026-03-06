// components/landing/HeroSection.tsx
"use client";
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ArrowRight } from 'lucide-react';

const Spline = dynamic(() => import('@splinetool/react-spline'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full text-pink-300 font-bold animate-pulse">
      Loading Magic...
    </div>
  )
});

export default function HeroSection() {
  return (
    <section className="max-w-[1440px] mx-auto px-8 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center pt-8 pb-24">

      {/* LEFT — Copy */}
      <div className="reveal lg:col-span-5 flex flex-col gap-7">
        <div className="inline-flex items-center gap-2 w-fit px-4 py-2 bg-orange-50 text-pink-600 rounded-2xl text-xs font-black uppercase tracking-[0.2em]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500" />
          </span>
          New Adventure: The Rabbit's World
        </div>

        <h1 className="text-6xl md:text-7xl xl:text-8xl font-black leading-[0.88] tracking-tighter italic">
          English for <br />
          <span className="text-pink-400/50 not-italic">Cool Kids.</span>
        </h1>

        <p className="text-lg text-gray-400 max-w-md leading-relaxed font-medium">
          A game-based English learning platform built for kids. Each lesson is a new adventure — drag, drop, discover and grow.
        </p>

        <Link
          href="/games"
          className="w-fit bg-pink-400/60 hover:bg-pink-600 text-white px-9 py-5 rounded-[2rem] text-lg font-black shadow-[0_15px_30px_rgba(236,72,153,0.3)] transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-2"
        >
          Play Now — It's Free <ArrowRight size={18} />
        </Link>
      </div>

      {/* RIGHT — Spline */}
      <div className="reveal lg:col-span-7 relative w-full">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[85%] bg-pink-200/25 blur-[90px] rounded-full -z-10" />

        <div className="relative w-full aspect-[16/10] bg-white p-3 rounded-[56px] shadow-[0_50px_100px_rgba(0,0,0,0.07)] border border-white/50 overflow-hidden">
          <div className="w-full h-full bg-[#FFF5F5] rounded-[44px] overflow-hidden relative border-2 border-pink-50">
            <Spline scene="https://prod.spline.design/DgKgiKyhZBuzqbRv/scene.splinecode" />

            <div className="absolute bottom-4 left-5 right-5 flex justify-between items-end pointer-events-none">
              <div className="bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-lg border border-white flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="font-black text-gray-700 uppercase text-[10px] tracking-widest">Interactive</span>
              </div>
              <div className="bg-gray-900 text-white px-5 py-3.5 rounded-[1.5rem] shadow-2xl">
                <div className="text-[9px] uppercase font-black opacity-40 tracking-tighter">just do it</div>
                <div className="font-bold text-sm">Words are Magic Keys</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}