import { cssObj } from '@fuel-ui/css';
import { Box, Button, Input, Link, Tag, Text } from '@fuel-ui/react';
import { useFuel, useIsConnected } from '@fuels/react';
import { useState } from 'react';
import { ExampleBox } from '~/src/components/ExampleBox';
import { useLoading } from '~/src/hooks/useLoading';

import SWAY_SWAP_ABI from '../data/swayswap/abi.json';
import { SWAY_SWAP_CONTRACT_ID } from '../data/swayswap/contractId';
import { docStyles } from '../styles';

export function AddAbi() {
  const { fuel } = useFuel();
  const { isConnected } = useIsConnected();
  const [abiError, setAbiError] = useState(false);
  const [abiSuccess, setAbiSuccess] = useState(false);
  const [contractId, setContractId] = useState<string>(SWAY_SWAP_CONTRACT_ID);
  const [abiString, setAbiString] = useState<string>(
    JSON.stringify(SWAY_SWAP_ABI, null, 2)
  );

  const [handleAddAbi, isAddingAbi, errorAddingAbi] = useLoading(
    async (contractId?: string, abiString?: string) => {
      if (!abiString || !contractId) return;

      try {
        const abi = JSON.parse(abiString);
        /* addABI:start */
        const isAdded = await fuel.addABI(contractId, abi);
        console.log('ABI is added', isAdded);
        /* addABI:end */
        setAbiError(false);
        setAbiSuccess(true);
      } catch (e) {
        console.error(e);
        setAbiError(true);
      }
    }
  );

  function handleChangeAbi(value: string) {
    try {
      const abi = JSON.parse(value);

      setAbiError(false);
      setAbiString(JSON.stringify(abi, null, 2));
    } catch (e) {
      setAbiString(value);
      console.error(e);
    }
  }

  return (
    <ExampleBox error={errorAddingAbi}>
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
            value={abiString}
            onChange={(e) => handleChangeAbi(e.target.value)}
            placeholder="Paste your ABI"
          />
        </Input>
        <Box.Stack gap="$4">
          {abiError && (
            <Box>
              <Tag
                size="xs"
                intent="error"
                variant="ghost"
                css={docStyles.feedbackTag}
              >
                Invalid ABI or contractId is already added
              </Tag>
            </Box>
          )}
          <Box.Flex>
            <Text>
              * Input&apos;s initial contractId and ABI are from &nbsp;
            </Text>
            <Link href="https://fuellabs.github.io/swayswap" isExternal>
              SwaySwap
            </Link>
          </Box.Flex>
          <Button
            onPress={() => handleAddAbi(contractId, abiString)}
            isLoading={isAddingAbi}
            isDisabled={isAddingAbi || !isConnected}
          >
            Add ABI
          </Button>
          {abiSuccess && (
            <Box>
              <Tag
                size="xs"
                intent="success"
                variant="ghost"
                css={docStyles.feedbackTag}
              >
                ABI added successfully
              </Tag>
            </Box>
          )}
        </Box.Stack>
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
      color: '$whiteA11',
      padding: '$2',
    },
  }),
};
