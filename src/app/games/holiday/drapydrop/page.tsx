"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { Clover } from "lucide-react";

interface Pair {
  id: string;
  img: string;
  word: string;
}

interface DropZoneState {
  [pairId: string]: string | null;
}

const PAIRS: Pair[] = [
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

export default function MatchGame() {
  const [wordBank, setWordBank] = useState<string[]>(() => shuffle(PAIRS.map((p) => p.word)));
  const [dropped, setDropped]   = useState<DropZoneState>({});
  const [checked, setChecked]   = useState(false);

  // ── Drag state ─────────────────────────────────────
  const [dragWord, setDragWord] = useState<string | null>(null);
  const [dragFrom, setDragFrom] = useState<string | null>(null);
  const [overZone, setOverZone] = useState<string | null>(null);
  const dragRef                 = useRef<string | null>(null);

  // ── Click-to-select state ──────────────────────────
  const [selected, setSelected] = useState<string | null>(null);       // word being held
  const [selectedFrom, setSelectedFrom] = useState<string | null>(null); // "bank" | pairId

  // ── Touch state ────────────────────────────────────
  const touchWordRef = useRef<string | null>(null);
  const touchFromRef = useRef<string | null>(null);
  const ghostRef     = useRef<HTMLDivElement | null>(null);
  const didDragRef   = useRef(false); // distinguish tap vs drag on touch

  const totalDropped = Object.values(dropped).filter(Boolean).length;
  const allPlaced    = totalDropped === PAIRS.length;
  const correctCount = checked ? PAIRS.filter((p) => dropped[p.id] === p.word).length : 0;

  // ── Helpers ────────────────────────────────────────
  const placeWord = useCallback(
    (word: string, from: string | null, targetZone: string) => {
      setDropped((prev) => {
        const existing = prev[targetZone];
        const next = { ...prev, [targetZone]: word };
        // displaced word goes back to bank
        if (existing && existing !== word) {
          setWordBank((wb) => [...wb.filter((w) => w !== word), existing]);
        } else {
          setWordBank((wb) => wb.filter((w) => w !== word));
        }
        // clear origin zone if came from another zone
        if (from && from !== "bank" && from !== targetZone) {
          next[from] = null;
        }
        return next;
      });
    },
    []
  );

  const returnToBank = useCallback((word: string, from: string | null) => {
    if (from && from !== "bank") {
      setDropped((prev) => ({ ...prev, [from]: null }));
      setWordBank((wb) => [...wb, word]);
    }
  }, []);

  const reset = useCallback(() => {
    setWordBank(shuffle(PAIRS.map((p) => p.word)));
    setDropped({});
    setChecked(false);
    setDragWord(null);
    setDragFrom(null);
    setOverZone(null);
    setSelected(null);
    setSelectedFrom(null);
  }, []);

  // ── Click-to-select logic ──────────────────────────
  const handleClickWord = (word: string, from: string) => {
    if (checked) return;
    if (selected === word && selectedFrom === from) {
      // deselect
      setSelected(null);
      setSelectedFrom(null);
    } else {
      setSelected(word);
      setSelectedFrom(from);
    }
  };

  const handleClickZone = (pairId: string) => {
    if (checked) return;
    if (selected) {
      // place selected word into this zone
      placeWord(selected, selectedFrom, pairId);
      setSelected(null);
      setSelectedFrom(null);
    } else if (dropped[pairId]) {
      // pick up the word already in this zone
      setSelected(dropped[pairId]);
      setSelectedFrom(pairId);
    }
  };

  // ── Mouse drag handlers ────────────────────────────
  const onDragStartWord = (word: string, from: string) => {
    // clear click-selection when starting a drag
    setSelected(null);
    setSelectedFrom(null);
    setDragWord(word);
    setDragFrom(from);
    dragRef.current = word;
  };

  const onDropZone = (pairId: string) => {
    if (!dragRef.current) return;
    placeWord(dragRef.current, dragFrom, pairId);
    setDragWord(null);
    setDragFrom(null);
    setOverZone(null);
    dragRef.current = null;
  };

  const onDropBank = () => {
    if (!dragRef.current || dragFrom === "bank") {
      setDragWord(null);
      setDragFrom(null);
      setOverZone(null);
      dragRef.current = null;
      return;
    }
    returnToBank(dragRef.current, dragFrom);
    setDragWord(null);
    setDragFrom(null);
    setOverZone(null);
    dragRef.current = null;
  };

  // ── Touch handlers ─────────────────────────────────
  const createGhost = (word: string, x: number, y: number) => {
    const el = document.createElement("div");
    el.innerText = word;
    el.style.cssText = `
      position:fixed;z-index:9999;pointer-events:none;
      background:#4caf72;color:white;font-weight:800;
      padding:6px 14px;border-radius:99px;font-size:0.85rem;
      font-family:'Nunito',sans-serif;
      transform:translate(-50%,-50%);
      left:${x}px;top:${y}px;
      box-shadow:0 4px 12px rgba(0,0,0,0.2);
    `;
    document.body.appendChild(el);
    ghostRef.current = el as unknown as HTMLDivElement;
  };

  const moveGhost = (x: number, y: number) => {
    if (ghostRef.current) {
      ghostRef.current.style.left = `${x}px`;
      ghostRef.current.style.top  = `${y}px`;
    }
  };

  const removeGhost = () => {
    if (ghostRef.current) {
      document.body.removeChild(ghostRef.current);
      ghostRef.current = null;
    }
  };

  const onTouchStart = (word: string, from: string, e: React.TouchEvent) => {
    e.preventDefault();
    didDragRef.current = false;
    touchWordRef.current = word;
    touchFromRef.current = from;
    const t = e.touches[0];
    createGhost(word, t.clientX, t.clientY);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    didDragRef.current = true;
    const t = e.touches[0];
    moveGhost(t.clientX, t.clientY);
    const el = document.elementFromPoint(t.clientX, t.clientY);
    const zone = el?.closest("[data-dropzone]")?.getAttribute("data-dropzone");
    setOverZone(zone ?? null);
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    const t = e.changedTouches[0];
    removeGhost();

    const word = touchWordRef.current;
    const from = touchFromRef.current;
    if (!word) return;

    if (!didDragRef.current) {
      // It was a tap — use click-to-select logic
      handleClickWord(word, from!);
      touchWordRef.current = null;
      touchFromRef.current = null;
      setOverZone(null);
      return;
    }

    // It was a real drag
    const el = document.elementFromPoint(t.clientX, t.clientY);
    const zone = el?.closest("[data-dropzone]")?.getAttribute("data-dropzone");

    if (zone && zone !== "bank") {
      dragRef.current = word;
      setDragFrom(from);
      onDropZone(zone);
    } else if (from && from !== "bank") {
      returnToBank(word, from);
    }

    touchWordRef.current = null;
    touchFromRef.current = null;
    setOverZone(null);
  };

  const zoneColor = (pairId: string) => {
    if (!checked || !dropped[pairId]) return null;
    return dropped[pairId] === PAIRS.find((p) => p.id === pairId)?.word ? "correct" : "wrong";
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800&family=Nunito:wght@700;800&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes popIn  { 0%{transform:scale(0.85);opacity:0} 70%{transform:scale(1.06)} 100%{transform:scale(1);opacity:1} }
        @keyframes selectedPulse { 0%,100%{box-shadow:0 0 0 3px #4caf72} 50%{box-shadow:0 0 0 6px #a8e6bc} }
        .fade-up        { animation: fadeUp 0.4s ease forwards; }
        .pop-in         { animation: popIn  0.3s ease forwards; }
        .selected-pulse { animation: selectedPulse 1s ease infinite; }
        [draggable=true]        { cursor: grab; }
        [draggable=true]:active { cursor: grabbing; }
      `}</style>

      <div
        className="min-h-screen flex flex-col items-center gap-6 px-4 py-8"
        style={{ background: "#f0faf3", fontFamily: "'Nunito', sans-serif" }}
      >
        {/* Title */}
        <div className="text-center">
          <h1
            className="flex items-center justify-center gap-2 text-4xl sm:text-5xl font-extrabold leading-tight"
            style={{ fontFamily: "'Baloo 2', cursive", color: "#2d7a4f" }}
          >
            <Clover className="w-9 h-9" /> Match It!
          </h1>
          <p className="mt-1 font-bold text-sm" style={{ color: "#5a9e76" }}>
            Drag or tap a word, then tap a picture!
          </p>
        </div>

        {/* Progress pill */}
        <div
          className="flex items-center gap-2 px-4 py-1.5 rounded-full font-extrabold text-sm"
          style={{ background: "#d6f0e0", color: "#2d7a4f" }}
        >
          <Clover className="w-4 h-4" /> {totalDropped} / {PAIRS.length} placed
        </div>

        {/* Selected word indicator */}
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-full font-extrabold text-sm transition-all duration-300"
          style={{
            background: selected ? "#4caf72" : "#e2f5e9",
            color: selected ? "#fff" : "#8fcfa5",
            border: selected ? "2px solid #3d9460" : "2px dashed #8fcfa5",
            minWidth: 160,
            justifyContent: "center",
          }}
        >
          {selected ? (
            <>✋ &nbsp;"{selected}" selected — tap a picture!</>
          ) : (
            <>tap or drag a word</>
          )}
        </div>

        {/* Word bank */}
        <div
          data-dropzone="bank"
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDropBank}
          className="flex flex-wrap justify-center gap-2 w-full max-w-lg min-h-[48px] rounded-2xl p-3 transition-colors"
          style={{
            background: overZone === "bank" ? "#c8ead5" : "#e2f5e9",
            border: "2px dashed #8fcfa5",
          }}
        >
          {wordBank.length === 0 && (
            <span className="text-sm font-bold" style={{ color: "#8fcfa5" }}>
              All words placed!
            </span>
          )}
          {wordBank.map((word) => {
            const isSelected = selected === word && selectedFrom === "bank";
            return (
              <div
                key={word}
                draggable
                onDragStart={() => onDragStartWord(word, "bank")}
                onDragEnd={() => { setDragWord(null); setDragFrom(null); }}
                onTouchStart={(e) => onTouchStart(word, "bank", e)}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
                onClick={() => handleClickWord(word, "bank")}
                className={`pop-in px-4 py-1.5 rounded-full font-extrabold text-sm select-none transition-all active:scale-95 ${isSelected ? "selected-pulse" : ""}`}
                style={{
                  background: isSelected ? "#2d7a4f" : "#4caf72",
                  color: "#fff",
                  boxShadow: isSelected
                    ? "0 0 0 3px #a8e6bc"
                    : "0 2px 6px rgba(76,175,114,0.35)",
                  opacity: dragWord === word && dragFrom === "bank" ? 0.35 : 1,
                  transform: isSelected ? "scale(1.08)" : "scale(1)",
                  cursor: "pointer",
                }}
              >
                {isSelected ? "✋ " : ""}{word}
              </div>
            );
          })}
        </div>

        {/* Image grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-2xl">
          {PAIRS.map((pair) => {
            const result      = zoneColor(pair.id);
            const placedWord  = dropped[pair.id];
            const isZoneReady = !!selected && !checked; // highlight zones when a word is selected

            return (
              <div key={pair.id} className="flex flex-col items-center gap-2">
                {/* Image card */}
                <div
                  className="w-full aspect-square rounded-2xl overflow-hidden relative"
                  style={{
                    background: "#fff",
                    border: "2.5px solid #b6dfc4",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
                  }}
                >
                  <Image
                    src={pair.img}
                    alt={pair.word}
                    fill
                    className="object-contain p-2"
                    sizes="120px"
                  />
                </div>

                {/* Drop zone */}
                <div
                  data-dropzone={pair.id}
                  onDragOver={(e) => { e.preventDefault(); setOverZone(pair.id); }}
                  onDragLeave={() => setOverZone(null)}
                  onDrop={() => onDropZone(pair.id)}
                  onClick={() => handleClickZone(pair.id)}
                  className="w-full min-h-[38px] rounded-xl flex items-center justify-center transition-all"
                  style={{
                    background:
                      result === "correct"  ? "#d6f5e0" :
                      result === "wrong"    ? "#fde8e8" :
                      overZone === pair.id  ? "#c8ead5" :
                      isZoneReady && !placedWord ? "#ddf5e8" :
                      placedWord            ? "#e2f5e9" :
                                              "#fff",
                    border: `2px ${placedWord || overZone === pair.id ? "solid" : "dashed"} ${
                      result === "correct"  ? "#4caf72" :
                      result === "wrong"    ? "#e57373" :
                      overZone === pair.id  ? "#4caf72" :
                      isZoneReady && !placedWord ? "#4caf72" :
                      placedWord            ? "#8fcfa5" :
                                              "#b6dfc4"
                    }`,
                    cursor: isZoneReady || placedWord ? "pointer" : "default",
                    transform: isZoneReady && !placedWord ? "scale(1.03)" : "scale(1)",
                  }}
                >
                  {placedWord ? (
                    <div
                      draggable={!checked}
                      onDragStart={() => !checked && onDragStartWord(placedWord, pair.id)}
                      onDragEnd={() => { setDragWord(null); setDragFrom(null); }}
                      onTouchStart={(e) => !checked && onTouchStart(placedWord, pair.id, e)}
                      onTouchMove={onTouchMove}
                      onTouchEnd={onTouchEnd}
                      onClick={(e) => { e.stopPropagation(); !checked && handleClickWord(placedWord, pair.id); }}
                      className={`px-3 py-1 rounded-lg font-extrabold text-xs flex items-center gap-1 select-none ${
                        selected === placedWord && selectedFrom === pair.id ? "selected-pulse" : ""
                      }`}
                      style={{
                        background:
                          result === "correct" ? "#4caf72" :
                          result === "wrong"   ? "#e57373" :
                          selected === placedWord && selectedFrom === pair.id ? "#2d7a4f" :
                          "#4caf72",
                        color: "#fff",
                        cursor: checked ? "default" : "pointer",
                      }}
                    >
                      {result === "correct" && <span>✓</span>}
                      {result === "wrong"   && <span>✗</span>}
                      {placedWord}
                    </div>
                  ) : (
                    <span
                      className="text-xs font-bold transition-all"
                      style={{ color: isZoneReady ? "#4caf72" : "#b6dfc4" }}
                    >
                      {isZoneReady ? "tap here!" : "drop here"}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Check / Result */}
        {!checked ? (
          <button
            onClick={() => allPlaced && setChecked(true)}
            className="px-8 py-3 rounded-full font-extrabold text-base border-0 transition-all"
            style={{
              background: allPlaced ? "#4caf72" : "#b6dfc4",
              color: "#fff",
              cursor: allPlaced ? "pointer" : "not-allowed",
              fontFamily: "'Nunito', sans-serif",
              boxShadow: allPlaced ? "0 4px 14px rgba(76,175,114,0.4)" : "none",
            }}
          >
            Check Answers ✅
          </button>
        ) : (
          <div className="fade-up flex flex-col items-center gap-3 text-center">
            <div
              className="px-6 py-4 rounded-2xl font-extrabold text-lg"
              style={{
                background: correctCount === PAIRS.length ? "#d6f5e0" : "#fff",
                border: `2.5px solid ${correctCount === PAIRS.length ? "#4caf72" : "#b6dfc4"}`,
                color: "#2d7a4f",
              }}
            >
              {correctCount === PAIRS.length
                ? "🎉 Perfect! All correct!"
                : `🍀 ${correctCount} / ${PAIRS.length} correct — try again!`}
            </div>
            <button
              onClick={reset}
              className="px-6 py-2.5 rounded-full font-extrabold text-sm border-0 cursor-pointer"
              style={{
                background: "#4caf72",
                color: "#fff",
                fontFamily: "'Nunito', sans-serif",
              }}
            >
              Play Again 🔄
            </button>
          </div>
        )}
      </div>
    </>
  );
}