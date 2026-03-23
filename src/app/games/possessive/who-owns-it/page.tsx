"use client";

import { useState, useCallback } from "react";
import Image from "next/image";

// ── Types ──────────────────────────────────────────────
interface Question {
  id: string;
  sentence: string[];
  answer: string[];
  options: string[];
  img: string;
  category: string;
  hint: string;
  difficulty: "easy" | "medium" | "hard";
}

// ── Question bank ──────────────────────────────────────
const ALL_QUESTIONS: Question[] = [
  // ── EASY — 1 blank ────────────────────────────────────
  {
    id: "e1", difficulty: "easy", answer: ["My"],
    sentence: ["", " name is Sofia and I love painting."],
    hint: "The speaker talks about herself.",
    img: "/images/possessive/girl.png", category: "People",
    options: ["My", "Your", "Her", "His"],
  },
  {
    id: "e2", difficulty: "easy", answer: ["Your"],
    sentence: ["Please open ", " book to page 12."],
    hint: "The teacher speaks to a student.",
    img: "/images/possessive/book.png", category: "School",
    options: ["Your", "My", "Her", "Their"],
  },
  {
    id: "e3", difficulty: "easy", answer: ["His"],
    sentence: ["Tom lost ", " pencil case in the classroom."],
    hint: "Tom is a boy — he owns it.",
    img: "/images/possessive/pencil.png", category: "School",
    options: ["His", "Her", "Their", "My"],
  },
  {
    id: "e4", difficulty: "easy", answer: ["Her"],
    sentence: ["Lisa forgot ", " homework at home today."],
    hint: "Lisa is a girl — she owns the homework.",
    img: "/images/possessive/homework.png", category: "School",
    options: ["Her", "His", "Our", "My"],
  },
  {
    id: "e5", difficulty: "easy", answer: ["Its"],
    sentence: ["The dog wagged ", " tail happily."],
    hint: "The dog is an animal — not a person.",
    img: "/images/possessive/dog.png", category: "Animals",
    options: ["Its", "His", "Her", "Their"],
  },
  {
    id: "e6", difficulty: "easy", answer: ["Our"],
    sentence: ["We painted ", " bedroom walls purple."],
    hint: "We did it together — it belongs to us.",
    img: "/images/possessive/room.png", category: "Home",
    options: ["Our", "My", "Their", "Her"],
  },
  {
    id: "e7", difficulty: "easy", answer: ["Their"],
    sentence: ["The students forgot ", " notebooks at home."],
    hint: "Multiple students — they all own notebooks.",
    img: "/images/possessive/notebook.png", category: "School",
    options: ["Their", "Our", "His", "Its"],
  },

  // ── MEDIUM — 2 blanks ─────────────────────────────────
  {
    id: "m1", difficulty: "medium", answer: ["My", "your"],
    sentence: ["", " favorite movie is Star Wars and I think it's also ", " favorite!"],
    hint: "First blank = the speaker. Second blank = the person they're talking to.",
    img: "/images/possessive/movie.png", category: "Entertainment",
    options: ["My", "your", "His", "Their"],
  },
  {
    id: "m2", difficulty: "medium", answer: ["Her", "his"],
    sentence: ["Emma lost ", " keys, but ", " brother found them in the garden."],
    hint: "Emma is a girl. Her brother is a boy.",
    img: "/images/possessive/keys.png", category: "Family",
    options: ["Her", "his", "Its", "Our"],
  },
  {
    id: "m3", difficulty: "medium", answer: ["Our", "their"],
    sentence: ["We cleaned ", " room, but the twins didn't clean ", "."],
    hint: "We = our. The twins = their.",
    img: "/images/possessive/room.png", category: "Home",
    options: ["Our", "their", "My", "Its"],
  },
  {
    id: "m4", difficulty: "medium", answer: ["Its", "their"],
    sentence: ["The dog ate ", " food, and then the cats ate ", " too."],
    hint: "One dog = its. Multiple cats = their.",
    img: "/images/possessive/dog.png", category: "Animals",
    options: ["Its", "their", "His", "Our"],
  },
  {
    id: "m5", difficulty: "medium", answer: ["Your", "My"],
    sentence: ["Is ", " backpack the red one? ", " backpack is blue."],
    hint: "First = asking you. Second = the speaker's own.",
    img: "/images/possessive/backpack.png", category: "School",
    options: ["Your", "My", "Her", "Their"],
  },
  {
    id: "m6", difficulty: "medium", answer: ["His", "Her"],
    sentence: ["David plays guitar in ", " room while ", " sister reads in hers."],
    hint: "David is a boy. His sister is a girl.",
    img: "/images/possessive/guitar.png", category: "Family",
    options: ["His", "Her", "Our", "Their"],
  },
  {
    id: "m7", difficulty: "medium", answer: ["Their", "Its"],
    sentence: ["The birds built ", " nest and now ", " eggs are hatching!"],
    hint: "Birds (plural) = their. The nest (one thing) = its.",
    img: "/images/possessive/bird.png", category: "Animals",
    options: ["Their", "Its", "Our", "His"],
  },

  // ── HARD — 3 blanks ───────────────────────────────────
  {
    id: "h1", difficulty: "hard", answer: ["My", "his", "our"],
    sentence: ["", " brother left ", " bike outside and now ", " dad is angry."],
    hint: "Speaker's brother (his bike), speaker's dad (our dad).",
    img: "/images/possessive/bicycle.png", category: "Family",
    options: ["My", "his", "our", "their"],
  },
  {
    id: "h2", difficulty: "hard", answer: ["Her", "Its", "their"],
    sentence: ["The girl loves ", " cat. ", " fur is so soft and ", " owners are kind."],
    hint: "The girl's cat (her). The cat's fur (its). The owners (their).",
    img: "/images/possessive/cat.png", category: "Animals",
    options: ["Her", "Its", "their", "Our"],
  },
  {
    id: "h3", difficulty: "hard", answer: ["Your", "My", "our"],
    sentence: ["Is ", " teacher strict? ", " teacher is fun and ", " class loves her."],
    hint: "Talking to you (your). Speaker's own teacher (my). Shared class (our).",
    img: "/images/possessive/classroom.png", category: "School",
    options: ["Your", "My", "our", "Their"],
  },
  {
    id: "h4", difficulty: "hard", answer: ["His", "Her", "Their"],
    sentence: ["Tom shared ", " lunch with Sara. She gave him ", " cookies. ", " friendship is beautiful."],
    hint: "Tom's lunch (his). Sara's cookies (her). Together (their).",
    img: "/images/possessive/lunch.png", category: "School",
    options: ["His", "Her", "Their", "Our"],
  },
  {
    id: "h5", difficulty: "hard", answer: ["Our", "their", "Its"],
    sentence: ["", " school has a garden. The students water ", " plants every day. ", " flowers are beautiful."],
    hint: "Shared school (our). Students' plants (their). The garden's flowers (its).",
    img: "/images/possessive/school.png", category: "School",
    options: ["Our", "their", "Its", "My"],
  },
  {
    id: "h6", difficulty: "hard", answer: ["My", "Your", "their"],
    sentence: ["", " mom works at a hospital. What does ", " mom do? ", " moms are both amazing."],
    hint: "Speaker's mom (my). Asking you (your). Both moms together (their).",
    img: "/images/possessive/mom.png", category: "Family",
    options: ["My", "Your", "their", "Its"],
  },
  {
    id: "h7", difficulty: "hard", answer: ["Its", "Our", "their"],
    sentence: ["The team lost ", " game, but ", " school still cheered and ", " spirits stayed high."],
    hint: "The team's game (its). Our school (our). The players' spirits (their).",
    img: "/images/possessive/soccer.png", category: "Sports",
    options: ["Its", "Our", "their", "My"],
  },
];

