library events;

pub struct TransferEvent {
    from: Identity,
    to: Identity,
    amount: u64,
}

pub struct MintEvent {
    to: Identity,
    amount: u64,
}

pub struct BurnEvent {
    amount: u64,
}
