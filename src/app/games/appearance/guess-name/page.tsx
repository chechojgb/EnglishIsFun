"use client";

import { useState, useEffect, useCallback } from "react";
import styles from "./AppearanceGame.module.css";

type Level = {
  part: string;
  imagePath: string;
  question: string;
  correct: string;
  options: string[];
};

const LEVELS: Level[] = [
  {
    part: "Body Parts",
    imagePath: "/images/game/hand.png",
    question: "What body part is this?",
    correct: "hand",
    options: ["hand", "hair", "eyes", "arm"],
  },
  {
    part: "Body Parts",
    imagePath: "/images/game/eyes.png",
    question: "What body part is this?",
    correct: "eyes",
    options: ["eyes", "ears", "nose", "mouth"],
  },
  {
    part: "Body Parts",
    imagePath: "/images/game/nose.png",
    question: "What body part is this?",
    correct: "nose",
    options: ["nose", "chin", "cheek", "forehead"],
  },
  {
    part: "Body Parts",
    imagePath: "/images/game/ears.png",
    question: "What body part is this?",
    correct: "ears",
    options: ["ears", "eyes", "nose", "lips"],
  },
  {
    part: "Body Parts",
    imagePath: "/images/game/mouth.png",
    question: "What body part is this?",
    correct: "mouth",
    options: ["mouth", "nose", "chin", "cheek"],
  },
  {
    part: "Body Parts",
    imagePath: "/images/game/hair.png",
    question: "What body part is this?",
    correct: "hair",
    options: ["hair", "head", "face", "neck"],
  },
  {
    part: "Body Parts",
    imagePath: "/images/game/body.png",
    question: "What body part is this?",
    correct: "body",
    options: ["body", "legs", "arms", "back"],
  },
];

type OptionState = "idle" | "correct" | "wrong";
type GamePhase = "playing" | "results";

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function Flower({ style }: { style: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 60 60" style={{ position: "absolute", opacity: 0.18, ...style }} width="60" height="60">
      {[0,60,120,180,240,300].map((angle, i) => (
        <ellipse
          key={i}
          cx={30 + 12 * Math.cos((angle * Math.PI) / 180)}
          cy={30 + 12 * Math.sin((angle * Math.PI) / 180)}
          rx="8" ry="5"
          fill="#e75480"
          transform={`rotate(${angle}, ${30 + 12 * Math.cos((angle * Math.PI) / 180)}, ${30 + 12 * Math.sin((angle * Math.PI) / 180)})`}
        />
      ))}
      <circle cx="30" cy="30" r="8" fill="#ffb3c6" />
    </svg>
  );
}

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 32 32" width="44" height="44" fill={filled ? "#e75480" : "none"} stroke={filled ? "#c0365a" : "#f4a0bb"} strokeWidth={1.5}>
      <polygon points="16,3 20,12 30,13 23,20 25,30 16,25 7,30 9,20 2,13 12,12" />
    </svg>
  );
}

function ConfettiPiece({ index }: { index: number }) {
  const colors = ["#e75480","#ffb3c6","#ff85a1","#c0365a","#ffd6e0","#ff4d79","#fff0f3"];
  const left = ((index * 37 + 13) % 100).toFixed(1);
  const delay = ((index * 0.07) % 0.8).toFixed(2);
  return (
    <div style={{
      position:"absolute", top:"-10px", left:`${left}%`,
      width:"10px", height:"10px", borderRadius:"2px",
      background: colors[index % colors.length],
      animationDelay:`${delay}s`,
      animation:"confettiFall 1.5s ease-in forwards",
    }} />
  );
}

