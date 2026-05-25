"use client";

import { useState, useEffect, useRef } from "react";

// ─── TYPES ────────────────────────────────────────────────────────────────────
type Character = {
  id: string;
  name: string;
  image: string; // e.g. /images/castle/ghost.png
  plural: string;
};

type Door = {
  id: number;
  character: Character | null;
};

type Question = {
  text: string;
  correct: boolean;
};

type Level = {
  id: number;
  title: string;
  subtitle: string;
  peekDuration: number; // ms doors stay open
  doors: Array<{ character: Character | null }>;
  questions: Question[];
};

// ─── CHARACTERS ───────────────────────────────────────────────────────────────
const CHARACTERS: Record<string, Character> = {
  ghost:   { id: "ghost",   name: "ghost",   plural: "ghosts",   image: "/images/castle/ghost.png"   },
  knight:  { id: "knight",  name: "knight",  plural: "knights",  image: "/images/castle/knight.png"  },
  dragon:  { id: "dragon",  name: "dragon",  plural: "dragons",  image: "/images/castle/dragon.png"  },
  witch:   { id: "witch",   name: "witch",   plural: "witches",  image: "/images/castle/witch.png"   },
  wizard:  { id: "wizard",  name: "wizard",  plural: "wizards",  image: "/images/castle/wizard.png"  },
  princess:{ id: "princess",name: "princess",plural: "princesses",image: "/images/castle/princess.png"},
};

const C = CHARACTERS;

// ─── LEVELS ───────────────────────────────────────────────────────────────────
const LEVELS: Level[] = [
  {
    id: 1,
    title: "The Haunted Castle",
    subtitle: "Peek through the doors — remember what you see!",
    peekDuration: 3500,
    doors: [
      { character: C.ghost   },
      { character: C.knight  },
      { character: C.ghost   },
      { character: C.dragon  },
      { character: null      },
      { character: C.ghost   },
    ],
    questions: [
      { text: "There are three ghosts.",       correct: true  },
      { text: "There is a dragon.",            correct: true  },
      { text: "There are two knights.",        correct: false },
      { text: "There isn't a witch.",          correct: true  },
      { text: "There are ghosts and a dragon.",correct: true  },
      { text: "There isn't a knight.",         correct: false },
    ],
  },
  {
    id: 2,
    title: "The Royal Tower",
    subtitle: "The doors open for just a moment. Pay attention!",
    peekDuration: 3000,
    doors: [
      { character: C.princess },
      { character: C.wizard   },
      { character: C.knight   },
      { character: C.princess },
      { character: C.wizard   },
      { character: C.knight   },
    ],
    questions: [
      { text: "There are two princesses.",     correct: true  },
      { text: "There are three wizards.",      correct: false },
      { text: "There is a dragon.",            correct: false },
      { text: "There are two knights.",        correct: true  },
      { text: "There isn't a ghost.",          correct: true  },
      { text: "There are two wizards.",        correct: true  },
    ],
  },
  {
    id: 3,
    title: "The Dark Keep",
    subtitle: "Faster this time. Only 2.5 seconds!",
    peekDuration: 2500,
    doors: [
      { character: C.witch   },
      { character: C.dragon  },
      { character: null      },
      { character: C.witch   },
      { character: C.ghost   },
      { character: C.dragon  },
    ],
    questions: [
      { text: "There are two witches.",        correct: true  },
      { text: "There are two dragons.",        correct: true  },
      { text: "There are three ghosts.",       correct: false },
      { text: "There isn't a knight.",         correct: true  },
      { text: "There is a ghost.",             correct: true  },
      { text: "There is a wizard.",            correct: false },
    ],
  },
];

type Phase = "intro" | "peeking" | "closed" | "answering" | "results";

