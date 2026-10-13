export const getPerformanceComparison = (
  currentValue: string | number,
  lastValue: string | number
): number => {
  const current = Number(currentValue) || 0;
  const last = Number(lastValue) || 0;

  if (last === 0) {
    if (current === 0) return 0;
    return current > 0 ? 100 : -100;
  }

  const diff = current - last;
  const differencePercent = (diff / Math.abs(last)) * 100;

  if (!Number.isFinite(differencePercent)) {
    return 0;
  }

  return Number(differencePercent.toFixed(2));
};