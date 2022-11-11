/* eslint-disable @typescript-eslint/no-explicit-any */
import { cssObj } from '@fuel-ui/css';
import { Box } from '@fuel-ui/react';
import Prism from 'prismjs';
import { useEffect } from 'react';

import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-jsx';

export function Pre(props: any) {
  useEffect(() => {
    Prism.highlightAll();
  }, []);

  return <Box as="pre" css={styles.root} {...props} />;
}

const styles = {
  root: cssObj({
    mb: '$6 !important',

    code: {
      padding: '$0',
    },
  }),
};
