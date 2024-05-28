import { cssObj } from '@fuel-ui/css';
import { Box, Button, Image, Text } from '@fuel-ui/react';
import { usePathname, useRouter } from 'next/navigation';

import connectorsPreviewImg from '../../public/connectors-preview.png';

export function SDKSection() {
  const { push } = useRouter();
  const pathname = usePathname();

  // Allows routing to work regardless of path structure (e.g. docs hub)
  function routeToGettingStarted() {
    const basePath = pathname.split('/').slice(0, -2).join('/');
    const newCompletePath = `${basePath}/dev/getting-started/`;
    push(newCompletePath);
  }

  return (
    <Box.Flex css={styles.root} justify={'center'}>
      <Image height={300} src={connectorsPreviewImg.src} />
      <Box css={styles.action}>
        <Text css={styles.text}>
          If you are a developer and want to integrate Fuel Wallet into your
          DApp, you can do so by following the Fuel Wallet SDK.
        </Text>
        <Box>
          <Button
            size="lg"
            intent="base"
            variant="outlined"
            onPress={routeToGettingStarted}
          >
            GET STARTED
          </Button>
        </Box>
      </Box>
    </Box.Flex>
  );
}

const styles = {
  text: cssObj({
    marginBottom: '$8',
  }),
  action: cssObj({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alginItems: 'end',
    marginTop: '$8',
  }),
  root: cssObj({
    pt: '2px',
    pb: '3px',
    mb: 100,
    gap: '$12',
  }),
};
