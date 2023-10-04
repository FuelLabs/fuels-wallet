import { cssObj } from '@fuel-ui/css';
import { Button, Card, Heading, Icon, Text } from '@fuel-ui/react';
import { useOpenFaucet } from '~/systems/Faucet';

export type AssetListEmptyProps = {
  showFaucet?: boolean;
  text?: string;
  supportText?: string;
};

export function AssetListEmpty({
  showFaucet,
  text = `You don't have any assets`,
  supportText = 'Start depositing some assets',
}: AssetListEmptyProps) {
  const openFaucet = useOpenFaucet();

  return (
    <Card css={styles.empty}>
      <Card.Body>
        {!!text && <Heading as="h5">{text}</Heading>}
        {!!supportText && <Text fontSize="sm">{supportText}</Text>}
        {showFaucet && (
          /**
           * TODO: need to add right faucet icon on @fuel-ui
           */
          <Button
            size="sm"
            intent="primary"
            leftIcon={Icon.is('Wand')}
            onPress={openFaucet}
          >
            Faucet
          </Button>
        )}
      </Card.Body>
    </Card>
  );
}

const styles = {
  empty: cssObj({
    h5: {
      margin: 0,
    },
    button: {
      mt: '$4',
    },
  }),
};
