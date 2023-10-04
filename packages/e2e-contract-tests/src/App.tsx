import { Header, MintAssetCard, Providers } from './components';

function App() {
  return (
    <Providers>
      <Header />
      <div>
        <MintAssetCard />
      </div>
    </Providers>
  );
}

export default App;
