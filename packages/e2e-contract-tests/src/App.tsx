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
      </div>
    </Providers>
  );
}

export default App;
