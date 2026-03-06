"use client";
import { useEffect, useRef, useState } from 'react';

const GREETINGS = [
  { emoji: '👋', text: "Hi! Ready to play?" },
  { emoji: '🌟', text: "You're going to do great!" },
  { emoji: '🎮', text: "Let's learn something new!" },
  { emoji: '🌈', text: "A new adventure awaits!" },
];

const GROUND_Y = 60;
const BUNNY_X = 70;

interface Obstacle { x: number; w: number; h: number; }
interface Cloud { x: number; y: number; w: number; }

export default function GamesPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<GameState | null>(null);
  const rafRef = useRef<number>(0);

  const [greetingIndex, setGreetingIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);

  // Rotate greeting every 6s
  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setGreetingIndex(i => (i + 1) % GREETINGS.length);
        setVisible(true);
      }, 400);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Init game
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const game = new GameState(canvas, ctx, (s) => setScore(s), () => setIsGameOver(true));
    gameRef.current = game;
    game.start();

    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Space') { e.preventDefault(); game.jump(); }
    };
    window.addEventListener('keydown', handleKey);

    const loop = () => {
      game.update();
      game.draw();
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('keydown', handleKey);
    };
  }, []);

  const handleClick = () => {
    if (isGameOver) {
      gameRef.current?.reset();
      setIsGameOver(false);
      setScore(0);
    } else {
      gameRef.current?.jump();
    }
  };

  const greeting = GREETINGS[greetingIndex];

  return (
    <div className="min-h-screen bg-[#fdf9f9] flex flex-col items-center justify-center px-4 md:px-8 gap-6 md:gap-10 select-none">

      {/* GREETING */}
      <div
        className="text-center flex flex-col gap-2"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(6px)',
          transition: 'opacity 0.4s ease, transform 0.4s ease'
        }}
      >
        <span className="text-5xl md:text-6xl">{greeting.emoji}</span>
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-gray-800 leading-tight max-w-sm md:max-w-lg">
          {greeting.text}
        </h1>
        <p className="text-gray-400 text-sm font-medium mt-1">
          {isGameOver ? '🐰 Tap to try again!' : 'Tap or press Space to jump!'}
        </p>
      </div>

      {/* CANVAS GAME */}
      <div
        ref={containerRef}
        className="relative w-full rounded-2xl md:rounded-3xl overflow-hidden shadow-md border border-rose-100 cursor-pointer"
        style={{ maxWidth: 800 }}
        onClick={handleClick}
      >
        <canvas
          ref={canvasRef}
          width={800}
          height={260}
          style={{ display: 'block', width: '100%', height: 'auto' }}
        />

        {/* Score */}
        <div
          className="absolute top-3 right-4 font-black text-xl tabular-nums"
          style={{ color: '#f9a8d4', fontFamily: 'monospace' }}
        >
          {String(score).padStart(3, '0')}
        </div>

        {/* Game over */}
        {isGameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center  bg-white/70 backdrop-blur-sm">
            <span className="text-5xl">😵</span>
            <p className="font-black text-gray-700 text-2xl">Game Over!</p>
            <p className="text-gray-400 text-sm font-semibold">Tap to try again</p>
          </div>
        )}
      </div>

      <p className="text-xs text-gray-300 font-semibold tracking-wide">
        Use the sidebar to pick a topic 👈
      </p>
    </div>
  );
}

// ---- GAME ENGINE ----

class GameState {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  onScore: (s: number) => void;
  onGameOver: () => void;

  bunnyY = 0;
  velY = 0;
  jumping = false;
  paused = false;

  score = 0;
  gameVel = 1;
  velScene = 350;

  obstacles: Obstacle[] = [];
  clouds: Cloud[] = [];
  groundX = 0;

  timeToObstacle = 2;
  timeToCloud = 0.8;
  lastTime = 0;
  dt = 0;
  legAngle = 0;

