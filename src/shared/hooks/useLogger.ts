import { useEffect } from 'react';

export const useLogger = (name: string, ...args: Array<unknown>) => {
  // eslint-disable-next-line no-console
  const log = (type: 'render' | 'update' | 'destroy') => console.log(name, type, ...args);

  useEffect(() => {
    log('render');
    return () => log('destroy');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(
    () => {
      log('update');
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    args.length > 0 ? args : undefined,
  );
};
