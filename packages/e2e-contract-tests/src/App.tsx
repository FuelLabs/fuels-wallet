import {
  ForwardEthCard,
  Header,
  MintAssetCard,
  Providers,
  DepositHalfEthCard,
  ForwardCustomAssetCard,
  ForwardHalfCustomAssetCard,
  ForwardHalfAndMintCard,
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
        <ForwardHalfCustomAssetCard />
        <ForwardHalfAndMintCard />
        <DepositAndMintMultiCalls />
      </div>
    </Providers>
  );
}

export default App;
