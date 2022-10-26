export const toFixed = (n: number, decimals: number) => {
  const x = Math.pow(10, decimals);

  return (Math.trunc(n * x) / x).toFixed(decimals);
};
