import { cssObj } from '@fuel-ui/css';
import { Avatar, Box, Card, ContentLoader, Text } from '@fuel-ui/react';
import { Address, isB256, isBech32 } from 'fuels';
import { useAccounts } from '~/systems/Account';
import { type SimplifiedOperation, TxCategory } from '../../types';

export type TxOperationsSimpleProps = {
  operations?: SimplifiedOperation[];
  isLoading?: boolean;
};

export function TxOperationsSimple({
  operations,
  isLoading,
}: TxOperationsSimpleProps) {
  const { accounts } = useAccounts();
  if (isLoading) return <TxOperationsSimple.Loader />;

  return (
    <Card css={styles.operation}>
      <Box css={styles.content}>
        {operations?.map((operation, index) => {
          const isValidAddress =
            isB256(operation.from) || isBech32(operation.from);
          const fuelAddress = isValidAddress
            ? Address.fromString(operation.from).toString()
            : '';
          const name =
            accounts?.find((a) => a.address === fuelAddress)?.name || 'unknown';

          return (
            <Box
              key={
                operation.groupId ||
                `${operation.type}-${operation.from}-${operation.to}-${index}`
              }
              css={styles.info}
            >
              <Box css={styles.type}>
                <Avatar.Generated hash={operation.from} size={24} />
                <Text as="span" fontSize="sm">
                  {name}
                </Text>
              </Box>
              <Box css={styles.addresses}>
                <Text as="span" fontSize="sm">
                  From: {operation.from}
                </Text>
                <Text as="span" fontSize="sm">
                  To: {operation.to}
                </Text>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Card>
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
    padding: '$3',
  }),
  content: cssObj({
    display: 'flex',
    flexDirection: 'column',
    gap: '$3',
  }),
  info: cssObj({
    display: 'flex',
    flexDirection: 'column',
    gap: '$2',
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
};
