use crate::utils::{abi_calls::*, test_helpers::setup};
use fuels::types::*;

mod success {

    use super::*;

    #[tokio::test]
    async fn can_read_owner() {
        let meta = setup(None).await;
        constructor(&meta.token_contract, &meta.params).await;
        let owner = owner(&meta.token_contract).await;
        assert_eq!(
            owner.value,
            Identity::Address(meta.deployer.address().into())
        );
    }

    #[tokio::test]
    async fn can_read_mint_price() {
        let meta = setup(None).await;
        constructor(&meta.token_contract, &meta.params).await;
        let mint_price = mint_price(&meta.token_contract).await;
        assert_eq!(mint_price.value, meta.params.mint_price);
    }

    #[tokio::test]
    async fn can_read_mint_limit() {
        let meta = setup(None).await;
        constructor(&meta.token_contract, &meta.params).await;
        let mint_limit = mint_limit(&meta.token_contract).await;
        assert_eq!(mint_limit.value, meta.params.mint_limit);
    }

    #[tokio::test]
    async fn can_read_total_supply() {
        let meta = setup(None).await;
        constructor(&meta.token_contract, &meta.params).await;
        let total_supply = total_supply(&meta.token_contract).await;
        assert_eq!(total_supply.value, meta.params.total_supply);
    }

    #[tokio::test]
    async fn can_read_total_minted() {
        let meta = setup(None).await;
        constructor(&meta.token_contract, &meta.params).await;
        let total_minted = total_minted(&meta.token_contract).await;
        assert_eq!(total_minted.value, 0);
    }
}
