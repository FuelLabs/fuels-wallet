import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// import { NFTAbi__factory } from '../../../../../../contracts/nft';

import { Layout, Pages } from '~/systems/Core';
// import { useAccounts } from '~/systems/Account';

export const AttrCard = (props: { attrName: string; attrValue: string }) => {
  return (
    <div style={style.attrCard}>
      <span style={style.textMuted}>{props.attrName}</span>
      <h5 className="mt-3">{props.attrValue}</h5>
    </div>
  );
};

const style = {
  img: {
    width: '100%',
  },
  attrCard: {
    border: '1px solid rgba(138, 138, 160, 0.3)',
    borderRadius: '10px',
    padding: '10px',
  },
  textMuted: {
    color: 'rgb(255, 255, 255, 0.75)',
    textTransform: 'uppercase !important',
  },
  attributes: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '5px 10px',
  },
};

export function NFTDetails() {
  // const { account } = useAccounts();
  const [nft, setNft] = useState({
    name: '',
    image: '',
    description: '',
    attributes: [],
  });
  const navigate = useNavigate();
  const { contractId, token } = useParams();

  useEffect(() => {
    const loadData = async () => {
      const data = await fetch(
        `https://fuel-nft-apis.vercel.app/nft/${contractId?.slice(2)}/${token}`
      );
      const result = await data.json();

      setNft(result.nft_data);
      console.log(result);
    };

    loadData();
  }, []);

  // const transfer = async () => {
  //   if (account) {
  //     // console.log(
  //     //   manager.exportPrivateKey(Address.fromString(account.address))
  //     // );

  //     // const publicKey = Address.fromString(account.address).toB256();
  //     // const wallet = Wallet.fromPrivateKey(
  //     //   publicKey,
  //     //   'https://beta-3.fuel.network/graphql'
  //     // );
  //     const NFTContract = NFTAbi__factory.connect(contractId, wallet);

  //     const transfer_from = await NFTContract.functions
  //       .transfer_from(
  //         { Address: { value: publicKey } },
  //         { ContractId: { value: contractId } },
  //         token
  //       )
  //       .txParams({ gasPrice: 50 })
  //       .call();
  //     console.log('transfer_from', transfer_from);
  //   }
  // };

  return (
    <Layout title="Nft Details">
      <Layout.TopBar onBack={() => navigate(Pages.nfts())} />
      <Layout.Content>
        {nft ? (
          <div>
            <h2>{nft.name}</h2>
            <img style={style.img} src={nft.image} alt="" />
            <h4>Description</h4>
            <h4>{nft.description}</h4>
            <h4>Attributes</h4>
            <div style={style.attributes}>
              {nft.attributes.length ? (
                nft.attributes.map((attr) => (
                  <AttrCard
                    key={attr.trait_type}
                    attrName={attr.trait_type}
                    attrValue={attr.value}
                  />
                ))
              ) : (
                <></>
              )}
            </div>
            {/* <Button aria-label="Assets" variant="ghost" onPress={transfer}>
              Trasnfer
            </Button> */}
          </div>
        ) : (
          <></>
        )}
      </Layout.Content>
    </Layout>
  );
}
