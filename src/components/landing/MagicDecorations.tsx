"use client";
import { useEffect } from 'react';
import { animate, svg, stagger } from 'animejs';

export default function MagicDecorations() {
  useEffect(() => {
    // Animación de dibujado de líneas SVG
    animate(svg.createDrawable('.magic-path'), {
      draw: ['0 0', '0 1'], // Define cuánto de la línea es visible
      easing: 'easeInOutQuad',
      duration: 1500,
      delay: stagger(200),
      loop: false
    });
  }, []);

  return (
    <>
      {/* Arco superior izquierdo */}
      <svg className="absolute -top-12 -left-12 w-40 h-40 text-orange-400 opacity-40 pointer-events-none" viewBox="0 0 100 100">
        <path 
          className="magic-path" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          d="M10,80 Q30,20 90,40" 
          strokeLinecap="round" 
        />
      </svg>

      {/* Círculo punteado inferior derecho */}
      <svg className="absolute -bottom-16 -right-16 w-48 h-48 text-pink-400 opacity-40 pointer-events-none" viewBox="0 0 100 100">
        <circle 
          className="magic-path" 
          cx="50" 
          cy="50" 
          r="40" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="1.5" 
          strokeDasharray="4 4" 
        />
      </svg>

      {/* Estrella pequeña extra */}
      <svg className="absolute top-1/4 -right-8 w-12 h-12 text-yellow-400 opacity-60" viewBox="0 0 24 24">
        <path 
          className="magic-path" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" 
        />
      </svg>
    </>
  );
}