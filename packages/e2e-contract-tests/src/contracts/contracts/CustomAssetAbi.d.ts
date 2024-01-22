/* Autogenerated file. Do not edit manually. */

/* tslint:disable */
/* eslint-disable */

/*
  Fuels version: 0.71.1
  Forc version: 0.48.1
  Fuel-Core version: 0.22.0
*/

import type {
  BigNumberish,
  BN,
  Bytes,
  BytesLike,
  Contract,
  DecodedValue,
  FunctionFragment,
  Interface,
  InvokeFunction,
  StdString,
} from 'fuels';

import type { Option, Enum } from './common';

export enum BurnErrorInput {
  NotEnoughTokens = 'NotEnoughTokens',
}
export enum BurnErrorOutput {
  NotEnoughTokens = 'NotEnoughTokens',
}
export type IdentityInput = Enum<{
  Address: AddressInput;
  ContractId: ContractIdInput;
}>;
export type IdentityOutput = Enum<{
  Address: AddressOutput;
  ContractId: ContractIdOutput;
}>;

export type AddressInput = { value: string };
export type AddressOutput = AddressInput;
export type AssetIdInput = { value: string };
export type AssetIdOutput = AssetIdInput;
export type ContractIdInput = { value: string };
export type ContractIdOutput = ContractIdInput;
export type RawBytesInput = { ptr: BigNumberish; cap: BigNumberish };
export type RawBytesOutput = { ptr: BN; cap: BN };

interface CustomAssetAbiInterface extends Interface {
  functions: {
    decimals: FunctionFragment;
    name: FunctionFragment;
    symbol: FunctionFragment;
    total_assets: FunctionFragment;
    total_supply: FunctionFragment;
    burn: FunctionFragment;
    mint: FunctionFragment;
    deposit: FunctionFragment;
    deposit_half: FunctionFragment;
    deposit_half_and_mint: FunctionFragment;
    deposit_half_and_mint_from_external_contract: FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: 'decimals',
    values: [AssetIdInput]
  ): Uint8Array;
  encodeFunctionData(
    functionFragment: 'name',
    values: [AssetIdInput]
  ): Uint8Array;
  encodeFunctionData(
    functionFragment: 'symbol',
    values: [AssetIdInput]
  ): Uint8Array;
  encodeFunctionData(functionFragment: 'total_assets', values: []): Uint8Array;
  encodeFunctionData(
    functionFragment: 'total_supply',
    values: [AssetIdInput]
  ): Uint8Array;
  encodeFunctionData(
    functionFragment: 'burn',
    values: [string, BigNumberish]
  ): Uint8Array;
  encodeFunctionData(
    functionFragment: 'mint',
    values: [IdentityInput, string, BigNumberish]
  ): Uint8Array;
  encodeFunctionData(functionFragment: 'deposit', values: []): Uint8Array;
  encodeFunctionData(functionFragment: 'deposit_half', values: []): Uint8Array;
  encodeFunctionData(
    functionFragment: 'deposit_half_and_mint',
    values: [IdentityInput, string, BigNumberish]
  ): Uint8Array;
  encodeFunctionData(
    functionFragment: 'deposit_half_and_mint_from_external_contract',
    values: [IdentityInput, string, BigNumberish, ContractIdInput]
  ): Uint8Array;

  decodeFunctionData(
    functionFragment: 'decimals',
    data: BytesLike
  ): DecodedValue;
  decodeFunctionData(functionFragment: 'name', data: BytesLike): DecodedValue;
  decodeFunctionData(functionFragment: 'symbol', data: BytesLike): DecodedValue;
  decodeFunctionData(
    functionFragment: 'total_assets',
    data: BytesLike
  ): DecodedValue;
  decodeFunctionData(
    functionFragment: 'total_supply',
    data: BytesLike
  ): DecodedValue;
  decodeFunctionData(functionFragment: 'burn', data: BytesLike): DecodedValue;
  decodeFunctionData(functionFragment: 'mint', data: BytesLike): DecodedValue;
  decodeFunctionData(
    functionFragment: 'deposit',
    data: BytesLike
  ): DecodedValue;
  decodeFunctionData(
    functionFragment: 'deposit_half',
    data: BytesLike
  ): DecodedValue;
  decodeFunctionData(
    functionFragment: 'deposit_half_and_mint',
    data: BytesLike
  ): DecodedValue;
  decodeFunctionData(
    functionFragment: 'deposit_half_and_mint_from_external_contract',
    data: BytesLike
  ): DecodedValue;
}

export class CustomAssetAbi extends Contract {
  interface: CustomAssetAbiInterface;
  functions: {
    decimals: InvokeFunction<[asset: AssetIdInput], Option<number>>;
    name: InvokeFunction<[asset: AssetIdInput], Option<StdString>>;
    symbol: InvokeFunction<[asset: AssetIdInput], Option<StdString>>;
    total_assets: InvokeFunction<[], BN>;
    total_supply: InvokeFunction<[asset: AssetIdInput], Option<BN>>;
    burn: InvokeFunction<[sub_id: string, amount: BigNumberish], void>;
    mint: InvokeFunction<
      [recipient: IdentityInput, sub_id: string, amount: BigNumberish],
      void
    >;
    deposit: InvokeFunction<[], BN>;
    deposit_half: InvokeFunction<[], BN>;
    deposit_half_and_mint: InvokeFunction<
      [recipient: IdentityInput, sub_id: string, amount: BigNumberish],
      BN
    >;
    deposit_half_and_mint_from_external_contract: InvokeFunction<
      [
        recipient: IdentityInput,
        sub_id: string,
        amount: BigNumberish,
        contract_id: ContractIdInput,
      ],
      BN
    >;
  };
}
