import { cssObj } from '@fuel-ui/css';
import { Accordion, Text } from '@fuel-ui/react';
import type { ReceiptScriptResult } from 'fuels';
import { ReceiptType } from 'fuels';
import { useMemo } from 'react';

import type { Transaction } from '../../types';

import type { Maybe } from '~/systems/Core';
import { formatUnits } from '~/systems/Core';

export type TxDetailsProps = {
  tx?: Maybe<Transaction>;
};

export function TxDetails({ tx }: TxDetailsProps) {
  const gasUsed = useMemo(() => {
    const receipt = tx?.receipts.find(
      (i) => i.type === ReceiptType.ScriptResult
    ) as ReceiptScriptResult;
    return receipt?.gasUsed;
  }, [tx?.receipts]);

  return (
    <Accordion type="multiple">
      <Accordion.Item value="tx-details" css={styles.item}>
        <Accordion.Trigger>Transaction Details</Accordion.Trigger>
        <Accordion.Content css={styles.info}>
          <Text as="span">Gas Used</Text>
          <Text as="span" aria-label="Gas Value">
            {formatUnits(gasUsed)} ETH
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
