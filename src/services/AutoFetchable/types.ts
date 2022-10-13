export type FetchData<T> = {
  status: 'succeed' | 'nothing' | 'loading' | 'error';
  value: T | null;
  error?: string;
};
