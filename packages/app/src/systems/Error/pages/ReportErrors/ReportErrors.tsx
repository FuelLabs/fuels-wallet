import { cssObj } from '@fuel-ui/css';
import {
  Alert,
  Box,
  Button,
  FuelLogo,
  HStack,
  Heading,
  Text,
} from '@fuel-ui/react';
import { Icon, IconButton, Tooltip } from '@fuel-ui/react';
import type { StoredFuelWalletError } from '@fuel-wallet/types';
import { JsonEditor } from 'json-edit-react';
import { useEffect, useMemo, useState } from 'react';
import { WALLET_HEIGHT, WALLET_WIDTH } from '~/config';
import { coreStyles } from '~/systems/Core/styles';
import { useReportError } from '../../hooks';

export function ReportErrors({ onRestore }: { onRestore: () => void }) {
  const { handlers, isLoadingSendOnce, errors } = useReportError();
  const [currentPage, setCurrentPage] = useState(0);

  const [currentErrors, setCurrentErrors] =
    useState<StoredFuelWalletError[]>(errors);
  const shownError = useMemo(() => {
    const err = currentErrors?.[currentPage]?.error;
    if (!err) return undefined;
    return JSON.parse(JSON.stringify(err, Object.getOwnPropertyNames(err)));
  }, [currentPage, currentErrors?.[currentPage]?.error]);
  console.log('fsk shownError', shownError);

  useEffect(() => {
    setCurrentErrors(errors);
    if (!errors.length) {
      onRestore();
    }
  }, [errors, onRestore]);

  useEffect(() => {}, []);

  function reportErrors() {
    handlers.reportErrors();
    onRestore();
  }

  function ignoreErrors() {
    handlers.ignoreErrors();
    onRestore();
  }

  const onUpdate: Parameters<typeof JsonEditor>[0]['onUpdate'] = (newJson) => {
    const { newData } = newJson;
    if (!!newData && 'message' in newData && 'stack' in newData) {
      setCurrentErrors((prev) => {
        const errorsClone = [...prev];
        // errorsClone[currentPage] = newData as Error;
        return errorsClone;
      });
    }
  };

  function dismissCurrentError() {
    handlers.dismissError(currentPage);
    setCurrentPage((prev) => {
      if (prev === errors.length - 1) {
        return prev - 1;
      }
      return prev;
    });
  }

  const hasPreviousError = !!errors.length && currentPage - 1 >= 0;
  const hasNextError = !!errors.length && currentPage + 1 <= errors.length - 1;

  return (
    <Box.Stack css={styles.root} gap="$4" data-scrollable>
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
        <HStack css={styles.controlsContainer}>
          <Box css={styles.editorControls}>
            <Tooltip content="Dismiss current error" side="top">
              <IconButton
                variant="ghost"
                aria-label="Dismiss error"
                icon={Icon.is('X')}
                disabled={!shownError}
                onPress={dismissCurrentError}
                size="xs"
              />
            </Tooltip>
          </Box>
          <HStack css={styles.pageControls}>
            <Text>
              {currentPage + 1} / {errors.length}
            </Text>
            <IconButton
              variant="ghost"
              aria-label="Previous error"
              icon={Icon.is('ChevronLeft')}
              disabled={!hasPreviousError}
              size="xs"
              onPress={() =>
                hasPreviousError && setCurrentPage((prev) => prev - 1)
              }
            />
            <IconButton
              variant="ghost"
              aria-label="Next error"
              icon={Icon.is('ChevronRight')}
              disabled={!hasNextError}
              size="xs"
              onPress={() => hasNextError && setCurrentPage((prev) => prev + 1)}
            />
          </HStack>
        </HStack>
        <JsonEditor
          data={shownError ?? {}}
          onUpdate={onUpdate}
          restrictEdit
          restrictAdd
          restrictDrag
          indent={0}
          theme={[
            'githubDark',
            {
              iconEdit: 'grey',
              boolean: {
                color: 'red',
                fontStyle: 'italic',
                fontWeight: 'bold',
                fontSize: '80%',
              },
            },
          ]}
        />
      </Box.Stack>
      <Box.Stack>
        <Alert status="warning">
          <Alert.Description as="div">
            <Text>
              Ultimately it's your responsibility to ensure no private
              information is sent.
            </Text>
          </Alert.Description>
        </Alert>
        <Button
          intent="primary"
          isDisabled={isLoadingSendOnce}
          isLoading={isLoadingSendOnce}
          onPress={reportErrors}
          aria-label="Report Error"
        >
          Send reports
        </Button>
        <Button
          variant="ghost"
          onPress={ignoreErrors}
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
    overflowY: 'scroll',
    overflowX: 'hidden',
  }),
  controlsContainer: cssObj({
    display: 'flex',
    justifyContent: 'space-between',
  }),
  editorControls: cssObj({
    display: 'flex',
    justifyContent: 'flex-start',
  }),
  pageControls: cssObj({
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
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
