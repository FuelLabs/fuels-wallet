import { Address, bn } from 'fuels';

import { MOCK_TRANSACTION_SCRIPT } from '../../__mocks__/transaction';
import type { Transaction } from '../../types';
import { TxStatus, TxType } from '../../types';
import type { TxItemProps } from '../ActivityItem';
import { ActivityItem } from '../ActivityItem';

import { ActivityListEmpty } from './ActivityListEmpty';

interface ActivityListProps {
  transactions: Transaction[];
  providerUrl?: string;
  isLoading?: boolean;
  isDevnet?: boolean;
}

const MOCK_PROPS: TxItemProps = {
  transaction: MOCK_TRANSACTION_SCRIPT,
  providerUrl: process.env.VITE_FUEL_PROVIDER_URL,
  from: new Address(
    'fuel18ey925p2l79q4sncvmkkk93ygcupjfhfxw9gtq6wuhh58vh2jsusj30acp'
  ),
  to: new Address(
    'fuel18ey925p2l79q4sncvmkkk93ygcupjfhfxw9gtq6wuhh58vh2jsusj30acp'
  ),
  amount: {
    amount: bn(100),
    symbol: 'ETH',
    name: 'Ethereum',
    assetId: '0x000000',
    imageUrl:
      'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
  },
  txType: TxType.PREDICATE,
  txStatus: TxStatus.SUCCESS,
  date: 'Jun 03',
};

export const ActivityList = ({
  transactions,
  providerUrl,
  isDevnet,
}: ActivityListProps) => {
  const isEmpty = !transactions || !transactions.length;

  if (isEmpty) return <ActivityList.Empty isDevnet={isDevnet} />;

  return (
    <div>
      {transactions.map((transaction) => (
        <ActivityItem
          key={transaction.id}
          transaction={transaction}
          providerUrl={providerUrl}
          amount={MOCK_PROPS.amount}
          from={MOCK_PROPS.from}
          to={MOCK_PROPS.to}
          txType={MOCK_PROPS.txType}
          txStatus={MOCK_PROPS.txStatus}
          date={MOCK_PROPS.date}
        />
      ))}
    </div>
  );
};

ActivityList.Empty = ActivityListEmpty;
