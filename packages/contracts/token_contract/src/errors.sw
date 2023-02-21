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

pub enum DepositError {
    CannotDepositForOwner: (),
    CannotDepositZero: (),
    CannotDepositLessThanMintPrice: (),
    DepositLimitReached: (),
}

pub enum MintError {
    CannotMintWithoutDeposit: (),
    CannotMintForOwner: (),
    MintLimitReached: (),
    InsufficientSupply: (),
}
