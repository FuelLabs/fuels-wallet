import { cssObj } from '@fuel-ui/css';
import { Box, FuelLogo } from '@fuel-ui/react';

export function HeaderFuelBranding({
  title = 'Fuel Wallet',
}: { title: string }) {
  return (
    <Box.Flex css={{ alignItems: 'center' }}>
      <FuelLogo size={40} />
      <Box.Flex css={styles.logoText}>
        <span>{title}</span>
        <Box as="span" css={styles.version}>
          beta
        </Box>
      </Box.Flex>
    </Box.Flex>
  );
}

const styles = {
  logoText: cssObj({
    pl: '$6',
    alignItems: 'center',
    flex: 1,
    fontSize: '$2xl',
    fontWeight: '$normal',
    color: 'white',
    letterSpacing: '-0.05em',
  }),
  version: cssObj({
    ml: '$2',
    color: '$intentsBase8',
    fontSize: '$sm',
    fontStyle: 'italic',
  }),
};
