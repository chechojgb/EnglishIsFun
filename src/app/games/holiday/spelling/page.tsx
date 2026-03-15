"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { useSpeak } from "@/app/hooks/useSpeak";
import { Clover, Sparkles, ClipboardType, Lightbulb, EyeClosed, MicVocal} from 'lucide-react';


interface WordEntry {
  id: string;
  img: string;
  word: string;
}

const WORDS: WordEntry[] = [
  { id: "leprechaun", img: "/images/holidays/elf.png",      word: "Leprechaun"  },
  { id: "pot",        img: "/images/holidays/gold-pot.png", word: "Pot of Gold" },
  { id: "shamrock",   img: "/images/holidays/shamrock.png", word: "Shamrock"    },
  { id: "horseshoe",  img: "/images/holidays/horse.png",    word: "Horseshoe"   },
  { id: "rainbow",    img: "/images/holidays/rainbow.png",  word: "Rainbow"     },
  { id: "hat",        img: "/images/holidays/hat.png",      word: "Hat"         },
  { id: "coin",       img: "/images/holidays/coin.png",     word: "Coin"        },
  { id: "clover",     img: "/images/holidays/clover.png",   word: "Clover"      },
];

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function LetterTile({
  letter,
  state,
  revealed,
}: {
  letter: string;
  state: "idle" | "correct" | "wrong" | "missing";
  revealed: boolean;
}) {
  const styles: Record<string, { bg: string; border: string; color: string }> = {
    correct: { bg: "#4caf72", border: "#3d9460", color: "#fff" },
    wrong:   { bg: "#e57373", border: "#c62828", color: "#fff" },
    missing: { bg: "#ffb74d", border: "#f57c00", color: "#fff" },
    idle:    { bg: "#fff",    border: "#b6dfc4", color: "#2d7a4f" },
  };
  const s = styles[state];

  return (
    <div
      className="flex items-center justify-center rounded-xl font-extrabold uppercase transition-all duration-300"
      style={{
        width: "clamp(32px, 9vw, 48px)",
        height: "clamp(32px, 9vw, 48px)",
        fontSize: "clamp(0.9rem, 3vw, 1.3rem)",
        background: s.bg,
        border: `2.5px solid ${s.border}`,
        color: s.color,
        transform: state === "correct" ? "scale(1.08)" : "scale(1)",
      }}
    >
      {revealed ? letter : ""}
    </div>
  );
}