// ── Round config ───────────────────────────────────────
const ROUNDS = [
  {
    id: 1, label: "Round 1", title: "Warm Up",
    subtitle: "1 blank per sentence", difficulty: "easy" as const,
    icon: "🌸", bg: "#fdf2f8", accent: "#c0397a", border: "#e8a0c8",
    pill: "#f9d0e8",
  },
  {
    id: 2, label: "Round 2", title: "Getting Harder",
    subtitle: "2 blanks per sentence", difficulty: "medium" as const,
    icon: "💜", bg: "#f5f0ff", accent: "#7c3aed", border: "#c4a8f5",
    pill: "#e8d8ff",
  },
  {
    id: 3, label: "Round 3", title: "Expert Level",
    subtitle: "3 blanks per sentence", difficulty: "hard" as const,
    icon: "🔥", bg: "#fdf4ff", accent: "#a21caf", border: "#d8a0e8",
    pill: "#f0d0f8",
  },
];

// ── Possessive chip colors ─────────────────────────────
const P_COLOR: Record<string, { bg: string; text: string; border: string }> = {
  My:    { bg: "#fce4ec", text: "#ad1457", border: "#f48fb1" },
  Your:  { bg: "#e8eaf6", text: "#3949ab", border: "#9fa8da" },
  His:   { bg: "#e0f2f1", text: "#00695c", border: "#80cbc4" },
  Her:   { bg: "#fff8e1", text: "#f57f17", border: "#ffe082" },
  Its:   { bg: "#f3e5f5", text: "#6a1b9a", border: "#ce93d8" },
  Our:   { bg: "#fce4ec", text: "#880e4f", border: "#f48fb1" },
  Their: { bg: "#ede7f6", text: "#4527a0", border: "#b39ddb" },
};

