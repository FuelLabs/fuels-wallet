import { cssObj } from '@fuel-ui/css';
import { FuelLogo, Heading, Button, Box, Text, Input } from '@fuel-ui/react';
import { WALLET_WIDTH, WALLET_HEIGHT } from '~/config';
import { coreStyles } from '~/systems/Core/styles';

import { useReportError } from '../../hooks';

export function ReportErrors() {
  const { handlers, isLoadingSendOnce, errors } = useReportError();

  return (
    <Box.Stack css={styles.root} gap="$4">
      <Box.Stack>
        <FuelLogo size={30} />
        <Heading as="h3" css={styles.title}>
          Unexpected Error
        </Heading>
      </Box.Stack>
      <Box.Stack css={styles.content}>
        <Text>
          Unexpected errors detected. We&apos;re sorry for the inconvenience.
          <br />
          Would you like to send the following error logs to Fuel Wallet team?
        </Text>
        <Input isDisabled={true} css={styles.textArea}>
          <Input.Field as="textarea" name="reports" value={errors} />
        </Input>
      </Box.Stack>
      <Box.Stack>
        <Button
          intent="primary"
          isDisabled={isLoadingSendOnce}
          isLoading={isLoadingSendOnce}
          onClick={handlers.reportErrors}
          aria-label="Report Error"
        >
          Send reports
        </Button>
        <Button
          variant="ghost"
          onClick={handlers.ignoreErrors}
          aria-label="Don't send error report"
        >
          Ignore
        </Button>
      </Box.Stack>
    </Box.Stack>
  );
}

const styles = {
  root: cssObj({
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 999999,
    width: WALLET_WIDTH,
    height: WALLET_HEIGHT,
    padding: '$4',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid $border',
  }),
  title: cssObj({
    marginBottom: 0,
  }),
  content: cssObj({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  }),
  textArea: cssObj({
    flex: 1,
    height: '200px',
    padding: '$2',
    paddingRight: 0,

    '& textarea': {
      resize: 'none',
      ...coreStyles.scrollable(),
    },
  }),
};
