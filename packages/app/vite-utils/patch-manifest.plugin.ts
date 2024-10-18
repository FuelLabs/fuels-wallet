import fs from 'node:fs';
import path from 'node:path';
import type { Plugin } from 'vite';

type FixCRXPlugin = {
  outDir?: string;
};

export const patchManifestPlugin = ({ outDir }: FixCRXPlugin): Plugin => {
  return {
    name: 'patch-manifest-plugin',
    apply: 'build',
    closeBundle() {
      const manifestPath = path.resolve(outDir, 'manifest.json');
      if (!fs.existsSync(manifestPath)) {
        this.error(`Manifest file not found at ${manifestPath}`);
        return;
      }

      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

      if (manifest.web_accessible_resources) {
        manifest.web_accessible_resources =
          manifest.web_accessible_resources.map((resource) => ({
            ...resource,
            use_dynamic_url: false,
          }));
      }

      fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
      console.log('🔧 Manifest patched successfully.');
    },
  };
};
