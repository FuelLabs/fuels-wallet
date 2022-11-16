/* eslint-disable no-console */
import { execa } from "execa";
import fs from "node:fs";
import { join } from "path";

const ROOT_PATH = process.cwd();
const DIST_FOLDER = join(ROOT_PATH, "dist");
const DOCS_BASE_URL = "/fuels-wallet";
const APP_PATH = "/app/";
const STORYBOOK_PATH = "/storybook/";
const DOWNLOAD_URL = join(APP_PATH, "/fuel-wallet.zip");

function setEnvVar(key, value) {
  process.env[key] = process.env[key] || value;
}

export function setEnv() {
  setEnvVar("BASE_URL", APP_PATH);
  setEnvVar("APP_DIST", join(DIST_FOLDER, APP_PATH));
  setEnvVar("DOCS_BASE_URL", DOCS_BASE_URL);
  setEnvVar("DOCS_DIST", join(DIST_FOLDER, process.env.DOCS_BASE_URL));
  setEnvVar("STORYBOOK_BASE_URL", STORYBOOK_PATH);
  setEnvVar("STORYBOOK_DIST", join(DIST_FOLDER, STORYBOOK_PATH));

  const { BASE_URL, STORYBOOK_BASE_URL } = process.env;
  setEnvVar("NEXT_PUBLIC_WALLET_DOWNLOAD_URL", DOWNLOAD_URL);
  setEnvVar("NEXT_PUBLIC_APP_URL", BASE_URL);
  setEnvVar("NEXT_PUBLIC_STORYBOOK_URL", STORYBOOK_BASE_URL);

  console.log("BASE_URL", process.env.BASE_URL);
  console.log("APP_DIST", process.env.APP_DIST);
  console.log("DOCS_BASE_URL", process.env.DOCS_BASE_URL);
  console.log("DOCS_DIST", process.env.DOCS_DIST);
  console.log("STORYBOOK_BASE_URL", process.env.STORYBOOK_BASE_URL);
  console.log("STORYBOOK_DIST", process.env.STORYBOOK_DIST);
  console.log("NEXT_PUBLIC_APP_URL", process.env.NEXT_PUBLIC_APP_URL);
  console.log(
    "NEXT_PUBLIC_WALLET_DOWNLOAD_URL",
    process.env.NEXT_PUBLIC_WALLET_DOWNLOAD_URL
  );
  console.log(
    "NEXT_PUBLIC_STORYBOOK_URL",
    process.env.NEXT_PUBLIC_STORYBOOK_URL
  );
}

export async function runPnpmCmd(cmds) {
  await execa("pnpm", cmds, { stdout: "inherit" });
}

export async function buildWebsite() {
  fs.rmSync(DIST_FOLDER, { recursive: true, force: true });
  await runPnpmCmd(["build:libs", "--force", "--no-cache"]);
  await Promise.all([
    runPnpmCmd(["build:docs", "--force", "--no-cache"]),
    runPnpmCmd(["build:app", "--force", "--no-cache"]),
  ]);

  const { APP_DIST } = process.env;
  fs.copyFileSync(join(APP_DIST, "404.html"), join(DIST_FOLDER, "404.html"));
  fs.copyFileSync(
    join(APP_DIST, "index.html"),
    join(DIST_FOLDER, "index.html")
  );
}
