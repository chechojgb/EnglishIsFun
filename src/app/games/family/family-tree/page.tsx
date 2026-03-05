"use client";
import { useState, useEffect, useRef, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

// --- DATOS ---
const LEVELS = [
  {
    level: 1,
    title: "Core Family",
    emoji: "🏠",
    vocabulary: [
      { id: 'voc-1', word: 'Father', icon: '👨‍💼' },
      { id: 'voc-2', word: 'Mother', icon: '👩‍💼' },
      { id: 'voc-3', word: 'Sister', icon: '👧' },
      { id: 'voc-4', word: 'Brother', icon: '👦' },
    ],
    slots: [
      { id: 'slot-father', accepts: 'Father', color: 'border-blue-300', bg: 'bg-blue-50', description: 'He takes you to the park! 🚗' },
      { id: 'slot-mother', accepts: 'Mother', color: 'border-pink-300', bg: 'bg-pink-50', description: 'She gives the best hugs 🤗' },
      { id: 'slot-sister', accepts: 'Sister', color: 'border-purple-300', bg: 'bg-purple-50', description: 'A girl in your family 🎀' },
      { id: 'slot-brother', accepts: 'Brother', color: 'border-orange-300', bg: 'bg-orange-50', description: 'A boy in your family ⚽' },
    ]
  },
  {
    level: 2,
    title: "Extended Family",
    emoji: "🌿",
    vocabulary: [
      { id: 'voc-5', word: 'Grandpa', icon: '👴' },
      { id: 'voc-6', word: 'Grandma', icon: '👵' },
      { id: 'voc-7', word: 'Uncle', icon: '🧔' },
      { id: 'voc-8', word: 'Aunt', icon: '👩‍🦰' },
      { id: 'voc-9', word: 'Cousin', icon: '🧒' },
      { id: 'voc-10', word: 'Baby', icon: '👶' },
    ],
    slots: [
      { id: 'slot-grandpa', accepts: 'Grandpa', color: 'border-amber-300', bg: 'bg-amber-50', description: "Dad's dad, tells old stories 📖" },
      { id: 'slot-grandma', accepts: 'Grandma', color: 'border-rose-300', bg: 'bg-rose-50', description: 'Makes yummy cookies 🍪' },
      { id: 'slot-uncle', accepts: 'Uncle', color: 'border-teal-300', bg: 'bg-teal-50', description: "Your dad's or mom's brother 🙋‍♂️" },
      { id: 'slot-aunt', accepts: 'Aunt', color: 'border-fuchsia-300', bg: 'bg-fuchsia-50', description: "Your dad's or mom's sister 💅" },
      { id: 'slot-cousin', accepts: 'Cousin', color: 'border-lime-300', bg: 'bg-lime-50', description: "Your uncle's or aunt's child 🧸" },
      { id: 'slot-baby', accepts: 'Baby', color: 'border-sky-300', bg: 'bg-sky-50', description: 'Very very small and new 🍼' },
    ]
  },
  {
    level: 3,
    title: "Big Family Tree",
    emoji: "🌳",
    vocabulary: [
      { id: 'voc-11', word: 'Husband', icon: '🤵' },
      { id: 'voc-12', word: 'Wife', icon: '👰' },
      { id: 'voc-13', word: 'Son', icon: '👱‍♂️' },
      { id: 'voc-14', word: 'Daughter', icon: '👱‍♀️' },
      { id: 'voc-15', word: 'Nephew', icon: '🧑' },
      { id: 'voc-16', word: 'Niece', icon: '👧‍🦱' },
    ],
    slots: [
      { id: 'slot-husband', accepts: 'Husband', color: 'border-indigo-300', bg: 'bg-indigo-50', description: 'A married man 💍' },
      { id: 'slot-wife', accepts: 'Wife', color: 'border-pink-300', bg: 'bg-pink-50', description: 'A married woman 💍' },
      { id: 'slot-son', accepts: 'Son', color: 'border-blue-300', bg: 'bg-blue-50', description: "A family's boy child 👦" },
      { id: 'slot-daughter', accepts: 'Daughter', color: 'border-purple-300', bg: 'bg-purple-50', description: "A family's girl child 👧" },
      { id: 'slot-nephew', accepts: 'Nephew', color: 'border-green-300', bg: 'bg-green-50', description: "Your sister's or brother's boy 🙋‍♂️" },
      { id: 'slot-niece', accepts: 'Niece', color: 'border-yellow-300', bg: 'bg-yellow-50', description: "Your sister's or brother's girl 🙋‍♀️" },
    ]
  }
];

const TOTAL_TIME = 120;

// --- BUNNY MOODS ---
const BUNNY = {
  idle:     { face: '(·ᴗ·)', ears: '(\\ /)', cheek: '' },
  happy:    { face: '(^ᴗ^)', ears: '(\\ /)', cheek: '✿' },
  love:     { face: '(♡ᴗ♡)', ears: '(\\ /)', cheek: '♡' },
  sad:      { face: '(·︵·)', ears: '(\\ /)', cheek: '' },
  cheer:    { face: '(≧▽≦)', ears: '(* *)', cheek: '★' },
  scared:   { face: '(o⊙o)', ears: '(⚆⚆)', cheek: '' },
  sleeping: { face: '(-ω-) zzz', ears: '(\\ /)', cheek: '' },
};

type BunnyMood = keyof typeof BUNNY;
type VocabItem = { id: string; word: string; icon: string };
type SlotItem = { id: string; accepts: string; color: string; bg: string; description: string; current: VocabItem | null };
type GameState = 'menu' | 'playing' | 'levelComplete' | 'gameOver' | 'victory';

export default function FamilyTreeGame() {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [vocabulary, setVocabulary] = useState<VocabItem[]>([]);
  const [slots, setSlots] = useState<Record<string, SlotItem>>({});
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [mistakes, setMistakes] = useState(0);
  const [combo, setCombo] = useState(0);
  const [bunnyMood, setBunnyMood] = useState<BunnyMood>('idle');
  const [bunnyMessage, setBunnyMessage] = useState("Let's learn family words! 🌟");
  const [wrongSlot, setWrongSlot] = useState<string | null>(null);
  const [floatingPoints, setFloatingPoints] = useState<{ id: number; text: string } | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const fpRef = useRef(0);

  const currentLevel = LEVELS[currentLevelIndex];

  const setBunny = useCallback((mood: BunnyMood, message: string, duration = 1500) => {
    setBunnyMood(mood);
    setBunnyMessage(message);
    setTimeout(() => {
      setBunnyMood('idle');
      setBunnyMessage("You can do it! Drag and drop! 🐰");
    }, duration);
  }, []);

  const initLevel = useCallback((levelIndex: number) => {
    const level = LEVELS[levelIndex];
    setVocabulary([...level.vocabulary]);
    const slotMap: Record<string, SlotItem> = {};
    level.slots.forEach(s => { slotMap[s.id] = { ...s, current: null }; });
    setSlots(slotMap);
    setWrongSlot(null);
  }, []);

  const startGame = () => {
    setScore(0);
    setTimeLeft(TOTAL_TIME);
    setMistakes(0);
    setCombo(0);
    setCurrentLevelIndex(0);
    initLevel(0);
    setBunnyMood('cheer');
    setBunnyMessage("Yay! Let's go! 🎉");
    setGameState('playing');
  };

  // Timer
  useEffect(() => {
    if (gameState !== 'playing') { if (timerRef.current) clearInterval(timerRef.current); return; }
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev === 30) { setBunny('scared', 'Only 30 seconds left! Hurry! ⏰'); }
        if (prev === 10) { setBunny('sad', 'Oh no! Almost out of time! 😱'); }
        if (prev <= 1) { clearInterval(timerRef.current!); setGameState('gameOver'); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [gameState, setBunny]);

  // Level complete check
  useEffect(() => {
    if (gameState !== 'playing') return;
    if (vocabulary.length === 0 && Object.keys(slots).length > 0) {
      setBunnyMood('love');
      setBunnyMessage('Amazing! Level complete! 🌟');
      if (currentLevelIndex < LEVELS.length - 1) {
        setTimeLeft(prev => Math.min(prev + 20, TOTAL_TIME));
        setTimeout(() => setGameState('levelComplete'), 800);
      } else {
        setTimeout(() => setGameState('victory'), 800);
      }
    }
  }, [vocabulary, slots, gameState, currentLevelIndex]);

  const nextLevel = () => {
    const next = currentLevelIndex + 1;
    setCurrentLevelIndex(next);
    initLevel(next);
    setCombo(0);
    setBunnyMood('cheer');
    setBunnyMessage(`Level ${next + 1}! You've got this! 💪`);
    setGameState('playing');
  };

  const onDragEnd = (result: DropResult) => {
    const { destination, draggableId } = result;
    if (!destination || destination.droppableId === 'vocabulary-bank') return;
    const draggedWord = vocabulary.find(item => item.id === draggableId);
    if (!draggedWord) return;
    const targetSlot = slots[destination.droppableId];
    if (!targetSlot) return;

    if (targetSlot.accepts === draggedWord.word) {
      setVocabulary(prev => prev.filter(item => item.id !== draggableId));
      setSlots(prev => ({ ...prev, [destination.droppableId]: { ...targetSlot, current: draggedWord } }));
      const newCombo = combo + 1;
      setCombo(newCombo);
      const points = newCombo >= 3 ? 200 : 100;
      setScore(prev => prev + points);
      fpRef.current += 1;
      setFloatingPoints({ id: fpRef.current, text: newCombo >= 3 ? `+${points} 🔥` : `+${points}` });
      setTimeout(() => setFloatingPoints(null), 1000);

      const happyMessages = [
        "Great job! You're so smart! 🌟",
        "Correct! I'm so proud of you! 🥕",
        "Woohoo! Keep going! 🎉",
        "Yes yes yes! That's right! 💫",
        "You're amazing! 🌈",
      ];
      setBunny(newCombo >= 3 ? 'love' : 'happy', happyMessages[Math.floor(Math.random() * happyMessages.length)]);
    } else {
      setMistakes(prev => prev + 1);
      setCombo(0);
      setWrongSlot(destination.droppableId);
      const sadMessages = [
        "Oops! Try again, you can do it! 💪",
        "Not quite! Read the clue again 🔍",
        "Almost! Don't give up! 🐰",
        "Hmm, look at the description! 👀",
      ];
      setBunny('sad', sadMessages[Math.floor(Math.random() * sadMessages.length)]);
      setTimeout(() => setWrongSlot(null), 700);
    }
  };

  const timerColor = timeLeft > 60 ? '#22c55e' : timeLeft > 30 ? '#f59e0b' : '#ef4444';
  const timerPercent = (timeLeft / TOTAL_TIME) * 100;
  const bunny = BUNNY[bunnyMood];

  // --- BUNNY WIDGET ---
  const BunnyWidget = ({ big = false }: { big?: boolean }) => {
    const bunny = BUNNY[bunnyMood];
    return (
        <div className={`flex flex-col items-center ${big ? 'gap-2' : 'gap-1'}`}>
        <div className="relative flex flex-col items-center">
            {/* Cheeks flotan arriba a los lados, no dentro del texto */}
            {bunny.cheek && (
            <div className="absolute -top-2 flex justify-between w-full px-1 text-xs pointer-events-none">
                <span>{bunny.cheek}</span>
                <span>{bunny.cheek}</span>
            </div>
            )}
            <div
            className={`font-mono leading-tight text-center select-none ${big ? 'text-2xl' : 'text-sm'}`}
            style={{ fontFamily: 'monospace',color: '#5a3e2b' }}
            >
            <div>{bunny.ears}</div>
            <div>{bunny.face}</div>
            <div>( U U )</div>
            </div>
        </div>
        <div className={`bg-white border-2 border-gray-100 rounded-2xl px-3 py-1.5 shadow-sm text-center max-w-[200px] ${big ? 'text-sm' : 'text-xs'} text-gray-600 font-semibold`}>
            {bunnyMessage}
        </div>
        </div>
    );
    };

  // --- MENU ---
  if (gameState === 'menu') return (
    <div className="min-h-screen  flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <BunnyWidget big />
        <h1 className="text-5xl font-black text-gray-800 mt-6 mb-1 tracking-tight">Family Tree</h1>
        <p className="text-gray-400 mb-6">Learn English family words! 🌳</p>
        <div className="grid grid-cols-3 gap-3 mb-8">
          {LEVELS.map((lvl, i) => (
            <div key={i} className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100">
              <div className="text-2xl mb-1">{lvl.emoji}</div>
              <p className="text-xs font-black text-gray-600">Level {i + 1}</p>
              <p className="text-xs text-gray-400">{lvl.title}</p>
              <p className="text-xs text-violet-500 font-bold mt-1">{lvl.vocabulary.length} words</p>
            </div>
          ))}
        </div>
        <button onClick={startGame} className="w-full bg-purple-500 hover:bg-purple-600 text-white text-xl font-black py-5 rounded-2xl shadow-lg transition-all hover:scale-105 active:scale-95">
          Let's Play! 🐰
        </button>
        <p className="text-xs text-gray-400 mt-3">Read the clue, then drag the right word!</p>
      </div>
    </div>
  );

  if (gameState === 'levelComplete') return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-100 to-teal-200 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl p-10 max-w-sm w-full text-center shadow-2xl">
        <BunnyWidget big />
        <h2 className="text-4xl font-black text-gray-800 mt-4 mb-1">Level {currentLevelIndex + 1} Done!</h2>
        <p className="text-gray-400 mb-4">+20 seconds bonus time! ⏰</p>
        <div className="bg-emerald-50 rounded-2xl p-4 mb-6">
          <p className="text-3xl font-black text-emerald-600">{score} pts</p>
        </div>
        <p className="text-sm text-gray-500 mb-6">Next: <strong>{LEVELS[currentLevelIndex + 1]?.title}</strong> {LEVELS[currentLevelIndex + 1]?.emoji}</p>
        <button onClick={nextLevel} className="w-full bg-purple-500 text-white font-black py-4 rounded-2xl hover:bg-purple-600 transition-all hover:scale-105">Next Level →</button>
      </div>
    </div>
  );

  if (gameState === 'gameOver') return (
    <div className="min-h-screen bg-gradient-to-br from-red-100 to-orange-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl p-10 max-w-sm w-full text-center shadow-2xl">
        <div className="font-mono text-center text-gray-500 text-xl mb-2 leading-tight">
          <div>(\\ /)</div><div>(·︵·)</div><div>( U U )</div>
        </div>
        <p className="text-sm text-gray-400 mb-2">Don't worry, try again!</p>
        <h2 className="text-4xl font-black text-gray-800 mb-4">Time's Up! ⏰</h2>
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-gray-50 rounded-xl p-3"><p className="text-2xl font-black">{score}</p><p className="text-xs text-gray-400">Score</p></div>
          <div className="bg-gray-50 rounded-xl p-3"><p className="text-2xl font-black text-red-400">{mistakes}</p><p className="text-xs text-gray-400">Mistakes</p></div>
        </div>
        <button onClick={startGame} className="w-full bg-purple-500 text-white font-black py-4 rounded-2xl hover:bg-purple-600 transition-all hover:scale-105">Try Again! 🐰</button>
        <button onClick={() => setGameState('menu')} className="w-full mt-2 text-gray-400 text-sm py-2 hover:text-gray-600">Back to Menu</button>
      </div>
    </div>
  );

  if (gameState === 'victory') {
    const stars = mistakes === 0 ? 3 : mistakes <= 3 ? 2 : 1;
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl p-10 max-w-sm w-full text-center shadow-2xl">
          <div className="font-mono text-center text-gray-500 text-xl mb-2 leading-tight">
            <div>(* *)</div><div>(♡ᴗ♡)</div><div>( U U )</div>
          </div>
          <div className="text-4xl mb-1">{'⭐'.repeat(stars)}</div>
          <h2 className="text-4xl font-black text-gray-800 mb-1">You Won! 🎉</h2>
          <p className="text-gray-400 mb-4">You learned all the family words!</p>
          <div className="grid grid-cols-3 gap-2 mb-6">
            <div className="bg-purple-50 rounded-xl p-3"><p className="text-xl font-black text-purple-600">{score}</p><p className="text-xs text-gray-400">Score</p></div>
            <div className="bg-green-50 rounded-xl p-3"><p className="text-xl font-black text-green-600">{timeLeft}s</p><p className="text-xs text-gray-400">Left</p></div>
            <div className="bg-red-50 rounded-xl p-3"><p className="text-xl font-black text-red-400">{mistakes}</p><p className="text-xs text-gray-400">Oops</p></div>
          </div>
          <button onClick={startGame} className="w-full bg-purple-500 text-white font-black py-4 rounded-2xl hover:bg-purple-600 transition-all hover:scale-105">Play Again! 🐰</button>
          <button onClick={() => setGameState('menu')} className="w-full mt-2 text-gray-400 text-sm py-2 hover:text-gray-600">Back to Menu</button>
        </div>
      </div>
    );
  }

  // --- PLAYING ---
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="relative flex flex-col gap-3 min-h-screen p-3 md:p-5 ">

        {floatingPoints && (
          <div className="pointer-events-none fixed top-20 left-1/2 -translate-x-1/2 z-50 text-xl font-black text-emerald-500 bg-white px-4 py-2 rounded-full shadow-lg animate-bounce">
            {floatingPoints.text}
          </div>
        )}

        {/* HEADER */}
        <header className="flex items-center gap-3 bg-white rounded-2xl shadow-sm border border-gray-100 p-3">
          <div className="shrink-0 text-center">
            <p className="text-[9px] font-black uppercase tracking-wider text-gray-400">Level {currentLevel.level}/3</p>
            <p className="text-xs font-black text-gray-600">{currentLevel.emoji} {currentLevel.title}</p>
          </div>
          <div className="flex-1 mx-1">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-400">⏱</span>
              <span className="font-black tabular-nums" style={{ color: timerColor }}>
                {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
              </span>
            </div>
            <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${timerPercent}%`, backgroundColor: timerColor }} />
            </div>
          </div>
          {combo >= 3 && <div className="bg-orange-100 text-orange-600 text-xs font-black px-2 py-1 rounded-full shrink-0">🔥 x{combo}</div>}
          <div className="bg-purple-500 text-white px-3 py-1.5 rounded-xl font-black tabular-nums text-sm shrink-0">{score}</div>
        </header>

        {/* MAIN */}
        <main className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-3">

          {/* SLOTS */}
          <div className="md:col-span-8 bg-white rounded-3xl shadow-md border border-gray-100 p-4 md:p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest">Read the clue, drop the word! 👇</h2>
              <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full">❌ {mistakes}</span>
            </div>
            <div className={`grid gap-3 ${currentLevel.slots.length <= 4 ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-3'}`}>
              {currentLevel.slots.map((slotDef) => {
                const slot = slots[slotDef.id];
                if (!slot) return null;
                const isWrong = wrongSlot === slotDef.id;
                return (
                  <Droppable droppableId={slot.id} key={slot.id}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`relative flex flex-col items-center justify-center min-h-[120px] rounded-2xl border-2 transition-all duration-200 p-3 text-center
                          ${slot.color} ${slot.bg}
                          ${snapshot.isDraggingOver ? 'scale-105 border-solid shadow-lg' : 'border-dashed'}
                          ${isWrong ? 'border-red-400 bg-red-50 scale-95' : ''}
                          ${slot.current ? 'border-solid' : ''}
                        `}
                      >
                        {slot.current ? (
                          <div className="flex flex-col items-center gap-1">
                            <span className="text-4xl">{slot.current.icon}</span>
                            <span className="text-sm font-black text-gray-700">{slot.current.word}</span>
                            <span className="text-xs text-emerald-500 font-bold">✓ Correct!</span>
                          </div>
                        ) : (
                          <>
                            {/* Clue description — always visible */}
                            <p className="text-xs font-semibold text-gray-600 leading-snug mb-2">{slot.description}</p>
                            <span className="text-3xl opacity-20">?</span>
                          </>
                        )}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                );
              })}
            </div>
          </div>

          {/* RIGHT COLUMN: Bunny + Word Bank */}
          <div className="md:col-span-4 flex flex-col gap-3">

            {/* BUNNY */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col items-center gap-2">
              <BunnyWidget />
            </div>

            {/* WORD BANK */}
            <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-4 flex flex-col flex-1">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest">Drag these!</h2>
                <span className="bg-purple-100 text-purple-600 text-xs font-black px-2 py-0.5 rounded-full">{vocabulary.length} left</span>
              </div>
              <Droppable droppableId="vocabulary-bank">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps} className="flex flex-col gap-2 flex-1 min-h-[120px]">
                    {vocabulary.map((item, index) => (
                      <Draggable key={item.id} draggableId={item.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`flex items-center gap-3 bg-gray-50 p-3 rounded-2xl border-2 border-transparent transition-all cursor-grab select-none
                              hover:bg-white hover:shadow-md hover:-translate-y-0.5
                              ${snapshot.isDragging ? 'bg-white shadow-2xl border-purple-200 rotate-2 scale-105 z-50 cursor-grabbing' : ''}
                            `}
                          >
                            <span className="text-2xl">{item.icon}</span>
                            <span className="text-sm font-bold text-gray-700">{item.word}</span>
                            <span className="ml-auto text-gray-300 text-xs">⠿</span>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    {vocabulary.length === 0 && (
                      <div className="flex-1 flex flex-col items-center justify-center py-4 text-center">
                        <span className="text-3xl mb-1">🎉</span>
                        <p className="font-black text-gray-600 text-sm">All done!</p>
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
              {/* Progress bar */}
              <div className="mt-3 pt-2 border-t border-gray-100">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Progress</span>
                  <span>{currentLevel.vocabulary.length - vocabulary.length}/{currentLevel.vocabulary.length}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-400 rounded-full transition-all duration-500"
                    style={{ width: `${((currentLevel.vocabulary.length - vocabulary.length) / currentLevel.vocabulary.length) * 100}%` }} />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </DragDropContext>
  );
}