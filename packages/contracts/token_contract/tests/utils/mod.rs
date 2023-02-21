use fuels::{prelude::*, types::*};

abigen!(Contract(
    name = "TokenContract",
    abi = "packages/contracts/token_contract/out/debug/token_contract-abi.json"
));

pub struct SetupParams {
    pub num_wallets: Option<u64>,
    pub coins_per_wallet: Option<u64>,
    pub coin_amount: Option<u64>,
    pub mint_price: Option<u64>,
    pub mint_limit: Option<u64>,
    pub total_supply: Option<u64>,
}

pub struct ConstructorParams {
    pub mint_price: u64,
    pub mint_limit: u64,
    pub total_supply: u64,
}

pub struct Metadata {
    pub contract_id: Bech32ContractId,
    pub asset_id: ContractId,
    pub token_contract: TokenContract,
    pub deployer: WalletUnlocked,
    pub user: WalletUnlocked,
    pub params: ConstructorParams,
    pub provider: Provider,
}

pub mod paths {
    pub const ASSET_CONTRACT_BINARY_PATH: &str = "./out/debug/token_contract.bin";
    pub const ASSET_CONTRACT_STORAGE_PATH: &str = "./out/debug/token_contract-storage_slots.json";
}

pub mod abi_calls {
    use super::*;
    use fuels::programs::call_response::FuelCallResponse;

    pub async fn constructor(
        contract: &TokenContract,
        params: &ConstructorParams,
    ) -> FuelCallResponse<()> {
        contract
            .methods()
            .constructor(params.mint_price, params.mint_limit, params.total_supply)
            .call()
            .await
            .unwrap()
    }

    pub async fn owner(contract: &TokenContract) -> FuelCallResponse<Identity> {
        contract.methods().owner().call().await.unwrap()
    }
    pub async fn mint_limit(contract: &TokenContract) -> FuelCallResponse<u64> {
        contract.methods().mint_limit().call().await.unwrap()
    }
    pub async fn mint_price(contract: &TokenContract) -> FuelCallResponse<u64> {
        contract.methods().mint_price().call().await.unwrap()
    }
    pub async fn total_minted(contract: &TokenContract) -> FuelCallResponse<u64> {
        contract.methods().total_minted().call().await.unwrap()
    }
    pub async fn total_supply(contract: &TokenContract) -> FuelCallResponse<u64> {
        contract.methods().total_supply().call().await.unwrap()
    }
    pub async fn get_coin_balance(
        contract: &TokenContract,
        asset_id: AssetId,
    ) -> FuelCallResponse<u64> {
        let contract_id = ContractId::new(asset_id.into());
        contract
            .methods()
            .get_coin_balance(contract_id)
            .call()
            .await
            .unwrap()
    }
    pub async fn get_deposit_of(contract: &TokenContract, id: Identity) -> FuelCallResponse<u64> {
        contract.methods().get_deposit_of(id).call().await.unwrap()
    }
    pub async fn get_mint_of(contract: &TokenContract, id: Identity) -> FuelCallResponse<u64> {
        contract.methods().get_mint_of(id).call().await.unwrap()
    }

    pub async fn deposit(
        contract: &TokenContract,
        wallet: WalletUnlocked,
        amount: u64,
    ) -> FuelCallResponse<u64> {
        let tx_params = TxParameters::new(None, Some(1_000_000), None);
        let call_params = CallParameters::new(Some(amount), Some(BASE_ASSET_ID), Some(1_000_000));

        contract
            .with_wallet(wallet)
            .unwrap()
            .methods()
            .deposit()
            .tx_params(tx_params)
            .call_params(call_params)
            .call()
            .await
            .unwrap()
    }

    pub async fn mint_tokens(
        contract: &TokenContract,
        asset_id: ContractId,
        wallet: WalletUnlocked,
    ) -> FuelCallResponse<u64> {
        contract
            .with_wallet(wallet)
            .unwrap()
            .methods()
            .mint(asset_id)
            .append_variable_outputs(2)
            .call()
            .await
            .unwrap()
    }
}

pub mod test_helpers {
    use super::*;
    use paths::{ASSET_CONTRACT_BINARY_PATH, ASSET_CONTRACT_STORAGE_PATH};

    pub async fn setup(initial_params: Option<SetupParams>) -> Metadata {
        let params = initial_params.unwrap_or({
            SetupParams {
                num_wallets: Some(2),
                coins_per_wallet: Some(1),
                coin_amount: Some(1_000_000),
                mint_price: Some(20),
                mint_limit: Some(100),
                total_supply: Some(100),
            }
        });

        let num_wallets = params.num_wallets;
        let coins_per_wallet = params.coins_per_wallet;
        let coin_amount = params.coin_amount;
        let mut wallets = launch_custom_provider_and_get_wallets(
            WalletsConfig::new(num_wallets, coins_per_wallet, coin_amount),
            None,
            None,
        )
        .await;

        let wallet1 = wallets.pop().unwrap();
        let wallet2 = wallets.pop().unwrap();

        let contract_id = Contract::deploy(
            ASSET_CONTRACT_BINARY_PATH,
            &wallet1,
            TxParameters::default(),
            StorageConfiguration::with_storage_path(Some(ASSET_CONTRACT_STORAGE_PATH.to_string())),
        )
        .await
        .unwrap();

        let asset_id = ContractId::new(*contract_id.hash());
        let token_contract = TokenContract::new(contract_id.clone(), wallet1.clone());
        let deployer = wallet1;
        let user = wallet2;
        let constructor_params = ConstructorParams {
            mint_price: params.mint_price.unwrap_or_default(),
            mint_limit: params.mint_limit.unwrap_or_default(),
            total_supply: params.total_supply.unwrap_or_default(),
        };

        let provider = deployer.get_provider().unwrap().clone();
        let metadata = {
            Metadata {
                contract_id,
                asset_id,
                token_contract,
                deployer,
                user,
                params: constructor_params,
                provider,
            }
        };

        metadata
    }
}
