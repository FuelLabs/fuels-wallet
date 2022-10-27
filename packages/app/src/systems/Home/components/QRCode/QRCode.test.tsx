import 'canvas';
import { render, screen } from '@fuel-ui/test-utils';
import jsQR from 'jsqr';

import { ReceiverQRCode } from './QRCode';

import { TestWrapper } from '~/systems/Core/components/TestWrapper';

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

    expect(qrCode).toBeInTheDocument();

    const svgData = new XMLSerializer().serializeToString(
      qrCode as HTMLElement
    );
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      const buffer = Buffer.from(pngFile, 'base64');

      const code = jsQR(
        buffer.buffer as Uint8ClampedArray,
        img.width,
        img.height
      );

      expect(code?.data).toBeDefined();
      expect(code?.data).toBe(TEST_ACCOUNT);
    };
    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
  });
});
