contract;

dep errors;
dep events;
dep utils;

use std::{
    auth::{
        AuthError,
        msg_sender,
    },
    constants::ZERO_B256,
    context::msg_amount,
    logging::log,
    token::mint_to,
};

use string::String;
use errors::{AccessError, BurnError, InitError, MintError, TransferError};
use events::{BurnEvent, MintEvent, TransferEvent};
use utils::{id_to_address, msg_sender_as_address};

storage {
    owner: Option<Identity> = Option::None,
    mint_price: u64 = 0,
    mint_limit: u64 = 0,
    total_supply: u64 = 0,
    total_minted: u64 = 0,
    deposits: StorageMap<Identity, u64> = StorageMap {},
    balances: StorageMap<Identity, u64> = StorageMap {},
}

abi Token {
    #[storage(read, write)]
    fn constructor(mint_price: u64, mint_limit: u64, total_supply: u64);
    #[storage(read)]
    fn owner() -> Identity;
    #[storage(read)]
    fn mint_limit() -> u64;
    #[storage(read)]
    fn mint_price() -> u64;
    #[storage(read)]
    fn total_minted() -> u64;
    #[storage(read)]
    fn total_supply() -> u64;
    #[storage(read)]
    fn balance_of(to: Option<Identity>) -> u64;
    #[payable, storage(read, write)]
    fn mint() -> u64;
    #[storage(read, write)]
    fn transfer_to(to: Identity, amount: u64) -> u64;
    #[storage(read, write)]
    fn burn(burn_amount: u64);
}

#[storage(read)]
fn validate_owner() {
    let sender: Result<Identity, AuthError> = msg_sender();
    match sender {
        Result::Ok(sender) => {
            let owner = storage.owner.unwrap();
            require(owner == sender, AccessError::NotOwner);
        }
        _ => {
            revert(0);
        }
    }
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

    #[storage(read)]
    fn balance_of(address: Option<Identity>) -> u64 {
        match address.unwrap() {
            Identity::Address(addr) => {
                let sender = msg_sender_as_address();
                let owner = id_to_address(storage.owner);
                require(sender != owner && addr != owner, AccessError::CannotQueryOwnerBalance);
                storage.balances.get(address.unwrap()) | 0
            },
            Identity::ContractId(addr) => {
                storage.balances.get(address.unwrap()) | 0
            }
        }
    }

    #[payable, storage(read, write)]
    fn mint() -> u64 {
        let sender = msg_sender().unwrap();
        require(sender != storage.owner.unwrap(), MintError::CannotMintForOwner);

        // Make deposit first
        let mint_price = storage.mint_price;
        let deposit = msg_amount();
        require(deposit > mint_price, MintError::CannotMintWithoutDeposit);
        storage.deposits.insert(sender, deposit);

        // Check if minting is possible
        let amount = deposit / mint_price;
        let total_plus_amount = storage.total_minted + amount;
        let curr_balance = storage.balances.get(sender) | 0;
        require(total_plus_amount <= storage.total_supply, MintError::InsufficientSupply);
        require(curr_balance + amount <= storage.mint_limit, MintError::MintLimitReached);

        // Update storage and mint tokens
        storage.balances.insert(sender, curr_balance + amount);
        storage.total_minted = total_plus_amount;
        mint_to(amount, sender);

        // Emit event
        log(MintEvent {
            to: sender,
            amount: amount,
        });

        // Return mint amount
        amount
    }

    #[storage(read, write)]
    fn transfer_to(to: Identity, amount: u64) -> u64 {
        let sender = msg_sender().unwrap();
        let curr_balance = storage.balances.get(sender) | 0;
        require(sender != to, TransferError::CannotTransferToSelf);
        require(curr_balance >= amount, TransferError::InsufficientBalance);

        // Update balances of sender and receiver
        let to_balance = storage.balances.get(to) | 0;
        storage.balances.insert(to, to_balance + amount);
        storage.balances.insert(sender, curr_balance - amount);

        // Emit event
        log(TransferEvent {
            from: sender,
            to: to,
            amount: amount,
        });

        // Return transfer amount
        amount
    }

    #[storage(read, write)]
    fn burn(burn_amount: u64) {
        validate_owner();

        // Require that the burn amount is less than the missing amount
        let total_minted = storage.total_minted;
        let total_supply = storage.total_supply;
        let missing_amount = total_supply - total_minted;
        require(burn_amount <= missing_amount, BurnError::CannotBurnMoreThanMissing);
        storage.total_supply = total_supply - burn_amount;

        // Emit event
        log(BurnEvent {
            amount: burn_amount,
        });
    }
}
