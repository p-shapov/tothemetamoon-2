import { FetchData } from 'shared/types/FetchData';

export const fetchData = <T, D = T>(value: D): FetchData<T, D> => ({
  value,
  status: 'nothing',
  error: null,
});
