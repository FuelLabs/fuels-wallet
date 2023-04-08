import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Layout, Pages } from '~/systems/Core';

export function NFTDetails() {
  const [nft, setNft] = useState({ name: '', image: '', description: '' });
  const navigate = useNavigate();
  const { contractId, token } = useParams();

  useEffect(() => {
    const loadData = async () => {
      const data = await fetch(
        `https://fuel-nft-apis.vercel.app/nft/${contractId}/${token}`
      );
      const result = await data.json();

      console.log(result);
      setNft(result.nft_data);
    };
    loadData();
  }, []);

  const style = {
    width: '100%',
  };

  return (
    <Layout title="Nft Details">
      <Layout.TopBar onBack={() => navigate(Pages.nfts())} />
      <Layout.Content>
        {nft ? (
          <div>
            <h2>{nft.name}</h2>
            <img style={style} src={nft.image} alt="" />
            <h4>Description</h4>
            <h4>{nft.description}</h4>
          </div>
        ) : (
          <></>
        )}
      </Layout.Content>
    </Layout>
  );
}
