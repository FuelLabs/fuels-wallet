import { cssObj } from '@fuel-ui/css';
import {
  Card,
  IconButton,
  Icon,
  Box,
  Stack,
  FuelLogo,
  Heading,
  Button,
  Text,
} from '@fuel-ui/react';

import { WALLET_WIDTH, WALLET_HEIGHT } from '~/config';

type ReportErrorsCardProps = {
  onClose: () => void;
  onSendAlways: () => void;
  onSendOnce: () => void;
  onDontSend: () => void;
  isLoadingSendAlways: boolean;
  isLoadingSendOnce: boolean;
  isLoadingDontSend: boolean;
};

export function ReportErrorsCard(props: ReportErrorsCardProps) {
  const {
    onClose,
    onSendAlways: onAlwaysSend,
    onSendOnce,
    onDontSend,
    isLoadingDontSend,
    isLoadingSendAlways,
    isLoadingSendOnce,
  } = props;
  return (
    <Card css={styles.content}>
      <Card.Body css={styles.body}>
        {onClose && (
          <IconButton
            variant="link"
            icon={<Icon icon="X" color="gray8" />}
            aria-label="Close unlock card"
            onPress={onClose}
            css={styles.closeButton}
          />
        )}
        <Box as="div">
          <Stack align="center">
            <FuelLogo size={60} />
            <Heading as="h3">Help us improve Fuel Wallet</Heading>
          </Stack>
          <Stack align="center">
            <Icon icon="AlertTriangle" size={32} />
            <Heading as="h5">What happened?</Heading>
            <Text>
              Fuel Wallet has detected unreported crashes. We&apos;re sorry for
              the inconvenience.
              <br />
              <br />
              Would you like to send us a crash report to help us improve Fuel
              Wallet?
            </Text>
          </Stack>
        </Box>
      </Card.Body>
      <Card.Footer>
        <Stack gap="$6" align="center" css={styles.fullWidth}>
          <Stack gap="$2" align="center" css={styles.fullWidth}>
            <Button
              css={styles.actionButton}
              onPress={onAlwaysSend}
              isLoading={isLoadingSendAlways}
            >
              Always Send
            </Button>
            <Button
              css={styles.actionButton}
              onPress={onSendOnce}
              isLoading={isLoadingSendOnce}
            >
              Send this time
            </Button>
          </Stack>
          <Button
            variant="solid"
            color="amber"
            css={styles.actionButton}
            onPress={onDontSend}
            isLoading={isLoadingDontSend}
          >
            Don&apos;t Send
          </Button>
        </Stack>
      </Card.Footer>
    </Card>
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
};
