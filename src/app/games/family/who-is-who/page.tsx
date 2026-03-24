'use client';

import { useState } from "react";

// ─── TYPES ────────────────────────────────────────────────────────────────────

interface FamilyMember {
  id: string;
  label: string;
  short: string;
  emoji: string;
  hat: string;
  color: string;
  gen: number;
  x: number;
  y: number;
}

interface Connection {
  from: string;
  to: string;
}

type FeedbackMap = Record<string, "correct" | "wrong">;
type PlacedMap = Record<string, FamilyMember>;
type Screen = "menu" | "game" | "win";

// ─── DATA ─────────────────────────────────────────────────────────────────────

const FAMILY: FamilyMember[] = [
  { id: "great-grandpa",  label: "Great-Grandfather", short: "Great-Grandpa",  emoji: "🐻", hat: "🎩", color: "#8B5E3C", gen: 0, x: 15, y: 5  },
  { id: "great-grandma",  label: "Great-Grandmother", short: "Great-Grandma",  emoji: "🐻", hat: "🎀", color: "#C68642", gen: 0, x: 50, y: 5  },
  { id: "grandpa",        label: "Grandfather",        short: "Grandpa",        emoji: "🐻", hat: "🕶️", color: "#6B4226", gen: 1, x: 10, y: 23 },
  { id: "grandma",        label: "Grandmother",        short: "Grandma",        emoji: "🐻", hat: "👓", color: "#D4956A", gen: 1, x: 32, y: 23 },
  { id: "grandpa2",       label: "Grandfather",        short: "Grandpa 2",      emoji: "🐻", hat: "🎓", color: "#7B4F2E", gen: 1, x: 54, y: 23 },
  { id: "grandma2",       label: "Grandmother",        short: "Grandma 2",      emoji: "🐻", hat: "🌸", color: "#E8A87C", gen: 1, x: 76, y: 23 },
  { id: "dad",            label: "Father",             short: "Dad",            emoji: "🐻", hat: "👒", color: "#5C3317", gen: 2, x: 20, y: 45 },
  { id: "mom",            label: "Mother",             short: "Mom",            emoji: "🐻", hat: "🎀", color: "#F4A460", gen: 2, x: 40, y: 45 },
  { id: "uncle",          label: "Uncle",              short: "Uncle",          emoji: "🐻", hat: "🕶️", color: "#8B6914", gen: 2, x: 62, y: 45 },
  { id: "aunt",           label: "Aunt",               short: "Aunt",           emoji: "🐻", hat: "💐", color: "#CD853F", gen: 2, x: 78, y: 45 },
  { id: "me",             label: "Me!",                short: "Me! 🌟",         emoji: "🐻", hat: "⭐", color: "#FF8C00", gen: 3, x: 20, y: 68 },
  { id: "brother",        label: "Brother",            short: "Brother",        emoji: "🐻", hat: "🎮", color: "#A0522D", gen: 3, x: 36, y: 68 },
  { id: "sister",         label: "Sister",             short: "Sister",         emoji: "🐻", hat: "🦋", color: "#DEB887", gen: 3, x: 52, y: 68 },
  { id: "cousin",         label: "Cousin",             short: "Cousin",         emoji: "🐻", hat: "🎸", color: "#B8860B", gen: 3, x: 72, y: 68 },
];

const CONNECTIONS: Connection[] = [
  { from: "great-grandpa", to: "grandpa"  },
  { from: "great-grandpa", to: "grandma"  },
  { from: "great-grandma", to: "grandpa2" },
  { from: "great-grandma", to: "grandma2" },
  { from: "grandpa",       to: "dad"      },
  { from: "grandma",       to: "dad"      },
  { from: "grandpa2",      to: "mom"      },
  { from: "grandma2",      to: "mom"      },
  { from: "grandpa",       to: "uncle"    },
  { from: "grandma",       to: "uncle"    },
  { from: "grandpa2",      to: "aunt"     },
  { from: "grandma2",      to: "aunt"     },
  { from: "dad",           to: "me"       },
  { from: "mom",           to: "me"       },
  { from: "dad",           to: "brother"  },
  { from: "mom",           to: "brother"  },
  { from: "dad",           to: "sister"   },
  { from: "mom",           to: "sister"   },
  { from: "uncle",         to: "cousin"   },
  { from: "aunt",          to: "cousin"   },
];

