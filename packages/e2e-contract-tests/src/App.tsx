import { ForwardEthCard, Header, MintAssetCard, Providers } from './components';

function App() {
  return (
    <Providers>
      <Header />
      <div>
        <MintAssetCard />
        <ForwardEthCard />
      </div>
    </Providers>
  );
}

export default App;
