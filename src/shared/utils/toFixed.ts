export const toFixed = (n: number, decimals = 2) => {
  const x = Math.pow(10, decimals);

  return (Math.trunc(n * x) / x).toFixed(decimals);
};