const GEN_LABELS = [
  { y: "1%",  label: "Great-Grandparents",    color: "#8B5E3C" },
  { y: "19%", label: "Grandparents",          color: "#6B4226" },
  { y: "41%", label: "Parents · Uncle · Aunt", color: "#5C3317" },
  { y: "64%", label: "Children · Cousin",     color: "#FF8C00" },
];

// ─── LEAF BURST ───────────────────────────────────────────────────────────────

function LeafBurst() {
  const items = ["🍃","🌿","🌸","⭐","✨","🌺"];
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {Array.from({ length: 24 }, (_, i) => (
        <div
          key={i}
          className="absolute text-xl"
          style={{
            left: `${Math.random() * 100}%`,
            top: "-5%",
            animation: `leafFall ${1.5 + Math.random() * 1.5}s ease-in forwards`,
            animationDelay: `${Math.random() * 0.8}s`,
          }}
        >
          {items[i % items.length]}
        </div>
      ))}
    </div>
  );
}

// ─── TREE LINES ───────────────────────────────────────────────────────────────

function TreeLines({ placed }: { placed: PlacedMap }) {
  const placedIds = new Set(Object.keys(placed));
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
      {CONNECTIONS.map((c, i) => {
        const from = FAMILY.find(m => m.id === c.from);
        const to   = FAMILY.find(m => m.id === c.to);
        if (!from || !to) return null;
        const active = placedIds.has(c.from) && placedIds.has(c.to);
        return (
          <line
            key={i}
            x1={`${from.x}%`} y1={`${from.y}%`}
            x2={`${to.x}%`}   y2={`${to.y}%`}
            stroke={active ? "#A78BFA" : "#D1D5DB"}
            strokeWidth={active ? 2.5 : 1.5}
            strokeDasharray={active ? undefined : "6 4"}
            opacity={active ? 0.9 : 0.35}
            style={{ transition: "all 0.4s" }}
          />
        );
      })}
    </svg>
  );
}

// ─── BEAR CHIP (draggable sidebar card) ───────────────────────────────────────

interface BearChipProps {
  member: FamilyMember;
  isDragging: boolean;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, id: string) => void;
}

function BearChip({ member, isDragging, onDragStart }: BearChipProps) {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, member.id)}
      className="flex flex-col items-center cursor-grab active:cursor-grabbing active:scale-110 transition-transform select-none"
      style={{ opacity: isDragging ? 0.4 : 1 }}
    >
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl relative shadow"
        style={{ background: `${member.color}22`, border: `2.5px solid ${member.color}` }}
      >
        {member.emoji}
        <span className="absolute -top-2 -right-1 text-xs">{member.hat}</span>
      </div>
      <span
        className="text-xs font-black mt-1 text-center leading-tight"
        style={{ fontFamily: "'Fredoka One', cursive", color: member.color, maxWidth: 52 }}
      >
        {member.short}
      </span>
    </div>
  );
}

// ─── TREE SPOT (drop target) ──────────────────────────────────────────────────

interface TreeSpotProps {
  spot: FamilyMember;
  placed: FamilyMember | null;
  feedback: "correct" | "wrong" | null;
  onDrop: (e: React.DragEvent<HTMLDivElement>, spotId: string) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
}

