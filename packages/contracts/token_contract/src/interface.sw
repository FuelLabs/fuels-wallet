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

    #[payable, storage(read, write)]
    fn deposit() -> u64;
    #[storage(read, write)]
    fn mint() -> u64;
}
