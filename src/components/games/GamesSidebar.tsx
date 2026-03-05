"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { animate, stagger, createDrawable } from 'animejs';
import { Hash, MessageCircle, Home, BookOpen, ChevronLeft, Star, Menu } from 'lucide-react';

// ... (Interfaces GameItem y Theme se mantienen igual)
interface GameItem { id: string; name: string; }
interface Theme { title: string; icon: React.ReactNode; games: GameItem[]; }

export default function GamesSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);
  const underlineRef = useRef<SVGPathElement>(null);

  const topics: Theme[] = [
    { title: 'Numbers', icon: <Hash size={18} />, games: [{ id: '/numbers/count-10', name: 'Count to 10' }, { id: '/numbers/math-magic', name: 'Math Magic' }] },
    { title: 'Verb to Be', icon: <MessageCircle size={18} />, games: [{ id: '/verbToBe/am-is-are', name: 'Am, Is, Are?' }, { id: '/verbToBe/be-hero', name: 'Be a Hero' }] },
    { title: 'Family', icon: <Home size={18} />, games: [{ id: '/family/family-tree', name: 'My Family Tree' }, { id: '/family/who-is-who', name: 'Who is Who?' }] },
    { title: 'Vocals & Alphabet', icon: <BookOpen size={18} />, games: [{ id: '/alphabet/vocal-islands', name: 'Vocal Islands' }, { id: '/alphabet/abc-adventure', name: 'ABC Adventure' }] },
  ];

  const activeTheme = topics.find(topic => topic.games.some(game => pathname?.includes(game.id)));
  const [openTheme, setOpenTheme] = useState<string | null>(activeTheme?.title ?? "Numbers");

  // EFECTO DE ANIMACIÓN CORREGIDO
  useEffect(() => {
    if (isOpen) {
      // Animación de las letras del título
      animate('.title-letter', {
        opacity: [0, 1],
        translateY: [12, 0],
        delay: stagger(60),
        easing: 'easeOutElastic(1, .6)',
        duration: 700,
      });

      // Animación de los items del menú
      animate('.sidebar-item', {
        opacity: [0, 1],
        translateX: [-16, 0],
        delay: stagger(40),
        easing: 'easeOutQuad',
        duration: 400,
      });

      // Animación del subrayado
      if (underlineRef.current) {
        const [drawable] = createDrawable(underlineRef.current);
        drawable.draw = '0 0';
        animate(drawable, {
          draw: ['0 0', '0 1'],
          duration: 1000,
          delay: 500,
          easing: 'easeInOutQuad',
        });
      }
    }
  }, [isOpen]); // Se dispara cada vez que isOpen cambia a true

  const title = "MAGIC GAMES";

  return (
    <>
      {/* OVERLAY móvil */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 bg-black/30 z-40 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
      )}

      {/* BOTÓN móvil cuando está cerrado */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="md:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-white rounded-xl shadow-md border border-gray-100 flex items-center justify-center text-gray-600"
        >
          <Menu size={20} />
        </button>
      )}

      {/* SIDEBAR móvil */}
      <aside className={`md:hidden fixed top-0 left-0 h-screen bg-white border-r border-gray-100 z-50 flex flex-col transition-all duration-300 ease-in-out ${isOpen ? 'w-72 translate-x-0' : 'w-0 -translate-x-full'}`}>
        <SidebarInner isOpen={isOpen} setIsOpen={setIsOpen} topics={topics} pathname={pathname} openTheme={openTheme} setOpenTheme={setOpenTheme} title={title} underlineRef={underlineRef} />
      </aside>

      {/* SIDEBAR desktop */}
      <aside className={`hidden md:flex flex-col bg-white border-r border-gray-100 sticky top-0 h-screen z-20 transition-all duration-300 ease-in-out ${isOpen ? 'w-72' : 'w-[72px]'}`}>
        <SidebarInner isOpen={isOpen} setIsOpen={setIsOpen} topics={topics} pathname={pathname} openTheme={openTheme} setOpenTheme={setOpenTheme} title={title} underlineRef={underlineRef} />
      </aside>
    </>
  );
}

function SidebarInner({ isOpen, setIsOpen, topics, pathname, openTheme, setOpenTheme, title, underlineRef }: any) {
  return (
    <div className="flex flex-col h-full py-4 px-3 gap-5 overflow-x-hidden">
      
      {/* HEADER CORREGIDO */}
      <div className={`flex items-center ${isOpen ? 'justify-between' : 'justify-center'} min-h-[44px] px-1`}>
        {isOpen ? (
          <Link href="/" className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-9 h-9 bg-purple-500 rounded-xl flex items-center justify-center text-white font-black shadow-md text-sm shrink-0">M</div>
            <div className="flex flex-col">
              <div className="flex">
                {title.split('').map((char: string, i: number) => (
                    <span
                      key={i}
                      className="title-letter font-black text-lg tracking-tighter text-gray-800 leading-none"
                      style={{
                        opacity: 0,
                        display: 'inline-block',
                        width: char === ' ' ? '0.4em' : undefined,
                      }}
                    >
                      {char}
                    </span>
                  ))}
              </div>
              <svg width="104" height="7" viewBox="0 0 104 7" fill="none" className="mt-1">
                <path ref={underlineRef} d="M0 4 Q13 1 26 4 Q39 7 52 4 Q65 1 78 4 Q91 7 104 4" stroke="#a855f7" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              </svg>
            </div>
          </Link>
        ) : (
          <button 
            onClick={() => setIsOpen(true)}
            className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center text-white font-black shadow-md hover:scale-105 transition-transform"
          >
            M
          </button>
        )}

        {isOpen && (
          <button onClick={() => setIsOpen(false)} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400">
            <ChevronLeft size={18} />
          </button>
        )}
      </div>

      {/* NAVEGACIÓN */}
      <nav className="flex flex-col gap-2 overflow-y-auto flex-1 no-scrollbar">
        {topics.map((topic: any) => {
          const isTopicOpen = openTheme === topic.title;
          const hasActiveGame = topic.games.some((game: any) => pathname?.includes(game.id));

          return (
            <div key={topic.title} className="flex flex-col">
              <button
                onClick={() => {
                  if (!isOpen) { setIsOpen(true); setOpenTheme(topic.title); return; }
                  setOpenTheme(isTopicOpen ? null : topic.title);
                }}
                className={`flex items-center rounded-xl transition-all duration-200 font-bold text-sm
                  ${isOpen ? 'px-3 py-3 justify-between' : 'p-3 justify-center'}
                  ${(isTopicOpen && isOpen) || hasActiveGame ? 'bg-purple-50 text-purple-700' : 'hover:bg-gray-50 text-gray-500'}`}
              >
                <div className="flex items-center gap-2.5">
                  {topic.icon}
                  {isOpen && <span className="sidebar-item">{topic.title}</span>}
                </div>
              </button>

              {isOpen && isTopicOpen && (
                <div className="flex flex-col ml-4 border-l-2 border-purple-100 pl-3 py-1 gap-1">
                  {topic.games.map((game: any) => (
                    <Link key={game.id} href={`/games${game.id}`} className={`py-2 px-2 text-xs font-semibold rounded-lg ${pathname?.includes(game.id) ? 'text-purple-600 bg-purple-50' : 'text-gray-400 hover:text-purple-500'}`}>
                      {game.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
}