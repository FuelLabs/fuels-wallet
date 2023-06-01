import { cssObj } from '@fuel-ui/css';
import {
  Icon,
  Stack,
  FuelLogo,
  Heading,
  Button,
  Box,
  Text,
  Input,
} from '@fuel-ui/react';

import { useReportError } from '../../hooks';

import { WALLET_WIDTH, WALLET_HEIGHT } from '~/config';
import { Layout } from '~/systems/Core';
import { coreStyles } from '~/systems/Core/styles';

export function ReportErrors() {
  const { handlers, isLoadingDontSend, isLoadingSendOnce, errors } =
    useReportError();

  return (
    <Layout title="Error" isPublic>
      <Stack>
        <Layout.Content as="div">
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
                Would you like to send us the error report to help us improve
                Fuel Wallet?
              </Text>

              <Input isDisabled={true} css={styles.textArea}>
                <Input.Field as="textarea" value={errors} />
              </Input>
            </Stack>
          </Box>
        </Layout.Content>
        <Layout.BottomBar>
          <Stack css={styles.fullWidth}>
            <Button
              color="accent"
              variant="ghost"
              isDisabled={isLoadingSendOnce}
              isLoading={isLoadingSendOnce}
              onPress={handlers.reportErrorsOnce}
              aria-label="Report Error"
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
        </Layout.BottomBar>
      </Stack>
    </Layout>
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
  textArea: cssObj({
    width: '100%',
    height: '200px',
    padding: '$2',
    resize: 'none',
  }),
};
