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
import { scrollable } from '~/systems/Core';
import { coreStyles } from '~/systems/Core/styles';
import { useReportError } from '../../hooks';

// Level/Name
const PROTECTED_ERROR_PROPERTIES = {
  0: {
    root: true,
  },
  1: {
    stack: true,
    message: true,
  },
};

export function ReportErrors({
  onRestore,
  errorBoundary,
}: { onRestore: () => void; errorBoundary?: boolean }) {
  const { handlers, isLoadingSendOnce, errors } = useReportError();
  const [currentPage, setCurrentPage] = useState(0);

  const [currentErrors, setCurrentErrors] =
    useState<StoredFuelWalletError[]>(errors);
  const shownError = useMemo(() => {
    const err = currentErrors?.[currentPage]?.error;
    if (!err) return undefined;
    return JSON.parse(JSON.stringify(err, Object.getOwnPropertyNames(err)));
  }, [currentPage, currentErrors?.[currentPage]]);

  useEffect(() => {
    setCurrentErrors(errors);
    if (!errors.length && !errorBoundary) {
      onRestore();
    }
  }, [errors, errorBoundary, onRestore]);

  useEffect(() => {}, []);

  function reportErrors() {
    handlers.reportErrors();
    onRestore();
  }

  function ignoreErrors() {
    handlers.reloadErrors();
    onRestore();
  }

  function dismissAllErrors() {
    handlers.dismissAllErrors();
    onRestore();
  }

  const onDelete: Parameters<typeof JsonEditor>[0]['onDelete'] = (newJson) => {
    const { path: paths } = newJson;
    let level = 0;
    setCurrentErrors((prev) => {
      const currentErrorData = prev[currentPage];
      const errorClone = currentErrorData.error;
      let modified = false;
      let currentErrorPath = errorClone;
      for (const path of paths) {
        level++;
        if (PROTECTED_ERROR_PROPERTIES[level]?.[path]) {
          return prev;
        }
        if (level === paths.length) {
          delete currentErrorPath[path];
          modified = true;
        }
        currentErrorPath = currentErrorPath[path];
      }
      if (modified) {
        const errorsClone = [...prev];
        errorsClone[currentPage] = {
          ...errorsClone[currentPage],
          error: errorClone,
        };
        return errorsClone;
      }
      return prev;
    });
  };

  function dismissCurrentError() {
    handlers.dismissError(currentErrors?.[currentPage]?.id);
    setCurrentPage((prev) => {
      if (errors.length - 1 === 0) {
        onRestore();
        return 0;
      }
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
        <Box.Stack direction="row" justify="space-between">
          <FuelLogo size={30} />
          <IconButton
            variant="outlined"
            aria-label="Ignore error(s)"
            icon={Icon.is('X')}
            onPress={ignoreErrors}
            size="xs"
          />
        </Box.Stack>
        <Heading as="h3" css={styles.title}>
          Unexpected Error
        </Heading>
        <Alert status="warning">
          <Alert.Description as="div">
            Ultimately it's your responsibility to ensure no private information
            is sent.
          </Alert.Description>
        </Alert>
      </Box.Stack>
      <Box.Stack css={styles.content}>
        <Text>
          Would you like to send the following error logs to Fuel Wallet team?
        </Text>
        <HStack css={styles.controlsContainer}>
          <Box css={styles.editorControls}>
            <Tooltip content="Dismiss current error" side="top">
              <IconButton
                variant="ghost"
                intent="error"
                aria-label="Dismiss error"
                icon={Icon.is('Trash')}
                isDisabled={!shownError}
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
              isDisabled={!hasPreviousError}
              size="xs"
              onPress={() =>
                hasPreviousError && setCurrentPage((prev) => prev - 1)
              }
            />
            <IconButton
              variant="ghost"
              aria-label="Next error"
              icon={Icon.is('ChevronRight')}
              isDisabled={!hasNextError}
              size="xs"
              onPress={() => hasNextError && setCurrentPage((prev) => prev + 1)}
            />
          </HStack>
        </HStack>
        <JsonEditor
          data={shownError ?? {}}
          onDelete={onDelete}
          restrictEdit
          restrictAdd
          restrictDrag
          restrictDelete={({ key, level }) => {
            return PROTECTED_ERROR_PROPERTIES[level]?.[key];
          }}
          indent={0}
          data-scrollable
          theme={[
            'monoDark',
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
      <Box.Stack direction="row">
        <Tooltip content="Dismiss all errors permanently" side="top">
          <Button
            css={styles.actionButton}
            variant="ghost"
            onPress={dismissAllErrors}
            isDisabled={!shownError}
            aria-label="Ignore and dismiss all errors permanently"
          >
            Dismiss
          </Button>
        </Tooltip>
        <Button
          css={styles.actionButton}
          intent="primary"
          isDisabled={isLoadingSendOnce}
          isLoading={isLoadingSendOnce}
          onPress={reportErrors}
          aria-label="Send error reports"
        >
          Send
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
    overflowY: 'hidden',
    overflowX: 'hidden',
    '.jer-editor-container': {
      ...scrollable(),
      fontSize: '$base',
      overflow: 'overlay',
      height: 200,
      maxHeight: 200,
    },
    '.jer-component': {
      width: 'max-content',
    },
  }),
  actionButton: cssObj({
    width: '100%',
  }),
  controlsContainer: cssObj({
    display: 'flex',
    justifyContent: 'space-between',
  }),
  editorControls: cssObj({
    display: 'flex',
    justifyContent: 'flex-start',
    flexDirection: 'row',
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
