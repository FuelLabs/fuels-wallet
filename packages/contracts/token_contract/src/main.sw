contract;

dep errors;
dep events;
dep interface;

use string::String;
use std::{
    auth::{
        msg_sender,
    },
    call_frames::contract_id,
    constants::{
        BASE_ASSET_ID,
        ZERO_B256,
    },
    context::{
        balance_of,
        msg_amount,
    },
    token::{
        mint_to_contract,
        transfer,
    },
};

use errors::{DepositError, InitError, MintError};
use events::{DepositEvent, InitialMintEvent, MintEvent, TransferBackEvent};
use interface::TokenContract;

storage {
    // Contract owner identity
    owner: Option<Identity> = Option::None,
    // Mint price in base asset
    mint_price: u64 = 0,
    // Maximum amount of tokens that can be minted by a user.
    mint_limit: u64 = 0,
    // Maximum amount of tokens that can be minted.
    total_supply: u64 = 0,
    // Current amount of tokens that have been minted.
    total_minted: u64 = 0,
    // Current deposits mapped by user identity.
    deposits: StorageMap<Identity, u64> = StorageMap {},
    // Current minted tokens mapped by user identity.
    minters: StorageMap<Identity, u64> = StorageMap {},
}

impl TokenContract for Contract {
    #[storage(read, write)]
    fn constructor(mint_price: u64, mint_limit: u64, total_supply: u64) {
        require(storage.owner.is_none(), InitError::CannotReinitialize);
        require(mint_price > 0, InitError::MintPriceCannotBeZero);
        require(mint_limit > 0, InitError::MintLimitCannotBeZero);
        require(total_supply > 0, InitError::TotalSupplyCannotBeZero);
        storage.owner = Option::Some(msg_sender().unwrap());
        storage.total_supply = total_supply;
        storage.mint_price = mint_price;
        storage.mint_limit = mint_limit;

        // Mint total tokens supply to owner
        mint_to_contract(total_supply, contract_id());
        log(InitialMintEvent {
            amount: total_supply,
            to: storage.owner.unwrap(),
        });
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
    #[storage()]
    fn coin_balance(asset_id: ContractId) -> u64 {
        balance_of(contract_id(), asset_id)
    }
    #[storage(read)]
    fn deposit_of(id: Identity) -> u64 {
        storage.deposits.get(id).unwrap_or(0)
    }
    #[storage(read)]
    fn mint_of(id: Identity) -> u64 {
        storage.minters.get(id).unwrap_or(0)
    }

    #[payable, storage(read, write)]
    fn deposit() -> u64 {
        let deposit = msg_amount();
        let sender = msg_sender().unwrap();
        require(sender != storage.owner.unwrap(), DepositError::CannotDepositForOwner);

        // Check deposit values
        require(deposit > 0, DepositError::CannotDepositZero);
        require(deposit > storage.mint_price, DepositError::CannotDepositLessThanMintPrice);

        // Check if future minting is possible
        let mint_amount = deposit / storage.mint_price;
        let total_plus_amount = storage.total_minted + mint_amount;
        require(total_plus_amount <= storage.total_supply, MintError::InsufficientSupply);

        // Update storage deposit
        let curr_deposit = storage.deposits.get(sender).unwrap_or(0);
        let total_plus_deposit = curr_deposit + deposit;
        storage.deposits.insert(sender, total_plus_deposit);

        // Emit event
        log(DepositEvent {
            amount: deposit,
            from: sender,
        });

        deposit
    }

    #[storage(read, write)]
    fn mint(asset_id: ContractId) -> u64 {
        let sender = msg_sender().unwrap();
        require(sender != storage.owner.unwrap(), MintError::CannotMintForOwner);

        // Check current deposit
        let curr_deposit = storage.deposits.get(sender).unwrap_or(0);
        let return_amount = curr_deposit / 2;
        require(curr_deposit > 0, MintError::CannotMintWithoutDeposit);

        // Check mint limit
        let amount = curr_deposit / storage.mint_price;
        let curr_mint = storage.minters.get(sender).unwrap_or(0);
        let total_plus_mint = curr_mint + amount;
        require(total_plus_mint <= storage.mint_limit, MintError::MintLimitReached);

        // Transfer half of deposit back to sender and update storage
        // then, transfer minted tokens to sender and update storage
        let return_amount = curr_deposit / 2;
        transfer(return_amount, BASE_ASSET_ID, sender);
        transfer(amount, contract_id(), sender);

        log(TransferBackEvent {
            amount: return_amount,
            to: sender,
        });

        log(MintEvent {
            amount: amount,
            to: sender,
        });

        // Update storage
        storage.total_minted = storage.total_minted + amount;
        storage.minters.insert(sender, curr_mint + amount);
        amount
    }
}
