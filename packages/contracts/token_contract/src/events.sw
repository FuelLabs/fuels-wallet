library events;

pub struct TransferBackEvent {
    from: ContractId,
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
