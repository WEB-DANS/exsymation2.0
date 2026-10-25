// Show only the last four characters of sensitive identifiers.
function maskNid(value) {
  if (!value) return null;
  const s = String(value);
  if (s.length <= 4) return "***";
  return `***${s.slice(-4)}`;
}

export { maskNid };
