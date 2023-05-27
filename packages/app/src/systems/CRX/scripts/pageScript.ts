import { createConnector } from '@fuel-wallet/sdk';

import { WALLET_NAME } from '~/config';

createConnector({ name: WALLET_NAME });
