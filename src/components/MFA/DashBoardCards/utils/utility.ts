export const getPerformanceComparison = (
  currentValue: string | number,
  lastValue: string | number
) => {
  const current = Number(currentValue);
  const last = Number(lastValue);

  const diff = current - last;
  const differencePercent = (diff / Math.abs(last)) * 100;

  return Number(differencePercent.toFixed(2));
};