function TreeSpot({ spot, placed, feedback, onDrop, onDragOver }: TreeSpotProps) {
  return (
    <div
      onDrop={(e) => onDrop(e, spot.id)}
      onDragOver={onDragOver}
      className="absolute flex flex-col items-center"
      style={{ left: `${spot.x}%`, top: `${spot.y}%`, transform: "translate(-50%,-50%)", zIndex: 1 }}
    >
      {placed ? (
        <div className={`flex flex-col items-center transition-all ${feedback === "correct" ? "scale-110" : feedback === "wrong" ? "animate-shake" : ""}`}>
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl relative shadow-lg"
            style={{
              background: feedback === "correct" ? "#DCFCE7" : feedback === "wrong" ? "#FEE2E2" : `${placed.color}22`,
              border: `3px solid ${feedback === "correct" ? "#22C55E" : feedback === "wrong" ? "#EF4444" : placed.color}`,
              transition: "all 0.3s",
            }}
          >
            {placed.emoji}
            <span className="absolute -top-2 -right-1 text-xs">{placed.hat}</span>
            {feedback === "correct" && <span className="absolute -bottom-1 -right-1 text-xs">✅</span>}
            {feedback === "wrong"   && <span className="absolute -bottom-1 -right-1 text-xs">❌</span>}
          </div>
          <span
            className="text-xs font-black mt-1 text-center leading-tight"
            style={{
              fontFamily: "'Fredoka One', cursive",
              color: feedback === "correct" ? "#16A34A" : feedback === "wrong" ? "#DC2626" : placed.color,
              maxWidth: 52,
            }}
          >
            {placed.short}
          </span>
        </div>
      ) : (
        <>
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center border-2 border-dashed"
            style={{ borderColor: `${spot.color}88`, background: `${spot.color}11` }}
          >
            <span className="text-lg opacity-30">🐾</span>
          </div>
          <span
            className="text-xs font-bold mt-1 text-center opacity-50 leading-tight"
            style={{ fontFamily: "'Fredoka One', cursive", color: spot.color, maxWidth: 52 }}
          >
            {spot.short}?
          </span>
        </>
      )}
    </div>
  );
}

// ─── GAME SCREEN ──────────────────────────────────────────────────────────────

