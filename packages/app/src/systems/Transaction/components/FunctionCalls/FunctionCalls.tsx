import { cssObj } from '@fuel-ui/css';
import { Accordion, Box, Stack, Text } from '@fuel-ui/react';
import ReactJson from 'react-json-view';

import { coreStyles } from '~/systems/Core';
import type { FunctionCall } from '~/systems/Transaction';

export type FunctionCallsProps = {
  calls: FunctionCall[];
};

export const FunctionCalls = ({ calls }: FunctionCallsProps) => {
  return (
    <Box css={styles.root}>
      <Accordion type="multiple">
        <Accordion.Item value="item-1">
          <Accordion.Trigger>Functions called</Accordion.Trigger>
          <Accordion.Content>
            {calls.map((call) => (
              <FunctionCallItem
                call={call}
                key={
                  call.functionSignature +
                  call.functionName +
                  JSON.stringify(call.argumentsProvided)
                }
              />
            ))}
          </Accordion.Content>
        </Accordion.Item>
      </Accordion>
    </Box>
  );
};

type FunctionCallItemProps = {
  call: FunctionCall;
};

const FunctionCallItem = ({ call }: FunctionCallItemProps) => {
  const { functionName, argumentsProvided } = call || {};

  return (
    <Stack gap="$1" css={styles.callItem}>
      <Stack gap="$0">
        <Text fontSize="sm">{functionName}</Text>
        <Text fontSize="xs" css={styles.callItemInputs}>
          (amount: u64, address: Address, amount2: u64)
        </Text>
      </Stack>
      {argumentsProvided && (
        <ReactJson
          src={argumentsProvided}
          displayDataTypes={false}
          displayObjectSize={false}
          indentWidth={2}
          sortKeys={true}
          quotesOnKeys={false}
          enableClipboard={false}
          collapsed={true}
          name="params"
          theme="summerfruit"
        />
      )}
    </Stack>
  );
};

const styles = {
  root: cssObj({
    '.fuel_accordion-trigger': {
      fontSize: '$xs',
      height: 35,
    },
    '.fuel_accordion-item': {
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
    },
    '.fuel_accordion-content': {
      '&[data-state="open"]': {
        height: 'auto !important',
      },

      '& > .fuel_box': {
        py: 0,
      },
    },
  }),
  callItem: cssObj({
    py: '$2',

    '.fuel_text': {
      fontWeight: '$semibold',
      color: '$gray12',
    },

    '& ~ & ': {
      borderTop: '1px dashed $gray3',
    },

    '.react-json-view': {
      ...coreStyles.scrollable('$gray5', '$gray10'),
      fontSize: '$xs',
      backgroundColor: '$transparent !important',
      maxHeight: 192,
      wordBreak: 'break-all',
      fontFamily: 'inherit !important',

      '.collapsed-icon svg, .expanded-icon svg': {
        marginTop: 6,
      },
    },
  }),
  callItemInputs: cssObj({
    color: '$gray11 !important',
  }),
};
