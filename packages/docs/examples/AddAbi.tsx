/* eslint-disable no-console */
import { cssObj } from '@fuel-ui/css';
import { Input, Box, Button } from '@fuel-ui/react';
import type { JsonFlatAbi } from 'fuels';
import { useState } from 'react';

import type { AbiMap } from '~/../types/src';
import { ExampleBox } from '~/src/components/ExampleBox';
import { useFuel } from '~/src/hooks/useFuel';
import { useIsConnected } from '~/src/hooks/useIsConnected';
import { useLoading } from '~/src/hooks/useLoading';

export function AddAbi() {
  const [fuel, notDetected] = useFuel();
  const [isConnected] = useIsConnected();
  const [contractId, setContractId] = useState<string>('');
  const [abi, setAbi] = useState<JsonFlatAbi>();

  const [handleAddAbi, isAddingAbi, errorAddingAbi] = useLoading(
    async (contractId?: string, abi?: JsonFlatAbi) => {
      if (!abi || !contractId) return;
      /* example:start */
      const abiMap: AbiMap = {
        [contractId]: abi,
      };
      await fuel.addAbi(abiMap);
      /* example:end */
    }
  );

  const errorMessage = notDetected || errorAddingAbi;

  function handleChangeAbi(abi: string) {
    try {
      setAbi(JSON.parse(abi));
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <ExampleBox error={errorMessage}>
      <Box.Stack gap="$4">
        <Input isDisabled={!isConnected} css={styles.input}>
          <Input.Field
            defaultValue={contractId}
            onBlur={(e) => setContractId(e.target.value)}
            placeholder="Type your contractId (0x...)"
          />
        </Input>
        <Input isDisabled={!isConnected} css={styles.inputTextArea}>
          <Input.Field
            as="textarea"
            value={JSON.stringify(abi, null, 2)}
            onChange={(e) => handleChangeAbi(e.target.value)}
            placeholder="Paste your ABI"
            css={{ color: '$whiteA11', padding: '$2' }}
          />
        </Input>
        <Box>
          <Button
            onPress={() => handleAddAbi(contractId, abi)}
            isLoading={isAddingAbi}
            isDisabled={isAddingAbi || !isConnected}
          >
            Add ABI
          </Button>
        </Box>
      </Box.Stack>
    </ExampleBox>
  );
}

const styles = {
  input: cssObj({
    width: '100%',
  }),
  inputTextArea: cssObj({
    width: '100%',
    height: 200,

    textarea: {
      width: '100%',
    },
  }),
};