export default function SpellingGame() {
  const [queue, setQueue]           = useState<WordEntry[]>(() => shuffle(WORDS));
  const [currentIdx, setCurrentIdx] = useState(0);
  const [input, setInput]           = useState("");
  const [status, setStatus]         = useState<"playing" | "correct" | "wrong" | "revealed">("playing");
  const [score, setScore]           = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [finished, setFinished]     = useState(false);
  const [showHint, setShowHint]     = useState(false);
  const inputRef                    = useRef<HTMLInputElement>(null);
  const { speak, speaking }         = useSpeak();

  const current = queue[currentIdx];

  // Auto-speak when word changes
  useEffect(() => {
    if (!current || finished) return;
    const timer = setTimeout(() => speak(current.word), 500);
    return () => clearTimeout(timer);
  }, [currentIdx, finished]); // eslint-disable-line react-hooks/exhaustive-deps

  // Focus input on new word
  useEffect(() => {
    if (status === "playing") inputRef.current?.focus();
  }, [status, currentIdx]);

  const goNext = useCallback(() => {
    if (currentIdx + 1 >= queue.length) {
      setFinished(true);
      speak("Great job! You finished all the words!");
      return;
    }
    setCurrentIdx((i) => i + 1);
    setInput("");
    setStatus("playing");
    setWrongCount(0);
    setShowHint(false);
  }, [currentIdx, queue.length, speak]);

  const handleCheck = useCallback(() => {
    if (!input.trim() || status !== "playing") return;
    const userAnswer = input.trim().toLowerCase().replace(/\s+/g, " ");
    const correct    = current.word.toLowerCase();

    if (userAnswer === correct) {
      setStatus("correct");
      setScore((s) => s + (wrongCount === 0 ? 2 : 1));
      speak(wrongCount === 0 ? "Correct! Amazing!" : "Correct! Well done!");
      setTimeout(goNext, 1800);
    } else {
      setStatus("wrong");
      speak("Try again!");
      setWrongCount((w) => w + 1);
      setTimeout(() => {
        setStatus("playing");
        setInput("");
        inputRef.current?.focus();
      }, 1100);
    }
  }, [input, current, status, wrongCount, speak, goNext]);

  const handleReveal = useCallback(() => {
    setStatus("revealed");
    setWrongCount((w) => w + 1);
    speak(`The word is ${current.word}`);
    setTimeout(goNext, 2400);
  }, [current, speak, goNext]);

  const reset = useCallback(() => {
    setQueue(shuffle(WORDS));
    setCurrentIdx(0);
    setInput("");
    setStatus("playing");
    setScore(0);
    setWrongCount(0);
    setShowHint(false);
    setFinished(false);
  }, []);

  const getLetterStates = () => {
    if (!current) return [];
    const target = current.word.toLowerCase().replace(/\s+/g, "");
    const user   = input.trim().toLowerCase().replace(/\s+/g, "");
    return target.split("").map((letter, i) => ({
      letter,
      state:
        status === "correct"  ? ("correct"  as const) :
        status === "revealed" ? ("missing"  as const) :
        user[i] === letter    ? ("correct"  as const) :
        user[i]               ? ("wrong"    as const) :
                                ("missing"  as const),
      revealed: status === "correct" || status === "revealed",
    }));
  };

  const stars =
    score >= WORDS.length * 2 ? "⭐⭐⭐" :
    score >= WORDS.length     ? "⭐⭐"   : "⭐";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800&family=Nunito:wght@700;800&display=swap');
        @keyframes fadeUp   { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse    { 0%,100%{transform:scale(1)} 50%{transform:scale(1.18)} }
        @keyframes shake    { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-8px)} 75%{transform:translateX(8px)} }
        @keyframes bounce   { 0%,100%{transform:translateY(0)} 40%{transform:translateY(-10px)} }
        .fade-up     { animation: fadeUp  0.4s ease forwards; }
        .pulse-anim  { animation: pulse   0.6s ease infinite; }
        .shake-anim  { animation: shake   0.4s ease; }
        .bounce-anim { animation: bounce  0.5s ease; }
        input:focus  { outline: none; }
      `}</style>

      <div
        className="min-h-screen flex flex-col items-center gap-5 px-4 py-8"
        style={{ background: "#f0faf3", fontFamily: "'Nunito', sans-serif" }}
      >
        {/* Title */}
        <div className="text-center">
          <h1
            className="text-4xl sm:text-5xl font-extrabold leading-tight"
            style={{ fontFamily: "'Baloo 2', cursive", color: "#2d7a4f" }}
          >
            <Clover className="inline-flex align-middle mr-2" />
             Spell It!
          </h1>
          <p className="mt-1 font-bold text-sm" style={{ color: "#5a9e76" }}>
            Listen and type the word!
          </p>
        </div>

        {/* Stats */}
        <div className="flex gap-3 flex-wrap justify-center">
          {[
            { icon: <Sparkles/>, label: `${score} pts` },
            { icon: <ClipboardType/>, label: `${Math.min(currentIdx + 1, WORDS.length)} / ${WORDS.length}` },
          ].map(({ icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full font-extrabold text-sm"
              style={{ background: "#d6f0e0", color: "#2d7a4f" }}
            >
              {icon} {label}
            </div>
          ))}
        </div>

        {/* Finished */}
        {finished ? (
          <div
            className="fade-up w-full max-w-sm rounded-2xl p-7 flex flex-col items-center gap-3 text-center"
            style={{ background: "#fff", border: "2.5px solid #4caf72" }}
          >
            <div className="text-5xl bounce-anim">🏆</div>
            <h2
              className="text-2xl font-extrabold"
              style={{ fontFamily: "'Baloo 2', cursive", color: "#2d7a4f" }}
            >
              Well done!
            </h2>
            <p className="font-bold" style={{ color: "#5a9e76" }}>
              You scored{" "}
              <span style={{ color: "#2d7a4f" }}>{score} points</span>
            </p>
            <p className="text-2xl">{stars}</p>
            <button
              onClick={reset}
              className="mt-1 px-7 py-2.5 rounded-full font-extrabold text-white text-base border-0 cursor-pointer"
              style={{ background: "#4caf72", fontFamily: "'Nunito', sans-serif" }}
            >
              Play Again 🍀
            </button>
          </div>
        ) : (
          /* Game card */
          <div
            className="fade-up w-full max-w-sm flex flex-col items-center gap-5 rounded-2xl p-6"
            style={{ background: "#fff", border: "2.5px solid #b6dfc4" }}
          >
            {/* Image */}
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{
                width: "clamp(130px, 42vw, 190px)",
                height: "clamp(130px, 42vw, 190px)",
                background: "#f0faf3",
                border: "2.5px solid #b6dfc4",
              }}
            >
              <Image
                src={current.img}
                alt="Guess this word"
                fill
                className="object-contain p-3"
                sizes="190px"
              />
            </div>

            {/* Speak button */}
            <button
              onClick={() => speak(current.word)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-extrabold text-sm border-0 cursor-pointer ${speaking ? "pulse-anim" : ""}`}
              style={{
                background: speaking ? "#3d9460" : "#4caf72",
                color: "#fff",
                fontFamily: "'Nunito', sans-serif",
              }}
            >
              <span style={{ fontSize: "1.2rem" }}><MicVocal/></span>
              {speaking ? "Speaking…" : "Hear the word"}
            </button>

            {/* Hint */}
            {showHint && (
              <p className="font-extrabold text-sm" style={{ color: "#5a9e76" }}>
                Hint: starts with{" "}
                <span
                  className="px-2 py-0.5 rounded-lg"
                  style={{ background: "#d6f0e0", color: "#2d7a4f" }}
                >
                  {current.word[0].toUpperCase()}
                </span>
                {" "}· {current.word.replace(/\s/g, "").length} letters
              </p>
            )}

            {/* Letter tiles on result */}
            {(status === "correct" || status === "revealed") && (
              <div className="flex gap-1.5 flex-wrap justify-center">
                {getLetterStates().map((ls, i) => (
                  <LetterTile key={i} {...ls} />
                ))}
              </div>
            )}

            {/* Input row */}
            <div className={`flex gap-2 w-full ${status === "wrong" ? "shake-anim" : ""}`}>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCheck()}
                disabled={status !== "playing"}
                placeholder="Type the word…"
                className="flex-1 rounded-xl px-4 py-2.5 font-extrabold text-base"
                style={{
                  border: `2.5px solid ${
                    status === "correct" ? "#4caf72" :
                    status === "wrong"   ? "#e57373" : "#b6dfc4"
                  }`,
                  background:
                    status === "correct" ? "#e6f7ed" :
                    status === "wrong"   ? "#fde8e8" : "#f9fefb",
                  color: "#2d7a4f",
                  fontFamily: "'Nunito', sans-serif",
                }}
              />
              <button
                onClick={handleCheck}
                disabled={!input.trim() || status !== "playing"}
                className="px-4 py-2.5 rounded-xl font-extrabold text-white text-sm border-0 transition-all"
                style={{
                  background: input.trim() && status === "playing" ? "#4caf72" : "#b6dfc4",
                  cursor: input.trim() && status === "playing" ? "pointer" : "not-allowed",
                  fontFamily: "'Nunito', sans-serif",
                }}
              >
                ✓
              </button>
            </div>

            {/* Feedback */}
            {status === "correct" && (
              <p className="font-extrabold text-base bounce-anim" style={{ color: "#2d7a4f" }}>
                🎉 {wrongCount === 0 ? "+2 pts — Perfect!" : "+1 pt — Correct!"}
              </p>
            )}
            {status === "wrong" && (
              <p className="font-extrabold text-sm" style={{ color: "#e57373" }}>
                ❌ Try again!
              </p>
            )}
            {status === "revealed" && (
              <p className="font-extrabold text-sm" style={{ color: "#f57c00" }}>
                💡 The word was:{" "}
                <span style={{ color: "#2d7a4f" }}>{current.word}</span>
              </p>
            )}

            {/* Helper buttons */}
            {status === "playing" && (
              <div className="flex gap-2 w-full">
                {!showHint && (
                  <button
                    onClick={() => setShowHint(true)}
                    className="flex-1 py-2 rounded-xl font-extrabold text-xs border-0 cursor-pointer"
                    style={{ background: "#e2f5e9", color: "#2d7a4f", fontFamily: "'Nunito', sans-serif" }}
                  >
                    <Lightbulb className="inline-flex align-middle mr-2"/> Hint
                  </button>
                )}
                <button
                  onClick={handleReveal}
                  className="flex-1 py-2 rounded-xl font-extrabold text-xs border-0 cursor-pointer"
                  style={{ background: "#e2f5e9", color: "#5a9e76", fontFamily: "'Nunito', sans-serif" }}
                >
                  <EyeClosed className="inline-flex align-middle mr-2" /> Show word
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}