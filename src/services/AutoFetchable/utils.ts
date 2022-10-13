import { FetchData } from './types';

export const fetchNothing = <T>(): FetchData<T> => ({
  value: null,
  status: 'nothing',
});

export const fetchLoading = <T>(value: T | null): FetchData<T> => ({
  value,
  status: 'loading',
});

export const fetchSucceed = <T>(value: T): FetchData<T> => ({
  value,
  status: 'succeed',
});

export const fetchError = <T>(error: unknown, value: T | null): FetchData<T> => {
  let _error: string;

  if (error instanceof Error) _error = error.message;
  else if (typeof error === 'string') _error = error;
  else _error = 'Unknown error';

  return {
    value,
    status: 'error',
    error: _error,
  };
};
