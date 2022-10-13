export const trim = (str: string, takeFromStart: number, takeFromEnd: number) =>
  `${str.slice(0, takeFromStart)}…${str.slice(-takeFromEnd, -1)}`;
