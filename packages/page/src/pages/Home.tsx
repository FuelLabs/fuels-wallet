import { BoxCentered, Button, Link, Box } from '@fuel-ui/react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <BoxCentered minHS minWS gap="$2" direction="column">
      <Box
        css={{
          marginBottom: '$6',
        }}
      >
        <Button onPress={() => navigate('dapp')}>Wallet Test</Button>
      </Box>
      <Link download={true} href={import.meta.env.VITE_WALLET_DOWNLOAD_URL}>
        Download Wallet
      </Link>
      <Link href={import.meta.env.VITE_WALLET_PREVIEW_URL}>Wallet Preview</Link>
      <Link href={import.meta.env.VITE_STORYBOOK_URL}>Check our Storybook</Link>
    </BoxCentered>
  );
}

export default Home;
