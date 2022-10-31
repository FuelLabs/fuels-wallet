import { Box } from '@fuel-ui/react';

import { ReceiverQRCode } from './QRCode';

export default {
  component: ReceiverQRCode,
  title: 'Home/Components/QRCode',
};

export const Usage = () => (
  <Box css={{ width: 300 }}>
    <ReceiverQRCode address="fuel1auahknz6mjuu0am034mlggh55f0tgp9j7fkzrc6xl48zuy5zv7vqa07n30" />
  </Box>
);
