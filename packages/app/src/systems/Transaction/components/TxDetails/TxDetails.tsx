import { cssObj } from '@fuel-ui/css';
import { Accordion, Text } from '@fuel-ui/react';
import { bn, getGasUsedFromReceipts } from 'fuels';
import { useMemo } from 'react';

import type { TxSimulateResult } from '../../types';

import { MAX_FRACTION_DIGITS } from '~/config';
import type { Maybe } from '~/systems/Core';

export type TxDetailsProps = {
  receipts?: Maybe<TxSimulateResult['receipts']>;
};

export function TxDetails({ receipts }: TxDetailsProps) {
  const gasUsed = useMemo(
    () => getGasUsedFromReceipts(receipts || []),
    receipts || []
  );

  return (
    <Accordion type="multiple">
      <Accordion.Item value="tx-details" css={styles.item}>
        <Accordion.Trigger>Transaction Details</Accordion.Trigger>
        <Accordion.Content css={styles.info}>
          <Text as="span">Gas Used</Text>
          <Text as="span" aria-label="Gas Value">
            {bn(gasUsed).formatUnits(MAX_FRACTION_DIGITS)} ETH
          </Text>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion>
  );
}

const styles = {
  item: cssObj({
    '&[data-state="open"] .fuel_accordion-trigger': {
      borderColor: '$gray3',
      borderBottomStyle: 'dashed',
    },
    '.fuel_accordion-trigger': {
      fontSize: '$sm',
      color: '$gray11',
    },
    '.fuel_accordion-trigger:hover': {
      cursor: 'pointer',
      color: '$gray9',
    },
  }),
  info: cssObj({
    '& > div': {
      py: '$2',
      display: 'flex',
      justifyContent: 'space-between',

      span: {
        fontSize: '$sm',
        fontWeight: '$semibold',
      },

      '& span:first-of-child': {
        color: '$gray10',
      },
      '& span:last-of-child': {
        color: '$gray12',
      },
    },
  }),
};
