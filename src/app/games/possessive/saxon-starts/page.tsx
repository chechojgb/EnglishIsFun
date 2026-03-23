'use client';

import { useState, useEffect, useRef } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────

const CHARACTERS = [
  { id: "luna",  name: "Luna",  emoji: "🐱", color: "#FF6B9D" },
  { id: "bolt",  name: "Bolt",  emoji: "🐶", color: "#4ECDC4" },
  { id: "max",   name: "Max",   emoji: "🦊", color: "#FFB347" },
  { id: "daisy", name: "Daisy", emoji: "🐰", color: "#A78BFA" },
  { id: "rocky", name: "Rocky", emoji: "🐻", color: "#6EE7B7" },
];

const ITEMS = ["ball", "hat", "book", "bag", "toy", "shoe", "pencil", "cake", "bike", "drum"];
const ITEM_EMOJIS: Record<string, string> = {
  ball: "⚽", hat: "🎩", book: "📚", bag: "🎒", toy: "🧸",
  shoe: "👟", pencil: "✏️", cake: "🎂", bike: "🚲", drum: "🥁",
};

type Mode = "menu" | "learn" | "quiz" | "build" | "results";
type QuizQ = {
  subject: string;
  subjectEmoji: string;
  subjectColor: string;
  item: string;
  itemEmoji: string;
  options: string[];
  answer: string;
};

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function makeSentence(name: string, item: string) {
  return `${name}'s ${item}`;
}

function generateQuestions(count = 8): QuizQ[] {
  const qs: QuizQ[] = [];
  const chars = shuffle(CHARACTERS);
  const items = shuffle(ITEMS);
  for (let i = 0; i < count; i++) {
    const char = chars[i % chars.length];
    const item = items[i % items.length];
    const correct = makeSentence(char.name, item);
    const wrong1 = `${char.name} ${item}`;
    const wrong2 = `${char.name}s ${item}`;
    const wrong3 = `${char.name}s' ${item}`;
    const options = shuffle([correct, wrong1, wrong2, wrong3]).slice(0, 3);
    if (!options.includes(correct)) options[Math.floor(Math.random() * 3)] = correct;
    qs.push({
      subject: char.name,
      subjectEmoji: char.emoji,
      subjectColor: char.color,
      item,
      itemEmoji: ITEM_EMOJIS[item],
      options: shuffle(options),
      answer: correct,
    });
  }
  return qs;
}

// ─── STARS ────────────────────────────────────────────────────────────────────

function StarBurst({ x, y }: { x: number; y: number }) {
  const stars = Array.from({ length: 8 }, (_, i) => i);
  return (
    <div className="pointer-events-none fixed z-50" style={{ left: x - 20, top: y - 20 }}>
      {stars.map((i) => {
        const angle = (i / 8) * 360;
        const dist = 35 + Math.random() * 20;
        const dx = Math.cos((angle * Math.PI) / 180) * dist;
        const dy = Math.sin((angle * Math.PI) / 180) * dist;
        const colors = ["#FFD700", "#FF6B9D", "#4ECDC4", "#A78BFA", "#FFB347"];
        const color = colors[i % colors.length];
        return (
          <div
            key={i}
            className="absolute w-3 h-3 rounded-full"
            style={{
              background: color,
              transform: `translate(${dx}px, ${dy}px)`,
              animation: `burst 0.6s ease-out forwards`,
              animationDelay: `${i * 0.03}s`,
            }}
          />
        );
      })}
    </div>
  );
}

// ─── MENU ─────────────────────────────────────────────────────────────────────

