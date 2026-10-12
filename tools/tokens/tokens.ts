export interface Spring {
  damping: number;
  stiffness: number;
}

export interface SpringEasing {
  points: number[];
  durationMs: number;
}

const FRAME_MS = 1000 / 60;

/**
 * How close to the target a spring must stay to count as settled. Compose stops at a distance threshold in
 * the animated unit; a fraction of the whole move is the closest CSS can get, and 0.1 % keeps the final
 * jump to 1 below a pixel for moves up to 1000px.
 */
const SETTLE_THRESHOLD = 0.001;

export function parseFloatTokens(kotlin: string): Record<string, number> {
  const tokens: Record<string, number> = {};
  for (const [, name, value] of kotlin.matchAll(/val (\w+) = (-?[\d.]+)f\b/g)) {
    tokens[name] = Number(value);
  }
  return tokens;
}

export function parseCornerValues(kotlin: string): Record<string, number> {
  const corners: Record<string, number> = {};
  for (const [, name, value] of kotlin.matchAll(/val CornerValue(\w+) = CornerSize\(([\d.]+)\.dp\)/g)) {
    corners[name] = Number(value);
  }
  return corners;
}

/** Maps each role of a Compose `Color*Tokens` object to the hex colour of the `PaletteTokens` entry it names. */
export function parseColorScheme(schemeKotlin: string, paletteKotlin: string): Record<string, string> {
  const palette: Record<string, string> = {};
  for (const [, name, red, green, blue] of paletteKotlin.matchAll(
    /val (\w+) = Color\(red = (\d+), green = (\d+), blue = (\d+)\)/g
  )) {
    palette[name] = '#' + [red, green, blue].map((channel) => Number(channel).toString(16).padStart(2, '0')).join('');
  }
  const scheme: Record<string, string> = {};
  for (const [, role, paletteName] of schemeKotlin.matchAll(/val (\w+) = PaletteTokens\.(\w+)/g)) {
    const color = palette[paletteName];
    if (color === undefined) {
      throw new Error(`PaletteTokens has no ${paletteName} (needed by ${role})`);
    }
    scheme[role] = color;
  }
  return scheme;
}

/** Position of a unit-mass spring released at 0 towards 1, at `t` seconds. */
function springPosition({ damping, stiffness }: Spring, t: number): number {
  const naturalFrequency = Math.sqrt(stiffness);
  const decay = damping * naturalFrequency;
  if (damping > 1) {
    throw new Error(`Overdamped springs (damping ${damping}) are not supported; no M3 motion token uses one.`);
  }
  if (damping === 1) {
    return 1 - (1 + naturalFrequency * t) * Math.exp(-naturalFrequency * t);
  }
  const dampedFrequency = naturalFrequency * Math.sqrt(1 - damping * damping);
  return (
    1 -
    Math.exp(-decay * t) * (Math.cos(dampedFrequency * t) + (decay / dampedFrequency) * Math.sin(dampedFrequency * t))
  );
}

/** Samples a spring once per 60 Hz frame until it settles, as the stops of a CSS `linear()` easing. */
export function springEasing(spring: Spring): SpringEasing {
  let lastUnsettledMs = 0;
  for (let ms = 0; ms <= 10_000; ms++) {
    if (Math.abs(1 - springPosition(spring, ms / 1000)) >= SETTLE_THRESHOLD) {
      lastUnsettledMs = ms;
    }
  }
  const durationMs = lastUnsettledMs + 1;
  const segments = Math.ceil(durationMs / FRAME_MS);
  const points = Array.from({ length: segments + 1 }, (_, i) =>
    i === segments ? 1 : Number(springPosition(spring, (i * durationMs) / segments / 1000).toFixed(4))
  );
  return { points, durationMs };
}
