import { ReactElement, ReactNode } from 'react';

export type SwitchProps<T> = {
  value: T;
  fallback?: ReactNode;
  cases: Array<{ guard: T; el: ReactNode }>;
};

export const Switch = <T,>({ value, cases, fallback = null }: SwitchProps<T>): ReactElement => (
  <>{cases.find(({ guard }) => guard === value)?.el || fallback}</>
);