export default function CastleGame() {
  const [levelIndex, setLevelIndex]   = useState(0);
  const [phase, setPhase]             = useState<Phase>("intro");
  const [doorsOpen, setDoorsOpen]     = useState(false);
  const [qIndex, setQIndex]           = useState(0);
  const [score, setScore]             = useState(0);
  const [answers, setAnswers]         = useState<Array<"correct"|"wrong"|null>>([]);
  const [feedback, setFeedback]       = useState<"correct"|"wrong"|null>(null);
  const [countdown, setCountdown]     = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const level = LEVELS[levelIndex];

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  function startPeek() {
    setPhase("peeking");
    setDoorsOpen(true);
    setCountdown(Math.ceil(level.peekDuration / 1000));

    let secs = Math.ceil(level.peekDuration / 1000);
    const tick = setInterval(() => {
      secs--;
      setCountdown(secs);
      if (secs <= 0) clearInterval(tick);
    }, 1000);

    timerRef.current = setTimeout(() => {
      clearInterval(tick);
      setDoorsOpen(false);
      setPhase("closed");
      setTimeout(() => {
        setPhase("answering");
        setQIndex(0);
        setAnswers(new Array(level.questions.length).fill(null));
      }, 1200);
    }, level.peekDuration);
  }

  function handleAnswer(answer: boolean) {
    if (feedback) return;
    const correct = answer === level.questions[qIndex].correct;
    const result: "correct"|"wrong" = correct ? "correct" : "wrong";
    setFeedback(result);
    const newAnswers = [...answers];
    newAnswers[qIndex] = result;
    setAnswers(newAnswers);
    if (correct) setScore(s => s + 1);

    setTimeout(() => {
      setFeedback(null);
      if (qIndex < level.questions.length - 1) {
        setQIndex(i => i + 1);
      } else {
        setPhase("results");
      }
    }, 900);
  }

  function handleRestart() {
    setLevelIndex(0);
    resetLevel();
  }

  function handleNextLevel() {
    setLevelIndex(i => i + 1);
    resetLevel();
  }

  function resetLevel() {
    setPhase("intro");
    setDoorsOpen(false);
    setQIndex(0);
    setScore(0);
    setAnswers([]);
    setFeedback(null);
    setCountdown(0);
  }

  const totalQ = level.questions.length;
  const stars  = score / totalQ >= 0.85 ? 3 : score / totalQ >= 0.5 ? 2 : 1;

  return (
    <div style={S.page}>
      <style>{CSS}</style>

      {/* ── RESULTS PHASE ── */}
      {phase === "results" && (
        <div style={S.resultsWrap} className="fadeIn">
          <div style={S.resultsCard}>
            <img
              src="/images/castle/castle-banner.png"
              alt="castle"
              style={{ width: 140, height: 90, objectFit: "contain", marginBottom: 12 }}
              onError={e => (e.currentTarget.style.display = "none")}
            />
            <h2 style={S.resultsTitle}>Investigation Complete!</h2>
            <p style={S.resultsSub}>
              You answered <strong style={{ color: "#f9c74f" }}>{score}</strong> of{" "}
              <strong style={{ color: "#f9c74f" }}>{totalQ}</strong> correctly.
            </p>
            
            <div style={{ display: "flex", gap: 12, justifyContent: "center", margin: "20px 0 28px" }}>
              {[1,2,3].map(s => (
                <svg key={s} viewBox="0 0 32 32" width="48" height="48"
                  style={{ transition: "all 0.4s", transform: stars >= s ? "scale(1.1)" : "scale(0.9)" }}
                  fill={stars >= s ? "#f9c74f" : "none"}
                  stroke={stars >= s ? "#c97d00" : "#444"} strokeWidth="2">
                  <polygon points="16,3 20,12 30,13 23,20 25,30 16,25 7,30 9,20 2,13 12,12" />
                </svg>
              ))}
            </div>

            <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center", width: "100%" }}>
              <button style={S.btnGold} onClick={handleRestart}>Play Again</button>
              {levelIndex < LEVELS.length - 1 && (
                <button style={S.btnOutline} onClick={handleNextLevel}>Next Castle →</button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── MAIN GAMEPLAY VIEW ── */}
      {phase !== "results" && (
        <div style={S.gameContainer}>
          {/* Header row */}
          <div style={S.header}>
            <div style={S.levelPill}>
              🏰 Level {levelIndex + 1}: {level.title}
            </div>
            {phase === "answering" && (
              <div style={S.scorePill}>
                ⭐ Score: {score} / {totalQ}
              </div>
            )}
          </div>

          {/* Castle stage / arena */}
          <div style={S.stage}>
            <img
              src="/images/castle/castle-wall.png"
              alt="castle wall"
              style={S.castleWallImg}
              onError={e => (e.currentTarget.style.display = "none")}
            />
            <div style={S.castleWallFallback} />

            {/* Micro Timer Ribbon */}
            {phase === "peeking" && (
              <div style={S.countdownBadge} className="popIn">
                ⏳ {countdown}s
              </div>
            )}

            {/* Door Grid with responsive properties */}
            <div style={S.doorsGrid}>
              {level.doors.map((door, i) => (
                <Door
                  key={i}
                  index={i}
                  door={door}
                  isOpen={doorsOpen}
                  phase={phase}
                />
              ))}
            </div>

            {/* Overlay: Intro Mode */}
            {phase === "intro" && (
              <div style={S.introOverlay} className="fadeIn">
                <p style={S.introText}>{level.subtitle}</p>
                <button style={S.btnPeek} onClick={startPeek}>
                  🚪 Open the Doors!
                </button>
              </div>
            )}

            {/* Overlay: Doors Closed Mode */}
            {phase === "closed" && (
              <div style={S.closedOverlay} className="fadeIn">
                <p style={S.closedText}>The doors are shut tight...</p>
                <p style={S.closedSub}>Get ready to test your memory!</p>
              </div>
            )}
          </div>

          {/* Bottom active question panel */}
          {phase === "answering" && (
            <div style={S.questionPanel} className="slideUp">
              {/* Top Progress status dots */}
              <div style={S.qProgress}>
                {level.questions.map((_, i) => (
                  <div key={i} style={{
                    width: 12, height: 12, borderRadius: "50%",
                    background: answers[i] === "correct" ? "#22c55e"
                      : answers[i] === "wrong" ? "#ef4444"
                      : i === qIndex ? "#f9c74f" : "#2a1f4d",
                    boxShadow: i === qIndex ? "0 0 10px #f9c74f" : "none",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    transform: i === qIndex ? "scale(1.35)" : "scale(1)",
                  }} />
                ))}
              </div>

              {/* Central text block question statement */}
              <div style={{
                ...S.statementBox,
                borderColor: feedback === "correct" ? "#22c55e"
                  : feedback === "wrong" ? "#ef4444"
                  : "#4c3a85",
                background: feedback === "correct" ? "rgba(34,197,94,0.12)"
                  : feedback === "wrong" ? "rgba(239,68,68,0.12)"
                  : "#120a2a",
              }}>
                <span style={S.qLabel}>Question {qIndex + 1} of {totalQ} • Verify Statement</span>
                <p style={S.statementText}>
                  "{level.questions[qIndex].text}"
                </p>
                {feedback && (
                  <div style={{
                    ...S.feedbackBadge,
                    background: feedback === "correct" ? "#15803d" : "#b91c1c",
                  }} className="popIn">
                    {feedback === "correct" ? "🎯 Correct Window!" : "🔒 Incorrect!"}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div style={S.tfRow}>
                <button
                  style={{ ...S.btnTrue, opacity: feedback ? 0.4 : 1 }}
                  onClick={() => handleAnswer(true)}
                  disabled={!!feedback}
                  className="game-action-btn btn-success-hover"
                >
                  <img
                    src="/images/castle/checkmark.png"
                    alt=""
                    style={{ width: 28, height: 28, objectFit: "contain" }}
                    onError={e => (e.currentTarget.style.display = "none")}
                  />
                  True
                </button>
                <button
                  style={{ ...S.btnFalse, opacity: feedback ? 0.4 : 1 }}
                  onClick={() => handleAnswer(false)}
                  disabled={!!feedback}
                  className="game-action-btn btn-danger-hover"
                >
                  <img
                    src="/images/castle/crossmark.png"
                    alt=""
                    style={{ width: 28, height: 28, objectFit: "contain" }}
                    onError={e => (e.currentTarget.style.display = "none")}
                  />
                  False
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── COMPONENTE HIJO OPTIMIZADO ──────────────────────────────────────────────
function Door({ index, door, isOpen, phase }: {
  index: number;
  door: { character: Character | null };
  isOpen: boolean;
  phase: Phase;
}) {
  const delay = index * 100; // Stagger refinado y fluido

  return (
    <div style={{ perspective: 1000, width: "100%", height: "100%", position: "relative" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          transformStyle: "preserve-3d",
          transition: `transform 0.8s cubic-bezier(0.25, 1, 0.5, 1) ${delay}ms`,
          transform: isOpen ? "rotateY(-135deg)" : "rotateY(0deg)",
        }}
      >
        {/* FRONT PIECE — Closed mysterious wood door */}
        <div style={{
          ...S.doorFace,
          backfaceVisibility: "hidden",
          background: "linear-gradient(145deg, #42220f 0%, #261105 70%, #150802 100%)",
          border: "2.5px solid #6b4423",
          boxShadow: "inset -6px 0 14px rgba(0,0,0,0.6), 0 6px 15px rgba(0,0,0,0.4)",
        }}>
          <img
            src="/images/castle/door-closed.png"
            alt="door"
            style={{ width: "85%", height: "85%", objectFit: "contain", opacity: 0.85, zIndex: 1 }}
            onError={e => (e.currentTarget.style.display = "none")}
          />
          <div style={S.doorPanel} />
          <div style={S.doorKnob} />
        </div>

        {/* BACK PIECE — Vault inner room space revealing character */}
        <div style={{
          ...S.doorFace,
          backfaceVisibility: "hidden",
          transform: "rotateY(180deg)",
          background: "linear-gradient(160deg, #090414 0%, #140b2b 100%)",
          border: "2.5px solid #4a3475",
          boxShadow: "inset 0 0 25px rgba(139,92,246,0.25)",
          overflow: "hidden",
        }}>
          {door.character ? (
            <>
              <div style={{
                position: "absolute", inset: 0,
                background: "radial-gradient(circle at 50% 65%, rgba(139,92,246,0.4) 0%, transparent 75%)",
              }} />
              <img
                src={door.character.image}
                alt={door.character.name}
                style={{
                  width: "78%",
                  height: "78%",
                  objectFit: "contain",
                  position: "relative",
                  zIndex: 2,
                  filter: "drop-shadow(0 0 10px rgba(167,139,250,0.75))",
                }}
                onError={e => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
              <span style={S.charLabel}>{door.character.name}</span>
            </>
          ) : (
            <div style={S.emptyDoor}>
              <img
                src="/images/castle/empty-room.png"
                alt="empty"
                style={{ width: "65%", height: "65%", objectFit: "contain", opacity: 0.25 }}
                onError={e => (e.currentTarget.style.display = "none")}
              />
              <span style={{ color: "#443866", fontSize: "0.68rem", fontWeight: 700, marginTop: 2, letterSpacing: '0.05em' }}>EMPTY</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── ESTILOS CSS REFINADOS ───────────────────────────────────────────────────
const S: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    width: "100%",
    background: "linear-gradient(180deg, #06030c 0%, #0c061a 40%, #130929 100%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    boxSizing: "border-box",
    fontFamily: "'Cinzel', 'Palatino Linotype', serif",
    color: "#f3efff",
  },
  gameContainer: {
    width: "100%",
    maxWidth: "650px",
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  levelPill: {
    background: "linear-gradient(135deg, #1e1045, #0d0522)",
    border: "2px solid #523599",
    padding: "10px 22px",
    borderRadius: 30,
    fontSize: "0.9rem",
    fontWeight: 700,
    color: "#e2d5ff",
    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
  },
  scorePill: {
    background: "#120e05",
    border: "2px solid #b45309",
    padding: "10px 22px",
    borderRadius: 30,
    fontSize: "0.9rem",
    fontWeight: 700,
    color: "#fbbf24",
    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
  },
  stage: {
    position: "relative",
    borderRadius: 24,
    overflow: "hidden",
    border: "2.5px solid #3c2475",
    boxShadow: "0 10px 40px rgba(0,0,0,0.6), inset 0 0 30px rgba(0,0,0,0.8)",
    background: "#0a0516",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    // 1. INCREMENTAMOS EL PADDING VERTICAL: Le da más aire arriba y abajo a la rejilla
    padding: "60px 24px", 
    width: "100%",
    boxSizing: "border-box",
  },
  castleWallImg: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    opacity: 0.22,
    zIndex: 0,
  },
  castleWallFallback: {
    position: "absolute",
    inset: 0,
    background: `
      repeating-linear-gradient(0deg, transparent, transparent 38px, rgba(139,92,246,0.03) 38px, rgba(139,92,246,0.03) 40px),
      repeating-linear-gradient(90deg, transparent, transparent 38px, rgba(139,92,246,0.03) 38px, rgba(139,92,246,0.03) 40px)
    `,
    zIndex: 0,
  },
  countdownBadge: {
    position: "absolute",
    top: 14,
    right: 18,
    background: "rgba(15,7,32,0.85)",
    border: "2px solid #fbbf24",
    color: "#fbbf24",
    borderRadius: 25,
    padding: "6px 14px",
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontWeight: 800,
    fontSize: "0.95rem",
    zIndex: 10,
    boxShadow: "0 0 15px rgba(251,191,36,0.2)",
    fontFamily: "'Nunito', sans-serif",
  },
  doorsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "18px",
    width: "100%",
    position: "relative",
    zIndex: 2,
    // 2. CAMBIAMOS EL ASPECT-RATIO: De "3 / 2" (más ancho) pasamos a "3 / 3.8" o "3 / 4" (más alto)
    aspectRatio: "3 / 2.8", 
  },
  doorFace: {
    position: "absolute",
    inset: 0,
    borderRadius: 14,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  doorPanel: {
    position: "absolute",
    top: "12%",
    left: "14%",
    right: "14%",
    height: "48%",
    border: "1.5px solid rgba(255,255,255,0.06)",
    borderRadius: 8,
  },
  doorKnob: {
    position: "absolute",
    right: "18%",
    top: "52%",
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: "#b45309",
    boxShadow: "0 1px 4px rgba(0,0,0,0.6)",
  },
  charLabel: {
    position: "absolute",
    bottom: 8,
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: "0.7rem",
    color: "#cbd5e1",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    fontFamily: "'Nunito', sans-serif",
    textShadow: "0 2px 4px rgba(0,0,0,0.9)",
  },
  emptyDoor: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: "100%",
  },
  introOverlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(6,3,14,0.85)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    zIndex: 10,
    borderRadius: 22,
    backdropFilter: "blur(6px)",
  },
  introText: {
    color: "#d8caff",
    fontSize: "1.15rem",
    fontWeight: 600,
    textAlign: "center",
    maxWidth: 360,
    lineHeight: 1.6,
    margin: 0,
    fontFamily: "'Nunito', sans-serif",
  },
  btnPeek: {
    background: "linear-gradient(135deg, #6d28d9, #4338ca)",
    color: "white",
    border: "none",
    borderRadius: 30,
    padding: "14px 42px",
    fontSize: "1.1rem",
    fontWeight: 800,
    cursor: "pointer",
    boxShadow: "0 6px 20px rgba(109,40,217,0.45)",
    fontFamily: "'Nunito', sans-serif",
    transition: "all 0.2s ease-in-out",
  },
  closedOverlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(6,3,14,0.88)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    zIndex: 10,
    borderRadius: 22,
    backdropFilter: "blur(8px)",
  },
  closedText: {
    color: "#fbbf24",
    fontSize: "1.5rem",
    fontWeight: 800,
    margin: 0,
  },
  closedSub: {
    color: "#a78bfa",
    fontSize: "1rem",
    margin: 0,
    fontFamily: "'Nunito', sans-serif",
  },
  questionPanel: {
    background: "#0b0618",
    border: "2px solid #2e1a5e",
    borderRadius: 24,
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    gap: 18,
    boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
  },
  qProgress: {
    display: "flex",
    gap: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  statementBox: {
    borderRadius: 16,
    border: "2px solid",
    padding: "20px",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  qLabel: {
    color: "#a78bfa",
    fontSize: "0.75rem",
    fontWeight: 800,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    fontFamily: "'Nunito', sans-serif",
  },
  statementText: {
    color: "#ffffff",
    fontSize: "1.25rem",
    fontWeight: 700,
    margin: 0,
    lineHeight: 1.5,
    fontFamily: "'Nunito', sans-serif",
  },
  feedbackBadge: {
    alignSelf: "flex-start",
    padding: "6px 16px",
    borderRadius: 30,
    fontSize: "0.88rem",
    fontWeight: 800,
    color: "white",
    fontFamily: "'Nunito', sans-serif",
    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
  },
  tfRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 14,
  },
  btnTrue: {
    background: "linear-gradient(135deg, #064e3b, #0f766e)",
    color: "white",
    border: "2px solid #10b981",
    borderRadius: 16,
    padding: "16px",
    fontSize: "1.15rem",
    fontWeight: 800,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    fontFamily: "'Nunito', sans-serif",
  },
  btnFalse: {
    background: "linear-gradient(135deg, #4c0519, #9f1239)",
    color: "white",
    border: "2px solid #f43f5e",
    borderRadius: 16,
    padding: "16px",
    fontSize: "1.15rem",
    fontWeight: 800,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    fontFamily: "'Nunito', sans-serif",
  },
  resultsWrap: {
    width: "100%",
    maxWidth: "480px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  resultsCard: {
    background: "#0b0618",
    border: "2.5px solid #3c2475",
    borderRadius: 28,
    padding: "44px 36px",
    textAlign: "center",
    width: "100%",
    boxShadow: "0 15px 45px rgba(0,0,0,0.7)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  resultsTitle: {
    fontSize: "2.1rem",
    fontWeight: 900,
    color: "#fbbf24",
    margin: "0 0 10px",
  },
  resultsSub: {
    color: "#cbd5e1",
    fontSize: "1.1rem",
    margin: 0,
    fontFamily: "'Nunito', sans-serif",
  },
  btnGold: {
    background: "linear-gradient(135deg, #78350f, #92400e)",
    color: "#fef3c7",
    border: "2px solid #fbbf24",
    borderRadius: 30,
    padding: "14px 32px",
    fontSize: "1rem",
    fontWeight: 800,
    cursor: "pointer",
    fontFamily: "'Nunito', sans-serif",
    flex: 1,
    minWidth: "140px",
  },
  btnOutline: {
    background: "transparent",
    color: "#c084fc",
    border: "2px solid #6d28d9",
    borderRadius: 30,
    padding: "14px 32px",
    fontSize: "1rem",
    fontWeight: 800,
    cursor: "pointer",
    fontFamily: "'Nunito', sans-serif",
    flex: 1,
    minWidth: "140px",
  },
};

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700;900&family=Nunito:wght@600;700;800;900&display=swap');

  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes popIn {
    from { opacity: 0; transform: scale(0.85); }
    to   { opacity: 1; transform: scale(1);   }
  }
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0);    }
  }

  .fadeIn  { animation: fadeIn  0.35s ease-out forwards; }
  .popIn   { animation: popIn   0.4s cubic-bezier(.34,1.4,.64,1) forwards; }
  .slideUp { animation: slideUp 0.45s cubic-bezier(.21,1.02,.43,1.01) forwards; }

  /* Hovers nativos globales */
  button {
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
  }
  button:hover:not(:disabled) {
    filter: brightness(1.2) !important;
    transform: translateY(-2px);
  }
  button:active:not(:disabled) {
    transform: translateY(0px) scale(0.98);
  }
  
  .game-action-btn {
    box-shadow: 0 4px 14px rgba(0,0,0,0.4);
  }
  .btn-success-hover:hover:not(:disabled) {
    box-shadow: 0 6px 20px rgba(16,185,129,0.4) !important;
  }
  .btn-danger-hover:hover:not(:disabled) {
    box-shadow: 0 6px 20px rgba(244,63,94,0.4) !important;
  }
`;