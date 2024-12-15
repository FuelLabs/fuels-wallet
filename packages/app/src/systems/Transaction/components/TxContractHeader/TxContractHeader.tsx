import { cssObj } from '@fuel-ui/css';
import { Avatar, Box } from '@fuel-ui/react';
import { AddressType, OperationName } from 'fuels';
import type { Operation } from 'fuels';
import { useContractInfo } from '../../hooks/useContractInfo';

type Props = {
  operations?: Operation[];
  title?: string;
};

export function TxContractHeader({ operations, title }: Props) {
  const contractOp = operations?.find((op) => {
    const isContractType = op.to?.type === AddressType.contract;
    const isContractCall = op.name === OperationName.contractCall;
    const isContractCreated = op.name === OperationName.contractCreated;
    return isContractType || isContractCall || isContractCreated;
  });

  const { contractInfo } = useContractInfo(contractOp?.to?.address);

  const displayName = contractInfo?.name || title || 'Transaction';
  const displayImage = contractInfo?.image;

  return (
    <Box.Flex css={styles.contractHeader}>
      <Avatar size="sm" src={displayImage} name={displayName} />
      <span>{displayName}</span>
    </Box.Flex>
  );
}

const styles = {
  contractHeader: cssObj({
    display: 'flex',
    alignItems: 'center',
    gap: '$2',

    '& span': {
      fontSize: '$sm',
      fontWeight: '$medium',
    },
  }),
};
