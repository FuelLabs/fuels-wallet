import { Box, Switch, Text, Tooltip } from '@fuel-ui/react';
import { useMemo, useState } from 'react';
import { useAccounts } from '~/systems/Account';
import type { CategorizedOperations, SimplifiedOperation } from '../../types';
import type { TxCategory } from '../../types';
import { TxOperationsGroup } from '../TxContent/TxOperationsSimple/TxOperationsGroup';
import { TxOperationsDrawer } from './TxOperationsDrawer';

type TxOperationsListProps = {
  operations: CategorizedOperations;
};

export function TxOperations({ operations }: TxOperationsListProps) {
  const { account } = useAccounts();
  const [showAllDepths, setShowAllDepths] = useState(false);

  // Filter operations based on the toggle state
  const mainOperationsToShow = useMemo(() => {
    return operations.mainOperations.filter(
      (operation) => showAllDepths || operation.metadata.depth === 0
    );
  }, [operations.mainOperations, showAllDepths]);

  const otherOperationsToShow = useMemo(() => {
    return operations.otherRootOperations.filter(
      (operation) => showAllDepths || operation.metadata.depth === 0
    );
  }, [operations.otherRootOperations, showAllDepths]);

  return (
    <Box.Stack gap="$2">
      <Box.Flex
        css={{
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '$2',
        }}
      >
        <Text>Operations</Text>
        <Tooltip content="Show nested operations">
          <Box.Flex
            css={{
              alignItems: 'center',
              gap: '$2',
            }}
          >
            <Text
              css={{
                fontSize: '$sm',
                color: 'gray10',
              }}
            >
              Show nested calls
            </Text>
            <Switch
              size="sm"
              checked={showAllDepths}
              onCheckedChange={setShowAllDepths}
              aria-label="Show nested operations"
            />
          </Box.Flex>
        </Tooltip>
      </Box.Flex>

      <TxOperationsDrawer operations={mainOperationsToShow} />

      <TxOperationsGroup
        title={`Operations not related to ${account?.name}`}
        operations={otherOperationsToShow}
        showNesting={false}
        numberLabel={`${operations.otherRootOperations.length}`}
      />
    </Box.Stack>
  );
}

TxOperations.Loader = function TxOperationsLoader() {
  return (
    <Box.Stack gap="$1">
      {[1, 2].map((i) => (
        <Box
          key={i}
          css={{
            height: '80px',
            backgroundColor: '$gray2',
            borderRadius: '$md',
            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          }}
        />
      ))}
    </Box.Stack>
  );
};
