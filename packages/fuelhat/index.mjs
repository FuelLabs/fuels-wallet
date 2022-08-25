#!/usr/bin/env node

import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import { commands } from "./commands/index.mjs";

yargs(hideBin(process.argv))
  .scriptName("fuelhat")
  .usage("$0 <cmd> [args]")
  .command("node <cmd>", "Start or stop a Fuel local node", (yargs) => {
    yargs.option("project", {
      alias: "p",
      default: "fuelhat",
      describe: "Project name",
    });
    yargs.option("test", {
      alias: "t",
      describe: "Run using test environment",
    });
    yargs.option("debug", {
      alias: "d",
      describe: "Show docker logs",
    });
    yargs.command(commands).demandCommand(1);
  })
  .demandCommand(1)
  .parse();
