/* eslint-disable no-console */
import { cssObj } from '@fuel-ui/css';
import { Button, Box, Input } from '@fuel-ui/react';
import type { JsonFlatAbi } from 'fuels';
import { useState } from 'react';

import { ExampleBox } from '../src/components/ExampleBox';
import { useFuel } from '../src/hooks/useFuel';
import { useIsConnected } from '../src/hooks/useIsConnected';
import { useLoading } from '../src/hooks/useLoading';

export function Abi() {
  const [fuel, notDetected] = useFuel();
  const [isConnected] = useIsConnected();
  const [contractId, setContractId] = useState<string>();
  const [abi, setAbi] = useState<JsonFlatAbi>();
  const [handleGetAbi, isLoadingAbi, errorGetAbi] = useLoading(
    async (contractId: string | undefined) => {
      if (!contractId) return;
      if (!isConnected) await fuel.connect();
      console.log('Request the current abi');
      /* example:start */
      const abiInfo = await fuel.getAbi(contractId);
      console.log('Abi ', abiInfo);
      /* example:end */
      setAbi(abiInfo);
    }
  );

  const errorMessage = errorGetAbi || notDetected;

  return (
    <ExampleBox error={errorMessage}>
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
            {/* // TODO: change textarea to a proper fuel-ui component when it gets implemented */}
            <textarea
              defaultValue={JSON.stringify(abi, null, 2)}
              placeholder="Check ABI response"
              rows={20}
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
    height: 'auto',

    textarea: {
      width: '100%',
    },
  }),
};
