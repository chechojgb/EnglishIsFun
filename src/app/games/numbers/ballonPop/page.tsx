"use client";
import { useState, useEffect, useRef, useCallback } from "react";

const NUMBER_WORDS = ["One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten"];

const BALLOON_COLORS = [
  { fill: "#fca5a5", stroke: "#ef4444", shine: "#fee2e2" },
  { fill: "#fdba74", stroke: "#f97316", shine: "#ffedd5" },
  { fill: "#fcd34d", stroke: "#f59e0b", shine: "#fef3c7" },
  { fill: "#86efac", stroke: "#22c55e", shine: "#dcfce7" },
  { fill: "#93c5fd", stroke: "#3b82f6", shine: "#dbeafe" },
  { fill: "#c4b5fd", stroke: "#8b5cf6", shine: "#ede9fe" },
  { fill: "#f9a8d4", stroke: "#ec4899", shine: "#fce7f3" },
  { fill: "#6ee7b7", stroke: "#10b981", shine: "#d1fae5" },
  { fill: "#fda4af", stroke: "#f43f5e", shine: "#ffe4e6" },
  { fill: "#a5b4fc", stroke: "#6366f1", shine: "#e0e7ff" },
];

const ROUNDS = [
  { speed: 0.070, spawnInterval: 1800, maxBalloons: 6 },
  { speed: 0.08,  spawnInterval: 1400, maxBalloons: 9 },
  { speed: 0.11,  spawnInterval: 1100, maxBalloons: 11 },
];

type Balloon = {
  id: number;
  number: number;
  x: number;
  y: number;
  color: typeof BALLOON_COLORS[0];
  popped: boolean;
  popScale: number;
  swing: number;
  swingSpeed: number;
};

type GameState = "idle" | "playing" | "roundComplete" | "victory" | "gameover";

type BunnyMood = "happy" | "sad" | "cheer" | "love";

let nextId = 0;

function makeBalloon(number: number, yOffset = 0): Balloon {
  return {
    id: nextId++,
    number,
    x: 5 + Math.random() * 70,
    y: 108 + yOffset,
    color: BALLOON_COLORS[number - 1],
    popped: false,
    popScale: 1,
    swing: Math.random() * Math.PI * 2,
    swingSpeed: 0.5 + Math.random() * 0.8,
  };
}

function buildInitialBalloons(expected: number, maxBalloons: number): Balloon[] {
  const result: Balloon[] = [];
  result.push(makeBalloon(expected, 0));

  // Todos los números excepto el esperado, sin importar si ya fueron completados
  const pool = Array.from({ length: 10 }, (_, i) => i + 1).filter(n => n !== expected);
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  const count = Math.min(maxBalloons - 1, pool.length);
  for (let i = 0; i < count; i++) {
    result.push(makeBalloon(pool[i], (i + 1) * 12));
  }
  return result;
}

