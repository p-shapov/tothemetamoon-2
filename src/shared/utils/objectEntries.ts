import { Entries } from 'shared/types/entries';

export const objectEntries = <T extends object>(obj: T): Entries<T> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return Object.entries(obj) as any;
};
