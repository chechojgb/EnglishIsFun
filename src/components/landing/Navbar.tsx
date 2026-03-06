"use client";
import { useState } from 'react';
import Link from 'next/link';
import { X, Menu } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Games', href: '/games' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  // Colores consistentes para reutilizar
  const brandGradient = "bg-gradient-to-br from-pink-400 via-fuchsia-500 to-purple-600";
  const textGradient = "bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600";

  return (
    <>
      <nav className="flex justify-between items-center px-8 md:px-12 py-7 max-w-[1440px] mx-auto">
        
        {/* LOGO PRINCIPAL */}
        <Link href="/" className="flex items-center gap-3 group cursor-pointer">
          <div className={`w-10 h-10 md:w-11 md:h-11 ${brandGradient} rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-[0_8px_20px_rgba(217,70,239,0.3)] group-hover:rotate-12 transition-transform duration-300`}>
            M
          </div>
          <span className={`text-xl font-black tracking-tight ${textGradient}`}>
            MAGIC
          </span>
        </Link>

        {/* DESKTOP LINKS */}
        <div className="hidden md:flex gap-8 items-center font-bold text-gray-500">
          {NAV_LINKS.map(item => (
            <Link key={item.label} href={item.href} className="hover:text-fuchsia-600 transition-colors relative group">
              {item.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-fuchsia-500 rounded-full group-hover:w-full transition-all duration-300" />
            </Link>
          ))}
        </div>

        {/* BOTÓN HAMBURGUESA */}
        <button
          onClick={() => setMobileOpen(true)}
          className="md:hidden w-10 h-10 bg-white border border-gray-100 rounded-xl shadow-sm flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-all"
        >
          <Menu size={20} />
        </button>
      </nav>

      {/* MOBILE MENU OVERLAY */}
      <div className={`fixed inset-0 z-[60] md:hidden transition-all duration-300 ${mobileOpen ? 'visible' : 'invisible'}`}>
        <div
          className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${mobileOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setMobileOpen(false)}
        />

        <div className={`absolute top-0 left-0 h-full w-[280px] bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-out ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          
          {/* Header del Panel */}
          <div className="p-6 flex items-center justify-between border-b border-gray-50">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 ${brandGradient} rounded-lg flex items-center justify-center text-white font-black text-xs shadow-sm`}>
                M
              </div>
              <span className={`font-black text-lg tracking-tight uppercase ${textGradient}`}>Magic</span>
            </div>
            <button onClick={() => setMobileOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 px-4 py-6">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4 px-3">Navegación</p>
            <div className="space-y-1">
              {NAV_LINKS.map(item => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl font-bold text-gray-600 hover:bg-fuchsia-50 hover:text-fuchsia-600 transition-all"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-300" />
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* CTA MÓVIL */}
          <div className="p-4 mt-auto">
            <div className="bg-gradient-to-br from-fuchsia-50 to-purple-50 p-4 rounded-2xl border border-fuchsia-100/50">
              <Link
                href="/games"
                onClick={() => setMobileOpen(false)}
                className={`w-full ${brandGradient} text-white font-bold py-3.5 rounded-xl shadow-lg flex items-center justify-center hover:brightness-110 active:scale-[0.98] transition-all`}
              >
                Play Now 🎈
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}