export default function BalloonPopGame() {
  const [gameState, setGameState]   = useState<GameState>("idle");
  const [balloons, setBalloons]     = useState<Balloon[]>([]);
  const [nextExpected, setNextExpected] = useState(1);
  const [lives, setLives]           = useState(3);
  const [score, setScore]           = useState(0);
  const [round, setRound]           = useState(0);
  const [completed, setCompleted]   = useState<number[]>([]);
  const [bunnyMood, setBunnyMood]   = useState<"happy"|"sad"|"cheer">("happy");
  const [flash, setFlash]           = useState<"none"|"good"|"bad">("none");

  const rafRef          = useRef<number>(0);
  const lastTimeRef     = useRef<number>(0);
  const spawnTimerRef   = useRef<number>(0);
  const balloonsRef     = useRef<Balloon[]>([]);
  const nextExpectedRef = useRef(1);
  const livesRef        = useRef(3);
  const roundRef        = useRef(0);
  const completedRef    = useRef<number[]>([]);
  const gameStateRef    = useRef<GameState>("idle");

  // Sync refs
  useEffect(() => { balloonsRef.current = balloons; }, [balloons]);
  useEffect(() => { nextExpectedRef.current = nextExpected; }, [nextExpected]);
  useEffect(() => { livesRef.current = lives; }, [lives]);
  useEffect(() => { roundRef.current = round; }, [round]);
  useEffect(() => { completedRef.current = completed; }, [completed]);
  useEffect(() => { gameStateRef.current = gameState; }, [gameState]);

  const triggerWrong = useCallback(() => {
    setFlash("bad"); setBunnyMood("sad");
    setTimeout(() => { setFlash("none"); setBunnyMood("happy"); }, 700);
  }, []);

  const triggerRight = useCallback(() => {
    setFlash("good"); setBunnyMood("cheer");
    setTimeout(() => { setFlash("none"); setBunnyMood("happy"); }, 500);
  }, []);

  const popBalloon = useCallback((balloon: Balloon) => {
    if (balloon.popped || gameStateRef.current !== "playing") return;

    if (balloon.number === nextExpectedRef.current) {
      const newCompleted = [...completedRef.current, balloon.number];
      completedRef.current = newCompleted;
      setCompleted(newCompleted);
      setScore(s => s + 100 * (roundRef.current + 1));
      setBalloons(prev => prev.map(b => b.id === balloon.id ? { ...b, popped: true } : b));
      triggerRight();

      if (newCompleted.length === 10) {
        cancelAnimationFrame(rafRef.current);
        setTimeout(() => {
          if (roundRef.current >= ROUNDS.length - 1) setGameState("victory");
          else setGameState("roundComplete");
        }, 600);
      } else {
        const next = nextExpectedRef.current + 1;
        nextExpectedRef.current = next;
        setNextExpected(next);
      }
    } else {
      const newLives = livesRef.current - 1;
      livesRef.current = newLives;
      setLives(newLives);
      if (newLives <= 0) {
        cancelAnimationFrame(rafRef.current);
        setGameState("gameover");
      } else {
        triggerWrong();
      }
    }
  }, [triggerRight, triggerWrong]);

  // ---- GAME LOOP ----
  useEffect(() => {
    if (gameState !== "playing") {
      cancelAnimationFrame(rafRef.current);
      return;
    }

    lastTimeRef.current = performance.now();
    spawnTimerRef.current = 0;

    const loop = (now: number) => {
      const dt = Math.min((now - lastTimeRef.current) / 1000, 0.05);
      lastTimeRef.current = now;

      const r       = roundRef.current;
      const cfg     = ROUNDS[Math.min(r, ROUNDS.length - 1)];
      const expected = nextExpectedRef.current;
      const done    = new Set(completedRef.current);

      setBalloons(prev => {
        // 1. Mover y animar
        let updated = prev.map(b => {
          if (b.popped) return { ...b, popScale: Math.max(0, b.popScale - dt * 6) };
          return { ...b, y: b.y - cfg.speed * 100 * dt, swing: b.swing + b.swingSpeed * dt };
        }).filter(b => !b.popped || b.popScale > 0);
        
        const escaped = updated.filter(b => !b.popped && b.y < -20);
          if (escaped.length > 0) {
            updated = updated.filter(b => b.popped || b.y >= -20);

            const expectedEscaped = escaped.filter(b => b.number === nextExpectedRef.current);
            if (expectedEscaped.length > 0) {
              const newLives = livesRef.current - 0.5;
              livesRef.current = newLives;
              setLives(newLives);
              if (newLives <= 0) setGameState("gameover");
              else triggerWrong();
            }
            // Distractores que escapan — silencio, solo desaparecen
        }

        const alive = updated.filter(b => !b.popped);
        const onScreen = new Set(alive.map(b => b.number));

        // 3. Garantizar que el esperado SIEMPRE esté en pantalla
        if (!onScreen.has(expected)) {
          updated.push(makeBalloon(expected));
          onScreen.add(expected);
        }

        // 4. Spawn inmediato cuando hay espacio
        const aliveNow = updated.filter(b => !b.popped).length;
        if (aliveNow < cfg.maxBalloons) {
          const onScreenNums = new Set(updated.filter(b => !b.popped).map(b => b.number));
          
          // Pool sin duplicados primero
          let pool = Array.from({ length: 10 }, (_, i) => i + 1)
            .filter(n => n !== nextExpectedRef.current && !onScreenNums.has(n));

          // Si el pool está vacío, permitir duplicados (cualquier número excepto el esperado)
          if (pool.length === 0) {
            pool = Array.from({ length: 10 }, (_, i) => i + 1)
              .filter(n => n !== nextExpectedRef.current);
          }

          if (pool.length > 0) {
            const pick = pool[Math.floor(Math.random() * pool.length)];
            updated.push(makeBalloon(pick));
          }
        }

        return updated;
      });

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [gameState, triggerWrong]);

  const startGame = useCallback(() => {
    nextId = 0;
    const cfg = ROUNDS[0];
    nextExpectedRef.current = 1;
    completedRef.current = [];
    livesRef.current = 3;
    roundRef.current = 0;

    setLives(3);
    setScore(0);
    setRound(0);
    setNextExpected(1);
    setCompleted([]);
    setBunnyMood("cheer");
    setBalloons(buildInitialBalloons(1, cfg.maxBalloons));
    setGameState("playing");
  }, []);

  const nextRound = useCallback(() => {
    const r = roundRef.current + 1;
    const cfg = ROUNDS[Math.min(r, ROUNDS.length - 1)];
    nextExpectedRef.current = 1;
    completedRef.current = [];
    roundRef.current = r;

    setRound(r);
    setNextExpected(1);
    setCompleted([]);
    setBalloons(buildInitialBalloons(1, cfg.maxBalloons));
    setGameState("playing");
  }, []);

  const progress = (completed.length / 10) * 100;

    // ---- SCREENS ----
  if (gameState === "idle") return (
    <Screen bg="from-sky-100 to-rose-50">
      <BunnyFace mood="happy" />
      <h1 className="text-3xl md:text-4xl font-black text-gray-800 mb-2 text-center">Balloon Pop!</h1>
      <p className="text-gray-500 font-medium mb-1 text-center text-sm md:text-base max-w-xs">
        Pop balloons <span className="font-black text-rose-400">in order</span> from 1 to 10!
      </p>
      <p className="text-gray-400 text-xs md:text-sm mb-6 text-center">Tap the wrong one → lose a life ❤️</p>
      <div className="flex gap-3 mb-8">
        {[1,2,3].map(n => (
          <BalloonSVG key={n} color={BALLOON_COLORS[n-1]} number={n} word={NUMBER_WORDS[n-1]} size={70} />
        ))}
      </div>
      <button onClick={startGame} className="bg-rose-400 hover:bg-rose-500 active:scale-95 text-white font-black text-lg px-10 py-4 rounded-2xl shadow-lg transition-all">
        Let's Play! 🎈
      </button>
    </Screen>
  );

  if (gameState === "roundComplete") return (
    <Screen bg="from-emerald-100 to-teal-50">
      <BunnyFace mood="cheer" />
      <div className="text-5xl mb-1 animate-bounce">⭐</div>
      <h2 className="text-3xl md:text-4xl font-black text-gray-800 mb-1">Round {round + 1} done!</h2>
      <p className="text-gray-400 mb-4 text-sm">Score: <span className="font-black text-rose-400 text-lg">{score}</span></p>
      <p className="text-gray-500 font-semibold mb-8">Round {round + 2} is faster! Ready?</p>
      <button onClick={nextRound} className="bg-rose-400 hover:bg-rose-500 active:scale-95 text-white font-black text-lg px-10 py-4 rounded-2xl shadow-lg transition-all">
        Next Round →
      </button>
    </Screen>
  );

  if (gameState === "gameover") return (
    <Screen bg="from-red-100 to-rose-50">
      <BunnyFace mood="sad" />
      <h2 className="text-3xl md:text-4xl font-black text-gray-800 mb-2">Oh no!</h2>
      <p className="text-gray-500 mb-1 text-sm">You reached <span className="font-black text-rose-400">{completed.length}</span> out of 10</p>
      <p className="text-gray-400 mb-8 text-sm">Score: <span className="font-black text-gray-700">{score}</span></p>
      <button onClick={startGame} className="bg-rose-400 hover:bg-rose-500 active:scale-95 text-white font-black text-lg px-10 py-4 rounded-2xl shadow-lg transition-all">
        Try Again 🎈
      </button>
    </Screen>
  );

  if (gameState === "victory") return (
    <Screen bg="from-violet-100 to-pink-50">
      <BunnyFace mood="love" />
      <div className="text-5xl mb-1 animate-bounce">🏆</div>
      <h2 className="text-3xl md:text-4xl font-black text-gray-800 mb-1">You Won!</h2>
      <p className="text-gray-400 mb-2 text-sm">All 3 rounds completed! 🎉</p>
      <p className="text-4xl font-black text-rose-400 mb-4">{score} pts</p>
      <div className="flex gap-1 mb-6 items-center">
        {Array.from({length: lives}).map((_, i) => <span key={i} className="text-2xl">❤️</span>)}
        {lives > 0 && <span className="text-xs text-gray-400 ml-1">lives left</span>}
      </div>
      <button onClick={startGame} className="bg-rose-400 hover:bg-rose-500 active:scale-95 text-white font-black text-lg px-10 py-4 rounded-2xl shadow-lg transition-all">
        Play Again 🎈
      </button>
    </Screen>
  );

  // ---- PLAYING ----
  return (
    <div
      className="fixed inset-0 overflow-hidden select-none"
      style={{
        background: flash === "good"
          ? "linear-gradient(to bottom, #d1fae5, #f0fdf4)"
          : flash === "bad"
          ? "linear-gradient(to bottom, #fee2e2, #fff1f2)"
          : "linear-gradient(to bottom, #e0f2fe, #fff1f2)",
        transition: "background 0.3s ease",
      }}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between px-4 md:px-8 pt-4 pb-2 relative z-10">
        <div className="flex items-center gap-2">
          {/* Conejito inline pequeño */}
          <svg width="36" height="42" viewBox="0 0 60 80" fill="none"
            style={{ transform: bunnyMood === 'cheer' ? 'scale(1.2) rotate(-8deg)' : bunnyMood === 'sad' ? 'scale(0.9)' : 'scale(1)', transition: 'transform 0.2s ease' }}
          >
            <ellipse cx="18" cy="16" rx="7" ry="14" fill="white" stroke="#d1d5db" strokeWidth="1.5"/>
            <ellipse cx="18" cy="16" rx="4" ry="10" fill={bunnyMood === "sad" ? "#fce7f3" : "#fecdd3"}/>
            <ellipse cx="42" cy="16" rx="7" ry="14" fill="white" stroke="#d1d5db" strokeWidth="1.5"/>
            <ellipse cx="42" cy="16" rx="4" ry="10" fill={bunnyMood === "sad" ? "#fce7f3" : "#fecdd3"}/>
            <circle cx="30" cy="42" r="22" fill="white" stroke="#d1d5db" strokeWidth="1.5"/>
            <ellipse cx="14" cy="46" rx="6" ry="4" fill="#fda4af" opacity="0.3"/>
            <ellipse cx="46" cy="46" rx="6" ry="4" fill="#fda4af" opacity="0.3"/>
            {bunnyMood === "sad"
              ? <><ellipse cx="20" cy="36" rx="3" ry="2" fill="#374151" transform="rotate(-20 20 36)"/><ellipse cx="40" cy="36" rx="3" ry="2" fill="#374151" transform="rotate(20 40 36)"/></>
              : bunnyMood === "cheer"
              ? <><circle cx="20" cy="36" r="3.5" fill="#374151"/><circle cx="40" cy="36" r="3.5" fill="#374151"/><circle cx="21.5" cy="34.5" r="1.2" fill="white"/><circle cx="41.5" cy="34.5" r="1.2" fill="white"/></>
              : <><circle cx="20" cy="36" r="3" fill="#374151"/><circle cx="40" cy="36" r="3" fill="#374151"/><circle cx="21.2" cy="34.8" r="1" fill="white"/><circle cx="41.2" cy="34.8" r="1" fill="white"/></>
            }
            <ellipse cx="30" cy="44" rx="3" ry="2" fill="#fda4af"/>
            {bunnyMood === "sad"
              ? <path d="M22 52 Q30 48 38 52" stroke="#fda4af" strokeWidth="2" fill="none" strokeLinecap="round"/>
              : <path d="M22 50 Q30 56 38 50" stroke="#fda4af" strokeWidth="2" fill="none" strokeLinecap="round"/>
            }
          </svg>

          <div className="flex gap-0.5">
            {Array.from({length: 3}).map((_, i) => (
              <span key={i} className="text-lg md:text-xl transition-all duration-300" style={{ opacity: i < lives ? 1 : 0.2 }}>❤️</span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <span className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest hidden sm:block">
            Round {round + 1}/{ROUNDS.length}
          </span>
          <div className="bg-white/80 backdrop-blur rounded-xl px-3 md:px-4 py-1.5 font-black text-rose-400 tabular-nums text-sm md:text-base shadow-sm">
            {score}
          </div>
        </div>
      </div>

      {/* NEXT TO POP */}
      <div className="flex flex-col items-center gap-1 py-2 relative z-10">
        <p className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest">Pop next</p>
        <div className="bg-white/90 backdrop-blur rounded-2xl px-4 md:px-5 py-2 shadow-sm flex items-center gap-2 md:gap-3">
          <span className="text-2xl md:text-3xl font-black text-gray-800">{nextExpected}</span>
          <span className="text-base md:text-lg font-bold text-rose-400">{NUMBER_WORDS[nextExpected - 1]}</span>
        </div>
        <div className="w-36 md:w-48 h-2 bg-white/50 rounded-full mt-1 overflow-hidden">
          <div className="h-full bg-rose-400 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
        <p className="text-xs text-gray-400">{completed.length}/10</p>
      </div>

      {/* BALLOONS */}
      <div className="absolute inset-0 pointer-events-none">
        {balloons.map(balloon => {
          const swingX = Math.sin(balloon.swing) * 2;
          const size = typeof window !== "undefined" && window.innerWidth < 640 ? 70 : 90;
          return (
            <div
              key={balloon.id}
              className="absolute pointer-events-auto cursor-pointer"
              style={{
                left: `${Math.min(Math.max(balloon.x + swingX, 2), 88)}%`,
                top: `${balloon.y}%`,
                transform: `scale(${balloon.popped ? Math.max(0, balloon.popScale) : 1})`,
                opacity: balloon.popped ? Math.max(0, balloon.popScale) : 1,
                transition: balloon.popped ? "transform 0.2s ease-out, opacity 0.2s" : undefined,
              }}
              onClick={() => popBalloon(balloon)}
            >
              <BalloonSVG color={balloon.color} number={balloon.number} word={NUMBER_WORDS[balloon.number - 1]} size={size} />
            </div>
          );
        })}
      </div>

      {/* Clouds */}
      <div className="absolute top-28 left-2 opacity-25 pointer-events-none text-4xl">☁️</div>
      <div className="absolute top-16 right-6 opacity-20 pointer-events-none text-3xl">☁️</div>
      <div className="absolute top-48 left-1/3 opacity-15 pointer-events-none text-5xl">☁️</div>
    </div>
  );
}

// ---- BUNNY FACE ----
function BunnyFace({ mood }: { mood: BunnyMood }) {
  const earInner = mood === "sad" ? "#fce7f3" : "#fecdd3";

  const eyes =
    mood === "sad" ? (
      <><ellipse cx="20" cy="36" rx="3" ry="2" fill="#374151" transform="rotate(-20 20 36)"/><ellipse cx="40" cy="36" rx="3" ry="2" fill="#374151" transform="rotate(20 40 36)"/></>
    ) : mood === "cheer" ? (
      <><circle cx="20" cy="36" r="3.5" fill="#374151"/><circle cx="40" cy="36" r="3.5" fill="#374151"/><circle cx="21.5" cy="34.5" r="1.2" fill="white"/><circle cx="41.5" cy="34.5" r="1.2" fill="white"/></>
    ) : mood === "love" ? (
      <><text x="14" y="40" fontSize="10" fill="#f43f5e">♥</text><text x="34" y="40" fontSize="10" fill="#f43f5e">♥</text></>
    ) : (
      <><circle cx="20" cy="36" r="3" fill="#374151"/><circle cx="40" cy="36" r="3" fill="#374151"/><circle cx="21.2" cy="34.8" r="1" fill="white"/><circle cx="41.2" cy="34.8" r="1" fill="white"/></>
    );

  const mouth =
    mood === "sad"
      ? <path d="M22 52 Q30 48 38 52" stroke="#fda4af" strokeWidth="2" fill="none" strokeLinecap="round"/>
      : <path d="M22 50 Q30 56 38 50" stroke="#fda4af" strokeWidth="2" fill="none" strokeLinecap="round"/>;

  return (
    <svg width="120" height="140" viewBox="0 0 60 80" fill="none" className="mb-1">
      {/* Ears */}
      <ellipse cx="18" cy="16" rx="7" ry="14" fill="white" stroke="#d1d5db" strokeWidth="1.5"/>
      <ellipse cx="18" cy="16" rx="4" ry="10" fill={earInner}/>
      <ellipse cx="42" cy="16" rx="7" ry="14" fill="white" stroke="#d1d5db" strokeWidth="1.5"/>
      <ellipse cx="42" cy="16" rx="4" ry="10" fill={earInner}/>
      {/* Head */}
      <circle cx="30" cy="42" r="22" fill="white" stroke="#d1d5db" strokeWidth="1.5"/>
      {/* Cheeks */}
      <ellipse cx="14" cy="46" rx="6" ry="4" fill="#fda4af" opacity="0.3"/>
      <ellipse cx="46" cy="46" rx="6" ry="4" fill="#fda4af" opacity="0.3"/>
      {/* Eyes */}
      {eyes}
      {/* Nose */}
      <ellipse cx="30" cy="44" rx="3" ry="2" fill="#fda4af"/>
      {/* Mouth */}
      {mouth}
      {/* Extras */}
      {mood === "cheer" && (
        <><text x="1" y="18" fontSize="9" fill="#fbbf24">✦</text><text x="50" y="16" fontSize="9" fill="#fbbf24">✦</text></>
      )}
      {mood === "love" && (
        <><text x="0" y="20" fontSize="8" fill="#f43f5e">♥</text><text x="51" y="18" fontSize="8" fill="#f43f5e">♥</text></>
      )}
    </svg>
  );
}

// ---- BALLOON SVG ----
function BalloonSVG({ color, number, word, size }: {
  color: typeof BALLOON_COLORS[0]; number: number; word: string; size: number;
}) {
  return (
    <svg width={size} height={size * 1.4} viewBox="0 0 60 84" fill="none">
      <path d="M30 68 Q28 74 30 80 Q32 74 30 68" stroke={color.stroke} strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      <ellipse cx="30" cy="34" rx="24" ry="28" fill={color.fill} stroke={color.stroke} strokeWidth="1.5"/>
      <ellipse cx="22" cy="22" rx="7" ry="9" fill={color.shine} opacity="0.7"/>
      <ellipse cx="30" cy="62" rx="3" ry="2.5" fill={color.stroke}/>
      <text x="30" y="33" textAnchor="middle" dominantBaseline="middle" fontSize="20" fontWeight="900" fill="white" fontFamily="sans-serif">{number}</text>
      <text x="30" y="49" textAnchor="middle" dominantBaseline="middle" fontSize="7.5" fontWeight="700" fill="white" opacity="0.95" fontFamily="sans-serif">{word}</text>
    </svg>
  );
}

// ---- SCREEN ----
function Screen({ children, bg }: { children: React.ReactNode; bg: string }) {
  return (
    <div className={`h-screen overflow-hidden bg-gradient-to-b ${bg} flex flex-col items-center justify-center px-6 gap-2`}>
      {children}
    </div>
  );
}