library interface;

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
    #[storage(read)]
    fn allowance(spender: Identity, receiver: Identity) -> u64;

    #[payable, storage(read, write)]
    fn mint() -> u64;
    #[storage(read, write)]
    fn approve(spender: Identity, receiver: Identity, max_amount: u64) -> u64;
    #[storage(read, write)]
    fn transfer_to(to: Identity, amount: u64) -> u64;
    #[storage(read, write)]
    fn transfer_from_to(from: Identity, to: Identity, amount: u64) -> u64;
    #[storage(read, write)]
    fn burn(amount: u64);
}
