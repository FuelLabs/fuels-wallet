import { defineManifest } from '@crxjs/vite-plugin';

import './load.envs.cts';

// When releasing a stable version we need to inform for the build
// to use the white logo instead of the black one
const isReleaseVersion = process.env.VITE_CRX_RELEASE === 'true';
const imageNameColor = `${isReleaseVersion ? '' : '-black'}`;
const IS_TEST = process.env.NODE_ENV === 'test';
const IS_FIREFOX = process.env.CRX_BROWSER === 'firefox';

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
  // Firefox runs the background as an event page, it has no service workers for extensions
  background: IS_FIREFOX
    ? { scripts: ['src/systems/CRX/background/index.ts'], type: 'module' }
    : { service_worker: 'src/systems/CRX/background/index.ts', type: 'module' },
  ...(IS_FIREFOX && {
    browser_specific_settings: {
      gecko: {
        id: 'wallet@fuel.network',
        // The ESR, and the first version that reads data_collection_permissions
        strict_min_version: '140.0',
        data_collection_permissions: { required: ['none'] },
      },
    },
  }),
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