// Normalize for case-insensitive lookup
function getPColor(word: string) {
  const key = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  return P_COLOR[key] ?? { bg: "#f3e8ff", text: "#7c3aed", border: "#c084fc" };
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

// ── Decorative floating chips ──────────────────────────
function FloatingChips({ accent }: { accent: string }) {
  const words = ["My", "Your", "His", "Her", "Its", "Our", "Their"];
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {words.map((w, i) => (
        <div
          key={w}
          className="absolute font-extrabold rounded-full opacity-20"
          style={{
            background: accent, color: "#fff",
            top: `${10 + (i * 13) % 80}%`,
            left: `${(i * 17) % 90}%`,
            transform: `rotate(${-15 + i * 7}deg)`,
            fontSize: "0.7rem",
            padding: "2px 8px",
          }}
        >
          {w}
        </div>
      ))}
    </div>
  );
}

// ── Progress dots ──────────────────────────────────────
function ProgressDots({
  total, current, correct, accent,
}: {
  total: number; current: number; correct: boolean[]; accent: string;
}) {
  return (
    <div className="flex gap-1.5 flex-wrap justify-center">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          style={{
            width: 10, height: 10, borderRadius: "50%",
            background:
              i < correct.length
                ? correct[i] ? "#22c55e" : "#ef4444"
                : i === current ? accent : "rgba(0,0,0,0.12)",
            border: i === current ? `2px solid ${accent}` : "none",
            transition: "all 0.3s ease",
          }}
        />
      ))}
    </div>
  );
}

