import { cssObj } from '@fuel-ui/css';
import { Button, Flex } from '@fuel-ui/react';

export type WalletActionsProps = {
  isDisabled?: boolean;
};

export const WalletActions = ({ isDisabled }: WalletActionsProps) => {
  return (
    <Flex css={styles.wrapper}>
      <Button isDisabled={isDisabled} css={styles.button}>
        Send
      </Button>
      <Button
        size="sm"
        isDisabled={isDisabled}
        variant="outlined"
        color="gray"
        css={styles.button}
      >
        Receive
      </Button>
    </Flex>
  );
};

const styles = {
  wrapper: cssObj({
    marginTop: '$8',
    marginBottom: '$6',
    flexShrink: 0,
    gap: '$2',
  }),
  button: cssObj({
    borderRadius: 40,
    marginLeft: '$1',
    flex: 1,
    py: '$5',
  }),
};
