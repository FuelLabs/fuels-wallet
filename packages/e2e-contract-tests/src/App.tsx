import { Box, Button, Card, Nav, ThemeProvider } from '@fuel-ui/react';

function App() {
  return (
    <ThemeProvider>
      <Nav>
        <Nav.Desktop>
          <Nav.Logo />
        </Nav.Desktop>
      </Nav>
      <Box.Flex justify="space-around" css={{ marginTop: '40px' }}>
        <Card>
          <Card.Header>Mint Custom Asset</Card.Header>
          <Card.Body>
            <Button onPress={() => {}} css={{ width: '$full' }}>
              Mint
            </Button>
          </Card.Body>
        </Card>
        <Card>
          <Card.Header>Mint Custom Asset</Card.Header>
          <Card.Body>Hello</Card.Body>
        </Card>
        <Card>
          <Card.Header>Mint Custom Asset</Card.Header>
          <Card.Body>Hello</Card.Body>
        </Card>
      </Box.Flex>
    </ThemeProvider>
  );
}

export default App;