// ── Main ───────────────────────────────────────────────
export default function WhoOwnsIt() {
  const [roundIdx, setRoundIdx]       = useState(0);
  const [phase, setPhase]             = useState<"intro" | "playing" | "roundEnd" | "finished">("intro");
  const [questions, setQuestions]     = useState<Question[]>([]);
  const [current, setCurrent]         = useState(0);
  const [selected, setSelected]       = useState<(string | null)[]>([]);
  const [activeBlank, setActiveBlank] = useState(0);
  const [confirmed, setConfirmed]     = useState(false);
  const [roundScores, setRoundScores] = useState<number[]>([]);
  const [correctLog, setCorrectLog]   = useState<boolean[]>([]);
  const [totalScore, setTotalScore]   = useState(0);

  const round = ROUNDS[roundIdx];
  const q     = questions[current];

  const allSelected = q?.answer.every((_, i) => selected[i] != null && selected[i] !== "");

  const isCorrect = confirmed && q?.answer.every(
    (ans, i) => (selected[i] ?? "").toLowerCase() === ans.toLowerCase()
  );

  // ── Start round ───────────────────────────────────────
  const startRound = useCallback(() => {
    const pool = ALL_QUESTIONS.filter((q) => q.difficulty === round.difficulty);
    setQuestions(shuffle(pool).slice(0, 7));
    setCurrent(0);
    setSelected([]);
    setActiveBlank(0);
    setConfirmed(false);
    setCorrectLog([]);
    setPhase("playing");
  }, [round]);

  // ── Select option ─────────────────────────────────────
  const handleSelect = useCallback((opt: string) => {
    if (confirmed) return;
    setSelected((prev) => {
      const next = [...prev];
      next[activeBlank] = opt;
      return next;
    });
    if (q && activeBlank < q.answer.length - 1) {
      setActiveBlank((i) => i + 1);
    }
  }, [confirmed, activeBlank, q]);

  // ── Confirm ───────────────────────────────────────────
  const handleConfirm = useCallback(() => {
    if (!allSelected || confirmed) return;
    setConfirmed(true);
    const ok = q.answer.every(
      (ans, i) => (selected[i] ?? "").toLowerCase() === ans.toLowerCase()
    );
    setCorrectLog((prev) => [...prev, ok]);
    if (ok) setTotalScore((s) => s + 1);
  }, [allSelected, confirmed, q, selected]);

  // ── Next question ─────────────────────────────────────
  const handleNext = useCallback(() => {
    if (current + 1 >= questions.length) {
      setRoundScores((prev) => [...prev, correctLog.filter(Boolean).length]);
      setPhase("roundEnd");
    } else {
      setCurrent((c) => c + 1);
      setSelected([]);
      setActiveBlank(0);
      setConfirmed(false);
    }
  }, [current, questions.length, correctLog]);

  // ── Next round ────────────────────────────────────────
  const handleNextRound = useCallback(() => {
    if (roundIdx + 1 >= ROUNDS.length) {
      setPhase("finished");
    } else {
      setRoundIdx((i) => i + 1);
      setPhase("intro");
    }
  }, [roundIdx]);

  // ── Reset ─────────────────────────────────────────────
  const reset = useCallback(() => {
    setRoundIdx(0);
    setPhase("intro");
    setQuestions([]);
    setCurrent(0);
    setSelected([]);
    setActiveBlank(0);
    setConfirmed(false);
    setRoundScores([]);
    setCorrectLog([]);
    setTotalScore(0);
  }, []);

  // ── Render sentence with interactive blanks ────────────
  const renderSentence = (
    parts: string[],
    answers: string[],
    userSelected: (string | null)[],
    show: boolean,
    active: number
  ) => (
    <span>
      {parts.map((part, i) => (
        <span key={i}>
          {part}
          {i < answers.length && (
            show ? (
              <span
                className="inline-block mx-1 px-3 py-0.5 rounded-lg font-extrabold"
                style={{
                  background: getPColor(answers[i]).bg,
                  color: getPColor(answers[i]).text,
                  border: `2px solid ${getPColor(answers[i]).border}`,
                }}
              >
                {answers[i]}
              </span>
            ) : (
              <span
                onClick={() => setActiveBlank(i)}
                className="inline-block mx-1 px-3 py-0.5 rounded-lg font-extrabold cursor-pointer transition-all"
                style={{
                  minWidth: 52,
                  background: userSelected[i]
                    ? getPColor(userSelected[i]!).bg
                    : active === i ? "#f3e8ff" : "#ede9fe",
                  border: `2px ${userSelected[i] ? "solid" : "dashed"} ${
                    active === i
                      ? "#9333ea"
                      : userSelected[i]
                      ? getPColor(userSelected[i]!).border
                      : "#c084fc"
                  }`,
                  color: userSelected[i]
                    ? getPColor(userSelected[i]!).text
                    : active === i ? "#7c3aed" : "#c084fc",
                  boxShadow: active === i ? "0 0 0 3px #e9d5ff" : "none",
                  transform: active === i ? "scale(1.06)" : "scale(1)",
                }}
              >
                {userSelected[i] ?? `_${i + 1}_`}
              </span>
            )
          )}
        </span>
      ))}
    </span>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=Lexend:wght@700;800&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes popIn  { 0%{transform:scale(0.85);opacity:0} 65%{transform:scale(1.05)} 100%{transform:scale(1);opacity:1} }
        @keyframes slideR { from{opacity:0;transform:translateX(30px)} to{opacity:1;transform:translateX(0)} }
        @keyframes shake  { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-7px)} 75%{transform:translateX(7px)} }
        @keyframes float  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        .fade-up { animation: fadeUp 0.4s ease forwards; }
        .pop-in  { animation: popIn  0.4s ease forwards; }
        .slide-r { animation: slideR 0.35s ease forwards; }
        .shake   { animation: shake  0.4s ease; }
        .float   { animation: float  3s ease infinite; }
        button:focus, span:focus { outline: none; }
      `}</style>

      <div
        className="min-h-screen flex flex-col items-center relative overflow-hidden"
        style={{
          background: "linear-gradient(160deg, #fdf2f8 0%, #f5f0ff 50%, #fdf4ff 100%)",
          fontFamily: "'Nunito', sans-serif",
        }}
      >
        {/* Background blobs */}
        <div className="fixed inset-0 pointer-events-none" aria-hidden>
          <div style={{ position: "absolute", top: "-10%", left: "-10%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(192,57,122,0.08) 0%, transparent 70%)" }} />
          <div style={{ position: "absolute", bottom: "-10%", right: "-5%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)" }} />
          <div style={{ position: "absolute", top: "40%", left: "60%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(162,28,175,0.06) 0%, transparent 70%)" }} />
        </div>

        {/* Header */}
        <div className="w-full flex flex-col items-center gap-2 px-4 pt-8 pb-5 relative" style={{ zIndex: 1 }}>
          {/* Round pills */}
          <div className="flex gap-2 flex-wrap justify-center">
            {ROUNDS.map((r, i) => {
              const done   = roundScores[i] !== undefined;
              const active = roundIdx === i && phase !== "finished";
              return (
                <div
                  key={r.id}
                  className="flex items-center gap-1 px-3 py-1 rounded-full font-extrabold text-xs transition-all"
                  style={{
                    background: active ? r.accent : done ? r.pill : "rgba(255,255,255,0.7)",
                    color: active ? "#fff" : r.accent,
                    border: `1.5px solid ${active ? r.accent : r.border}`,
                    boxShadow: active ? `0 3px 12px ${r.accent}44` : "none",
                  }}
                >
                  {r.icon} {r.label}
                  {done && <span style={{ opacity: 0.8 }}> · {roundScores[i]}/7</span>}
                </div>
              );
            })}
          </div>

          <h1
            className="text-4xl sm:text-5xl font-extrabold text-center leading-tight"
            style={{ fontFamily: "'Lexend', sans-serif", color: "#7c1d6f" }}
          >
            Who Owns It? 🏷️
          </h1>
          <p className="font-bold text-sm" style={{ color: "#a855f7" }}>
            My · Your · His · Her · Its · Our · Their
          </p>

          {/* Possessive legend */}
          <div className="flex flex-wrap gap-1.5 justify-center mt-1">
            {Object.entries(P_COLOR).map(([word, c]) => (
              <span
                key={word}
                className="px-2.5 py-0.5 rounded-full font-extrabold text-xs"
                style={{ background: c.bg, color: c.text, border: `1.5px solid ${c.border}` }}
              >
                {word}
              </span>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="w-full max-w-2xl px-4 pb-10 flex flex-col gap-5" style={{ zIndex: 1 }}>

          {/* ══ INTRO ══════════════════════════════════════ */}
          {phase === "intro" && (
            <div className="fade-up flex flex-col gap-4">
              <div
                className="relative rounded-3xl overflow-hidden p-8 flex flex-col items-center gap-4 text-center"
                style={{
                  background: `linear-gradient(135deg, ${round.accent}18, ${round.accent}08)`,
                  border: `2px solid ${round.border}`,
                  boxShadow: `0 8px 32px ${round.accent}22`,
                }}
              >
                <FloatingChips accent={round.accent} />
                <div className="float text-7xl relative z-10">{round.icon}</div>
                <h2
                  className="text-3xl font-extrabold relative z-10"
                  style={{ fontFamily: "'Lexend', sans-serif", color: round.accent }}
                >
                  {round.label}: {round.title}
                </h2>
                <p className="font-bold text-lg relative z-10" style={{ color: round.accent, opacity: 0.8 }}>
                  {round.subtitle}
                </p>
                <div className="flex gap-3 flex-wrap justify-center relative z-10">
                  {["7 questions", "Multiple choice",
                    round.difficulty === "easy" ? "1 blank" :
                    round.difficulty === "medium" ? "2 blanks" : "3 blanks"
                  ].map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full font-extrabold text-sm"
                      style={{ background: round.pill, color: round.accent }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {roundScores.length > 0 && (
                <div
                  className="rounded-2xl p-4 flex gap-4 flex-wrap justify-center"
                  style={{ background: "rgba(255,255,255,0.8)", border: "1.5px solid #e8d0f0" }}
                >
                  {roundScores.map((s, i) => (
                    <div key={i} className="flex flex-col items-center gap-0.5">
                      <span className="text-xl">{ROUNDS[i].icon}</span>
                      <span className="font-extrabold text-sm" style={{ color: ROUNDS[i].accent }}>{ROUNDS[i].label}</span>
                      <span className="font-extrabold text-lg" style={{ color: "#2c3e50" }}>{s}/7</span>
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={startRound}
                className="w-full py-4 rounded-2xl font-extrabold text-white text-xl border-0 cursor-pointer"
                style={{
                  background: `linear-gradient(135deg, ${round.accent}, #9333ea)`,
                  fontFamily: "'Lexend', sans-serif",
                  boxShadow: `0 6px 24px ${round.accent}55`,
                }}
              >
                Start {round.label}! {round.icon}
              </button>
            </div>
          )}

          {/* ══ PLAYING ════════════════════════════════════ */}
          {phase === "playing" && q && (
            <div className="slide-r flex flex-col gap-4">

              {/* Top bar */}
              <div
                className="rounded-2xl px-4 py-3 flex items-center justify-between gap-3 flex-wrap"
                style={{ background: "rgba(255,255,255,0.85)", border: `1.5px solid ${round.border}` }}
              >
                <div className="flex flex-col">
                  <span className="font-extrabold text-sm" style={{ color: round.accent }}>
                    {round.icon} {round.label} · {round.title}
                  </span>
                  <span className="font-bold text-xs" style={{ color: "#a855f7" }}>
                    Question {current + 1} of {questions.length}
                  </span>
                </div>
                <ProgressDots
                  total={questions.length}
                  current={current}
                  correct={correctLog}
                  accent={round.accent}
                />
                <div
                  className="px-3 py-1 rounded-full font-extrabold text-sm"
                  style={{ background: round.pill, color: round.accent }}
                >
                  ⭐ {totalScore}
                </div>
              </div>

              {/* Main card */}
              <div
                className="rounded-3xl overflow-hidden"
                style={{
                  background: "#fff",
                  border: `2px solid ${round.border}`,
                  boxShadow: `0 8px 32px ${round.accent}18`,
                }}
              >
                {/* Image banner */}
                <div
                  className="relative w-full flex items-center justify-center overflow-hidden"
                  style={{ height: 200, background: `linear-gradient(135deg, ${round.accent}18, #f3e8ff)` }}
                >
                  <FloatingChips accent={round.accent} />
                  <Image
                    src={q.img}
                    alt={q.category}
                    fill
                    className="object-contain p-5"
                    sizes="640px"
                  />
                  <div
                    className="absolute top-3 left-3 px-3 py-1 rounded-full font-extrabold text-xs"
                    style={{ background: "rgba(255,255,255,0.92)", color: round.accent, border: `1px solid ${round.border}` }}
                  >
                    {q.category}
                  </div>
                </div>

                {/* Body */}
                <div className="p-5 flex flex-col gap-4">

                  {/* Sentence box */}
                  <div
                    className="rounded-2xl px-5 py-4"
                    style={{
                      background: `linear-gradient(135deg, ${round.accent}10, #f3e8ff55)`,
                      border: `1.5px solid ${round.border}`,
                    }}
                  >
                    <p className="text-xl font-extrabold leading-relaxed" style={{ color: "#2c3e50" }}>
                      {renderSentence(q.sentence, q.answer, selected, confirmed, activeBlank)}
                    </p>

                    {/* Blank selector pills */}
                    {!confirmed && q.answer.length > 1 && (
                      <div className="flex gap-2 mt-3 flex-wrap">
                        {q.answer.map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setActiveBlank(i)}
                            className="px-3 py-1 rounded-full font-extrabold text-xs border-0 cursor-pointer transition-all"
                            style={{
                              background: selected[i]
                                ? getPColor(selected[i]!).bg
                                : activeBlank === i ? round.accent : "#ede9fe",
                              color: selected[i]
                                ? getPColor(selected[i]!).text
                                : activeBlank === i ? "#fff" : round.accent,
                              border: `1.5px solid ${activeBlank === i ? round.accent : round.border}`,
                              boxShadow: activeBlank === i ? `0 2px 8px ${round.accent}44` : "none",
                            }}
                          >
                            Blank {i + 1}{selected[i] ? ` · ${selected[i]}` : " ·  ?"}
                          </button>
                        ))}
                      </div>
                    )}

                    <p className="text-xs font-bold mt-2 flex items-center gap-1" style={{ color: "#a855f7" }}>
                      💡 {q.hint}
                    </p>
                  </div>

                  {/* Options grid */}
                  <div className="grid grid-cols-2 gap-3">
                    {q.options.map((opt) => {
                      const c          = getPColor(opt);
                      const isSelected = selected[activeBlank] === opt;
                      const showCorrect = confirmed && q.answer.some(
                        (a) => a.toLowerCase() === opt.toLowerCase()
                      );
                      const showWrong = confirmed
                        && selected.some((s) => s?.toLowerCase() === opt.toLowerCase())
                        && !q.answer.some((a) => a.toLowerCase() === opt.toLowerCase());

                      return (
                        <button
                          key={opt}
                          onClick={() => handleSelect(opt)}
                          className={`py-4 px-4 rounded-2xl font-extrabold text-lg border-0 cursor-pointer transition-all ${showWrong ? "shake" : ""}`}
                          style={{
                            background:
                              showCorrect ? c.bg :
                              showWrong   ? "#fce4ec" :
                              isSelected  ? c.bg :
                              "#f9f5ff",
                            border: `2.5px solid ${
                              showCorrect ? c.border :
                              showWrong   ? "#e57373" :
                              isSelected  ? c.border :
                              "#e8d5f5"
                            }`,
                            color:
                              showCorrect ? c.text :
                              showWrong   ? "#c62828" :
                              isSelected  ? c.text :
                              "#7c3aed",
                            transform: isSelected && !confirmed ? "scale(1.04)" : "scale(1)",
                            boxShadow: isSelected && !confirmed ? `0 4px 16px ${c.border}66` : "none",
                            fontFamily: "'Lexend', sans-serif",
                          }}
                        >
                          {showCorrect && "✓ "}
                          {showWrong   && "✗ "}
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {/* Feedback */}
                  {confirmed && (
                    <div
                      className="pop-in rounded-2xl px-5 py-4 flex items-center gap-3"
                      style={{
                        background: isCorrect ? "#f0fdf4" : "#fff1f2",
                        border: `2px solid ${isCorrect ? "#86efac" : "#fca5a5"}`,
                      }}
                    >
                      <span style={{ fontSize: "2rem" }}>{isCorrect ? "🎉" : "💡"}</span>
                      <div>
                        <p className="font-extrabold text-base" style={{ color: isCorrect ? "#15803d" : "#be123c" }}>
                          {isCorrect
                            ? "All correct! Great job!"
                            : `Correct: ${q.answer.join(" · ")}`}
                        </p>
                        <p className="text-xs font-bold mt-0.5" style={{ color: isCorrect ? "#4ade80" : "#fb7185" }}>
                          {q.hint}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Action button */}
                  {!confirmed ? (
                    <button
                      onClick={handleConfirm}
                      disabled={!allSelected}
                      className="w-full py-4 rounded-2xl font-extrabold text-base border-0 transition-all"
                      style={{
                        background: allSelected
                          ? `linear-gradient(135deg, ${round.accent}, #9333ea)`
                          : "#e8d5f5",
                        color: allSelected ? "#fff" : "#c084fc",
                        cursor: allSelected ? "pointer" : "not-allowed",
                        fontFamily: "'Lexend', sans-serif",
                        boxShadow: allSelected ? `0 4px 16px ${round.accent}44` : "none",
                      }}
                    >
                      {allSelected ? "Confirm Answer ✅" : `Fill all ${q.answer.length} blank${q.answer.length > 1 ? "s" : ""} to continue`}
                    </button>
                  ) : (
                    <button
                      onClick={handleNext}
                      className="w-full py-4 rounded-2xl font-extrabold text-base border-0 cursor-pointer"
                      style={{
                        background: `linear-gradient(135deg, ${round.accent}, #9333ea)`,
                        color: "#fff",
                        fontFamily: "'Lexend', sans-serif",
                        boxShadow: `0 4px 16px ${round.accent}44`,
                      }}
                    >
                      {current + 1 >= questions.length ? "See Round Results →" : "Next Question →"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ══ ROUND END ══════════════════════════════════ */}
          {phase === "roundEnd" && (
            <div className="fade-up flex flex-col gap-4">
              <div
                className="relative rounded-3xl overflow-hidden p-8 flex flex-col items-center gap-4 text-center"
                style={{
                  background: `linear-gradient(135deg, ${round.accent}18, #f3e8ff)`,
                  border: `2px solid ${round.border}`,
                  boxShadow: `0 8px 32px ${round.accent}22`,
                }}
              >
                <FloatingChips accent={round.accent} />
                <div className="float text-6xl relative z-10">
                  {(roundScores[roundScores.length - 1] ?? 0) >= 6 ? "🌟" :
                   (roundScores[roundScores.length - 1] ?? 0) >= 4 ? "👏" : "💪"}
                </div>
                <h2
                  className="text-3xl font-extrabold relative z-10"
                  style={{ fontFamily: "'Lexend', sans-serif", color: round.accent }}
                >
                  {round.label} Complete!
                </h2>

                {/* Score ring */}
                <div
                  className="relative z-10 flex items-center justify-center rounded-full"
                  style={{
                    width: 110, height: 110,
                    background: `conic-gradient(${round.accent} ${((roundScores[roundScores.length - 1] ?? 0) / 7) * 360}deg, #e8d5f5 0deg)`,
                  }}
                >
                  <div
                    className="flex flex-col items-center justify-center rounded-full"
                    style={{ width: 84, height: 84, background: "#fff" }}
                  >
                    <span className="font-extrabold text-2xl" style={{ color: round.accent, fontFamily: "'Lexend', sans-serif" }}>
                      {roundScores[roundScores.length - 1] ?? 0}
                    </span>
                    <span className="text-xs font-bold" style={{ color: "#a855f7" }}>/ 7</span>
                  </div>
                </div>

                {/* Per-question result dots */}
                <div className="flex gap-2 flex-wrap justify-center relative z-10">
                  {correctLog.map((ok, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-center rounded-full text-xs font-extrabold"
                      style={{
                        width: 28, height: 28,
                        background: ok ? "#dcfce7" : "#fee2e2",
                        border: `2px solid ${ok ? "#86efac" : "#fca5a5"}`,
                        color: ok ? "#15803d" : "#be123c",
                      }}
                    >
                      {ok ? "✓" : "✗"}
                    </div>
                  ))}
                </div>

                <p className="font-bold relative z-10" style={{ color: round.accent, opacity: 0.85 }}>
                  {(roundScores[roundScores.length - 1] ?? 0) >= 6
                    ? "Outstanding! You're a possessive pro! 🌟"
                    : (roundScores[roundScores.length - 1] ?? 0) >= 4
                    ? "Good work! Keep it up! 💜"
                    : "Keep practicing — you'll get it! 💪"}
                </p>
              </div>

              <button
                onClick={handleNextRound}
                className="w-full py-4 rounded-2xl font-extrabold text-white text-xl border-0 cursor-pointer"
                style={{
                  background: `linear-gradient(135deg, ${round.accent}, #9333ea)`,
                  fontFamily: "'Lexend', sans-serif",
                  boxShadow: `0 6px 24px ${round.accent}55`,
                }}
              >
                {roundIdx + 1 >= ROUNDS.length
                  ? "See Final Results 🏆"
                  : `Start ${ROUNDS[roundIdx + 1].label} ${ROUNDS[roundIdx + 1].icon}`}
              </button>
            </div>
          )}

          {/* ══ FINISHED ═══════════════════════════════════ */}
          {phase === "finished" && (
            <div className="fade-up flex flex-col gap-4">
              <div
                className="relative rounded-3xl overflow-hidden p-8 flex flex-col items-center gap-5 text-center"
                style={{
                  background: "linear-gradient(135deg, #fdf2f8, #f5f0ff)",
                  border: "2px solid #c084fc",
                  boxShadow: "0 8px 40px rgba(192,57,122,0.18)",
                }}
              >
                <FloatingChips accent="#9333ea" />
                <div className="float text-6xl relative z-10">🏆</div>
                <h2
                  className="text-3xl font-extrabold relative z-10"
                  style={{ fontFamily: "'Lexend', sans-serif", color: "#7c1d6f" }}
                >
                  {totalScore >= 18 ? "Perfect Score!" :
                   totalScore >= 14 ? "Excellent Work!" :
                   totalScore >= 10 ? "Good Job!" : "Keep Practicing!"}
                </h2>
                <p className="font-bold relative z-10" style={{ color: "#a855f7" }}>
                  Total: <span style={{ color: "#7c1d6f", fontSize: "1.3rem" }}>{totalScore}</span> / 21 correct
                </p>

                {/* Round breakdown */}
                <div className="flex gap-3 flex-wrap justify-center relative z-10 w-full">
                  {ROUNDS.map((r, i) => (
                    <div
                      key={r.id}
                      className="flex-1 min-w-[90px] flex flex-col items-center gap-1 rounded-2xl py-4 px-3"
                      style={{ background: r.pill, border: `1.5px solid ${r.border}` }}
                    >
                      <span className="text-2xl">{r.icon}</span>
                      <span className="font-extrabold text-sm" style={{ color: r.accent }}>{r.label}</span>
                      <span className="font-extrabold text-xl" style={{ color: r.accent }}>
                        {roundScores[i] ?? 0}
                        <span style={{ fontSize: "0.8rem" }}>/7</span>
                      </span>
                    </div>
                  ))}
                </div>

                <p className="text-3xl relative z-10">
                  {totalScore >= 18 ? "⭐⭐⭐" : totalScore >= 14 ? "⭐⭐" : "⭐"}
                </p>
              </div>

              <button
                onClick={reset}
                className="w-full py-4 rounded-2xl font-extrabold text-white text-xl border-0 cursor-pointer"
                style={{
                  background: "linear-gradient(135deg, #c0397a, #9333ea)",
                  fontFamily: "'Lexend', sans-serif",
                  boxShadow: "0 6px 24px rgba(147,51,234,0.45)",
                }}
              >
                Play Again 🔄
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}