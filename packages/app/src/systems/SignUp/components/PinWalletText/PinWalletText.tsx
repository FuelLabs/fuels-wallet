import { cssObj } from '@fuel-ui/css';
import { Flex, Text, Icon, Box } from '@fuel-ui/react';

export function PinWalletText() {
  return (
    <Box>
      <Flex gap="$1" justify={'center'}>
        <Text>See your wallet by clicking on </Text>
        <Icon icon={Icon.is('PuzzlePiece')} css={styles.puzzleIcon} />
        <Text>on the top right.</Text>
      </Flex>
      <Flex gap="$1" justify={'center'}>
        <Text>Then click on </Text>
        <Icon icon={'PushPin'} />
        <Text>to pin the Fuel Wallet.</Text>
      </Flex>
    </Box>
  );
}

const styles = {
  puzzleIcon: cssObj({
    transform: 'rotate(90deg)',
  }),
};
