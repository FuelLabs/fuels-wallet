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

pub enum ApproveError {
    CannotApproveSelf: (),
    CannotApproveSameAmount: (),
    CannotApproveMoreThanBalance: (),
}

pub enum TransferError {
    CannotTransferToSelf: (),
    InsufficientAllowance: (),
    InsufficientBalance: (),
}

pub enum BurnError {
    CannotBurnMoreThanMissing: (),
}
