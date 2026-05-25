"use client";

import { useState, useEffect } from "react";

// ─── TYPES ────────────────────────────────────────────────────────────────────
type ObjectItem = {
  id: string;
  imgUrl: string;
  label: string;
  x: number; // Porcentaje horizontal exacto para tu nueva imagen
  y: number; // Porcentaje vertical exacto para tu nueva imagen
  size?: number; // Permite variaciones de tamaño si un objeto lo requiere
  found?: boolean;
};

type Clue =
  | { type: "count"; text: string; target: string; count: number }
  | { type: "truefalse"; text: string; answer: boolean };

type Level = {
  id: number;
  title: string;
  bgUrl: string;
  objects: ObjectItem[];
  clues: Clue[];
};

// ─── LEVELS OPTIMIZADO PARA TU NUEVA ILUSTRACIÓN (IMAGE_34544A) ────────────────
const LEVELS: Level[] = [
  {
    id: 1,
    title: "The Messy Bedroom",
    bgUrl: "/images/bg/bedroom.jpg", // Tu nueva imagen con la cama café y paredes celestes
    objects: [
      // Posiciones exactas basadas en los elementos de tu nueva imagen
      { id: "robot",   imgUrl: "/images/there/robot.png",   label: "robot",    x: 11.5, y: 44.5, size: 65 }, // Atrapado justo en la red del aro de baloncesto
      { id: "ball_bsk",imgUrl: "/images/there/ball.png",    label: "ball",     x: 13.0, y: 77.0, size: 55 }, // Pelota pequeña debajo del aro
      { id: "frog1",   imgUrl: "/images/there/frog.png",    label: "frog",     x: 20.5, y: 90.0, size: 68 }, // La ranita verde en la alfombra, abajo a la izquierda
      { id: "books",   imgUrl: "/images/there/book.png",    label: "book",     x: 32.5, y: 40.0, size: 65 }, // Los libros apoyados sobre la cabecera de la cama
      { id: "dino_bed",imgUrl: "/images/there/dinosaur.png",label: "dinosaur", x: 33.5, y: 64.0, size: 70 }, // Dinosaurio asomándose en el borde de la colcha de la cama
      { id: "cat_floor",imgUrl: "/images/there/cat.png",     label: "cat",      x: 41.5, y: 87.0, size: 68 }, // El gatito sentado en la alfombra azul central
      { id: "ghost",   imgUrl: "/images/there/ghost.png",   label: "ghost",    x: 48.0, y: 50.5, size: 60 }, // El fantasma flotando en el pie de cama de madera
      { id: "lamp",    imgUrl: "/images/there/lamp.png",    label: "lamp",     x: 41.5, y: 29.5, size: 60 }, // Lámpara de escritorio pequeña al fondo
      { id: "dino_floor",imgUrl: "/images/there/dinosaur.png",label: "dinosaur",x: 57.0, y: 83.0, size: 70 }, // El segundo dinosaurio en el piso, cerca del coche de juguete
      { id: "cat_tele", imgUrl: "/images/there/cat.png",     label: "cat",      x: 64.5, y: 39.0, size: 68 }, // El gatito subido encima del telescopio
      { id: "ball_chair",imgUrl: "/images/there/ball.png",    label: "ball",     x: 72.5, y: 87.0, size: 55 }, // Pelota pequeña descansando sobre la silla blanca
      { id: "star",    imgUrl: "/images/there/star.png",    label: "star",     x: 52.0, y: 33.5, size: 60 }, // Estrella amarilla pegada en el borde del estante alto
    ],
    clues: [
      { type: "count",     text: "There are three dinosaurs in the room.",    target: "dinosaur", count: 2 },
      { type: "count",     text: "There are two cats in the room.",           target: "cat",      count: 2 },
      { type: "truefalse", text: "There is a robot in the room.",             answer: true  },
      { type: "truefalse", text: "There are four balls in the room.",         answer: false },
      { type: "count",     text: "There are two balls in the room.",          target: "ball",     count: 2 },
      { type: "truefalse", text: "There isn't a frog in the room.",           answer: false },
    ],
  },
  {
    id: 2,
    title: "The Jungle Playroom",
    bgUrl: "/images/bg/jungle.jpg", // Tu escenario 2 de la selva
    objects: [
      { id: "monkey1", imgUrl: "/images/there/monkey.png", label: "monkey", x: 32, y: 18 },
      { id: "monkey2", imgUrl: "/images/there/monkey.png", label: "monkey", x: 74, y: 22 },
      { id: "parrot1", imgUrl: "/images/there/parrot.png", label: "parrot", x: 88, y: 15 },
      { id: "parrot2", imgUrl: "/images/there/parrot.png", label: "parrot", x: 12, y: 28 },
      { id: "snake1",  imgUrl: "/images/there/snake.png",  label: "snake",  x: 67, y: 58 },
      { id: "lion1",   imgUrl: "/images/there/lion.png",   label: "lion",   x: 21, y: 65 },
      { id: "frog1",   imgUrl: "/images/there/frog.png",   label: "frog",   x: 42, y: 92 },
      { id: "frog2",   imgUrl: "/images/there/frog.png",   label: "frog",   x: 92, y: 88 },
    ],
    clues: [
    { 
      type: "count",     
      text: "There are two monkeys in the room.",        
      target: "monkey",  
      count: 2 
    },
    { 
      type: "truefalse", 
      text: "There is a snake in the room.",             
      answer: true  
    },
    { 
      type: "count",     
      text: "There are two parrots hiding in the trees.", 
      target: "parrot",  
      count: 2 
    },
    { 
      type: "truefalse", 
      text: "There are three lions near the bushes.",      
      answer: false 
    },
    { 
      type: "count",     
      text: "There are two green frogs on the grass.",   
      target: "frog",    
      count: 2 
    },
    { 
      type: "truefalse", 
      text: "There isn't a robot in this jungle scene.",   
      answer: true 
    }
  ]
  },
];

