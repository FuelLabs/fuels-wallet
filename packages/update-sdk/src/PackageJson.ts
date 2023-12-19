/* eslint-disable @typescript-eslint/no-explicit-any */
import { glob } from 'glob';
import { produce } from 'immer';
import { promises as fs } from 'node:fs';
import { resolve } from 'node:path';
import prettier from 'prettier';

export class PackageJson {
  static async getAllLocal() {
    return glob(['package.json', '**/package.json'], {
      cwd: resolve(process.cwd(), '../../'),
      ignore: ['**/node_modules/**'],
    });
  }

  static async updateDependency(
    pkgJSONPath: string,
    version: string,
    matcher: (dep: string) => boolean
  ) {
    const raw = await fs.readFile(pkgJSONPath, 'utf8');
    let pkgJSON = JSON.parse(raw);

    const keys = ['dependencies', 'devDependencies', 'peerDependencies'];
    for (const key of keys) {
      const obj = pkgJSON?.[key] ?? {};
      const entries = Object.entries(obj);
      const sdkDeps = entries.filter(([dep]) => matcher(dep));
      if (!sdkDeps.length) return false;
      pkgJSON = produce(pkgJSON, (draft: any) => {
        sdkDeps.forEach(([dep, _]) => {
          draft[key][dep] = version;
        });
      });
    }

    const newFile = JSON.stringify(pkgJSON, null, 2);
    const formatted = await prettier.format(newFile, {
      parser: 'json-stringify',
    });
    const buf = Buffer.from(formatted, 'utf-8');
    await fs.rm(pkgJSONPath);
    await fs.writeFile(pkgJSONPath, buf, 'utf-8');
  }
}
