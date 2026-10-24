import React, { useState, useEffect, useRef } from 'react';

export default function StatCounter({
  targetValue = 0,
  duration = 900,
}) {
  const [current, setCurrent] = useState(0);
  const elementRef = useRef(null);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    if (!elementRef.current || hasAnimatedRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimatedRef.current) {
          hasAnimatedRef.current = true;
          observer.disconnect();

          const start = 0;
          const end = targetValue;
          const startTime = performance.now();

          const updateCounter = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic: 1 - pow(1 - p, 3)
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const val = Math.floor(start + (end - start) * easeProgress);
            setCurrent(val);

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              setCurrent(end);
            }
          };

          requestAnimationFrame(updateCounter);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(elementRef.current);
    return () => observer.disconnect();
  }, [targetValue, duration]);

  return (
    <span ref={elementRef} className="num-tabular">
      {current}
    </span>
  );
}