// ─── DETECTIVE GAME MAIN COMPONENT ────────────────────────────────────────────
export default function DetectiveGame() {
  const [levelIndex, setLevelIndex] = useState(0);
  const [clueIndex, setClueIndex]   = useState(0);
  const [objects, setObjects]       = useState<ObjectItem[]>([]);
  const [clickedCount, setClickedCount] = useState(0);
  const [cluesDone, setCluesDone]   = useState<boolean[]>([]);
  const [phase, setPhase]           = useState<"playing" | "results">("playing");
  const [score, setScore]           = useState(0);
  const [shake, setShake]           = useState(false);
  const [celebration, setCelebration] = useState<string | null>(null);

  const level = LEVELS[levelIndex];
  const clue  = level.clues[clueIndex];

  useEffect(() => {
    setObjects(level.objects.map(o => ({ ...o, found: false })));
    setCluesDone(new Array(level.clues.length).fill(false));
    setClueIndex(0);
    setClickedCount(0);
    setCelebration(null);
  }, [levelIndex]);

  useEffect(() => {
    setObjects(prev => prev.map(o => ({ ...o, found: false })));
    setClickedCount(0);
    setCelebration(null);
  }, [clueIndex]);

  function handleObjectClick(obj: ObjectItem) {
    if (clue.type !== "count") return;
    if (obj.found) return;
    
    if (obj.label !== clue.target) {
      triggerShake();
      return;
    }
    
    const newCount = clickedCount + 1;
    setClickedCount(newCount);
    setObjects(prev => prev.map(o => o.id === obj.id ? { ...o, found: true } : o));

    if (newCount === clue.count) {
      markClueDone(true);
    }
  }

  function handleTrueFalse(answer: boolean) {
    if (clue.type !== "truefalse") return;
    const correct = answer === clue.answer;
    if (correct) {
      markClueDone(true);
    } else {
      triggerShake();
      setCelebration("wrong");
      setTimeout(() => setCelebration(null), 1000);
    }
  }

  function markClueDone(correct: boolean) {
    const newDone = [...cluesDone];
    newDone[clueIndex] = true;
    setCluesDone(newDone);
    if (correct) setScore(s => s + 1);
    setCelebration("correct");
    setTimeout(() => {
      setCelebration(null);
      if (clueIndex < level.clues.length - 1) {
        setClueIndex(i => i + 1);
      } else {
        setPhase("results");
      }
    }, 1200);
  }

  function triggerShake() {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  }

  const totalClues = level.clues.length;

  if (phase === "results") {
    return (
      <div style={S.wrapper}>
        <div style={S.resultsCard}>
          <h2 style={S.resultsTitle}>Case Closed!</h2>
          <p style={S.resultsSub}>Solved {score} of {totalClues} clues correctly.</p>
          <button style={S.btnPrimary} onClick={() => { setPhase("playing"); setLevelIndex(levelIndex === 0 ? 1 : 0); setScore(0); }}>
            {levelIndex === 0 ? "Next Level ➔" : "Restart Game"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={S.wrapper}>
      <style>{CSS}</style>

      {/* Header Estilizado Premium */}
      <div style={S.header}>
        <div style={S.caseBadge}>
          🔍 Case #{level.id}: {level.title}
        </div>
        <div style={S.progressRow}>
          {level.clues.map((_, i) => (
            <div key={i} style={{
              ...S.progressDot,
              background: cluesDone[i] ? "#10b981" : i === clueIndex ? "#fbbf24" : "#374151",
              transform: i === clueIndex ? "scale(1.3)" : "scale(1)",
            }} />
          ))}
        </div>
        <div style={S.scoreBadge}>⭐ {score}/{totalClues} STARS</div>
      </div>

      {/* Grid de Juego Cohesivo */}
      <div style={S.mainLayout}>
        
        {/* ESCENARIO PRINCIPAL INTERACTIVO */}
        <div style={{ ...S.gameScene, backgroundImage: `url(${level.bgUrl})` }}>
          
          {/* Mapeo de Objetos Ocultos Agrandados y Estilizados */}
          {/* Mapeo de Objetos Ocultos Agrandados y Estilizados */}
          {objects.map(obj => {
          // AJUSTE: Si "clue" no está definido (ej. en la pantalla de resultados), evitamos el error
          const isTarget = clue && clue.type === "count" && obj.label === clue.target;
          
          // CAMBIA ESTE NÚMERO: 95 o 100 píxeles hará que se vean mucho más grandes y elegantes
          const currentSize = obj.size ? obj.size * 1.4 : 95; 
          
          return (
            <button
              key={obj.id}
              onClick={() => handleObjectClick(obj)}
              className={obj.found ? "foundPulse" : isTarget ? "targetGlow" : "idleFloat"}
              style={{
                position: "absolute",
                left: `${obj.x}%`,
                top: `${obj.y}%`,
                transform: "translate(-50%, -50%)",
                background: "transparent",
                border: "none",
                width: `${currentSize}px`,
                height: `${currentSize}px`,
                // AJUSTE: Evitamos errores de lectura de "clue" en el cursor
                cursor: clue && clue.type === "count" ? "pointer" : "default",
                zIndex: 10,
                padding: 0,
                transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)"
              }}
            >
              <img 
                src={obj.imgUrl} 
                alt={obj.label} 
                style={{ 
                  width: "100%", 
                  height: "100%", 
                  objectFit: "contain",
                  opacity: obj.found ? 0.35 : 1,
                  filter: obj.found 
                    ? "none" 
                    : "drop-shadow(0px 4px 6px rgba(0,0,0,0.35)) drop-shadow(0px 0px 3px rgba(255,255,255,0.9))"
                }} 
              />
              {obj.found && <div style={S.checkBadge}>✓</div>}
            </button>
          );
        })}

          {/* Avisos de Éxito / Error */}
          {celebration === "correct" && <div style={S.overlayCorrect} className="fadeIn">EVIDENCE FOUND</div>}
          {celebration === "wrong" && <div style={S.overlayWrong} className="fadeIn">WRONG DIRECTION</div>}
        </div>

        {/* PANEL LATERAL DE PISTAS */}
        <div style={{ ...S.cluePanel, animation: shake ? "shake 0.4s ease-in-out" : "none" }}>
          <span style={S.clueIndexLabel}>EVIDENCE {clueIndex + 1} OF {totalClues}</span>
          <div style={S.clueBubble}>
            "{clue.text}"
          </div>

          {clue.type === "count" && (
            <div style={S.interactionArea}>
              <p style={S.instructionText}>Locate the matching elements hidden in the scene.</p>
              <div style={S.counterContainer}>
                {Array.from({ length: clue.count }).map((_, i) => (
                  <div key={i} style={{
                    ...S.counterBox,
                    background: i < clickedCount ? "#10b981" : "#1f2937",
                    borderColor: i < clickedCount ? "#059669" : "#4b5563",
                    color: "#ffffff"
                  }}>
                    {i < clickedCount ? "✓" : (i + 1)}
                  </div>
                ))}
              </div>
            </div>
          )}

          {clue.type === "truefalse" && (
            <div style={S.interactionArea}>
              <p style={S.instructionText}>Is this statement correct based on what you see?</p>
              <div style={S.tfButtonRow}>
                <button style={S.btnTrue} onClick={() => handleTrueFalse(true)}>True</button>
                <button style={S.btnFalse} onClick={() => handleTrueFalse(false)}>False</button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

// ─── ESTILOS DE LA INTERFAZ (CSS-IN-JS) ──────────────────────────────────────
const S: Record<string, React.CSSProperties> = {
  wrapper: {
    minHeight: "100vh",
    width: "100%",
    background: "#090d16",
    display: "flex",
    flexDirection: "column",
    padding: "20px",
    boxSizing: "border-box",
    fontFamily: "'Nunito', system-ui, sans-serif",
    color: "#ffffff"
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "18px",
    flexWrap: "wrap",
    gap: "12px"
  },
  caseBadge: {
    background: "#111827",
    border: "1px solid #1f2937",
    padding: "10px 22px",
    borderRadius: "14px",
    fontWeight: "bold",
    fontSize: "0.95rem"
  },
  progressRow: {
    display: "flex",
    gap: "8px",
    background: "#111827",
    padding: "12px 22px",
    borderRadius: "40px",
    border: "1px solid #1f2937"
  },
  progressDot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
  },
  scoreBadge: {
    background: "linear-gradient(135deg, #1e1b4b 0%, #2e2a78 100%)",
    border: "1px solid #fbbf24",
    padding: "10px 22px",
    borderRadius: "14px",
    color: "#fbbf24",
    fontWeight: "900",
    fontSize: "0.9rem"
  },
  mainLayout: {
    display: "grid",
    gridTemplateColumns: "1fr 340px",
    gap: "20px",
    flex: 1
  },
  gameScene: {
    borderRadius: "24px",
    position: "relative",
    overflow: "hidden",
    border: "3px solid #1f2937",
    boxShadow: "0 25px 50px -12px rgba(0,0,0,0.7)",
    minHeight: "560px",
    backgroundSize: "100% 100%", // Se estira de forma perfecta e idéntica a tus proporciones de captura
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat"
  },
  checkBadge: {
    position: "absolute",
    bottom: "-2px",
    right: "-2px",
    background: "#10b981",
    color: "white",
    fontSize: "11px",
    fontWeight: "bold",
    borderRadius: "50%",
    width: "20px",
    height: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 2px 6px rgba(0,0,0,0.4)"
  },
  cluePanel: {
    background: "#111827",
    borderRadius: "24px",
    padding: "26px",
    border: "1px solid #1f2937",
    display: "flex",
    flexDirection: "column",
    gap: "20px"
  },
  clueIndexLabel: {
    fontSize: "0.75rem",
    fontWeight: "900",
    color: "#6366f1",
    letterSpacing: "0.15em"
  },
  clueBubble: {
    background: "#1e1b4b",
    padding: "22px",
    borderRadius: "18px",
    fontSize: "1.2rem",
    fontWeight: "bold",
    lineHeight: "1.45",
    borderLeft: "5px solid #6366f1",
    boxShadow: "inset 0 2px 4px rgba(0,0,0,0.3)"
  },
  interactionArea: {
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },
  instructionText: {
    color: "#9ca3af",
    fontSize: "0.85rem",
    margin: 0
  },
  counterContainer: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap"
  },
  counterBox: {
    width: "38px",
    height: "38px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    border: "2px solid",
    transition: "all 0.2s ease"
  },
  tfButtonRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px"
  },
  btnTrue: {
    background: "#10b981",
    color: "white",
    border: "none",
    padding: "15px",
    borderRadius: "12px",
    fontWeight: "800",
    fontSize: "1rem",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(16,185,129,0.2)"
  },
  btnFalse: {
    background: "#ef4444",
    color: "white",
    border: "none",
    padding: "15px",
    borderRadius: "12px",
    fontWeight: "800",
    fontSize: "1rem",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(239,68,68,0.2)"
  },
  overlayCorrect: {
    position: "absolute",
    inset: 0,
    background: "rgba(16,185,129,0.15)",
    border: "5px solid #10b981",
    borderRadius: "20px",
    zIndex: 50,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontWeight: "900",
    fontSize: "2.5rem",
    letterSpacing: "0.05em",
    textShadow: "0 4px 10px rgba(0,0,0,0.6)"
  },
  overlayWrong: {
    position: "absolute",
    inset: 0,
    background: "rgba(239,68,68,0.15)",
    border: "5px solid #ef4444",
    borderRadius: "20px",
    zIndex: 50,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontWeight: "900",
    fontSize: "2.5rem",
    letterSpacing: "0.05em",
    textShadow: "0 4px 10px rgba(0,0,0,0.6)"
  },
  resultsCard: {
    margin: "auto",
    background: "#111827",
    padding: "45px",
    borderRadius: "28px",
    textAlign: "center",
    maxWidth: "400px",
    border: "1px solid #1f2937"
  },
  resultsTitle: { margin: "0 0 10px 0", fontSize: "2.2rem", fontWeight: "900" },
  resultsSub: { color: "#9ca3af", marginBottom: "24px" },
  btnPrimary: {
    background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
    color: "white",
    border: "none",
    padding: "14px 28px",
    borderRadius: "12px",
    fontWeight: "bold",
    cursor: "pointer"
  }
};

// ─── EFFECTS & HOVERS (CSS STYLESHEET) ───────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&display=swap');
  
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes shake { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-6px)} 40%,80%{transform:translateX(6px)} }
  @keyframes subtleFloat { 0%,100% { transform: translate(-50%, -52%) scale(1); } 50% { transform: translate(-50%, -48%) scale(1.03); } }
  
  .fadeIn { animation: fadeIn 0.2s ease-out forwards; }
  
  /* Animación suave para que los objetos se vean vivos y elegantes en la habitación */
  .idleFloat { animation: subtleFloat 4s ease-in-out infinite; }
  button:nth-child(even).idleFloat { animation-delay: 0.7s; animation-duration: 4.5s; }
  

  


  /* Animación sutil de brillo de objetivo */
  .targetGlow {
    animation: subtleFloat 4s ease-in-out infinite;
    filter: drop-shadow(0px 4px 6px rgba(0,0,0,0.3)) drop-shadow(0 0 8px rgba(251, 191, 36, 0.7)) !important;
  }
  

`;