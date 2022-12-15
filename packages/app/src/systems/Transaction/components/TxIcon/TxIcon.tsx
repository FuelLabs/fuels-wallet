import { cssObj } from '@fuel-ui/css';
import { Flex, Icon } from '@fuel-ui/react';
import { TransactionType } from '@fuel-wallet/types';

const getIcon = (type: TransactionType) => {
  switch (type) {
    case TransactionType.Send:
      return Icon.is('UploadSimple');
    case TransactionType.Receive:
      return Icon.is('DownloadSimple');
    case TransactionType.ContractCall:
      return Icon.is('ArrowsLeftRight');
    case TransactionType.Script:
      return Icon.is('MagicWand');
    case TransactionType.Predicate:
      return Icon.is('MagicWand');
    default:
      return 'ArrowRight';
  }
};

export type TxIconProps = {
  type: TransactionType;
  isLoading?: boolean;
};

export function TxIcon({ type, isLoading }: TxIconProps) {
  return (
    <Flex css={styles.root({ isLoading })}>
      {!isLoading ? <Icon icon={getIcon(type)} /> : null}
    </Flex>
  );
}

const styles = {
  root: ({ isLoading }: { isLoading?: boolean }) =>
    cssObj({
      alignItems: 'center',
      justifyContent: 'center',
      display: 'flex',
      ...(!isLoading && { backgroundColor: '$gray4' }),
      ...(isLoading && { backgroundColor: '$gray6' }),
      padding: '$2',
      height: '$6',
      width: '$6',
      borderRadius: '$full',
    }),
};
