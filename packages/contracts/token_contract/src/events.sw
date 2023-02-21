library events;

pub struct TransferBackEvent {
    to: Identity,
    amount: u64,
}

pub struct DepositEvent {
    from: Identity,
    amount: u64,
}

pub struct MintEvent {
    to: Identity,
    amount: u64,
}
