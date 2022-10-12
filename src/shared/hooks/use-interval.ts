import { useEffect, useRef } from 'react';

export const useInterval = (cb: () => void, ms: number | null) => {
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    clearInterval(intervalRef.current);

    if (ms !== null) intervalRef.current = setInterval(cb, ms || 0);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [ms]); // eslint-disable-line
};
