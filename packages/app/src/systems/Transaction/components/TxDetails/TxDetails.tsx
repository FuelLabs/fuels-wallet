import { cssObj } from '@fuel-ui/css';
import { Accordion, Flex, Text } from '@fuel-ui/react';
import type { BN } from 'fuels';
import { bn } from 'fuels';
import type { FC } from 'react';

import { TxDetailsLoader } from './TxDetailsLoader';

export type TxDetailsProps = {
  fee?: BN;
  amountSent?: BN;
};

type TxDetailsComponent = FC<TxDetailsProps> & {
  Loader: typeof TxDetailsLoader;
};

export const TxDetails: TxDetailsComponent = ({
  fee: initialFee,
  amountSent,
}: TxDetailsProps) => {
  const fee = bn(initialFee);
  const total = fee.add(bn(amountSent));
  const shouldShowTotal = total?.gt(bn(fee));

  return (
    <Accordion
      type="single"
      defaultValue="tx-details"
      // TODO: remove ts ignore when collapsible is exposed from the fuel-ui
      // collapsible is a valid property from radix accordion but
      // is not exposed by the fuel-ui Accordion component
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      collapsible={true}
    >
      <Accordion.Item value="tx-details" css={styles.item}>
        <Accordion.Trigger>Transaction Details</Accordion.Trigger>
        <Accordion.Content css={styles.info}>
          <Flex css={styles.detailItems}>
            <Flex css={styles.detailItem}>
              <Text as="span">Fee (network)</Text>
              <Text as="span" aria-label="Gas Value">
                {fee?.format()} ETH
              </Text>
            </Flex>
            {shouldShowTotal && (
              <Flex css={styles.detailItem}>
                <Text as="span">Total (including Fee)</Text>
                <Text as="span" aria-label="Total Value">
                  {total?.format()} ETH
                </Text>
              </Flex>
            )}
          </Flex>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion>
  );
};

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

TxDetails.Loader = TxDetailsLoader;
