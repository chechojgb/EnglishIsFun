"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { animate, stagger, createDrawable } from 'animejs';
import { Hash, MessageCircle, Home, BookOpen, ChevronLeft, ChevronDown, Star, Menu, LayoutDashboard } from 'lucide-react';

interface GameItem { id: string; name: string; }
interface Theme { title: string; icon: React.ReactNode; games: GameItem[]; }

export default function GamesSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);
  const underlineRef = useRef<SVGPathElement>(null);

  const topics: Theme[] = [
    { title: 'Numbers', icon: <Hash size={18} />, games: [{ id: '/numbers/ballonPop', name: 'ballon Pop' }/*, { id: '/numbers/math-magic', name: 'Math Magic' }*/] },
    // { title: 'Verb to Be', icon: <MessageCircle size={18} />, games: [{ id: '/verbToBe/am-is-are', name: 'Am, Is, Are?' }, { id: '/verbToBe/be-hero', name: 'Be a Hero' }] },
    { title: 'Family', icon: <Home size={18} />, games: [{ id: '/family/family-tree', name: 'My Family Tree' }/*, { id: '/family/who-is-who', name: 'Who is Who?' }*/]},
    // { title: 'Vocals & Alphabet', icon: <BookOpen size={18} />, games: [{ id: '/alphabet/vocal-islands', name: 'Vocal Islands' }, { id: '/alphabet/abc-adventure', name: 'ABC Adventure' }] },
  ];

  const activeTheme = topics.find(topic => topic.games.some(game => pathname?.includes(game.id)));
  const [openTheme, setOpenTheme] = useState<string | null>(activeTheme?.title ?? 'Numbers');

  // Home is active when pathname is exactly /games
  const isHomeActive = pathname === '/games';

  useEffect(() => {
    if (!isOpen) return;

    animate('.title-letter', {
      opacity: [0, 1],
      translateY: [12, 0],
      delay: stagger(55),
      easing: 'easeOutElastic(1, .6)',
      duration: 700,
    });

    animate('.sidebar-item', {
      opacity: [0, 1],
      translateX: [-16, 0],
      delay: stagger(50, { start: 300 }),
      easing: 'easeOutQuad',
      duration: 350,
    });

    if (underlineRef.current) {
      const [drawable] = createDrawable(underlineRef.current);
      drawable.draw = '0 0';
      animate(drawable, {
        draw: ['0 0', '0 1'],
        duration: 900,
        delay: 500,
        easing: 'easeInOutQuad',
      });
    }
  }, [isOpen]);

  const title = 'MAGIC GAMES';

  const sidebarContent = (
    <div className="flex flex-col h-full py-4 px-3 gap-5 overflow-x-hidden">

      {/* HEADER */}
      <div className="flex items-center justify-between min-h-[44px] px-1 gap-2">
        {isOpen ? (
          <Link href="/" className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-9 h-9 bg-purple-500 rounded-xl flex items-center justify-center text-white font-black shadow-md text-sm shrink-0">M</div>
            <div className="flex flex-col">
              <div className="flex">
                {title.split('').map((char, i) => (
                  <span
                    key={i}
                    className="title-letter font-black text-lg tracking-tighter text-gray-800 leading-none"
                    style={{ opacity: 0, display: 'inline-block', width: char === ' ' ? '0.4em' : undefined }}
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </span>
                ))}
              </div>
              <svg width="104" height="7" viewBox="0 0 104 7" fill="none" className="mt-1">
                <path
                  ref={underlineRef}
                  d="M0 4 Q13 1 26 4 Q39 7 52 4 Q65 1 78 4 Q91 7 104 4"
                  stroke="#a855f7" strokeWidth="2.5" strokeLinecap="round" fill="none"
                />
              </svg>
            </div>
          </Link>
        ) : (
          <Link
            href="/"
            className="w-9 h-9 bg-purple-500 rounded-xl items-center justify-center text-white font-black shadow-md text-sm shrink-0 hover:scale-105 transition-transform hidden md:flex"
          >
            M
          </Link>
        )}

        {(isOpen || (!isOpen && typeof window !== 'undefined' && window.innerWidth >= 768)) && (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-8 h-8 rounded-lg hover:bg-gray-100 md:flex hidden items-center justify-center text-gray-400 hover:text-gray-600 transition-all shrink-0"
            aria-label={isOpen ? 'Collapse' : 'Expand'}
          >
            <ChevronLeft size={18} className={`transition-transform duration-300 ${isOpen ? '' : 'rotate-180'}`} />
          </button>
        )}

        {isOpen && (
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400"
          >
            <ChevronLeft size={18} />
          </button>
        )}
      </div>

      {/* SEPARADOR */}
      <div className="h-px bg-gray-100 mx-1" />

      {/* NAVEGACIÓN */}
      <nav className="flex flex-col gap-1 overflow-y-auto flex-1 no-scrollbar">
        {isOpen && (
          <p className="sidebar-item text-[9px] font-black uppercase tracking-[0.2em] text-gray-300 mb-2 px-2">Menu</p>
        )}

        {/* HOME LINK */}
        <div className="sidebar-item">
          <Link
            href="/games"
            onClick={() => { if (typeof window !== 'undefined' && window.innerWidth < 768) setIsOpen(false); }}
            title={!isOpen ? 'Home' : undefined}
            className={`flex items-center w-full rounded-xl transition-all duration-200 font-bold text-sm
              ${isOpen ? 'px-3 py-2.5 gap-2.5' : 'p-2.5 justify-center'}
              ${isHomeActive
                ? 'bg-purple-50 text-purple-700'
                : 'hover:bg-gray-50 text-gray-500 hover:text-gray-700'
              }`}
          >
            <LayoutDashboard size={18} className={isHomeActive ? 'text-purple-600' : ''} />
            {isOpen && <span>Home</span>}
            {isOpen && isHomeActive && (
              <span className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />
            )}
          </Link>
        </div>

        {/* SEPARADOR TOPICS */}
        {isOpen && (
          <p className="sidebar-item text-[9px] font-black uppercase tracking-[0.2em] text-gray-300 mt-3 mb-2 px-2">Topics</p>
        )}
        {!isOpen && <div className="h-px bg-gray-100 mx-1 my-1" />}

        {topics.map((topic) => {
          const isTopicOpen = openTheme === topic.title;
          const hasActiveGame = topic.games.some(game => pathname?.includes(game.id));

          return (
            <div key={topic.title} className="sidebar-item flex flex-col">
              <button
                onClick={() => {
                  if (!isOpen) { setIsOpen(true); setOpenTheme(topic.title); return; }
                  setOpenTheme(isTopicOpen ? null : topic.title);
                }}
                title={!isOpen ? topic.title : undefined}
                className={`flex items-center w-full rounded-xl transition-all duration-200 font-bold text-sm
                  ${isOpen ? 'px-3 py-2.5 justify-between' : 'p-2.5 justify-center'}
                  ${hasActiveGame || (isTopicOpen && isOpen)
                    ? 'bg-purple-50 text-purple-700'
                    : 'hover:bg-gray-50 text-gray-500 hover:text-gray-700'
                  }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={hasActiveGame ? 'text-purple-600' : ''}>{topic.icon}</span>
                  {isOpen && <span>{topic.title}</span>}
                </div>
                {isOpen && (
                  <ChevronDown
                    size={14}
                    className={`text-gray-300 transition-transform duration-300 ${isTopicOpen ? 'rotate-180' : ''}`}
                  />
                )}
              </button>

              {isOpen && isTopicOpen && (
                <div className="flex flex-col ml-4 border-l-2 border-purple-100 pl-3 py-1 gap-0.5 mt-0.5">
                  {topic.games.map((game) => {
                    const isActive = pathname?.includes(game.id);
                    return (
                      <Link
                        key={game.id}
                        href={`/games${game.id}`}
                        onClick={() => { if (typeof window !== 'undefined' && window.innerWidth < 768) setIsOpen(false); }}
                        className={`py-2 px-2 text-xs rounded-lg transition-all duration-150 flex items-center gap-1.5
                          ${isActive
                            ? 'text-purple-600 font-black bg-purple-50'
                            : 'text-gray-400 font-semibold hover:text-purple-500 hover:bg-purple-50/50'
                          }`}
                      >
                        {isActive
                          ? <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />
                          : <span className="w-1.5 h-1.5 rounded-full bg-gray-200 shrink-0" />
                        }
                        {game.name}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* PERFIL */}
      {isOpen ? (
        <div className="sidebar-item p-3 bg-purple-50 rounded-2xl border border-purple-100 flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-sm text-lg shrink-0">🐰</div>
          <div className="overflow-hidden flex-1">
            <p className="text-[9px] font-black text-purple-500 uppercase tracking-wider">Level 12</p>
            <p className="text-sm font-bold text-gray-700 truncate">Rabbit Explorer</p>
          </div>
          <div className="flex items-center gap-0.5 text-xs font-black text-purple-400 shrink-0">
            <Star size={11} className="fill-purple-400 text-purple-400" />
            320
          </div>
        </div>
      ) : (
        <div className="flex justify-center shrink-0">
          <div className="w-9 h-9 bg-purple-50 rounded-full flex items-center justify-center text-lg border border-purple-100">🐰</div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/30 z-40 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="md:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-white rounded-xl shadow-md border border-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-all"
        >
          <Menu size={20} />
        </button>
      )}

      <aside className={`md:hidden fixed top-0 left-0 h-screen bg-white border-r border-gray-100 z-50 flex flex-col transition-all duration-300 ease-in-out
        ${isOpen ? 'w-72 translate-x-0' : 'w-0 -translate-x-full'}`}
      >
        {sidebarContent}
      </aside>

      <aside className={`hidden md:flex flex-col bg-white border-r border-gray-100 sticky top-0 h-screen z-20 transition-all duration-300 ease-in-out overflow-hidden
        ${isOpen ? 'w-72' : 'w-[56px]'}`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
