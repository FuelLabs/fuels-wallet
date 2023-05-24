import { cssObj } from '@fuel-ui/css';
import { Box, Button, Icon, Tooltip } from '@fuel-ui/react';

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
      leftIcon={<Icon icon="Exchange" />}
      intent="primary"
      aria-label="Send Button"
      onPress={sendAction}
      isDisabled={isDisabled || !hasBalance}
      css={{ ...styles.button, ...styles.sendBtn }}
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
        leftIcon={<Icon icon="Qrcode" />}
        isDisabled={isDisabled}
        onPress={receiveAction}
        variant="ghost"
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
    marginBottom: '$4',
    flexShrink: 0,
    gap: '$2',
  }),
  button: cssObj({
    borderRadius: '$default',
    flex: 1,
    py: '$0',
  }),
  sendBtn: cssObj({
    layer: 'layer-gradient',
  }),
};
