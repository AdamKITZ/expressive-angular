/** A CSS `<time>` in milliseconds. Minifiers rewrite `360ms` to `.36s`, so both units turn up at runtime. */
export function durationMs(value: string): number {
  return value.trim().endsWith('ms') ? parseFloat(value) : parseFloat(value) * 1000;
}
