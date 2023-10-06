import {
  ForwardEthCard,
  Header,
  MintAssetCard,
  Providers,
  DepositHalfEthCard,
  ForwardCustomAssetCard,
  ForwardHalfAndMintCard,
  ForwardHalfAndExternalMintCard,
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
        <ForwardHalfAndMintCard />
        <ForwardHalfAndExternalMintCard />
      </div>
    </Providers>
  );
}

export default App;
