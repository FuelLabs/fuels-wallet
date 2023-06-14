import { cssObj } from '@fuel-ui/css';
import { Box, Image, Text } from '@fuel-ui/react';

import img1 from '~public/pin-img1.svg';
import img2 from '~public/pin-img2.svg';

export function PinWalletText() {
  return (
    <Box.Stack css={styles.root}>
      <Text>Click the extension button in the browser menu.</Text>
      <Image src={img1} />
      <Text>Find Fuel Wallet in the list and click pin.</Text>
      <Image src={img2} />
    </Box.Stack>
  );
}

const styles = {
  root: cssObj({
    '.fuel_Text': {
      color: '$intentsBase8',
    },
    '.fuel_Text:last-of-type': {
      mt: '$4',
    },
  }),
};
