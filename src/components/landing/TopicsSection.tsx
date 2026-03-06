// components/landing/TopicsSection.tsx
"use client";
import Link from 'next/link';
import { Hash, MessageCircle, Home, BookOpen, ArrowRight } from 'lucide-react';

const TOPICS = [
  {
    icon: <Hash size={28} />,
    title: 'Numbers',
    desc: 'Count, add and play with numbers in fun mini-games.',
    color: 'bg-orange-50', text: 'text-orange-500', border: 'hover:border-orange-200',
    href: '/games'
  },
  {
    icon: <MessageCircle size={28} />,
    title: 'Verb to Be',
    desc: 'Master am, is and are through stories and challenges.',
    color: 'bg-blue-50', text: 'text-blue-500', border: 'hover:border-blue-200',
    href: '/games'
  },
  {
    icon: <Home size={28} />,
    title: 'Family',
    desc: 'Learn every family word by building your own tree.',
    color: 'bg-pink-50', text: 'text-pink-500', border: 'hover:border-pink-200',
    href: '/games'
  },
  {
    icon: <BookOpen size={28} />,
    title: 'Alphabet',
    desc: 'Explore vowels and letters through islands and adventures.',
    color: 'bg-purple-50', text: 'text-purple-500', border: 'hover:border-purple-200',
    href: '/games'
  },
];

export default function TopicsSection() {
  return (
    <section id="topics" className="bg-white py-28 px-8 md:px-12 rounded-[70px_70px_0_0] shadow-[0_-20px_60px_rgba(0,0,0,0.02)]">
      <div className="max-w-[1440px] mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-14">
          <div className="max-w-xl">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-pink-400 mb-3">What you'll learn</p>
            <h2 className="text-5xl font-black text-gray-900 tracking-tight leading-tight">
              Level up your <br />skills.
            </h2>
            <p className="text-gray-400 text-lg font-medium mt-4">
              Bite-sized activities designed to keep kids engaged and smiling.
            </p>
          </div>
          <Link
            href="/games"
            className="flex items-center gap-2 bg-pink-50 text-pink-600 px-7 py-4 rounded-2xl font-black hover:bg-pink-100 transition-all text-sm shrink-0"
          >
            See All Games <ArrowRight size={16} />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TOPICS.map((topic, i) => (
            <Link
              key={i}
              href={topic.href}
              className={`reveal group bg-gray-50 p-8 rounded-[44px] hover:bg-white hover:shadow-2xl transition-all duration-500 border border-transparent ${topic.border} flex flex-col gap-5`}
            >
              <div className={`w-16 h-16 ${topic.color} rounded-[22px] flex items-center justify-center ${topic.text} group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 shadow-sm`}>
                {topic.icon}
              </div>
              <div>
                <h4 className="text-2xl font-black mb-2">{topic.title}</h4>
                <p className="text-gray-400 font-medium leading-relaxed text-sm">{topic.desc}</p>
              </div>
              <div className={`flex items-center gap-1 font-black ${topic.text} text-sm opacity-0 group-hover:opacity-100 transition-opacity mt-auto`}>
                Start Playing <ArrowRight size={14} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}