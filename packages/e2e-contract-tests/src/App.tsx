import {
  ForwardEthCard,
  Header,
  MintAssetCard,
  Providers,
  DepositHalfEthCard,
  ForwardCustomAssetCard,
  ForwardHalfAndMintCard,
  ForwardHalfAndExternalMintCard,
  ForwardHalfCustomAssetCard,
  DepositAndMintMultiCalls,
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
      </div>
    </Providers>
  );
}

export default App;
