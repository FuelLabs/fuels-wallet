import { cssObj } from '@fuel-ui/css';
import { Flex, Card, Text, Icon, Box } from '@fuel-ui/react';

export function PinWalletCard() {
  return (
    <Card css={styles.card}>
      <Card.Body css={styles.cardBody}>
        <Box>
          <Text as="h2" color="accent11">
            Pin Fuel Wallet
          </Text>
          <Flex gap="$1">
            <Text>Click on</Text>
            <Icon
              icon={Icon.is('PuzzlePiece')}
              color="accent11"
              css={styles.puzzleIcon}
            />
            <Text>and</Text>
            <Icon icon={'PushPin'} color="accent11" />
            <Text>.</Text>
          </Flex>
        </Box>
      </Card.Body>
    </Card>
  );
}

const styles = {
  cardBody: cssObj({
    padding: '$2',
    marginLeft: '$2',
  }),
  card: cssObj({
    position: 'absolute',
    top: '$6',
    right: '$6',
    width: 200,
    alignItems: 'center',
    '&:after': {
      display: 'block',
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '3px',
      height: '100%',
      borderTopLeftRadius: '$md',
      borderBottomLeftRadius: '$md',
      backgroundColor: '$accent11',
    },
  }),
  puzzleIcon: cssObj({
    transform: 'rotate(90deg)',
  }),
};
