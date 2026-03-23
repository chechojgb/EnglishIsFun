'use client';
import { useState, useRef, useEffect } from "react";

// ─── BEAR FAMILY DATA ─────────────────────────────────────────────────────────

const FAMILY = [
  // Generation 0 - Great Grandparents
  { id: "great-grandpa", label: "Great-Grandfather", short: "Great-Grandpa", emoji: "🐻", hat: "🎩", color: "#8B5E3C", gen: 0, side: "left", x: 15, y: 4 },
  { id: "great-grandma", label: "Great-Grandmother", short: "Great-Grandma", emoji: "🐻", bow: "🎀", color: "#C68642", gen: 0, side: "right", x: 50, y: 4 },

  // Generation 1 - Grandparents
  { id: "grandpa", label: "Grandfather", short: "Grandpa", emoji: "🐻", hat: "🕶️", color: "#6B4226", gen: 1, side: "left", x: 10, y: 22 },
  { id: "grandma", label: "Grandmother", short: "Grandma", emoji: "🐻", hat: "👓", color: "#D4956A", gen: 1, side: "left2", x: 32, y: 22 },
  { id: "grandpa2", label: "Grandfather", short: "Grandpa 2", emoji: "🐻", hat: "🎓", color: "#7B4F2E", gen: 1, side: "right", x: 54, y: 22 },
  { id: "grandma2", label: "Grandmother", short: "Grandma 2", emoji: "🐻", hat: "🌸", color: "#E8A87C", gen: 1, side: "right2", x: 76, y: 22 },

  // Generation 2 - Parents + Uncle/Aunt
  { id: "dad", label: "Father", short: "Dad", emoji: "🐻", hat: "👒", color: "#5C3317", gen: 2, side: "left", x: 20, y: 44 },
  { id: "mom", label: "Mother", short: "Mom", emoji: "🐻", hat: "🎀", color: "#F4A460", gen: 2, side: "left2", x: 40, y: 44 },
  { id: "uncle", label: "Uncle", short: "Uncle", emoji: "🐻", hat: "🕶️", color: "#8B6914", gen: 2, side: "right", x: 62, y: 44 },
  { id: "aunt", label: "Aunt", short: "Aunt", emoji: "🐻", hat: "💐", color: "#CD853F", gen: 2, side: "right2", x: 78, y: 44 },

  // Generation 3 - Children
  { id: "me", label: "Me!", short: "Me! 🌟", emoji: "🐻", hat: "⭐", color: "#FF8C00", gen: 3, side: "center", x: 20, y: 68 },
  { id: "brother", label: "Brother", short: "Brother", emoji: "🐻", hat: "🎮", color: "#A0522D", gen: 3, side: "left", x: 36, y: 68 },
  { id: "sister", label: "Sister", short: "Sister", emoji: "🐻", hat: "🦋", color: "#DEB887", gen: 3, side: "right", x: 52, y: 68 },
  { id: "cousin", label: "Cousin", short: "Cousin", emoji: "🐻", hat: "🎸", color: "#B8860B", gen: 3, side: "far", x: 72, y: 68 },
];

const SPOTS = FAMILY.map(m => ({
  id: m.id,
  label: m.label,
  short: m.short,
  x: m.x,
  y: m.y,
  gen: m.gen,
  color: m.color,
}));

// Tree connections (parent-child pairs for drawing lines)
const CONNECTIONS = [
  // Great-grandparents to grandparents
  { from: "great-grandpa", to: "grandpa" },
  { from: "great-grandpa", to: "grandma" },
  { from: "great-grandma", to: "grandpa2" },
  { from: "great-grandma", to: "grandma2" },
  // Grandparents to parents
  { from: "grandpa", to: "dad" },
  { from: "grandma", to: "dad" },
  { from: "grandpa2", to: "mom" },
  { from: "grandma2", to: "mom" },
  { from: "grandpa", to: "uncle" },
  { from: "grandma", to: "uncle" },
  { from: "grandpa2", to: "aunt" },
  { from: "grandma2", to: "aunt" },
  // Parents to children
  { from: "dad", to: "me" },
  { from: "mom", to: "me" },
  { from: "dad", to: "brother" },
  { from: "mom", to: "brother" },
  { from: "dad", to: "sister" },
  { from: "mom", to: "sister" },
  { from: "uncle", to: "cousin" },
  { from: "aunt", to: "cousin" },
];

