/**
 * Tiny, dependency-free base64 decoder. React Native has no global `atob`, and we
 * avoid pulling a package just to turn a picker's base64 into bytes for a private
 * Storage upload. Pure JS, standard alphabet, tolerant of whitespace/newlines.
 */
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

const LOOKUP = (() => {
  const table = new Uint8Array(256);
  for (let i = 0; i < ALPHABET.length; i++) table[ALPHABET.charCodeAt(i)] = i;
  return table;
})();

export function base64ToBytes(base64: string): Uint8Array {
  const clean = base64.replace(/[^A-Za-z0-9+/]/g, '');
  const padding = base64.endsWith('==') ? 2 : base64.endsWith('=') ? 1 : 0;
  const byteLength = Math.floor((clean.length * 3) / 4) - padding;
  const bytes = new Uint8Array(byteLength);

  let p = 0;
  for (let i = 0; i < clean.length; i += 4) {
    const c0 = LOOKUP[clean.charCodeAt(i)];
    const c1 = LOOKUP[clean.charCodeAt(i + 1)];
    const c2 = LOOKUP[clean.charCodeAt(i + 2)];
    const c3 = LOOKUP[clean.charCodeAt(i + 3)];

    if (p < byteLength) bytes[p++] = (c0 << 2) | (c1 >> 4);
    if (p < byteLength) bytes[p++] = ((c1 & 15) << 4) | (c2 >> 2);
    if (p < byteLength) bytes[p++] = ((c2 & 3) << 6) | c3;
  }
  return bytes;
}
