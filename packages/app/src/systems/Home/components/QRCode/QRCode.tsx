import { cssObj } from '@fuel-ui/css';
import { Button, Card, Flex } from '@fuel-ui/react';
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
      <Flex css={styles.qrWrapper}>
        <QRCode
          id="qrcode-receive"
          aria-label="qrcode"
          size={120}
          color="#9BA1A6"
          bgColor="transparent"
          fgColor="#9BA1A6"
          value={address}
        />
      </Flex>
      <Button onClick={downloadQrCode} variant="ghost" size="sm">
        Download this QR Code
      </Button>
    </Card>
  );
}

const styles = {
  card: cssObj({
    p: '24px',
    gap: '$3',
    borderRadius: '$lg',
  }),
  qrWrapper: cssObj({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }),
};
