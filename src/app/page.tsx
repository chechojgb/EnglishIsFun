"use client";
import { useEffect } from 'react';
import { animate, stagger } from 'animejs';
import dynamic from 'next/dynamic';

const Spline = dynamic(() => import('@splinetool/react-spline'), { 
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full text-pink-300">Loading Magic...</div>
});

export default function LandingPage() {
  
  useEffect(() => {
    animate('.reveal', {
      opacity: [0, 1],
      translateY: [40, 0],
      scale: [0.95, 1],
      delay: stagger(150),
      easing: 'easeOutElastic(1, .8)',
      duration: 1200
    });
  }, []);

  return (
    <main className="min-h-screen bg-[#FFF9F9] text-[#2D2D2D] font-sans overflow-x-hidden">
      
      {/* 1. NAVEGACIÓN */}
      <nav className="flex justify-between items-center px-10 py-8 max-w-[1440px] mx-auto">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-orange-400 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-[0_8px_20px_rgba(236,72,153,0.3)] group-hover:rotate-12 transition-transform duration-300">M</div>
          <span className="text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-orange-500">MAGIC</span>
        </div>
        
        <div className="hidden md:flex gap-10 items-center font-bold text-gray-400">
          {['Courses', 'Games', 'About'].map((item) => (
            <a key={item} href="games" className="hover:text-pink-500 transition-colors relative group">
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-1 bg-pink-500 rounded-full group-hover:w-full transition-all duration-300"></span>
            </a>
          ))}
          <button className="bg-gray-900 text-white px-8 py-3 rounded-2xl hover:bg-pink-600 transition-all shadow-lg hover:shadow-pink-200">
            Log In
          </button>
        </div>
      </nav>

      {/* 2. HERO SECTION - Ajustada para mayor ancho horizontal */}
      <section className="max-w-[1440px] mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pt-12 pb-24">
        
        {/* Lado Izquierdo: Copy (4 Columnas) */}
        <div className="reveal lg:col-span-4 flex flex-col gap-8">
          <div className="inline-flex items-center gap-2 w-fit px-4 py-2 bg-orange-50 text-orange-600 rounded-2xl text-xs font-black uppercase tracking-[0.2em]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
            </span>
            New Adventure: The Rabbit's World
          </div>

          <h1 className="text-7xl md:text-8xl font-black leading-[0.9] tracking-tighter italic">
            English for <br/>
            <span className="text-pink-500 not-italic">Cool Kids.</span>
          </h1>

          <p className="text-xl text-gray-400 max-w-lg leading-relaxed font-medium">
            Where 3D worlds meet language learning. No more boring flashcards—just pure play.
          </p>
          
          <div className="flex flex-wrap gap-5 mt-4">
            <button className="bg-pink-500 hover:bg-pink-600 text-white px-10 py-6 rounded-[2rem] text-xl font-black shadow-[0_15px_30px_rgba(236,72,153,0.3)] transition-all hover:-translate-y-1 active:scale-95">
              Play Now — It's Free
            </button>
          </div>
        </div>

        {/* Lado Derecho: EL EXHIBIDOR ALARGADO (8 Columnas) */}
        <div className="reveal lg:col-span-8 relative w-full">
          {/* Fondo decorativo con blur */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[90%] bg-pink-200/30 blur-[100px] rounded-full -z-10" />
          
          {/* MARCO DEL SPLINE - Ahora mucho más alargado horizontalmente */}
          <div className="relative w-full aspect-[16/10] bg-white p-4 rounded-[60px] shadow-[0_50px_100px_rgba(0,0,0,0.08)] border border-white/50 overflow-hidden">
            <div className="w-full h-full bg-[#FFF5F5] rounded-[45px] overflow-hidden relative border-2 border-pink-50">
              <Spline scene="https://prod.spline.design/DgKgiKyhZBuzqbRv/scene.splinecode" />
              
              {/* Overlays de juego */}
              <div className="absolute bottom-4 left-6 right-2 flex justify-between items-end pointer-events-none">
                <div className="bg-white/90 backdrop-blur-md px-5 py-3 rounded-3xl shadow-xl border border-white flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="font-black text-gray-700 uppercase text-[10px] tracking-widest">Interactive</span>
                </div>
                <div className="bg-gray-900 text-white px-6 py-4 rounded-[2rem] shadow-2xl">
                  <div className="text-[9px] uppercase font-black opacity-50 tracking-tighter">just do it</div>
                  <div className="font-bold text-sm">Words are Magic Keys</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SECCIÓN DE JUEGOS */}
      <section className="bg-white py-32 px-8 rounded-[80px_80px_0_0] shadow-[0_-20px_60px_rgba(0,0,0,0.02)]">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
            <div className="max-w-xl">
              <h2 className="text-5xl font-black text-gray-900 mb-4 tracking-tight">Level up your skills.</h2>
              <p className="text-gray-400 text-lg font-medium">Explore bite-sized activities designed to keep kids engaged and smiling.</p>
            </div>
            <button className="bg-pink-50 text-pink-600 px-8 py-4 rounded-2xl font-black hover:bg-pink-100 transition-all">
              See All Games →
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '🎨', title: 'Creative Art', color: 'bg-orange-50', text: 'text-orange-600' },
              { icon: '🧩', title: 'Logic Puzzles', color: 'bg-blue-50', text: 'text-blue-600' },
              { icon: '🎵', title: 'Sing Along', color: 'bg-purple-50', text: 'text-purple-600' }
            ].map((game, i) => (
              <div key={i} className="reveal group bg-gray-50 p-10 rounded-[50px] hover:bg-white hover:shadow-2xl transition-all duration-500 cursor-pointer border border-transparent hover:border-gray-100">
                <div className={`w-20 h-20 ${game.color} rounded-[30px] mb-8 shadow-inner flex items-center justify-center text-4xl group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300`}>
                  {game.icon}
                </div>
                <h4 className="text-3xl font-black mb-3">{game.title}</h4>
                <p className="text-gray-400 font-medium leading-relaxed">
                  Interactive lessons that feel like a Sunday morning cartoon.
                </p>
                <div className={`mt-6 font-black ${game.text} opacity-0 group-hover:opacity-100 transition-opacity`}>
                  Start Play →
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}