function GameScreen({ onWin, onMenu }: { onWin: () => void; onMenu: () => void }) {
  const [placed, setPlaced]     = useState<PlacedMap>({});
  const [dragging, setDragging] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<FeedbackMap>({});
  const [showLeaves, setShowLeaves] = useState(false);

  const unplaced = FAMILY.filter(m => !Object.values(placed).find(p => p.id === m.id));
  const correctCount = Object.keys(placed).filter(k => placed[k].id === k).length;
  const progress = correctCount / FAMILY.length;

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    setDragging(id);
    e.dataTransfer.setData("memberId", id);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, spotId: string) => {
    e.preventDefault();
    const memberId = e.dataTransfer.getData("memberId");
    const member = FAMILY.find(m => m.id === memberId);
    if (!member) return;

    const newPlaced: PlacedMap = { ...placed };
    // remove from old spot
    (Object.keys(newPlaced) as string[]).forEach(k => {
      if (newPlaced[k].id === memberId) delete newPlaced[k];
    });
    newPlaced[spotId] = member;
    setPlaced(newPlaced);
    setDragging(null);

    const isCorrect = memberId === spotId;
    setFeedback(f => ({ ...f, [spotId]: isCorrect ? "correct" : "wrong" }));

    if (isCorrect) {
      setShowLeaves(true);
      setTimeout(() => setShowLeaves(false), 2000);
      const newCorrect = (Object.keys(newPlaced) as string[]).filter(k => newPlaced[k].id === k).length;
      if (newCorrect === FAMILY.length) {
        setTimeout(onWin, 700);
      }
    } else {
      setTimeout(() => {
        setFeedback(f => { const nf = { ...f }; delete nf[spotId]; return nf; });
        setPlaced(p => { const np = { ...p }; delete np[spotId]; return np; });
      }, 900);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(180deg,#FFF9F0 0%,#F0FFF4 100%)" }}>
      {showLeaves && <LeafBurst />}

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b-2 border-amber-100 bg-white/60 backdrop-blur-sm">
        <button
          onClick={onMenu}
          className="px-3 py-1.5 rounded-xl font-black text-sm active:scale-95 transition-transform"
          style={{ background: "#FEF3C7", color: "#92400E", fontFamily: "'Fredoka One', cursive" }}
        >
          ← Menu
        </button>
        <h1 className="text-lg font-black" style={{ fontFamily: "'Fredoka One', cursive", color: "#92400E" }}>
          🌳 Bear Family Tree
        </h1>
        <div className="px-3 py-1.5 rounded-xl" style={{ background: "#DCFCE7" }}>
          <span className="text-sm font-black" style={{ color: "#16A34A", fontFamily: "'Fredoka One', cursive" }}>
            ✅ {correctCount}/{FAMILY.length}
          </span>
        </div>
      </div>

      {/* Progress */}
      <div className="mx-4 mt-2 h-3 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${progress * 100}%`, background: "linear-gradient(90deg,#86EFAC,#4ADE80)" }}
        />
      </div>

      {/* Main */}
      <div className="flex flex-1 gap-2 p-2 overflow-hidden" style={{ minHeight: 0 }}>

        {/* Canvas */}
        <div
          className="flex-1 relative rounded-2xl overflow-hidden border-2 border-amber-100"
          style={{ background: "linear-gradient(180deg,#FFFBF0,#F0FFF4)", minHeight: 400 }}
        >
          {/* Trunk decoration */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 rounded-t-full opacity-10"
            style={{ height: "70%", background: "#8B5E3C" }} />

          {/* Gen labels */}
          {GEN_LABELS.map((g, i) => (
            <div
              key={i}
              className="absolute left-0 px-2 py-0.5 rounded-r-lg text-xs font-black opacity-50"
              style={{ top: g.y, color: g.color, fontFamily: "'Fredoka One', cursive", background: `${g.color}11` }}
            >
              {g.label}
            </div>
          ))}

          <TreeLines placed={placed} />

          {FAMILY.map(spot => (
            <TreeSpot
              key={spot.id}
              spot={spot}
              placed={placed[spot.id] ?? null}
              feedback={feedback[spot.id] ?? null}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            />
          ))}
        </div>

        {/* Sidebar */}
        <div className="w-24 flex flex-col gap-1 overflow-y-auto pb-4">
          <p
            className="text-xs font-black text-center py-1 rounded-lg sticky top-0 z-10"
            style={{ fontFamily: "'Fredoka One', cursive", color: "#92400E", background: "#FEF3C7" }}
          >
            🐾 Drag!
          </p>
          <div className="flex flex-col gap-3 items-center pt-1">
            {unplaced.map(m => (
              <BearChip
                key={m.id}
                member={m}
                isDragging={dragging === m.id}
                onDragStart={handleDragStart}
              />
            ))}
            {unplaced.length === 0 && (
              <p className="text-xs text-center text-gray-400 font-bold mt-4">All placed! 🎉</p>
            )}
          </div>
        </div>
      </div>

      <p className="text-center py-2 text-xs text-gray-400 font-semibold">
        Drag each bear 🐻 to their correct spot on the family tree!
      </p>
    </div>
  );
}

// ─── MENU SCREEN ──────────────────────────────────────────────────────────────

function MenuScreen({ onPlay }: { onPlay: () => void }) {
  const parade = FAMILY.filter(m =>
    ["great-grandpa","grandma","dad","mom","me","sister"].includes(m.id)
  );
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4"
      style={{ background: "linear-gradient(160deg,#FFF9F0,#F0FFF4)" }}>

      <div className="text-8xl" style={{ animation: "sway 3s ease-in-out infinite" }}>🌳</div>

      <div className="text-center">
        <h1 className="text-5xl font-black" style={{ fontFamily: "'Fredoka One', cursive", color: "#92400E" }}>
          Bear Roots
        </h1>
        <p className="text-xl font-black mt-1" style={{
          fontFamily: "'Fredoka One', cursive",
          background: "linear-gradient(135deg,#F97316,#A78BFA)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>
          Build the Family Tree! 🐻
        </p>
        <p className="text-gray-500 font-semibold mt-1 text-sm">Drag each bear to the right spot!</p>
      </div>

      {/* Parade */}
      <div className="flex gap-3 flex-wrap justify-center">
        {parade.map((m, i) => (
          <div
            key={m.id}
            className="flex flex-col items-center"
            style={{ animation: `float ${2 + i * 0.2}s ease-in-out infinite`, animationDelay: `${i * 0.3}s` }}
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl relative shadow-md"
              style={{ background: `${m.color}22`, border: `2.5px solid ${m.color}` }}
            >
              {m.emoji}
              <span className="absolute -top-2 -right-1 text-sm">{m.hat}</span>
            </div>
            <span className="text-xs font-black mt-1" style={{ fontFamily: "'Fredoka One', cursive", color: m.color }}>
              {m.short}
            </span>
          </div>
        ))}
      </div>

      {/* Vocabulary grid */}
      <div className="bg-white rounded-2xl p-4 shadow-md w-full max-w-sm border-2 border-amber-100">
        <p className="font-black text-center text-amber-800 mb-3" style={{ fontFamily: "'Fredoka One', cursive" }}>
          📚 Family members you'll learn:
        </p>
        <div className="grid grid-cols-2 gap-1 text-sm">
          {FAMILY.map(m => (
            <div key={m.id} className="rounded-lg px-2 py-1 text-center font-bold"
              style={{ background: `${m.color}18`, color: m.color }}>
              {m.label}
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={onPlay}
        className="px-10 py-4 rounded-2xl font-black text-2xl text-white shadow-lg active:scale-95 transition-transform"
        style={{
          background: "linear-gradient(135deg,#F97316,#FBBF24)",
          fontFamily: "'Fredoka One', cursive",
          boxShadow: "0 6px 0 #C2410C",
        }}
      >
        Let's Build It! 🌳
      </button>
    </div>
  );
}

// ─── WIN SCREEN ───────────────────────────────────────────────────────────────

function WinScreen({ onRetry, onMenu }: { onRetry: () => void; onMenu: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4"
      style={{ background: "linear-gradient(160deg,#FFF9F0,#F0FFF4)" }}>
      <LeafBurst />

      <div className="text-8xl" style={{ animation: "float 2s ease-in-out infinite" }}>🏆</div>

      <h1 className="text-5xl font-black text-center" style={{ fontFamily: "'Fredoka One', cursive", color: "#92400E" }}>
        Amazing! 🎉
      </h1>
      <p className="text-gray-600 font-bold text-center text-lg">You built the whole Bear Family Tree!</p>

      <div className="bg-white rounded-3xl p-6 shadow-xl border-2 border-amber-200 text-center w-full max-w-xs">
        <p className="text-4xl font-black" style={{ fontFamily: "'Fredoka One', cursive", color: "#F97316" }}>
          ⭐ Perfect! ⭐
        </p>
        <p className="text-gray-500 font-semibold mt-2">You know all the family members!</p>
        <div className="flex flex-wrap gap-1 mt-3 justify-center">
          {FAMILY.map(m => (
            <span key={m.id} className="text-xs font-bold px-2 py-0.5 rounded-full"
              style={{ background: `${m.color}22`, color: m.color }}>
              {m.label}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 w-full max-w-xs">
        <button onClick={onRetry}
          className="w-full py-4 rounded-2xl font-black text-white text-xl active:scale-95 transition-transform"
          style={{ background: "#F97316", fontFamily: "'Fredoka One', cursive" }}>
          Play Again! 🌳
        </button>
        <button onClick={onMenu}
          className="w-full py-4 rounded-2xl font-black text-xl active:scale-95 transition-transform"
          style={{ background: "#FEF3C7", color: "#92400E", fontFamily: "'Fredoka One', cursive" }}>
          Main Menu 🏠
        </button>
      </div>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [screen, setScreen] = useState<Screen>("menu");

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@600;800;900&display=swap');
        * { box-sizing: border-box; }
        @keyframes float    { 0%,100%{transform:translateY(0)}  50%{transform:translateY(-10px)} }
        @keyframes sway     { 0%,100%{transform:rotate(-5deg)} 50%{transform:rotate(5deg)}  }
        @keyframes leafFall { 0%{transform:translateY(0) rotate(0deg);opacity:1} 100%{transform:translateY(110vh) rotate(360deg);opacity:0} }
        @keyframes shake    { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-6px)} 75%{transform:translateX(6px)} }
        .animate-shake { animation: shake 0.4s ease-in-out; }
      `}</style>

      <div style={{ fontFamily: "'Nunito', sans-serif" }}>
        {screen === "menu" && <MenuScreen onPlay={() => setScreen("game")} />}
        {screen === "game" && <GameScreen onWin={() => setScreen("win")} onMenu={() => setScreen("menu")} />}
        {screen === "win"  && <WinScreen  onRetry={() => setScreen("game")} onMenu={() => setScreen("menu")} />}
      </div>
    </>
  );
}