function MenuScreen({ onMode }: { onMode: (m: Mode) => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-8 px-4">
      {/* Title */}
      <div className="text-center space-y-2">
        <div className="text-7xl animate-bounce">📖</div>
        <h1 className="text-5xl font-black tracking-tight" style={{ fontFamily: "'Fredoka One', cursive", color: "#2D1B69" }}>
          Possessive
        </h1>
        <h1 className="text-5xl font-black tracking-tight" style={{ fontFamily: "'Fredoka One', cursive", background: "linear-gradient(135deg,#FF6B9D,#A78BFA)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Saxon! ✨
        </h1>
        <p className="text-lg text-purple-500 font-semibold">Learn apostrophe-s the fun way!</p>
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-4 w-full max-w-xs">
        <MenuBtn emoji="📚" label="Learn It First!" color="#6EE7B7" text="#065F46" onClick={() => onMode("learn")} />
        <MenuBtn emoji="🎯" label="Quiz Time!" color="#FDE68A" text="#92400E" onClick={() => onMode("quiz")} />
        <MenuBtn emoji="🔨" label="Build a Sentence!" color="#C4B5FD" text="#3730A3" onClick={() => onMode("build")} />
      </div>

      {/* Characters parade */}
      <div className="flex gap-3 text-4xl">
        {CHARACTERS.map((c, i) => (
          <span
            key={c.id}
            className="inline-block"
            style={{
              animation: `float 2s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`,
            }}
          >
            {c.emoji}
          </span>
        ))}
      </div>
    </div>
  );
}

function MenuBtn({ emoji, label, color, text, onClick }: { emoji: string; label: string; color: string; text: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full py-4 px-6 rounded-2xl font-black text-xl flex items-center gap-3 shadow-lg active:scale-95 transition-transform"
      style={{ background: color, color: text, fontFamily: "'Fredoka One', cursive", boxShadow: `0 6px 0 ${color}99` }}
    >
      <span className="text-3xl">{emoji}</span>
      {label}
    </button>
  );
}

// ─── LEARN ────────────────────────────────────────────────────────────────────

const LEARN_SLIDES = [
  {
    title: "What is Possessive Saxon? 🤔",
    emoji: "🧐",
    content: "We use 's to show that something BELONGS to someone or something!",
    example: null,
    bg: "from-yellow-100 to-orange-100",
  },
  {
    title: "The Formula 📐",
    emoji: "➕",
    content: "It's super easy!",
    example: "Name + 's + thing",
    bg: "from-pink-100 to-purple-100",
    formula: true,
  },
  {
    title: "Luna's ball ⚽",
    emoji: "🐱",
    content: "This ball belongs to Luna. So we say:",
    example: "Luna's ball",
    bg: "from-pink-100 to-rose-100",
    who: "Luna", item: "ball", itemEmoji: "⚽", color: "#FF6B9D",
  },
  {
    title: "Bolt's hat 🎩",
    emoji: "🐶",
    content: "This hat belongs to Bolt. So we say:",
    example: "Bolt's hat",
    bg: "from-teal-100 to-cyan-100",
    who: "Bolt", item: "hat", itemEmoji: "🎩", color: "#4ECDC4",
  },
  {
    title: "Max's book 📚",
    emoji: "🦊",
    content: "This book belongs to Max. So we say:",
    example: "Max's book",
    bg: "from-orange-100 to-amber-100",
    who: "Max", item: "book", itemEmoji: "📚", color: "#FFB347",
  },
  {
    title: "Remember! 🌟",
    emoji: "💡",
    content: "Always add 's after the name. The little apostrophe (') is the key!",
    example: "Name ' s → Name's",
    bg: "from-green-100 to-emerald-100",
    highlight: true,
  },
];

function LearnScreen({ onBack }: { onBack: () => void }) {
  const [slide, setSlide] = useState(0);
  const s = LEARN_SLIDES[slide];

  return (
    <div className="flex flex-col items-center min-h-screen px-4 py-8 gap-6">
      <TopBar title="Learn" onBack={onBack} />

      {/* Progress dots */}
      <div className="flex gap-2">
        {LEARN_SLIDES.map((_, i) => (
          <div
            key={i}
            className="w-3 h-3 rounded-full transition-all"
            style={{ background: i <= slide ? "#A78BFA" : "#E5E7EB", transform: i === slide ? "scale(1.4)" : "scale(1)" }}
          />
        ))}
      </div>

      {/* Card */}
      <div
        key={slide}
        className={`w-full max-w-sm rounded-3xl p-6 bg-gradient-to-br ${s.bg} shadow-xl flex flex-col items-center gap-4`}
        style={{ animation: "slideIn 0.4s ease-out" }}
      >
        <div className="text-6xl">{s.emoji}</div>
        <h2 className="text-2xl font-black text-center" style={{ fontFamily: "'Fredoka One', cursive", color: "#2D1B69" }}>
          {s.title}
        </h2>
        <p className="text-base text-center text-gray-700 font-semibold">{s.content}</p>

        {(s as any).formula && (
          <div className="flex items-center gap-2 text-2xl font-black bg-white rounded-2xl px-6 py-3 shadow" style={{ fontFamily: "'Fredoka One', cursive" }}>
            <span style={{ color: "#FF6B9D" }}>Name</span>
            <span>+</span>
            <span style={{ color: "#A78BFA" }}>'s</span>
            <span>+</span>
            <span style={{ color: "#4ECDC4" }}>thing</span>
          </div>
        )}

        {(s as any).who && (
          <div className="flex items-center gap-4 bg-white rounded-2xl px-6 py-4 shadow w-full justify-center">
            <div className="text-5xl">{CHARACTERS.find((c) => c.name === (s as any).who)?.emoji}</div>
            <div className="text-3xl">+</div>
            <div className="text-5xl">{(s as any).itemEmoji}</div>
            <div className="text-3xl">=</div>
            <div className="text-xl font-black" style={{ color: (s as any).color, fontFamily: "'Fredoka One', cursive" }}>
              {(s as any).example}
            </div>
          </div>
        )}

        {s.example && !(s as any).who && !(s as any).formula && (
          <div
            className="bg-white rounded-2xl px-8 py-4 shadow text-2xl font-black text-center"
            style={{ fontFamily: "'Fredoka One', cursive", color: "#2D1B69", letterSpacing: (s as any).highlight ? "0.05em" : 0 }}
          >
            {s.example}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex gap-4">
        <button
          onClick={() => setSlide((p) => Math.max(0, p - 1))}
          disabled={slide === 0}
          className="px-6 py-3 rounded-2xl font-black text-white disabled:opacity-30 transition-all active:scale-95"
          style={{ background: "#A78BFA", fontFamily: "'Fredoka One', cursive" }}
        >
          ← Back
        </button>
        {slide < LEARN_SLIDES.length - 1 ? (
          <button
            onClick={() => setSlide((p) => p + 1)}
            className="px-6 py-3 rounded-2xl font-black text-white active:scale-95"
            style={{ background: "#FF6B9D", fontFamily: "'Fredoka One', cursive" }}
          >
            Next →
          </button>
        ) : (
          <button
            onClick={onBack}
            className="px-6 py-3 rounded-2xl font-black text-white active:scale-95"
            style={{ background: "#6EE7B7", color: "#065F46", fontFamily: "'Fredoka One', cursive" }}
          >
            Done! 🎉
          </button>
        )}
      </div>
    </div>
  );
}

// ─── QUIZ ─────────────────────────────────────────────────────────────────────

function QuizScreen({ onBack, onFinish }: { onBack: () => void; onFinish: (s: number, t: number) => void }) {
  const questions = useRef(generateQuestions(8)).current;
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [burst, setBurst] = useState<{ x: number; y: number } | null>(null);
  const [shake, setShake] = useState(false);

  const q = questions[current];
  const isLast = current === questions.length - 1;

  const handleAnswer = (opt: string, e: React.MouseEvent) => {
    if (selected) return;
    setSelected(opt);
    if (opt === q.answer) {
      setScore((s) => s + 1);
      setBurst({ x: e.clientX, y: e.clientY });
      setTimeout(() => setBurst(null), 700);
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 600);
    }
  };

  const handleNext = () => {
    if (isLast) {
      onFinish(selected === q.answer ? score : score, questions.length);
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen px-4 py-8 gap-5">
      {burst && <StarBurst x={burst.x} y={burst.y} />}
      <TopBar title={`Quiz  ${current + 1}/${questions.length}`} onBack={onBack} />

      {/* Score bar */}
      <div className="w-full max-w-sm bg-gray-100 rounded-full h-4 overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${((current) / questions.length) * 100}%`, background: "linear-gradient(90deg,#FF6B9D,#A78BFA)" }}
        />
      </div>

      {/* Question card */}
      <div
        key={current}
        className="w-full max-w-sm rounded-3xl p-6 shadow-xl flex flex-col items-center gap-4"
        style={{
          background: "white",
          border: `3px solid ${q.subjectColor}`,
          animation: shake ? "shake 0.5s ease-in-out" : "slideIn 0.35s ease-out",
        }}
      >
        <p className="text-base font-bold text-gray-500 uppercase tracking-wide">Whose is it?</p>
        <div className="flex items-center gap-4">
          <div className="text-6xl" style={{ filter: `drop-shadow(0 4px 8px ${q.subjectColor}66)` }}>
            {q.subjectEmoji}
          </div>
          <div className="text-4xl">→</div>
          <div className="text-6xl">{q.itemEmoji}</div>
        </div>
        <p className="text-xl font-black text-gray-700" style={{ fontFamily: "'Fredoka One', cursive" }}>
          This {q.item} belongs to{" "}
          <span style={{ color: q.subjectColor }}>{q.subject}</span>.
        </p>
        <p className="text-base font-semibold text-gray-500">Choose the correct sentence:</p>
      </div>

      {/* Options */}
      <div className="flex flex-col gap-3 w-full max-w-sm">
        {q.options.map((opt) => {
          let bg = "white";
          let border = "#E5E7EB";
          let txtColor = "#1F2937";
          if (selected) {
            if (opt === q.answer) { bg = "#DCFCE7"; border = "#22C55E"; txtColor = "#14532D"; }
            else if (opt === selected) { bg = "#FEE2E2"; border = "#EF4444"; txtColor = "#7F1D1D"; }
          }
          return (
            <button
              key={opt}
              onClick={(e) => handleAnswer(opt, e)}
              className="w-full py-4 px-5 rounded-2xl font-black text-lg text-left transition-all active:scale-95"
              style={{
                background: bg,
                border: `3px solid ${border}`,
                color: txtColor,
                fontFamily: "'Fredoka One', cursive",
                cursor: selected ? "default" : "pointer",
              }}
            >
              {opt === q.answer && selected ? "✅ " : opt === selected && selected !== q.answer ? "❌ " : ""}
              {opt}
            </button>
          );
        })}
      </div>

      {selected && (
        <div className="text-center space-y-1">
          {selected === q.answer ? (
            <p className="text-green-600 font-black text-xl" style={{ fontFamily: "'Fredoka One', cursive" }}>🎉 Awesome! That's right!</p>
          ) : (
            <p className="text-red-500 font-black text-base" style={{ fontFamily: "'Fredoka One', cursive" }}>
              Oops! The answer is: <span style={{ color: "#2D1B69" }}>{q.answer}</span>
            </p>
          )}
          <button
            onClick={handleNext}
            className="mt-2 px-8 py-3 rounded-2xl font-black text-white text-lg active:scale-95"
            style={{ background: "#A78BFA", fontFamily: "'Fredoka One', cursive" }}
          >
            {isLast ? "See Results! 🏆" : "Next →"}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── BUILD ────────────────────────────────────────────────────────────────────

function BuildScreen({ onBack }: { onBack: () => void }) {
  const [charIdx, setCharIdx] = useState(0);
  const [itemIdx, setItemIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [burst, setBurst] = useState<{ x: number; y: number } | null>(null);

  const char = CHARACTERS[charIdx];
  const item = ITEMS[itemIdx];
  const sentence = makeSentence(char.name, item);

  const handleReveal = (e: React.MouseEvent) => {
    setRevealed(true);
    setBurst({ x: e.clientX, y: e.clientY });
    setTimeout(() => setBurst(null), 700);
  };

  return (
    <div className="flex flex-col items-center min-h-screen px-4 py-8 gap-6">
      {burst && <StarBurst x={burst.x} y={burst.y} />}
      <TopBar title="Build a Sentence!" onBack={onBack} />

      <p className="text-gray-500 font-semibold text-center">Pick a character and an item, then build the sentence!</p>

      {/* Character picker */}
      <div className="w-full max-w-sm">
        <p className="font-black text-purple-600 mb-2" style={{ fontFamily: "'Fredoka One', cursive" }}>👤 Who?</p>
        <div className="flex gap-2 flex-wrap">
          {CHARACTERS.map((c, i) => (
            <button
              key={c.id}
              onClick={() => { setCharIdx(i); setRevealed(false); }}
              className="flex flex-col items-center py-2 px-3 rounded-2xl transition-all active:scale-95"
              style={{
                background: charIdx === i ? c.color + "33" : "#F3F4F6",
                border: `3px solid ${charIdx === i ? c.color : "transparent"}`,
              }}
            >
              <span className="text-3xl">{c.emoji}</span>
              <span className="text-xs font-black" style={{ color: c.color, fontFamily: "'Fredoka One', cursive" }}>{c.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Item picker */}
      <div className="w-full max-w-sm">
        <p className="font-black text-pink-500 mb-2" style={{ fontFamily: "'Fredoka One', cursive" }}>🎁 What item?</p>
        <div className="flex gap-2 flex-wrap">
          {ITEMS.map((it, i) => (
            <button
              key={it}
              onClick={() => { setItemIdx(i); setRevealed(false); }}
              className="flex flex-col items-center py-2 px-3 rounded-2xl transition-all active:scale-95"
              style={{
                background: itemIdx === i ? "#FDE68A" : "#F3F4F6",
                border: `3px solid ${itemIdx === i ? "#F59E0B" : "transparent"}`,
              }}
            >
              <span className="text-3xl">{ITEM_EMOJIS[it]}</span>
              <span className="text-xs font-bold text-gray-600">{it}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Preview */}
      <div
        className="w-full max-w-sm rounded-3xl p-6 flex flex-col items-center gap-3 shadow-xl"
        style={{ background: "white", border: `3px solid ${char.color}` }}
      >
        <div className="flex items-center gap-3 text-5xl">
          <span>{char.emoji}</span>
          <span>+</span>
          <span>{ITEM_EMOJIS[item]}</span>
        </div>
        <div className="flex items-center gap-2 text-lg font-black" style={{ fontFamily: "'Fredoka One', cursive" }}>
          <span style={{ color: char.color }}>{char.name}</span>
          {revealed ? (
            <>
              <span style={{ color: "#A78BFA", fontSize: "1.4em" }}>'s</span>
              <span style={{ color: "#2D1B69" }}>{item}</span>
            </>
          ) : (
            <span className="text-gray-300">___</span>
          )}
        </div>

        {!revealed ? (
          <button
            onClick={handleReveal}
            className="px-8 py-3 rounded-2xl font-black text-white text-lg active:scale-95"
            style={{ background: "linear-gradient(135deg,#FF6B9D,#A78BFA)", fontFamily: "'Fredoka One', cursive" }}
          >
            Build it! ✨
          </button>
        ) : (
          <div className="text-center space-y-1">
            <p className="text-2xl font-black" style={{ fontFamily: "'Fredoka One', cursive", color: char.color }}>
              "{sentence}" 🎉
            </p>
            <p className="text-sm text-gray-500 font-semibold">The {item} belongs to {char.name}!</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── RESULTS ─────────────────────────────────────────────────────────────────

function ResultsScreen({ score, total, onRetry, onMenu }: { score: number; total: number; onRetry: () => void; onMenu: () => void }) {
  const pct = score / total;
  const stars = pct >= 0.875 ? 3 : pct >= 0.625 ? 2 : 1;
  const msg = stars === 3 ? "Amazing! You're a Saxon Star! 🌟" : stars === 2 ? "Great job! Keep practicing! 💪" : "Good try! Let's practice more! 📚";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 gap-6">
      <div className="text-7xl" style={{ animation: "float 2s ease-in-out infinite" }}>🏆</div>
      <h2 className="text-4xl font-black text-center" style={{ fontFamily: "'Fredoka One', cursive", color: "#2D1B69" }}>
        Quiz Done!
      </h2>

      {/* Stars */}
      <div className="flex gap-2 text-5xl">
        {[1, 2, 3].map((s) => (
          <span key={s} style={{ opacity: s <= stars ? 1 : 0.2, animation: s <= stars ? `float ${1 + s * 0.3}s ease-in-out infinite` : "none" }}>
            ⭐
          </span>
        ))}
      </div>

      <div
        className="w-full max-w-xs rounded-3xl p-8 text-center shadow-xl"
        style={{ background: "white", border: "3px solid #A78BFA" }}
      >
        <p className="text-6xl font-black" style={{ fontFamily: "'Fredoka One', cursive", color: "#A78BFA" }}>
          {score}<span className="text-3xl text-gray-400">/{total}</span>
        </p>
        <p className="text-gray-600 font-semibold mt-2">{msg}</p>
      </div>

      <div className="flex flex-col gap-3 w-full max-w-xs">
        <button
          onClick={onRetry}
          className="w-full py-4 rounded-2xl font-black text-white text-xl active:scale-95"
          style={{ background: "#FF6B9D", fontFamily: "'Fredoka One', cursive" }}
        >
          Try Again! 🎯
        </button>
        <button
          onClick={onMenu}
          className="w-full py-4 rounded-2xl font-black text-xl active:scale-95"
          style={{ background: "#FDE68A", color: "#92400E", fontFamily: "'Fredoka One', cursive" }}
        >
          Main Menu 🏠
        </button>
      </div>
    </div>
  );
}

// ─── SHARED ───────────────────────────────────────────────────────────────────

function TopBar({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div className="w-full max-w-sm flex items-center justify-between">
      <button
        onClick={onBack}
        className="px-4 py-2 rounded-xl font-black active:scale-95 text-sm"
        style={{ background: "#F3F4F6", color: "#6B7280", fontFamily: "'Fredoka One', cursive" }}
      >
        ← Menu
      </button>
      <h2 className="text-xl font-black" style={{ fontFamily: "'Fredoka One', cursive", color: "#2D1B69" }}>
        {title}
      </h2>
      <div className="w-16" />
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [mode, setMode] = useState<Mode>("menu");
  const [quizScore, setQuizScore] = useState({ s: 0, t: 0 });

  const handleQuizFinish = (s: number, t: number) => {
    setQuizScore({ s, t });
    setMode("results");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&display=swap');

        @keyframes float {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes burst {
          0% { opacity: 1; transform: translate(var(--tx,0), var(--ty,0)) scale(1); }
          100% { opacity: 0; transform: translate(calc(var(--tx,0) * 2), calc(var(--ty,0) * 2)) scale(0); }
        }
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-5px); }
          80% { transform: translateX(5px); }
        }
      `}</style>

      <div
        className="min-h-screen"
        style={{
          background: "linear-gradient(160deg, #F0F4FF 0%, #FFF0F8 50%, #F0FFF4 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {mode === "menu" && <MenuScreen onMode={setMode} />}
        {mode === "learn" && <LearnScreen onBack={() => setMode("menu")} />}
        {mode === "quiz" && <QuizScreen onBack={() => setMode("menu")} onFinish={handleQuizFinish} />}
        {mode === "build" && <BuildScreen onBack={() => setMode("menu")} />}
        {mode === "results" && (
          <ResultsScreen
            score={quizScore.s}
            total={quizScore.t}
            onRetry={() => setMode("quiz")}
            onMenu={() => setMode("menu")}
          />
        )}
      </div>
    </>
  );
}