import { buildWebsite, setEnv } from './builds/utils.mjs';

(async () => {
  setEnv();
  await buildWebsite();
})();
