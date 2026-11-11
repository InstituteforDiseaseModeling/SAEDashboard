export const isNum = (v) => v !== null && v !== undefined && !isNaN(v);

export const formatValue = (v, decimalPt, locale) => {
  if (!isNum(v)) {
    return '';
  }
  const abs = Math.abs(v);
  const decimals = isNum(decimalPt) ? decimalPt :
    abs >= 1000 ? 0 : abs >= 100 ? 1 : 2;
  return v.toLocaleString(locale || undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};
