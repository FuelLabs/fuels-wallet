import { cssObj } from '@fuel-ui/css';
import {
  Box,
  Button,
  FuelLogo,
  HStack,
  Heading,
  Input,
  Text,
} from '@fuel-ui/react';
import { Icon, IconButton } from '@fuel-ui/react';
import { useState } from 'react';
import ReactJson from 'react-json-view';
import { WALLET_HEIGHT, WALLET_WIDTH } from '~/config';
import { coreStyles } from '~/systems/Core/styles';
import { useReportError } from '../../hooks';

export function ReportErrors() {
  const { handlers, isLoadingSendOnce, errors } = useReportError();
  const [currentPage, setCurrentPage] = useState(0);

  const shownError = errors[currentPage];

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
        <HStack className="justify-end">
          <Text>
            {currentPage + 1} / {errors.length}
          </Text>
          <HStack>
            <IconButton
              variant="ghost"
              aria-label="Previous error"
              icon={Icon.is('ChevronLeft')}
              disabled={currentPage <= 0}
              onPress={() => setCurrentPage((prev) => prev - 1)}
            />
            <IconButton
              variant="ghost"
              aria-label="Next error"
              icon={Icon.is('ChevronRight')}
              disabled={currentPage >= errors.length - 1}
              onPress={() => setCurrentPage((prev) => prev + 1)}
            />
          </HStack>
        </HStack>
        <ReactJson
          src={shownError}
          displayDataTypes={false}
          displayObjectSize={false}
          indentWidth={2}
          sortKeys={true}
          quotesOnKeys={false}
          enableClipboard={false}
          collapsed={true}
          name="errors"
          theme="summerfruit:inverted"
        />
      </Box.Stack>
      <Box.Stack>
        <Button
          intent="primary"
          isDisabled={isLoadingSendOnce}
          isLoading={isLoadingSendOnce}
          onPress={handlers.reportErrors}
          aria-label="Report Error"
        >
          Send reports
        </Button>
        <Button
          variant="ghost"
          onPress={handlers.ignoreErrors}
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
