import type { OriginDetailProps } from './OriginDetails';
import { OriginDetails } from './OriginDetails';

export default {
  component: OriginDetails,
  title: 'Core/Components/OriginDetails',
};

export const Usage = (args: OriginDetailProps) => <OriginDetails {...args} />;
Usage.args = {
  origin: 'https://netflix.com',
  title: 'Netflix | Watch TV Shows Online, Watch Movies Online',
  favicon:
    'https://s2.googleusercontent.com/s2/favicons?domain=netflix.com&sz=64',
  headerText: 'Request connection from:',
};
