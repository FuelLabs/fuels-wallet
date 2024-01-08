contract;

use token::{
    mint::{
        _mint, _burn,
    },
    base::{
        _decimals,
        _name,
        _symbol,
        _total_assets,
        _total_supply,
    }
};

use src20::SRC20;
use src3::SRC3;
use std::{
    call_frames::msg_asset_id,
    context::msg_amount,
    hash::Hash,
    storage::storage_string::*,
    string::String,
    token::transfer,
};

storage {
    total_assets: u64 = 0,
    total_supply: StorageMap<AssetId, u64> = StorageMap {},
    name: StorageMap<AssetId, StorageString> = StorageMap {},
    symbol: StorageMap<AssetId, StorageString> = StorageMap {},
    decimals: StorageMap<AssetId, u8> = StorageMap {},
    balances: StorageMap<(Identity, AssetId), u64> = StorageMap {},
}

impl SRC20 for Contract {
    #[storage(read)]
    fn total_assets() -> u64 {
        _total_assets(storage.total_assets)
    }

    #[storage(read)]
    fn total_supply(asset: AssetId) -> Option<u64> {
        _total_supply(storage.total_supply, asset)
    }

    #[storage(read)]
    fn name(asset: AssetId) -> Option<String> {
        _name(storage.name, asset)
    }

    #[storage(read)]
    fn symbol(asset: AssetId) -> Option<String> {
        _symbol(storage.symbol, asset)
    }

    #[storage(read)]
    fn decimals(asset: AssetId) -> Option<u8> {
        _decimals(storage.decimals, asset)
    }
}

impl SRC3 for Contract {
    #[storage(read, write)]
    fn mint(recipient: Identity, sub_id: SubId, amount: u64) {
        _mint(storage.total_assets, storage.total_supply, recipient, sub_id, amount);
    }

    #[storage(read, write)]
    fn burn(sub_id: SubId, amount: u64) {
        _burn(storage.total_supply, sub_id, amount);
    }
}

abi CustomBehavior {
    #[storage(read, write)]
    #[payable]
    fn deposit() -> u64;

    #[storage(read, write)]
    #[payable]
    fn deposit_half() -> u64;

    #[storage(read, write)]
    #[payable]
    fn deposit_half_and_mint(recipient: Identity, sub_id: SubId, amount: u64) -> u64;

    #[storage(read, write)]
    #[payable]
    fn deposit_half_and_mint_from_external_contract(recipient: Identity, sub_id: SubId, amount: u64, contract_id: ContractId) -> u64;
}

impl CustomBehavior for Contract {
    #[storage(read, write)]
    #[payable]
    fn deposit() -> u64 {
        let sender = msg_sender().unwrap();
        let asset_id = msg_asset_id();
        let amount = msg_amount();
        let prev_balance = storage.balances.get((sender, asset_id)).try_read().unwrap_or(0);
        let new_balance = prev_balance + amount;
        storage.balances.insert((sender, asset_id), new_balance);
        new_balance
    }

    #[storage(read, write)]
    #[payable]
    fn deposit_half() -> u64 {
        let sender = msg_sender().unwrap();
        let asset_id = msg_asset_id();
        let amount = msg_amount();
        let prev_balance = storage.balances.get((sender, asset_id)).try_read().unwrap_or(0);
        let half_amount = amount / 2;
        let new_balance = prev_balance + half_amount;
        storage.balances.insert((sender, asset_id), new_balance);
        transfer(sender, asset_id, half_amount);
        new_balance
    }

    #[storage(read, write)]
    #[payable]
    fn deposit_half_and_mint(recipient: Identity, sub_id: SubId, amount: u64) -> u64 {
        let sender = msg_sender().unwrap();
        let asset_id = msg_asset_id();
        let forward_amount = msg_amount();
        let prev_balance = storage.balances.get((sender, asset_id)).try_read().unwrap_or(0);
        let half_amount = forward_amount / 2;
        let new_balance = prev_balance + half_amount;
        storage.balances.insert((sender, asset_id), new_balance);
        transfer(sender, asset_id, half_amount);

        _mint(storage.total_assets, storage.total_supply, recipient, sub_id, amount);
        new_balance
    }

    #[storage(read, write)]
    #[payable]
    fn deposit_half_and_mint_from_external_contract(
        recipient: Identity,
        sub_id: SubId,
        amount: u64,
        contract_id: ContractId,
    ) -> u64 {
        let sender = msg_sender().unwrap();
        let asset_id = msg_asset_id();
        let forward_amount = msg_amount();
        let prev_balance = storage.balances.get((sender, asset_id)).try_read().unwrap_or(0);
        let half_amount = forward_amount / 2;
        let new_balance = prev_balance + half_amount;
        storage.balances.insert((sender, asset_id), new_balance);
        transfer(sender, asset_id, half_amount);
        let external_contract = abi(SRC3, contract_id.value);
        external_contract.mint(recipient, sub_id, amount);

        new_balance
    }
}
