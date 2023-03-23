use crate::utils::{abi_calls::*, test_helpers::setup};
use fuels::{prelude::*, types::*};

mod success {
    use super::*;

    #[tokio::test]
    async fn can_deposit_to_contract() {
        let meta = setup(None).await;
        let token_contract = meta.token_contract;
        let user = meta.user;
        let params = meta.params;
        let provider = meta.provider;

        constructor(&token_contract, &params).await;

        let amount = 100;
        let id = Identity::Address(user.address().into());
        let deposit = deposit(&token_contract, user, amount).await;
        let curr_deposit = deposit_of(&token_contract, id).await;
        assert_eq!(deposit.value, curr_deposit.value);

        let balances = provider
            .get_contract_balances(&meta.contract_id)
            .await
            .unwrap();

        let asset_id_key = format!("{BASE_ASSET_ID:#x}");
        let asset_balance = balances.get(&asset_id_key).unwrap();
        assert_eq!(asset_balance.clone(), amount);
    }
}

mod revert {
    use super::*;

    #[tokio::test]
    #[should_panic(expected = "CannotDepositForOwner")]
    async fn cannot_deposit_for_owner() {
        let meta = setup(None).await;
        let token_contract = meta.token_contract;
        let deployer = meta.deployer;
        let params = meta.params;

        constructor(&token_contract, &params).await;

        let amount = 100;
        deposit(&token_contract, deployer, amount).await;
    }

    #[tokio::test]
    #[should_panic(expected = "CannotDepositZero")]
    async fn cannot_deposit_zero() {
        let meta = setup(None).await;
        let token_contract = meta.token_contract;
        let user = meta.user;
        let params = meta.params;

        constructor(&token_contract, &params).await;

        let amount = 0;
        deposit(&token_contract, user, amount).await;
    }

    #[tokio::test]
    #[should_panic(expected = "CannotDepositLessThanMintPrice")]
    async fn cannot_deposit_less_than_mint_price() {
        let meta = setup(None).await;
        let token_contract = meta.token_contract;
        let user = meta.user;
        let params = meta.params;

        constructor(&token_contract, &params).await;

        let amount = 10;
        deposit(&token_contract, user, amount).await;
    }
}
