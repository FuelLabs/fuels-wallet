import { cssObj } from '@fuel-ui/css';
import { Button, Flex } from '@fuel-ui/react';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { Pages } from '~/systems/Core';

export type HomeActionsProps = {
  isDisabled?: boolean;
};

export const HomeActions = ({ isDisabled }: HomeActionsProps) => {
  const navigate = useNavigate();

  const goToReceive = useCallback(() => {
    navigate(Pages.receive());
  }, [navigate]);

  return (
    <Flex css={styles.wrapper}>
      <Button isDisabled={isDisabled} css={styles.button}>
        Send
      </Button>
      <Button
        size="sm"
        isDisabled={isDisabled}
        onClick={goToReceive}
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
