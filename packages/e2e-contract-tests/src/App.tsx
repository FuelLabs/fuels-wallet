import { Box, Card } from '@fuel-ui/react';
import { Header, MintAssetCard, Providers } from './components';

function App() {
  return (
    <Providers>
      <Header />
      <Box.Flex justify="space-around" css={{ marginTop: '40px' }}>
        <MintAssetCard />
        <Card>
          <Card.Header>Filler</Card.Header>
          <Card.Body>Hello</Card.Body>
        </Card>
        <Card>
          <Card.Header>Filler</Card.Header>
          <Card.Body>Hello</Card.Body>
        </Card>
      </Box.Flex>
    </Providers>
  );
}

export default App;
