const valueMatcher = /^([.\d]+)\s*(.*)$/;
const kb = /KB/i;
const gb = /GB/i;
const tb = /TB/i;
const mhz = /MHz/i;
export function toNum(v) {
  let mag = 1;
  let re = 0;
  const m = `${v}`.match(valueMatcher);
  if (!m) return re;
  re = parseFloat(m[1]) || 0;
  if (kb.test(m[2])) mag = 0.0009765625;
  if (gb.test(m[2])) mag = 1024;
  if (tb.test(m[2])) mag = 1048576;
  if (mhz.test(m[2])) mag = 0.001;
  return re * mag;
}