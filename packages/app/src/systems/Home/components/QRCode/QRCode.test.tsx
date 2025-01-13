import { render, screen } from '@fuel-ui/test-utils';
import { TestWrapper } from '~/systems/Core/components/TestWrapper';

import { ReceiverQRCode } from './QRCode';

const TEST_ACCOUNT =
  '0xef3b7b4c5adcb9c7f76f8d77f422f4a25eb404b2f26c21e346fd4e2e12826798';

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
