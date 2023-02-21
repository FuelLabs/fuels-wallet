use crate::utils::{abi_calls::*, test_helpers::setup};
use fuels::{prelude::*, types::*};

mod success {
    use super::*;

    #[tokio::test]
    async fn can_mint_on_contract() {
        let meta = setup(None).await;
        let asset_id = meta.asset_id;
        let token_contract = meta.token_contract;
        let user = meta.user;
        let params = meta.params;
        let id = Identity::Address(user.address().into());

        constructor(&token_contract, &params).await;
        deposit(&token_contract, user.clone(), 100).await;
        let minted = mint_tokens(&token_contract, asset_id, user.clone()).await;
        println!("minted: {:?}", minted.value);

        let curr_mint = get_mint_of(&token_contract, id).await;
        assert_eq!(minted.value, curr_mint.value);

        let contract_asset_id = AssetId::new(asset_id.into());
        let balance = user.get_asset_balance(&contract_asset_id).await.unwrap();
        assert_eq!(balance, minted.value);
    }
}

mod revert {
    use super::*;

    #[tokio::test]
    #[should_panic(expected = "CannotMintForOwner")]
    async fn cannot_mint_for_owner() {
        let meta = setup(None).await;
        let asset_id = meta.asset_id;
        let token_contract = meta.token_contract;
        let deployer = meta.deployer;
        let params = meta.params;

        constructor(&token_contract, &params).await;

        let amount = 100;
        deposit(&token_contract, meta.user.clone(), amount).await;
        mint_tokens(&token_contract, asset_id, deployer.clone()).await;
    }

    #[tokio::test]
    #[should_panic(expected = "CannotMintWithoutDeposit")]
    async fn cannot_mint_without_deposit() {
        let meta = setup(None).await;
        let asset_id = meta.asset_id;
        let token_contract = meta.token_contract;
        let params = meta.params;

        constructor(&token_contract, &params).await;
        mint_tokens(&token_contract, asset_id, meta.user.clone()).await;
    }
}
