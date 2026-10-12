import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { expect, test } from '@playwright/test';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

const SNAPSHOTS = 'reference/compose/src/test/snapshots/images';

/** Share of pixels allowed to differ; covers anti-aliasing differences between layoutlib and Chromium. */
const MAX_DIFF_RATIO = 0.01;

/** Paparazzi names files `<package>_<Class>_<method>_<snapshot name>.png`; the snapshot name is the showcase route. */
const scenes = readdirSync(SNAPSHOTS)
  .filter((file) => file.endsWith('.png'))
  .map((file) => ({ file, name: file.slice(file.lastIndexOf('_') + 1, -'.png'.length) }));

for (const { file, name } of scenes) {
  test(`${name} matches Compose`, async ({ page }) => {
    // Animated scenes compare their first frame; Paparazzi renders Compose at frame time 0 too.
    await page.clock.setFixedTime(0);
    await page.goto(`/reference/${name}`);
    const actual = PNG.sync.read(await page.locator('[data-reference]').screenshot());
    const expected = PNG.sync.read(readFileSync(join(SNAPSHOTS, file)));
    expect({ width: actual.width, height: actual.height }).toEqual({ width: expected.width, height: expected.height });

    const diff = new PNG({ width: expected.width, height: expected.height });
    const differing = pixelmatch(expected.data, actual.data, diff.data, expected.width, expected.height, {
      threshold: 0.1,
    });
    mkdirSync('test-results/visual', { recursive: true });
    writeFileSync(`test-results/visual/${name}-actual.png`, PNG.sync.write(actual));
    writeFileSync(`test-results/visual/${name}-diff.png`, PNG.sync.write(diff));

    expect(differing / (expected.width * expected.height)).toBeLessThanOrEqual(MAX_DIFF_RATIO);
  });
}
