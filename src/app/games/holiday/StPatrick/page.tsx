"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Clover, RotateCcw, Timer} from 'lucide-react';

interface Card {
  id: number;
  img: string;
  word: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const VOCAB_PAIRS = [
  { img: "/images/holidays/elf.png",      word: "Leprechaun"  },
  { img: "/images/holidays/gold-pot.png", word: "Pot of Gold" },
  { img: "/images/holidays/shamrock.png", word: "Shamrock"    },
  { img: "/images/holidays/horse.png",    word: "Horseshoe"   },
  { img: "/images/holidays/rainbow.png",  word: "Rainbow"     },
  { img: "/images/holidays/hat.png",      word: "Hat"         },
  { img: "/images/holidays/coin.png",     word: "Coin"        },
  { img: "/images/holidays/clover.png",   word: "Clover"      },
];

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function buildDeck(): Card[] {
  return shuffle(
    VOCAB_PAIRS.flatMap((p, i) => [
      { id: i * 2,     img: p.img, word: p.word, isFlipped: false, isMatched: false },
      { id: i * 2 + 1, img: p.img, word: p.word, isFlipped: false, isMatched: false },
    ])
  );
}

export default function MemoryGame() {
  const [cards, setCards]     = useState<Card[]>(buildDeck);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [moves, setMoves]     = useState(0);
  const [matches, setMatches] = useState(0);
  const [locked, setLocked]   = useState(false);
  const [startTime]           = useState(() => Date.now());
  const [elapsed, setElapsed] = useState(0);
  const [won, setWon]         = useState(false);
  const [shake, setShake]     = useState<number[]>([]);

  useEffect(() => {
    if (won) return;
    const id = setInterval(
      () => setElapsed(Math.floor((Date.now() - startTime) / 1000)),
      500
    );
    return () => clearInterval(id);
  }, [won, startTime]);

  const reset = useCallback(() => {
    setCards(buildDeck());
    setFlipped([]);
    setMoves(0);
    setMatches(0);
    setLocked(false);
    setElapsed(0);
    setWon(false);
    setShake([]);
  }, []);

  const handleCardClick = useCallback(
    (cardId: number) => {
      if (locked || won) return;
      const card = cards.find((c) => c.id === cardId);
      if (!card || card.isFlipped || card.isMatched) return;

      const newFlipped = [...flipped, cardId];
      setCards((prev) =>
        prev.map((c) => (c.id === cardId ? { ...c, isFlipped: true } : c))
      );
      setFlipped(newFlipped);

      if (newFlipped.length === 2) {
        setLocked(true);
        setMoves((m) => m + 1);

        const [a, b] = newFlipped.map((id) => cards.find((c) => c.id === id)!);
        const isMatch = a.img === b.img && a.id !== b.id;

        setTimeout(() => {
          if (isMatch) {
            setCards((prev) =>
              prev.map((c) =>
                c.id === a.id || c.id === b.id ? { ...c, isMatched: true } : c
              )
            );
            const next = matches + 1;
            setMatches(next);
            if (next === VOCAB_PAIRS.length) setWon(true);
          } else {
            setShake([a.id, b.id]);
            setTimeout(() => setShake([]), 450);
            setCards((prev) =>
              prev.map((c) =>
                c.id === a.id || c.id === b.id ? { ...c, isFlipped: false } : c
              )
            );
          }
          setFlipped([]);
          setLocked(false);
        }, 950);
      }
    },
    [cards, flipped, locked, won, matches]
  );

  const formatTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const stars = moves <= 14 ? "⭐⭐⭐" : moves <= 22 ? "⭐⭐" : "⭐";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;800&family=Nunito:wght@700;800&display=swap');

        .card-flip {
          transition: transform 0.45s cubic-bezier(.4,0,.2,1);
          transform-style: preserve-3d;
        }
        .card-flip.flipped {
          transform: rotateY(180deg);
        }
        .card-face {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .card-front {
          transform: rotateY(180deg);
        }
        @keyframes shake {
          0%,100% { transform: rotateY(180deg) translateX(0); }
          25%      { transform: rotateY(180deg) translateX(-6px); }
          75%      { transform: rotateY(180deg) translateX(6px); }
        }
        .card-shake {
          animation: shake 0.4s ease;
        }
        @keyframes matchPop {
          0%   { transform: rotateY(180deg) scale(1); }
          50%  { transform: rotateY(180deg) scale(1.1); }
          100% { transform: rotateY(180deg) scale(1); }
        }
        .card-matched-anim {
          animation: matchPop 0.35s ease;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.45s ease forwards; }

        @keyframes starBounce {
          0%,100% { transform: translateY(0) rotate(-5deg); }
          50%     { transform: translateY(-8px) rotate(5deg); }
        }
        .trophy { animation: starBounce 1s ease infinite; }
      `}</style>

      <div
        className="min-h-screen flex flex-col items-center justify-center gap-5 px-4 py-8"
        style={{ background: "#f0faf3", fontFamily: "'Nunito', sans-serif" }}
      >
        {/* Title */}
        <div className="text-center">
          <h1
            className="text-4xl sm:text-5xl font-extrabold leading-tight"
            style={{ fontFamily: "'Baloo 2', cursive", color: "#2d7a4f" }}
          >
            <Clover className="inline-flex align-middle mr-2"/> St. Patrick&apos;s Memory
          </h1>
          <p className="mt-1 font-bold text-base" style={{ color: "#5a9e76" }}>
            Find all the matching pairs!
          </p>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap gap-3 justify-center">
          {[
            { icon: "🎯", label: `${moves} moves` },
            { icon: <Timer/>,  label: formatTime(elapsed) },
            { icon: <Clover/>, label: `${matches} / ${VOCAB_PAIRS.length} pairs` },
          ].map(({ icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full font-extrabold text-sm"
              style={{ background: "#d6f0e0", color: "#2d7a4f" }}
            >
              <span>{icon}</span> {label}
            </div>
          ))}
        </div>

        {/* Win banner */}
        {won && (
          <div
            className="fade-up w-full max-w-sm rounded-2xl p-6 text-center flex flex-col items-center gap-2"
            style={{ background: "#fff", border: "2.5px solid #4caf72" }}
          >
            <div className="trophy text-5xl">🏆</div>
            <h2
              className="text-2xl font-extrabold mt-1"
              style={{ fontFamily: "'Baloo 2', cursive", color: "#2d7a4f" }}
            >
              Amazing job!
            </h2>
            <p className="font-bold" style={{ color: "#5a9e76" }}>
              {moves} moves · {formatTime(elapsed)}
            </p>
            <p className="text-2xl">{stars}</p>
            <button
              onClick={reset}
              className="mt-2 px-6 py-2.5 rounded-full font-extrabold text-white text-base cursor-pointer border-0"
              style={{ background: "#4caf72", fontFamily: "'Nunito', sans-serif" }}
            >
              Play Again <Clover className="inline-flex align-middle mr-2"/>
            </button>
          </div>
        )}

        {/* Card grid */}
        <div className="grid grid-cols-4 gap-3 w-full max-w-md">
          {cards.map((card) => {
            const isVisible = card.isFlipped || card.isMatched;
            const flipClass = isVisible ? "flipped" : "";
            const animClass = card.isMatched
              ? "card-matched-anim"
              : shake.includes(card.id)
              ? "card-shake"
              : "";

            return (
              <div
                key={card.id}
                className="aspect-square cursor-pointer"
                style={{ perspective: "700px" }}
                onClick={() => handleCardClick(card.id)}
              >
                <div
                  className={`card-flip ${flipClass} ${animClass} relative w-full h-full`}
                >
                  {/* Back face — green with shamrock */}
                  <div
                    className="card-face absolute inset-0 rounded-2xl flex items-center justify-center shadow-sm"
                    style={{
                      background: "#4caf72",
                      border: "2.5px solid #3d9460",
                    }}
                  >
                    <span style={{ fontSize: "1.8rem", opacity: 0.5 }}>☘️</span>
                  </div>

                  {/* Front face — white with image + word */}
                  <div
                    className="card-face card-front absolute inset-0 rounded-2xl flex flex-col items-center justify-center gap-1 shadow-sm"
                    style={{
                      background: card.isMatched ? "#e6f7ed" : "#ffffff",
                      border: `2.5px solid ${card.isMatched ? "#4caf72" : "#b6dfc4"}`,
                    }}
                  >
                    <div className="relative w-3/5 h-3/5">
                      <Image
                        src={card.img}
                        alt={card.word}
                        fill
                        className="object-contain"
                        sizes="80px"
                      />
                    </div>
                    <span
                      className="text-center font-extrabold leading-tight px-1"
                      style={{
                        fontSize: "clamp(0.45rem, 2vw, 0.65rem)",
                        color: "#2d7a4f",
                      }}
                    >
                      {card.word}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Restart */}
        {!won && (
          <button
            onClick={reset}
            className="px-5 py-2 rounded-full font-extrabold text-sm cursor-pointer"
            style={{
              background: "transparent",
              border: "2px solid #4caf72",
              color: "#2d7a4f",
              fontFamily: "'Nunito', sans-serif",
            }}
          >
            Restart <RotateCcw className="inline-flex align-middle mr-2"/>
          </button>
        )}
      </div>
    </>
  );
}