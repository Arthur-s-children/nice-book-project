import { useEffect, useState } from 'react';

export const useTimeCounter = (target: number, durationInSeconds = 1) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let frameId: number;
    let startTime: number | null = null;

    const duration = durationInSeconds * 1000;

    const easeOutCubic = (t: number) => {
      return 1 - Math.pow(1 - t, 10);
    };

    const animate = (timestamp: number) => {
      if (!startTime) {
        startTime = timestamp;
      }

      const elapsed = timestamp - startTime;

      const progress = Math.min(elapsed / duration, 1);

      setCount(Math.round(target * easeOutCubic(progress)));

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      }
    };

    frameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [target, durationInSeconds]);

  return count;
};
