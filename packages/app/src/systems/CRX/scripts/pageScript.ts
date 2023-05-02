/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { injectFuel } from '@fuel-wallet/sdk';

import { WALLET_NAME } from '~/config';

injectFuel(window, { name: WALLET_NAME, logoUrl: 'mylogo' });
