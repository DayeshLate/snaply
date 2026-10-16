import React, { useEffect, useRef } from 'react';

export default function AntigravityDotsBackground({ className = '' }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const animationFrameRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000, isActive: false });
  const isVisibleRef = useRef(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    const resizeObserver = new ResizeObserver(handleResize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // Optimized particle count: lightweight and ultra-smooth on all devices
    const isMobile = width < 768;
    const particleCount = isMobile ? 16 : Math.min(Math.max(Math.floor((width * height) / 40000), 22), 36);

    // Palette of luminous antigravity colors
    const colors = [
      { r: 56, g: 189, b: 248 },  // Electric Cyan (#38BDF8)
      { r: 96, g: 165, b: 250 },  // Sky Blue (#60A5FA)
      { r: 147, g: 197, b: 253 }, // Soft Ice Blue (#93C5FD)
      { r: 255, g: 255, b: 255 }, // Crisp Star White
      { r: 129, g: 140, b: 248 }, // Indigo Light (#818CF8)
    ];

    const particles = Array.from({ length: particleCount }, () => {
      const color = colors[Math.floor(Math.random() * colors.length)];
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.8 + 1.0,
        baseAlpha: Math.random() * 0.4 + 0.3,
        alpha: Math.random() * 0.4 + 0.3,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        pulsePhase: Math.random() * Math.PI * 2,
        vy: -(Math.random() * 0.4 + 0.2),
        vx: (Math.random() - 0.5) * 0.2,
        wobbleSpeed: Math.random() * 0.02 + 0.01,
        wobbleAmp: Math.random() * 0.4 + 0.2,
        color,
        hasGlow: Math.random() > 0.75,
      };
    });

    // Mouse movement interaction with passive listeners
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        isActive: true,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current.isActive = false;
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
    };

    const containerEl = containerRef.current;
    if (containerEl) {
      containerEl.addEventListener('mousemove', handleMouseMove, { passive: true });
      containerEl.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    }

    // Scroll performance detection: skip line computations while user is scrolling
    let isScrolling = false;
    let scrollTimeout = null;
    const handleScrollActivity = () => {
      isScrolling = true;
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        isScrolling = false;
      }, 100);
    };
    window.addEventListener('scroll', handleScrollActivity, { passive: true });

    // Visibility observer to pause when off-screen
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      isVisibleRef.current = entry.isIntersecting;
    });
    if (containerEl) {
      intersectionObserver.observe(containerEl);
    }

    let time = 0;
    let frameCount = 0;

    const render = () => {
      if (!isVisibleRef.current) {
        animationFrameRef.current = requestAnimationFrame(render);
        return;
      }

      frameCount++;
      // During active scrolling, render every 2nd frame to leave 100% GPU/CPU bandwidth for fluent scroll
      if (isScrolling && frameCount % 2 !== 0) {
        animationFrameRef.current = requestAnimationFrame(render);
        return;
      }

      time += 0.02;
      ctx.clearRect(0, 0, width, height);

      const mouse = mouseRef.current;

      // 1. Draw subtle proximity connecting lines (batched in single draw call, skip during rapid scroll)
      if (!isScrolling && !isMobile) {
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(96, 165, 250, 0.12)';
        ctx.lineWidth = 0.6;
        const maxDist = 75;
        const maxDistSq = maxDist * maxDist;

        for (let i = 0; i < particles.length; i++) {
          const pi = particles[i];
          for (let j = i + 1; j < particles.length; j++) {
            const pj = particles[j];
            const dx = pi.x - pj.x;
            const dy = pi.y - pj.y;
            const distSq = dx * dx + dy * dy;
            if (distSq < maxDistSq) {
              ctx.moveTo(pi.x, pi.y);
              ctx.lineTo(pj.x, pj.y);
            }
          }
        }
        ctx.stroke();
      }

      // 2. Update and draw antigravity particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Antigravity upward drift
        p.y += p.vy;
        p.x += p.vx + Math.sin(time * p.wobbleSpeed + p.pulsePhase) * p.wobbleAmp * 0.4;

        // Interactive mouse deflection (Zero-G repulsion)
        if (mouse.isActive) {
          const mdx = p.x - mouse.x;
          const mdy = p.y - mouse.y;
          const mDistSq = mdx * mdx + mdy * mdy;
          const maxRepelDist = 90;
          if (mDistSq < maxRepelDist * maxRepelDist) {
            const mDist = Math.sqrt(mDistSq);
            const force = (1 - mDist / maxRepelDist) * 1.5;
            const angle = Math.atan2(mdy, mdx);
            p.x += Math.cos(angle) * force;
            p.y += Math.sin(angle) * force;
          }
        }

        // Wrap around when particle floats off top
        if (p.y < -15) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -15) p.x = width + 10;
        if (p.x > width + 15) p.x = -10;

        // Opacity breathing / shimmer
        p.alpha = p.baseAlpha + Math.sin(time + p.pulsePhase) * 0.18;
        p.alpha = Math.max(0.15, Math.min(0.9, p.alpha));

        const { r, g, b } = p.color;

        // Draw soft outer halo for larger particles
        if (p.hasGlow && !isScrolling) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 2.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.alpha * 0.18})`;
          ctx.fill();
        }

        // Draw core particle dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.alpha})`;
        ctx.fill();
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener('scroll', handleScrollActivity);
      if (scrollTimeout) clearTimeout(scrollTimeout);
      if (containerEl) {
        containerEl.removeEventListener('mousemove', handleMouseMove);
        containerEl.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{ transform: 'translateZ(0)', willChange: 'transform' }}
      />
    </div>
  );
}

