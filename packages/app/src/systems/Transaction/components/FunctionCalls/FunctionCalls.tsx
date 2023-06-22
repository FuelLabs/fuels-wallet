import { cssObj } from '@fuel-ui/css';
import { Accordion, Box, Text } from '@fuel-ui/react';
import ReactJson from 'react-json-view';

import { coreStyles } from '~/systems/Core/styles';
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
          <Accordion.Content css={styles.accordionContent}>
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
    <Box.Stack gap="$1" css={styles.callItem}>
      <Box.Stack gap="$0">
        <Text fontSize="sm">{functionName}</Text>
        {/*
        <Text fontSize="xs" css={styles.callItemInputs}>
          TODO: should find a way to convert functionSignature to a sway contract typing format, like:
          from -> entry_one(u64,u64)
          to -> (amount: u64, amount2: u64)   
        </Text>
        */}
      </Box.Stack>
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
    </Box.Stack>
  );
};

const styles = {
  root: cssObj({
    '.fuel_Accordion-header': {
      fontSize: '$sm',
    },
    '.fuel_Accordion-item': {
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
    },
    '.fuel_Accordion-content': {
      pt: 0,
      pb: '$2',

      '&[data-state="open"]': {
        height: 'auto !important',
      },

      '& > .fuel_box': {
        py: 0,
      },
    },
  }),
  accordionContent: cssObj({
    py: 0,
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
