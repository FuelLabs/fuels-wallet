import { cssObj } from '@fuel-ui/css';
import {
  Alert,
  Avatar,
  Box,
  Card,
  ContentLoader,
  Drawer,
  Icon,
  IconButton,
  Text,
} from '@fuel-ui/react';
import { Address, isB256, isBech32 } from 'fuels';
import { useEffect, useState } from 'react';
import { useAccounts } from '~/systems/Account';
import { AssetService } from '~/systems/Asset/services/assets';
import { formatAmount, shortAddress } from '~/systems/Core';
import {
  type SimplifiedOperation,
  type SwapMetadata,
  TxCategory,
} from '../../types';

export type TxOperationsSimpleProps = {
  operations?: SimplifiedOperation[];
  isLoading?: boolean;
};

type ContractCallMetadata = {
  isContractCallGroup?: boolean;
  operationCount?: number;
  functionName?: string;
  contractId?: string;
};

function isSwapMetadata(
  metadata: ContractCallMetadata | SwapMetadata | undefined
): metadata is SwapMetadata {
  return (
    metadata !== undefined && 'isSwap' in metadata && metadata.isSwap === true
  );
}

export function TxOperationsSimple({
  operations,
  isLoading,
}: TxOperationsSimpleProps) {
  const [openDrawer, setOpenDrawer] = useState<string | null>(null);
  const [assetSymbols, setAssetSymbols] = useState<Record<string, string>>({});
  const { accounts } = useAccounts();

  useEffect(() => {
    async function loadAssetSymbols() {
      const symbols: Record<string, string> = {};
      if (operations) {
        const allAssets = await AssetService.getAssets();
        for (const op of operations) {
          if (op.assetId) {
            const asset = allAssets.find((a) =>
              a.networks?.some(
                (n) => n.type === 'fuel' && n.assetId === op.assetId
              )
            );
            if (asset) {
              symbols[op.assetId] = asset.symbol;
            }
          }
          const metadata = op.metadata;
          if (isSwapMetadata(metadata)) {
            const asset = allAssets.find((a) =>
              a.networks?.some(
                (n) =>
                  n.type === 'fuel' && n.assetId === metadata.receiveAssetId
              )
            );
            if (asset) {
              symbols[metadata.receiveAssetId] = asset.symbol;
            }
          }
        }
      }
      setAssetSymbols(symbols);
    }
    loadAssetSymbols();
  }, [operations]);

  if (isLoading) return <TxOperationsSimple.Loader />;

  return (
    <Box css={styles.content}>
      {operations?.map((operation, index) => {
        const metadata = operation.metadata as ContractCallMetadata;
        const isValidAddress =
          isB256(operation.from) || isBech32(operation.from);
        const fuelAddress = isValidAddress
          ? Address.fromString(operation.from).toString()
          : '';
        const name =
          accounts?.find((a) => a.address === fuelAddress)?.name || 'unknown';
        const isGroup =
          metadata?.isContractCallGroup &&
          metadata.operationCount &&
          metadata.operationCount > 1;
        const key =
          operation.groupId ||
          `${operation.type}-${operation.from}-${operation.to}-${index}`;

        return (
          <Box key={key}>
            <Card
              css={styles.info}
              onClick={() => isGroup && setOpenDrawer(key)}
            >
              {isGroup && (
                <Alert status="info" css={styles.alert} hideIcon>
                  <Alert.Description>
                    This contract call occurs {metadata.operationCount} times
                  </Alert.Description>
                </Alert>
              )}
              <Box.Stack gap="$4">
                <Box.Flex css={styles.line}>
                  <Box css={styles.iconCol}>
                    <Avatar.Generated hash={operation.from} size={24} />
                  </Box>
                  <Box.Flex gap="$2" css={styles.contentCol}>
                    <Text as="span" fontSize="sm">
                      {name}
                    </Text>
                    {operation.type === TxCategory.CONTRACTCALL && (
                      <Box css={styles.badge}>
                        <Text fontSize="sm" color="gray8">
                          Contract
                        </Text>
                      </Box>
                    )}
                    <Text as="span" fontSize="sm" color="gray8">
                      {shortAddress(fuelAddress)}
                    </Text>
                    <IconButton
                      size="xs"
                      variant="link"
                      icon={Icon.is('Copy')}
                      aria-label="Copy address"
                      onPress={() => navigator.clipboard.writeText(fuelAddress)}
                    />
                  </Box.Flex>
                </Box.Flex>

                {operation.type !== TxCategory.CONTRACTCALL && (
                  <Box.Stack gap="$4">
                    <Box.Flex css={styles.line}>
                      <Box css={styles.iconCol}>
                        <Icon
                          icon={'ArrowDown'}
                          css={{ color: '$blue9' }}
                          size={16}
                        />
                      </Box>
                      <Box.Stack gap="$1" css={styles.contentCol}>
                        <Text css={{ color: '$blue9' }} fontSize="sm">
                          {isSwapMetadata(operation.metadata)
                            ? 'Swaps tokens'
                            : 'Sends token'}
                        </Text>
                        <Box.Stack gap="$2">
                          <Box.Flex
                            css={{
                              display: 'flex',
                              gap: '$2',
                              alignItems: 'center',
                            }}
                          >
                            <Icon icon="Coins" size={16} />
                            <Text fontSize="sm">
                              {formatAmount({
                                amount: operation.amount || '0',
                                options: { units: 9 },
                              })}{' '}
                              {assetSymbols[operation.assetId || ''] ||
                                shortAddress(operation.assetId)}
                            </Text>
                          </Box.Flex>
                          {isSwapMetadata(operation.metadata) ? (
                            <Box.Stack gap="$2">
                              <Box.Flex css={styles.line}>
                                <Box css={styles.iconCol}>
                                  <Avatar.Generated
                                    hash={operation.to}
                                    size={24}
                                  />
                                </Box>
                                <Box.Flex gap="$2" css={styles.contentCol}>
                                  <Text as="span" fontSize="sm">
                                    {accounts?.find(
                                      (a) => a.address === operation.to
                                    )?.name || 'unknown'}
                                  </Text>
                                  <Box css={styles.badge}>
                                    <Text fontSize="sm" color="gray8">
                                      Contract
                                    </Text>
                                  </Box>
                                  <Text as="span" fontSize="sm" color="gray8">
                                    {shortAddress(operation.to)}
                                  </Text>
                                  <IconButton
                                    size="xs"
                                    variant="link"
                                    icon={Icon.is('Copy')}
                                    aria-label="Copy address"
                                    onPress={() =>
                                      navigator.clipboard.writeText(
                                        operation.to
                                      )
                                    }
                                  />
                                </Box.Flex>
                              </Box.Flex>
                              <Box.Flex css={styles.line}>
                                <Box css={styles.iconCol}>
                                  <Icon
                                    icon="ArrowDown"
                                    css={{ color: '$blue9' }}
                                    size={16}
                                  />
                                </Box>
                                <Box.Stack gap="$1" css={styles.contentCol}>
                                  <Text css={{ color: '$blue9' }} fontSize="sm">
                                    Sends token
                                  </Text>
                                  <Box.Flex
                                    css={{
                                      display: 'flex',
                                      gap: '$2',
                                      alignItems: 'center',
                                    }}
                                  >
                                    <Icon icon="Coins" size={16} />
                                    <Text fontSize="sm">
                                      {formatAmount({
                                        amount:
                                          operation.metadata.receiveAmount,
                                        options: { units: 9 },
                                      })}{' '}
                                      {assetSymbols[
                                        operation.metadata.receiveAssetId
                                      ] ||
                                        shortAddress(
                                          operation.metadata.receiveAssetId
                                        )}
                                    </Text>
                                  </Box.Flex>
                                </Box.Stack>
                              </Box.Flex>
                            </Box.Stack>
                          ) : (
                            <Box.Flex css={styles.line}>
                              <Box css={styles.iconCol}>
                                <Avatar.Generated
                                  hash={operation.to}
                                  size={24}
                                />
                              </Box>
                              <Box.Flex gap="$2" css={styles.contentCol}>
                                <Text as="span" fontSize="sm">
                                  {accounts?.find(
                                    (a) => a.address === operation.to
                                  )?.name || 'unknown'}
                                </Text>
                                <Text as="span" fontSize="sm" color="gray8">
                                  {shortAddress(operation.to)}
                                </Text>
                                <IconButton
                                  size="xs"
                                  variant="link"
                                  icon={Icon.is('Copy')}
                                  aria-label="Copy address"
                                  onPress={() =>
                                    navigator.clipboard.writeText(operation.to)
                                  }
                                />
                              </Box.Flex>
                            </Box.Flex>
                          )}
                        </Box.Stack>
                      </Box.Stack>
                    </Box.Flex>
                  </Box.Stack>
                )}
              </Box.Stack>
            </Card>

            {isGroup && (
              <Drawer
                isDismissable
                size={300}
                side="right"
                isOpen={openDrawer === key}
                onClose={() => setOpenDrawer(null)}
              >
                <Drawer.Content>
                  <Drawer.Body css={styles.drawer}>
                    <Box.Flex css={styles.drawerHeader}>
                      <Text as="span">Contract Calls</Text>
                      <IconButton
                        size="sm"
                        icon={Icon.is('X')}
                        variant="link"
                        aria-label="drawer_closeButton"
                        onPress={() => setOpenDrawer(null)}
                      />
                    </Box.Flex>
                    <Box css={styles.drawerContent}>
                      {metadata.functionName && (
                        <Text fontSize="sm">
                          Function: {metadata.functionName}
                        </Text>
                      )}
                      <Text fontSize="sm">Contract: {operation.to}</Text>
                      {metadata.operationCount && (
                        <Text fontSize="sm">
                          Total Calls: {metadata.operationCount}
                        </Text>
                      )}
                    </Box>
                  </Drawer.Body>
                </Drawer.Content>
              </Drawer>
            )}
          </Box>
        );
      })}
    </Box>
  );
}

