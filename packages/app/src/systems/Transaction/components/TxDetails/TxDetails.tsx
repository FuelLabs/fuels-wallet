import { cssObj } from '@fuel-ui/css';
import { Accordion, Flex, Text } from '@fuel-ui/react';
import type { BN } from 'fuels';
import { bn, getGasUsedFromReceipts } from 'fuels';

import type { TxSimulateResult } from '../../types';

import { DECIMAL_UNITS } from '~/config';
import type { Maybe } from '~/systems/Core';

export type TxDetailsProps = {
  receipts?: Maybe<TxSimulateResult['receipts']>;
  outputAmount?: BN;
};

export function TxDetails({ receipts, outputAmount }: TxDetailsProps) {
  const gasUsed = getGasUsedFromReceipts(receipts || []);
  const total = gasUsed.add(bn(outputAmount));

  return (
    <Accordion type="multiple">
      <Accordion.Item value="tx-details" css={styles.item}>
        <Accordion.Trigger>Transaction Details</Accordion.Trigger>
        <Accordion.Content css={styles.info}>
          <Flex css={styles.detailItems}>
            <Flex css={styles.detailItem}>
              <Text as="span">Fee (network)</Text>
              <Text as="span" aria-label="Gas Value">
                {gasUsed.format({ precision: DECIMAL_UNITS })} ETH
              </Text>
            </Flex>
            <Flex css={styles.detailItem}>
              <Text as="span">Total (including Fee)</Text>
              <Text as="span" aria-label="Total Value">
                {total.format({ precision: DECIMAL_UNITS })} ETH
              </Text>
            </Flex>
          </Flex>
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
  detailItems: cssObj({
    flexDirection: 'column',
    gap: '$2',
    flex: 1,
  }),
  detailItem: cssObj({
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '$2',
  }),
};
