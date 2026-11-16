import {
  cssObj,
  Box,
  Copyable,
  Icon,
  IconButton,
  Text,
  Tooltip,
  cx,
} from '@fuel-wallet/ui';
import { TransactionStatus } from 'fuels';
import type { TransactionTypeName } from 'fuels';
import type { FC, ReactNode } from 'react';

import { useExplorerLink } from '../../hooks/useExplorerLink';

import { ScrambleText, shortAddress } from '~/systems/Core';
import { TxHeaderLoader } from './TxHeaderLoader';

export type TxHeaderProps = {
  status?: TransactionStatus;
  id?: string;
  type?: TransactionTypeName;
  /** Play the confirmation moment. Only set right after this wallet sent it. */
  celebrate?: boolean;
};

type TxHeaderComponent = FC<TxHeaderProps> & {
  Loader: typeof TxHeaderLoader;
};

const STATUS_KIND: Partial<Record<TransactionStatus, string>> = {
  [TransactionStatus.failure]: 'danger',
  [TransactionStatus.submitted]: 'active',
};

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Box.Flex css={styles.row}>
      <Text css={styles.label}>{label}</Text>
      <Box.Flex css={styles.value}>{children}</Box.Flex>
    </Box.Flex>
  );
}

export const TxHeader: TxHeaderComponent = ({
  status,
  id,
  type,
  celebrate,
}) => {
  const { href, openExplorer } = useExplorerLink(id);
  const confirmed = celebrate && status === TransactionStatus.success;
  const reverted = celebrate && status === TransactionStatus.failure;

  return (
    <Box.Stack
      gap="0"
      css={styles.root}
      className={cx(
        'fuel-appear',
        confirmed && 'fuel-ticks',
        reverted && 'fuel-shake'
      )}
    >
      <Row label="ID">
        <Copyable
          value={id || ''}
          iconProps={{ 'aria-label': 'Copy Transaction ID' }}
          tooltipMessage="Copy Transaction ID"
        >
          <Text css={styles.text}>
            {confirmed ? (
              <ScrambleText text={shortAddress(id)} duration={800} />
            ) : (
              shortAddress(id)
            )}
          </Text>
        </Copyable>
        {href && (
          <>
            <Copyable
              value={href}
              tooltipMessage="Copy Transaction Link"
              iconProps={{
                icon: 'Link',
                'aria-label': 'Copy Transaction Link',
              }}
            />
            <Tooltip content="View on Explorer">
              <IconButton
                size="xs"
                variant="link"
                css={styles.explorer}
                icon={<Icon icon="ExternalLink" size={16} />}
                aria-label="View on Explorer"
                onPress={openExplorer}
              />
            </Tooltip>
          </>
        )}
      </Row>
      <Row label="Status">
        <span
          aria-label="Status Circle"
          className={cx('fuel-square', celebrate && 'fuel-pop')}
          data-kind={status ? STATUS_KIND[status] : 'pending'}
          data-status={status}
        />
        <Text css={styles.text}>{status}</Text>
      </Row>
      <Row label="Type">
        <Text css={styles.text}>{type}</Text>
      </Row>
    </Box.Stack>
  );
};

const styles = {
  root: cssObj({
    background: '$cardBg',
    boxShadow: 'inset 0 0 0 1px var(--fuel-line)',
  }),
  row: cssObj({
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '$3',
    minHeight: 40,
    px: '$4',

    '& + &': { borderTop: '1px solid var(--fuel-line)' },
  }),
  label: cssObj({
    fontFamily: '$mono',
    fontSize: '12px',
    lineHeight: '16px',
    letterSpacing: '0.6px',
    textTransform: 'uppercase',
    color: '$textLow',
  }),
  value: cssObj({
    alignItems: 'center',
    gap: '$2',
    minWidth: 0,
  }),
  text: cssObj({
    fontFamily: '$mono',
    fontSize: '$sm',
    color: '$textHigh',
    textTransform: 'capitalize',
  }),
  explorer: cssObj({
    color: '$textLow',
    '@media (hover: hover)': { '&:hover': { color: '$textHigh' } },
  }),
};

TxHeader.Loader = TxHeaderLoader;
