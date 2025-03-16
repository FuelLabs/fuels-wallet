import { cssObj } from '@fuel-ui/css';
import {
  Alert,
  Box,
  Card,
  ContentLoader,
  Copyable,
  Icon,
  Text,
} from '@fuel-ui/react';
import type {
  BN,
  TransactionRequest,
  TransactionStatus,
  TransactionSummary,
} from 'fuels';
import { type ReactNode, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { type Maybe, MotionStack, animations } from '~/systems/Core';
import type { SendFormValues } from '~/systems/Send/hooks';
import {
  type GroupedErrors,
  getGasLimitFromTxRequest,
} from '~/systems/Transaction';
import { useSimplifiedTransaction } from '../../hooks/useSimplifiedTransaction';
import { TxFee } from '../TxFee';
import { TxFeeOptions } from '../TxFeeOptions/TxFeeOptions';
import { TxHeader } from '../TxHeader';
import { TxOperations } from '../TxOperations';

const ErrorHeader = ({ errors }: { errors?: GroupedErrors }) => {
  return (
    <Alert status="error" css={styles.alert} aria-label="Transaction Error">
      <Copyable
        value={errors ?? ''}
        aria-label={errors}
        iconProps={{
          icon: Icon.is('Copy'),
          'aria-label': 'Copy Error',
        }}
        tooltipMessage="Copy Error"
      >
        <Alert.Description
          as="div"
          css={{
            wordBreak: 'break-word',
          }}
        >
          {errors}
        </Alert.Description>
      </Copyable>
    </Alert>
  );
};

const LoaderHeader = () => (
  <Card css={{ height: 84 }}>
    <ContentLoader width={'100%'} height={'100%'} viewBox="0 0 300 84">
      <rect x="16" y="15" width="50" height="15" rx="4" />
      <rect x="16" y="35" width="50" height="15" rx="4" />
      <rect x="16" y="55" width="50" height="15" rx="4" />
    </ContentLoader>
  </Card>
);

function TxContentLoader() {
  return (
    <MotionStack {...animations.slideInTop()} gap="$4">
      <LoaderHeader />
      <TxOperations.Loader />
      <TxFee.Loader />
    </MotionStack>
  );
}

export type TxContentInfoProps = {
  footer?: ReactNode;
  tx: TransactionSummary;
  txStatus?: Maybe<TransactionStatus>;
  showDetails?: boolean;
  errors?: GroupedErrors;
  fees?: {
    baseFee?: BN;
    regularTip?: BN;
    fastTip?: BN;
  };
  txRequest?: TransactionRequest;
};

function TxContentInfo({
  tx,
  txStatus,
  footer,
  showDetails,
  errors,
  fees,
  txRequest,
}: TxContentInfoProps) {
  const { getValues } = useFormContext<SendFormValues>();

  const status = txStatus || tx?.status || txStatus;
  const hasErrors = Boolean(Object.keys(errors || {}).length);
  const isExecuted = !!tx?.id && status; // Added status check to ensure the tx is executed, as TX.id is now always present.
  const txRequestGasLimit = getGasLimitFromTxRequest(txRequest);

  const { transaction } = useSimplifiedTransaction({
    tx,
    txRequest,
  });

  const initialAdvanced = useMemo(() => {
    if (!fees?.regularTip || !fees?.fastTip) return false;

    try {
      const tipAmount = getValues('fees.tip.amount');
      const gasLimitAmount = getValues('fees.gasLimit.amount');
      if (!tipAmount || !gasLimitAmount) return false;

      const isFeeAmountTheRegularTip = tipAmount.eq(fees.regularTip);
      const isFeeAmountTheFastTip = tipAmount.eq(fees.fastTip);
      const isGasLimitTheTxRequestGasLimit =
        gasLimitAmount.eq(txRequestGasLimit);

      return (
        (!isFeeAmountTheRegularTip && !isFeeAmountTheFastTip) ||
        !isGasLimitTheTxRequestGasLimit
      );
    } catch (_) {
      return false;
    }
  }, [getValues, fees, txRequestGasLimit]);

  function getHeader() {
    if (hasErrors) return <ErrorHeader errors={errors} />;
    if (isExecuted)
      return (
        <TxHeader id={tx?.id} type={tx?.type} status={status || undefined} />
      );

    return null;
  }

  return (
    <>
      {getHeader()}
      <Box css={styles.content}>
        <TxOperations operations={transaction.categorizedOperations} />
        {showDetails && !fees && (
          <Box.VStack align="flex-start" css={styles.feeWrapper}>
            <Box.HStack gap="$2" align="center">
              <Box css={styles.feeIconWrapper}>
                <Icon icon="CurrencyCent" css={styles.feeIcon} size={16} />
              </Box>
              <Text css={styles.title}>Fee (network)</Text>
            </Box.HStack>
            <TxFee fee={transaction?.fee.total} />
          </Box.VStack>
        )}
        {showDetails &&
          fees?.baseFee &&
          txRequestGasLimit &&
          fees?.regularTip &&
          fees?.fastTip && (
            <Box css={styles.feeWrapper}>
              <Box.HStack gap="$2" align="center">
                <Box css={styles.feeIconWrapper}>
                  <Icon icon="CurrencyCent" css={styles.feeIcon} />
                </Box>
                <Text css={styles.title}>Fee (network)</Text>
              </Box.HStack>
              <TxFeeOptions
                initialAdvanced={initialAdvanced}
                baseFee={fees.baseFee}
                gasLimit={txRequestGasLimit}
                regularTip={fees.regularTip}
                fastTip={fees.fastTip}
              />
            </Box>
          )}
      </Box>
      {footer}
    </>
  );
}

export const TxContent = {
  Loader: TxContentLoader,
  Info: TxContentInfo,
};

const styles = {
  content: cssObj({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  }),
  title: cssObj({
    fontSize: '$sm',
    fontWeight: '$medium',
    color: '$gray12',
  }),
  feeWrapper: cssObj({
    padding: '$2',
    borderRadius: '10px',
    border: '1px solid $gray7',

    'html[class="fuel_dark-theme"] &': {
      border: '1px solid $gray3',
    },
  }),
  feeIconWrapper: cssObj({
    borderRadius: '$full',
    border: '1px solid $intentsBase11',
    ml: '$4',
    mr: '10px',
    my: '$2',
  }),
  feeIcon: cssObj({
    color: '$intentsBase11',
    m: '2px',
    '& svg': {
      strokeWidth: '2px',
    },
  }),
  alert: cssObj({
    '& .fuel_Alert-content': {
      gap: '$1',
    },
    ' & .fuel_Heading': {
      fontSize: '$sm',
    },
    '& .fuel_Icon': {
      mt: '-2px',
    },
  }),
};
