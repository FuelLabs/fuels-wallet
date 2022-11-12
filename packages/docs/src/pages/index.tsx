import { cssObj } from '@fuel-ui/css';
import { Box } from '@fuel-ui/react';

import { Layout } from '../components/Layout';

export default function Home() {
  return (
    <Layout title="Home" isHome>
      <Box css={styles.root}>Hello world</Box>
    </Layout>
  );
}

const styles = {
  root: cssObj({
    px: '$10',
    py: '$8',
    gridColumn: '1 / 4',
  }),
};
