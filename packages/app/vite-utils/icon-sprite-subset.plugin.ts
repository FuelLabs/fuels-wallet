import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Plugin } from 'vite';

type IconSpriteSubsetPluginOptions = {
  outDir: string;
  spritePath?: string;
};

const STRING_LITERAL = /["'`]([A-Za-z0-9]+)["'`]/g;
const SYMBOL = /<symbol\b[^>]*\bid="([^"]+)"[^>]*>[\s\S]*?<\/symbol>/g;

// Icons are referenced as `sprite.svg#Name`, and every name the app uses is a
// string literal in the bundle. Keep only the symbols whose id appears as one.
export const iconSpriteSubsetPlugin = ({
  outDir,
  spritePath = 'icons/sprite.svg',
}: IconSpriteSubsetPluginOptions): Plugin => ({
  name: 'icon-sprite-subset',
  apply: 'build',
  writeBundle(_options, bundle) {
    const file = join(outDir, spritePath);
    if (!existsSync(file)) return;

    const literals = new Set<string>();
    for (const chunk of Object.values(bundle)) {
      if (chunk.type !== 'chunk') continue;
      for (const [, value] of chunk.code.matchAll(STRING_LITERAL)) {
        literals.add(value);
      }
    }

    const sprite = readFileSync(file, 'utf8');
    const subset = sprite.replace(SYMBOL, (symbol, id) =>
      literals.has(id) ? symbol : ''
    );
    writeFileSync(file, subset);
  },
});
