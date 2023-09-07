import { cssObj } from '@fuel-ui/css';
import { Box, Button, Card } from '@fuel-ui/react';
import { useCallback } from 'react';
import QRCode from 'react-qr-code';

type Props = {
  address: string;
};

export function ReceiverQRCode({ address }: Props) {
  const downloadQrCode = useCallback(() => {
    const svg = document.getElementById('qrcode-receive');
    const svgData = new XMLSerializer().serializeToString(svg as HTMLElement);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = 'QRCode';
      downloadLink.href = `${pngFile}`;
      downloadLink.click();
    };
    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
  }, []);

  return (
    <Card css={styles.card}>
      <Card.Body css={styles.qrWrapper}>
        <Box css={styles.qrcode}>
          <QRCode
            id="qrcode-receive"
            aria-label="qrcode"
            size={120}
            color="#000000"
            bgColor="#FFFFFF"
            fgColor="#000000"
            value={address}
          />
        </Box>
        <Button variant="ghost" onPress={downloadQrCode} size="sm">
          Download this QR Code
        </Button>
      </Card.Body>
    </Card>
  );
}

const styles = {
  qrcode: cssObj({
    backgroundColor: '$white',
    padding: '$2',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '$default',
  }),
  card: cssObj({
    borderRadius: '$default',
  }),
  qrWrapper: cssObj({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '$4',
    flexDirection: 'column',
  }),
};
