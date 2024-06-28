import { cssObj } from '@fuel-ui/css';
import { Box, Button, Heading, Image, Text } from '@fuel-ui/react';

import { useExtensionTitle } from '~/src/hooks/useExtensionTitle';
import walletPrivewImg from '../../public/fuell-wallet-preview.png';
import braveImg from '../../public/icons/browser/brave.png';
import chomreImg from '../../public/icons/browser/chrome.png';
import edgeImg from '../../public/icons/browser/edge.png';
import { INSTALL_LINK } from '../constants';

export function InstallSection() {
  const title = useExtensionTitle();

  return (
    <Box.Flex css={styles.root} justify={'center'}>
      <Box.Flex css={styles.content} justify="space-between">
        <Box.Stack css={styles.head}>
          <Box.Stack css={styles.header}>
            <Heading color="brand" css={styles.headerIntro}>
              The Official
            </Heading>
            <Heading css={styles.title} fontSize={'7xl'}>
              Fuel Wallet
            </Heading>
            <Text fontSize="lg">
              With the Fuel Wallet, <br /> you can explore DApps on Fuel <br />{' '}
              and manage your crypto assets, <br /> all in one place.
            </Text>
          </Box.Stack>
          <Box.Stack css={styles.action} justify={'end'}>
            {!!INSTALL_LINK && (
              <a href={INSTALL_LINK} target="_blank" rel="noreferrer">
                <Button size="lg" intent="primary">
                  Install {title}
                </Button>
              </a>
            )}
            <Box.Stack>
              <Text fontSize="sm">Supported on</Text>
              <Box.Flex gap={'$2'}>
                <Image height={20} src={braveImg.src} />
                <Image height={20} src={chomreImg.src} />
                <Image height={20} src={edgeImg.src} />
              </Box.Flex>
            </Box.Stack>
          </Box.Stack>
        </Box.Stack>
        <Box css={styles.img}>
          <Image src={walletPrivewImg.src} />
        </Box>
      </Box.Flex>
    </Box.Flex>
  );
}

const styles = {
  img: cssObj({
    maxWidth: '50%',
    overflow: 'hidden',
    '& > img': {
      width: 500,
    },
    '@media (max-width: 600px)': {
      display: 'none',
    },
  }),
  action: cssObj({
    flex: 1,
  }),
  head: cssObj({
    height: 500,
  }),
  root: cssObj({
    pt: '2px',
    pb: '3px',
    mb: 100,
  }),
  content: cssObj({
    maxWidth: 1100,
    width: '100%',
  }),
  header: cssObj({
    marginTop: '$4',
  }),
  headerIntro: cssObj({
    textTransform: 'uppercase',
  }),
  title: cssObj({
    marginTop: 0,
  }),
};
