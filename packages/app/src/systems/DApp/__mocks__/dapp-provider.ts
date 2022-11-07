import { Provider } from 'fuels';

import { VITE_FUEL_PROVIDER_URL } from '~/config';

export const provider = new Provider(VITE_FUEL_PROVIDER_URL);
