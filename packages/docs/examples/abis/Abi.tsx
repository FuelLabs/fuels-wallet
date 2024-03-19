import { cssObj } from '@fuel-ui/css';
import { Box, Button, Input } from '@fuel-ui/react';
import { useFuel, useIsConnected } from '@fuels/react';
import type { FuelABI } from 'fuels';
import { useState } from 'react';

import { ExampleBox } from '../../src/components/ExampleBox';
import { useLoading } from '../../src/hooks/useLoading';
import { SWAY_SWAP_CONTRACT_ID } from '../data/swayswap/contractId';

export function Abi() {
  const { fuel } = useFuel();
  const { isConnected } = useIsConnected();
  const [contractId, setContractId] = useState<string>(SWAY_SWAP_CONTRACT_ID);
  const [abi, setABI] = useState<FuelABI | null>(null);
  const [handleGetAbi, isLoadingAbi, errorGetAbi] = useLoading(
    async (contractId: string | undefined) => {
      if (!contractId) return;
      if (!isConnected) await fuel.connect();
      console.log('Request the current abi of contractId: ', contractId);
      /* getABI:start */
      const abiInfo = await fuel.getABI(contractId);
      console.log('Abi ', abiInfo);
      /* getABI:end */
      setABI(abiInfo);
    }
  );

  return (
    <ExampleBox error={errorGetAbi}>
      <Box.Stack css={styles.root}>
        <Input isDisabled={!isConnected} css={styles.input}>
          <Input.Field
            defaultValue={contractId}
            onBlur={(e) => setContractId(e.target.value)}
            placeholder="Type your contractId (0x...)"
          />
        </Input>
        <Button
          onPress={() => handleGetAbi(contractId)}
          isLoading={isLoadingAbi}
          isDisabled={isLoadingAbi || !fuel}
        >
          Get ABI
        </Button>
        {abi && (
          <Input isDisabled={!isConnected} css={styles.inputTextArea}>
            <Input.Field
              as="textarea"
              value={JSON.stringify(abi, null, 2)}
              placeholder="Check ABI response"
            />
          </Input>
        )}
      </Box.Stack>
    </ExampleBox>
  );
}

const styles = {
  root: cssObj({
    gap: '$2',
    display: 'inline-flex',
    alignItems: 'flex-start',

    '.fuel_tag': {
      justifyContent: 'flex-start',

      '& > p': {
        fontSize: '$xs',
      },
    },
  }),
  input: cssObj({
    width: '100%',
  }),
  inputTextArea: cssObj({
    width: '100%',
    height: 200,

    textarea: {
      width: '100%',
      color: '$whiteA11',
      padding: '$2',
    },
  }),
};
