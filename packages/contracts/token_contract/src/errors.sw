library errors;

pub enum InitError {
    CannotReinitialize: (),
    TotalSupplyCannotBeZero: (),
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
}

pub enum MintError {
    CannotMintWithoutDeposit: (),
    CannotMintForOwner: (),
    MintLimitReached: (),
    InsufficientSupply: (),
}
