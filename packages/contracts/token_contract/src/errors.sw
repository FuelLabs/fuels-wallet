library errors;

pub enum InitError {
    CannotReinitialize: (),
    TotalSupplyCannotBeZero: (),
    MintPriceCannotBeZero: (),
    MintLimitCannotBeZero: (),
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
