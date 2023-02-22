import type { OriginDetailProps } from './OriginDetails';
import { OriginDetails } from './OriginDetails';

export default {
  component: OriginDetails,
  title: 'Core/Components/OriginDetails',
};

export const Usage = (args: OriginDetailProps) => <OriginDetails {...args} />;
Usage.args = {
  origin: 'https://app.uniswap.org/#/swap',
  title: 'Uniswap Interface',
  favIconUrl: 'https://app.uniswap.org/favicon.png',
  headerText: 'Request connection from:',
};
