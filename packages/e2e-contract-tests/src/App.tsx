import { Toaster } from 'react-hot-toast';

import {
  ForwardEthCard,
  Header,
  MintAssetCard,
  RevertCard,
  Providers,
  DepositHalfEthCard,
  ForwardCustomAssetCard,
  ForwardHalfAndMintCard,
  ForwardHalfAndExternalMintCard,
  ForwardHalfCustomAssetCard,
  DepositAndMintMultiCalls,
  AssetConfigurationCard,
} from './components';

function App() {
  return (
    <Providers>
      <Header />
      <div>
        <MintAssetCard />
        <ForwardEthCard />
        <DepositHalfEthCard />
        <ForwardCustomAssetCard />
        <ForwardHalfAndExternalMintCard />
        <ForwardHalfCustomAssetCard />
        <ForwardHalfAndMintCard />
        <DepositAndMintMultiCalls />
        <AssetConfigurationCard />
        <RevertCard />
      </div>
      <Toaster />
    </Providers>
  );
}

export default App;
