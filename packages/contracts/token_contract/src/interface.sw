library interface;

abi TokenContract {
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
    #[storage()]
    fn get_coin_balance(asset: ContractId) -> u64;
    #[storage(read)]
    fn get_deposit_of(id: Identity) -> u64;
    #[storage(read)]
    fn get_mint_of(id: Identity) -> u64;

    #[payable, storage(read, write)]
    fn deposit() -> u64;
    #[storage(read, write)]
    fn mint(asset_id: ContractId) -> u64;
}
