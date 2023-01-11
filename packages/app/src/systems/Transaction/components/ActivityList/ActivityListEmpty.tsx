import { cssObj } from '@fuel-ui/css';
import { Text, BoxCentered, Heading, Button, Icon, Link } from '@fuel-ui/react';

import { ImageLoader, relativeUrl } from '~/systems/Core';
import { useOpenFaucet } from '~/systems/Faucet';

type ActivityEmptyProps = {
  isDevnet?: boolean;
  bridgeUrl?: string;
};

export function ActivityListEmpty({
  isDevnet,
  bridgeUrl = '#',
}: ActivityEmptyProps) {
  const openFaucet = useOpenFaucet();
  return (
    <BoxCentered css={styles.empty}>
      <ImageLoader
        src={relativeUrl('/empty-activity.png')}
        alt="No activity"
        width={250}
        height={208}
        wrapperCSS={{ mb: '$5', mt: '$16' }}
      />
      <Heading as="h5">You don&apos;t have any activity yet</Heading>
      {!isDevnet ? (
        <Text fontSize="sm" css={styles.text}>
          Start depositing some assets <br />
          <Link href={bridgeUrl}>
            through our bridge
            <Icon icon={Icon.is('LinkSimple')} />
          </Link>
        </Text>
      ) : (
        /**
         * TODO: need to add right faucet icon on @fuel-ui
         */
        <Button size="sm" leftIcon={Icon.is('Coffee')} onPress={openFaucet}>
          Faucet
        </Button>
      )}
    </BoxCentered>
  );
}

const styles = {
  empty: cssObj({
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    textAlign: 'center',

    img: {
      transform: 'translateX(-10px)',
      mb: '$5',
      mt: '$5',
    },

    h5: {
      margin: 0,
    },
  }),
  text: cssObj({
    fontWeight: '500',
  }),
};
