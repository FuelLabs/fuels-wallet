import { render, screen } from '@fuel-ui/test-utils';
import { TestWrapper } from '~/systems/Core/components/TestWrapper';

import { ReceiverQRCode } from './QRCode';

const TEST_ACCOUNT =
  'fuel1auahknz6mjuu0am034mlggh55f0tgp9j7fkzrc6xl48zuy5zv7vqa07n30';

describe('QR Code Tests', () => {
  it('should show the qr code on screen', async () => {
    render(<ReceiverQRCode address={TEST_ACCOUNT} />, { wrapper: TestWrapper });
    const qrCode = screen.getByLabelText('qrcode');
    expect(qrCode).toBeInTheDocument();
  });

  it('should be a valid qr code showing on the screen', async () => {
    render(<ReceiverQRCode address={TEST_ACCOUNT} />, { wrapper: TestWrapper });
    const qrCode = screen.getByLabelText('qrcode');
    // Check if the qr code matchs the svg snapshot
    expect(qrCode).toMatchSnapshot();
  });
});
