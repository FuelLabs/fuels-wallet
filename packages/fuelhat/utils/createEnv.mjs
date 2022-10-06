import fs from "node:fs/promises";
import os from "os";
import path from "path";

const resolve = (str) => path.resolve(os.tmpdir(), str);

export async function createEnv(argv, createFile = true) {
  const isTest = argv.t;
  const project = argv.p;
  const projectName = isTest ? `${project}_test` : project;
  const filepath = isTest ? ".fuelhatenv" : ".fuelhatenv.test";
  const port = isTest ? "4001" : "4000";
  const faucetPort = isTest ? "4041" : "4040";
  const data = `PROJECT=${projectName}
FUEL_CORE_PORT=${port}
FUEL_FAUCET_PORT=${faucetPort}
WALLET_SECRET=0xa449b1ffee0e2205fa924c6740cc48b3b473aa28587df6dab12abc245d1f5298
DISPENSE_AMOUNT=500000000
GAS_PRICE=1
BYTE_PRICE=1
PROVIDER_URL=http://localhost:${port}/graphql`;

  if (createFile) {
    await fs.writeFile(resolve(filepath), data, "utf8");
  }
  return {
    port,
    faucetPort,
    projectName,
    filepath: resolve(filepath),
  };
}