function getBearStyle(member) {
  return { color: member.color };
}

// ─── BEAR CARD ────────────────────────────────────────────────────────────────

function BearCard({ member, placed, small, dragging, onDragStart }) {
  const m = FAMILY.find(f => f.id === member.id) || member;
  return (
    <div
      draggable={!placed}
      onDragStart={onDragStart ? (e) => onDragStart(e, member.id) : undefined}
      className={`flex flex-col items-center select-none transition-all ${!placed ? "cursor-grab active:cursor-grabbing active:scale-110" : ""} ${dragging ? "opacity-40" : ""}`}
      style={{ userSelect: "none" }}
    >
      <div
        className={`${small ? "w-12 h-12 text-2xl" : "w-16 h-16 text-3xl"} rounded-2xl flex items-center justify-center shadow-md relative`}
        style={{ background: `${m.color}22`, border: `2.5px solid ${m.color}` }}
      >
        <span>{m.emoji}</span>
        {m.hat && <span className="absolute -top-2 -right-1 text-sm">{m.hat}</span>}
      </div>
      <span className={`${small ? "text-xs" : "text-xs"} font-black mt-1 text-center leading-tight`}
        style={{ fontFamily: "'Fredoka One', cursive", color: m.color, maxWidth: small ? 52 : 64 }}>
        {m.short}
      </span>
    </div>
  );
}

// ─── TREE SPOT ────────────────────────────────────────────────────────────────

function TreeSpot({ spot, placedMember, onDrop, onDragOver, correct, wrong }) {
  const m = FAMILY.find(f => f.id === spot.id);
  return (
    <div
      onDrop={(e) => onDrop(e, spot.id)}
      onDragOver={onDragOver}
      className="absolute flex flex-col items-center"
      style={{ left: `${spot.x}%`, top: `${spot.y}%`, transform: "translate(-50%,-50%)" }}
    >
      {placedMember ? (
        <div className={`flex flex-col items-center transition-all ${correct ? "scale-110" : wrong ? "animate-shake" : ""}`}>
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-lg relative"
            style={{
              background: correct ? "#DCFCE7" : wrong ? "#FEE2E2" : `${m.color}22`,
              border: `3px solid ${correct ? "#22C55E" : wrong ? "#EF4444" : m.color}`,
            }}
          >
            {placedMember.emoji}
            {placedMember.hat && <span className="absolute -top-2 -right-1 text-sm">{placedMember.hat}</span>}
            {correct && <span className="absolute -bottom-1 -right-1 text-sm">✅</span>}
            {wrong && <span className="absolute -bottom-1 -right-1 text-sm">❌</span>}
          </div>
          <span className="text-xs font-black mt-1 text-center leading-tight"
            style={{ fontFamily: "'Fredoka One', cursive", color: correct ? "#16A34A" : wrong ? "#DC2626" : m.color, maxWidth: 56 }}>
            {placedMember.short}
          </span>
        </div>
      ) : (
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center border-2 border-dashed"
          style={{ borderColor: spot.color + "88", background: spot.color + "11" }}
        >
          <span className="text-lg opacity-40">🐾</span>
        </div>
      )}
      {!placedMember && (
        <span className="text-xs font-bold mt-1 text-center opacity-50"
          style={{ fontFamily: "'Fredoka One', cursive", color: spot.color, maxWidth: 56 }}>
          {spot.short}?
        </span>
      )}
    </div>
  );
}

// ─── SVG CONNECTIONS ──────────────────────────────────────────────────────────

function TreeLines({ placed }) {
  const placedIds = new Set(Object.keys(placed));
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
      {CONNECTIONS.map((c, i) => {
        const from = SPOTS.find(s => s.id === c.from);
        const to = SPOTS.find(s => s.id === c.to);
        if (!from || !to) return null;
        const active = placedIds.has(c.from) && placedIds.has(c.to);
        return (
          <line
            key={i}
            x1={`${from.x}%`} y1={`${from.y}%`}
            x2={`${to.x}%`} y2={`${to.y}%`}
            stroke={active ? "#A78BFA" : "#D1D5DB"}
            strokeWidth={active ? 2.5 : 1.5}
            strokeDasharray={active ? "none" : "6,4"}
            opacity={active ? 0.9 : 0.4}
            style={{ transition: "all 0.4s" }}
          />
        );
      })}
    </svg>
  );
}

