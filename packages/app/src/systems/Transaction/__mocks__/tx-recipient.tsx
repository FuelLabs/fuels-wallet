import { AddressType } from '@fuel-wallet/types';

export const MOCK_TX_RECIPIENT = {
  account: {
    address: 'fuel1glqzc3xu3xzxvd6slyclqepxx0tspgz5nccnrf2rjzserz87r4qqtekuj7',
    type: AddressType.account,
  },

  contract: {
    address: 'fuel1yal7nrhm4lpwuzjn8eq3qjlsk9366dwpsrpd5ns5q049g30kyp7qcey6wk',
    type: AddressType.contract,
  },
};
