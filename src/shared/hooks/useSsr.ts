import { useEffect, useState } from 'react';

export const useSsr = () => {
  const [isSsr, setIsSsr] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') setIsSsr(false);
  }, []);

  return isSsr;
};
