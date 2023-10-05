import { Header, MintAssetCard, Providers } from './components';
import { DepositHalfEthCard } from './components/DepositHalfEthCard';

function App() {
  return (
    <Providers>
      <Header />
      <div>
        <MintAssetCard />
        <DepositHalfEthCard />
      </div>
    </Providers>
  );
}

export default App;