  constructor(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    onScore: (s: number) => void,
    onGameOver: () => void
  ) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.onScore = onScore;
    this.onGameOver = onGameOver;
  }

  start() { this.lastTime = performance.now(); }

  reset() {
    this.bunnyY = 0;
    this.velY = 0;
    this.jumping = false;
    this.paused = false;
    this.score = 0;
    this.gameVel = 1;
    this.obstacles = [];
    this.clouds = [];
    this.timeToObstacle = 2;
    this.lastTime = performance.now();
  }

  jump() {
    if (this.bunnyY === 0 && !this.paused) {
      this.velY = 700;
      this.jumping = true;
    }
  }

  update() {
    if (this.paused) return;
    const now = performance.now();
    this.dt = Math.min((now - this.lastTime) / 1000, 0.05);
    this.lastTime = now;

    const spd = this.velScene * this.gameVel;

    // Physics
    this.velY -= 2000 * this.dt;
    this.bunnyY += this.velY * this.dt;
    if (this.bunnyY <= 0) {
      this.bunnyY = 0;
      this.velY = 0;
      this.jumping = false;
    }

    if (!this.jumping) this.legAngle = Math.sin(performance.now() / 110) * 20;

    // Ground scroll
    this.groundX = (this.groundX + spd * this.dt) % this.canvas.width;

    // Obstacles
    this.timeToObstacle -= this.dt;
    if (this.timeToObstacle <= 0) {
      this.obstacles.push({
        x: this.canvas.width + 10,
        w: 28 + Math.random() * 22,
        h: 42 + Math.random() * 30,
      });
      this.timeToObstacle = (0.9 + Math.random() * 1.3) / this.gameVel;
    }
    this.obstacles = this.obstacles.filter(o => {
      o.x -= spd * this.dt;
      if (o.x < -o.w) {
        this.score++;
        this.onScore(this.score);
        this.speedUp();
        return false;
      }
      return true;
    });

    // Clouds
    this.timeToCloud -= this.dt;
    if (this.timeToCloud <= 0) {
      this.clouds.push({
        x: this.canvas.width + 10,
        y: 20 + Math.random() * 70,
        w: 50 + Math.random() * 60,
      });
      this.timeToCloud = 1.2 + Math.random() * 2.5;
    }
    this.clouds = this.clouds.filter(c => {
      c.x -= spd * 0.25 * this.dt;
      return c.x > -c.w;
    });

    // Collision
    for (const o of this.obstacles) {
      if (this.checkCollision(o)) {
        this.paused = true;
        this.onGameOver();
        return;
      }
    }
  }

  speedUp() {
    if (this.score === 5) this.gameVel = 1.4;
    else if (this.score === 12) this.gameVel = 1.8;
    else if (this.score === 22) this.gameVel = 2.3;
  }

  checkCollision(o: Obstacle): boolean {
    const H = this.canvas.height;
    const groundLine = H - GROUND_Y;

    const bunnyLeft = BUNNY_X - 8;
    const bunnyRight = BUNNY_X + 28;
    const bunnyBottom = groundLine - this.bunnyY;
    const bunnyTop = bunnyBottom - 50;

    const obsLeft = o.x;
    const obsRight = o.x + o.w;
    const obsTop = groundLine - o.h;
    const obsBottom = groundLine;

    const pad = 7;
    return !(
      bunnyRight - pad < obsLeft + pad ||
      bunnyLeft + pad > obsRight - pad ||
      bunnyBottom - pad < obsTop + pad ||
      bunnyTop + pad > obsBottom
    );
  }

  draw() {
    const { ctx, canvas } = this;
    const W = canvas.width;
    const H = canvas.height;
    const groundLine = H - GROUND_Y;

    // Sky gradient
    const sky = ctx.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, '#fce7f3');
    sky.addColorStop(1, '#fff9f9');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, H);

    // Clouds
    for (const c of this.clouds) this.drawCloud(c.x, c.y, c.w);

    // Ground line
    ctx.strokeStyle = '#f3c6d8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, groundLine);
    ctx.lineTo(W, groundLine);
    ctx.stroke();

    // Ground texture dots
    ctx.fillStyle = '#f3c6d8';
    for (let i = 0; i < 18; i++) {
      const dx = ((i * 58) - this.groundX % 58 + W) % W;
      ctx.beginPath();
      ctx.arc(dx, groundLine + 8, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Obstacles
    for (const o of this.obstacles) {
      this.drawBush(o.x, groundLine - o.h, o.w, o.h);
    }

    // Bunny
    this.drawBunny(BUNNY_X, groundLine - this.bunnyY);
  }

  drawCloud(x: number, y: number, w: number) {
    const ctx = this.ctx;
    const h = w * 0.42;
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.strokeStyle = '#fbcfe8';
    ctx.lineWidth = 1;

    const e = (cx: number, cy: number, rx: number, ry: number) => {
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    };
    e(x + w * 0.5,  y + h * 0.72, w * 0.45, h * 0.38);
    e(x + w * 0.28, y + h * 0.52, w * 0.22, h * 0.36);
    e(x + w * 0.7,  y + h * 0.52, w * 0.2,  h * 0.32);
    e(x + w * 0.5,  y + h * 0.38, w * 0.18, h * 0.3);
  }

  drawBush(x: number, y: number, w: number, h: number) {
    const ctx = this.ctx;
    const e = (cx: number, cy: number, rx: number, ry: number, fill: string, stroke: string) => {
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
      ctx.fillStyle = fill; ctx.fill();
      ctx.strokeStyle = stroke; ctx.lineWidth = 1.5; ctx.stroke();
    };
    e(x + w * 0.5,  y + h * 0.9,  w * 0.48, h * 0.18, '#bbf7d0', '#86efac');
    e(x + w * 0.22, y + h * 0.65, w * 0.26, h * 0.4,  '#bbf7d0', '#86efac');
    e(x + w * 0.75, y + h * 0.68, w * 0.22, h * 0.36, '#bbf7d0', '#86efac');
    e(x + w * 0.5,  y + h * 0.44, w * 0.3,  h * 0.5,  '#86efac', '#4ade80');
    // highlight
    ctx.beginPath();
    ctx.ellipse(x + w * 0.4, y + h * 0.3, w * 0.1, h * 0.12, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    ctx.fill();
  }

  drawBunny(x: number, bottomY: number) {
    const ctx = this.ctx;
    const jumping = this.jumping;

    // Shadow
    ctx.beginPath();
    ctx.ellipse(x + 4, bottomY + 3, jumping ? 10 : 22, jumping ? 2.5 : 5, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0,0,0,0.07)';
    ctx.fill();

    const bodyY  = bottomY - 20;
    const headX  = x + 24;
    const headY  = bodyY - 16;

    // Tail
    ctx.beginPath();
    ctx.arc(x - 9, bodyY - 2, 7, 0, Math.PI * 2);
    ctx.fillStyle = 'white'; ctx.fill();
    ctx.strokeStyle = '#d1d5db'; ctx.lineWidth = 1.5; ctx.stroke();

    // Body
    ctx.beginPath();
    ctx.ellipse(x + 6, bodyY, 22, 15, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'white'; ctx.fill();
    ctx.strokeStyle = '#d1d5db'; ctx.lineWidth = 1.5; ctx.stroke();

    // Back leg
    ctx.save();
    ctx.translate(x - 4, bodyY + 10);
    ctx.rotate(jumping ? -0.55 : (this.legAngle * Math.PI / 180));
    ctx.beginPath(); ctx.ellipse(0, 0, 10, 6, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'white'; ctx.fill();
    ctx.strokeStyle = '#d1d5db'; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.restore();

    // Front leg
    ctx.save();
    ctx.translate(x + 18, bodyY + 11);
    ctx.rotate(jumping ? 0.45 : -(this.legAngle * Math.PI / 180));
    ctx.beginPath(); ctx.ellipse(0, 0, 9, 6, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'white'; ctx.fill();
    ctx.strokeStyle = '#d1d5db'; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.restore();

    // Head
    ctx.beginPath();
    ctx.arc(headX, headY, 14, 0, Math.PI * 2);
    ctx.fillStyle = 'white'; ctx.fill();
    ctx.strokeStyle = '#d1d5db'; ctx.lineWidth = 1.5; ctx.stroke();

    // Ear right (front)
    const earLean = jumping ? 0.18 : 0;
    ctx.save();
    ctx.translate(headX + 5, headY - 12);
    ctx.rotate(earLean);
    ctx.beginPath(); ctx.ellipse(0, -9, 4, 10, 0.12, 0, Math.PI * 2);
    ctx.fillStyle = 'white'; ctx.fill();
    ctx.strokeStyle = '#d1d5db'; ctx.stroke();
    ctx.beginPath(); ctx.ellipse(0, -9, 2, 6.5, 0.12, 0, Math.PI * 2);
    ctx.fillStyle = '#fecdd3'; ctx.fill();
    ctx.restore();

    // Ear left (back)
    ctx.save();
    ctx.translate(headX - 5, headY - 12);
    ctx.rotate(-earLean - 0.12);
    ctx.beginPath(); ctx.ellipse(0, -9, 4, 10, -0.12, 0, Math.PI * 2);
    ctx.fillStyle = '#f3f4f6'; ctx.fill();
    ctx.strokeStyle = '#d1d5db'; ctx.stroke();
    ctx.beginPath(); ctx.ellipse(0, -9, 2, 6.5, -0.12, 0, Math.PI * 2);
    ctx.fillStyle = '#fce7f3'; ctx.fill();
    ctx.restore();

    // Eye
    ctx.beginPath();
    ctx.arc(headX + 7, headY - 2, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#1f2937'; ctx.fill();
    // shine
    ctx.beginPath();
    ctx.arc(headX + 8.5, headY - 3.5, 1.2, 0, Math.PI * 2);
    ctx.fillStyle = 'white'; ctx.fill();

    // Nose
    ctx.beginPath();
    ctx.ellipse(headX + 13, headY + 4, 3, 2, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#fda4af'; ctx.fill();

    // Mouth
    ctx.beginPath();
    ctx.strokeStyle = '#fda4af';
    ctx.lineWidth = 1.2;
    ctx.moveTo(headX + 11, headY + 6);
    ctx.quadraticCurveTo(headX + 13, headY + 9, headX + 15, headY + 6);
    ctx.stroke();

    // Cheek
    ctx.beginPath();
    ctx.ellipse(headX + 9, headY + 6, 5, 3, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(253,164,175,0.25)';
    ctx.fill();
  }
}