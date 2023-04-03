const valueMatcher = /^([.\d]+)\s*(.*)$/;
export function toNum(v) {
  let mag = 1;
  let re = 0;
  const m = `${v}`.match(valueMatcher);
  if (!m) return re;
  re = parseFloat(m[1]) || 0;
  if (/KB/i.test(m[2])) mag = 0.0009765625;
  if (/GB/i.test(m[2])) mag = 1024;
  if (/TB/i.test(m[2])) mag = 1048576;
  if (/MHz/i.test(m[2])) mag = 0.001;
  return re * mag;
}