TxOperationsSimple.Loader = function TxOperationsSimpleLoader() {
  return (
    <Card css={styles.operation}>
      <ContentLoader width={300} height={80} viewBox="0 0 300 80">
        <rect x="20" y="20" rx="4" ry="4" width="200" height="16" />
        <rect x="20" y="44" rx="4" ry="4" width="160" height="16" />
      </ContentLoader>
    </Card>
  );
};

const styles = {
  operation: cssObj({
    padding: '$1',
  }),
  content: cssObj({
    display: 'flex',
    flexDirection: 'column',
    gap: '$3',
  }),
  info: cssObj({
    display: 'flex',
    flexDirection: 'column',
    gap: '$3',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '$gray2',
    },
    padding: '$3',
  }),
  type: cssObj({
    display: 'flex',
    alignItems: 'center',
    gap: '$2',
  }),
  addresses: cssObj({
    display: 'flex',
    flexDirection: 'column',
    gap: '$1',
  }),
  amount: cssObj({
    alignSelf: 'flex-end',
  }),
  drawer: cssObj({
    display: 'grid',
    height: '100%',
    gridTemplateRows: '50px 1fr',
  }),
  drawerHeader: cssObj({
    px: '$4',
    py: '$3',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid $border',
    fontWeight: '$normal',
  }),
  drawerContent: cssObj({
    padding: '$4',
    display: 'flex',
    flexDirection: 'column',
    gap: '$3',
  }),
  tokenInfo: cssObj({
    display: 'flex',
    flexDirection: 'column',
    gap: '$2',
  }),
  alert: cssObj({
    padding: '0',
    textAlign: 'center',
    backgroundColor: '#E6F4FE',
    color: '#0D74CE',
    border: 'none',
    borderRadius: '6px',
  }),
  badge: cssObj({
    backgroundColor: '$gray3',
    padding: '$1 $2',
    borderRadius: '$md',
    marginLeft: '$2',
  }),
  timeline: cssObj({
    position: 'relative',
    '&::before': {
      content: '""',
      position: 'absolute',
      left: '12px',
      top: 0,
      bottom: 0,
      width: '2px',
      backgroundColor: '$gray4',
    },
  }),
  line: cssObj({
    display: 'flex',
    alignItems: 'center',
    gap: '$3',
  }),
  iconCol: cssObj({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '24px',
    flexShrink: 0,
  }),
  contentCol: cssObj({
    display: 'flex',
    flex: 1,
  }),
};
