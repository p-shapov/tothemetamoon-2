import { useEffect, useRef } from 'react';

export const useTimeout = (cb: () => void, ms: number | null) => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    clearTimeout(timeoutRef.current);

    if (ms !== null) timeoutRef.current = setTimeout(cb, ms || 0);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [ms]); // eslint-disable-line
};
