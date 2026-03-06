// components/landing/CtaSection.tsx
"use client";
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function CtaSection() {
  return (
    <section className="bg-white pb-28 px-8 md:px-12">
      <div className="max-w-[1440px] mx-auto">
        <div className="reveal bg-gradient-to-br from-pink-500 to-orange-400 rounded-[56px] px-10 md:px-20 py-16 flex flex-col md:flex-row items-center justify-between gap-10 shadow-[0_30px_80px_rgba(236,72,153,0.25)]">
          <div>
            <p className="text-white/70 text-sm font-black uppercase tracking-widest mb-3">Ready to start?</p>
            <h3 className="text-4xl md:text-5xl font-black text-white leading-tight tracking-tight">
              Your kid's favorite<br />class starts here.
            </h3>
          </div>
          <Link
            href="/games"
            className="shrink-0 bg-white text-pink-600 px-10 py-5 rounded-[2rem] text-lg font-black shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 whitespace-nowrap"
          >
            Let's Play! <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}