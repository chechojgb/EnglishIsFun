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
      <div className="reveal lg:col-span-7 relative w-full mt-10 lg:mt-0">
        {/* Glow de fondo */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[85%] bg-pink-200/25 blur-[90px] rounded-full -z-10" />

        {/* CONTENEDOR AJUSTADO: 
            - aspect-[4/5] en móvil (más alto para que no se vea espichado)
            - aspect-[16/10] en desktop
        */}
        <div className="relative w-full aspect-[4/5] md:aspect-[16/10] bg-white p-2 md:p-3 rounded-[40px] md:rounded-[56px] shadow-[0_50px_100px_rgba(0,0,0,0.07)] border border-white/50">
          
          <div className="w-full h-full bg-[#FFF5F5] rounded-[32px] md:rounded-[44px] overflow-hidden relative border-2 border-pink-50">
            
            {/* Spline ahora llenará el contenedor que definimos arriba */}
            <Spline 
              scene="https://prod.spline.design/DgKgiKyhZBuzqbRv/scene.splinecode" 
              className="w-full h-full"
            />

            {/* OVERLAYS ACTUALIZADOS */}
            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 flex justify-between items-end pointer-events-none">
              
              {/* Etiqueta Interactive (Se queda a la izquierda) */}
              <div className="bg-white/90 backdrop-blur-md px-3 py-2 md:px-4 md:py-2.5 rounded-xl md:rounded-2xl shadow-lg border border-white flex items-center gap-2 self-end mb-1 md:mb-0">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="font-black text-gray-700 uppercase text-[8px] md:text-[10px] tracking-widest">Interactive</span>
              </div>

              {/* Card Negra (Ahora a la derecha para tapar el logo de Spline) */}
              <div className="relative group">
                {/* Este div vacío opcional bloquea clicks en el logo de spline si fuera necesario */}
                <div className="absolute inset-0 z-10 pointer-events-auto" /> 
                
                <div className="bg-gray-900 text-white px-4 py-3 md:px-6 md:py-4 rounded-2xl md:rounded-[1.8rem] shadow-2xl relative z-20 pointer-events-auto min-w-[140px] md:min-w-[180px]">
                  <div className="text-[7px] md:text-[9px] uppercase font-black opacity-40 tracking-tighter mb-0.5">just do it</div>
                  <div className="font-bold text-xs md:text-sm whitespace-nowrap leading-tight">
                    Words are <br className="md:hidden" /> Magic Keys
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}