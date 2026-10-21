import { cssObj, Avatar, Box, Button, Icon, Text } from '@fuel-wallet/ui';
import { Address } from 'fuels';
import { useCallback, useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import { useNavigate } from 'react-router-dom';
import { useAccounts } from '~/systems/Account';
import { Layout, MotionFlex, Pages, animations } from '~/systems/Core';

const QR_ID = 'qrcode-receive';

function downloadQrCode() {
  const svg = document.getElementById(QR_ID);
  const svgData = new XMLSerializer().serializeToString(svg as HTMLElement);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const img = new Image();
  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx?.drawImage(img, 0, 0);
    const downloadLink = document.createElement('a');
    downloadLink.download = 'QRCode';
    downloadLink.href = canvas.toDataURL('image/png');
    downloadLink.click();
  };
  img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
}

export function Receive() {
  const navigate = useNavigate();
  const { account } = useAccounts();
  const [copied, setCopied] = useState(false);
  const address = account?.address
    ? Address.fromDynamicInput(account.address).toChecksum()
    : undefined;

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(timer);
  }, [copied]);

  const copyAddress = useCallback(async () => {
    if (!address) return;
    await navigator.clipboard.writeText(address);
    setCopied(true);
  }, [address]);

  return (
    <Layout title="Receive">
      <Layout.TopBar onBack={() => navigate(Pages.wallet())} />
      <Layout.Content css={styles.content}>
        {address && (
          <MotionFlex {...animations.slideInTop()} css={styles.panel}>
            <Box css={styles.qrFrame}>
              <QRCode
                id={QR_ID}
                aria-label="qrcode"
                size={168}
                bgColor="#FFFFFF"
                fgColor="#000000"
                value={address}
              />
            </Box>
            <Box.Flex css={styles.account}>
              <Avatar.Generated hash={address} size="xsm" />
              <Text css={styles.name}>{account?.name}</Text>
            </Box.Flex>
            <Text aria-label="account-preview" css={styles.address}>
              {address}
            </Text>
            <Box.Flex css={styles.actions}>
              <Button
                size="sm"
                intent="primary"
                aria-label="copy-account"
                data-copied={copied}
                leftIcon={<Icon icon={copied ? 'Check' : 'Copy'} />}
                onPress={copyAddress}
              >
                {copied ? 'Copied' : 'Copy address'}
              </Button>
              <Button
                size="sm"
                variant="outlined"
                leftIcon={<Icon icon="Download" />}
                onPress={downloadQrCode}
              >
                Download QR
              </Button>
            </Box.Flex>
          </MotionFlex>
        )}
      </Layout.Content>
    </Layout>
  );
}

const styles = {
  content: cssObj({
    mt: '$4',
  }),
  panel: cssObj({
    flexDirection: 'column',
    alignItems: 'center',
    gap: '$3',
    p: '$5',
    background: '$cardBg',
    boxShadow: 'inset 0 0 0 1px var(--fuel-line)',
  }),
  /* White plate so the code scans in dark theme, with the brand's corner ticks. */
  qrFrame: cssObj({
    position: 'relative',
    display: 'flex',
    p: '12px',
    mb: '$2',
    background: '#FFFFFF',

    '&::before, &::after': {
      content: '""',
      position: 'absolute',
      width: 10,
      height: 10,
      borderColor: '$intentsPrimary9',
      borderStyle: 'solid',
    },
    '&::before': { top: -6, left: -6, borderWidth: '2px 0 0 2px' },
    '&::after': { bottom: -6, right: -6, borderWidth: '0 2px 2px 0' },
  }),
  account: cssObj({
    alignItems: 'center',
    gap: '$2',
  }),
  name: cssObj({
    color: '$textHigh',
    fontSize: '$sm',
    fontWeight: '$medium',
  }),
  address: cssObj({
    maxWidth: 260,
    fontFamily: '$mono',
    fontSize: '12px',
    lineHeight: '18px',
    color: '$textLow',
    textAlign: 'center',
    wordBreak: 'break-all',
  }),
  actions: cssObj({
    alignSelf: 'stretch',
    gap: '$2',
    mt: '$2',

    '& > button': { flex: 1 },
    '& .fuel_Icon': { transition: 'transform 200ms var(--fuel-ease-out)' },
    '& [data-copied="true"] .fuel_Icon': {
      animation: 'fuel-appear 200ms var(--fuel-ease-out)',
    },
  }),
};
