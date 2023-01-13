import type { OriginTagProps } from './OriginTag';
import { OriginTag } from './OriginTag';

export default {
  component: OriginTag,
  title: 'Core/Components/OriginTag',
};

export const Usage = (args: OriginTagProps) => <OriginTag {...args} />;
Usage.args = {
  origin: 'https://example.com',
};
