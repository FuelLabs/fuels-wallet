import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Plugin } from 'vite';

type FixCRXPlugin = {
  outDir?: string;
};

export const fixCRXBuildPlugin = ({ outDir }: FixCRXPlugin) => {
  const plugin: Plugin = {
    name: 'fix-crx-plugin',
    apply: 'build',
    closeBundle: async () => {
      const manifestPath = join(__dirname, '..', outDir, '/manifest.json');
      console.log(manifestPath);
      console.log(outDir);
      const manifest = require(manifestPath);
      const webAccessibleResources = manifest.web_accessible_resources;

      const updatedWebAccessibleResources = webAccessibleResources.map(
        (resource) => {
          if (resource.use_dynamic_url) {
            return {
              ...resource,
              use_dynamic_url: false,
            };
          }
          return resource;
        }
      );
      manifest.web_accessible_resources = updatedWebAccessibleResources;
      writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
    },
  };
  return plugin;
};
