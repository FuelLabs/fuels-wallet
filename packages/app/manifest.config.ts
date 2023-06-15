import { defineManifest } from '@crxjs/vite-plugin';

import './load.envs.js';

export default defineManifest({
  manifest_version: 3,
  name: process.env.VITE_CRX_NAME,
  version: process.env.VITE_APP_VERSION,
  description: 'The official Fuel Wallet',
  icons: {
    '16': 'icons/fuel-logo-16.png',
    '19': 'icons/fuel-logo-19.png',
    '32': 'icons/fuel-logo-32.png',
    '38': 'icons/fuel-logo-38.png',
    '36': 'icons/fuel-logo-36.png',
    '48': 'icons/fuel-logo-48.png',
    '64': 'icons/fuel-logo-64.png',
    '128': 'icons/fuel-logo-128.png',
    '512': 'icons/fuel-logo-512.png',
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
});
