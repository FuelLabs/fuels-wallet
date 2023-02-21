contract;

dep errors;
dep events;
dep interface;
dep utils;

use string::String;
use std::{
    auth::{
        AuthError,
        msg_sender,
    },
    call_frames::contract_id,
    constants::{
        BASE_ASSET_ID,
        ZERO_B256,
    },
    context::msg_amount,
    logging::log,
    token::{
        burn,
        mint_to,
        transfer,
    },
};

use errors::*;
use events::*;
use interface::Token;
use utils::{id_to_address, is_sender_owner, sender_as_address};

storage {
    owner: Option<Identity> = Option::None,
    mint_price: u64 = 0,
    mint_limit: u64 = 0,
    total_supply: u64 = 0,
    total_minted: u64 = 0,
    deposits: StorageMap<Identity, u64> = StorageMap {},
}

impl Token for Contract {
    #[storage(read, write)]
    fn constructor(mint_price: u64, mint_limit: u64, total_supply: u64) {
        require(storage.owner.is_some(), InitError::CannotReinitialize);
        require(total_supply != 0, InitError::AssetSupplyCannotBeZero);
        require(mint_price != 0, InitError::MintPriceCannotBeZero);
        require(mint_limit != 0, InitError::MintLimitCannotBeZero);
        let sender: Result<Identity, AuthError> = msg_sender();
        storage.owner = Option::Some(sender.unwrap());
        storage.total_supply = total_supply;
        storage.mint_price = mint_price;
        storage.mint_limit = mint_limit;
        storage.total_minted = 0;

        // Mint total tokens supply to owner
        mint_to(total_supply, storage.owner.unwrap());
    }

    #[storage(read)]
    fn owner() -> Identity {
        storage.owner.unwrap()
    }
    #[storage(read)]
    fn mint_limit() -> u64 {
        storage.mint_limit
    }
    #[storage(read)]
    fn mint_price() -> u64 {
        storage.mint_price
    }
    #[storage(read)]
    fn total_minted() -> u64 {
        storage.total_minted
    }
    #[storage(read)]
    fn total_supply() -> u64 {
        storage.total_supply
    }

    #[payable, storage(read, write)]
    fn deposit() -> u64 {
        let sender = msg_sender().unwrap();
        require(sender != storage.owner.unwrap(), DepositError::CannotDepositForOwner);

        // Check deposit values
        let deposit = msg_amount();
        require(deposit > 0, DepositError::CannotDepositZero);
        require(deposit > storage.mint_price, DepositError::CannotDepositLessThanMintPrice);

        // Check deposit limits
        let curr_deposit = storage.deposits.get(sender) | 0;
        let total_plus_deposit = curr_deposit + deposit;
        require(total_plus_deposit <= storage.mint_limit, DepositError::DepositLimitReached);

        // Check if future minting is possible
        let mint_amount = deposit / storage.mint_price;
        let total_plus_amount = storage.total_minted + mint_amount;
        require(total_plus_amount <= storage.total_supply, MintError::InsufficientSupply);

        // Update storage deposit
        storage.deposits.insert(sender, total_plus_deposit);

        // Emit event
        log(DepositEvent {
            from: sender,
            amount: deposit,
        });

        // Return deposit amount
        deposit
    }

    #[storage(read, write)]
    fn mint() -> u64 {
        let sender = msg_sender().unwrap();
        require(sender != storage.owner.unwrap(), MintError::CannotMintForOwner);

        // Check if sender has deposit and transfer half of it to himself
        let curr_deposit = storage.deposits.get(sender) | 0;
        let return_amount = curr_deposit / 2;
        require(curr_deposit > 0, MintError::CannotMintWithoutDeposit);
        transfer(return_amount, BASE_ASSET_ID, sender);

        // Emit transfer event
        log(TransferBackEvent {
            from: contract_id(),
            to: sender,
            amount: return_amount,
        });

        // Update storage total minted and transfer tokens to sender
        let amount = curr_deposit / storage.mint_price;
        transfer(amount, contract_id(), sender);
        storage.total_minted = storage.total_minted + amount;

        // Emit event
        log(MintEvent {
            to: sender,
            amount: amount,
        });

        // Return mint amount
        amount
    }
}
