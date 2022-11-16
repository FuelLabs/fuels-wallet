import { join } from "path";

import { setEnv, runPnpmCmd, buildWebsite } from "./builds/utils.mjs";

process.env.DOCS_BASE_URL = "/fuels-wallet";

async function main() {
  const { DOCS_BASE_URL } = process.env;
  const DIST_FOLDER = join(process.cwd(), "dist");
  await buildWebsite();
  await runPnpmCmd(["http-server", DIST_FOLDER, "-o", DOCS_BASE_URL, "-c-1"]);
}

setEnv();
main();
