import { defineManifest } from '@crxjs/vite-plugin';

import './load.envs.cts';

// When releasing a stable version we need to inform for the build
// to use the white logo instead of the black one
const isReleaseVersion = process.env.VITE_CRX_RELEASE === 'true';
const imageNameColor = `${isReleaseVersion ? '' : '-black'}`;
const IS_TEST = process.env.NODE_ENV === 'test';

export default defineManifest({
  manifest_version: 3,
  name: process.env.VITE_CRX_NAME,
  version: process.env.VITE_APP_VERSION,
  description: 'The official Fuel Wallet',
  icons: {
    '16': `icons/fuel-logo${imageNameColor}-16.png`,
    '19': `icons/fuel-logo${imageNameColor}-19.png`,
    '32': `icons/fuel-logo${imageNameColor}-32.png`,
    '38': `icons/fuel-logo${imageNameColor}-38.png`,
    '36': `icons/fuel-logo${imageNameColor}-36.png`,
    '48': `icons/fuel-logo${imageNameColor}-48.png`,
    '64': `icons/fuel-logo${imageNameColor}-64.png`,
    '128': `icons/fuel-logo${imageNameColor}-128.png`,
    '256': `icons/fuel-logo${imageNameColor}-256.png`,
    '512': `icons/fuel-logo${imageNameColor}-512.png`,
  },
  action: {
    default_title: 'Fuel Wallet',
    default_popup: 'popup.html',
  },
  background: {
    service_worker: 'src/systems/CRX/background/index.ts',
    type: 'module',
  },
  content_scripts: [
    {
      matches: ['<all_urls>'],
      js: ['src/systems/CRX/scripts/contentScript.ts'],
      run_at: 'document_start',
      all_frames: true,
    },
  ],
  host_permissions: ['<all_urls>'],
  permissions: ['storage', 'alarms', 'tabs', 'clipboardWrite', 'scripting'],
  content_security_policy: {
    extension_pages: "script-src 'self' 'wasm-unsafe-eval'; object-src 'self'",
  },
  // this is needed to work in e2e tests
  ...(IS_TEST
    ? {
        web_accessible_resources: [
          {
            extension_ids: ['*'],
            resources: ['*'],
            matches: ['<all_urls>'],
          },
        ],
      }
    : {}),
});
