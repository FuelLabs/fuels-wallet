import { cssObj } from '@fuel-ui/css';
import { Avatar, Box, IconButton, Text } from '@fuel-ui/react';
import { Address, isB256, isBech32 } from 'fuels';
import { useAccounts } from '~/systems/Account';
import { shortAddress } from '~/systems/Core';
import type { SimplifiedOperation } from '../../../types';
import { TxCategory } from '../../../types';
import { useEcosystemProject } from './useEcosystemProject';

type TxOperationHeaderProps = {
  operation: SimplifiedOperation;
};

export function TxOperationHeader({ operation }: TxOperationHeaderProps) {
  const { accounts } = useAccounts();
  const isValidAddress = isB256(operation.from) || isBech32(operation.from);
  const fuelAddress = isValidAddress
    ? Address.fromString(operation.from).toString()
    : '';
  const name =
    accounts?.find((a) => a.address === fuelAddress)?.name || 'unknown';

  const isContract = operation.type === TxCategory.CONTRACTCALL;
  const projectInfo = useEcosystemProject(
    isContract ? operation.to : undefined
  );

  return (
    <Box.Flex css={styles.line}>
      <Box css={styles.iconCol}>
        {projectInfo.image ? (
          <Avatar
            src={projectInfo.image}
            size={24}
            name={projectInfo.name || 'Contract'}
          />
        ) : (
          <Avatar.Generated hash={operation.from} size={24} />
        )}
      </Box>
      <Box.Flex gap="$2" css={styles.contentCol}>
        <Text as="span" fontSize="sm">
          {isContract ? projectInfo.name || shortAddress(operation.to) : name}
        </Text>
        {isContract && (
          <Box css={styles.badge}>
            <Text fontSize="sm" color="gray8">
              Contract
            </Text>
          </Box>
        )}
        <Text as="span" fontSize="sm" color="gray8">
          {shortAddress(isContract ? operation.to : fuelAddress)}
        </Text>
        <IconButton
          size="xs"
          variant="link"
          icon="Copy"
          aria-label="Copy address"
          onPress={() =>
            navigator.clipboard.writeText(
              isContract ? operation.to : fuelAddress
            )
          }
        />
      </Box.Flex>
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
  badge: cssObj({
    backgroundColor: '$gray3',
    padding: '$1 $2',
    borderRadius: '$md',
    marginLeft: '$2',
  }),
};
