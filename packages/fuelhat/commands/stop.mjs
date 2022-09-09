/* eslint-disable no-console */
import c from "chalk";
import { spawn } from "child_process";
import path from "path";
import Spinnies from "spinnies";
import { fileURLToPath } from "url";

import { createEnv } from "../utils/createEnv.mjs";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const resolve = (str) => path.resolve(dirname, str);
const spinnies = new Spinnies({ succeedPrefix: "⚡️ " });

export const handler = async (argv) => {
  const { projectName } = await createEnv(argv, false);
  const isTest = argv.t;
  const isDebug = argv.d;
  const file = ["-f", resolve("../docker/docker-compose.yml")];

  const downArgs = [
    ...file,
    "-p",
    projectName,
    "down",
    "--rmi",
    "local",
    "-v",
    "--remove-orphans",
  ];

  if (!isDebug) {
    spinnies.add("1", { text: "Removing Fuel local node..." });
  }

  const process = spawn(
    "docker-compose",
    downArgs,
    isDebug && { stdio: "inherit" }
  );
  process.stdout?.on("end", () => {
    if (!isDebug) {
      spinnies.succeed("1", { text: "Fuel node removed successfully!" });
      console.log(c.gray("----"));
    }
    console.log(
      `${c.green.bold("⇢ Environment:")} ${isTest ? "Test" : "Development"}`
    );
  });
};

export const command = "stop";
