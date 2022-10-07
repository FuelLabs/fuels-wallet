import { cssObj } from '@fuel-ui/css';
import { Button, Flex } from '@fuel-ui/react';

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
  return (
    <Flex css={styles.wrapper}>
      <Button onClick={sendAction} isDisabled={isDisabled} css={styles.button}>
        Send
      </Button>
      <Button
        size="sm"
        isDisabled={isDisabled}
        onClick={receiveAction}
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
