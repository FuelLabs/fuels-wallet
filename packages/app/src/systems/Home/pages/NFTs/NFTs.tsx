import { Button } from '@fuel-ui/react';
import { Address } from 'fuels';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useAccounts } from '~/systems/Account';
import { Layout, Pages } from '~/systems/Core';

export function NFTs() {
  const { account } = useAccounts();
  const [nfts, setNfts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const goToAssets = () => {
    navigate(Pages.wallet());
  };

  useEffect(() => {
    const loadData = async () => {
      if (account) {
        const publicKey = Address.fromString(account.address).toB256();
        const data = await fetch(
          `https://fuel-nft-apis.vercel.app/owner-nfts/${publicKey.slice(2)}`
        );
        const result = await data.json();
        console.log(result);

        setNfts(result);
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // const AllNftsStyle = {
  //   display: 'grid',
  //   gridTemplateColumns: '1fr 1fr',
  // };
  const style = {
    allNfts: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
    },
    nft: {},
  };
  return (
    <Layout title="NFTs">
      <Layout.TopBar onBack={() => navigate(Pages.wallet())} />
      <Layout.Content>
        <div style={style.allNfts}>
          {nfts ? (
            nfts.map((data, index) => (
              <div key={index} style={style.nft}>
                <div>
                  <Link
                    to={Pages.nftDetails({
                      contractId: `0x${  data.nft_contract}`,
                      token: data.token_id.toString(),
                    })}
                  >
                    <img
                      style={{ height: '120px', width: '120px' }}
                      src={data.nft_data.image}
                      alt="Fuelart"
                    />
                  </Link>
                  <h5>{data.nft_data.name}</h5>
                </div>
              </div>
            ))
          ) : (
            <></>
          )}
        </div>
      </Layout.Content>
      <Layout.BottomBar>
        <Button aria-label="Assets" variant="ghost" onPress={goToAssets}>
          Assets
        </Button>
        <Button aria-label="NFTs" isLoading={isLoading}>
          NFTs
        </Button>
      </Layout.BottomBar>
    </Layout>
  );
}
