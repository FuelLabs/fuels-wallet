import { Toaster } from 'react-hot-toast';

import './style.css';

import {
  AssetConfigurationCard,
  DepositAndMintMultiCalls,
  DepositHalfEthCard,
  ForwardCustomAssetCard,
  ForwardEthCard,
  ForwardHalfAndExternalMintCard,
  ForwardHalfAndMintCard,
  ForwardHalfCustomAssetCard,
  Header,
  MintAssetCard,
  Providers,
  RevertCard,
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
