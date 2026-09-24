import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  char: string;
  size: number;
  baseAlpha: number;
  pulseSpeed: number;
  pulseOffset: number;
  rotation: number;
  vRot: number;
  color: string;
}

const ARABIC_LETTERS = [
  'ر', 'و', 'ا', 'ب', 'ط', // Letters of the game "رَوابِط"
  'ض', 'ق', 'ن', 'ع', 'ل', 'م', 'س',
  'ف', 'ك', 'و', 'أ', 'ح', 'ذ', 'ص',
  'ي', 'هـ', 'ت', 'ج', 'د', 'ز', 'ش'
];

// Elegant ambient palette matching the game's logo: Royal Blue, Sky, Cyan, with Lime & Orange knot accents
const LOGO_PALETTE = [
  '2, 132, 199',   // Sky 600
  '14, 165, 233',  // Sky 500
  '56, 189, 248',  // Sky 400
  '3, 105, 161',   // Sky 700
  '132, 204, 22',  // Lime 500 (from logo knot)
  '249, 115, 22',  // Orange 500 (from logo knot)
];

export const ArabicParticleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const checkReducedMotion = () =>
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const isReducedMotion = checkReducedMotion();

    // Mouse coordinates for gentle ambient interaction
    let mouse = { x: -1000, y: -1000, radius: 100 };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
      }
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    // Calculate number of particles based on screen area (moderate density, never cluttering)
    const particleCount = Math.max(16, Math.min(36, Math.floor((width * height) / 32000)));
    const particles: Particle[] = [];

    const createParticle = (initialY?: number): Particle => {
      // Prioritize letters of "رَوابِط" with slightly higher frequency
      const isSignatureLetter = Math.random() < 0.4;
      const signatureLetters = ['ر', 'و', 'ا', 'ب', 'ط'];
      const char = isSignatureLetter
        ? signatureLetters[Math.floor(Math.random() * signatureLetters.length)]
        : ARABIC_LETTERS[Math.floor(Math.random() * ARABIC_LETTERS.length)];

      const color = LOGO_PALETTE[Math.floor(Math.random() * LOGO_PALETTE.length)];
      
      // Extremely subtle opacity range (0.04 to 0.12) so it acts as an elegant watermark background
      const baseAlpha = 0.045 + Math.random() * 0.085;
      const size = 18 + Math.random() * 26; // 18px to 44px

      return {
        x: Math.random() * width,
        y: initialY !== undefined ? initialY : Math.random() * height,
        vx: (Math.random() - 0.5) * 0.28,
        vy: -(0.18 + Math.random() * 0.32), // Slow, graceful upward float
        char,
        size,
        baseAlpha,
        pulseSpeed: 0.015 + Math.random() * 0.025,
        pulseOffset: Math.random() * Math.PI * 2,
        rotation: (Math.random() - 0.5) * 0.4,
        vRot: (Math.random() - 0.5) * 0.004,
        color,
      };
    };

    for (let i = 0; i < particleCount; i++) {
      particles.push(createParticle());
    }

    let time = 0;

    const render = () => {
      if (document.hidden) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);
      time += 0.02;

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (!isReducedMotion) {
          p.x += p.vx;
          p.y += p.vy;
          p.rotation += p.vRot;

          // Gentle mouse / touch repulsion for interactive liveliness
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouse.radius && dist > 0) {
            const force = (1 - dist / mouse.radius) * 0.8;
            p.x += (dx / dist) * force;
            p.y += (dy / dist) * force;
          }

          // Wrap horizontally
          if (p.x < -40) p.x = width + 40;
          if (p.x > width + 40) p.x = -40;

          // Wrap vertically (respawn at bottom when drifted above screen)
          if (p.y < -50) {
            p.y = height + 40;
            p.x = Math.random() * width;
          }
        }

        // Gentle breathing pulse
        const currentAlpha = Math.max(
          0.02,
          p.baseAlpha + Math.sin(time * p.pulseSpeed * 10 + p.pulseOffset) * 0.03
        );

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        ctx.font = `800 ${p.size}px 'Tajawal', 'Traditional Arabic', sans-serif`;
        ctx.fillStyle = `rgba(${p.color}, ${currentAlpha})`;
        ctx.fillText(p.char, 0, 0);

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 select-none overflow-hidden"
      style={{
        opacity: 0.9,
      }}
    />
  );
};
