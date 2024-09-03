/* Autogenerated file. Do not edit manually. */

/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/consistent-type-imports */

/*
  Fuels version: 0.94.3
  Forc version: 0.63.3
  Fuel-Core version: 0.34.0
*/

import { ContractFactory, decompressBytecode } from "fuels";
import type { Provider, Account, DeployContractOptions, DeployContractResult } from "fuels";

import { CustomAsset } from "./CustomAsset";

const bytecode = decompressBytecode("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");

export class CustomAssetFactory extends ContractFactory {

  static readonly bytecode = bytecode;

  constructor(accountOrProvider: Account | Provider) {
    super(bytecode, CustomAsset.abi, accountOrProvider);
  }

  static async deploy (
    wallet: Account,
    options: DeployContractOptions = {}
  ): Promise<DeployContractResult<CustomAsset>> {
    const factory = new CustomAssetFactory(wallet);

    return factory.deploy({
      storageSlots: CustomAsset.storageSlots,
      ...options,
    });
  }
}
