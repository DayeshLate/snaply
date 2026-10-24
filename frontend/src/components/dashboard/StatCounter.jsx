import React, { useState, useEffect, useRef } from 'react';

export default function StatCounter({
  targetValue = 0,
  duration = 800,
}) {
  const [current, setCurrent] = useState(0);
  const currentRef = useRef(0);
  const elementRef = useRef(null);
  const isIntersectingRef = useRef(false);

  useEffect(() => {
    currentRef.current = current;
  }, [current]);

  const animateTo = (val) => {
    const end = Math.max(0, parseInt(val, 10) || 0);
    const start = currentRef.current;
    if (start === end) {
      setCurrent(end);
      return;
    }

    const startTime = performance.now();
    let animationFrame;

    const updateCounter = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic: 1 - pow(1 - p, 3)
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const nextVal = Math.round(start + (end - start) * easeProgress);
      setCurrent(nextVal);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(updateCounter);
      } else {
        setCurrent(end);
      }
    };

    animationFrame = requestAnimationFrame(updateCounter);
    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  };

  // IntersectionObserver to only animate when in view
  useEffect(() => {
    if (!elementRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          isIntersectingRef.current = true;
          animateTo(targetValue);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(elementRef.current);
    return () => observer.disconnect();
  }, []);

  // Whenever targetValue changes, update/animate to it
  useEffect(() => {
    if (isIntersectingRef.current || !elementRef.current) {
      animateTo(targetValue);
    }
  }, [targetValue, duration]);

  return (
    <span ref={elementRef} className="num-tabular">
      {current}
    </span>
  );
}
