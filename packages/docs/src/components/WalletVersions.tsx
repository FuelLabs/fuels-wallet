import { cssObj } from '@fuel-ui/css';
import { Box, Text } from '@fuel-ui/react';
import { Heading } from '~/src/components/Heading';
import { Link } from '~/src/components/Link';
import { UL } from '~/src/components/List';
import {
  WALLET_LINK_NEXT,
  WALLET_LINK_PROD,
  WALLET_LINK_STAGING,
} from '~/src/constants';

export function WalletVersions() {
  return (
    <section style={styles.root}>
      <Heading data-rank="h1">Wallet Versions</Heading>
      <UL>
        <li>
          <Text>
            <Link href={WALLET_LINK_PROD}>Fuel Wallet</Link> - Stable - The
            official version on Chrome Store.
          </Text>
        </li>
        <li>
          <Text>
            <Link href={WALLET_LINK_STAGING}>Fuel Wallet Development</Link> -
            Development - The development version on Chrome Store
          </Text>
        </li>
        <li>
          <Text>
            <Link href={WALLET_LINK_NEXT}>Fuel Wallet Next</Link> - Latest -
            Contains the latest changes. Available only in zip format
          </Text>
        </li>
      </UL>
    </section>
  );
}

const styles = {
  root: cssObj({
    marginTop: 100,
  }),
};
