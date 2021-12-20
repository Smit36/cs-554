import { useState, useEffect, useMemo } from 'react';

export function useTaskTime({ start, end }) {
  const total = useMemo(() => end - start, [start, end]);
  const [currentTime, setCurrentTime] = useState(new Date().getTime());
  useEffect(() => {
    const now = new Date().getTime();
    setCurrentTime(now);
    if (start >= end || now >= end) {
      return;
    }

    const interval = setInterval(() => {
      const then = new Date().getTime();
      setCurrentTime(then);
    }, [1000]);

    return () => {
      clearInterval(interval);
    };
  }, [start, end]);

  const timeLeft = Math.max(end - currentTime, 0);

  const progress = total
    ? Math.max(Math.ceil(100 - (timeLeft * 100) / total), 0)
    : 0;

  return { timeLeft, progress };
}

export const getTimeLeftDisplay = (timeLeft) =>
  timeLeft > 3600000
    ? `> ${Math.floor(timeLeft / 3600000)} hour${
        Math.floor(timeLeft / 3600000) === 1 ? '' : 's'
      }`
    : `${Math.floor(timeLeft / 60000)
        .toString()
        .padStart(2, '0')} : ${Math.floor((timeLeft / 1000) % 60)
        .toString()
        .padStart(2, '0')}`;