// ─── LEAVES BURST ─────────────────────────────────────────────────────────────

function LeafBurst({ count }) {
  const leaves = Array.from({ length: count * 3 }, (_, i) => i);
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {leaves.map((i) => {
        const x = Math.random() * 100;
        const duration = 1.5 + Math.random() * 1.5;
        const delay = Math.random() * 0.8;
        const emojis = ["🍃", "🌿", "🌸", "⭐", "✨", "🌺"];
        return (
          <div
            key={i}
            className="absolute text-xl"
            style={{
              left: `${x}%`,
              top: "-5%",
              animation: `leafFall ${duration}s ease-in forwards`,
              animationDelay: `${delay}s`,
            }}
          >
            {emojis[i % emojis.length]}
          </div>
        );
      })}
    </div>
  );
}

// ─── MAIN GAME ────────────────────────────────────────────────────────────────

export default function FamilyTreeGame() {
  const [screen, setScreen] = useState("menu"); // menu | game | win
  const [placed, setPlaced] = useState({}); // spotId -> member
  const [dragging, setDragging] = useState(null);
  const [feedback, setFeedback] = useState({}); // spotId -> "correct"|"wrong"
  const [score, setScore] = useState(0);
  const [leafCount, setLeafCount] = useState(0);
  const [showLeaves, setShowLeaves] = useState(false);

  const unplaced = FAMILY.filter(m => !Object.values(placed).find(p => p.id === m.id));

  const handleDragStart = (e, memberId) => {
    setDragging(memberId);
    e.dataTransfer.setData("memberId", memberId);
  };

  const handleDrop = (e, spotId) => {
    e.preventDefault();
    const memberId = e.dataTransfer.getData("memberId");
    const member = FAMILY.find(m => m.id === memberId);
    if (!member) return;

    // Remove from previous spot if already placed somewhere
    const newPlaced = { ...placed };
    Object.keys(newPlaced).forEach(k => {
      if (newPlaced[k].id === memberId) delete newPlaced[k];
    });

    newPlaced[spotId] = member;
    setPlaced(newPlaced);
    setDragging(null);

    const isCorrect = memberId === spotId;
    setFeedback(f => ({ ...f, [spotId]: isCorrect ? "correct" : "wrong" }));

    if (isCorrect) {
      setScore(s => s + 1);
      const newLeaves = Object.keys(newPlaced).filter(k => newPlaced[k].id === k).length;
      setLeafCount(newLeaves);
      setShowLeaves(true);
      setTimeout(() => setShowLeaves(false), 2000);
    }

    setTimeout(() => {
      if (!isCorrect) {
        setFeedback(f => {
          const nf = { ...f };
          delete nf[spotId];
          return nf;
        });
        // Remove wrong placement after feedback
        setPlaced(p => {
          const np = { ...p };
          delete np[spotId];
          return np;
        });
      }
    }, 900);

    // Check win
    const correctCount = Object.keys(newPlaced).filter(k => newPlaced[k].id === k).length;
    if (correctCount === FAMILY.length) {
      setTimeout(() => setScreen("win"), 600);
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  const correctCount = Object.keys(placed).filter(k => placed[k].id === k).length;
  const progress = correctCount / FAMILY.length;

  const reset = () => {
    setPlaced({});
    setFeedback({});
    setScore(0);
    setLeafCount(0);
    setScreen("game");
  };

  if (screen === "menu") return <MenuScreen onPlay={() => setScreen("game")} />;
  if (screen === "win") return <WinScreen onRetry={reset} onMenu={() => setScreen("menu")} score={score} />;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@600;800;900&display=swap');
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes leafFall { 0%{transform:translateY(0) rotate(0deg);opacity:1} 100%{transform:translateY(110vh) rotate(360deg);opacity:0} }
        @keyframes popIn { 0%{transform:scale(0.5);opacity:0} 70%{transform:scale(1.15)} 100%{transform:scale(1);opacity:1} }
        @keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-6px)} 75%{transform:translateX(6px)} }
        .animate-shake { animation: shake 0.4s ease-in-out; }
      `}</style>

      <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(180deg,#FFF9F0 0%,#F0FFF4 100%)", fontFamily: "'Nunito', sans-serif" }}>
        {showLeaves && <LeafBurst count={leafCount} />}

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b-2 border-amber-100">
          <button onClick={() => setScreen("menu")} className="px-3 py-1.5 rounded-xl font-black text-sm"
            style={{ background: "#FEF3C7", color: "#92400E", fontFamily: "'Fredoka One', cursive" }}>
            ← Menu
          </button>
          <h1 className="text-xl font-black" style={{ fontFamily: "'Fredoka One', cursive", color: "#92400E" }}>
            🌳 The Bear Family Tree
          </h1>
          <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl" style={{ background: "#DCFCE7" }}>
            <span className="text-sm font-black" style={{ color: "#16A34A", fontFamily: "'Fredoka One', cursive" }}>
              ✅ {correctCount}/{FAMILY.length}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mx-4 mt-2 h-3 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progress * 100}%`, background: "linear-gradient(90deg,#86EFAC,#4ADE80)" }} />
        </div>

        {/* Main area */}
        <div className="flex flex-1 gap-2 p-2 overflow-hidden" style={{ minHeight: 0 }}>

          {/* Tree canvas */}
          <div className="flex-1 relative rounded-2xl overflow-hidden border-2 border-amber-100"
            style={{ background: "linear-gradient(180deg,#FFF7ED,#F0FFF4)", minHeight: 400 }}>

            {/* Background tree trunk */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 rounded-t-full opacity-20"
              style={{ height: "70%", background: "#8B5E3C" }} />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-6xl opacity-10" style={{ bottom: "-10px" }}>🌳</div>

            {/* Generation labels */}
            {[
              { y: "2%", label: "Great-Grandparents", color: "#8B5E3C" },
              { y: "20%", label: "Grandparents", color: "#6B4226" },
              { y: "42%", label: "Parents & Uncle/Aunt", color: "#5C3317" },
              { y: "66%", label: "Children & Cousins", color: "#FF8C00" },
            ].map((g, i) => (
              <div key={i} className="absolute left-0 px-2 py-0.5 rounded-r-lg text-xs font-black opacity-60"
                style={{ top: g.y, color: g.color, fontFamily: "'Fredoka One', cursive", background: g.color + "11" }}>
                {g.label}
              </div>
            ))}

            <TreeLines placed={placed} />

            {SPOTS.map(spot => (
              <TreeSpot
                key={spot.id}
                spot={spot}
                placedMember={placed[spot.id] || null}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                correct={feedback[spot.id] === "correct"}
                wrong={feedback[spot.id] === "wrong"}
              />
            ))}
          </div>

          {/* Sidebar: unplaced bears */}
          <div className="w-28 flex flex-col gap-1 overflow-y-auto pb-4">
            <p className="text-xs font-black text-center py-1 rounded-lg sticky top-0"
              style={{ fontFamily: "'Fredoka One', cursive", color: "#92400E", background: "#FEF3C7" }}>
              🐾 Drag them!
            </p>
            <div className="flex flex-col gap-2 items-center pt-1">
              {unplaced.map(m => (
                <BearCard
                  key={m.id}
                  member={m}
                  placed={false}
                  small
                  dragging={dragging === m.id}
                  onDragStart={handleDragStart}
                />
              ))}
              {unplaced.length === 0 && (
                <p className="text-xs text-center text-gray-400 font-bold mt-4">All placed! 🎉</p>
              )}
            </div>
          </div>
        </div>

        {/* Hint */}
        <div className="text-center py-2 text-xs text-gray-400 font-semibold">
          Drag each bear 🐻 to their correct spot on the family tree!
        </div>
      </div>
    </>
  );
}

