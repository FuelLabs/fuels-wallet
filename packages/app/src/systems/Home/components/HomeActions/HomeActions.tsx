import { cssObj } from '@fuel-ui/css';
import { Button, Flex, Tooltip } from '@fuel-ui/react';

import { useAccounts } from '~/systems/Account';

export type HomeActionsProps = {
  isDisabled?: boolean;
  receiveAction?: () => void;
  sendAction?: () => void;
};

export const HomeActions = ({
  isDisabled,
  receiveAction = () => {},
  sendAction = () => {},
}: HomeActionsProps) => {
  const { hasBalance, isLoading } = useAccounts();

  const sendButton = (
    <Button
      aria-label="Send Button"
      onPress={sendAction}
      isDisabled={isDisabled || !hasBalance}
      css={styles.button}
      isLoading={isLoading}
    >
      Send
    </Button>
  );

  return (
    <Flex css={styles.wrapper}>
      {hasBalance ? (
        sendButton
      ) : (
        <Tooltip content="You don't have balance to send">{sendButton}</Tooltip>
      )}
      <Button
        isDisabled={isDisabled}
        onPress={receiveAction}
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
    borderRadius: '$full',
    flex: 1,
    py: '$0',
  }),
};
