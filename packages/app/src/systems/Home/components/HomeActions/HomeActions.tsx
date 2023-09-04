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
      leftIcon={<Icon icon="Send" />}
      intent="primary"
      aria-label="Send Button"
      onPress={sendAction}
      isDisabled={isLoading || isDisabled || !hasBalance}
      css={{ ...styles.button }}
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
    px: '$4',
    pb: '$4',
    mt: '$2',
    mb: '$4',
    flexShrink: 0,
    gap: '$2',
    borderBottom: '1px solid $border',
  }),
  button: cssObj({
    borderRadius: '$default',
    flex: 1,
    py: '$0',
  }),
};
