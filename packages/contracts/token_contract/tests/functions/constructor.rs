use fuels::prelude::*;

use crate::utils::{
    abi_calls::{constructor, get_coin_balance},
    test_helpers::setup,
    ConstructorParams, TokenContract,
};

async fn get_balance_from(contract: &TokenContract, asset_id: AssetId) -> u64 {
    let balance = get_coin_balance(contract, asset_id).await;
    balance.value
}

mod success {

    use super::*;

    #[tokio::test]
    async fn initalizes() {
        let meta = setup(None).await;
        constructor(&meta.token_contract, &meta.params).await;
    }

    #[tokio::test]
    async fn contract_has_total_supply_minted() {
        let meta = setup(None).await;
        let asset_id = meta.asset_id;
        let token_contract = meta.token_contract;
        let params = meta.params;
        let contract_asset_id = AssetId::new(asset_id.into());

        assert_eq!(
            get_balance_from(&token_contract, contract_asset_id).await,
            0
        );
        constructor(&token_contract, &params).await;
        assert_eq!(
            get_balance_from(&token_contract, contract_asset_id).await,
            params.total_supply
        );
    }
}

mod revert {

    use super::*;

    #[tokio::test]
    #[should_panic(expected = "CannotReinitialize")]
    async fn when_initialized_twice() {
        let meta = setup(None).await;
        constructor(&meta.token_contract, &meta.params).await;
        constructor(&meta.token_contract, &meta.params).await;
    }

    #[tokio::test]
    #[should_panic(expected = "MintPriceCannotBeZero")]
    async fn when_mint_price_zero() {
        let meta = setup(None).await;
        let params = ConstructorParams {
            mint_price: 0,
            mint_limit: 100,
            total_supply: 100,
        };
        constructor(&meta.token_contract, &params).await;
    }

    #[tokio::test]
    #[should_panic(expected = "MintLimitCannotBeZero")]
    async fn when_mint_limit_zero() {
        let meta = setup(None).await;
        let params = ConstructorParams {
            mint_price: 100,
            mint_limit: 0,
            total_supply: 100,
        };
        constructor(&meta.token_contract, &params).await;
    }

    #[tokio::test]
    #[should_panic(expected = "TotalSupplyCannotBeZero")]
    async fn when_total_supply_zero() {
        let meta = setup(None).await;
        let params = ConstructorParams {
            mint_price: 100,
            mint_limit: 100,
            total_supply: 0,
        };
        constructor(&meta.token_contract, &params).await;
    }
}
