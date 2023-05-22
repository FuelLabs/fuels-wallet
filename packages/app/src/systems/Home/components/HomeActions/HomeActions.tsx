import { cssObj } from '@fuel-ui/css';
import { Box, Button, Tooltip } from '@fuel-ui/react';

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
      intent="primary"
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
    <Box.Flex css={styles.wrapper}>
      {hasBalance ? (
        sendButton
      ) : (
        <Tooltip content="You don't have balance to send">{sendButton}</Tooltip>
      )}
      <Button
        isDisabled={isDisabled}
        onPress={receiveAction}
        variant="outlined"
        css={styles.button}
      >
        Receive
      </Button>
    </Box.Flex>
  );
};

const styles = {
  wrapper: cssObj({
    marginTop: '$4',
    marginBottom: '$6',
    flexShrink: 0,
    gap: '$2',
  }),
  button: cssObj({
    borderRadius: '$default',
    flex: 1,
    py: '$0',
  }),
};
