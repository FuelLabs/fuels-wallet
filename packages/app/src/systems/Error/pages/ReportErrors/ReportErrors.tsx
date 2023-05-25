import { cssObj } from '@fuel-ui/css';
import {
  Dialog,
  IconButton,
  Icon,
  Stack,
  FuelLogo,
  Heading,
  Button,
  Box,
  Text,
} from '@fuel-ui/react';

import { useReportError } from '../../hooks';

import { WALLET_WIDTH, WALLET_HEIGHT } from '~/config';
import { coreStyles } from '~/systems/Core/styles';

export function ReportErrors() {
  const {
    handlers,
    isLoadingDontSend,
    isLoadingSendAlways,
    isLoadingSendOnce,
  } = useReportError();

  const isLoading =
    isLoadingDontSend || isLoadingSendAlways || isLoadingSendOnce;

  return (
    <>
      <Dialog.Heading>
        Report Errors
        <IconButton
          data-action="closed"
          variant="link"
          icon={<Icon icon="X" color="gray8" />}
          aria-label="Close error dialog"
          isDisabled={isLoading}
          onPress={handlers.close}
        />
      </Dialog.Heading>
      <Dialog.Description as="div">
        <Box as="div">
          <Stack align="center">
            <FuelLogo size={60} />
            <Heading as="h3">Help us improve Fuel Wallet</Heading>
          </Stack>
          <Stack align="center">
            <Icon icon="AlertTriangle" size={32} />
            <Heading as="h5">What happened?</Heading>
            <Text>
              Fuel Wallet has detected unreported errors / crashes. We&apos;re
              sorry for the inconvenience.
              <br />
              <br />
              Would you like to send us the error report to help us improve Fuel
              Wallet?
            </Text>
          </Stack>
        </Box>
      </Dialog.Description>
      <Dialog.Footer>
        <Stack css={styles.fullWidth}>
          {/* <Button
            color="accent"
            isDisabled={isLoadingSendAlways}
            isLoading={isLoadingSendAlways}
            onPress={handlers.alwaysReportErrors}
            aria-label="Report Error Always"
          >
            Always Send
          </Button> */}
          <Button
            color="accent"
            variant="ghost"
            isDisabled={isLoadingSendOnce}
            isLoading={isLoadingSendOnce}
            onPress={handlers.reportErrorsOnce}
            aria-label="Report Error Once"
          >
            Send to Fuel
          </Button>
          <Button
            color="gray"
            isDisabled={isLoadingDontSend}
            isLoading={isLoadingDontSend}
            onPress={handlers.dontReportErrors}
            aria-label="Don't send error report"
          >
            Don&apos;t Send
          </Button>
        </Stack>
      </Dialog.Footer>
    </>
  );
}

const styles = {
  content: cssObj({
    width: WALLET_WIDTH,
    height: WALLET_HEIGHT,
    maxWidth: WALLET_WIDTH,
    maxHeight: 'none',
    position: 'relative',
  }),
  body: cssObj({
    flex: 1,
  }),
  closeButton: cssObj({
    position: 'absolute',
    top: '$4',
    right: '$4',
  }),
  actionButton: cssObj({
    width: '100%',
  }),
  fullWidth: cssObj({
    width: '100%',
  }),
  description: cssObj({
    ...coreStyles.scrollable('$gray3'),
    padding: '$4',
    flex: 1,
  }),
  alert: cssObj({
    '& .fuel_alert--content': {
      gap: '$1',
    },
    ' & .fuel_heading': {
      fontSize: '$sm',
    },
    marginBottom: '$3',
  }),
  alertDescription: cssObj({
    fontWeight: '$bold',
  }),
};
