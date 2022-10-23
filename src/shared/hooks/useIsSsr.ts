import { useEffect, useState } from 'react';

export const useIsSsr = () => {
  const [isSsr, setIsSsr] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') setIsSsr(false);
  }, []);

  return isSsr;
};
