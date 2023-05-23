import { cssObj } from '@fuel-ui/css';
import { Text, Icon, Box } from '@fuel-ui/react';

export function PinWalletText() {
  return (
    <Box>
      <Box.Flex gap="$1" justify={'center'}>
        <Text>See your wallet by clicking on </Text>
        <Icon icon={Icon.is('Puzzle')} css={styles.puzzleIcon} />
        <Text>on the top right</Text>
      </Box.Flex>
      <Box.Flex gap="$1" justify={'center'}>
        <Text>Then click on </Text>
        <Icon icon="Pinned" />
        <Text>to pin the Fuel Wallet.</Text>
      </Box.Flex>
    </Box>
  );
}

const styles = {
  puzzleIcon: cssObj({
    transform: 'rotate(90deg)',
  }),
};
