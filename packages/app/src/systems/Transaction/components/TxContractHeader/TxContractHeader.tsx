import { cssObj } from '@fuel-ui/css';
import { Avatar, Box } from '@fuel-ui/react';
import { AddressType, OperationName } from 'fuels';
import type { Operation } from 'fuels';
import { useEffect, useState } from 'react';
import { getContractInfo } from '../../utils/getContractInfo';

type Props = {
  operations?: Operation[];
  title?: string;
};

export function TxContractHeader({ operations, title }: Props) {
  const [contractInfo, setContractInfo] = useState<{
    name: string;
    image: string;
  } | null>(null);

  useEffect(() => {
    async function fetchContractInfo() {
      if (!operations?.length) return;

      // Log operations for debugging
      console.log('Operations:', operations);

      const contractOp = operations.find((op) => {
        const isContractType = op.to?.type === AddressType.contract;
        const isContractCall = op.name === OperationName.contractCall;
        const isContractCreated = op.name === OperationName.contractCreated;

        return isContractType || isContractCall || isContractCreated;
      });

      if (contractOp?.to?.address) {
        const info = await getContractInfo(contractOp.to.address);
        console.log('Contract info:', info); // Debug log
        if (info) setContractInfo(info);
      }
    }

    fetchContractInfo();
  }, [operations]);

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
