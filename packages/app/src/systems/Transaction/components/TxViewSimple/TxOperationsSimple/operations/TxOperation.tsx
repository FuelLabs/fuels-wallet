import { cssObj } from '@fuel-ui/css';
import {
  Avatar,
  AvatarGenerated,
  Box,
  Icon,
  IconButton,
  Text,
} from '@fuel-ui/react';
import { ReceiptType } from 'fuels';
import { useAccounts } from '~/systems/Account';
import { useContractMetadata } from '~/systems/Contract/hooks/useContractMetadata';
import { shortAddress } from '~/systems/Core';
import { TxCategory } from '../../../../types';
import type { SimplifiedOperation } from '../../../../types';
import { TxRecipientContractLogo } from '../../../TxRecipientCard/TxRecipientContractLogo';
import { TxAddressDisplay } from './TxAddressDisplay';
import { TxAssetDisplay } from './TxAssetDisplay';
import { TxOperationNesting } from './TxOperationNesting';

type TxOperationProps = {
  operation: SimplifiedOperation;
  showNesting?: boolean;
};

const SpacerComponent = () => {
  return <Box css={styles.spacer} />;
};

export function TxOperation({
  operation,
  showNesting = true,
}: TxOperationProps) {
  const metadata = operation.metadata;
  const amount = metadata?.amount || operation.amount;
  const assetId = metadata?.assetId || operation.assetId;
  const hasAsset = Boolean(amount && assetId);
  const depth = metadata?.depth || 0;
  const receiptType = metadata?.receiptType;
  const isContract = operation.type === TxCategory.CONTRACTCALL;
  const isTransfer = operation.type === TxCategory.SEND;
  const _contract = useContractMetadata(operation.from);
  const { accounts } = useAccounts();
  const accountFrom = accounts?.find(
    (acc) => acc.address.toLowerCase() === operation.from.toLowerCase()
  );
  const accountTo = accounts?.find(
    (acc) => acc.address.toLowerCase() === operation.to.toLowerCase()
  );
  const _receiptTypeLabel = receiptType ? ReceiptType[receiptType] : null;

  const getOperationType = () => {
    if (isContract) return 'Calls contract (sending funds)';
    if (isTransfer) return 'Sends token';
    return 'Unknown';
  };

  // For transfers, always show with 0 indentation
  // For contract calls, only show if root level (depth === 0) unless showNesting is true
  if (isContract && !showNesting && depth !== 0) return null;

  return (
    <Box.Flex css={styles.root}>
      <Box.Stack gap="$2" css={styles.contentCol}>
        <Box.Flex
          css={cssObj({
            display: 'grid',
            gridTemplateColumns: 'auto 1fr',
            gridTemplateRows: 'repeat(5, auto)',
            gap: '$2',
            width: '100%',
            marginBottom: '$2',
          })}
        >
          <Box.Flex justify={'flex-start'} align={'center'}>
            <Avatar.Generated
              role="img"
              size="sm"
              hash={operation.from}
              aria-label={operation.from}
            />
          </Box.Flex>
          <Box.Flex gap="$1" justify={'flex-start'} align={'center'}>
            <Text as="span" fontSize="sm" css={styles.name}>
              {accountFrom?.name || 'Unknown'}
            </Text>
            {isContract && (
              <Box css={styles.badge}>
                <Text fontSize="sm" color="gray8">
                  Contract
                </Text>
              </Box>
            )}
            <Text fontSize="sm" color="gray8" css={styles.address}>
              {shortAddress(operation.from)}
            </Text>
            <IconButton
              size="xs"
              variant="link"
              icon="Copy"
              aria-label="Copy address"
              onPress={() => navigator.clipboard.writeText(operation.from)}
            />
          </Box.Flex>
          <Box.Flex justify={'center'}>
            <SpacerComponent />
          </Box.Flex>
          <Box></Box>
          <Box.Flex justify={'center'} align={'center'} css={styles.blue}>
            <Icon icon="CircleArrowDown" size={16} />
          </Box.Flex>
          <Box.Flex justify={'flex-start'} align={'center'} css={styles.blue}>
            {getOperationType()}
          </Box.Flex>
          <Box.Flex justify={'center'}>
            <SpacerComponent />
          </Box.Flex>
          <Box>
            {hasAsset && amount && assetId && (
              <TxAssetDisplay
                amount={amount.toString()}
                assetId={assetId}
                showLabel={isTransfer}
              />
            )}
          </Box>
          <Box.Flex justify={'flex-start'} align={'center'}>
            <Avatar.Generated
              role="img"
              size="sm"
              hash={operation.to}
              aria-label={operation.to}
            />
          </Box.Flex>
          <Box.Flex justify={'flex-start'} align={'center'} gap="$1">
            <Text as="span" fontSize="sm" css={styles.name}>
              {accountTo?.name || 'Unknown'}
            </Text>
            {isContract && (
              <Box css={styles.badge}>
                <Text fontSize="sm" color="gray8">
                  Contract
                </Text>
              </Box>
            )}
            <Text fontSize="sm" color="gray8" css={styles.address}>
              {shortAddress(operation.to)}
            </Text>
            <IconButton
              size="xs"
              variant="link"
              icon="Copy"
              aria-label="Copy address"
              onPress={() => navigator.clipboard.writeText(operation.to)}
            />
          </Box.Flex>
        </Box.Flex>
      </Box.Stack>
    </Box.Flex>
  );
}
// we also have the operations not related to the account in a group, and intermediate contract calls
const styles = {
  root: cssObj({
    padding: '$1',
    backgroundColor: '#E0E0E0',
    borderRadius: '12px',
    width: '100%',
    boxSizing: 'border-box',
  }),
  contentCol: cssObj({
    display: 'flex',
    backgroundColor: 'white',
    boxShadow: '0px 2px 6px -1px #2020201A, 0px 0px 0px 1px #2020201F',
    flex: 1,
    borderRadius: '8px',
    minWidth: 0,
    padding: '$3',
  }),
  blue: cssObj({
    fontSize: '$sm',
    display: 'flex',
    alignItems: 'center',
    gap: '$1',
    color: '#0D74CE',
  }),
  functionName: cssObj({
    fontSize: '$sm',
    color: '$gray8',
  }),
  spacer: cssObj({
    borderLeft: '1px solid #D9D9D9',
    minHeight: '14px',
    width: '2px',
    height: '100%',
    backgroundColor: '#D9D9D9',
    borderRadius: '$lg',
  }),
  iconCol: cssObj({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  }),
  badge: cssObj({
    padding: '0 $1',
    backgroundColor: '$gray3',
    borderRadius: '$md',
  }),
  name: cssObj({
    fontWeight: '$semibold',
    color: '#202020',
  }),
  address: cssObj({
    fontWeight: '$medium',
    color: '#646464',
  }),
};
