const DAY_COLORS = ['#e3f2fd', '#fce4ec', '#e8f5e9', '#fff3e0', '#f3e5f5', '#f9fbe7', '#ede7f6'];

export const getDayColor = (idx: number) => DAY_COLORS[idx % DAY_COLORS.length];

export const darkenColor = (hex: string, factor: number) => {
  if (!hex.startsWith('#')) return hex;
  const h = hex.replace('#', '');
  const r = Math.round(parseInt(h.substring(0, 2), 16) * factor);
  const g = Math.round(parseInt(h.substring(2, 4), 16) * factor);
  const b = Math.round(parseInt(h.substring(4, 6), 16) * factor);
  return `rgb(${r}, ${g}, ${b})`;
};
