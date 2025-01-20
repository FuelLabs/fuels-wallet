import { cssObj } from '@fuel-ui/css';
import { Box, Icon, Text } from '@fuel-ui/react';
import { AssetsAmount } from '~/systems/Asset';
import { shortAddress } from '~/systems/Core';
import type { SimplifiedOperation } from '../../../types';
import { TxCategory } from '../../../types';

type TxOperationSendProps = {
  operation: SimplifiedOperation;
};

export function TxOperationSend({ operation }: TxOperationSendProps) {
  const amount = operation.metadata?.totalAmount || operation.amount || '0';
  const operationCount = operation.metadata?.operationCount;
  const isContractCall = operation.type === TxCategory.CONTRACTCALL;

  return (
    <Box.Flex css={styles.line}>
      <Box.Stack gap="$1" css={styles.contentCol}>
        <Box.Stack gap="$2">
          {isContractCall && (
            <Text fontSize="sm" color="gray8">
              Calls contract (sending tokens)
            </Text>
          )}
          <Box.Flex
            css={{
              display: 'flex',
              gap: '$2',
              alignItems: 'center',
            }}
          >
            <AssetsAmount
              amounts={[
                {
                  amount,
                  assetId: operation.assetId || '',
                  name: '',
                  symbol: '',
                  icon: '',
                  decimals: 9,
                  isCustom: false,
                  networks: [
                    {
                      type: 'fuel',
                      chainId: 0,
                      assetId: operation.assetId || '',
                      decimals: 9,
                    },
                  ],
                },
              ]}
              showSymbol
            />
            {operationCount && operationCount > 1 ? (
              <Text as="span" color="gray8">
                x{operationCount}
              </Text>
            ) : null}
          </Box.Flex>
        </Box.Stack>
      </Box.Stack>
    </Box.Flex>
  );
}

const styles = {
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