export default function AppearanceGame() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [phase, setPhase] = useState<GamePhase>("playing");
  const [answered, setAnswered] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
  const [animKey, setAnimKey] = useState(0);

  const level = LEVELS[currentIndex];

  const reshuffleOptions = useCallback(() => {
    setShuffledOptions(shuffle(level.options));
  }, [level]);

  useEffect(() => {
    reshuffleOptions();
    setAnswered(false);
    setSelected(null);
    setAnimKey((k) => k + 1);
  }, [currentIndex, reshuffleOptions]);

  function handleChoose(option: string) {
    if (answered) return;
    setAnswered(true);
    setSelected(option);
    if (option === level.correct) setScore((s) => s + 1);
  }

  function handleNext() {
    if (currentIndex < LEVELS.length - 1) setCurrentIndex((i) => i + 1);
    else setPhase("results");
  }

  function handleRestart() {
    setCurrentIndex(0);
    setScore(0);
    setPhase("playing");
  }

  function getOptionState(option: string): OptionState {
    if (!answered) return "idle";
    if (option === level.correct) return "correct";
    if (option === selected) return "wrong";
    return "idle";
  }

  const stars = score / LEVELS.length >= 0.85 ? 3 : score / LEVELS.length >= 0.57 ? 2 : 1;
  const resultMessage = stars === 3 ? "Excellent! You're a star! 🌸" : stars === 2 ? "Good job! Keep practicing! 🌷" : "Keep going, you can do it! 🌺";

  const flowerPositions = [
    { top:"2%", left:"1%", width:80, height:80 },
    { top:"5%", right:"2%", width:60, height:60 },
    { bottom:"3%", left:"3%", width:70, height:70 },
    { bottom:"5%", right:"1%", width:90, height:90 },
    { top:"40%", left:"0.5%", width:50, height:50 },
    { top:"30%", right:"0.5%", width:55, height:55 },
  ];

  const baseWrapperStyle: React.CSSProperties = {
    minHeight: "100vh",
    width: "100%",
    background: "linear-gradient(135deg, #fff0f5 0%, #ffe4ee 40%, #ffd6e8 100%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
    boxSizing: "border-box",
    position: "relative",
    overflow: "hidden",
    fontFamily: "'Nunito', 'Quicksand', sans-serif",
  };

  if (phase === "results") {
    return (
      <div style={baseWrapperStyle}>
        {flowerPositions.map((pos, i) => <Flower key={i} style={pos} />)}
        <style>{`
          @keyframes confettiFall { to { transform: translateY(100vh) rotate(720deg); opacity:0; } }
          @keyframes popIn { from { transform: scale(0.7); opacity:0; } to { transform: scale(1); opacity:1; } }
        `}</style>
        <div style={{
          background:"white", borderRadius:"32px",
          padding:"48px 56px", textAlign:"center",
          boxShadow:"0 8px 40px rgba(231,84,128,0.18)",
          border:"2px solid #ffb3c6",
          animation:"popIn 0.5s cubic-bezier(.34,1.56,.64,1) forwards",
          position:"relative", overflow:"hidden", maxWidth:480, width:"100%",
        }}>
          <div style={{ position:"absolute", top:0, left:0, width:"100%", height:"100%", pointerEvents:"none" }}>
            {Array.from({ length: 20 }).map((_, i) => <ConfettiPiece key={i} index={i} />)}
          </div>
          <div style={{ fontSize:"56px", marginBottom:"12px" }}>🌸</div>
          <h2 style={{ color:"#c0365a", fontSize:"2rem", fontWeight:800, marginBottom:"8px" }}>{resultMessage}</h2>
          <p style={{ color:"#888", fontSize:"1.15rem", marginBottom:"24px" }}>
            You got <strong style={{ color:"#e75480" }}>{score}</strong> out of <strong style={{ color:"#e75480" }}>{LEVELS.length}</strong> correct.
          </p>
          <div style={{ display:"flex", justifyContent:"center", gap:"8px", marginBottom:"28px" }}>
            {[1,2,3].map((s) => <StarIcon key={s} filled={stars >= s} />)}
          </div>
          <button onClick={handleRestart} style={{
            background:"linear-gradient(135deg, #e75480, #ff85a1)",
            color:"white", border:"none", borderRadius:"50px",
            padding:"14px 40px", fontSize:"1.1rem", fontWeight:700,
            cursor:"pointer", boxShadow:"0 4px 16px rgba(231,84,128,0.35)",
            transition:"transform 0.1s",
          }}>
            🌺 Play again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={baseWrapperStyle}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@600;700;800;900&display=swap');
        @keyframes popIn { from { transform: scale(0.85) translateY(20px); opacity:0; } to { transform: scale(1) translateY(0); opacity:1; } }
        @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.04)} }
        .opt-btn:hover:not(:disabled) { transform: translateY(-2px) scale(1.02); box-shadow: 0 6px 20px rgba(231,84,128,0.25) !important; }
        .opt-btn:disabled { cursor: default; }
      `}</style>

      {flowerPositions.map((pos, i) => <Flower key={i} style={pos} />)}

      {/* Top bar */}
      <div style={{
        width:"100%", maxWidth:"900px",
        display:"flex", alignItems:"center", justifyContent:"space-between",
        marginBottom:"20px",
      }}>
        <div style={{ display:"flex", gap:"8px" }}>
          {LEVELS.map((_, i) => (
            <div key={i} style={{
              width: i === currentIndex ? "28px" : "12px",
              height:"12px", borderRadius:"6px",
              background: i < currentIndex ? "#e75480" : i === currentIndex ? "#c0365a" : "#ffb3c6",
              transition:"all 0.3s",
            }} />
          ))}
        </div>
        <div style={{
          background:"white", borderRadius:"50px",
          padding:"6px 20px", fontSize:"0.95rem", fontWeight:700,
          color:"#c0365a", boxShadow:"0 2px 10px rgba(231,84,128,0.15)",
          border:"1.5px solid #ffb3c6",
        }}>
          🌸 Score: {score} / {LEVELS.length}
        </div>
      </div>

      {/* Main card */}
      <div key={animKey} style={{
        width:"100%", maxWidth:"900px",
        background:"white", borderRadius:"28px",
        boxShadow:"0 8px 40px rgba(231,84,128,0.15)",
        border:"2px solid #ffd6e8",
        display:"grid", gridTemplateColumns:"1fr 1fr",
        minHeight:"420px",
        animation:"popIn 0.45s cubic-bezier(.34,1.56,.64,1) forwards",
        overflow:"hidden",
      }}>
        {/* Left: image */}
        <div style={{
          background:"linear-gradient(135deg, #fff0f5, #ffd6e8)",
          display:"flex", flexDirection:"column",
          alignItems:"center", justifyContent:"center",
          padding:"40px", borderRight:"2px solid #ffd6e8",
          minHeight:"380px",
        }}>
          <div style={{
            width:"220px", height:"220px", borderRadius:"24px",
            background:"white", display:"flex", alignItems:"center", justifyContent:"center",
            boxShadow:"0 4px 24px rgba(231,84,128,0.12)",
            border:"2px dashed #ffb3c6", overflow:"hidden",
            position:"relative",
          }}>
            {/* Fallback visible por defecto, se oculta si la imagen carga */}
            <div id={`fallback-${currentIndex}`} style={{
              position:"absolute", inset:0,
              display:"flex", flexDirection:"column",
              alignItems:"center", justifyContent:"center",
              color:"#ffb3c6", fontSize:"3.5rem",
              background:"white",
              zIndex:1,
            }}>
              🌸
              <span style={{ fontSize:"0.75rem", color:"#e75480", marginTop:"8px", fontWeight:600 }}>
                {level.imagePath}
              </span>
            </div>

            <img
              src={level.imagePath}
              alt={level.part}
              style={{ width:"100%", height:"100%", objectFit:"cover", borderRadius:"22px", position:"relative", zIndex:2 }}
              onLoad={(e) => {
                const fallback = document.getElementById(`fallback-${currentIndex}`);
                if (fallback) fallback.style.display = "none";
              }}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
          <p style={{ marginTop:"16px", color:"#e75480", fontWeight:700, fontSize:"1rem", letterSpacing:"0.05em" }}>
            👆 What is this?
          </p>
        </div>

        {/* Right: question + options */}
        <div style={{
          display:"flex", flexDirection:"column",
          justifyContent:"space-between",
          padding:"36px 40px",
        }}>
          <div>
            <span style={{
              background:"linear-gradient(135deg,#e75480,#ff85a1)",
              color:"white", borderRadius:"50px",
              padding:"4px 16px", fontSize:"0.78rem", fontWeight:800,
              letterSpacing:"0.08em", textTransform:"uppercase",
            }}>
              Level {currentIndex + 1} of {LEVELS.length}
            </span>
            <h3 style={{
              color:"#c0365a", fontSize:"1.6rem", fontWeight:900,
              margin:"16px 0 24px", lineHeight:1.2,
            }}>
              {level.question}
            </h3>
          </div>

          {/* Options 2x2 grid */}
          <div style={{
            display:"grid", gridTemplateColumns:"1fr 1fr",
            gap:"12px", flex:1,
          }}>
            {shuffledOptions.map((option) => {
              const state = getOptionState(option);
              return (
                <button
                  key={option}
                  className="opt-btn"
                  onClick={() => handleChoose(option)}
                  disabled={answered}
                  style={{
                    padding:"18px 12px",
                    border: state === "correct"
                      ? "2.5px solid #1D9E75"
                      : state === "wrong"
                      ? "2.5px solid #e05050"
                      : "2.5px solid #ffd6e8",
                    borderRadius:"16px",
                    background: state === "correct"
                      ? "#e8faf3"
                      : state === "wrong"
                      ? "#fde8e8"
                      : "white",
                    color: state === "correct"
                      ? "#1D9E75"
                      : state === "wrong"
                      ? "#e05050"
                      : "#c0365a",
                    fontSize:"1.15rem", fontWeight:800,
                    cursor: answered ? "default" : "pointer",
                    transition:"all 0.18s",
                    boxShadow: state === "idle" ? "0 2px 10px rgba(231,84,128,0.08)" : "none",
                    textTransform:"capitalize",
                    animation: state === "correct" ? "pulse 0.4s ease" : "none",
                  }}
                >
                  {state === "correct" ? "✅ " : state === "wrong" ? "❌ " : ""}
                  {option}
                </button>
              );
            })}
          </div>

          {/* Feedback */}
          <div style={{ marginTop:"20px", minHeight:"60px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            {answered && (
              <span style={{
                fontWeight:700, fontSize:"1rem",
                color: selected === level.correct ? "#1D9E75" : "#e05050",
              }}>
                {selected === level.correct
                  ? "🌸 Great job! That's correct!"
                  : `💔 It's "${level.correct}"!`}
              </span>
            )}
            {answered && (
              <button onClick={handleNext} style={{
                background:"linear-gradient(135deg,#e75480,#ff85a1)",
                color:"white", border:"none", borderRadius:"50px",
                padding:"12px 28px", fontSize:"1rem", fontWeight:800,
                cursor:"pointer", boxShadow:"0 4px 14px rgba(231,84,128,0.3)",
                marginLeft:"auto",
              }}>
                {currentIndex < LEVELS.length - 1 ? "Next →" : "Results 🌟"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}