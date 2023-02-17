library errors;

pub enum InitError {
    CannotReinitialize: (),
    AssetSupplyCannotBeZero: (),
    MintPriceCannotBeZero: (),
    MintLimitCannotBeZero: (),
}

pub enum AccessError {
    CannotQueryOwnerBalance: (),
    NotOwner: (),
}

pub enum MintError {
    CannotMintWithoutDeposit: (),
    CannotMintForOwner: (),
    MintLimitReached: (),
    InsufficientSupply: (),
}

pub enum TransferError {
    CannotTransferToSelf: (),
    InsufficientBalance: (),
}

pub enum BurnError {
    CannotBurnMoreThanMissing: (),
}
