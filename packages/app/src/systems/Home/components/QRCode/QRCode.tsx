import { Box, Button, Card, Flex, FuelLogo } from '@fuel-ui/react';
import QRCode from 'react-qr-code';

import { useAccount } from '~/systems/Account';

export function ReceiverQRCode() {
  const { account } = useAccount();

  return (
    <Card
      css={{
        p: '$4',
        gap: '$3',
        borderRadius: '$lg',
      }}
    >
      <Flex
        css={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box css={{ position: 'absolute' }}>
          <svg
            width="57"
            height="65"
            viewBox="0 0 57 65"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M28.9342 0.719192L0.578618 36.7645C0.25304 37.1783 0.304202 37.7738 0.695608 38.126L9.71477 46.2433C9.8984 46.4086 10.1367 46.5 10.3837 46.5H17.4939C18.2091 46.5 18.6931 47.2289 18.4156 47.8881L15.3052 55.2752C15.1261 55.7005 15.2613 56.1931 15.6324 56.4674L25.721 63.9242C26.1552 64.2451 26.7657 64.1634 27.1003 63.7397L55.8594 27.3114C56.2097 26.8677 56.1228 26.2221 55.6677 25.8867L47.2646 19.6949C47.0927 19.5683 46.8848 19.5 46.6714 19.5H38.8333C38.1667 19.5 37.6867 18.86 37.8733 18.22L40.7922 8.21229C40.9156 7.78929 40.7476 7.33538 40.3785 7.09468L30.2665 0.499865C29.8326 0.216913 29.2545 0.31209 28.9342 0.719192Z"
              fill="#1A1D1E"
            />
            <FuelLogo />
          </svg>
        </Box>

        <QRCode
          size={120}
          color="#9BA1A6"
          bgColor="transparent"
          fgColor="#9BA1A6"
          value={account?.publicKey as string}
        />
      </Flex>
      <Button variant="ghost" size="sm">
        Download this QR Code
      </Button>
    </Card>
  );
}
