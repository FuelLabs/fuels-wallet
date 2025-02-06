import { cssObj } from '@fuel-ui/css';
import {
  Alert,
  Box,
  CardList,
  ContentLoader,
  Copyable,
  Icon,
  Text,
} from '@fuel-ui/react';
import type {
  BN,
  TransactionRequest,
  TransactionResult,
  TransactionStatus,
  TransactionSummary,
} from 'fuels';
import { useMemo } from 'react';
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

const ConfirmHeader = () => (
  <Box css={styles.header}>
    {/* Disabled while the new Wallet header is not implemented */}
    {/* <Text as="h2">Review Transaction</Text> */}
    <Box css={styles.warning}>
      <Icon icon="InfoCircle" />
      Check your transaction before submitting.
    </Box>
  </Box>
);

const LoaderHeader = () => (
  <CardList.Item
    css={{ padding: '$2 !important' }}
    aria-label="Loading Transaction"
  >
    <ContentLoader width={300} height={40} viewBox="0 0 300 40">
      <rect x="20" y="10" rx="4" ry="4" width="92" height="20" />
    </ContentLoader>
  </CardList.Item>
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

export type TxViewVariant = 'default' | 'history';

export type TxContentInfoProps = {
  tx?: TransactionSummary | TransactionResult;
  txRequest?: TransactionRequest;
  txStatus?: Maybe<TransactionStatus>;
  showDetails?: boolean;
  isLoading?: boolean;
  footer?: React.ReactNode;
  errors?: GroupedErrors;
  isConfirm?: boolean;
  fees?: {
    baseFee?: BN;
    regularTip?: BN;
    fastTip?: BN;
  };
};

function TxContentInfo({
  tx,
  txStatus,
  showDetails,
  isLoading,
  footer,
  errors,
  isConfirm,
  fees,
  txRequest,
}: TxContentInfoProps) {
  const { getValues } = useFormContext<SendFormValues>();

  const status = txStatus || tx?.status || txStatus;
  const hasErrors = Boolean(Object.keys(errors || {}).length);
  const isExecuted = !!tx?.id;
  const txRequestGasLimit = getGasLimitFromTxRequest(txRequest);

  const { transaction, isReady } = useSimplifiedTransaction({
    tx,
    txRequest,
  });

  const initialAdvanced = useMemo(() => {
    if (!fees?.regularTip || !fees?.fastTip) return false;

    try {
      const tipAmount = getValues('fees.tip.amount');
      const gasLimitAmount = getValues('fees.gasLimit.amount');

      // Check if form values exist
      if (!tipAmount || !gasLimitAmount) return false;

      const isFeeAmountTheRegularTip = tipAmount.eq(fees.regularTip);
      const isFeeAmountTheFastTip = tipAmount.eq(fees.fastTip);
      const isGasLimitTheTxRequestGasLimit =
        gasLimitAmount.eq(txRequestGasLimit);

      return (
        (!isFeeAmountTheRegularTip && !isFeeAmountTheFastTip) ||
        !isGasLimitTheTxRequestGasLimit
      );
    } catch (error) {
      console.error(error);
      // If there's any error accessing form values, return false
      return false;
    }
  }, [getValues, fees, txRequestGasLimit]);

  if (!isReady || !transaction) return null;

  function getHeader() {
    if (hasErrors) return <ErrorHeader errors={errors} />;
    if (isConfirm) return <ConfirmHeader />;
    if (isExecuted)
      return (
        <TxHeader id={tx?.id} type={tx?.type} status={status || undefined} />
      );
    return <ConfirmHeader />;
  }

  return (
    <>
      {getHeader()}
      <Box css={styles.content}>
        <TxOperations operations={transaction.categorizedOperations} />
        {isLoading && !showDetails && <TxFee.Loader />}
        {showDetails && !fees && <TxFee fee={transaction?.fee.total} />}
        {showDetails &&
          fees?.baseFee &&
          txRequestGasLimit &&
          fees?.regularTip &&
          fees?.fastTip && (
            <Box>
              <Box.Flex gap="18px" align="center" css={styles.feeContainer}>
                <Icon icon="CurrencyCent" css={styles.icon} />
                <Text css={styles.title}>Fee (network)</Text>
              </Box.Flex>
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
    paddingTop: '$2',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  }),
  title: cssObj({
    fontSize: '$sm',
    fontWeight: '$medium',
    color: '$gray12',
  }),
  feeContainer: cssObj({
    padding: '32px 0 16px 20px',
  }),
  icon: cssObj({
    border: '1.5px solid $gray9',
    borderRadius: '50%',
    width: '20px',
    height: '20px',
    boxSizing: 'border-box',
    '& svg': {
      width: '16px',
      height: '16px',
      strokeWidth: '2.5px',
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
  header: cssObj({
    marginBottom: '$2',
    backgroundColor: '$white',
    borderBottom: '1px solid $gray3',
    padding: '12px 18px',
  }),
  warning: cssObj({
    display: 'flex',
    alignItems: 'center',
    gap: '$1',
    fontSize: '12px',
    color: '$gray11',
    fontWeight: '500',
    marginBottom: '$2',
  }),
};