// ─── MENU ─────────────────────────────────────────────────────────────────────

function MenuScreen({ onPlay }) {
  const parade = FAMILY.filter(m => ["great-grandpa", "grandma", "dad", "mom", "me", "sister"].includes(m.id));
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4"
      style={{ background: "linear-gradient(160deg,#FFF9F0,#F0FFF4)", fontFamily: "'Nunito', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@600;800;900&display=swap');
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes sway { 0%,100%{transform:rotate(-5deg)} 50%{transform:rotate(5deg)} }
      `}</style>

      <div className="text-8xl" style={{ animation: "sway 3s ease-in-out infinite" }}>🌳</div>

      <div className="text-center">
        <h1 className="text-5xl font-black" style={{ fontFamily: "'Fredoka One', cursive", color: "#92400E" }}>
          The Bear
        </h1>
        <h1 className="text-5xl font-black" style={{ fontFamily: "'Fredoka One', cursive", background: "linear-gradient(135deg,#F97316,#A78BFA)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Family Tree! 🐻
        </h1>
        <p className="text-gray-500 font-semibold mt-2">Place each bear in the right spot!</p>
      </div>

      {/* Bear parade */}
      <div className="flex gap-3 flex-wrap justify-center">
        {parade.map((m, i) => (
          <div key={m.id} className="flex flex-col items-center" style={{ animation: `float ${2 + i * 0.2}s ease-in-out infinite`, animationDelay: `${i * 0.3}s` }}>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl relative shadow-md"
              style={{ background: m.color + "22", border: `2.5px solid ${m.color}` }}>
              {m.emoji}
              <span className="absolute -top-2 -right-1 text-sm">{m.hat}</span>
            </div>
            <span className="text-xs font-black mt-1" style={{ fontFamily: "'Fredoka One', cursive", color: m.color }}>{m.short}</span>
          </div>
        ))}
      </div>

      {/* Family members list */}
      <div className="bg-white rounded-2xl p-4 shadow-md w-full max-w-sm border-2 border-amber-100">
        <p className="font-black text-center text-amber-800 mb-3" style={{ fontFamily: "'Fredoka One', cursive" }}>📚 You'll learn:</p>
        <div className="grid grid-cols-2 gap-1 text-sm">
          {["Great-Grandfather", "Great-Grandmother", "Grandfather", "Grandmother", "Father", "Mother", "Uncle", "Aunt", "Brother", "Sister", "Cousin", "Me! 🌟"].map(w => (
            <div key={w} className="bg-amber-50 rounded-lg px-2 py-1 text-center font-bold text-amber-700">{w}</div>
          ))}
        </div>
      </div>

      <button onClick={onPlay}
        className="px-10 py-4 rounded-2xl font-black text-2xl text-white shadow-lg active:scale-95 transition-transform"
        style={{ background: "linear-gradient(135deg,#F97316,#FBBF24)", fontFamily: "'Fredoka One', cursive", boxShadow: "0 6px 0 #C2410C" }}>
        Let's Build It! 🌳
      </button>
    </div>
  );
}

// ─── WIN ──────────────────────────────────────────────────────────────────────

function WinScreen({ onRetry, onMenu, score }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4"
      style={{ background: "linear-gradient(160deg,#FFF9F0,#F0FFF4)", fontFamily: "'Nunito', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@600;800;900&display=swap');
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes leafFall { 0%{transform:translateY(0) rotate(0deg);opacity:1} 100%{transform:translateY(110vh) rotate(360deg);opacity:0} }
        @keyframes popIn { 0%{transform:scale(0.5);opacity:0} 70%{transform:scale(1.15)} 100%{transform:scale(1);opacity:1} }
      `}</style>

      <LeafBurst count={14} />

      <div className="text-8xl" style={{ animation: "float 2s ease-in-out infinite" }}>🏆</div>

      <h1 className="text-5xl font-black text-center" style={{ fontFamily: "'Fredoka One', cursive", color: "#92400E" }}>
        Amazing! 🎉
      </h1>
      <p className="text-gray-600 font-bold text-center text-lg">You built the whole Bear Family Tree!</p>

      <div className="flex gap-2 text-4xl" style={{ animation: "popIn 0.6s ease-out" }}>
        {["🐻", "🌳", "🐻", "🌸", "🐻"].map((e, i) => (
          <span key={i} style={{ animationDelay: `${i * 0.1}s` }}>{e}</span>
        ))}
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-xl border-2 border-amber-200 text-center w-full max-w-xs">
        <p className="text-5xl font-black" style={{ fontFamily: "'Fredoka One', cursive", color: "#F97316" }}>
          ⭐ Perfect! ⭐
        </p>
        <p className="text-gray-500 font-semibold mt-2">You know all the family members!</p>
      </div>

      <div className="flex flex-col gap-3 w-full max-w-xs">
        <button onClick={onRetry}
          className="w-full py-4 rounded-2xl font-black text-white text-xl active:scale-95"
          style={{ background: "#F97316", fontFamily: "'Fredoka One', cursive" }}>
          Play Again! 🌳
        </button>
        <button onClick={onMenu}
          className="w-full py-4 rounded-2xl font-black text-xl active:scale-95"
          style={{ background: "#FEF3C7", color: "#92400E", fontFamily: "'Fredoka One', cursive" }}>
          Main Menu 🏠
        </button>
      </div>
    </div>
  );
}